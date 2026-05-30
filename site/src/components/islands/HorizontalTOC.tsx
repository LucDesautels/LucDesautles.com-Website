import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { TocSection } from "@/data/content";

interface Props { sections: TocSection[]; }

// Cross-component channel — the global WaveField reads from this every frame
// to slide its wave pattern with the horizontal scroll and to colour-shift
// the lines as the dominant section tone darkens. We never *create* this on
// the wave-field side; it's populated here as soon as the section mounts.
type WfState = {
  htocShiftX: number;
  htocActive: number;
  htocDarkness: number;
  htocBounds: { top: number; bottom: number } | null;
  // The htoc converts vertical scroll into horizontal strip motion while
  // it's pinned, so naive yDoc - scrollY positioning would keep dragging
  // the wave field upward while the user is "scrolling horizontally."
  //
  // htocPinOffset is the cumulative scroll distance the user has spent
  // *inside* the pin range. The WaveField subtracts it from realScrollY
  // every frame:
  //   0 before the pin (effectiveScrollY = realScrollY, normal)
  //   grows linearly 0 → maxTranslate during the pin (effective stays
  //     at pinStartY → waves freeze vertically)
  //   stays at maxTranslate after the pin (effective = realScrollY -
  //     maxTranslate → wave field continues smoothly from where it was
  //     frozen, with no snap)
  htocPinOffset: number;
};
function publishWfState(patch: Partial<WfState>) {
  const w = window as any;
  const cur = (w.__wfState ?? {}) as WfState;
  w.__wfState = { ...cur, ...patch };
}

// Relative luminance (0..1) of an "rgb(r,g,b)" or "#rrggbb" colour. Used to
// translate the section tone into a darkness factor for the wave stroke.
function luminanceOf(c: string): number {
  let r = 0, g = 0, b = 0;
  if (c.startsWith("#")) {
    r = parseInt(c.slice(1, 3), 16);
    g = parseInt(c.slice(3, 5), 16);
    b = parseInt(c.slice(5, 7), 16);
  } else {
    const m = c.match(/(\d+(?:\.\d+)?)/g);
    if (!m || m.length < 3) return 1;
    r = +m[0]; g = +m[1]; b = +m[2];
  }
  // ITU-R BT.601 luma — good enough for "is this background dark?"
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

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

type RailVariant =
  | "fat-fixed"
  | "thin-fixed"
  | "line-thread"
  | "active-text"
  | "cumulative-text";

export default function HorizontalTOC({ sections }: Props) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const railRef = useRef<HTMLDivElement | null>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [outerHeight, setOuterHeight] = useState<number | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [railVariant, setRailVariant] = useState<RailVariant>("fat-fixed");

  // The bottom rail's progress used to live in React state, which forced a
  // re-render every scroll frame and then queued a CSS width transition on
  // top of that. Result: the orange fill catch-up was visibly behind the
  // scroll and stuttered in steps. We now write progress directly onto a
  // CSS custom property on the rail element each scroll frame — no React
  // re-render, no CSS transition — so the fill stays in lockstep.
  const setRailProgress = (p: number) => {
    railRef.current?.style.setProperty("--rail-p", p.toFixed(4));
  };

  // Pick the rail variant from the live WaveTuner config (window.__wfConfig
  // .rail.variant). Updates fire only when the user toggles it, so there
  // is no per-frame React cost.
  useEffect(() => {
    const pick = () => {
      const v = (window as any).__wfConfig?.rail?.variant as RailVariant | undefined;
      if (v) setRailVariant(v);
    };
    pick();
    const handler = (e: Event) => {
      const k = (e as CustomEvent).detail?.key as string | undefined;
      if (k === "rail.variant" || k === "__init") pick();
    };
    window.addEventListener("wf-config-change", handler);
    return () => window.removeEventListener("wf-config-change", handler);
  }, []);

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
  // class, an "enter" custom prop the tiles use to fade in, and publishes
  // window.__wfState for the global WaveField to read.
  useEffect(() => {
    if (!enabled) {
      if (stripRef.current) {
        stripRef.current.style.transform = "";
        stripRef.current.style.removeProperty("--enter");
      }
      setRailProgress(0);
      if (stickyRef.current) {
        stickyRef.current.style.backgroundColor = sections[0]?.tone ?? "";
        stickyRef.current.classList.remove("htoc__sticky--dark");
      }
      publishWfState({
        htocShiftX: 0, htocActive: 0, htocDarkness: 0, htocBounds: null,
        htocPinOffset: 0,
      });
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

      // Overall progress for the rail + opacity ramp. The rail subscribes
      // via a CSS custom property (no React re-render, no width transition)
      // so it tracks the scroll in real time without queuing catch-up frames.
      const p = totalScroll > 0 ? scrolled / totalScroll : 0;
      strip.style.setProperty("--enter", String(Math.min(1, p * 6.5)));
      setRailProgress(p);

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
      const lerped = lerpHex(c1, c2, t);
      sticky.style.backgroundColor = lerped;

      // Dark text mode follows the dominant section.
      const dominantDark = !!sections[best]?.dark;
      sticky.classList.toggle("htoc__sticky--dark", dominantDark);

      // ── Publish state for the global WaveField ────────────────────
      // htocActive ramps 0→1 around the sticky region so the wave shift
      // and the tone-darkness influence fade in smoothly rather than
      // popping the moment the section appears.
      const r = sticky.getBoundingClientRect();
      const inView = Math.max(0, Math.min(vh, r.bottom)) - Math.max(0, r.top);
      const active = Math.max(0, Math.min(1, inView / vh));
      // 1 - luminance ⇒ darkness factor. Dark backgrounds (Robotics) → 1;
      // cream backgrounds → ~0. The WaveField does its own smoothstep on
      // top of this, so we just hand off the raw value.
      const darkness = 1 - luminanceOf(lerped);

      // Vertical-scroll freeze: while the sticky is pinned the user is
      // actually scrolling vertically but visually it should read as
      // *horizontal* motion. pinOffset is the accumulated scroll the
      // user has spent inside the pin range — clamped to [0, maxTranslate].
      // The WaveField uses effectiveScrollY = realScrollY - pinOffset, so
      // during pin the effective value stays at pinStartY (waves freeze),
      // and after pin it tracks realScrollY again with the pin period
      // subtracted (no snap at the exit boundary).
      const pinStartY = outer.offsetTop;
      const pinOffset = Math.max(0, Math.min(maxTranslate, window.scrollY - pinStartY));

      publishWfState({
        htocShiftX: shiftX,
        htocActive: active,
        htocDarkness: darkness * active, // only count darkness while on-screen
        htocBounds: { top: r.top, bottom: r.bottom },
        htocPinOffset: pinOffset,
      });
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

  // (No internal wave canvas — the global WaveField now paints across this
  // section too, driven by the wfState we publish from the scroll effect.)

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
        {/* (Wave background now comes from the global WaveField — no local canvas.) */}

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

        {/* Bottom rail — one of five variants picked from the WaveTuner.
            Progress comes from a CSS custom property (--rail-p) set in the
            scroll RAF, so the fill paints in lockstep with the scroll. */}
        <div
          ref={railRef}
          className={`htoc__rail-wrap htoc__rail-wrap--${railVariant}`}
        >
          {(railVariant === "fat-fixed" || railVariant === "thin-fixed") && (
            <div className="htoc__rail">
              <div className="htoc__rail-fill" />
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
          )}

          {railVariant === "line-thread" && (
            // Inline-flex row of labels separated by line segments. A second,
            // identical row sits on top in accent colour, clipped from the
            // left by inset(0 (1-p)*100% 0 0) — so as the user scrolls, the
            // accent layer wipes over the muted layer continuously, filling
            // both the line segments and the text in a single sweep.
            <div className="htoc__thread">
              <div className="htoc__thread-row htoc__thread-row--muted">
                {sections.map((sec, i) => (
                  <React.Fragment key={sec.id}>
                    {i > 0 && <span className="htoc__thread-seg" aria-hidden="true" />}
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      className="htoc__thread-lbl"
                      aria-current={i === activeIdx ? "true" : undefined}
                    >
                      {sec.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <div className="htoc__thread-row htoc__thread-row--accent" aria-hidden="true">
                {sections.map((sec, i) => (
                  <React.Fragment key={sec.id}>
                    {i > 0 && <span className="htoc__thread-seg" />}
                    <span className="htoc__thread-lbl">{sec.label}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {railVariant === "active-text" && (
            <div className="htoc__textrail">
              {sections.map((sec, i) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className={`htoc__textrail-lbl${i === activeIdx ? " is-active" : ""}`}
                  aria-current={i === activeIdx ? "true" : undefined}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          )}

          {railVariant === "cumulative-text" && (
            <div className="htoc__textrail htoc__textrail--cumulative">
              {sections.map((sec, i) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className={`htoc__textrail-lbl${i <= activeIdx ? " is-passed" : ""}${i === activeIdx ? " is-active" : ""}`}
                  aria-current={i === activeIdx ? "true" : undefined}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          )}

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

        /* (Removed: .htoc__waves — waves now come from the global WaveField.) */

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
          /* JS sets --shift-x (px) and --enter (0..1). Horizontal motion
             runs throughout the whole section scroll, so the entrance is
             mostly the quick opacity ramp + a small upward slide. */
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

        /* ── Bottom rail ────────────────────────────────────────────────
           One container, five variant skins. Progress comes from --rail-p
           (0..1) which the scroll RAF writes to the wrap element directly,
           so the fill paints in lockstep with the scroll. No CSS width
           transitions anywhere — those queue catch-up frames and made the
           old rail visibly lag and step. */
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

        /* ▸ Variant A — fat bar (current style, lag-free) */
        .htoc__rail-wrap--fat-fixed .htoc__rail {
          flex: 1;
          position: relative;
          height: 36px;
          background: rgba(26,23,20,0.10);
          transition: background-color .35s ease;
        }
        /* ▸ Variant B — thin bar, centered, narrower */
        .htoc__rail-wrap--thin-fixed { justify-content: center; }
        .htoc__rail-wrap--thin-fixed .htoc__rail {
          flex: 0 1 min(720px, 80%);
          position: relative;
          height: 6px;
          border-radius: 3px;
          background: rgba(26,23,20,0.12);
          transition: background-color .35s ease;
        }
        .htoc__rail-wrap--thin-fixed .htoc__rail-fill { border-radius: inherit; }
        .htoc__rail-wrap--thin-fixed .htoc__rail-label {
          /* Move labels off the thin bar so they don't overlap a 6px strip. */
          top: -22px;
          font-size: 10px;
          padding: 2px 6px;
        }

        /* Shared fill — width comes from --rail-p, no transition. */
        .htoc__rail-fill {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background: var(--accent);
          width: calc(max(var(--rail-p, 0), 0.02) * 100%);
          transition: none;
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

        /* ▸ Variant C — line + text fills L→R.
           Two stacked rows: muted (always visible) and accent (clipped from
           the right by inset(0 (1-p)*100% 0 0)). The accent layer wipes over
           the muted one as scroll progresses, sweeping a single orange tide
           across both the line segments and the text in one continuous pass. */
        .htoc__rail-wrap--line-thread { padding: 0 var(--page-pad); }
        .htoc__thread {
          flex: 1;
          position: relative;
          height: 28px;
        }
        .htoc__thread-row {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          white-space: nowrap;
        }
        .htoc__thread-row--muted { color: var(--ink-mute); }
        .htoc__thread-row--accent {
          color: var(--accent);
          pointer-events: none;
          /* Wipe-from-left clip driven by --rail-p. */
          clip-path: inset(0 calc((1 - var(--rail-p, 0)) * 100%) 0 0);
          -webkit-clip-path: inset(0 calc((1 - var(--rail-p, 0)) * 100%) 0 0);
        }
        .htoc__thread-row--accent .htoc__thread-seg { background: var(--accent); }
        .htoc__thread-row--muted  .htoc__thread-seg { background: rgba(26,23,20,0.18); }
        .htoc__thread-seg {
          flex: 1;
          height: 1px;
          min-width: 24px;
        }
        .htoc__thread-lbl {
          flex: 0 0 auto;
          background: transparent;
          border: 0;
          padding: 4px 10px;
          cursor: pointer;
          color: inherit;
          font: inherit;
          letter-spacing: inherit;
          text-transform: inherit;
        }
        .htoc__thread-row--muted .htoc__thread-lbl:hover { color: var(--accent); }

        /* ▸ Variants D & E — text-only rails.
           D (active-text):     only the current label is in accent.
           E (cumulative-text): every label up to and including the current
                                one is in accent, painted in section steps. */
        .htoc__textrail {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 4px;
        }
        .htoc__textrail-lbl {
          flex: 0 1 auto;
          background: transparent;
          border: 0;
          padding: 4px 10px;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 500;
          color: var(--ink-mute);
          white-space: nowrap;
          transition: color .2s ease, font-weight .15s;
        }
        .htoc__textrail-lbl:hover { color: var(--accent); }
        .htoc__textrail-lbl.is-active { color: var(--accent); font-weight: 700; }
        .htoc__textrail--cumulative .htoc__textrail-lbl.is-passed { color: var(--accent); }
        .htoc__textrail--cumulative .htoc__textrail-lbl.is-active { font-weight: 700; }

        /* Dark-section variants of the new rails. The active / passed
           selectors carry the same class-count as the dark override, so
           they need to come AFTER it to win — they're declared here in
           the right order. */
        .htoc__sticky--dark .htoc__thread-row--muted { color: var(--dark-mute); }
        .htoc__sticky--dark .htoc__thread-row--muted .htoc__thread-seg { background: rgba(255,255,255,0.18); }
        .htoc__sticky--dark .htoc__textrail-lbl { color: var(--dark-mute); }
        .htoc__sticky--dark .htoc__textrail-lbl.is-active { color: var(--accent); }
        .htoc__sticky--dark .htoc__textrail--cumulative .htoc__textrail-lbl.is-passed { color: var(--accent); }
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
