# Webflow page imports

Two ways to bring a Webflow export onto this site. Pick per page.

## Path A — drop the export under `/public/webflow/<slug>/`

Best for: pages with heavy custom animations or JS you do not want to touch.

1. Export the page from Webflow (HTML + CSS + JS + assets).
2. Drop the entire folder here so the structure is `public/webflow/sailfish/index.html`.
3. Link to it from anywhere in the site as `/webflow/sailfish/` — Astro serves
   `public/` verbatim at the root. The page will run with its own CSS/JS
   completely untouched.
4. Optional: edit the export's `<head>` to point its nav links back to `/`
   and `/#anchors` so users can return to the home page.

Tradeoff: the page won't share this site's top bar, footer, fonts, or
analytics unless you copy them in by hand.

## Path B — wrap the export in an Astro page

Best for: pages where you want this site's nav/footer and to share tokens.

1. Create `src/pages/<slug>.astro` (or copy from `src/pages/_webflow-template.astro`).
2. Paste the Webflow `<body>` HTML inside `<Fragment set:html={...}>`.
3. Move Webflow's stylesheet links and scripts into the layout's
   `<head>` slot — or load them via `<link rel="stylesheet">` and
   `<script src="...">` tags inside the page itself.
4. Move assets (images, fonts) to `public/webflow/<slug>/assets/` and
   rewrite paths in the pasted HTML to point at them.

Tradeoff: more conversion work, but the page lives inside the same shell as
the homepage.

## Notes

- Webflow `data-w-*` attributes and `webflow.js` are required for most
  interactions (form, lightbox, slider). Keep them intact.
- If two Webflow exports both ship the same `js/webflow.js`, they're fine
  in separate `/webflow/<slug>/` folders but will conflict if loaded on the
  same page.
- Don't commit Webflow exports into `src/` — keep them under `public/` so
  Astro never tries to parse them.
