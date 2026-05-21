import { useEffect, useState } from "react";
import {
  FILTERS,
  FILTER_EVENT,
  applyFilter,
  type FilterId,
} from "@/data/filters";

// Sticky bottom-right widget. Hidden when filter === "full". Shows what's
// currently being filtered and lets the user clear or switch.
export default function FilterIndicator() {
  const [active, setActive] = useState<FilterId>("full");

  useEffect(() => {
    setActive((document.body.dataset.filter as FilterId) || "full");
    const onChange = (e: Event) => {
      setActive((e as CustomEvent).detail.filter);
    };
    window.addEventListener(FILTER_EVENT, onChange as EventListener);
    return () => window.removeEventListener(FILTER_EVENT, onChange as EventListener);
  }, []);

  if (active === "full") return null;

  const current = FILTERS.find((f) => f.id === active);
  if (!current) return null;
  const others = FILTERS.filter((f) => f.id !== active);

  return (
    <aside className="filter-ind" role="region" aria-label="Active filter">
      <div className="filter-ind__head">
        <span className="filter-ind__dot" aria-hidden="true"></span>
        Filter active
      </div>
      <div className="filter-ind__name">{current.selectedLabel}</div>
      <div className="filter-ind__desc">
        You're only seeing {current.description}
      </div>

      <div className="filter-ind__switch">
        <div className="filter-ind__switch-label">Change filter</div>
        <div className="filter-ind__switch-row">
          {others.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => applyFilter(f.id)}
              className={
                "filter-ind__chip" + (f.id === "full" ? " filter-ind__chip--primary" : "")
              }
            >
              {f.id === "full" ? "Show full picture" : f.shortLabel}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .filter-ind {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 60;
          width: min(360px, calc(100vw - 40px));
          padding: 16px 18px 14px;
          background: var(--ink);
          color: var(--bg);
          box-shadow: 0 22px 50px rgba(0,0,0,0.28);
          border-left: 3px solid var(--accent);
          font-family: var(--font-body);
          animation: filter-ind-in .25s ease both;
        }
        @keyframes filter-ind-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .filter-ind__head {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .filter-ind__dot {
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 999px;
          animation: filter-ind-pulse 1.6s ease-in-out infinite;
        }
        @keyframes filter-ind-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .filter-ind__name {
          font-family: var(--font-display);
          font-size: 22px;
          font-weight: 500;
          letter-spacing: -0.01em;
          margin: 6px 0 6px;
          line-height: 1.1;
        }
        .filter-ind__desc {
          font-size: 13px;
          color: rgba(244, 237, 226, 0.72);
          line-height: 1.45;
        }
        .filter-ind__switch {
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid rgba(255,255,255,0.12);
        }
        .filter-ind__switch-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(244, 237, 226, 0.55);
          margin-bottom: 8px;
        }
        .filter-ind__switch-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .filter-ind__chip {
          padding: 6px 10px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--bg);
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          cursor: pointer;
          transition: background .15s, border-color .15s, color .15s;
        }
        .filter-ind__chip:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.5);
        }
        .filter-ind__chip--primary {
          background: var(--accent);
          border-color: var(--accent);
          color: var(--accent-ink);
          font-weight: 600;
          padding: 6px 12px;
        }
        .filter-ind__chip--primary:hover {
          background: #c45a26;
          border-color: #c45a26;
        }
        @media (max-width: 640px) {
          .filter-ind {
            left: 12px;
            right: 12px;
            bottom: 12px;
            width: auto;
          }
        }
      `}</style>
    </aside>
  );
}
