# Webflow export archive

The Webflow site (`luke-s-newest-site-667-portfolio`) is being shut down. This
folder is the self-contained record of it, kept so nothing about the site
depends on Webflow, on jsDelivr, or on the original ZIP surviving in OneDrive.

**Nothing in here is served or built.** It sits outside `site/` on purpose.
The live pages that came out of it are native Astro under `site/src/pages/`:

| Webflow page             | Now lives at                                             |
|--------------------------|----------------------------------------------------------|
| `drone-portfolio.html`   | `/drone-videography` (faithful) and `/drone-videography-adapted` |
| `detail_projects.html`   | `/drone-videography/<slug>`                              |
| `project-sailfish.html`  | `/impactful-robotics`                                    |

## What's here

- **`*.html`** — every page as exported on 2026-08-27, template lorem ipsum
  and all. `drone-portfolio.html` and `detail_projects.html` are the two
  that were ported; the rest are for reference.
- **`css/`, `js/webflow.js`, `fonts/`, `documents/`** — verbatim. `webflow.js`
  matters: the IX2 interaction definitions (every hover, marquee and scroll
  animation, with exact durations and easings) are embedded in it as a JSON
  blob. Search for `Webflow.require("ix2").init` — that's what the CSS
  reproductions in `site/src/components/webflow/` were transcribed from.
- **`js/psftabs2-2.0.0.js`** — Luc's own tab switcher for the Sailfish page.
  It was hosted only on Webflow's CDN (custom-code upload), not in the export,
  so it was fetched separately before the site went down.
- **`cms/Projects.csv`** — the Projects collection. The code export drops CMS
  content on a Basic plan (collection lists come out as `w-dyn-bind-empty`),
  so this CSV is the only record of the project text, and the CDN URLs in it
  are where the 29 project photos were fetched from.
- **`images/`** — only the real photos. The other ~100 files in the export
  were Karo template stock (`img__scandi--*`, `img__wedding--*`, etc.) and
  Webflow's generated `-p-500/-p-800/…` responsive variants, both dropped.

## Two naming quirks worth knowing

Webflow names the full-size original by its *asset* name and the responsive
variants by the *upload* filename, so two images look like they're missing
their original when they aren't:

- `Scouts-p-*.jpg` → original is `FTC1.jpg`
- `evideoframe_72923-p-*.png` → original is `PSF1.png`

And the Sandbanks CMS row's slug is `sandbanks-provincial-park`, while the
site's folder is `03-sandbanks`. The `Next Project` field references CMS
slugs; the site derives that chain from folder order instead, which
reproduces it exactly.

## Provenance

- Export: `luke-s-newest-site-667-portfolio.webflow.zip`, 2026-08-27
- CMS CSV: exported from the Webflow CMS panel, 2026-08-27
- `psftabs2-2.0.0.js`: fetched from `cdn.prod.website-files.com`, 2026-09-13
- `rb-carousel.js` (the other custom script) is vendored separately at
  `site/src/vendor/rb-carousel.js` from the `Portfolio-Scripts-v2` GitHub repo
