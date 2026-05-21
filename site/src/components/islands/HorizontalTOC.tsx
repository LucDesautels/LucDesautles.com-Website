import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { TocSection } from "@/data/content";

interface Props { sections: TocSection[]; }

// Per-tile vertical offsets — bigger range, deliberately erratic so tiles
// don't read as a baseline-aligned row. Pattern is deterministic for SSR.
const VERT_OFFSETS = [-220, 80, -100, 160, -260, 40, 120, -160, 200, -60, -180, 100];

// Per-tile size multipliers — some shrink, some grow. Layered with the per-
// section sizes from data so the original silhouettes still come through.
const SIZE_MUL = [1.0, 0.7, 1.25, 0.85, 1.15, 0.6, 1.3, 0.9, 0.75, 1.1];

// Horizontal gap between tiles within a section, and padding at section edges.
const TILE_GAP = 72;
const SECTION_PAD_X = 140;

// Lerp two #rrggbb hex colors. Returns an `rgb(r,g,b)` string so we can stuff
// it straight into CSS without re-parsing.
function lerpHex(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `rgb(${r},${g},${bl})`;
}

export default function HorizontalTOC({ sections }: Props) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const wavesRef = useRef<HTMLCanvasElement | null>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [outerHeight, setOuterHeight] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(false);

  // Measure on mount + on resize. Decide whether to enable the scroll-jack.
  useLayoutEffect(() => {
    const measure = () => {
      const strip = stripRef.current;
      if (!strip) return;
      const stripW = strip.scrollWidth;
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wantPin = !reduced && viewportW >= 900 && stripW > viewportW + 50;
      if (wantPin) {
        const maxTranslate = stripW - viewportW;
        setOuterHeight(viewportH + maxTranslate);
        setEnabled(true);
      } else {
        setOuterHeight(null);
        setEnabled(false);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stripRef.current) ro.observe(stripRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [sections]);

  // Scroll driver: sets strip translateX, sticky background color, dark/light
  // class, and an "enter" custom prop the tiles use to fade in.
  useEffect(() => {
    if (!enabled) {
      if (stripRef.current) {
        stripRef.current.style.transform = "";
        stripRef.current.style.removeProperty("--enter");
      }
      if (stickyRef.current) {
        stickyRef.current.style.backgroundColor = sections[0]?.tone ?? "";
        stickyRef.current.classList.remove("htoc__sticky--dark");
      }
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const outer = outerRef.current;
      const strip = stripRef.current;
      const sticky = stickyRef.current;
      if (!outer || !strip || !sticky) return;

      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const stripW = strip.scrollWidth;
      const maxTranslate = stripW - vw;

      // Two-phase scroll mapping:
      //   Phase 1 (entrance, vh of vertical scroll): the section is scrolling
      //     up into view. shift-x goes from +vw → 0, so the strip starts off
      //     the right edge of the viewport and the first tile lands at the
      //     left edge exactly as the sticky pins.
      //   Phase 2 (pin, maxTranslate of vertical scroll): shift-x goes from
      //     0 → -maxTranslate, the normal horizontal-pin behavior.
      const startY = outer.offsetTop - vh;
      const totalScroll = outer.offsetHeight; // vh + maxTranslate
      const scrolled = Math.min(Math.max(window.scrollY - startY, 0), totalScroll);

      let shiftX: number;
      if (scrolled <= vh) {
        // Entrance — speed is vw/vh (typically ~1.6x vertical scroll).
        const enterP = vh > 0 ? scrolled / vh : 1;
        shiftX = vw * (1 - enterP);
      } else {
        // Pin — 1:1 horizontal to vertical.
        const pinP = (scrolled - vh) / Math.max(1, maxTranslate);
        shiftX = -pinP * maxTranslate;
      }
      strip.style.setProperty("--shift-x", `${shiftX.toFixed(2)}px`);

      // Overall progress for the rail + opacity ramp.
      const p = totalScroll > 0 ? scrolled / totalScroll : 0;
      strip.style.setProperty("--enter", String(Math.min(1, p * 6.5)));
      setProgress(p);

      // Active section = whichever section's center is closest to the visible
      // center, in strip coordinates.
      const viewportCenter = -shiftX + vw / 2;
      const nodes = strip.querySelectorAll<HTMLDivElement>("[data-toc-section]");
      let best = 0;
      let bestDist = Infinity;
      nodes.forEach((n, idx) => {
        const mid = n.offsetLeft + n.offsetWidth / 2;
        const d = Math.abs(mid - viewportCenter);
        if (d < bestDist) { bestDist = d; best = idx; }
      });
      setActiveIdx(best);

      // Background color — blend tones based on which two section centers
      // the viewport center is between (uses actual section positions, not
      // an estimate, so the fade tracks the real section spacing).
      const centers = Array.from(nodes).map((n) => n.offsetLeft + n.offsetWidth / 2);
      let seg = 0;
      let t = 0;
      if (centers.length > 0) {
        if (viewportCenter <= centers[0]) {
          seg = 0; t = 0;
        } else if (viewportCenter >= centers[centers.length - 1]) {
          seg = centers.length - 1; t = 0;
        } else {
          for (let i = 0; i < centers.length - 1; i++) {
            if (viewportCenter >= centers[i] && viewportCenter <= centers[i + 1]) {
              seg = i;
              const span = centers[i + 1] - centers[i];
              t = span > 0 ? (viewportCenter - centers[i]) / span : 0;
              break;
            }
          }
        }
      }
      const c1 = sections[seg]?.tone ?? "#f1ede3";
      const c2 = sections[Math.min(seg + 1, sections.length - 1)]?.tone ?? c1;
      sticky.style.backgroundColor = lerpHex(c1, c2, t);

      // Dark text mode follows the dominant section.
      const dominantDark = !!sections[best]?.dark;
      sticky.classList.toggle("htoc__sticky--dark", dominantDark);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled, sections]);

  // Ambient wavy-line background for the section. The canvas is the first
  // child of .htoc__sticky, so it paints behind the tiles + labels (a true
  // background, not an overlay). Lines drift gently in place — they don't
  // scroll, since the section is pinned. Stroke colour follows the dominant
  // tone: pale lines on the dark Robotics section, dark ink elsewhere.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = wavesRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !sticky) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, DPR = 1;
    const resize = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = sticky.clientWidth;
      H = sticky.clientHeight || window.innerHeight;
      canvas.width = Math.floor(W * DPR);
      canvas.height = Math.floor(H * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(sticky);

    // Lines spaced down the section; shape comes from a shared 2D swell
    // field (matches the global WaveField) so they read as one ocean
    // surface seen from above rather than independent squiggles.
    const lineCfg = [
      { yRel: 0.14, amp: 28 },
      { yRel: 0.32, amp: 32 },
      { yRel: 0.50, amp: 26 },
      { yRel: 0.68, amp: 30 },
      { yRel: 0.86, amp: 24 },
    ];
    const waveField = (x: number, y: number, t: number): number => {
      const a = Math.sin(x * 0.0068 + y * 0.0021 - t * 0.00055);
      const b = Math.sin(x * 0.0115 - y * 0.0033 - t * 0.00082);
      const c = Math.sin(x * 0.0043 + y * 0.0012 - t * 0.00040);
      return a * 0.52 + b * 0.28 + c * 0.30;
    };

    let raf = 0;
    let alive = true;
    const draw = () => {
      if (!alive) return;
      const now = performance.now();
      const dark = sticky.classList.contains("htoc__sticky--dark");
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = dark ? "rgba(244,237,226,0.16)" : "rgba(26,23,20,0.10)";
      ctx.lineWidth = 1.6;
      const stepX = 8;
      for (const c of lineCfg) {
        const baseY = c.yRel * H;
        ctx.beginPath();
        for (let x = -20; x <= W + 20; x += stepX) {
          const y = baseY + c.amp * waveField(x, baseY, now);
          if (x === -20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onVis = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
      } else if (alive) {
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Click a rail label → solve for the scrollY that lands the section's left
  // edge at the viewport's left edge, then scroll there.
  const jumpTo = (i: number) => {
    const outer = outerRef.current;
    const strip = stripRef.current;
    if (!outer || !strip) return;
    if (!enabled) {
      const t = strip.querySelectorAll<HTMLDivElement>("[data-toc-section]")[i];
      t?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      return;
    }
    const target = strip.querySelectorAll<HTMLDivElement>("[data-toc-section]")[i];
    if (!target) return;

    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const stripW = strip.scrollWidth;
    const maxTranslate = Math.max(0, stripW - vw);

    // wantedShiftX clamped to the reachable range [-maxTranslate, +vw].
    const wantedShiftX = Math.max(-maxTranslate, Math.min(vw, -target.offsetLeft));
    const startY = outer.offsetTop - vh;

    let targetScrolled: number;
    if (wantedShiftX >= 0) {
      // Entrance phase: shiftX goes vw → 0 as scrolled goes 0 → vh.
      targetScrolled = vh * (1 - wantedShiftX / vw);
    } else {
      // Pin phase: shiftX = -(scrolled - vh) in 1:1.
      targetScrolled = vh + -wantedShiftX;
    }
    window.scrollTo({ top: startY + targetScrolled, behavior: "smooth" });
  };

  const stripHeight = 880; // strip viewport height inside the pin

  return (
    <section
      ref={outerRef}
      className={`htoc${enabled ? " htoc--pinned" : ""}`}
      style={outerHeight ? { height: outerHeight } : undefined}
      aria-label="Field log — scroll to explore"
    >
      <div ref={stickyRef} className="htoc__sticky" style={{ backgroundColor: sections[0]?.tone }}>
        {/* Ambient wave background — first child so it paints behind the
            tiles and labels rather than over them. */}
        <canvas ref={wavesRef} className="htoc__waves" aria-hidden="true" />

        {/* Top-left small section label */}
        <div className="htoc__corner">
          <span className="htoc__corner-mark">§ 01</span>
          <span className="htoc__corner-label">Table of contents</span>
        </div>

        {/* The horizontal viewport — the strip translates inside it. */}
        <div className="htoc__viewport">
          <div
            ref={stripRef}
            className="htoc__strip"
            style={{ height: stripHeight }}
          >
            {sections.map((sec, si) => (
              <div
                key={sec.id}
                data-toc-section
                className="htoc__section"
                style={{
                  padding: `0 ${SECTION_PAD_X}px`,
                  gap: `${TILE_GAP}px`,
                }}
              >
                <div className="htoc__vlabel">{sec.label}.</div>
                {sec.items.map((it, ii) => {
                  const off = VERT_OFFSETS[(si * 5 + ii) % VERT_OFFSETS.length];
                  const mul = SIZE_MUL[(si * 3 + ii) % SIZE_MUL.length];
                  const rotate = ii % 2 === 0 ? -1 + ii * 0.4 : 0.8 + ii * 0.3;
                  const w = Math.round(it.w * mul);
                  const h = Math.round(it.h * mul);
                  return (
                    <div
                      key={ii}
                      className="htoc__tile"
                      style={{
                        width: w,
                        height: h,
                        transform: `translateY(${off}px) rotate(${rotate.toFixed(2)}deg)`,
                      }}
                    >
                      <div className="placeholder placeholder--frame" style={{ width: "100%", height: "100%" }}>
                        <div className="placeholder__label">[ {it.tag} · {it.label.toUpperCase()} ]</div>
                      </div>
                      <div className="htoc__tile-cap">/ {it.tag}</div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom rail — orange fill + section labels overlaid on top + counter. */}
        <div className="htoc__rail-wrap">
          <div className="htoc__rail">
            <div
              className="htoc__rail-fill"
              style={{ width: `${Math.max(2, progress * 100).toFixed(1)}%` }}
            />
            <div className="htoc__rail-labels">
              {sections.map((sec, i) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className={`htoc__rail-label${i === activeIdx ? " htoc__rail-label--active" : ""}`}
                  style={{ left: `${((i + 0.5) / sections.length) * 100}%` }}
                  aria-current={i === activeIdx ? "true" : undefined}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>
          <div className="htoc__counter">
            {String(activeIdx + 1).padStart(2, "0")} / {String(sections.length).padStart(2, "0")}
          </div>
        </div>
      </div>

      <style>{`
        .htoc {
          position: relative;
          /* Outer container has no background — the sticky inside owns the
             color and fades it as scroll progresses. */
        }
        .htoc__sticky {
          display: flex;
          flex-direction: column;
          /* Background color set inline by JS; CSS handles the fade smoothness
             when transitions kick in (e.g. on first paint, reduced motion). */
          transition: background-color .35s ease;
          color: var(--ink);
        }
        .htoc__sticky--dark { color: var(--dark-ink); }
        .htoc__sticky--dark .htoc__corner-mark,
        .htoc__sticky--dark .htoc__corner-label { color: var(--dark-mute); }
        .htoc__sticky--dark .htoc__vlabel { color: var(--dark-ink); }
        .htoc__sticky--dark .htoc__tile-cap { color: var(--dark-mute); }
        .htoc__sticky--dark .htoc__counter { color: var(--dark-dim); }
        .htoc__sticky--dark .htoc__rail { background: rgba(255,255,255,0.10); }
        .htoc__sticky--dark .htoc__rail-label { color: var(--dark-dim); }
        .htoc__sticky--dark .htoc__rail-label--active { color: var(--dark-ink); }

        .htoc--pinned .htoc__sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }

        /* Ambient wave background — absolutely positioned, first child, so it
           sits behind .htoc__viewport (tiles), .htoc__corner and the rail. */
        .htoc__waves {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* Top-left tiny label */
        .htoc__corner {
          position: absolute;
          top: calc(var(--topbar-h) + 18px);
          left: var(--page-pad);
          z-index: 4;
          display: flex;
          align-items: baseline;
          gap: 10px;
          pointer-events: none;
        }
        .htoc__corner-mark,
        .htoc__corner-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.22em;
          color: var(--ink-mute);
          text-transform: uppercase;
          transition: color .35s ease;
        }
        .htoc__corner-mark { color: var(--accent); font-weight: 600; }

        /* The horizontal viewport — clips the translating strip. */
        .htoc__viewport {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .htoc__strip {
          display: inline-flex;
          align-items: center;
          will-change: transform, opacity;
          /* JS sets --shift-x (px) and --enter (0..1). Horizontal motion runs
             throughout the section's scroll, so the entrance is mostly the
             quick opacity ramp + a small upward slide. */
          transform: translate3d(var(--shift-x, 0px), calc((1 - var(--enter, 0)) * 40px), 0);
          opacity: var(--enter, 0);
        }

        .htoc__section {
          display: inline-flex;
          align-items: center;
          height: 100%;
          position: relative;
          flex: 0 0 auto;
        }
        .htoc__vlabel {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          margin-right: 28px;
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 500;
          font-style: italic;
          color: var(--ink);
          letter-spacing: -0.01em;
          line-height: 0.95;
          white-space: nowrap;
          transition: color .35s ease;
        }
        .htoc__tile {
          position: relative;
          flex: 0 0 auto;
        }
        .htoc__tile-cap {
          position: absolute;
          left: 6px;
          bottom: -26px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          color: var(--ink-mute);
          text-transform: uppercase;
          white-space: nowrap;
          transition: color .35s ease;
        }

        /* Bottom rail with overlaid labels */
        .htoc__rail-wrap {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 36px;
          padding: 0 var(--page-pad);
          display: flex;
          gap: 16px;
          align-items: center;
          z-index: 3;
        }
        .htoc__rail {
          flex: 1;
          position: relative;
          height: 36px;
          background: rgba(26,23,20,0.10);
          transition: background-color .35s ease;
        }
        .htoc__rail-fill {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: var(--accent);
          transition: width .12s linear;
        }
        .htoc__rail-labels {
          position: absolute;
          inset: 0;
        }
        .htoc__rail-label {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          background: transparent;
          border: 0;
          padding: 4px 10px;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink);
          white-space: nowrap;
          transition: color .35s ease, font-weight .15s;
          font-weight: 500;
          mix-blend-mode: normal;
        }
        .htoc__rail-label:hover { color: var(--accent); }
        .htoc__rail-label--active {
          color: var(--accent-ink);
          font-weight: 700;
        }
        .htoc__counter {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--ink);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          padding: 4px 8px;
          transition: color .35s ease;
        }

        /* Non-pinned fallback (mobile / reduced motion) */
        .htoc:not(.htoc--pinned) .htoc__viewport {
          overflow-x: auto;
          overflow-y: hidden;
          scroll-snap-type: x mandatory;
        }
        .htoc:not(.htoc--pinned) .htoc__strip {
          transform: none;
          opacity: 1;
        }
        .htoc:not(.htoc--pinned) .htoc__section { scroll-snap-align: start; }
      `}</style>
    </section>
  );
}
