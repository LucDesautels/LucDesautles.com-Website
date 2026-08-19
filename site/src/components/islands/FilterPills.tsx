import { useEffect, useState } from "react";
import {
  FILTERS,
  FILTER_EVENT,
  ENG_PORTFOLIO_HREF,
  applyFilter,
  type FilterId,
} from "@/data/filters";

interface Props {
  /** Passed as a prop rather than imported from @/data/content — that module
   *  reads files with node:fs, which can't be bundled for the browser. */
  resumeHref: string;
}

export default function FilterPills({ resumeHref }: Props) {
  const [active, setActive] = useState<FilterId>("full");

  useEffect(() => {
    setActive((document.body.dataset.filter as FilterId) || "full");
    const onChange = (e: Event) => {
      setActive((e as CustomEvent).detail.filter);
    };
    window.addEventListener(FILTER_EVENT, onChange as EventListener);
    return () => window.removeEventListener(FILTER_EVENT, onChange as EventListener);
  }, []);

  return (
    <div className="filter-pills" role="group" aria-label="Content filter" data-rsec="filter">
      <span className="filter-pills__intro">Show me —</span>
      {FILTERS.map((f) => {
        const isActive = active === f.id;
        return (
          <button
            key={f.id}
            type="button"
            onClick={() => applyFilter(f.id)}
            aria-pressed={isActive}
            className={`pill${isActive ? " pill--filled" : ""}`}
          >
            {isActive ? f.selectedLabel : f.baseLabel}
          </button>
        );
      })}

      <a href={ENG_PORTFOLIO_HREF} className="pill pill--ghost">
        Engineering portfolio →
      </a>
      <a href={resumeHref} className="pill pill--ghost">
        ↓ Résumé
      </a>

      <style>{`
        .filter-pills {
          margin-top: 64px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .filter-pills__intro {
          font-family: var(--font-body);
          font-style: italic;
          color: var(--ink-dim);
          font-size: 15px;
          margin-right: 8px;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          background: rgba(26,23,20,0.04);
          border: 1px solid var(--rule);
          color: var(--ink);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          font-weight: 500;
          transition: background .15s, color .15s, border-color .15s;
          text-decoration: none;
        }
        .pill:hover { background: rgba(26,23,20,0.08); }
        .pill--filled {
          background: var(--accent);
          color: var(--accent-ink);
          border-color: var(--accent);
          font-weight: 600;
        }
        .pill--filled:hover { background: var(--accent); }
        .pill--ghost { text-decoration: none; }
      `}</style>
    </div>
  );
}
