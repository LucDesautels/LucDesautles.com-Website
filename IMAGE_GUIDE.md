# Image & Content Guide

**Everything you can edit lives under [`site/src/Final_Images/`](site/src/Final_Images/).**
**Push to `main`** → GitHub Actions rebuilds and deploys automatically.

---

## How it works

The folder tree mirrors the site: one folder per page, one folder per section
on that page, one folder per item inside a section. Every folder holds the
images and text for exactly one thing on the site — nothing is referenced by
a path typed into a JSON file anymore.

- **Images**: drop a file into the right folder, keeping the same base name
  (e.g. `hero.jpg`, `1.jpg`, `left-image.png`) — any format works: `.jpg`
  `.jpeg` `.png` `.webp` `.gif` `.avif`. It's automatically resized,
  converted to WebP, and lazy-loaded at build time — you don't need to
  compress anything yourself.
- **Text**: every editable sentence/paragraph is its own plain-text file,
  e.g. `body.md`, `caption.md`, `blurb.md`. Open it, change the words, save —
  no quotes, no commas, no syntax to get wrong. (`.md` supports `**bold**`
  and `*italic*` where the site renders it; otherwise it's just read as
  plain text.)
- **Tags** (engineering projects only): `tags.md` is one tag per line — add
  or remove a line to add/remove that tag from the project. The filter pills
  on `/engineering` and the home page's "Filter by domain" strip are both
  generated live from whatever tags actually exist across the projects, so
  a new tag you type shows up as a new filter pill automatically.

**Every slot always has a file.** If you haven't replaced something yet,
you'll see a placeholder image — a solid color with the folder path written
on it — so you always know exactly where to go to add the real photo. There
is no broken-image state and nothing to "turn on": just overwrite the file.

---

## Folder map

```
site/src/Final_Images/
├── home/
│   ├── hero/                    portrait.*, in-the-field.*, outdoors.* + tagline.md
│   ├── toc-gallery/              academics/ · robotics/ · well-rounded/ · experiences/  (one image per tile)
│   ├── robotics-intro/          left-image.*, right-image.* + sailfish-blurb.md, ftc-blurb.md
│   ├── robotics-compare/
│   │   ├── sailfish/1-quick-info/ 2-proof-point/ 3-technical/ 4-leadership/ 5-open-sourced/
│   │   └── ftc/                  (same 5 slides — hero.*, extra-1.*, extra-2.* + title/body/long-body/caption.md)
│   ├── academics/{education,research}/<item>/            hero.* + title.md, body.md
│   ├── well-rounded/{sports,creatives,scouts}/<item>/     hero.* + title.md, body.md (+ long.md for the essay card)
│   ├── experiences/{summer-programs,side-quests}/<item>/  hero.* + title.md, body.md
│   └── principles/{engineering,creative}/<point>/          title.md, desc.md
│
├── engineering/
│   ├── eng-lander/                3 decorative hero chips (reuse real project photos automatically)
│   ├── eng-programs/{ftc,sailfish,misc}/     hero.* + role/years/blurb/caption.md, skills/<skill>/
│   └── eng-grid/<project-slug>/   1.*, 2.*, … + matching 1.md/2.md captions, blurb/detail/requirements/contribution/result.md, tags.md
│
├── impactful-robotics/    (empty — reserved for a future dedicated Sailfish page)
├── competitive-robotics/  (empty — reserved for a future dedicated FTC page)
└── drone-videography/     (empty — reserved for the future gallery)
```

**Shared photos.** A handful of images intentionally appear in two places at
once — e.g. `engineering/eng-grid/cnc-chassis/1.jpg` is both the FTC project
grid photo *and* the matching "Skills by program" row photo, because they're
the literal same file. Some `eng-programs/<program>/skills/<skill>/` folders
you'd expect don't exist for this reason — the skill's images live under
`eng-grid/<matching-project>/` instead. Overwriting that one file updates
both places at once.

**The home page's "Filter by domain" strip** isn't its own content — it's a
curated view onto 8 of the `engineering/eng-grid/` projects. Edit those
projects' photos/text/tags and both the strip and the full `/engineering`
grid update together.

---

## What's *not* here

Giant, effectively-permanent text — the site name, the "IMPACTFUL ROBOTICS /
COMPETITIVE ROBOTICS" wordmark, section headings like "Academics." — is left
in the component code, since it's not something you'd realistically edit.
Structural things (which programs/projects exist, their order, hrefs,
whether a card is "standout") still live in `site/CONTENT.json`, but no
actual words or image paths do anymore — every field there is now a pointer
into `Final_Images/`.

---

## Adding a brand-new image slot later

If a future change adds a new image field to the site, generate its
placeholder with:

```bash
cd site
node scripts/generate-placeholders.mjs --slot=path/relative/to/Final_Images/without/extension
```

It never overwrites a slot that already has a real file.
