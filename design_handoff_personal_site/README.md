# Handoff — Luc Desautels Personal Portfolio (Main Page)

## Overview

This package contains the design references for Luc Desautels' personal portfolio
homepage. Luc is a high‑school engineer focused on robotics (Project Sailfish — an
open‑sourced marine SAR drone — and FTC Team 16366), with side interests in
academics/research, rock climbing, drone videography, violin, scouts, and
side‑quest stunts. The homepage is intentionally a *single* main page where
different audiences (employers, co‑founders, teammates, friends) can skim the
work and dive into dedicated sub‑pages (Sailfish, FTC, Drone Videography,
Résumé) without losing context.

The design is a *hybrid* of two influences:

- **Lando Norris' personal site** — cream/editorial landing, a horizontal-scroll
  photo strip that doubles as a table of contents, a centered side‑by‑side
  "Impactful Robotics / Competitive Robotics" wordmark, handwritten
  annotations.
- **Project Sailfish** — dark technical telemetry style for the robotics
  detail panels: noisy warm‑grey background, JetBrains Mono labels, Khand
  display type, orange accent (#d96a36).

The site flows cream → dark in one direction (down the hero into the robotics
detail section) and then back to cream for academics / well‑rounded /
experiences. The visual transition between cream and dark is itself a
designed moment — a hex‑tile field that fades in starting at ~75% down the
viewport in the chosen direction (`V3` with Variation F intro).

## About the Design Files

Everything in `sources/` is a **design reference**, not production code. The
files are React‑in‑HTML prototypes using inline `<script type="text/babel">`
tags, single‑file CSS, no build step. They exist so you can see exactly what
the layout, type, color, motion, and interactions should look and feel like.

The job is to **recreate these designs in the target codebase using its
established patterns and libraries**. If no codebase exists yet, the
recommended choice for this project is **Astro with React islands** — it's a
content/portfolio‑shaped problem with one heavily interactive section (the
horizontal-scroll TOC), so SSG with selective hydration is the cleanest fit.
**Next.js (App Router)** is an equally fine alternative if SSR/route handlers
are needed for the dedicated sub‑pages.

Do not just copy the HTML files into a project. Treat them as the spec.

## Fidelity

This is **high fidelity** for the main page. Final colors, type, spacing,
copy, interactions, and visual moments are decided. The hero portrait, the
horizontal‑scroll photo TOC tiles, the FTC robot CAD, and a few other
placeholder images are clearly labelled `REPLACE: …` — these are stand‑ins
the user will supply later. Implement the slots so the user can drop those
in without restructuring.

## Recommended Stack

- **Framework**: Astro 4+ with React islands, or Next.js 14+ (App Router)
- **Styling**: Tailwind CSS with a custom config that mirrors the design
  tokens below, or vanilla CSS variables — your call, but be disciplined
  about tokens
- **Fonts**: Google Fonts — Khand (display sans), Newsreader (display
  serif), Manrope (body sans), JetBrains Mono (labels), Caveat (handwritten
  annotations). Self‑host with `next/font` or `@fontsource/*`.
- **Animation**: Framer Motion or vanilla CSS transitions — there is almost
  no motion in the current design; what exists is scroll‑driven (horizontal
  TOC drag, cream‑to‑dark transition).
- **Image handling**: AVIF/WebP with `next/image` or Astro's `<Image>`. The
  CAD renders are large transparent PNGs — convert to WebP.

## Page Map

The page is composed of these sections, top to bottom. Each is described in
detail further down. The full canonical sequence lives in `sources/hybrid.jsx`
in the `HybridPage` function.

1. **Top bar / nav** — name, dedicated‑page links, copy‑email button, résumé
   button, LinkedIn icon
2. **Hero** — big name, polaroid trio, meta row, content‑filter pills
3. **Horizontal‑scroll TOC** — 4 horizontally‑scrolling sections (Academics,
   Robotics, Well‑rounded, Experiences); doubles as table of contents
4. **Impact / Compete intro** — cream → dark transition section with the
   IMPACTFUL ROBOTICS / COMPETITIVE ROBOTICS wordmark, hex‑tile background,
   two CAD renders sliding in from each side, handwritten project labels
5. **Robotics detail panels** — dark telemetry side‑by‑side (Sailfish | FTC)
   with existing lightbox component slot, quick info, and four labelled
   rows per program
6. **Robotics sub‑projects carousel** — dark, horizontal scroll, with
   engineering‑domain filter chips (Mechanical / Electrical / CAD /
   Manufacturing / Materials / Software)
7. **Dark → cream transition gradient**
8. **Academics** (Education + Research) — cream, with a "standout" item
   highlighted in each group of three
9. **Well‑rounded** (Sports + Creatives + Scouts) — cream
10. **Experiences** (Summer Programs + Side Quests) — cream, with a slight
    "quirky" tilt on the cards (this section is allowed to feel less serious)
11. **Principles** — cream, two columns of three principles each
    (engineering values + creative/team values)
12. **Footer** — dark, big "Let's talk." with email + GitHub + LinkedIn

## Design Tokens

### Colors

```
/* Cream side (editorial) */
--bg:        #f1ede3   /* primary cream background */
--bg-warm:   #e9e4d6   /* slightly warmer cream — used as section variation */
--ink:       #1a1714   /* primary text on cream */
--ink-dim:   #5f5a51   /* body / secondary text */
--ink-mute:  #8d877b   /* tertiary text / mono labels */
--rule:      rgba(26,23,20,0.14)   /* hairline borders */
--rule-soft: rgba(26,23,20,0.08)   /* softer hairlines */
--accent:    #d96a36   /* Sailfish orange — primary brand accent */
--accent-ink:#ffffff   /* text on accent fills */
--trim:      #d96a36   /* small accents on cream side — same as accent in V3 */

/* Dark side (telemetry) */
--dark:        #161412   /* primary dark background */
--dark-panel:  rgba(255,255,255,0.025)
--dark-ink:    #f4ede2   /* primary text on dark */
--dark-dim:    #a8a097   /* body text on dark */
--dark-mute:   #6f675e   /* mono labels on dark */
--dark-line:   rgba(255,255,255,0.10)
--dark-line-soft: rgba(255,255,255,0.06)

/* Handwritten / decorative */
--hand:        #c14a1f  /* handwritten Caveat labels */
--heart:       #d54a1e  /* hand-drawn heart over IMPACTFUL */
```

### Hex‑tile gradient palette (cream → dark transition)

The Impact/Compete section uses a 9‑step linear RGB interpolation from
cream to telemetry‑dark. These are the hex stops used in the gradient
background fill (top to bottom):

```
#f1ede3  #d6d2c9  #bab7af  #9f9c95  #84817a  #686660  #4d4a46  #312f2c  #161412
```

The hex pattern itself uses pointy‑top hexagons of radius `~22px` tessellated
at `√3·r` × `1.5·r` spacing, with hex sizes scaling from `0.4×` at the top of
the hex band to `1.6×` at the bottom, and opacity ramping `0.15 → 0.95` plus
deterministic per‑cell jitter. The hex field starts at exactly **75% down**
the viewport. See `ICHexMatrix` in `sources/intro-variations.jsx` for the
exact algorithm — port it directly.

### Typography

```
display-serif: 'Newsreader', Georgia, serif       /* hero name, section heads on cream */
display-tech:  'Khand', 'Bebas Neue', Impact      /* IMPACTFUL / COMPETITIVE / ROBOTICS wordmarks, dark section heads */
body:          'Manrope', system-ui, sans-serif   /* body copy everywhere */
mono:          'JetBrains Mono', ui-monospace     /* eyebrows, labels, technical readouts */
hand:          'Caveat', 'Permanent Marker'       /* handwritten annotations */
```

Type scale (the values actually used — port these literally, don't invent a
new scale):

| Use                            | Family    | Size  | Weight | Notes                            |
|--------------------------------|-----------|-------|--------|----------------------------------|
| Hero name "Luc Desautels."     | Newsreader | 168px | 500 / 400 italic | line-height 0.9, letter -0.028em |
| Section H2 on cream            | Newsreader | 92px  | 500    | line-height 0.95, letter -0.03em |
| Section H2 on dark             | Khand      | 64px  | 600    | uppercase, letter -0.01em        |
| ROBOTICS wordmark              | Khand      | 220px | 700    | uppercase, letter -0.04em        |
| IMPACTFUL / COMPETITIVE        | Khand      | 104px | 700    | uppercase, letter -0.03em        |
| (subhead) ROBOTICS             | Khand      | 48px  | 500    | uppercase, letter +0.02em        |
| Item card title                | Newsreader | 22px  | 600    | letter -0.01em                   |
| Standout card title            | Newsreader | 34px  | 500    | letter -0.02em                   |
| Body                           | Manrope    | 17px  | 400    | line-height 1.5                  |
| Body small                     | Manrope    | 14.5px| 400    | line-height 1.55                 |
| Eyebrow / mono label           | JetBrains Mono | 11px | 400 | letter +0.22em, uppercase        |
| Handwritten label              | Caveat     | 56–64px | 500  | rotated 40°/−40°, with squiggle underline |

### Spacing & Layout

- Page max‑width: design assumes a `1280px` canvas. On larger viewports
  expand the cream side gently (max ~1440px) and clip the dark sections
  full‑bleed.
- Horizontal padding on hero / sections: `56px` from the edge.
- Section vertical padding: `80px` top/bottom for cream sections, `32px / 56px`
  for the robotics dark section.
- Hairline borders: `1px solid rgba(26,23,20,0.14)` on cream,
  `1px solid rgba(255,255,255,0.10)` on dark.
- Buttons / inputs: `2px` border, `0` radius (telemetry style) on dark;
  `2px` border, `0` radius on the nav buttons. No rounded chrome anywhere
  except the contact filter pills (which are pill‑radius `999px`).

### Image Sizes

- Hero portrait: 4:5 aspect, ~300×420 within the polaroid frame
- Robotics intro CAD renders (Variation F): the source PNGs are 3840×1800
  with mostly transparent pixels; in the layout they render at `1400px` /
  `1100px` width with `rotate(225deg)` (left, front view) and `scaleY(-1)`
  (right, 3D view). Half of each is intentionally clipped off the page edge.
- Lightbox slot in the detail panel: `300px` tall on a `1fr 1fr` grid

## Section Specs

The full JSX is in `sources/hybrid.jsx`. Read it as the source of truth.
Below is a narrative pass that points out the things JSX alone won't tell you.

### 1. Top bar / nav

- Left: "Luc Desautels" in Newsreader 22px 600, with a solid orange 8×8
  square dot suffix
- Right cluster (in order):
  1. Four text links (no underline, Manrope 14px 500):
     - Impactful Robotics → `/sailfish`
     - Competitive Robotics → `/ftc`
     - Drone Videography → `/videography`
     - More Interests → `/about` (or `#more`)
  2. **Copy‑email button** — outlined, `2px solid var(--rule)`, envelope icon
     + email text. On click: copy `luc@desautels.net` to clipboard via
     `navigator.clipboard.writeText`, flip background to `var(--accent)` and
     text to white, change label to "Copied!" for 1600ms, then revert.
  3. **Résumé button** — outlined, identical border style, text "Résumé",
     links to `/resume.pdf` (or wherever the PDF lives).
  4. **LinkedIn icon** — 34×34 filled square in `#0a66c2`, white "in" SVG
     glyph inside. Links to `https://linkedin.com/in/lucdesautels`.

### 2. Hero

- Grid `1fr 440px`, gap 56px.
- Left column: eyebrow `Personal Portfolio 2026`, name in 168px Newsreader,
  "Luc" on one line, *Desautels* italic 400 on the next, orange period
  `.` after the name. Then a body paragraph with the two highlighted spans
  (robotics, drone photography) in `var(--ink)` 600.
- Below the paragraph: a meta row — `Currently · Engineering`,
  `Based in · Toronto, Ontario`, `Focus · Robotics & Aerospace`. Eyebrows
  in mono, values in Manrope 18 700.
- Right column: a stack of three polaroids — main 300×420 (rotated +3°),
  smaller 200×170 (rotated −5°), smaller still 150×130 (rotated +8°). Each
  polaroid has a white footer card with a caption.
- Underneath the hero, a content filter row:
  - Italic intro "Show me —"
  - Five pills: `The full picture` (filled orange), `Engineering only`,
    `Robotics + Academics`, `Just creatives`, `↓ Résumé (PDF)`
  - These are intended to filter sections of the page (a future feature —
    see *Open Decisions* below). For first pass, hook them up to scroll
    targets / no‑op them, and design state for actual filtering later.

### 3. Horizontal‑scroll TOC (the "field log")

This is the most interactive section. Four tinted bands tile horizontally;
each band contains a vertical italic section label (`Academics.`,
`Robotics.`, `Well-rounded.`, `Experiences.`) and 5–6 photo tiles at
slight `±1–2°` rotations of varying heights (220–340px) and widths
(200–260px). Each tile has a small mono tag eyebrow underneath (e.g.
`/ SAILFISH`).

- The strip uses native `overflow-x: auto` plus `scroll-snap-type: x mandatory`
  with `scroll-snap-align: start` on each section group. This works because
  it's a 1‑D scroll on a fairly wide canvas; if mouse‑wheel horizontal
  conversion is desired on desktop, attach a `wheel` listener that does
  `el.scrollLeft += e.deltaY` when `e.deltaY` is the larger component.
- The section nav above (`01 · Academics`, `02 · Robotics`, etc.) jumps to
  the relevant section anchor on click. The first chip is the "active"
  state — dark fill, cream text. Implement scroll‑spy so it updates as the
  user scrolls.
- A thin progress bar below the strip mirrors `scrollLeft / scrollWidth`.
- Each tile, on hover, should fade in a short caption (currently shown
  permanently in the design — keep simple for now). On click, it scrolls to
  the corresponding full‑detail section further down the page.

### 4. Impact / Compete intro (Variation F)

This section IS the cream → dark transition. The order on top of the hex
gradient background:

- Top eyebrow row: `§ 02 — Robotics` (left) · `Two programs · one workshop` (right)
- Left CAD render: `assets/sailfish-front-exploded.png`, displayed
  `1400px` wide, transformed `rotate(225deg)`, anchored at `left: -400px,
  top: 80px`. The image is intentionally enormous and crops off the page —
  do not contain it.
- Right CAD render: `assets/sailfish-3d-exploded.png`, displayed `1100px`
  wide, transformed `scaleY(-1)`, anchored at `right: -560px, top: 80px`.
  Same overflow‑on‑purpose behavior.
- Centered wordmark, vertically centered in the viewport (`marginTop: 300px`
  inside the section):
  - Left half: right‑aligned, "IMPACTFUL" (Khand 104px 700) over "ROBOTICS"
    (Khand 48px 500, slightly looser tracking). A hand‑drawn red heart SVG
    sits over IMPACTFUL, rotated `-8°`, offset `top: -55%, right: 36px`.
  - Centered hairline vertical divider, `1px solid var(--rule)`, height
    `1.5×` the wordmark size.
  - Right half: left‑aligned, "COMPETITIVE" over "ROBOTICS", same sizing.
- Two handwritten labels in Caveat — `Project Sailfish` on the lower left,
  rotated `−40°`; `FTC Team 16366` on the lower right, rotated `+40°`. Each
  has a wavy SVG underline drawn in the same color.
- Below the wordmark, a two‑column blurb (1–2 sentences each, italic
  subline), then outlined‑orange CTA buttons (`↳ Project Sailfish`,
  `↳ FTC Team 16366`).
- Background: 9‑band hex gradient (see *Hex‑tile gradient palette* above).
  The hex field starts at exactly **`y = 675px` (75% down a 900px viewport)**.

The hand‑drawn heart and handwritten‑label underline are tiny inline SVGs.
Port them as components — see `ICHeart` and `ICHandLabel` in
`sources/intro-variations.jsx`.

### 5. Robotics detail panels

A two‑column grid (`1fr 1fr`, gap 24px) on the dark telemetry background.
Each column has:

- Eyebrow: `IMPACTFUL ROBOTICS` or `COMPETITIVE ROBOTICS` (mono, accent
  orange)
- Title: `Project Sailfish` or `FTC` (Khand 84px 600)
- Status line: `STATUS: ACTIVE · GEN.3 · OPEN SOURCE` (mono)
- **Lightbox slot** — the existing carousel/lightbox component the user
  already has. Sized at 300px tall. Below it, a 5‑segment progress strip
  (the first segment in accent orange, the rest in `--dark-line`). A mono
  caption `// Sailfish drone, generation 3` sits below.
- "Quick Info" block — eyebrow + title + body paragraph
- Four labelled rows: `Proof Point`, `Technical`, `Leadership`, `Volunteering`
  for each program. Eyebrow above, bold title, then body. Hairline rules
  between rows.
- CTA at the bottom: `Open dedicated page →` in an orange‑outlined button.

### 6. Sub‑projects carousel

- Eyebrow `[ § 03 — Robotics sub-projects ]`, title `Filter by domain.`
- Right side: `⊞ Full project grid →` button (links to the dedicated
  Sailfish/FTC pages' project grids)
- Domain filter chips: `ALL`, `MECHANICAL`, `ELECTRICAL`, `CAD`,
  `MANUFACTURING`, `MATERIALS`, `SOFTWARE`. `ALL` is the active state
  (filled accent).
- Horizontal scrolling row of 240px‑wide project cards. Each card:
  280px image placeholder with two tag overlays (top‑left: program tag in
  accent fill, top‑right: domain tag on a translucent black pill), title
  in Manrope 14 600, one‑line description in `--dark-dim`.

### 7. Dark → cream transition

A short linear gradient div (120px tall) easing from `--dark` through a
warm midtone (`#2a221c` at 30%) to `--bg-warm` and `--bg`. Nothing fancy.

### 8–10. Academics / Well‑rounded / Experiences (group sections)

Each "meta section" header has:
- Eyebrow: `§ 04 — School + research` (or similar)
- H2: section title with a `.` colored in `var(--trim)`
- Inside, each "group of three" (e.g., Education, Research) renders as:
  - Group header row: `01 / 02` mono counter · group title (Newsreader 40px) · italic right note
  - 3‑column grid: `1.5fr 1fr 1fr`
  - The first column is the **standout** card; the other two are siblings.

**Standout treatments:**

There are two implementations of the standout card (V1 vs V3, see
`HyStandoutCard` in `sources/hybrid.jsx`). The chosen one for the final site
is **`tab` style** (the V2/V3 treatment): a white card on cream background
with a 2px orange border, a soft shadow (`0 16px 38px rgba(0,0,0,0.10)`), and
a small black tab sticking out the top‑left labeled `★ STANDOUT`. The body
of the card has a `3px` orange left rule next to the title.

Standouts per group (use these — they're chosen):
- Education → **TFS & Scholar's Guild**
- Research → **5.8 GHz video over open water**
- Sports → **Rock Climbing**
- Creatives → **Nature Drone Videography**
- Scouts → **12 years in Scouts**
- Summer Programs → **SHAD**
- Side Quests → **Light suit night skiing**

The non‑standout cards are a smaller variant with a 140px image placeholder
and a tighter heading.

The **Experiences** section gets a small quirky twist: cards rotate `±1.5°`
and a small italic note appears under the H2 — "slightly less serious from
here on." This is intentional; don't strip it.

### 11. Principles

Two columns, each titled with a small mono eyebrow and a Newsreader 64px
heading. Inside each column, three numbered points (`01`, `02`, `03`) with
italic orange numerals, a bold title, and a short body. Content is fixed
copy that the user wrote; do not paraphrase.

### 12. Footer

Dark background. Headline "Let's talk." in Newsreader 140px, the period
italic in orange. Email as a large underlined link. GitHub / LinkedIn /
Résumé as mono uppercase links. Right side: small mono note "Built in
Toronto · v2026.05".

## Interactions & Behavior

- **Copy‑email button** — `navigator.clipboard.writeText('luc@desautels.net')`,
  then UI state change for 1600ms (background → accent, label → "Copied!").
- **Horizontal TOC scroll** — native overflow, scroll‑snap, plus arrow
  buttons that programmatically scroll by `viewport.clientWidth / 2`.
- **Filter pills** — currently visual; eventual behavior is to scroll/jump
  to the corresponding section and dim the rest. Implement as toggleable
  state.
- **Tile hover** — caption fade in.
- **Smooth scroll** — `html { scroll-behavior: smooth }` for in‑page anchors.
- **Reduced motion** — respect `prefers-reduced-motion` for any animated
  state transitions (currently very few).

## Data Model

All copy and structure is centralized in `sources/data.jsx`. Port that
file's constants verbatim — they are the canonical content for the page.
The key shapes:

- `SITE` — name, tagline, meta tuples, contact (email / GitHub / LinkedIn)
- `ROBOTICS` — array of two programs with `intro`, `caption`, four labelled
  `rows`, and `href`
- `META_GROUPS` — three meta‑groups (Academics, Well‑rounded, Experiences),
  each with one or more `groups` of three items where one item has
  `standout: true`
- `DEDICATED_PAGES` — top‑bar nav targets
- `GALLERY` — entries for the horizontal TOC tiles
- `VALUES` — the engineering + creative principles
- `SUBPROJECTS` (in `intro-variations.jsx`) — for the dark sub‑projects
  carousel

## Open Decisions / Future Work

- **Content filter pills** — currently visual only. Decide UX: do they
  hide sections or just scroll to them? Probably scroll + dim non‑matching.
- **Lightbox component** — the user has an existing carousel/lightbox they
  want re‑used inside the robotics detail panels. Coordinate to wire the
  real component in place of the `LIGHTBOX (working)` placeholder.
- **Real photos** — every placeholder labelled `REPLACE: …` needs a real
  image:
  - Hero portrait (4:5)
  - Two smaller hero polaroids
  - All horizontal‑scroll TOC tiles
  - Standout card images for each section group
  - FTC robot CAD (the right‑side image in the Impact/Compete intro currently
    re‑uses the Sailfish 3D render as a placeholder)
- **Dedicated sub‑pages** — `/sailfish`, `/ftc`, `/videography`, `/resume`
  are out of scope for this handoff but their nav entries already exist.
  When building them, lean on the same design tokens.
- **Robotics sub‑projects full grid** — the carousel links to `#all-projects`;
  that grid page is also out of scope but the design suggests a grid like
  the one in Direction C's "Field log" (see `direction-brutalist.jsx` for a
  past exploration of the grid style — not in this handoff, but available
  in the project if needed).
- **Responsive design** — the prototype is designed at 1280px wide. Below
  ~960px, every grid should collapse to a single column. Hero polaroids
  should stack under the name. The horizontal TOC should remain horizontal
  on mobile (it's a native scroll). The Impact/Compete CADs may need
  cropping discipline on mobile.
- **Speaker‑notes / SEO** — set proper `<title>`, `<meta name="description">`,
  Open Graph tags, structured data for `Person`.

## Source Files Index

`sources/`

| File                                       | Purpose                                                                   |
|--------------------------------------------|---------------------------------------------------------------------------|
| `Personal Site - Hybrid Variations.html`   | The canonical canvas with V1, V2, **V3 (chosen)** side‑by‑side artboards |
| `Personal Site - Tweakable.html`           | Single‑artboard standalone with a live Tweaks panel (color, layout, etc.)|
| `Personal Site - Impact Compete Variations.html` | A→F variations of just the Impact/Compete intro section            |
| `hybrid.jsx`                               | All shared components — top bar, hero, TOC, robotics, group blocks, etc. |
| `data.jsx`                                 | Content + copy (single source of truth)                                  |
| `intro-variations.jsx`                     | Variation F (chosen) intro: CAD images, heart, handwriting, hex gradient |
| `tweaks-panel.jsx`                         | Tweak controls (only used in the standalone)                             |
| `design-canvas.jsx`                        | Pan/zoom canvas wrapper for the side‑by‑side artboards (not for prod)    |

`assets/`

| File                                | Notes                                                       |
|-------------------------------------|-------------------------------------------------------------|
| `sailfish-front-exploded.png`       | 3840×1800, transparent — front‑view exploded CAD of Sailfish |
| `sailfish-3d-exploded.png`          | 3840×1800, transparent — 3/4 perspective exploded CAD       |

## Implementation Order (Suggested)

1. Bootstrap stack + design tokens (colors, type, spacing). Wire fonts.
2. Page scaffold + top bar. Get the copy‑email behavior shipped first; it
   tests Tailwind/CSS variable wiring end‑to‑end.
3. Hero. Drop in real portrait if available; otherwise mark the slots.
4. Horizontal TOC. This is the most interactive section — get scroll, snap,
   and arrows right before tiling content.
5. Impact/Compete intro with the hex gradient. Port `ICHexMatrix` precisely
   — the visual is the deciding moment of the page.
6. Robotics detail panels. Stub the lightbox slot.
7. Sub‑projects carousel.
8. Cream sections (Academics, Well‑rounded, Experiences). Standout cards
   are the visual hook here — match the orange‑border tab style exactly.
9. Principles + footer.
10. Wire content filter pills (scroll/dim behavior).
11. Responsive pass.
12. Hand back to the user for asset swap + dedicated sub‑pages.
