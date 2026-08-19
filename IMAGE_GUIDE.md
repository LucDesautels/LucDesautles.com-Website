# Image & Content Guide

**Edit content/descriptions:** [`site/CONTENT.json`](site/CONTENT.json)  
**Push to `main`** → GitHub Actions rebuilds and deploys automatically.

---

## How images work

Every image slot has a pre-made folder with a placeholder already in it. To swap in a real photo:

1. Drop your image into the correct folder (any format: `.jpg` `.jpeg` `.png` `.webp` `.gif` `.avif`)
2. Name it to match the placeholder (e.g. `1.jpg`) **or** use any name and update the path in `CONTENT.json`
3. Push → done

Multiple images in one folder sort **alphabetically** — `1.jpg` before `abc.jpg` before `xyz.jpg`.

> **Robotics intro flanking images** (left/right of the wordmark) are special — drop them in  
> `site/src/Uploaded Media/` as `1.jpg` (left) and `2.jpg` (right). They get auto-optimized to WebP.

---

## Folder map

```
site/public/images/
│
├── homepage/
│   ├── hero/
│   │   ├── 1.jpg   ← portrait polaroid
│   │   ├── 2.jpg   ← "in the field" polaroid
│   │   └── 3.jpg   ← outdoors polaroid
│   │
│   ├── toc-gallery/          ← horizontal scroll gallery tiles
│   │   ├── academics/        ← 5 tiles (TFS, IB, 5.8GHz, SAR spiral, thrust stand)
│   │   ├── robotics/         ← 6 tiles (Sailfish gen3, VTX stack, field test, Ontario champs, CNC, arm)
│   │   ├── well-rounded/     ← 5 tiles (climbing, skiing, drone, fiddle, canoe)
│   │   └── experiences/      ← 4 tiles (SHAD, Waterloo, EL ski suit, dance MC)
│   │
│   └── subprojects/          ← 8 sub-project cards in the robotics strip
│       └── 1.jpg … 8.jpg     ← order matches CONTENT.json subprojects array
│
├── robotics/
│   ├── sailfish/
│   │   ├── 1-quick-info/
│   │   │   ├── 1.jpg             ← main carousel image (Sailfish Gen.3 hero)
│   │   │   └── extras/
│   │   │       ├── 1.jpg         ← lightbox extra: TAIL VIEW
│   │   │       └── 2.jpg         ← lightbox extra: AVIONICS BAY
│   │   ├── 2-proof-point/
│   │   │   └── 1.jpg             ← Airforce Foundation letter scan
│   │   ├── 3-technical/
│   │   │   ├── 1.jpg             ← exploded CAD Gen.3
│   │   │   └── extras/
│   │   │       ├── 1.jpg         ← VTX STACK
│   │   │       ├── 2.jpg         ← WING CARRY-THROUGH
│   │   │       └── 3.jpg         ← FOAM-CORE FLOAT
│   │   ├── 4-leadership/
│   │   │   └── 1.jpg             ← team standup photo
│   │   └── 5-open-sourced/
│   │       └── 1.jpg             ← GitHub repo / README screenshot
│   │
│   └── ftc/
│       ├── 1-quick-info/
│       │   ├── 1.jpg             ← competition robot hero
│       │   └── extras/
│       │       ├── 1.jpg         ← DRIVETRAIN
│       │       └── 2.jpg         ← ARM SYSTEM
│       ├── 2-inspire-award/
│       │   └── 1.jpg             ← Inspire Award on stage
│       ├── 3-technical/
│       │   ├── 1.jpg             ← CNC chassis plate
│       │   └── extras/
│       │       ├── 1.jpg         ← FIXTURING
│       │       └── 2.jpg         ← ARM TRANSFER
│       ├── 4-mentoring/
│       │   └── 1.jpg             ← mentor/design review session
│       └── 5-outreach/
│           └── 1.jpg             ← grade 5 design club / workshop
│
└── engineering/                  ← one folder per project (also feeds the
    │                               "Skills by program" section — see below)
    ├── vtx-stack/          1.jpg 2.jpg 3.jpg
    ├── tilt-rotor/         1.jpg 2.jpg
    ├── wing-carry-through/ 1.jpg 2.jpg
    ├── cnc-chassis/        1.jpg 2.jpg 3.jpg
    ├── arm-transfer/       1.jpg 2.jpg
    ├── auto-pathing/       1.jpg 2.jpg
    ├── foam-flotation/     1.jpg 2.jpg 3.jpg
    ├── groundstation/      1.jpg 2.jpg
    ├── 58ghz-water/        1.jpg 2.jpg
    ├── sar-spiral/         1.jpg 2.jpg
    ├── thrust-stand/       1.jpg 2.jpg 3.jpg
    ├── battery-pack/       1.jpg 2.jpg
    ├── wing-cfd/           1.jpg 2.jpg 3.jpg
    ├── oss-release/        1.jpg
    ├── el-suit/            1.jpg 2.jpg
    ├── library-box/        1.jpg 2.jpg 3.jpg
    ├── rookie-docs/        1.jpg
    ├── stem-bilingual/     1.jpg
    ├── drone-photography/  1.jpg 2.jpg 3.jpg 4.jpg 5.jpg
    └── fiddle-pickup/      1.jpg 2.jpg
```

---

## "Skills by program" — the section between the hero and the grid

Three programs (`engPrograms` in CONTENT.json), each a wide bar with its
technique rows underneath. Every row opens a lightbox; **next/prev there moves
to the next technique**, and the thumbnail strip moves between that technique's
images.

| Slot | Where it shows | How many |
|---|---|---|
| `engPrograms[N].image` | the big image on the program bar | 1 per program |
| `engPrograms[N].skills[M].images` | first **2** show as row thumbnails, **all** show in the lightbox | 2+ per technique |

Most of these reuse the `engineering/<project>/` folders above, so a photo
dropped in for the grid shows up in both places automatically.

**A slot with no `src` renders the striped placeholder with its `label`.** So do
either of these and it looks intentional until the photo lands:

```json
{ "label": "HARDWARE TOKENS" }                                   ← placeholder
{ "src": "/images/engineering/x/1.jpg", "caption": "On the bench" } ← real photo
```

A `src` pointing at a file that isn't there falls back to the same placeholder
rather than a broken-image icon — so a typo degrades quietly, it doesn't break
the page.

### Slots still waiting on a photo

| Where | Suggested folder |
|---|---|
| Uncategorized — program bar image | `engineering/standalone/1.jpg` |
| Self-hosting & home infrastructure (2) | `engineering/self-hosting/1.jpg` `2.jpg` |
| Physical security & hardware auth (2) | `engineering/security-keys/1.jpg` `2.jpg` |

Create the folder, drop the photo in, then set `src` (and a `caption`) on that
slot in `CONTENT.json`.

> **Folders currently prefixed with `_`** — `_cnc-chassis`, `_58ghz-water`,
> `_battery-pack`, `_sar-spiral`, `_groundstation`, `_library-box`,
> `_thrust-stand`. CONTENT.json points at the un-prefixed names, so those photos
> aren't showing anywhere yet. Drop the leading underscore and they all light up
> at once. (`_thrust-stand` also needs actual photos — it currently holds two
> PNG pages of the physics write-up, not `1.jpg`…`3.jpg`.)

---

## Editing text in CONTENT.json

Open [`site/CONTENT.json`](site/CONTENT.json) in GitHub's editor (pencil icon).

| What you want to change | Key path |
|---|---|
| Site name / tagline / meta chips | `site.name`, `site.tagline`, `site.meta` |
| Contact links | `site.contact` |
| Robotics slide titles, descriptions, captions | `robotics[0].slides[N]` (Sailfish) / `robotics[1].slides[N]` (FTC) |
| Program name / role / years / intro | `engPrograms[N].title`, `.role`, `.years`, `.blurb` |
| Technique row title + one-line description | `engPrograms[N].skills[M].title`, `.desc` |
| Technique lightbox write-up | `engPrograms[N].skills[M].long` |
| Engineering project title, blurb, detail | `engineering[N].title`, `.blurb`, `.detail` |
| Engineering image captions | `engineering[N].images[N].caption` |
| Engineering requirements / contribution / result | `engineering[N].requirements`, `.contribution`, `.result` |
| Academics / Well-rounded / Experiences cards | `metaGroups[N].groups[N].items[N]` |
| Values section | `values.engineering.points`, `values.creative.points` |
| Image paths (after uploading a real photo) | `robotics[...].slides[N].image`, `engineering[N].images[N].src` |

**Tips:**
- JSON is strict about commas — every item in a list has a comma except the last one.
- String values must be in double quotes: `"like this"`.
- GitHub's editor will highlight syntax errors before you save.
- After committing, the build takes ~1–2 minutes.
