import { useEffect, useRef, useState } from "react";
import { copyText } from "../../lib/copy";
import { decodeObf, mailtoHref } from "../../lib/contact";
import "./CopyEmailButton.css";

interface Props {
  /** reversed + base64 — see lib/contact.ts */
  emailObf: string;
  /** Same-length placeholder shown until the address is decoded in the browser. */
  mask: string;
  contactHref?: string;
}

type CopyState = "idle" | "ok" | "fail";

export default function CopyEmailButton({ emailObf, mask, contactHref = "/contact" }: Props) {
  const [addr, setAddr] = useState("");
  const [copy, setCopy] = useState<CopyState>("idle");
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  // Decode client-side only, so the plain address is never in the served HTML.
  useEffect(() => {
    try {
      setAddr(decodeObf(emailObf));
    } catch {
      /* keep the mask */
    }
    return () => window.clearTimeout(timer.current);
  }, [emailObf]);

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!addr) return;
    const ok = await copyText(addr);
    setCopy(ok ? "ok" : "fail");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopy("idle"), 1800);
  };

  const label = copy === "ok" ? "Copied." : copy === "fail" ? "Press Ctrl+C" : addr || mask;

  return (
    <div
      className={`ceb${open ? " ceb--open" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        type="button"
        className={`ceb__btn${copy === "ok" ? " ceb__btn--ok" : ""}`}
        onClick={handleCopy}
        aria-haspopup="true"
        aria-expanded={open}
        title="Copy email to clipboard"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <path d="M3 7l9 6 9-6" />
        </svg>
        {label}
      </button>

      <div className="ceb__menu">
        <div className="ceb__menu-in" role="group" aria-label="Contact options">
          <a className="ceb__item" href={addr ? mailtoHref(addr) : undefined}>
            Create draft email
            <span aria-hidden="true">↗</span>
          </a>
          <a className="ceb__item" href={contactHref}>
            Get in contact
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
