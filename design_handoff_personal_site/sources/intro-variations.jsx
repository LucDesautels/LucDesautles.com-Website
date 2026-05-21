// Two test variations of the IMPACT/COMPETE intro section.
// Now using real Sailfish CAD renders. Wordmarks are formatted side-by-side,
// meeting in the middle: "Impactful Robotics" right-aligned, "Competitive
// Robotics" left-aligned, divided by a subtle vertical line.

const IC_TOK = {
  bg: "#f1ede3",
  bgWarm: "#e9e4d6",
  ink: "#1a1714",
  inkDim: "#5f5a51",
  inkMute: "#8d877b",
  rule: "rgba(26,23,20,0.14)",
  ruleSoft: "rgba(26,23,20,0.08)",
  accent: "#d96a36",
  heart: "#d54a1e",
  hand: "#c14a1f"
};

const IC_FONT = {
  display: "'Newsreader', Georgia, serif",
  techDisplay: "'Khand', 'Bebas Neue', Impact, sans-serif",
  body: "'Manrope', system-ui, sans-serif",
  mono: "'JetBrains Mono', ui-monospace, monospace",
  hand: "'Caveat', 'Permanent Marker', 'Comic Sans MS', cursive"
};

// ── Decorative wave background (Lando-style) ──────────────────────────────

function ICTopo({ color = "rgba(26,23,20,0.07)" }) {
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} preserveAspectRatio="none" viewBox="0 0 1280 900">
      <g fill="none" stroke={color} strokeWidth="1">
        <path d="M -100 180 C 200 100, 360 280, 620 210 S 1050 130, 1380 250" />
        <path d="M -100 320 C 180 250, 420 410, 720 330 S 1080 270, 1380 370" />
        <path d="M -100 480 C 200 400, 380 560, 660 490 S 1080 420, 1380 520" />
        <path d="M -100 630 C 200 560, 440 700, 720 630 S 1080 570, 1380 670" />
        <path d="M -100 100 C 240  50, 460 170, 760 100 S 1100  50, 1380 130" />
      </g>
    </svg>);

}

// Same wavy curves, but with each band BETWEEN curves filled progressively
// darker — fading from cream toward halfway-to-telemetry-dark.
function ICTopoBanded() {
  // 6 bands from cream → midpoint between cream (#f1ede3) and dark (#161412).
  // Linear interpolation in RGB space.
  const colors = [
    "#f1ede3", // 0 — cream
    "#dbd7cd", // 1
    "#c5c1b6", // 2
    "#afac9f", // 3
    "#999688", // 4
    "#838172", // 5 — halfway to telemetry-dark
  ];
  const stroke = "rgba(26,23,20,0.18)";

  // Curves sorted top-to-bottom by Y, so each successive fill darkens
  // everything below it.
  const curves = [
    "M -100 100 C 240  50, 460 170, 760 100 S 1100  50, 1380 130",
    "M -100 180 C 200 100, 360 280, 620 210 S 1050 130, 1380 250",
    "M -100 320 C 180 250, 420 410, 720 330 S 1080 270, 1380 370",
    "M -100 480 C 200 400, 380 560, 660 490 S 1080 420, 1380 520",
    "M -100 630 C 200 560, 440 700, 720 630 S 1080 570, 1380 670",
  ];

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} preserveAspectRatio="none" viewBox="0 0 1280 900">
      {/* Base — lightest cream covers the whole canvas */}
      <rect x="-100" y="0" width="1480" height="900" fill={colors[0]} />
      {/* Each successive band: a polygon that fills from the curve down to the bottom,
          painting darker than what's underneath. Drawn in order. */}
      {curves.map((c, i) =>
        <path key={i} d={`${c} L 1380 900 L -100 900 Z`} fill={colors[i + 1]} />
      )}
      {/* Curve strokes on top so the band edges read as drawn lines */}
      <g fill="none" stroke={stroke} strokeWidth="1">
        {curves.map((c, i) => <path key={i} d={c} />)}
      </g>
    </svg>
  );
}

// Like ICTopoBanded but ~1.5x more waves and bands run all the way down to
// the telemetry-dark gray (#161412), not just halfway.
function ICTopoBandedDeep() {
  // 9 bands from cream → telemetry-dark. Linear RGB interpolation in 8 steps.
  const colors = [
    "#f1ede3", // 0 — cream
    "#d6d2c9", // 1
    "#bab7af", // 2
    "#9f9c95", // 3
    "#84817a", // 4 — old endpoint (halfway)
    "#686660", // 5
    "#4d4a46", // 6
    "#312f2c", // 7
    "#161412", // 8 — telemetry dark
  ];
  const stroke = "rgba(26,23,20,0.18)";

  // 8 curves spread from near-top to near-bottom. Slight shape variation so
  // the rhythm doesn't read as mechanical.
  const curves = [
    "M -100  50 C 240  10, 460 100, 760  60 S 1100  20, 1380  80",
    "M -100 140 C 200  80, 360 200, 620 160 S 1050 110, 1380 200",
    "M -100 230 C 180 170, 420 300, 720 240 S 1080 180, 1380 280",
    "M -100 320 C 200 270, 360 400, 660 340 S 1080 290, 1380 380",
    "M -100 410 C 240 360, 460 510, 760 440 S 1100 380, 1380 470",
    "M -100 500 C 180 440, 380 580, 620 510 S 1080 450, 1380 550",
    "M -100 600 C 200 540, 440 690, 720 610 S 1080 550, 1380 650",
    "M -100 720 C 240 660, 380 810, 660 740 S 1080 680, 1380 760",
  ];

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} preserveAspectRatio="none" viewBox="0 0 1280 900">
      <rect x="-100" y="0" width="1480" height="900" fill={colors[0]} />
      {curves.map((c, i) =>
        <path key={i} d={`${c} L 1380 900 L -100 900 Z`} fill={colors[i + 1]} />
      )}
      <g fill="none" stroke={stroke} strokeWidth="1">
        {curves.map((c, i) => <path key={i} d={c} />)}
      </g>
    </svg>
  );
}

// Variation D — waves compressed into the bottom 40% of the viewport.
// Top 60% stays pure cream; the gradient-banded waves only live below.
function ICTopoBandedDeepCompressed() {
  const colors = [
    "#f1ede3", // 0 — cream (top 60%)
    "#d6d2c9",
    "#bab7af",
    "#9f9c95",
    "#84817a",
    "#686660",
    "#4d4a46",
    "#312f2c",
    "#161412", // 8 — telemetry dark
  ];
  const stroke = "rgba(26,23,20,0.18)";

  // 8 curves packed into y=540 → 850 (bottom 40% of 900px viewport).
  const curves = [
    "M -100 545 C 240 510, 460 580, 760 555 S 1100 525, 1380 575",
    "M -100 585 C 200 550, 360 620, 620 595 S 1050 560, 1380 615",
    "M -100 625 C 180 590, 420 670, 720 635 S 1080 600, 1380 655",
    "M -100 665 C 200 630, 360 710, 660 675 S 1080 640, 1380 695",
    "M -100 705 C 240 670, 460 770, 760 720 S 1100 685, 1380 735",
    "M -100 745 C 180 710, 380 810, 620 760 S 1080 715, 1380 775",
    "M -100 790 C 200 755, 440 860, 720 805 S 1080 760, 1380 820",
    "M -100 845 C 240 810, 380 900, 660 855 S 1080 810, 1380 870",
  ];

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} preserveAspectRatio="none" viewBox="0 0 1280 900">
      <rect x="-100" y="0" width="1480" height="900" fill={colors[0]} />
      {curves.map((c, i) =>
        <path key={i} d={`${c} L 1380 900 L -100 900 Z`} fill={colors[i + 1]} />
      )}
      <g fill="none" stroke={stroke} strokeWidth="1">
        {curves.map((c, i) => <path key={i} d={c} />)}
      </g>
    </svg>
  );
}

// Variation E — halftone dot-matrix transition.
// Dots grow in size and density from top to bottom over a cream→dark gradient.
// Adds an orange dashed "TRANSITION" register line through the middle.
function ICDotMatrix() {
  const cols = 36;
  const rows = 26;
  const colW = 1280 / cols;
  const rowH = 900 / rows;
  const dots = [];
  for (let r = 0; r <= rows; r++) {
    const rawFrac = r / rows;
    // Dots only start about halfway down — remap so above ~50% has no dots.
    if (rawFrac < 0.5) continue;
    const yFrac = (rawFrac - 0.5) * 2; // 0 → 1 across the bottom half
    for (let c = 0; c <= cols; c++) {
      // Hex grid offset
      const xOffset = r % 2 ? colW / 2 : 0;
      const cx = c * colW + xOffset;
      const cy = r * rowH;
      // Deterministic jitter so it doesn't look like a perfect grid
      const jitter = (((r * 7 + c * 13) % 7) - 3) * 0.4;
      const baseSize = Math.pow(yFrac, 1.3) * 22 + 1;
      const size = Math.max(0.4, baseSize + jitter);
      dots.push({ cx, cy, r: size, y: yFrac });
    }
  }
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} preserveAspectRatio="none" viewBox="0 0 1280 900">
      <defs>
        <linearGradient id="icDmGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1ede3" />
          <stop offset="0.5" stopColor="#f1ede3" />
          <stop offset="0.95" stopColor="#1d1a17" />
          <stop offset="1" stopColor="#161412" />
        </linearGradient>
      </defs>
      <rect x="-100" y="0" width="1480" height="900" fill="url(#icDmGrad)" />
      {dots.map((d, i) =>
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#161412" opacity={Math.max(0, 0.85 - d.y * 0.05)} />
      )}
      {/* Orange dashed register line at the dot-matrix start */}
      <line x1="0" y1="450" x2="1280" y2="450" stroke="#d96a36" strokeWidth="0.8" strokeDasharray="2 8" opacity="0.55" />
      <text x="40" y="442" fill="#d96a36" fontSize="9" fontFamily="JetBrains Mono, ui-monospace, monospace" letterSpacing="2" opacity="0.7">
        TRANSITION · CREAM → TELEMETRY
      </text>
      <text x="1240" y="442" textAnchor="end" fill="#d96a36" fontSize="9" fontFamily="JetBrains Mono, ui-monospace, monospace" letterSpacing="2" opacity="0.7">
        T · 50%
      </text>
    </svg>
  );
}

// Variation F — like E but hexagons instead of dots, starting at 75% down.
// Hex size grows toward the bottom; each hex has a deterministic varied
// opacity so the field reads as a textured fade.
function ICHexMatrix() {
  // Hex grid math. Pointy-top hex with "radius" r (center to vertex).
  // Horizontal spacing = √3 · r; vertical spacing = 1.5 · r; odd rows shift.
  const hexes = [];
  const startFrac = 0.75; // top 75% stays cream
  // Sweep r from small to large as we go down. We sample on a regular grid
  // sized for the AVERAGE hex (radius 22), then scale per-hex by yFrac.
  const baseR = 22;
  const dx = Math.sqrt(3) * baseR;
  const dy = 1.5 * baseR;
  const startY = 900 * startFrac;
  for (let row = 0, y = startY; y < 940; row++, y += dy) {
    const yFrac = (y / 900 - startFrac) / (1 - startFrac); // 0 → 1 across bottom 25%
    const xOff = (row % 2) * (dx / 2);
    for (let x = -dx; x < 1280 + dx * 2; x += dx) {
      const cx = x + xOff;
      const cy = y;
      // Deterministic per-cell varied size + opacity
      const seed = (row * 37 + Math.floor(cx / 7)) % 17;
      const sizeJitter = (seed - 8) * 0.05;     // ±0.4
      const opJitter = ((seed * 5) % 11) / 11;  // 0..1
      // Size grows from ~0.4× at top of band to ~1.6× at bottom
      const sizeMul = 0.4 + Math.pow(yFrac, 1.1) * 1.2 + sizeJitter;
      const r = Math.max(3, baseR * sizeMul);
      // Opacity ramps in but stays varied
      const opacity = Math.min(0.95, 0.15 + yFrac * 0.7 + opJitter * 0.25);
      // Pointy-top vertices
      const pts = [90, 150, 210, 270, 330, 30]
        .map(d => d * Math.PI / 180)
        .map(a => `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`)
        .join(" ");
      hexes.push({ pts, opacity });
    }
  }
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} preserveAspectRatio="none" viewBox="0 0 1280 900">
      <defs>
        <linearGradient id="icHexGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f1ede3" />
          <stop offset="0.75" stopColor="#f1ede3" />
          <stop offset="0.98" stopColor="#1d1a17" />
          <stop offset="1" stopColor="#161412" />
        </linearGradient>
      </defs>
      <rect x="-100" y="0" width="1480" height="900" fill="url(#icHexGrad)" />
      {hexes.map((h, i) =>
        <polygon key={i} points={h.pts} fill="#161412" opacity={h.opacity} />
      )}
      {/* Orange dashed register line at 75% */}
      <line x1="0" y1="675" x2="1280" y2="675" stroke="#d96a36" strokeWidth="0.8" strokeDasharray="2 8" opacity="0.55" />
      <text x="40" y="667" fill="#d96a36" fontSize="9" fontFamily="JetBrains Mono, ui-monospace, monospace" letterSpacing="2" opacity="0.7">
        TRANSITION · CREAM → TELEMETRY
      </text>
      <text x="1240" y="667" textAnchor="end" fill="#d96a36" fontSize="9" fontFamily="JetBrains Mono, ui-monospace, monospace" letterSpacing="2" opacity="0.7">
        T · 75%
      </text>
    </svg>
  );
}

// ── Hand-drawn heart over "Impactful" ─────────────────────────────────────

function ICHeart({ size = 90, color = IC_TOK.heart, style }) {
  return (
    <svg width={size} height={size * 0.92} viewBox="0 0 100 92" style={style}>
      <g fill="none" stroke={color} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 82 C 22 64, 6 38, 24 18 C 36 7, 50 18, 50 32 C 50 19, 64 6, 76 17 C 95 36, 80 62, 51 81" />
        <path d="M50 78 C 26 62, 12 40, 27 22 C 36 13, 48 21, 50 30" opacity="0.45" />
      </g>
    </svg>);

}

// ── Handwritten label ─────────────────────────────────────────────────────

function ICHandLabel({ children, color = IC_TOK.hand, size = 56, rotate = -6, underline = true, style, align = "left" }) {
  return (
    <div style={{
      fontFamily: IC_FONT.hand, fontSize: size, color, lineHeight: 0.95,
      transform: `rotate(${rotate}deg)`, transformOrigin: align === "right" ? "right center" : "left center",
      whiteSpace: "nowrap", display: "inline-block", ...style
    }}>
      <div style={{ position: "relative", paddingBottom: underline ? 2 : 0 }}>
        {children}
        {underline &&
        <svg style={{ position: "absolute", left: -4, right: 0, bottom: -8, width: "105%", height: 14, overflow: "visible" }} viewBox="0 0 200 14" preserveAspectRatio="none">
            <path d="M2 8 C 50 2, 120 12, 198 5" stroke={color} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </svg>
        }
      </div>
    </div>);

}

// ── CAD image wrappers ────────────────────────────────────────────────────

// Front-view: rotate 180° (fuselage up) then rotate 45° clockwise = 225° total.
function ICFrontView({ size = 900, style }) {
  return (
    <img
      src="assets/sailfish-front-exploded.png"
      alt="Sailfish front exploded view"
      style={{
        width: size, height: "auto", display: "block",
        transform: "rotate(225deg)",
        transformOrigin: "center center",
        ...style
      }} />);


}

// 3D view: mirrored vertically (flip top-bottom).
function IC3DView({ size = 900, style }) {
  return (
    <img
      src="assets/sailfish-3d-exploded.png"
      alt="Sailfish 3D exploded view"
      style={{
        width: size, height: "auto", display: "block",
        transform: "scaleY(-1)",
        transformOrigin: "center center",
        ...style
      }} />);


}

// ════════════════════════════════════════════════════════════════════════════
// Shared wordmark: "Impactful Robotics  |  Competitive Robotics"
// Left side right-aligned, right side left-aligned, vertical divider.
// ════════════════════════════════════════════════════════════════════════════

function ICWordmarkInline({ size = 96, robotSize = 44, divider = true }) {
  return (
    <div style={{
      position: "relative", zIndex: 3,
      display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center",
      gap: 0, maxWidth: 1200, margin: "0 auto"
    }}>
      {/* Left: IMPACTFUL ROBOTICS, right-aligned, with heart over IMPACTFUL */}
      <div style={{ position: "relative", textAlign: "right", paddingRight: 36, padding: "0px 18px 0px 0px" }}>
        <div style={{ position: "absolute", right: 36, top: -size * 0.55, transform: "rotate(-8deg)" }}>
          <ICHeart size={size * 0.78} />
        </div>
        <div style={{
          fontFamily: IC_FONT.techDisplay, fontWeight: 700, fontSize: size, lineHeight: 0.88,
          letterSpacing: "-.03em", color: IC_TOK.ink, textTransform: "uppercase"
        }}>
          IMPACTFUL
        </div>
        <div style={{
          fontFamily: IC_FONT.techDisplay, fontWeight: 500, fontSize: robotSize, lineHeight: 1,
          letterSpacing: ".02em", color: IC_TOK.inkDim, textTransform: "uppercase", marginTop: 4
        }}>
          ROBOTICS
        </div>
      </div>

      {/* Divider */}
      <div style={{
        width: divider ? 1 : 0, height: size * 1.5,
        background: IC_TOK.rule, alignSelf: "center", margin: "0 0"
      }} />

      {/* Right: COMPETITIVE ROBOTICS, left-aligned */}
      <div style={{ textAlign: "left", paddingLeft: 36, padding: "0px 0px 0px 18px" }}>
        <div style={{
          fontFamily: IC_FONT.techDisplay, fontWeight: 700, fontSize: size, lineHeight: 0.88,
          letterSpacing: "-.03em", color: IC_TOK.ink, textTransform: "uppercase"
        }}>
          COMPETITIVE
        </div>
        <div style={{
          fontFamily: IC_FONT.techDisplay, fontWeight: 500, fontSize: robotSize, lineHeight: 1,
          letterSpacing: ".02em", color: IC_TOK.inkDim, textTransform: "uppercase", marginTop: 4
        }}>
          ROBOTICS
        </div>
      </div>
    </div>);

}

// ════════════════════════════════════════════════════════════════════════════
// VARIATION A — Open Lando layout
// Big wordmark centered, real CADs slide in from each side, handwritten
// project labels at angles, generous whitespace.
// ════════════════════════════════════════════════════════════════════════════

function VariationA() {
  return (
    <section style={{
      position: "relative", background: IC_TOK.bg, color: IC_TOK.ink,
      fontFamily: IC_FONT.body, minHeight: 900, overflow: "hidden"
    }}>
      <ICTopo />

      {/* Top eyebrow row */}
      <div style={{
        position: "relative", padding: "28px 56px 0", display: "flex",
        alignItems: "center", justifyContent: "space-between", zIndex: 5
      }}>
        <div style={{ fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".22em", color: IC_TOK.inkMute, textTransform: "uppercase" }}>
          § 02 — Robotics
        </div>
        <div style={{ fontFamily: IC_FONT.mono, fontSize: 10, letterSpacing: ".22em", color: IC_TOK.inkMute, textTransform: "uppercase" }}>
          Scroll · then dive into a project
        </div>
      </div>

      {/* LEFT IMAGE — front-view rotated, anchored off the left edge */}
      <div style={{ position: "absolute", left: -220, top: 180, zIndex: 1, pointerEvents: "none" }}>
        <ICFrontView size={950} />
      </div>
      {/* Handwritten "Project Sailfish" over the left CAD */}
      <div style={{ position: "absolute", left: 80, top: 540, zIndex: 4 }}>
        <ICHandLabel rotate={-8} size={64}>Project Sailfish</ICHandLabel>
      </div>

      {/* RIGHT IMAGE — 3D mirrored vertically, half popping out from the right */}
      <div style={{ position: "absolute", right: -280, top: 170, zIndex: 1, pointerEvents: "none" }}>
        <IC3DView size={1000} />
      </div>
      <div style={{ position: "absolute", right: 80, top: 560, zIndex: 4, textAlign: "right" }}>
        <ICHandLabel rotate={8} size={64} align="right">FTC Team 16366</ICHandLabel>
      </div>

      {/* Center wordmark */}
      <div style={{ position: "relative", marginTop: 170, zIndex: 3 }}>
        <ICWordmarkInline size={104} robotSize={48} />
      </div>

      {/* Two-column blurbs */}
      <div style={{
        position: "relative", zIndex: 3, display: "grid", gridTemplateColumns: "1fr 1fr",
        columnGap: 60, padding: "110px 120px 56px", maxWidth: 1200, margin: "0 auto"
      }}>
        <div style={{ paddingRight: 36, textAlign: "right" }}>
          <p style={{ fontFamily: IC_FONT.body, fontSize: 17, lineHeight: 1.5, color: IC_TOK.inkDim, margin: 0, textWrap: "pretty" }}>
            A low-cost, open-sourced autonomous marine SAR drone. Three generations of mechanical, electrical, and software work.
          </p>
          <button style={{
            marginTop: 22, width: 48, height: 48, borderRadius: 8,
            background: IC_TOK.accent, color: "#fff", border: "none",
            fontSize: 20, cursor: "pointer"
          }}>↳</button>
        </div>
        <div style={{ paddingLeft: 36 }}>
          <p style={{ fontFamily: IC_FONT.body, fontSize: 17, lineHeight: 1.5, color: IC_TOK.inkDim, margin: 0, textWrap: "pretty" }}>
            Five years in FIRST Tech Challenge — competitor, mechanical lead, mentor. Ontario Inspire Award and Worlds in Houston.
          </p>
          <button style={{
            marginTop: 22, width: 48, height: 48, borderRadius: 8,
            background: IC_TOK.accent, color: "#fff", border: "none",
            fontSize: 20, cursor: "pointer"
          }}>↳</button>
        </div>
      </div>
    </section>);

}

// ════════════════════════════════════════════════════════════════════════════
// VARIATION B — Tighter overlap, beefier wordmark, images set deeper
// ════════════════════════════════════════════════════════════════════════════

function VariationB() {
  return (
    <section style={{
      position: "relative", background: IC_TOK.bgWarm, color: IC_TOK.ink,
      fontFamily: IC_FONT.body, minHeight: 900, overflow: "hidden"
    }}>
      <ICTopoBanded />

      <div style={{
        position: "relative", padding: "28px 56px 0", display: "flex",
        alignItems: "center", justifyContent: "space-between", zIndex: 5
      }}>
        <div style={{ fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".22em", color: IC_TOK.inkMute, textTransform: "uppercase" }}>
          § 02 — Robotics
        </div>
        <div style={{ fontFamily: IC_FONT.mono, fontSize: 10, letterSpacing: ".22em", color: IC_TOK.inkMute, textTransform: "uppercase" }}>
          Two programs · one workshop
        </div>
      </div>

      {/* LEFT IMAGE — zoomed in significantly, moved up, OK if wing is cropped */}
      <div style={{ position: "absolute", left: -400, top: 80, zIndex: 1, pointerEvents: "none" }}>
        <ICFrontView size={1400} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 600, zIndex: 4 }}>
        <ICHandLabel rotate={-40} size={56}>Project Sailfish</ICHandLabel>
      </div>

      {/* RIGHT IMAGE — pushed 20% further right (less visible), moved up above COMPETITIVE */}
      <div style={{ position: "absolute", right: -560, top: 80, zIndex: 1, pointerEvents: "none" }}>
        <IC3DView size={1100} />
      </div>
      <div style={{ position: "absolute", right: 120, top: 600, zIndex: 4, textAlign: "right" }}>
        <ICHandLabel rotate={40} size={56} align="right">FTC Team 16366</ICHandLabel>
      </div>

      {/* Wordmark — same size as Variation A, vertically centered in viewport */}
      <div style={{ position: "relative", marginTop: 300, zIndex: 3 }}>
        <ICWordmarkInline size={104} robotSize={48} />
      </div>

      {/* Blurbs — tighter padding so they don't push wordmark off-center */}
      <div style={{
        position: "relative", zIndex: 3, display: "grid", gridTemplateColumns: "1fr 1fr",
        columnGap: 60, padding: "48px 120px 56px", maxWidth: 1200, margin: "0 auto"
      }}>
        <div style={{ paddingRight: 36, textAlign: "right" }}>
          <p style={{ fontFamily: IC_FONT.body, fontSize: 17, lineHeight: 1.5, color: IC_TOK.inkDim, margin: 0, textWrap: "pretty" }}>
            Three generations of an open-sourced autonomous SAR drone.<br />
            <em>Built to reach lost crews faster.</em>
          </p>
          <button style={{
            marginTop: 18, padding: "10px 14px",
            background: "transparent", color: IC_TOK.accent,
            border: `2px solid ${IC_TOK.accent}`, cursor: "pointer",
            fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600
          }}>↳ Project Sailfish</button>
        </div>
        <div style={{ paddingLeft: 36 }}>
          <p style={{ fontFamily: IC_FONT.body, fontSize: 17, lineHeight: 1.5, color: IC_TOK.inkDim, margin: 0, textWrap: "pretty" }}>
            Five years FTC — competitor, mechanical lead, mentor.<br />
            <em>Ontario Inspire 2024 + Worlds, Houston.</em>
          </p>
          <button style={{
            marginTop: 18, padding: "10px 14px",
            background: "transparent", color: IC_TOK.accent,
            border: `2px solid ${IC_TOK.accent}`, cursor: "pointer",
            fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600
          }}>↳ FTC Team 16366</button>
        </div>
      </div>
    </section>);

}

// ════════════════════════════════════════════════════════════════════════════
// VARIATION C — Same layout as B, deeper banded background.
// ~1.5x as many waves; bands run all the way to telemetry-dark.
// ════════════════════════════════════════════════════════════════════════════

function VariationC() {
  return (
    <section style={{
      position: "relative", background: IC_TOK.bgWarm, color: IC_TOK.ink,
      fontFamily: IC_FONT.body, minHeight: 900, overflow: "hidden"
    }}>
      <ICTopoBandedDeep />

      <div style={{
        position: "relative", padding: "28px 56px 0", display: "flex",
        alignItems: "center", justifyContent: "space-between", zIndex: 5
      }}>
        <div style={{ fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".22em", color: IC_TOK.inkMute, textTransform: "uppercase" }}>
          § 02 — Robotics
        </div>
        <div style={{ fontFamily: IC_FONT.mono, fontSize: 10, letterSpacing: ".22em", color: IC_TOK.inkMute, textTransform: "uppercase" }}>
          Two programs · one workshop
        </div>
      </div>

      <div style={{ position: "absolute", left: -400, top: 80, zIndex: 1, pointerEvents: "none" }}>
        <ICFrontView size={1400} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 600, zIndex: 4 }}>
        <ICHandLabel rotate={-40} size={56}>Project Sailfish</ICHandLabel>
      </div>

      <div style={{ position: "absolute", right: -560, top: 80, zIndex: 1, pointerEvents: "none" }}>
        <IC3DView size={1100} />
      </div>
      <div style={{ position: "absolute", right: 120, top: 600, zIndex: 4, textAlign: "right" }}>
        <ICHandLabel rotate={40} size={56} align="right">FTC Team 16366</ICHandLabel>
      </div>

      <div style={{ position: "relative", marginTop: 300, zIndex: 3 }}>
        <ICWordmarkInline size={104} robotSize={48} />
      </div>

      <div style={{
        position: "relative", zIndex: 3, display: "grid", gridTemplateColumns: "1fr 1fr",
        columnGap: 60, padding: "48px 120px 56px", maxWidth: 1200, margin: "0 auto"
      }}>
        <div style={{ paddingRight: 36, textAlign: "right" }}>
          <p style={{ fontFamily: IC_FONT.body, fontSize: 17, lineHeight: 1.5, color: IC_TOK.inkDim, margin: 0, textWrap: "pretty" }}>
            Three generations of an open-sourced autonomous SAR drone.<br />
            <em>Built to reach lost crews faster.</em>
          </p>
          <button style={{
            marginTop: 18, padding: "10px 14px",
            background: "transparent", color: IC_TOK.accent,
            border: `2px solid ${IC_TOK.accent}`, cursor: "pointer",
            fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600
          }}>↳ Project Sailfish</button>
        </div>
        <div style={{ paddingLeft: 36 }}>
          <p style={{ fontFamily: IC_FONT.body, fontSize: 17, lineHeight: 1.5, color: IC_TOK.inkDim, margin: 0, textWrap: "pretty" }}>
            Five years FTC — competitor, mechanical lead, mentor.<br />
            <em>Ontario Inspire 2024 + Worlds, Houston.</em>
          </p>
          <button style={{
            marginTop: 18, padding: "10px 14px",
            background: "transparent", color: IC_TOK.accent,
            border: `2px solid ${IC_TOK.accent}`, cursor: "pointer",
            fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600
          }}>↳ FTC Team 16366</button>
        </div>
      </div>
    </section>);

}


// ════════════════════════════════════════════════════════════════════════════
// VARIATION D — Same layout as B/C, but waves only live in the bottom 40%.
// Top 60% stays plain cream; the gradient-banded waves cascade beneath.
// ════════════════════════════════════════════════════════════════════════════

function VariationD() {
  return (
    <section style={{
      position: "relative", background: IC_TOK.bg, color: IC_TOK.ink,
      fontFamily: IC_FONT.body, minHeight: 900, overflow: "hidden"
    }}>
      <ICTopoBandedDeepCompressed />

      <div style={{
        position: "relative", padding: "28px 56px 0", display: "flex",
        alignItems: "center", justifyContent: "space-between", zIndex: 5
      }}>
        <div style={{ fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".22em", color: IC_TOK.inkMute, textTransform: "uppercase" }}>
          § 02 — Robotics
        </div>
        <div style={{ fontFamily: IC_FONT.mono, fontSize: 10, letterSpacing: ".22em", color: IC_TOK.inkMute, textTransform: "uppercase" }}>
          Two programs · one workshop
        </div>
      </div>

      <div style={{ position: "absolute", left: -400, top: 80, zIndex: 1, pointerEvents: "none" }}>
        <ICFrontView size={1400} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 600, zIndex: 4 }}>
        <ICHandLabel rotate={-40} size={56}>Project Sailfish</ICHandLabel>
      </div>

      <div style={{ position: "absolute", right: -560, top: 80, zIndex: 1, pointerEvents: "none" }}>
        <IC3DView size={1100} />
      </div>
      <div style={{ position: "absolute", right: 120, top: 600, zIndex: 4, textAlign: "right" }}>
        <ICHandLabel rotate={40} size={56} align="right">FTC Team 16366</ICHandLabel>
      </div>

      <div style={{ position: "relative", marginTop: 300, zIndex: 3 }}>
        <ICWordmarkInline size={104} robotSize={48} />
      </div>

      <div style={{
        position: "relative", zIndex: 3, display: "grid", gridTemplateColumns: "1fr 1fr",
        columnGap: 60, padding: "48px 120px 56px", maxWidth: 1200, margin: "0 auto"
      }}>
        <div style={{ paddingRight: 36, textAlign: "right" }}>
          <p style={{ fontFamily: IC_FONT.body, fontSize: 17, lineHeight: 1.5, color: IC_TOK.inkDim, margin: 0, textWrap: "pretty" }}>
            Three generations of an open-sourced autonomous SAR drone.<br />
            <em>Built to reach lost crews faster.</em>
          </p>
          <button style={{
            marginTop: 18, padding: "10px 14px",
            background: "transparent", color: IC_TOK.accent,
            border: `2px solid ${IC_TOK.accent}`, cursor: "pointer",
            fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600
          }}>↳ Project Sailfish</button>
        </div>
        <div style={{ paddingLeft: 36 }}>
          <p style={{ fontFamily: IC_FONT.body, fontSize: 17, lineHeight: 1.5, color: IC_TOK.inkDim, margin: 0, textWrap: "pretty" }}>
            Five years FTC — competitor, mechanical lead, mentor.<br />
            <em>Ontario Inspire 2024 + Worlds, Houston.</em>
          </p>
          <button style={{
            marginTop: 18, padding: "10px 14px",
            background: "transparent", color: IC_TOK.accent,
            border: `2px solid ${IC_TOK.accent}`, cursor: "pointer",
            fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600
          }}>↳ FTC Team 16366</button>
        </div>
      </div>
    </section>);

}

// ════════════════════════════════════════════════════════════════════════════
// VARIATION E — Halftone dot-matrix transition.
// Same layout as B, but the cream→dark transition is a halftone field of
// dots growing in size from top to bottom over a vertical gradient, with an
// orange dashed register line through the middle.
// ════════════════════════════════════════════════════════════════════════════

function VariationE() {
  return (
    <section style={{
      position: "relative", background: IC_TOK.bg, color: IC_TOK.ink,
      fontFamily: IC_FONT.body, minHeight: 900, overflow: "hidden"
    }}>
      <ICDotMatrix />

      <div style={{
        position: "relative", padding: "28px 56px 0", display: "flex",
        alignItems: "center", justifyContent: "space-between", zIndex: 5
      }}>
        <div style={{ fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".22em", color: IC_TOK.inkMute, textTransform: "uppercase" }}>
          § 02 — Robotics
        </div>
        <div style={{ fontFamily: IC_FONT.mono, fontSize: 10, letterSpacing: ".22em", color: IC_TOK.inkMute, textTransform: "uppercase" }}>
          Two programs · one workshop
        </div>
      </div>

      <div style={{ position: "absolute", left: -400, top: 80, zIndex: 1, pointerEvents: "none" }}>
        <ICFrontView size={1400} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 600, zIndex: 4 }}>
        <ICHandLabel rotate={-40} size={56}>Project Sailfish</ICHandLabel>
      </div>

      <div style={{ position: "absolute", right: -560, top: 80, zIndex: 1, pointerEvents: "none" }}>
        <IC3DView size={1100} />
      </div>
      <div style={{ position: "absolute", right: 120, top: 600, zIndex: 4, textAlign: "right" }}>
        <ICHandLabel rotate={40} size={56} align="right">FTC Team 16366</ICHandLabel>
      </div>

      <div style={{ position: "relative", marginTop: 300, zIndex: 3 }}>
        <ICWordmarkInline size={104} robotSize={48} />
      </div>

      <div style={{
        position: "relative", zIndex: 3, display: "grid", gridTemplateColumns: "1fr 1fr",
        columnGap: 60, padding: "48px 120px 56px", maxWidth: 1200, margin: "0 auto"
      }}>
        <div style={{ paddingRight: 36, textAlign: "right" }}>
          <p style={{ fontFamily: IC_FONT.body, fontSize: 17, lineHeight: 1.5, color: IC_TOK.inkDim, margin: 0, textWrap: "pretty" }}>
            Three generations of an open-sourced autonomous SAR drone.<br />
            <em>Built to reach lost crews faster.</em>
          </p>
          <button style={{
            marginTop: 18, padding: "10px 14px",
            background: "transparent", color: IC_TOK.accent,
            border: `2px solid ${IC_TOK.accent}`, cursor: "pointer",
            fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600
          }}>↳ Project Sailfish</button>
        </div>
        <div style={{ paddingLeft: 36 }}>
          <p style={{ fontFamily: IC_FONT.body, fontSize: 17, lineHeight: 1.5, color: IC_TOK.inkDim, margin: 0, textWrap: "pretty" }}>
            Five years FTC — competitor, mechanical lead, mentor.<br />
            <em>Ontario Inspire 2024 + Worlds, Houston.</em>
          </p>
          <button style={{
            marginTop: 18, padding: "10px 14px",
            background: "transparent", color: IC_TOK.accent,
            border: `2px solid ${IC_TOK.accent}`, cursor: "pointer",
            fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600
          }}>↳ FTC Team 16366</button>
        </div>
      </div>
    </section>);

}


// ════════════════════════════════════════════════════════════════════════════
// VARIATION F — Like E, but hexagons of varied size + opacity, starting 75% down.
// ════════════════════════════════════════════════════════════════════════════

function VariationF() {
  return (
    <section style={{
      position: "relative", background: IC_TOK.bg, color: IC_TOK.ink,
      fontFamily: IC_FONT.body, minHeight: 900, overflow: "hidden"
    }}>
      <ICHexMatrix />

      <div style={{
        position: "relative", padding: "28px 56px 0", display: "flex",
        alignItems: "center", justifyContent: "space-between", zIndex: 5
      }}>
        <div style={{ fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".22em", color: IC_TOK.inkMute, textTransform: "uppercase" }}>
          § 02 — Robotics
        </div>
        <div style={{ fontFamily: IC_FONT.mono, fontSize: 10, letterSpacing: ".22em", color: IC_TOK.inkMute, textTransform: "uppercase" }}>
          Two programs · one workshop
        </div>
      </div>

      <div style={{ position: "absolute", left: -400, top: 80, zIndex: 1, pointerEvents: "none" }}>
        <ICFrontView size={1400} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 600, zIndex: 4 }}>
        <ICHandLabel rotate={-40} size={56}>Project Sailfish</ICHandLabel>
      </div>

      <div style={{ position: "absolute", right: -560, top: 80, zIndex: 1, pointerEvents: "none" }}>
        <IC3DView size={1100} />
      </div>
      <div style={{ position: "absolute", right: 120, top: 600, zIndex: 4, textAlign: "right" }}>
        <ICHandLabel rotate={40} size={56} align="right">FTC Team 16366</ICHandLabel>
      </div>

      <div style={{ position: "relative", marginTop: 300, zIndex: 3 }}>
        <ICWordmarkInline size={104} robotSize={48} />
      </div>

      <div style={{
        position: "relative", zIndex: 3, display: "grid", gridTemplateColumns: "1fr 1fr",
        columnGap: 60, padding: "48px 120px 56px", maxWidth: 1200, margin: "0 auto"
      }}>
        <div style={{ paddingRight: 36, textAlign: "right" }}>
          <p style={{ fontFamily: IC_FONT.body, fontSize: 17, lineHeight: 1.5, color: IC_TOK.inkDim, margin: 0, textWrap: "pretty" }}>
            Three generations of an open-sourced autonomous SAR drone.<br />
            <em>Built to reach lost crews faster.</em>
          </p>
          <button style={{
            marginTop: 18, padding: "10px 14px",
            background: "transparent", color: IC_TOK.accent,
            border: `2px solid ${IC_TOK.accent}`, cursor: "pointer",
            fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600
          }}>↳ Project Sailfish</button>
        </div>
        <div style={{ paddingLeft: 36 }}>
          <p style={{ fontFamily: IC_FONT.body, fontSize: 17, lineHeight: 1.5, color: IC_TOK.inkDim, margin: 0, textWrap: "pretty" }}>
            Five years FTC — competitor, mechanical lead, mentor.<br />
            <em>Ontario Inspire 2024 + Worlds, Houston.</em>
          </p>
          <button style={{
            marginTop: 18, padding: "10px 14px",
            background: "transparent", color: IC_TOK.accent,
            border: `2px solid ${IC_TOK.accent}`, cursor: "pointer",
            fontFamily: IC_FONT.mono, fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", fontWeight: 600
          }}>↳ FTC Team 16366</button>
        </div>
      </div>
    </section>);

}


if (typeof window !== "undefined") {
  Object.assign(window, { VariationA, VariationB, VariationC, VariationD, VariationE, VariationF, ICHeart, ICHandLabel, ICFrontView, IC3DView });
}