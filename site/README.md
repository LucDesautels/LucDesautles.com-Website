# Luc Desautels — Personal Site

Astro 4 + React islands. Static-first for SEO/performance; React is only
loaded for the bits that need interactivity (copy-email button, horizontal
TOC, filter pills, sub-projects domain filter).

## Run it

```
npm install
npm run dev
```

`npm run build` outputs static files to `dist/`. `npm run preview` serves the
build locally.

## Where things live

- `src/pages/index.astro` — the homepage composition.
- `src/components/*.astro` — static section components (Hero, RoboticsIntroF,
  RoboticsPanels, MetaSection, Principles, Footer, etc.).
- `src/components/islands/*.tsx` — React islands. Each one is loaded with
  `client:load` or `client:visible` from the consuming page.
- `src/data/content.ts` — single source of truth for site copy. Edit here, not
  in components.
- `src/styles/tokens.css` — design tokens, reset, and shared primitives.
- `src/layouts/BaseLayout.astro` — `<head>`, fonts, SEO/OG/structured data.
- `public/cad/` — Sailfish CAD renders used in the Variation F intro.
- `public/webflow/` — drop-in Webflow exports go here (see its README).

## Replacing image placeholders

Most images render as diagonal-stripe placeholders labelled `[ REPLACE ... ]`.
To swap in a real image, replace the corresponding `<Placeholder />` use in
the relevant component with an `<img>` (or `<Picture>` from `@astro/image`).
Keep the same width/height props so layout doesn't shift.

The handoff lists every slot under "Real photos" in `design_handoff_personal_site/README.md`.

## Adding a Webflow sub-page

See `public/webflow/README.md`. Two paths: drop the export under `/public/`
and link to it, or wrap it in an Astro page using `src/pages/_webflow-template.astro`.

## Coming soon

These are scaffolded for but not built yet — adding them later should not
require any restructuring:

- **Scroll-into-view animations.** Each section is a self-contained component
  with stable class names. Drop in `motion` or `framer-motion` (or vanilla
  IntersectionObserver) and target the section roots.
- **Subtle cursor-reactive backgrounds.** The `Waves.astro` component is the
  natural place to swap for an interactive canvas / SVG. Sections already have
  `position: relative` so an absolutely-positioned `<canvas>` will sit
  underneath cleanly.
- **More responsive polish.** Type uses `clamp()` for the giant heads; grids
  collapse to one column under 960px. Test on real devices before claiming
  done.
