import { useState } from "react";

interface Props {
  email: string;
}

export default function CopyEmailButton({ email }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(email);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy email to clipboard"
      style={{
        padding: "8px 14px",
        border: "2px solid var(--rule)",
        background: copied ? "var(--accent)" : "transparent",
        color: copied ? "var(--accent-ink)" : "var(--ink)",
        fontFamily: "var(--font-body)",
        fontSize: 13,
        fontWeight: 500,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        cursor: "pointer",
        transition: "background .2s, color .2s",
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="M3 7l9 6 9-6" />
      </svg>
      {copied ? "Copied!" : email}
    </button>
  );
}
