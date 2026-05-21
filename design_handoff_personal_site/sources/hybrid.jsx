// Hybrid system — shared components for the cream-Lando + dark-telemetry build.
// Accepts a `T` (theme tokens) prop so V1 (orange) and V2 (orange + blue trim)
// can share everything below.

// Default theme (V1 — Clean Hybrid).
const HY_DEFAULT = {
  // Cream side
  bg: "#f1ede3",
  bgWarm: "#e9e4d6",
  ink: "#1a1714",
  inkDim: "#5f5a51",
  inkMute: "#8d877b",
  rule: "rgba(26,23,20,0.14)",
  ruleSoft: "rgba(26,23,20,0.08)",
  accent: "#d96a36", // sailfish orange
  accentInk: "#ffffff",
  trim: "#d96a36", // small "trim" on cream — orange in V1, blue in V2
  // Dark side (telemetry)
  dark: "#161412",
  darkPanel: "rgba(255,255,255,0.025)",
  darkInk: "#f4ede2",
  darkDim: "#a8a097",
  darkMute: "#6f675e",
  darkLine: "rgba(255,255,255,0.10)",
  darkLineSoft: "rgba(255,255,255,0.06)",
  // Sizing
  baseFont: 16,
  displayScale: 1.0,
  density: 1.0, // multiplies vertical padding
  // Standout treatment
  standoutStyle: "filled" // 'filled' | 'tab' | 'frame' | 'oversize'
};

const HY_FONT = {
  display: "'Newsreader', 'Source Serif Pro', Georgia, serif",
  body: "'Manrope', 'Geist', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
  techDisplay: "'Khand', 'Bebas Neue', Impact, sans-serif"
};

// ────────────────────────────────────────────────────────────────────────────
// Decorations
// ────────────────────────────────────────────────────────────────────────────

function HyWaves({ color = "rgba(26,23,20,0.06)" }) {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} preserveAspectRatio="none" viewBox="0 0 1280 800">
      <g fill="none" stroke={color} strokeWidth="1">
        <path d="M -100 200 C 200 120, 360 300, 620 230 S 1050 150, 1380 270" />
        <path d="M -100 300 C 180 240, 420 400, 720 320 S 1080 260, 1380 360" />
        <path d="M -100 430 C 200 360, 380 510, 660 450 S 1080 380, 1380 480" />
        <path d="M -100 560 C 200 490, 440 630, 720 560 S 1080 500, 1380 600" />
        <path d="M -100 120 C 240  70, 460 190, 760 120 S 1100  70, 1380 150" />
      </g>
    </svg>);

}

function HyNoise() {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: 0.55, mixBlendMode: "overlay" }}>
      <filter id="hyNoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#hyNoise)" />
    </svg>);

}

function HyCorners({ size = 12, color, inset = 0 }) {
  const s = (rot, pos) => ({
    position: "absolute", width: size, height: size,
    borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}`,
    transform: `rotate(${rot}deg)`, ...pos
  });
  return (
    <>
      <span style={s(0, { top: inset, left: inset })} />
      <span style={s(90, { top: inset, right: inset })} />
      <span style={s(180, { bottom: inset, right: inset })} />
      <span style={s(270, { bottom: inset, left: inset })} />
    </>);

}

// Diagonal-stripe placeholder, cream or dark.
function HyPlaceholder({ label, h = 240, w = "100%", dark, accent, note, tilt = 0, frame = false, T }) {
  const palette = dark ?
  accent ? ["#231510", "#2a1a14"] : ["#1c1916", "#211e1a"] :
  accent ? ["#f2d6c5", "#ecc7b1"] : ["#d8d2c1", "#cfc8b5"];
  const tx = dark ? "rgba(255,255,255,0.65)" : "rgba(26,23,20,0.6)";
  return (
    <div style={{
      position: "relative", height: h, width: w, overflow: "hidden",
      background: `repeating-linear-gradient(135deg, ${palette[0]} 0 14px, ${palette[1]} 14px 28px)`,
      transform: tilt ? `rotate(${tilt}deg)` : undefined,
      boxShadow: frame ? "0 14px 34px rgba(0,0,0,0.12)" : undefined,
      border: dark ? `1px solid ${T?.darkLine || "rgba(255,255,255,0.08)"}` : undefined
    }}>
      <div style={{ position: "absolute", left: 12, bottom: 10, fontFamily: HY_FONT.mono, fontSize: 10, letterSpacing: ".14em", color: tx, textTransform: "uppercase" }}>
        [ {label} ]
      </div>
      {note && <div style={{ position: "absolute", right: 12, top: 10, fontFamily: HY_FONT.mono, fontSize: 9, letterSpacing: ".14em", color: tx, textTransform: "uppercase" }}>{note}</div>}
    </div>);

}

function HyEyebrow({ children, dark, accent, T }) {
  return (
    <div style={{
      fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".22em",
      color: accent ? T.accent : dark ? T.darkMute : T.inkMute,
      textTransform: "uppercase"
    }}>
      {children}
    </div>);

}

function HyPill({ children, filled, dark, T }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "7px 14px", borderRadius: 999,
      background: filled ? T.accent : dark ? "rgba(255,255,255,0.05)" : "rgba(26,23,20,0.04)",
      border: filled ? "none" : dark ? `1px solid ${T.darkLine}` : `1px solid ${T.rule}`,
      color: filled ? T.accentInk : dark ? T.darkInk : T.ink,
      fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".14em", textTransform: "uppercase",
      cursor: "pointer", fontWeight: filled ? 600 : 500
    }}>
      {children}
    </span>);

}

// ────────────────────────────────────────────────────────────────────────────
// Top bar — minimal, cream
// ────────────────────────────────────────────────────────────────────────────

function HyCopyEmailButton({ T }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = (e) => {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(SITE.contact.email);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <button onClick={handleCopy} style={{
        padding: "8px 14px",
        border: `2px solid ${T.rule}`,
        background: copied ? T.accent : "transparent",
        color: copied ? T.accentInk : T.ink,
        fontFamily: HY_FONT.body, fontSize: 13, fontWeight: 500,
        display: "inline-flex", alignItems: "center", gap: 8,
        cursor: "pointer", transition: "background .2s, color .2s"
      }}
    title="Copy email to clipboard">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="M3 7l9 6 9-6" />
      </svg>
      {copied ? "Copied!" : SITE.contact.email}
    </button>);

}

function HyTopBar({ T }) {
  return (
    <div style={{
      position: "relative", zIndex: 2, padding: "22px 56px",
      display: "flex", alignItems: "center", justifyContent: "space-between"
    }}>
      <div style={{
        fontFamily: HY_FONT.display, fontSize: 22, fontWeight: 600, lineHeight: 0.95,
        color: T.ink, letterSpacing: "-.01em"
      }}>
        Luc Desautels
        <span style={{ display: "inline-block", marginLeft: 6, width: 8, height: 8, background: T.accent, verticalAlign: "middle" }} />
      </div>
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        {DEDICATED_PAGES.map((p) =>
        <a key={p.label} href={p.href} style={{
          fontFamily: HY_FONT.body, fontSize: 14, color: T.ink, textDecoration: "none", fontWeight: 500
        }}>
            {p.label}
          </a>
        )}
        <HyCopyEmailButton T={T} />
        <a href="#resume" style={{
          padding: "8px 14px",
          border: `2px solid ${T.rule}`,
          fontFamily: HY_FONT.body, fontSize: 13, color: T.ink, textDecoration: "none", fontWeight: 500,
          display: "inline-flex", alignItems: "center", gap: 6
        }}>
          Résumé
        </a>
        <a href={`https://${SITE.contact.linkedin}`} target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{
          width: 34, height: 34, display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "#0a66c2", color: "#fff", textDecoration: "none", borderRadius: 4
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.65-1.85 3.39-1.85 3.62 0 4.29 2.38 4.29 5.48v6.26zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
          </svg>
        </a>
      </div>
    </div>);

}

// ────────────────────────────────────────────────────────────────────────────
// Hero — Lando-style: big name + polaroid trio + meta + content filter
// ────────────────────────────────────────────────────────────────────────────

function HyHero({ T }) {
  return (
    <section style={{ position: "relative", padding: "32px 56px 72px" }}>
      <HyWaves color="rgba(26,23,20,0.06)" />
      <div style={{ position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 440px", gap: 56, alignItems: "start" }}>
        <div>
          <HyEyebrow T={T}>Personal Portfolio 2026</HyEyebrow>
          <h1 style={{
            fontFamily: HY_FONT.display, fontWeight: 500,
            fontSize: 168 * T.displayScale, lineHeight: 0.9, letterSpacing: "-.028em",
            margin: "18px 0 0", color: T.ink
          }}>
            Luc<br />
            <span style={{ fontStyle: "italic", fontWeight: 400 }}>Desautels</span><span style={{ color: T.accent }}>.</span>
          </h1>
          <p style={{
            fontFamily: HY_FONT.body, fontSize: 21, lineHeight: 1.45,
            color: T.inkDim, maxWidth: 560, margin: "32px 0 0", textWrap: "pretty"
          }}>
            My main focus right now is in <span style={{ color: T.ink, fontWeight: 600 }}>robotics</span>,
            however I also rock climb, play fiddle, and have a passion for <span style={{ color: T.ink, fontWeight: 600 }}>drone photography</span>.
          </p>

          <div style={{ display: "flex", gap: 48, marginTop: 44 }}>
            {SITE.meta.map((m) =>
            <div key={m.label}>
                <HyEyebrow T={T}>{m.label}</HyEyebrow>
                <div style={{ fontFamily: HY_FONT.body, fontSize: 18, color: T.ink, fontWeight: 700, marginTop: 6 }}>
                  {m.value}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Polaroid trio */}
        <div style={{ position: "relative", height: 520 }}>
          <div style={{ position: "absolute", top: 0, right: 0, transform: "rotate(3deg)" }}>
            <HyPlaceholder label="Hero portrait · 4:5" h={420} w={300} frame T={T} note="REPLACE" />
            <div style={{
              padding: "10px 12px 14px", background: "#fff",
              fontFamily: HY_FONT.body, fontSize: 12, color: T.inkDim,
              boxShadow: "0 14px 34px rgba(0,0,0,0.10)",
              marginTop: -2
            }}>
              Luc · workshop, Toronto
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 24, left: -12, transform: "rotate(-5deg)" }}>
            <HyPlaceholder label="In the field" h={170} w={200} frame T={T} />
            <div style={{
              padding: "8px 10px 12px", background: "#fff",
              fontFamily: HY_FONT.body, fontSize: 11, color: T.inkDim,
              boxShadow: "0 12px 28px rgba(0,0,0,0.10)"
            }}>
              Sailfish field test
            </div>
          </div>
          <div style={{ position: "absolute", top: 280, left: 160, transform: "rotate(8deg)" }}>
            <HyPlaceholder label="Outdoors" h={130} w={150} frame T={T} />
            <div style={{ padding: "6px 8px 10px", background: "#fff", fontFamily: HY_FONT.body, fontSize: 10, color: T.inkDim, boxShadow: "0 10px 22px rgba(0,0,0,0.10)" }}>
              On rope
            </div>
          </div>
        </div>
      </div>

      {/* Content-type filter (not audience). */}
      <div style={{ marginTop: 64, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontFamily: HY_FONT.body, fontStyle: "italic", color: T.inkDim, fontSize: 15, marginRight: 8 }}>
          Show me —
        </span>
        <HyPill filled T={T}>The full picture</HyPill>
        <HyPill T={T}>Engineering only</HyPill>
        <HyPill T={T}>Robotics + Academics</HyPill>
        <HyPill T={T}>Just creatives</HyPill>
        <HyPill T={T}>↓ Résumé (PDF)</HyPill>
      </div>
    </section>);

}

// ────────────────────────────────────────────────────────────────────────────
// Horizontal-scroll table of contents.
// Photos scroll left-right; section labels fixed up top; backgrounds blend.
// ────────────────────────────────────────────────────────────────────────────

// 5 TOC sections with their tile content.
const TOC = [
{
  id: "academics",
  label: "Academics",
  tone: "#eee7d5",
  items: [
  { tag: "EDUCATION", label: "TFS & Scholar's Guild", h: 340, w: 230 },
  { tag: "EDUCATION", label: "IB Diploma Program", h: 240, w: 200 },
  { tag: "RESEARCH", label: "5.8 GHz over water", h: 300, w: 260, big: true },
  { tag: "RESEARCH", label: "SAR spiral optimization", h: 220, w: 200 },
  { tag: "RESEARCH", label: "Motor & prop efficiency", h: 280, w: 210 }]

},
{
  id: "robotics",
  label: "Robotics",
  tone: "#e9e1cd",
  items: [
  { tag: "SAILFISH", label: "Sailfish Gen 3", h: 340, w: 260, big: true },
  { tag: "SAILFISH", label: "Fuselage VTX stack", h: 250, w: 200 },
  { tag: "SAILFISH", label: "Field test, Lake Ontario", h: 280, w: 220 },
  { tag: "FTC", label: "Ontario Champions 2024", h: 320, w: 240 },
  { tag: "FTC", label: "CNC chassis plate", h: 230, w: 200 },
  { tag: "FTC", label: "Arm transfer system", h: 260, w: 210 }]

},
{
  id: "wellrounded",
  label: "Well-rounded",
  tone: "#e3dac3",
  items: [
  { tag: "SPORTS", label: "Lead climb 5.10c", h: 340, w: 230, big: true },
  { tag: "SPORTS", label: "Whistler, double-black", h: 240, w: 200 },
  { tag: "CREATIVE", label: "Algonquin fog", h: 280, w: 240 },
  { tag: "CREATIVE", label: "Folk fiddle jam", h: 220, w: 200 },
  { tag: "SCOUTS", label: "La Vérendrye canoe", h: 290, w: 220 }]

},
{
  id: "experiences",
  label: "Experiences",
  tone: "#ddd2b6",
  items: [
  { tag: "SHAD", label: "SHAD program", h: 300, w: 240, big: true },
  { tag: "PROGRAM", label: "Waterloo Catalyst", h: 240, w: 200 },
  { tag: "SIDEQUEST", label: "Light suit ski night", h: 280, w: 210 },
  { tag: "SIDEQUEST", label: "Dance Show MC", h: 230, w: 200 }]

}];


function HyHorizontalTOC({ T }) {
  // Sticky nav of section labels above a horizontally-scrolling row.
  // We use scroll-snap so wheel-scroll feels nice. Each section is a long band
  // tinted with `tone`. Each tile has a hover-reveal description.
  const totalLabels = TOC.map((s) => s.label);
  return (
    <section style={{ position: "relative", paddingTop: 8, paddingBottom: 0 }}>
      <div style={{ padding: "0 56px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <HyEyebrow T={T}>§ 01 — Field log / table of contents</HyEyebrow>
          <h2 style={{ fontFamily: HY_FONT.display, fontSize: 56 * T.displayScale, lineHeight: 0.95, margin: "6px 0 0", color: T.ink, letterSpacing: "-.02em", fontWeight: 500 }}>
            Skim the work, the rest, and the side quests.
          </h2>
          <p style={{ fontFamily: HY_FONT.body, fontSize: 14.5, color: T.inkDim, margin: "10px 0 0", maxWidth: 620, lineHeight: 1.55 }}>
            A scroll-driven gallery that doubles as a table of contents. Drag, scroll, or tap a section — backgrounds blend as you move from academics into robotics into the rest.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ width: 42, height: 42, background: "#fff", border: `1px solid ${T.rule}`, fontFamily: HY_FONT.body, cursor: "pointer", fontSize: 18 }}>←</button>
          <button style={{ width: 42, height: 42, background: T.ink, color: T.bg, border: "none", cursor: "pointer", fontSize: 18 }}>→</button>
        </div>
      </div>

      {/* Sticky-feeling section nav (cosmetic — anchors at top of scroll area). */}
      <div style={{
        padding: "0 56px 14px", display: "flex", gap: 0, alignItems: "center"
      }}>
        {totalLabels.map((l, i) =>
        <div key={l} style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <div style={{
            padding: "7px 12px",
            fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase",
            background: i === 0 ? T.ink : "transparent",
            color: i === 0 ? T.bg : T.inkDim,
            border: i === 0 ? "none" : `1px solid ${T.rule}`,
            cursor: "pointer"
          }}>
              0{i + 1} · {l}
            </div>
            {i < totalLabels.length - 1 && <div style={{ width: 18, height: 1, background: T.rule }} />}
          </div>
        )}
        <div style={{ marginLeft: "auto", fontFamily: HY_FONT.mono, fontSize: 10, color: T.inkMute, letterSpacing: ".18em", textTransform: "uppercase" }}>
          DRAG · SCROLL · TAP TO JUMP
        </div>
      </div>

      {/* The horizontally-scrolling band itself. */}
      <div style={{
        position: "relative",
        overflowX: "auto", overflowY: "hidden",
        scrollSnapType: "x mandatory",
        scrollbarWidth: "thin",
        whiteSpace: "nowrap",
        WebkitOverflowScrolling: "touch"
      }}>
        <div style={{
          display: "flex", alignItems: "center", minHeight: 520, padding: "24px 56px"
        }}>
          {TOC.map((sec, si) =>
          <div key={sec.id} style={{
            display: "inline-flex", alignItems: "center", scrollSnapAlign: "start",
            background: `linear-gradient(90deg, ${sec.tone} 0%, ${sec.tone} 70%, ${TOC[si + 1]?.tone || sec.tone} 100%)`,
            padding: "36px 28px", marginRight: si < TOC.length - 1 ? 0 : 0,
            borderRadius: 0,
            position: "relative"
          }}>
              {/* Section vertical label */}
              <div style={{
              writingMode: "vertical-rl", transform: "rotate(180deg)",
              marginRight: 18, marginLeft: -8,
              fontFamily: HY_FONT.display, fontSize: 60 * T.displayScale, fontWeight: 500,
              fontStyle: "italic", color: T.ink, letterSpacing: "-.02em", lineHeight: 0.95,
              whiteSpace: "nowrap"
            }}>
                {sec.label}.
              </div>
              <div style={{
              display: "flex", alignItems: "flex-end", gap: 18
            }}>
                {sec.items.map((it, ii) =>
              <div key={ii} style={{
                position: "relative",
                width: it.w, height: it.h,
                flex: "0 0 auto",
                transform: ii % 2 === 0 ? `rotate(${-1 + ii * 0.4}deg)` : `rotate(${0.8 + ii * 0.3}deg)`
              }}>
                    <HyPlaceholder label={`${it.tag} · ${it.label.toUpperCase()}`} h={it.h} w={it.w} frame T={T} />
                    {/* Hover-revealed description */}
                    <div style={{
                  position: "absolute", left: 6, bottom: -26,
                  fontFamily: HY_FONT.mono, fontSize: 10, letterSpacing: ".14em",
                  color: T.inkMute, textTransform: "uppercase",
                  whiteSpace: "nowrap"
                }}>
                      / {it.tag}
                    </div>
                  </div>
              )}
              </div>
              {/* Section anchor link */}
              <div style={{
              position: "absolute", top: 14, right: 14,
              padding: "6px 10px", background: "rgba(0,0,0,0.04)", border: `1px solid ${T.rule}`,
              fontFamily: HY_FONT.mono, fontSize: 10, letterSpacing: ".14em", color: T.ink, textTransform: "uppercase",
              cursor: "pointer", whiteSpace: "nowrap"
            }}>
                ↓ JUMP TO {sec.label.toUpperCase()}
              </div>
            </div>
          )}
          {/* trailing space so the last section can snap into view */}
          <div style={{ flex: "0 0 56px" }} />
        </div>
      </div>

      {/* Scrubber */}
      <div style={{ padding: "18px 56px 32px", display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ flex: 1, height: 3, background: T.ruleSoft, position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "28%", background: T.ink }} />
        </div>
        <div style={{ fontFamily: HY_FONT.mono, fontSize: 11, color: T.inkMute, letterSpacing: ".14em" }}>
          01 / 04
        </div>
      </div>
    </section>);

}

// ────────────────────────────────────────────────────────────────────────────
// Transition band — cream→dark gradient with subtle waves
// ────────────────────────────────────────────────────────────────────────────

function HyTransitionToDark({ T }) {
  return (
    <div style={{
      height: 140, position: "relative", overflow: "hidden",
      background: `linear-gradient(180deg, ${T.bg} 0%, ${T.bgWarm} 40%, #2a221c 80%, ${T.dark} 100%)`
    }}>
      <HyWaves color="rgba(255,255,255,0.04)" />
      <div style={{
        position: "absolute", left: "50%", top: "45%", transform: "translate(-50%,-50%)",
        fontFamily: HY_FONT.mono, fontSize: 10, letterSpacing: ".24em", color: "rgba(255,255,255,0.5)",
        textTransform: "uppercase", whiteSpace: "nowrap"
      }}>
        — TRANSITION · CREAM → TELEMETRY —
      </div>
    </div>);

}

function HyTransitionToCream({ T }) {
  return (
    <div style={{
      height: 120, position: "relative", overflow: "hidden",
      background: `linear-gradient(180deg, ${T.dark} 0%, #2a221c 30%, ${T.bgWarm} 75%, ${T.bg} 100%)`
    }} />);

}

// ────────────────────────────────────────────────────────────────────────────
// Robotics intro — "IMPACT / COMPETE" wordmark split, Lando-style.
// Two images of me side-by-side + work / ambition / inspiration per side.
// ────────────────────────────────────────────────────────────────────────────

const ROBOTICS_INTRO = [
{
  side: "IMPACT",
  title: "Project Sailfish",
  photoLabel: "Luc · Sailfish field test",
  photoNote: "REPLACE: photo of me with Sailfish",
  rows: [
  { eyebrow: "Work", body: "Three generations of a low-cost, open-sourced autonomous marine SAR drone." },
  { eyebrow: "Ambition", body: "Cut first-visual-contact time for Coast Guard and volunteer rescue." },
  { eyebrow: "Inspiration", body: "The gap between funded SAR aircraft and what shoreline crews actually have." }],

  cta: "↳ Project Sailfish"
},
{
  side: "COMPETE",
  title: "FTC",
  photoLabel: "Luc · Ontario Championship podium",
  photoNote: "REPLACE: photo of me with FTC team",
  rows: [
  { eyebrow: "Work", body: "Five years FTC — competitor, mechanical lead, mentor. Ontario Inspire + Worlds 2024." },
  { eyebrow: "Ambition", body: "Compete at the world level. Leave the team stronger than I found it." },
  { eyebrow: "Inspiration", body: "Juniors taking ownership of a subsystem. The handoff is the win." }],

  cta: "↳ FTC team page"
}];


function HyRoboticsIntro({ T }) {
  return (
    <div style={{ position: "relative", padding: "8px 56px 8px" }}>
      {/* Big section header — ROBOTICS — Lando + telemetry lean */}
      <div style={{
        display: "flex", alignItems: "baseline", justifyContent: "space-between",
        paddingBottom: 14, marginBottom: 18, borderBottom: `1px solid ${T.darkLine}`
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{
            fontFamily: HY_FONT.mono, fontSize: 12, letterSpacing: ".22em",
            color: T.accent, textTransform: "uppercase"
          }}>// 02</span>
          <span style={{
            fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".22em",
            color: T.darkMute, textTransform: "uppercase"
          }}>SECTION</span>
        </div>
        <div style={{
          fontFamily: HY_FONT.mono, fontSize: 10, letterSpacing: ".22em",
          color: T.darkMute, textTransform: "uppercase"
        }}>
          STATUS: ACTIVE · TWO PROGRAMS · TORONTO
        </div>
      </div>

      <h2 style={{ ...{
          fontFamily: HY_FONT.techDisplay, fontWeight: 700,
          fontSize: 220 * T.displayScale, lineHeight: 0.82, letterSpacing: "-.04em",
          margin: "20px 0 0", color: T.darkInk, textTransform: "uppercase"
        }, fontWeight: "600", height: "100px", letterSpacing: "-8.8px", lineHeight: "1", fontSize: "1px" }}>
        ROBOTICS<span style={{ color: T.accent }}>.</span>
      </h2>

      {/* Wordmark split */}
      <div style={{
        position: "relative", textAlign: "left", marginTop: 4, marginBottom: 24
      }}>
        <div style={{
          fontFamily: HY_FONT.techDisplay, fontWeight: 600,
          fontSize: 120 * T.displayScale, lineHeight: 0.92, letterSpacing: "-.03em",
          color: T.darkInk, textTransform: "uppercase"
        }}>
          <span>IMPACTFUL</span>
          <span style={{ margin: "0 .12em", color: T.darkMute }}>/</span>
          <span>COMPETITIVE</span>
        </div>
        <div style={{
          position: "absolute", left: "44%", top: "100%", transform: "translate(-50%, -85%) rotate(-5deg)",
          fontFamily: HY_FONT.display, fontStyle: "italic", fontWeight: 500,
          fontSize: 48 * T.displayScale, color: T.accent, lineHeight: 1
        }}>
          and both, at once.
        </div>
      </div>

      {/* Two columns: full-width image, text below */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 56,
        position: "relative"
      }}>
        {/* Divider line down the center */}
        <div style={{
          position: "absolute", left: "50%", top: 0, bottom: 0,
          width: 1, background: T.darkLineSoft, transform: "translateX(-0.5px)"
        }} />

        {ROBOTICS_INTRO.map((s, i) =>
        <div key={s.side} style={{ display: "flex", flexDirection: "column", paddingRight: i === 0 ? 16 : 0, paddingLeft: i === 1 ? 16 : 0 }}>
            {/* Full-width image */}
            <div>
              <HyPlaceholder label={s.photoLabel} h={420} dark note={s.photoNote} T={T} />
              <div style={{
              marginTop: 10, fontFamily: HY_FONT.mono, fontSize: 10, letterSpacing: ".14em",
              color: T.darkMute, textTransform: "uppercase"
            }}>
                FIG. {i + 1} · {s.photoLabel}
              </div>
            </div>

            {/* Eyebrow + title */}
            <div style={{ marginTop: 28, display: "flex", alignItems: "baseline", gap: 14 }}>
              <span style={{
              fontFamily: HY_FONT.mono, fontSize: 12, letterSpacing: ".22em",
              color: T.accent, textTransform: "uppercase", fontWeight: 600
            }}>
                // {s.side}
              </span>
              <span style={{
              flex: 1, height: 1, background: T.darkLineSoft
            }} />
              <span style={{
              fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".18em",
              color: T.darkMute, textTransform: "uppercase"
            }}>
                0{i + 1} / 02
              </span>
            </div>
            <h3 style={{
            fontFamily: HY_FONT.techDisplay, fontWeight: 700, fontSize: 60 * T.displayScale,
            margin: "10px 0 18px", color: T.darkInk, textTransform: "uppercase", lineHeight: 0.95, letterSpacing: "-.02em"
          }}>
              {s.title}
            </h3>

            {/* Shortened body rows */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
              {s.rows.map((r, ri) =>
            <div key={r.eyebrow} style={{
              paddingTop: 12, borderTop: `1px solid ${T.darkLine}`
            }}>
                  <HyEyebrow dark T={T}>&gt; {r.eyebrow}</HyEyebrow>
                  <div style={{
                fontFamily: HY_FONT.body, fontSize: 13.5, color: T.darkDim, lineHeight: 1.55, marginTop: 8
              }}>
                    {r.body}
                  </div>
                </div>
            )}
            </div>

            <a href={i === 0 ? "#sailfish" : "#ftc"} style={{
            marginTop: 22,
            display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: 8,
            padding: "10px 14px", border: `1px solid ${T.accent}`,
            fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".18em",
            color: T.accent, textTransform: "uppercase", textDecoration: "none"
          }}>
              {s.cta} →
            </a>
          </div>
        )}
      </div>

      {/* Down-arrow indicator before the project-detail panels */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 14,
        margin: "56px 0 0", paddingTop: 28, borderTop: `1px solid ${T.darkLineSoft}`
      }}>
        <div style={{ flex: 1, height: 1, background: T.darkLineSoft }} />
        <span style={{
          fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".22em",
          color: T.darkMute, textTransform: "uppercase"
        }}>
          Project details ↓
        </span>
        <div style={{ flex: 1, height: 1, background: T.darkLineSoft }} />
      </div>
    </div>);

}

// ────────────────────────────────────────────────────────────────────────────
// Robotics side-by-side — DARK telemetry style, slimmed-down vs. Direction A
// ────────────────────────────────────────────────────────────────────────────

function HyRoboticsPanel({ p, idx, T }) {
  return (
    <div style={{ position: "relative", padding: "22px 24px 24px" }}>
      <HyCorners color={T.darkLine} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <HyEyebrow dark T={T}>{p.eyebrow}</HyEyebrow>
        <div style={{ fontFamily: HY_FONT.mono, fontSize: 10, letterSpacing: ".15em", color: T.darkMute, textTransform: "uppercase" }}>
          {String(idx + 1).padStart(2, "0")} / 02
        </div>
      </div>
      <h3 style={{
        fontFamily: HY_FONT.techDisplay, fontSize: 84 * T.displayScale, lineHeight: 0.92,
        margin: "10px 0 4px", color: T.darkInk, textTransform: "uppercase", letterSpacing: "-.01em", fontWeight: 600
      }}>
        {p.title}
      </h3>
      <div style={{ fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".14em", color: T.darkMute, textTransform: "uppercase" }}>
        STATUS: ACTIVE · GEN.{idx === 0 ? "3" : "5"} · {idx === 0 ? "OPEN SOURCE" : "COMPETITIVE"}
      </div>

      <div style={{ marginTop: 22 }}>
        <HyPlaceholder label={`${p.title.toUpperCase()} — LIGHTBOX (working)`} h={300} dark note="EXISTING COMPONENT" T={T} />
        <div style={{ marginTop: 8, display: "flex", gap: 6 }}>
          {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ flex: 1, height: 4, background: i === 0 ? T.accent : T.darkLine }} />)}
        </div>
        <div style={{ marginTop: 10, fontFamily: HY_FONT.mono, fontSize: 10, color: T.darkMute, letterSpacing: ".12em", textTransform: "uppercase" }}>
          // {p.caption}
        </div>
      </div>

      <div style={{ marginTop: 22, padding: "14px 0", borderTop: `1px solid ${T.darkLine}`, borderBottom: `1px solid ${T.darkLineSoft}` }}>
        <HyEyebrow dark T={T}>&gt; Quick Info</HyEyebrow>
        <div style={{ fontFamily: HY_FONT.body, fontSize: 17, color: T.darkInk, fontWeight: 600, margin: "8px 0 6px" }}>
          {p.intro.label}
        </div>
        <div style={{ fontFamily: HY_FONT.body, fontSize: 14, color: T.darkDim, lineHeight: 1.55 }}>
          {p.intro.body}
        </div>
      </div>

      {p.rows.map((r, i) =>
      <div key={r.title} style={{ padding: "16px 0", borderBottom: i < p.rows.length - 1 ? `1px solid ${T.darkLineSoft}` : `1px solid ${T.darkLine}` }}>
          <HyEyebrow dark T={T}>&gt; {r.eyebrow}</HyEyebrow>
          <div style={{ fontFamily: HY_FONT.body, fontSize: 16, color: T.darkInk, fontWeight: 600, margin: "6px 0 4px" }}>{r.title}</div>
          <div style={{ fontFamily: HY_FONT.body, fontSize: 13.5, color: T.darkDim, lineHeight: 1.55 }}>{r.body}</div>
        </div>
      )}

      <a href={p.href} style={{
        display: "inline-flex", alignItems: "center", gap: 10, marginTop: 18,
        padding: "12px 16px", border: `1px solid ${T.accent}`, color: T.accent,
        fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".18em", textDecoration: "none", textTransform: "uppercase"
      }}>
        Open dedicated page →
      </a>
    </div>);

}

function HyRobotics({ T }) {
  return (
    <section style={{ position: "relative", padding: "32px 56px 56px", background: T.dark, color: T.darkInk }}>
      <HyNoise />
      {!T.useFIntro && <HyRoboticsIntro T={T} />}

      {/* Sub-section header for the detail panels */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        paddingBottom: 16, borderBottom: `1px solid ${T.darkLine}`, marginTop: 56, marginBottom: 24
      }}>
        <div>
          <HyEyebrow dark accent T={T}>// 02.A — PROJECT DETAILS</HyEyebrow>
          <h3 style={{
            fontFamily: HY_FONT.techDisplay, fontSize: 44 * T.displayScale, margin: "6px 0 0",
            color: T.darkInk, textTransform: "uppercase", letterSpacing: "-.01em", fontWeight: 600
          }}>
            Side-by-side breakdown.
          </h3>
        </div>
        <div style={{ fontFamily: HY_FONT.mono, fontSize: 10, letterSpacing: ".16em", color: T.darkMute, textTransform: "uppercase", textAlign: "right" }}>
          Lightboxes pull from<br />existing components
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {ROBOTICS.map((p, i) => <HyRoboticsPanel key={p.title} p={p} idx={i} T={T} />)}
      </div>
    </section>);

}

// ────────────────────────────────────────────────────────────────────────────
// Sub-projects carousel — dark, slim, filter chips for engineering subdomains
// ────────────────────────────────────────────────────────────────────────────

const SUBPROJECTS = [
{ tag: "SAILFISH", domain: "MECHANICAL", label: "Fuselage VTX stack", desc: "5.8GHz transmitter + camera packed into the nose." },
{ tag: "SAILFISH", domain: "ELECTRICAL", label: "Tilt-rotor controller", desc: "4-axis PWM mixer for tilt-thrust transitions." },
{ tag: "SAILFISH", domain: "CAD", label: "Wing carry-through CAD", desc: "Carbon spar layup planned via parametric models." },
{ tag: "FTC", domain: "MANUFACTURING", label: "CNC chassis plate", desc: "First time taking a part CAD→fixturing→ops." },
{ tag: "FTC", domain: "MECHANICAL", label: "Arm transfer system", desc: "Two-stage transfer with a passive deadband." },
{ tag: "FTC", domain: "SOFTWARE", label: "Auto routine pathing", desc: "Spline-based path planner for autonomous." },
{ tag: "SAILFISH", domain: "MATERIALS", label: "Foam-core flotation", desc: "Closed-cell flotation that survived 5 belly landings." },
{ tag: "SAILFISH", domain: "SOFTWARE", label: "Ground-station UI", desc: "Telemetry dashboard built on top of Mavlink." }];


function HySubprojectsCarousel({ T }) {
  const domains = ["ALL", "MECHANICAL", "ELECTRICAL", "CAD", "MANUFACTURING", "MATERIALS", "SOFTWARE"];
  return (
    <section style={{ position: "relative", padding: "32px 0 56px", background: T.dark, color: T.darkInk, borderTop: `1px solid ${T.darkLine}` }}>
      <div style={{ padding: "0 56px 14px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <HyEyebrow dark T={T}>[ § 03 — Robotics sub-projects ]</HyEyebrow>
          <h3 style={{ fontFamily: HY_FONT.techDisplay, fontSize: 48 * T.displayScale, margin: "6px 0 0", color: T.darkInk, textTransform: "uppercase", letterSpacing: "-.01em", fontWeight: 600 }}>
            Filter by domain.
          </h3>
        </div>
        <a href="#all-projects" style={{
          padding: "10px 14px", border: `1px solid ${T.darkLine}`, color: T.darkInk,
          fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".16em", textDecoration: "none", textTransform: "uppercase"
        }}>
          ⊞ Full project grid →
        </a>
      </div>

      <div style={{ padding: "0 56px 18px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {domains.map((d, i) =>
        <div key={d} style={{
          padding: "6px 12px",
          fontFamily: HY_FONT.mono, fontSize: 10, letterSpacing: ".18em", textTransform: "uppercase",
          color: i === 0 ? T.accentInk : T.darkDim,
          background: i === 0 ? T.accent : "transparent",
          border: i === 0 ? "none" : `1px solid ${T.darkLine}`,
          cursor: "pointer"
        }}>
            {d}
          </div>
        )}
      </div>

      <div style={{
        display: "flex", gap: 14, padding: "0 56px",
        overflowX: "auto", scrollSnapType: "x mandatory"
      }}>
        {SUBPROJECTS.map((p, i) =>
        <div key={i} style={{ flex: "0 0 240px", scrollSnapAlign: "start" }}>
            <div style={{ position: "relative" }}>
              <HyPlaceholder label={p.label} h={280} dark T={T} />
              <div style={{
              position: "absolute", top: 8, left: 8,
              padding: "3px 8px", background: T.accent, color: T.accentInk,
              fontFamily: HY_FONT.mono, fontSize: 9, letterSpacing: ".18em", fontWeight: 700, textTransform: "uppercase"
            }}>
                {p.tag}
              </div>
              <div style={{
              position: "absolute", top: 8, right: 8,
              padding: "3px 8px", background: "rgba(0,0,0,0.5)", color: T.darkInk,
              fontFamily: HY_FONT.mono, fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase"
            }}>
                {p.domain}
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{ fontFamily: HY_FONT.body, fontSize: 14, color: T.darkInk, fontWeight: 600 }}>
                {p.label}
              </div>
              <div style={{ fontFamily: HY_FONT.body, fontSize: 12, color: T.darkDim, marginTop: 4, lineHeight: 1.55 }}>
                {p.desc}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>);

}

// ────────────────────────────────────────────────────────────────────────────
// Cream group blocks — Academics / Well-rounded
// Standout treatment is parameterized via T.standoutStyle.
// ────────────────────────────────────────────────────────────────────────────

function HyStandoutCard({ item, T, quirky }) {
  // Different treatments
  if (T.standoutStyle === "filled") {
    // Orange filled card (V1, like the Sailfish look)
    return (
      <article style={{
        position: "relative", padding: "22px 24px", background: T.accent, color: T.accentInk,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        minHeight: 380, transform: quirky ? "rotate(-1deg)" : undefined, backgroundImage: "initial", backgroundPosition: "initial", backgroundSize: "initial", backgroundRepeat: "initial", backgroundAttachment: "initial", backgroundOrigin: "initial", backgroundClip: "initial", borderColor: "rgb(217, 106, 54)", opacity: "1", borderStyle: "solid", borderWidth: "3px"
      }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".18em", color: "rgba(255,255,255,0.85)", textTransform: "uppercase", fontWeight: 600 }}>
              ★ STANDOUT
            </span>
            <span style={{ fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".14em", color: "rgba(255,255,255,0.75)" }}>01</span>
          </div>
          <HyPlaceholder label={item.title} h={180} accent T={T} />
          <h4 style={{ fontFamily: HY_FONT.display, fontSize: 34, fontWeight: 600, margin: "16px 0 10px", letterSpacing: "-.01em", lineHeight: 1.05, color: "#fff" }}>
            {item.title}
          </h4>
          <p style={{ fontFamily: HY_FONT.body, fontSize: 14.5, color: "rgba(255,255,255,0.92)", margin: 0, lineHeight: 1.55 }}>
            {item.body}
          </p>
        </div>
      </article>);

  }
  if (T.standoutStyle === "tab") {
    // Bigger card, neutral background, with a small "STANDOUT" tab sticking up. Editorial.
    return (
      <article style={{
        position: "relative", padding: "22px 24px", background: "#fff",
        boxShadow: "0 16px 38px rgba(0,0,0,0.10)",
        display: "flex", flexDirection: "column", minHeight: 380,
        transform: quirky ? "rotate(-1deg)" : undefined, borderStyle: "solid", borderColor: "rgb(214, 110, 58)", borderWidth: "2px"
      }}>
        <div style={{
          position: "absolute", top: -13, left: 20,
          padding: "4px 10px", background: T.ink, color: T.bg,
          fontFamily: HY_FONT.mono, fontSize: 10, letterSpacing: ".22em", textTransform: "uppercase", fontWeight: 600
        }}>
          ★ Standout
        </div>
        <HyPlaceholder label={item.title} h={200} T={T} />
        <div style={{ borderLeft: `3px solid ${T.trim}`, paddingLeft: 14, marginTop: 18 }}>
          <h4 style={{ fontFamily: HY_FONT.display, fontSize: 34, fontWeight: 500, margin: 0, color: T.ink, letterSpacing: "-.02em", lineHeight: 1.05 }}>
            {item.title}
          </h4>
          <p style={{ fontFamily: HY_FONT.body, fontSize: 14.5, color: T.inkDim, margin: "10px 0 0", lineHeight: 1.55 }}>
            {item.body}
          </p>
        </div>
      </article>);

  }
  // Default fallback (shouldn't hit)
  return null;
}

function HyItemCard({ item, T, quirky, rotateDeg }) {
  return (
    <article style={{
      position: "relative", padding: "18px 20px",
      background: "#fff",
      border: `1px solid ${T.rule}`,
      transform: quirky ? `rotate(${rotateDeg}deg)` : undefined,
      display: "flex", flexDirection: "column"
    }}>
      <HyPlaceholder label={item.title} h={140} T={T} />
      <h4 style={{ fontFamily: HY_FONT.display, fontSize: 22, fontWeight: 600, margin: "14px 0 6px", color: T.ink, letterSpacing: "-.01em", lineHeight: 1.1 }}>
        {item.title}
      </h4>
      <p style={{ fontFamily: HY_FONT.body, fontSize: 13.5, color: T.inkDim, margin: 0, lineHeight: 1.55 }}>
        {item.body}
      </p>
    </article>);

}

function HyGroupBlock({ group, num, total, T, quirky }) {
  const standout = group.items.find((i) => i.standout) || group.items[0];
  const rest = group.items.filter((i) => i !== standout);
  return (
    <div style={{ padding: "32px 0", borderTop: `1px solid ${T.rule}` }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
          <span style={{ fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".22em", color: T.inkMute, textTransform: "uppercase" }}>
            {String(num).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <h3 style={{ fontFamily: HY_FONT.display, fontSize: 40 * T.displayScale, fontWeight: 500, color: T.ink, margin: 0, letterSpacing: "-.02em" }}>
            {group.title}.
          </h3>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: 18, alignItems: "stretch" }}>
        <HyStandoutCard item={standout} T={T} quirky={quirky} />
        {rest.map((it, i) =>
        <HyItemCard key={it.title} item={it} T={T} quirky={quirky} rotateDeg={i === 0 ? 1.5 : -1.2} />
        )}
      </div>
    </div>);

}

function HyMetaSection({ meta, num, T, quirky }) {
  return (
    <section style={{ position: "relative", padding: "80px 56px", background: T.bg, color: T.ink }}>
      <HyWaves color="rgba(26,23,20,0.04)" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <HyEyebrow T={T}>§ 0{num} — {meta.subtitle}</HyEyebrow>
            <h2 style={{
              fontFamily: HY_FONT.display, fontSize: 92 * T.displayScale, fontWeight: 500, lineHeight: 0.95, letterSpacing: "-.03em",
              margin: "8px 0 0", color: T.ink
            }}>
              {meta.title}<span style={{ color: T.trim }}>.</span>
            </h2>
            {quirky &&
            <div style={{ fontFamily: HY_FONT.body, fontStyle: "italic", fontSize: 16, color: T.inkDim, marginTop: 10, transform: "rotate(-1deg)", display: "inline-block" }}>
                slightly less serious from here on.
              </div>
            }
          </div>
        </div>
        {meta.groups.map((g, i) =>
        <HyGroupBlock key={g.id} group={g} num={i + 1} total={meta.groups.length} T={T} quirky={quirky} />
        )}
      </div>
    </section>);

}

// ────────────────────────────────────────────────────────────────────────────
// Principles — cream, simple
// ────────────────────────────────────────────────────────────────────────────

function HyValues({ T }) {
  const { engineering, creative } = VALUES;
  return (
    <section style={{ padding: "80px 56px", background: T.bgWarm, position: "relative" }}>
      <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
        <HyEyebrow T={T}>§ Principles</HyEyebrow>
        <h2 style={{ fontFamily: HY_FONT.display, fontSize: 64 * T.displayScale, fontWeight: 500, margin: "8px 0 28px", color: T.ink, letterSpacing: "-.02em" }}>
          What I look for in the <span style={{ fontStyle: "italic", color: T.trim }}>work,</span> and the <span style={{ fontStyle: "italic", color: T.trim }}>people.</span>
        </h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, marginTop: 8 }}>
        {[engineering, creative].map((v) =>
        <div key={v.label}>
            <HyEyebrow T={T}>{v.label}</HyEyebrow>
            <div style={{ marginTop: 14 }}>
              {v.points.map((p) =>
            <div key={p.k} style={{ padding: "18px 0", borderTop: `1px solid ${T.rule}`, display: "grid", gridTemplateColumns: "56px 1fr", gap: 18 }}>
                  <div style={{ fontFamily: HY_FONT.display, fontSize: 30, fontStyle: "italic", color: T.trim, lineHeight: 1 }}>{p.k}</div>
                  <div>
                    <div style={{ fontFamily: HY_FONT.body, fontSize: 18, fontWeight: 700, color: T.ink }}>{p.t}</div>
                    <div style={{ fontFamily: HY_FONT.body, fontSize: 14.5, color: T.inkDim, marginTop: 4, lineHeight: 1.55 }}>{p.d}</div>
                  </div>
                </div>
            )}
            </div>
          </div>
        )}
      </div>
    </section>);

}

// ────────────────────────────────────────────────────────────────────────────
// Footer — dark
// ────────────────────────────────────────────────────────────────────────────

function HyFooter({ T }) {
  return (
    <footer style={{ padding: "88px 56px 56px", background: T.dark, color: T.darkInk, position: "relative", overflow: "hidden" }}>
      <HyNoise />
      <div style={{ position: "relative", zIndex: 1 }}>
        <h2 style={{ fontFamily: HY_FONT.display, fontWeight: 500, fontSize: 140 * T.displayScale, lineHeight: 0.88, letterSpacing: "-.03em", margin: 0, color: T.darkInk }}>
          Let's <span style={{ fontStyle: "italic", color: T.accent }}>talk.</span>
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <a href={`mailto:${SITE.contact.email}`} style={{ fontFamily: HY_FONT.body, fontSize: 22, color: T.darkInk, textDecoration: "underline", textDecorationColor: T.accent, textUnderlineOffset: 6 }}>
              {SITE.contact.email}
            </a>
            <div style={{ display: "flex", gap: 24, fontFamily: HY_FONT.mono, fontSize: 12, color: T.darkDim, letterSpacing: ".14em", textTransform: "uppercase" }}>
              <a href={`https://${SITE.contact.github}`} style={{ color: "inherit" }}>GITHUB ↗</a>
              <a href={`https://${SITE.contact.linkedin}`} style={{ color: "inherit" }}>LINKEDIN ↗</a>
              <span>RESUME (PDF) ↗</span>
            </div>
          </div>
          <div style={{ textAlign: "right", fontFamily: HY_FONT.mono, fontSize: 11, letterSpacing: ".18em", color: T.darkMute, textTransform: "uppercase" }}>
            <div>Built in Toronto</div>
            <div style={{ marginTop: 6 }}>v2026.05</div>
          </div>
        </div>
      </div>
    </footer>);

}

// ────────────────────────────────────────────────────────────────────────────
// The full page composed
// ────────────────────────────────────────────────────────────────────────────

function HybridPage({ theme = {}, quirkyExperiences = true }) {
  const T = { ...HY_DEFAULT, ...theme };
  return (
    <div style={{ position: "relative", background: T.bg, color: T.ink, fontFamily: HY_FONT.body, overflow: "hidden" }}>
      <HyTopBar T={T} />
      <HyHero T={T} />
      <HyHorizontalTOC T={T} />
      {T.useFIntro && typeof window !== "undefined" && window.VariationF
        ? <window.VariationF />
        : <HyTransitionToDark T={T} />}
      <HyRobotics T={T} />
      <HySubprojectsCarousel T={T} />
      <HyTransitionToCream T={T} />
      <HyMetaSection meta={META_GROUPS[0]} num={4} T={T} />          {/* Academics */}
      <HyMetaSection meta={META_GROUPS[1]} num={5} T={T} />          {/* Well-rounded */}
      <HyMetaSection meta={META_GROUPS[2]} num={6} T={T} quirky={quirkyExperiences} />   {/* Experiences (quirky) */}
      <HyValues T={T} />
      <HyFooter T={T} />
    </div>);

}

if (typeof window !== "undefined") {
  Object.assign(window, {
    HybridPage, HY_DEFAULT, HY_FONT,
    HyHero, HyHorizontalTOC, HyRobotics, HySubprojectsCarousel,
    HyMetaSection, HyValues, HyFooter, HyTopBar,
    HyTransitionToDark, HyTransitionToCream
  });
}