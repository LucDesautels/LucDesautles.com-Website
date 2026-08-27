# Full site copy — current state

Every piece of text currently on the site, page by page, in reading order.

**How to read this doc**

- Each entry shows a **label**, then where it lives, then the current text in a code block.
- `some/path.md` = an editable text file under `site/src/Final_Images/`. Edit the code block; I'll write it back to that file.
- _hardcoded in X_ = the words live in component/page code, not a text file. You can still change them — just say so and I'll edit the code (and, where it makes sense, move it into a `Final_Images` text file so it's phone-editable later).
- Just rewrite the text inside the code blocks and send the whole doc back. Don't worry about the structure/labels.

---

# TABLE OF CONTENTS

1. [Global chrome (every page)](#1-global-chrome-every-page)
2. [Home page `/`](#2-home-page-)
3. [Engineering portfolio `/engineering`](#3-engineering-portfolio-engineering)
4. [Stub pages](#4-stub-pages)
5. [SEO / metadata](#5-seo--metadata)

---

# 1. Global chrome (every page)

## 1.1 Loading screen

> Full-screen cream overlay with the animated `luc-loader` wordmark. Only text is a screen-reader label.

**Screen-reader label** · _hardcoded in `src/components/LoadingScreen.astro`_
```
Loading…
```

## 1.2 Top bar

**Brand (left)** · _hardcoded in `CONTENT.json` → `site.name`_
```
Luc Desautels
```

**Nav link 1** · _hardcoded in `CONTENT.json` → `dedicatedPages`_
```
Engineering Portfolio  →  /engineering
```

**Nav link 2** · _hardcoded in `CONTENT.json` → `dedicatedPages`_
```
Impactful Robotics  →  /impactful-robotics/
```

**Nav link 3** · _hardcoded in `CONTENT.json` → `dedicatedPages`_
```
Competitive Robotics  →  /competitive-robotics/
```

**Nav link 4** · _hardcoded in `CONTENT.json` → `dedicatedPages`_
```
Drone Videography  →  /drone-videography
```

**Email button (click to copy)** · _hardcoded in `CONTENT.json` → `site.contact.email`_
```
L@desautels.net
```

**Email button — copied state** · _hardcoded in `src/components/islands/CopyEmailButton.tsx`_
```
Copied!
```

**Email button — tooltip** · _hardcoded in `src/components/islands/CopyEmailButton.tsx`_
```
Copy email to clipboard
```

**Résumé button** · _hardcoded in `src/components/TopBar.astro`_
```
Résumé
```

**LinkedIn icon — aria label** · _hardcoded in `src/components/TopBar.astro`_
```
LinkedIn
```

**LinkedIn hover badge name** · _hardcoded in `src/components/TopBar.astro` (LinkedIn embed)_
```
Luc Desautels
```

**Hamburger — aria label** · _hardcoded in `src/components/TopBar.astro`_
```
Toggle menu
```

## 1.3 Footer

**Heading** · _hardcoded in `src/components/Footer.astro`  ("talk." is the italic accent half)_
```
Let's talk.
```

**Email (click to copy)** · _hardcoded in `CONTENT.json` → `site.contact.email`_
```
L@desautels.net
```

**Copy confirmation toast** · _hardcoded in `src/components/Footer.astro`_
```
Copied to clipboard.
```

**Link 1** · _hardcoded in `src/components/Footer.astro`_
```
ENGINEERING ↗
```

**Link 2** · _hardcoded in `src/components/Footer.astro`_
```
LINKEDIN ↗
```

**Link 3** · _hardcoded in `src/components/Footer.astro`_
```
RÉSUMÉ ↗
```

**Right column (auto-generated)** · _hardcoded in `src/components/Footer.astro` — pulled from git, not editable copy_
```
Last update: {month day}
Commit {SHA}
```

## 1.4 Easter egg — CPS counter

> Appears center-screen if you click faster than ~7 clicks/second anywhere on the site.

**Readout** · _hardcoded in `src/components/CpsCounter.astro`_
```
{n} cps   /   best {n}
```

**Link line** · _hardcoded in `src/components/CpsCounter.astro`_
```
yo contact me to hop on hypixel bedwars ;)
```

---

# 2. Home page `/`

## 2.1 Hero (top of page)

**Eyebrow (above the name)** · _hardcoded in `src/components/Hero.astro`_
```
Preview - Personal Portfolio 2026
```

**Name (giant display type)** · _hardcoded in `CONTENT.json` → `site.name`_
```
Luc Desautels   →  rendered as "Luc" / "Desautels" italic + accent period
```

**Tagline (paragraph under the name)** · `home/hero/tagline.md`
```
My main focus right now is in **robotics**, however I also rock climb, play fiddle, and have a passion for **drone photography**.
```

### Hero meta row (three stats under the tagline)

**Meta label** · _hardcoded in `CONTENT.json` → `site.meta`_
```
Currently
```

**Meta value (under "Currently")** · `home/hero/meta-currently.md`
```
Engineering
```

**Meta label** · _hardcoded in `CONTENT.json` → `site.meta`_
```
Based in
```

**Meta value (under "Based in")** · `home/hero/meta-based-in.md`
```
Toronto, Ontario
```

**Meta label** · _hardcoded in `CONTENT.json` → `site.meta`_
```
Focus
```

**Meta value (under "Focus")** · `home/hero/meta-focus.md`
```
Robotics & Aerospace
```

### Hero polaroid hover captions

> Typewriter captions that slide out from under the two small photos on hover.

**Medium polaroid (Sailfish photo)** · _hardcoded in `src/components/Hero.astro` (inline script)_
```
> Project Sailfish
field testing
```

**Small polaroid (skiing photo)** · _hardcoded in `src/components/Hero.astro` (inline script)_
```
> Backcountry Skiing
```

## 2.2 Filter pills (bottom of the hero)

**Intro label** · _hardcoded in `src/components/islands/FilterPills.tsx`_
```
Show me —
```

**Pill "full" — label / label when active / short name / description** · _hardcoded in `src/data/filters.ts`_
```
The full picture
The full picture
Full
Everything on the site.
```

**Pill "eng-acad" — label / label when active / short name / description** · _hardcoded in `src/data/filters.ts`_
```
Engineering & Academics
Engineering & Academics only
Eng + Acad
robotics work, sub-projects, and academics.
```

**Pill "engineering" — label / label when active / short name / description** · _hardcoded in `src/data/filters.ts`_
```
Engineering only
Engineering only
Eng
robotics work and supporting research.
```

**Pill "non-eng" — label / label when active / short name / description** · _hardcoded in `src/data/filters.ts`_
```
Non-engineering only
Non-engineering only
Non-eng
academics, well-rounded, and experiences.
```

**Extra pill (link out)** · _hardcoded in `src/components/islands/FilterPills.tsx`_
```
Engineering portfolio →
```

**Extra pill (link out)** · _hardcoded in `src/components/islands/FilterPills.tsx`_
```
↓ Résumé
```

### Floating filter indicator (bottom-right once a filter is on)

**Reset row label** · _hardcoded in `src/components/islands/FilterIndicator.tsx`_
```
Show full picture
```

> The other rows in the indicator use the short names + descriptions listed above.

## 2.3 §01 — Table of contents gallery (the horizontal scroll strip)

**Corner mark** · _hardcoded in `src/components/islands/HorizontalTOC.tsx`_
```
§ 01
```

**Corner label** · _hardcoded in `src/components/islands/HorizontalTOC.tsx`_
```
Table of contents
```

**Section aria label** · _hardcoded in `src/components/islands/HorizontalTOC.tsx`_
```
Field log — scroll to explore
```


> Four panels scroll past horizontally. Each has a big vertical section name and a set of photo tiles; every tile has a small caption tag under it. All of these live in `CONTENT.json` → `toc`.

### Panel: Academics

**Panel name (big vertical label + rail label)** · _hardcoded in `CONTENT.json` → `toc`_
```
Academics.
```

**Tile captions (tag shown under each photo) + internal tile names** · _hardcoded in `CONTENT.json` → `toc`_
```
/ EDUCATION   —   TFS & Scholar's Guild
/ EDUCATION   —   IB Diploma Program
/ RESEARCH   —   5.8 GHz over water
/ RESEARCH   —   SAR spiral optimization
/ RESEARCH   —   Motor & prop efficiency
```

> Only the `/ TAG` part is visible on the page; the second half is the tile's name/alt text.

### Panel: Robotics

**Panel name (big vertical label + rail label)** · _hardcoded in `CONTENT.json` → `toc`_
```
Robotics.
```

**Tile captions (tag shown under each photo) + internal tile names** · _hardcoded in `CONTENT.json` → `toc`_
```
/ SAILFISH   —   Sailfish Gen 3
/ SAILFISH   —   Fuselage VTX stack
/ SAILFISH   —   Field test, Lake Ontario
/ FTC   —   Ontario Champions 2024
/ FTC   —   CNC chassis plate
/ FTC   —   Arm transfer system
```

> Only the `/ TAG` part is visible on the page; the second half is the tile's name/alt text.

### Panel: Well-rounded

**Panel name (big vertical label + rail label)** · _hardcoded in `CONTENT.json` → `toc`_
```
Well-rounded.
```

**Tile captions (tag shown under each photo) + internal tile names** · _hardcoded in `CONTENT.json` → `toc`_
```
/ SPORTS   —   Lead climb 5.10c
/ SPORTS   —   Whistler, double-black
/ CREATIVE   —   Algonquin fog
/ CREATIVE   —   Folk fiddle jam
/ SCOUTS   —   La Vérendrye canoe
```

> Only the `/ TAG` part is visible on the page; the second half is the tile's name/alt text.

### Panel: Experiences

**Panel name (big vertical label + rail label)** · _hardcoded in `CONTENT.json` → `toc`_
```
Experiences.
```

**Tile captions (tag shown under each photo) + internal tile names** · _hardcoded in `CONTENT.json` → `toc`_
```
/ SHAD   —   SHAD program
/ PROGRAM   —   Waterloo Catalyst
/ SIDEQUEST   —   Light suit ski night
/ SIDEQUEST   —   Dance Show MC
```

> Only the `/ TAG` part is visible on the page; the second half is the tile's name/alt text.

## 2.4 §02 — Robotics intro (the two-column wordmark)

**Eyebrow, left** · _hardcoded in `src/components/RoboticsIntroF.astro`_
```
§ 02 — Robotics
```

**Eyebrow, right** · _hardcoded in `src/components/RoboticsIntroF.astro`_
```
Two programs · one workshop
```

**Left wordmark** · _hardcoded in `src/components/RoboticsIntroF.astro`_
```
IMPACTFUL
ROBOTICS
```

**Right wordmark** · _hardcoded in `src/components/RoboticsIntroF.astro`_
```
COMPETITIVE
ROBOTICS
```

**Handwritten label, left (animated cursive)** · _hardcoded in `src/components/RoboticsIntroF.astro`_
```
Project Sailfish
```

**Handwritten label, right (animated cursive)** · _hardcoded in `src/components/RoboticsIntroF.astro`_
```
FTC Team 16366
```

**Left blurb (Sailfish)** · `home/robotics-intro/sailfish-blurb.md`
```
Three generations of an open-sourced autonomous SAR drone. Built to reach lost crews faster.
```

> The blurb is auto-split at the first sentence break — sentence 1 is roman, the rest is italic on a second line.

**Right blurb (FTC)** · `home/robotics-intro/ftc-blurb.md`
```
Five years FTC — competitor, mechanical lead, mentor. Ontario Inspire 2024 + Worlds, Houston.
```

**Left CTA** · _hardcoded in `src/components/RoboticsIntroF.astro`_
```
↳ Project Sailfish
```

**Right CTA** · _hardcoded in `src/components/RoboticsIntroF.astro`_
```
↳ FTC Team 16366
```

## 2.5 Robotics comparison panels (the pinned two-column carousel)

> Two columns side by side (Sailfish | FTC). Each has a header, a photo that swaps, and five clickable rows below. Clicking a row or photo opens a lightbox with the long version + extra photos.

**Scroll marker labels (left gutter)** · _hardcoded in `CONTENT.json` → `robotics[].slides[].eyebrow`_
```
Quick Info
Proof Point
Technical
Leadership
Volunteering
```

**Column counters** · _hardcoded in `src/components/RoboticsPanels.astro`_
```
01 / 02   and   02 / 02
```

**Column CTA (both columns)** · _hardcoded in `src/components/RoboticsPanels.astro`_
```
Open dedicated page →
```

**Lightbox first-open hint** · _hardcoded in `src/components/RoboticsPanels.astro`_
```
‹ Click this side — back        Click this side — next ›
```


### Column: Project Sailfish

**Eyebrow (above the column title)** · _hardcoded in `CONTENT.json` → `robotics[].eyebrow`_
```
Impactful Robotics
```

**Column title** · _hardcoded in `CONTENT.json` → `robotics[].title`_
```
Project Sailfish
```

**Column subtitle** · `home/robotics-compare/sailfish/subtitle.md`
```
An Altum Robotics initiative.
```


#### Row 1 — "Quick Info"

**Row eyebrow** · _hardcoded in `CONTENT.json` → `robotics[].slides[].eyebrow`_
```
> Quick Info
```

**Row title** · `home/robotics-compare/sailfish/1-quick-info/title.md`
```
Intro to Sailfish
```

**Row body (the sentence under the title)** · `home/robotics-compare/sailfish/1-quick-info/body.md`
```
A proof of technology for a low-cost, autonomous marine search and rescue drone. We set out to reduce the time and cost for Coast Guard and volunteer rescue to make first visual contact.
```

**Photo caption (under the big photo, prefixed `//`)** · `home/robotics-compare/sailfish/1-quick-info/caption.md`
```
Sailfish Gen.3 · field test, Lake Ontario
```

**Long body (lightbox only)** · `home/robotics-compare/sailfish/1-quick-info/long-body.md`
```
Project Sailfish is a proof of technology for a low-cost, autonomous marine search and rescue drone. We set out to reduce the time and cost for Coast Guard and volunteer rescue crews to make first visual contact with a person in the water. Three generations of prototypes — each a step closer to a system that any rescue org could fly without a manufacturer in the loop.
```

**Main photo label / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].imageLabel`_
```
SAILFISH GEN.3 — HERO
```

**Lightbox thumbnail labels / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].extras[].label`_
```
NOSE & GIMBAL — FRONT VIEW
EARLY PROTOTYPE — BENCH RIG
```

#### Row 2 — "Proof Point"

**Row eyebrow** · _hardcoded in `CONTENT.json` → `robotics[].slides[].eyebrow`_
```
> Proof Point
```

**Row title** · `home/robotics-compare/sailfish/2-proof-point/title.md`
```
Letter from the Airforce Foundation
```

**Row body (the sentence under the title)** · `home/robotics-compare/sailfish/2-proof-point/body.md`
```
Recognition from the CEO of the Airforce Foundation, endorsed by a Navy Captain who has advised the Chief of Defense Staff.
```

**Photo caption (under the big photo, prefixed `//`)** · `home/robotics-compare/sailfish/2-proof-point/caption.md`
```
Endorsement letter · scanned original
```

**Long body (lightbox only)** · `home/robotics-compare/sailfish/2-proof-point/long-body.md`
```
The Air Force Foundation's CEO wrote a personal endorsement of Sailfish, co-signed by a retired Navy Captain who has advised the Canadian Chief of Defense Staff. They specifically called out the cost ceiling, the open-source release, and the relevance to volunteer SAR units operating without dedicated air assets.
```

**Main photo label / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].imageLabel`_
```
AFF LETTER — SCAN
```

**Lightbox thumbnail labels / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].extras[].label`_
```
GULF ISLANDS MARINE RESCUE — VISIT
GEN.3 — FIELD READY
FIELD DOCUMENTATION
```

#### Row 3 — "Technical"

**Row eyebrow** · _hardcoded in `CONTENT.json` → `robotics[].slides[].eyebrow`_
```
> Technical
```

**Row title** · `home/robotics-compare/sailfish/3-technical/title.md`
```
My Technical Work
```

**Row body (the sentence under the title)** · `home/robotics-compare/sailfish/3-technical/body.md`
```
Deep experience in mechanical design and simulation, electrical engineering, and software for autonomous systems across three generations of prototypes.
```

**Photo caption (under the big photo, prefixed `//`)** · `home/robotics-compare/sailfish/3-technical/caption.md`
```
Exploded view · CAD generation 3
```

**Long body (lightbox only)** · `home/robotics-compare/sailfish/3-technical/long-body.md`
```
Across three generations I owned: fuselage CAD and CFRP layup planning; the 5.8 GHz video stack tuned for over-water multipath; a thrust-stand campaign that fed motor/prop selection; and the autonomy loop running spiral-search paths on a Pixhawk + companion compute. Each generation traded weight, range, and complexity differently and the lessons stacked.
```

**Main photo label / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].imageLabel`_
```
EXPLODED CAD — GEN.3
```

**Lightbox thumbnail labels / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].extras[].label`_
```
GEN.3 — FIELD SETUP
ELECTRONICS ASSEMBLY — DECK BENCH
3D PRINTING — GEN.3 PARTS
```

#### Row 4 — "Leadership"

**Row eyebrow** · _hardcoded in `CONTENT.json` → `robotics[].slides[].eyebrow`_
```
> Leadership
```

**Row title** · `home/robotics-compare/sailfish/4-leadership/title.md`
```
Leadership and Entrepreneurship
```

**Row body (the sentence under the title)** · `home/robotics-compare/sailfish/4-leadership/body.md`
```
Founded and led a team of 6 high school students. Engaged Coast Guard personnel, university professors, and industry experts to shape requirements and direction.
```

**Photo caption (under the big photo, prefixed `//`)** · `home/robotics-compare/sailfish/4-leadership/caption.md`
```
Team standup · Toronto workshop
```

**Long body (lightbox only)** · `home/robotics-compare/sailfish/4-leadership/long-body.md`
```
I founded the project and led a team of 6 high schoolers across two design cycles. I built the relationships that turned this from a school project into something credible: interviews with Coast Guard auxiliary crews, professors at Waterloo and UofT, and industry mentors. The team has shipped peer-reviewed write-ups and won two local engineering awards.
```

**Main photo label / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].imageLabel`_
```
TEAM PHOTO — STANDUP
```

**Lightbox thumbnail labels / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].extras[].label`_
```
EARLY BUILD — FIBERGLASSING WITH MENTOR
TEAM ASSEMBLY — PROP INSTALL
FIELD TEST — SUNSET FLIGHT PREP
```

#### Row 5 — "Volunteering"

**Row eyebrow** · _hardcoded in `CONTENT.json` → `robotics[].slides[].eyebrow`_
```
> Volunteering
```

**Row title** · `home/robotics-compare/sailfish/5-open-sourced/title.md`
```
Open Sourced
```

**Row body (the sentence under the title)** · `home/robotics-compare/sailfish/5-open-sourced/body.md`
```
Open sourced the project to share our learnings and enable others working on similar problems in the drone and SAR communities.
```

**Photo caption (under the big photo, prefixed `//`)** · `home/robotics-compare/sailfish/5-open-sourced/caption.md`
```
GitHub repository · public release
```

**Long body (lightbox only)** · `home/robotics-compare/sailfish/5-open-sourced/long-body.md`
```
The full design — CAD, firmware, build notes, and the lessons from each generation — is published openly. The goal is for any volunteer SAR unit, university lab, or hobbyist team to be able to pick up where we left off without re-deriving the basics. The repo has been mirrored on a few Coast Guard auxiliary servers.
```

**Main photo label / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].imageLabel`_
```
OSS REPO — README
```

### Column: FIRST® Tech Challenge

**Eyebrow (above the column title)** · _hardcoded in `CONTENT.json` → `robotics[].eyebrow`_
```
Competitive Robotics
```

**Column title** · _hardcoded in `CONTENT.json` → `robotics[].title`_
```
FIRST® Tech Challenge
```

**Column subtitle** · `home/robotics-compare/ftc/subtitle.md`
```
Team 16366 TFS Robotic Unicorns
```


#### Row 1 — "Quick Info"

**Row eyebrow** · _hardcoded in `CONTENT.json` → `robotics[].slides[].eyebrow`_
```
> Quick Info
```

**Row title** · `home/robotics-compare/ftc/1-quick-info/title.md`
```
Intro to FTC
```

**Row body (the sentence under the title)** · `home/robotics-compare/ftc/1-quick-info/body.md`
```
Five years in FIRST Tech Challenge competitive robotics — two years learning the basics, one doing mechanical-electrical chassis design, and two as a mentor.
```

**Photo caption (under the big photo, prefixed `//`)** · `home/robotics-compare/ftc/1-quick-info/caption.md`
```
Team 16366 · Ontario Championship 2024
```

**Long body (lightbox only)** · `home/robotics-compare/ftc/1-quick-info/long-body.md`
```
Five years in FIRST Tech Challenge — two years learning the basics on a rookie team, one year owning the mechanical-electrical chassis as a builder, and two years as a mentor on Team 16366. FTC is where I learned to ship under deadline pressure with a rotating cast of teammates, and it's where I figured out I like teaching the craft as much as doing it.
```

**Main photo label / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].imageLabel`_
```
FTC COMP ROBOT — HERO
```

**Lightbox thumbnail labels / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].extras[].label`_
```
DRIVETRAIN
ARM SYSTEM
```

#### Row 2 — "Proof Point"

**Row eyebrow** · _hardcoded in `CONTENT.json` → `robotics[].slides[].eyebrow`_
```
> Proof Point
```

**Row title** · `home/robotics-compare/ftc/2-proof-point/title.md`
```
Inspire Award and Worlds
```

**Row body (the sentence under the title)** · `home/robotics-compare/ftc/2-proof-point/body.md`
```
Placed #1 in the 2024 FTC Ontario Championships (Inspire Award) and went on to represent Canada at the world championships in Houston, Texas.
```

**Photo caption (under the big photo, prefixed `//`)** · `home/robotics-compare/ftc/2-proof-point/caption.md`
```
Inspire Award · Ontario Championship
```

**Long body (lightbox only)** · `home/robotics-compare/ftc/2-proof-point/long-body.md`
```
Inspire is FTC's top award — judges across engineering, outreach, and team culture pick one team out of the province. We won it in 2024 and represented Ontario at the world championship in Houston, Texas. That trip was a benchmark: we saw what world-class teams look like and came home with a sharper picture of what's possible.
```

**Main photo label / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].imageLabel`_
```
INSPIRE AWARD — STAGE
```

**Lightbox thumbnail labels / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].extras[].label`_
```
ONTARIO CHAMPIONSHIP — CONFETTI
CENTER STAGE — TEAM WALKOUT
```

#### Row 3 — "Technical"

**Row eyebrow** · _hardcoded in `CONTENT.json` → `robotics[].slides[].eyebrow`_
```
> Technical
```

**Row title** · `home/robotics-compare/ftc/3-technical/title.md`
```
My Work on Mechanical
```

**Row body (the sentence under the title)** · `home/robotics-compare/ftc/3-technical/body.md`
```
Worked on important sub-assemblies including the custom CNC chassis and arm transfer system. Learnt quickly through hands-on projects.
```

**Photo caption (under the big photo, prefixed `//`)** · `home/robotics-compare/ftc/3-technical/caption.md`
```
CNC chassis plate · finishing pass
```

**Long body (lightbox only)** · `home/robotics-compare/ftc/3-technical/long-body.md`
```
I owned the CNC chassis plate from concept through fixturing and ops — my first time taking a part all the way from CAD into manufacturing. I also designed the two-stage arm transfer system that gave us a passive deadband and made our autonomous routines a lot more reliable. Both subsystems are documented as build references for the rookie team.
```

**Main photo label / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].imageLabel`_
```
CNC CHASSIS — TOOLPATH
```

**Lightbox thumbnail labels / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].extras[].label`_
```
FIXTURING
ARM TRANSFER
DRIVE HUB — CAD DRAWING
CHASSIS — COMPETITION PIT
```

#### Row 4 — "Leadership"

**Row eyebrow** · _hardcoded in `CONTENT.json` → `robotics[].slides[].eyebrow`_
```
> Leadership
```

**Row title** · `home/robotics-compare/ftc/4-leadership/title.md`
```
Mentoring and Team Building
```

**Row body (the sentence under the title)** · `home/robotics-compare/ftc/4-leadership/body.md`
```
Continued as a mentor giving insights on design and leadership challenges. Teaching peers and writing documentation to transfer skills to younger team members.
```

**Photo caption (under the big photo, prefixed `//`)** · `home/robotics-compare/ftc/4-leadership/caption.md`
```
Design review · winter build
```

**Long body (lightbox only)** · `home/robotics-compare/ftc/4-leadership/long-body.md`
```
After my competing years I stayed on as a mentor for two seasons. My focus has been writing design and leadership documentation that survives team turnover — onboarding decks, manufacturing checklists, and lessons-learned from past seasons. I want the rookies who join next year to start two months ahead of where I started.
```

**Main photo label / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].imageLabel`_
```
MENTOR SESSION — REVIEW
```

#### Row 5 — "Volunteering"

**Row eyebrow** · _hardcoded in `CONTENT.json` → `robotics[].slides[].eyebrow`_
```
> Volunteering
```

**Row title** · `home/robotics-compare/ftc/5-open-sourced/title.md`
```
Outreach Projects
```

**Row body (the sentence under the title)** · `home/robotics-compare/ftc/5-open-sourced/body.md`
```
Girl Guide STEM seminars, 3D printer workshops, teaching in grade 5 design club, and curating bilingual self-study STEM resources.
```

**Photo caption (under the big photo, prefixed `//`)** · `home/robotics-compare/ftc/5-open-sourced/caption.md`
```
Grade 5 design club · TFS
```

**Long body (lightbox only)** · `home/robotics-compare/ftc/5-open-sourced/long-body.md`
```
Outreach is one of the reasons our team wins Inspire. I've run Girl Guide STEM seminars, hands-on 3D printer workshops at the local makerspace, design club sessions for grade 5 students, and I curate a bilingual self-study STEM resource collection that gets shared with families looking for after-school enrichment.
```

**Main photo label / alt text** · _hardcoded in `CONTENT.json` → `robotics[].slides[].imageLabel`_
```
OUTREACH WORKSHOP — KIDS
```

## 2.6 §03 — Robotics sub-projects strip

> A horizontally-scrolling card strip. The cards are a curated view onto 6 of the /engineering grid projects — their titles and blurbs are listed in section 3.3, not repeated here.

**Eyebrow** · _hardcoded in `src/components/SubprojectsCarousel.astro`_
```
[ § 03 — Robotics sub-projects ]
```

**Heading** · _hardcoded in `src/components/SubprojectsCarousel.astro`_
```
Filter by domain.
```

**Link out (right of the heading)** · _hardcoded in `src/components/SubprojectsCarousel.astro`_
```
⊞ Full project grid →
```

**Filter chips** · _hardcoded in `src/components/SubprojectsCarousel.astro`_
```
ALL, then one chip per tag used by the featured projects (auto-generated from `tags.md`)
```

**Empty state** · _hardcoded in `src/components/SubprojectsCarousel.astro`_
```
[ No sub-projects in this domain yet ]
```

**Cards currently shown, in order** · _hardcoded in `CONTENT.json` → `homeFeatured` / `homeFeaturedOrder`_
```
1. Advanced 3D Design & Assembly  (Sailfish)
2. Custom Battery Pack Fabrication  (Sailfish)
3. VTX Stack — Avionics Packaging  (Sailfish)
4. Antenna Tracker  (Sailfish)
5. Arm & Transfer Mechanism  (FTC)
6. Custom CNC Chassis  (FTC)
```

## 2.7 Left-hand section rail (§04–§07 sticky outline)

**Rail cap** · _hardcoded in `src/components/SectionRail.astro`_
```
Contents
```

**Rail rows** · _hardcoded in `CONTENT.json` → `metaGroups` + `src/pages/index.astro`_
```
04 Academics
   · Education
   · Research
05 Well rounded
   · Sports
   · Creatives
   · Scouts
06 Experiences
   · Summer Programs
   · Side Quests
07 Principles
```


## 2.8 §04 — Academics

**Band marker** · _hardcoded in `src/components/MetaRail.astro`_
```
§ 04
```

**Section title** · _hardcoded in `CONTENT.json` → `metaGroups[].title`_
```
Academics
```

**Section subtitle** · _hardcoded in `CONTENT.json` → `metaGroups[].subtitle`_
```
School + research
```


### Group: Education

**Group counter + name** · _hardcoded in `CONTENT.json` → `metaGroups[].groups[].title`_
```
01 / 02   Education
```

**Group count chip** · _hardcoded in `src/components/MetaRail.astro`_
```
3 entries
```


#### Card — ★ standout (big card)

**Title** · `home/academics/education/tfs-and-scholars-guild/title.md`
```
TFS & Scholar's Guild
```

**Body** · `home/academics/education/tfs-and-scholars-guild/body.md`
```
Top 10% of students at TFS, a rigorous bilingual International Baccalaureate high school. Selected for the Scholar's Guild for academics and leadership.
```

#### Card

**Title** · `home/academics/education/ib-diploma-program/title.md`
```
IB Diploma Program
```

**Body** · `home/academics/education/ib-diploma-program/body.md`
```
Completed the full IB Diploma Program, focusing on physics, math, and chemistry to build a foundation for engineering.
```

#### Card

**Title** · `home/academics/education/bilingual-french/title.md`
```
Bilingual (French)
```

**Body** · `home/academics/education/bilingual-french/body.md`
```
Since a young age my education has been in French, and I've become bilingual in an English-only family.
```

### Group: Research

**Group counter + name** · _hardcoded in `CONTENT.json` → `metaGroups[].groups[].title`_
```
02 / 02   Research
```

**Group count chip** · _hardcoded in `src/components/MetaRail.astro`_
```
3 entries
```


#### Card

**Title** · `home/academics/research/5-8-ghz-video-over-open-water/title.md`
```
5.8 GHz video over open water
```

**Body** · `home/academics/research/5-8-ghz-video-over-open-water/body.md`
```
Investigated 5.8 GHz digital video transmission over water for drone camera systems — multipath, antenna polarization, and range.
```

#### Card — ★ standout (big card)

**Title** · `home/academics/research/optimized-sar-spiral/title.md`
```
Optimized SAR spiral
```

**Body** · `home/academics/research/optimized-sar-spiral/body.md`
```
Modelled the flight path for a search-and-rescue drone with a parametric optimized spiral considering wind drift and ocean current.
```

#### Card

**Title** · `home/academics/research/motor-and-prop-efficiency/title.md`
```
Motor & prop efficiency
```

**Body** · `home/academics/research/motor-and-prop-efficiency/body.md`
```
Efficiency testing on electric drone motors and propellers across a thrust-stand setup, building a usable lookup table for sizing.
```

## 2.9 §05 — Well rounded

**Band marker** · _hardcoded in `src/components/MetaRail.astro`_
```
§ 05
```

**Section title** · _hardcoded in `CONTENT.json` → `metaGroups[].title`_
```
Well rounded
```

**Section subtitle** · _hardcoded in `CONTENT.json` → `metaGroups[].subtitle`_
```
Outside the lab
```


### Group: Sports

**Group counter + name** · _hardcoded in `CONTENT.json` → `metaGroups[].groups[].title`_
```
01 / 03   Sports
```

**Group count chip** · _hardcoded in `src/components/MetaRail.astro`_
```
3 entries
```


#### Card — ★ standout (big card)

**Title** · `home/well-rounded/sports/rock-climbing/title.md`
```
Rock Climbing
```

**Body** · `home/well-rounded/sports/rock-climbing/body.md`
```
Serious about climbing for 4 years. I climb 5.12 on Top-Rope and V6 for Bouldering. I expect to join the UBC climbing team.
```

#### Card

**Title** · `home/well-rounded/sports/skiing/title.md`
```
Skiing
```

**Body** · `home/well-rounded/sports/skiing/body.md`
```
11 years of skiing with extensive lessons. Level 1 Instructor Certification. I can ski any double black diamond at places like Whistler.
```

#### Card

**Title** · `home/well-rounded/sports/sailing/title.md`
```
Sailing
```

**Body** · `home/well-rounded/sports/sailing/body.md`
```
Recreational sailing on the coast. A sport I enjoy with friends that requires support and cooperation.
```

### Group: Creatives

**Group counter + name** · _hardcoded in `CONTENT.json` → `metaGroups[].groups[].title`_
```
02 / 03   Creatives
```

**Group count chip** · _hardcoded in `src/components/MetaRail.astro`_
```
4 entries
```


#### Card — ★ standout (big card), links to /drone-videography

**Title** · `home/well-rounded/creatives/nature-drone-videography/title.md`
```
Nature Drone Videography
```

**Body** · `home/well-rounded/creatives/nature-drone-videography/body.md`
```
Exploring landscapes from above through drone photography and videography of natural environments.
```

**Link label** · _hardcoded in `src/components/MetaRail.astro`_
```
Take a look ↗
```

#### Card

**Title** · `home/well-rounded/creatives/violin/title.md`
```
Violin
```

**Body** · `home/well-rounded/creatives/violin/body.md`
```
10 years of violin in the Celtic and folk fiddle style. I comfortably play 20+ numbers and enjoy jamming with others.
```

#### Card — essay card (text only, full width)

**Title** · `home/well-rounded/creatives/philosophy/title.md`
```
Philosophy
```

**Body** · `home/well-rounded/creatives/philosophy/body.md`
```
Exploring moral ethics through our school's philosophy club, TOK class, and English coursework — the one place where the assignment is to take a question apart in public and let someone talk you out of the position you walked in with.
```

**Second paragraph (essay card)** · `home/well-rounded/creatives/philosophy/long.md`
```
DRAFT COPY — rewrite this in your own words. It carries into the engineering more than I expected. A search-and-rescue drone is a moral object as much as a technical one: who it is for, what it costs, and what happens when it gets the answer wrong. I would rather have that question in the room while the thing is being designed than answer it afterwards.
```

#### Card

**Title** · `home/well-rounded/creatives/web-design/title.md`
```
Web Design
```

**Body** · `home/well-rounded/creatives/web-design/body.md`
```
Designing and coding interactive web experiences — this portfolio included — with motion-first layouts and custom scroll-driven animations.
```

### Group: Scouts

**Group counter + name** · _hardcoded in `CONTENT.json` → `metaGroups[].groups[].title`_
```
03 / 03   Scouts
```

**Group count chip** · _hardcoded in `src/components/MetaRail.astro`_
```
3 entries
```


#### Card — ★ standout (big card)

**Title** · `home/well-rounded/scouts/12-years-in-scouts/title.md`
```
12 years in Scouts
```

**Body** · `home/well-rounded/scouts/12-years-in-scouts/body.md`
```
12 years from Beavers at age 5 to Venturer Scout. Scouts is about teamwork, building outdoor skills, discipline, service, loyalty, integrity and kindness.
```

#### Card

**Title** · `home/well-rounded/scouts/chief-scouts-award/title.md`
```
Chief Scout's Award
```

**Body** · `home/well-rounded/scouts/chief-scouts-award/body.md`
```
Earned the Chief Scout's Award, a designation requiring a volunteer project. I built a community library box.
```

#### Card

**Title** · `home/well-rounded/scouts/duke-of-edinburgh/title.md`
```
Duke of Edinburgh
```

**Body** · `home/well-rounded/scouts/duke-of-edinburgh/body.md`
```
Achieved the Silver Medal with Gold expected after completing the multi-day outdoors challenge.
```

## 2.10 §06 — Experiences

**Band marker** · _hardcoded in `src/components/MetaRail.astro`_
```
§ 06
```

**Section title** · _hardcoded in `CONTENT.json` → `metaGroups[].title`_
```
Experiences
```

**Section subtitle** · _hardcoded in `CONTENT.json` → `metaGroups[].subtitle`_
```
Programs + side quests
```

**Quirky sub-line (this section only)** · _hardcoded in `src/components/MetaRail.astro`_
```
slightly less serious from here on.
```


### Group: Summer Programs

**Group counter + name** · _hardcoded in `CONTENT.json` → `metaGroups[].groups[].title`_
```
01 / 02   Summer Programs
```

**Group count chip** · _hardcoded in `src/components/MetaRail.astro`_
```
3 entries
```


#### Card

**Title** · `home/experiences/summer-programs/shad/title.md`
```
SHAD
```

**Body** · `home/experiences/summer-programs/shad/body.md`
```
Canada-wide STEM enrichment program connecting students from across the country for intensive design challenges.
```

#### Card

**Title** · `home/experiences/summer-programs/waterloo-catalyst/title.md`
```
Waterloo Catalyst
```

**Body** · `home/experiences/summer-programs/waterloo-catalyst/body.md`
```
Engineering and entrepreneurship program at the University of Waterloo.
```

#### Card

**Title** · `home/experiences/summer-programs/scouts-jamboree/title.md`
```
Scouts Jamboree
```

**Body** · `home/experiences/summer-programs/scouts-jamboree/body.md`
```
Large-scale Scouts gathering bringing together members from across the region for outdoor activities and community.
```

### Group: Side Quests

**Group counter + name** · _hardcoded in `CONTENT.json` → `metaGroups[].groups[].title`_
```
02 / 02   Side Quests
```

**Group count chip** · _hardcoded in `src/components/MetaRail.astro`_
```
3 entries
```


#### Card

**Title** · `home/experiences/side-quests/light-suit-night-skiing/title.md`
```
Light suit night skiing
```

**Body** · `home/experiences/side-quests/light-suit-night-skiing/body.md`
```
Skiing the bunny hill at night wearing a fully wired EL-suit. Mostly to make other skiers smile.
```

#### Card — ★ standout (big card)

**Title** · `home/experiences/side-quests/dance-show-mc/title.md`
```
Dance Show MC
```

**Body** · `home/experiences/side-quests/dance-show-mc/body.md`
```
Hosted the school dance show. Suit on, jokes prepared, mostly improvised.
```

#### Card

**Title** · `home/experiences/side-quests/prank-day/title.md`
```
Prank Day
```

**Body** · `home/experiences/side-quests/prank-day/body.md`
```
Coordinated school-wide prank day. Logistics ran smoother than most of my robotics builds.
```

## 2.11 §07 — Principles

**Band marker** · _hardcoded in `src/components/PrinciplesRail.astro`_
```
§ 07
```

**Section title** · _hardcoded in `src/components/PrinciplesRail.astro`_
```
Principles
```

**Section subtitle** · _hardcoded in `src/components/PrinciplesRail.astro`_
```
What I look for in the work, and the people
```


### Column: engineering

**Column heading** · _hardcoded in `CONTENT.json` → `values.engineering.label`_
```
What I value in engineering work
```


**Number** · _hardcoded in `CONTENT.json` → `values[].points[].k`_
```
01
```

**Point title** · `home/principles/engineering/real-constraints/title.md`
```
Real constraints
```

**Point description** · `home/principles/engineering/real-constraints/desc.md`
```
Cost, weight, time. The constraint is the design.
```

**Number** · _hardcoded in `CONTENT.json` → `values[].points[].k`_
```
02
```

**Point title** · `home/principles/engineering/ship-the-prototype/title.md`
```
Ship the prototype
```

**Point description** · `home/principles/engineering/ship-the-prototype/desc.md`
```
First-principles thinking only matters once it flies.
```

**Number** · _hardcoded in `CONTENT.json` → `values[].points[].k`_
```
03
```

**Point title** · `home/principles/engineering/document-everything/title.md`
```
Document everything
```

**Point description** · `home/principles/engineering/document-everything/desc.md`
```
Future-me and the next person inherit the project.
```

### Column: creative

**Column heading** · _hardcoded in `CONTENT.json` → `values.creative.label`_
```
What I value in a creative & professional environment
```


**Number** · _hardcoded in `CONTENT.json` → `values[].points[].k`_
```
01
```

**Point title** · `home/principles/creative/high-trust-high-tempo/title.md`
```
High trust, high tempo
```

**Point description** · `home/principles/creative/high-trust-high-tempo/desc.md`
```
Move fast, disagree well, ship together.
```

**Number** · _hardcoded in `CONTENT.json` → `values[].points[].k`_
```
02
```

**Point title** · `home/principles/creative/curiosity-over-hierarchy/title.md`
```
Curiosity over hierarchy
```

**Point description** · `home/principles/creative/curiosity-over-hierarchy/desc.md`
```
Good ideas can come from the most junior person in the room.
```

**Number** · _hardcoded in `CONTENT.json` → `values[].points[].k`_
```
03
```

**Point title** · `home/principles/creative/outdoors-adjacent/title.md`
```
Outdoors-adjacent
```

**Point description** · `home/principles/creative/outdoors-adjacent/desc.md`
```
I do my best thinking after a long walk or a hard climb.
```

---

# 3. Engineering portfolio `/engineering`

## 3.1 Lander (top of page)

**Eyebrow** · _hardcoded in `src/pages/engineering.astro`_
```
// LUC DESAUTELS · ENGINEERING PORTFOLIO
```

**Title** · _hardcoded in `src/pages/engineering.astro`  ("portfolio" italic + accent period)_
```
Engineering
portfolio.
```

**Byline (line under the title)** · `engineering/eng-lander/byline.md`
```
The engineering work of **Luc Desautels**.
```

**Tagline (paragraph)** · `engineering/eng-lander/tagline.md`
```
Twenty-eight sub-projects across three programs. Start with the **programs** below — each one breaks down into the techniques behind it — or skip to the full grid and filter by **discipline**.
```

**Meta row** · _hardcoded in `src/pages/engineering.astro`_
```
Reuses the three home-page hero stats (Currently / Based in / Focus — see 2.1), plus:
```

**Extra meta stat** · _hardcoded in `src/pages/engineering.astro`_
```
Total  —  {N} sub-projects  (auto-counted)
```

**Scroll link 1** · `engineering/eng-lander/scroll-programs-label.md`
```
// Scroll — skills by program
```

**Scroll link 2** · `engineering/eng-lander/scroll-grid-label.md`
```
// Experience by project
```

**Telemetry block header** · _hardcoded in `src/pages/engineering.astro`_
```
// TELEMETRY
```

**Telemetry row 1** · `engineering/eng-lander/telemetry-sailfish.md`
```
SAILFISH · 17 SUB
```

**Telemetry row 2** · `engineering/eng-lander/telemetry-ftc.md`
```
FTC · 05 SUB
```

**Telemetry row 3** · `engineering/eng-lander/telemetry-standalone.md`
```
STANDALONE · 06 SUB
```

**Telemetry row 4** · `engineering/eng-lander/telemetry-research.md`
```
RESEARCH ENTRIES · 07
```

## 3.2 Skills by program

**Section eyebrow** · `engineering/eng-programs/section-eyebrow.md`
```
// Skills by program
```

**Section title** · `engineering/eng-programs/section-title.md`
```
Three programs, and what each one took
```

**Section lede** · `engineering/eng-programs/section-lede.md`
```
The grid further down lists everything. This is the same work grouped by the program it belongs to, with the technique behind each piece called out. **Click any row** to read it in full.
```

**Row count chip (per program)** · _hardcoded in `src/components/EngPrograms.astro`_
```
{NN} techniques
```

**Program link** · _hardcoded in `src/components/EngPrograms.astro`_
```
Full write-up →
```

**Lightbox first-open hint** · _hardcoded in `src/components/EngPrograms.astro`_
```
‹ Click — previous technique        Click — next technique ›
```


### Program: FIRST® Tech Challenge

**Eyebrow** · _hardcoded in `CONTENT.json` → `engPrograms[].eyebrow`_
```
// Program 01 / 03
```

**Program name** · _hardcoded in `CONTENT.json` → `engPrograms[].title`_
```
FIRST® Tech Challenge
```

**Years** · `engineering/eng-programs/ftc/years.md`
```
2022 — 2025
```

**Role** · `engineering/eng-programs/ftc/role.md`
```
Team 16366 · Mechanical design
```

**Blurb** · `engineering/eng-programs/ftc/blurb.md`
```
Four competition seasons with the TFS Robotic Unicorns, most of it on the mechanical side — drivetrain, manipulators, and the fixturing needed to make each part twice. FTC deadlines are unforgiving, so the work is biased toward parts a student can machine on a school 3-axis and repair between matches.
```

**Photo caption (prefixed `//`)** · `engineering/eng-programs/ftc/caption.md`
```
Team 16366 · competition build
```

**Photo alt text** · _hardcoded in `CONTENT.json` → `engPrograms[].imageLabel`_
```
FTC — COMPETITION ROBOT
```


#### Technique row 01

**Title** · `engineering/eng-programs/ftc/skills/arm-transfer/title.md`
```
Arm & Transfer Mechanism
```

**One-line description (the row copy)** · `engineering/eng-programs/ftc/skills/arm-transfer/desc.md`
```
Placeholder — not yet written up.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/ftc/skills/arm-transfer/long.md`
```
Placeholder — not yet written up.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Mechanical, CAD
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Arm & transfer mechanism
```

#### Technique row 02

**Title** · `engineering/eng-programs/ftc/skills/cnc-chassis/title.md`
```
Custom CNC Chassis
```

**One-line description (the row copy)** · `engineering/eng-programs/ftc/skills/cnc-chassis/desc.md`
```
Placeholder — not yet written up.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/ftc/skills/cnc-chassis/long.md`
```
Placeholder — not yet written up.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Manufacturing, Mechanical
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
CNC chassis
```

#### Technique row 03

**Title** · `engineering/eng-programs/ftc/skills/mentoring/title.md`
```
Mentoring Technical Skills & Onboarding
```

**One-line description (the row copy)** · `engineering/eng-programs/ftc/skills/mentoring/desc.md`
```
Mentored technical skills to younger members of the team as part of onboarding.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/ftc/skills/mentoring/long.md`
```
Ran mentoring sessions covering technical skills — CAD, machining, and assembly practices — for newer, younger members of the team, as part of onboarding them onto the team.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Leadership
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Mentoring session
```

#### Technique row 04

**Title** · `engineering/eng-programs/ftc/skills/girl-guides/title.md`
```
Local Girl Guides Group Events
```

**One-line description (the row copy)** · `engineering/eng-programs/ftc/skills/girl-guides/desc.md`
```
Placeholder — not yet written up.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/ftc/skills/girl-guides/long.md`
```
Placeholder — not yet written up.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Outreach
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Girl Guides outreach event
```

#### Technique row 05

**Title** · `engineering/eng-programs/ftc/skills/lighthouse-db/title.md`
```
Lighthouse Database
```

**One-line description (the row copy)** · `engineering/eng-programs/ftc/skills/lighthouse-db/desc.md`
```
Placeholder — not yet written up.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/ftc/skills/lighthouse-db/long.md`
```
Placeholder — not yet written up.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Software
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Lighthouse database
```

### Program: Project Sailfish

**Eyebrow** · _hardcoded in `CONTENT.json` → `engPrograms[].eyebrow`_
```
// Program 02 / 03
```

**Program name** · _hardcoded in `CONTENT.json` → `engPrograms[].title`_
```
Project Sailfish
```

**Years** · `engineering/eng-programs/sailfish/years.md`
```
2024 — 2026
```

**Role** · `engineering/eng-programs/sailfish/role.md`
```
Altum Robotics · Team Lead
```

**Blurb** · `engineering/eng-programs/sailfish/blurb.md`
```
A low-cost autonomous marine search-and-rescue drone, built to cut the time and cost for rescue crews to make first visual contact with a person in the water. Three generations of airframe, and with them most of the disciplines below — composites, RF, propulsion, CAD, and the software that ties them together.
```

**Photo caption (prefixed `//`)** · `engineering/eng-programs/sailfish/caption.md`
```
Sailfish Gen.3 · field test, Lake Ontario
```

**Photo alt text** · _hardcoded in `CONTENT.json` → `engPrograms[].imageLabel`_
```
SAILFISH GEN.3 — AIRFRAME
```


#### Technique row 01

**Title** · `engineering/eng-programs/sailfish/skills/airframe-cad/title.md`
```
Advanced 3D Design, Assembly & Aerodynamic Analysis
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/airframe-cad/desc.md`
```
Full CAD assembly of the Gen.3 airframe in Fusion 360, paired with CFD to find and cut drag on the VTOL arms and wing.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/airframe-cad/long.md`
```
Dozens of individual part designs across hundreds of iterations, organized into a large assembly and sub-assembly structure with joints constrained to realistic movement bounds. Modeling followed a consistent version-control and naming convention, with exploded animations rendered for presentation. Aerodynamics work used localized CFD on the VTOL-to-forward-flight transition arms and on the wing in forward flight, to find and reduce the highest-drag areas.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
CAD, Mechanical, Aero
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Exploded CAD assembly, Gen.3 airframe
```

#### Technique row 02

**Title** · `engineering/eng-programs/sailfish/skills/manufacturing/title.md`
```
Manufacturing — Exotic Polymer 3D Printing & Composite Layup
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/manufacturing/desc.md`
```
Printed structural parts in exotic engineering polymers and hand-laid fiberglass composite skins.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/manufacturing/long.md`
```
Placeholder — not yet written up.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Manufacturing, Materials
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Manufacturing — 3D printing and composite work
```

#### Technique row 03

**Title** · `engineering/eng-programs/sailfish/skills/waterproofing/title.md`
```
Waterproofing Innovations
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/waterproofing/desc.md`
```
Placeholder — not yet written up.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/waterproofing/long.md`
```
Placeholder — not yet written up.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Mechanical, Materials
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Waterproofing detail
```

#### Technique row 04

**Title** · `engineering/eng-programs/sailfish/skills/propulsion/title.md`
```
Power-Train Propulsion Testing & Characterization
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/propulsion/desc.md`
```
Bench-tested and characterized the motor/prop power train — also the subject of a Physics IA.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/propulsion/long.md`
```
Detailed write-up lives on LinkedIn and hasn't been transcribed here yet. This work also became the subject of an IB Physics Internal Assessment.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Research, Electrical, Mechanical
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Power-train bench test
```

#### Technique row 05

**Title** · `engineering/eng-programs/sailfish/skills/power-distribution/title.md`
```
Power Distribution & Monitoring Electronics
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/power-distribution/desc.md`
```
Main electrical work: motors, ESCs, power distribution board, dual-battery switching, and current/voltage monitoring.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/power-distribution/long.md`
```
The core electrical build-out — motors, ESCs, a power distribution board, dual-battery switching, and battery monitoring with current and voltage sensing.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Electrical
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Power distribution wiring
```

#### Technique row 06

**Title** · `engineering/eng-programs/sailfish/skills/battery/title.md`
```
Custom Battery Pack Fabrication
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/battery/desc.md`
```
Placeholder — not yet written up.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/battery/long.md`
```
Placeholder — not yet written up.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Electrical, Manufacturing
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Custom battery pack
```

#### Technique row 07

**Title** · `engineering/eng-programs/sailfish/skills/avionics-payload/title.md`
```
Avionics Payload — Sensor Array & VTX Stack
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/avionics-payload/desc.md`
```
A gimbaled 4K/IR camera payload feeding a dual VTX stack, actively cooled and vibration-isolated.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/avionics-payload/long.md`
```
The payload pairs a 4K colour camera with a low-light infrared camera on a gimbal, plus an optical flow sensor for close-to-ground landings and a lidar for landing. Video splits across two links: the 4K colour feed goes out over a digital VTX on 5.8GHz RHCP, and the infrared feed over an analog VTX on 5.8GHz LHCP. Both VTX modules have their own custom active-cooling module, are vibration-isolated, and route their waste heat back toward the battery cells — in principle to help cold-weather battery performance, though the extent of that benefit is untested.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Electrical, Mechanical
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
VTX stack and sensor gimbal
```

#### Technique row 08

**Title** · `engineering/eng-programs/sailfish/skills/video-tx/title.md`
```
Long-Range Video Transmission Systems
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/video-tx/desc.md`
```
Long-range 5.8GHz video link engineering — also the subject of a Physics Extended Essay.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/video-tx/long.md`
```
Detailed write-up lives on LinkedIn and hasn't been transcribed here yet. This work also became the subject of an IB Physics Extended Essay.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Research, Electrical
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Video transmission range test
```

#### Technique row 09

**Title** · `engineering/eng-programs/sailfish/skills/autonomy-electronics/title.md`
```
Autonomous Flight Electronics
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/autonomy-electronics/desc.md`
```
Placeholder — not yet written up.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/autonomy-electronics/long.md`
```
Placeholder — not yet written up.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Electrical, Software
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Autonomous flight electronics
```

#### Technique row 10

**Title** · `engineering/eng-programs/sailfish/skills/autonomy-software/title.md`
```
Autonomous Flight Software - Configuration \& Simulation
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/autonomy-software/desc.md`
```
Extensive ArduPilot configuration of flight controller and other electronics.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/autonomy-software/long.md`
```
Configured and simulation-tested redundant failsafes for autonomous flight in ArduPilot, so a single sensor or link failure doesn't turn into a lost aircraft.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Software
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
ArduPilot failsafe simulation
```

#### Technique row 11

**Title** · `engineering/eng-programs/sailfish/skills/esc-tuning/title.md`
```
Advanced ESC Harmonic Notch Filtering
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/esc-tuning/desc.md`
```
Tuned harmonic notch filters on the ESCs to cut motor-noise vibration from the flight-control loop.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/esc-tuning/long.md`
```
Placeholder — not yet written up.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Electrical, Software
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Notch-filtered vibration graph
```

#### Technique row 12

**Title** · `engineering/eng-programs/sailfish/skills/search-pattern/title.md`
```
Advanced Mathematical Modeling of Optimized Search Pattern
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/search-pattern/desc.md`
```
Modeled an optimized search pattern for marine search-and-rescue coverage — also the subject of a Math IA.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/search-pattern/long.md`
```
Detailed write-up lives on LinkedIn and hasn't been transcribed here yet. This work also became the subject of a Math Internal Assessment.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Research, Software
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Search-pattern model
```

#### Technique row 13

**Title** · `engineering/eng-programs/sailfish/skills/antenna-tracker/title.md`
```
Antenna Tracker & Portable Ground Station
```

**One-line description (the row copy)** · `engineering/eng-programs/sailfish/skills/antenna-tracker/desc.md`
```
A self-tracking directional antenna array paired with a portable ground station, so the video link and control follow the aircraft automatically.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/sailfish/skills/antenna-tracker/long.md`
```
The tracker runs a flight controller with GPS and compass, flashed and configured with ArduPilot's antenna-tracking firmware. It drives gimbal servos to point the antenna array at the aircraft automatically, auto-calibrating its own location and heading from GPS and compass, and cross-checking angle with redundant internal accelerometers. Digital VRX feeds an HDMI output, and an analog VRX drives its own screen and HDMI output. The array is four high-gain 14dBi triple-feed directional patch antennas (2 RHCP, 2 LHCP) plus four medium-gain dual-patch antennas (2 RHCP, 2 LHCP), on a two-servo gimbal mount and tripod. The portable ground station packages that tracker and the video/telemetry gear into a field-deployable kit.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Electrical, Mechanical, Software
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Antenna tracker and ground station
```

### Program: Uncategorized

**Eyebrow** · _hardcoded in `CONTENT.json` → `engPrograms[].eyebrow`_
```
// Program 03 / 03
```

**Program name** · _hardcoded in `CONTENT.json` → `engPrograms[].title`_
```
Uncategorized
```

**Years** · `engineering/eng-programs/misc/years.md`
```
2022 — present
```

**Role** · `engineering/eng-programs/misc/role.md`
```
Standalone builds & side quests
```

**Blurb** · `engineering/eng-programs/misc/blurb.md`
```
The work that doesn't belong to a program. Some of it is infrastructure I run because I wanted to understand it, some of it is hardware built for a specific evening. It's here because the skills are real even when the project isn't part of anything larger.
```

**Photo caption (prefixed `//`)** · `engineering/eng-programs/misc/caption.md`
```
Standalone builds
```

**Photo alt text** · _hardcoded in `CONTENT.json` → `engPrograms[].imageLabel`_
```
STANDALONE — WORKBENCH
```


#### Technique row 01

**Title** · `engineering/eng-programs/misc/skills/electroplating/title.md`
```
Electroplating Graphite (Chemistry IA)
```

**One-line description (the row copy)** · `engineering/eng-programs/misc/skills/electroplating/desc.md`
```
Electroplated graphite as the subject of a Chemistry Internal Assessment.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/misc/skills/electroplating/long.md`
```
Placeholder — not yet written up.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Research, Materials
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Electroplated graphite
```

#### Technique row 02

**Title** · `engineering/eng-programs/misc/skills/library-box/title.md`
```
Free Little Library
```

**One-line description (the row copy)** · `engineering/eng-programs/misc/skills/library-box/desc.md`
```
Built a free little library as a Scouts project.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/misc/skills/library-box/long.md`
```
Built and installed a free little library as part of a Scouts community project.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Manufacturing, Community
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Free little library
```

#### Technique row 03

**Title** · `engineering/eng-programs/misc/skills/selfhost/title.md`
```
Self-Hosted Private Server
```

**One-line description (the row copy)** · `engineering/eng-programs/misc/skills/selfhost/desc.md`
```
A home server behind a reverse proxy, running private communications, websites, and file/photo sync.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/misc/skills/selfhost/long.md`
```
Everything runs behind a reverse proxy: Nextcloud, Syncthing, and an Obsidian vault, alongside private communications and a few hosted websites and utilities — home server infrastructure for photos, videos, and day-to-day tools.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Software, Electrical
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Home server rack
```

#### Technique row 04

**Title** · `engineering/eng-programs/misc/skills/bike-generator/title.md`
```
Stationary-Bike Generator
```

**One-line description (the row copy)** · `engineering/eng-programs/misc/skills/bike-generator/desc.md`
```
A generator that attaches to a stationary bike, built with a business plan and prototype for SHAD — won the prototype award.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/misc/skills/bike-generator/long.md`
```
Built for SHAD: a generator that attaches to a stationary bike, backed by a business plan pitching it to gyms. The prototype won the SHAD prototype award. Like most human-power alternative energy, the physics works, but it doesn't come close to competing with solar on cost.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Mechanical, Research
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Stationary-bike generator
```

#### Technique row 05

**Title** · `engineering/eng-programs/misc/skills/mbot/title.md`
```
MBot Pickup Arm
```

**One-line description (the row copy)** · `engineering/eng-programs/misc/skills/mbot/desc.md`
```
Outfitted an MBot with a scoop and flipper to pick up objects — self-taught, without a team or guidance.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/misc/skills/mbot/long.md`
```
The first robotics project done solo, without a team or guidance: outfitting an MBot with a scoop and flipper to pick up objects. Self-taught 3D printing, CAD in Onshape, design for manufacturing tolerances, and moving-part design, as a project for tech class.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Mechanical, CAD
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
MBot with scoop and flipper
```

#### Technique row 06

**Title** · `engineering/eng-programs/misc/skills/wind-fan/title.md`
```
Wind-Powered Fan
```

**One-line description (the row copy)** · `engineering/eng-programs/misc/skills/wind-fan/desc.md`
```
A handheld fan that captures wind energy through a propeller to spin a second propeller — a spoof project poking fun at greenwashing.
```

**Long write-up (lightbox only)** · `engineering/eng-programs/misc/skills/wind-fan/long.md`
```
An eco-friendly handheld device that uses the wind: a propeller captures rotational energy from the wind and transfers it with a timing belt to a second propeller that blows air into your face to keep you cool. The catch is it only works when it's windy. Built as a spoof project at the University of Waterloo Catalyst summer program — a joke, but also a poke at greenwashing in consumer product marketing.
```

**Tags** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].tags`_
```
Mechanical, Research
```

**Image label / caption** · _hardcoded in `CONTENT.json` → `engPrograms[].skills[].images[]`_
```
Wind-powered fan
```

## 3.3 Project grid (all sub-projects)

**Eyebrow** · _hardcoded in `src/pages/engineering.astro`_
```
// Engineering Project Portfolio
```

**Heading** · _hardcoded in `src/pages/engineering.astro`_
```
Here's what I've been working on
```

**Hint (right of the heading)** · _hardcoded in `src/pages/engineering.astro`_
```
Hover to preview · click a tile to lock it as selected.
```

**Filter pills** · _hardcoded in `src/pages/engineering.astro`_
```
All {N}, then one pill per tag — generated automatically from every `tags.md` in the grid
```

**Card badge (when selected)** · _hardcoded in `src/pages/engineering.astro`_
```
● Selected
```

**Photo zoom cue** · _hardcoded in `src/pages/engineering.astro`_
```
⤢ Expand
```

**Empty state** · _hardcoded in `src/pages/engineering.astro`_
```
// NO MATCH
No projects match the current filter combination.
```

**Lightbox field headings** · _hardcoded in `src/pages/engineering.astro`_
```
> Requirements
> What I did
> Result
```

**Lightbox first-open hint** · _hardcoded in `src/pages/engineering.astro`_
```
‹ Click — previous        Click — next ›
```


> Each project below appears in three places with the same text: the card in the grid (title + blurb + tags), the detail panel on the right (adds `detail`), and the lightbox (adds requirements / what I did / result). Six of them are also the home page's sub-project cards.


### Advanced 3D Design & Assembly

_Sailfish  ·  also on the home strip (position 1)  ·  folder `engineering/eng-grid/airframe-cad-assembly/`_

**Title** · `engineering/eng-grid/airframe-cad-assembly/title.md`
```
Advanced 3D Design & Assembly
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/airframe-cad-assembly/blurb.md`
```
Full CAD assembly of the Sailfish airframe in Fusion 360 — every part, sub-assembly, and joint modeled before it was cut.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/airframe-cad-assembly/detail.md`
```
Dozens of individual part designs across hundreds of iterations, built up into a large assembly and sub-assembly structure with joints constrained to realistic movement bounds. Kept under version control with a consistent naming convention, and rendered as exploded animations for presentation.
```

**Requirements (lightbox)** · `engineering/eng-grid/airframe-cad-assembly/requirements.md`
```
Model the full Gen.3 airframe as a large, editable assembly that could absorb hundreds of design iterations without falling apart.
```

**What I did (lightbox)** · `engineering/eng-grid/airframe-cad-assembly/contribution.md`
```
Designed the individual parts and built the assembly/sub-assembly structure, with joints constrained to realistic movement bounds and a consistent naming/version-control convention.
```

**Result (lightbox)** · `engineering/eng-grid/airframe-cad-assembly/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/airframe-cad-assembly/tags.md`
```
CAD
Mechanical
```

**Photo 1 caption** · `engineering/eng-grid/airframe-cad-assembly/1.md`
```
Exploded CAD assembly
```

### Aerodynamic Analysis (CFD)

_Sailfish  ·  folder `engineering/eng-grid/aero-cfd-analysis/`_

**Title** · `engineering/eng-grid/aero-cfd-analysis/title.md`
```
Aerodynamic Analysis (CFD)
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/aero-cfd-analysis/blurb.md`
```
Localized CFD on the VTOL-to-forward-flight transition arms and the wing, to find and cut high-drag areas.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/aero-cfd-analysis/detail.md`
```
Ran computational fluid dynamics on the tilt arms during the VTOL-to-forward-flight transition and on the wing in forward flight, isolating the areas producing the most drag.
```

**Requirements (lightbox)** · `engineering/eng-grid/aero-cfd-analysis/requirements.md`
```
Identify and reduce high-drag areas on the transition arms and wing without a wind tunnel.
```

**What I did (lightbox)** · `engineering/eng-grid/aero-cfd-analysis/contribution.md`
```
Set up and ran the CFD studies and used the results to guide shape changes on the arms and wing.
```

**Result (lightbox)** · `engineering/eng-grid/aero-cfd-analysis/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/aero-cfd-analysis/tags.md`
```
Aero
Research
```

**Photo 1 caption** · `engineering/eng-grid/aero-cfd-analysis/1.md`
```
CFD pressure distribution
```

### Exotic Polymer 3D Printing

_Sailfish  ·  folder `engineering/eng-grid/exotic-3d-printing/`_

**Title** · `engineering/eng-grid/exotic-3d-printing/title.md`
```
Exotic Polymer 3D Printing
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/exotic-3d-printing/blurb.md`
```
Placeholder — not yet written up.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/exotic-3d-printing/detail.md`
```
Placeholder — not yet written up.
```

**Requirements (lightbox)** · `engineering/eng-grid/exotic-3d-printing/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/exotic-3d-printing/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/exotic-3d-printing/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/exotic-3d-printing/tags.md`
```
Manufacturing
```

**Photo 1 caption** · `engineering/eng-grid/exotic-3d-printing/1.md`
```
3D-printed part, exotic polymer
```

### Composite Layup — Fiberglass

_Sailfish  ·  folder `engineering/eng-grid/composite-layup/`_

**Title** · `engineering/eng-grid/composite-layup/title.md`
```
Composite Layup — Fiberglass
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/composite-layup/blurb.md`
```
Hand-laid fiberglass composite parts, a materials-engineering side of the build separate from the 3D-printed structure.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/composite-layup/detail.md`
```
Placeholder — not yet written up.
```

**Requirements (lightbox)** · `engineering/eng-grid/composite-layup/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/composite-layup/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/composite-layup/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/composite-layup/tags.md`
```
Manufacturing
Materials
```

**Photo 1 caption** · `engineering/eng-grid/composite-layup/1.md`
```
Fiberglass layup
```

### Waterproofing Innovations

_Sailfish  ·  folder `engineering/eng-grid/waterproofing/`_

**Title** · `engineering/eng-grid/waterproofing/title.md`
```
Waterproofing Innovations
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/waterproofing/blurb.md`
```
Placeholder — not yet written up.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/waterproofing/detail.md`
```
Placeholder — not yet written up.
```

**Requirements (lightbox)** · `engineering/eng-grid/waterproofing/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/waterproofing/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/waterproofing/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/waterproofing/tags.md`
```
Mechanical
Materials
```

**Photo 1 caption** · `engineering/eng-grid/waterproofing/1.md`
```
Waterproofing detail
```

### Power-Train Propulsion Testing

_Sailfish  ·  folder `engineering/eng-grid/propulsion-testing/`_

**Title** · `engineering/eng-grid/propulsion-testing/title.md`
```
Power-Train Propulsion Testing
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/propulsion-testing/blurb.md`
```
Bench-tested and characterized the motor/prop power train — also the subject of a Physics IA.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/propulsion-testing/detail.md`
```
Detailed write-up lives on LinkedIn and hasn't been transcribed here yet. This work also became the subject of an IB Physics Internal Assessment.
```

**Requirements (lightbox)** · `engineering/eng-grid/propulsion-testing/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/propulsion-testing/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/propulsion-testing/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/propulsion-testing/tags.md`
```
Research
Electrical
Mechanical
```

**Photo 1 caption** · `engineering/eng-grid/propulsion-testing/1.md`
```
Power-train bench test
```

### Power Distribution & Monitoring Electronics

_Sailfish  ·  folder `engineering/eng-grid/power-distribution/`_

**Title** · `engineering/eng-grid/power-distribution/title.md`
```
Power Distribution & Monitoring Electronics
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/power-distribution/blurb.md`
```
Motors, ESCs, PDB, dual-battery switching, and current/voltage monitoring, wired into one power system.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/power-distribution/detail.md`
```
The core electrical build-out — motors, ESCs, a power distribution board, dual-battery switching, and battery monitoring with current and voltage sensing.
```

**Requirements (lightbox)** · `engineering/eng-grid/power-distribution/requirements.md`
```
Distribute and monitor power across the motors and ESCs, with a dual-battery setup and visibility into current and voltage.
```

**What I did (lightbox)** · `engineering/eng-grid/power-distribution/contribution.md`
```
Wired and integrated the motors, ESCs, PDB, dual-battery switching, and current/voltage monitoring.
```

**Result (lightbox)** · `engineering/eng-grid/power-distribution/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/power-distribution/tags.md`
```
Electrical
```

**Photo 1 caption** · `engineering/eng-grid/power-distribution/1.md`
```
Power distribution wiring
```

### Custom Battery Pack Fabrication

_Sailfish  ·  also on the home strip (position 2)  ·  folder `engineering/eng-grid/battery-pack/`_

**Title** · `engineering/eng-grid/battery-pack/title.md`
```
Custom Battery Pack Fabrication
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/battery-pack/blurb.md`
```
Placeholder — not yet written up.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/battery-pack/detail.md`
```
Placeholder — not yet written up.
```

**Requirements (lightbox)** · `engineering/eng-grid/battery-pack/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/battery-pack/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/battery-pack/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/battery-pack/tags.md`
```
Electrical
Manufacturing
```

**Photo 1 caption** · `engineering/eng-grid/battery-pack/1.md`
```
Custom battery pack
```

### Gimbaled Drone Sensor Array

_Sailfish  ·  folder `engineering/eng-grid/gimbaled-sensor-array/`_

**Title** · `engineering/eng-grid/gimbaled-sensor-array/title.md`
```
Gimbaled Drone Sensor Array
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/gimbaled-sensor-array/blurb.md`
```
4K colour and low-light infrared cameras on a gimbal, plus optical flow and lidar for close-to-ground landings.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/gimbaled-sensor-array/detail.md`
```
The gimbal carries a 4K colour camera and a low-light infrared camera together, with an optical flow sensor and a lidar unit added specifically to handle landings close to the ground.
```

**Requirements (lightbox)** · `engineering/eng-grid/gimbaled-sensor-array/requirements.md`
```
Give the aircraft both daylight and low-light imaging, plus reliable altitude/attitude sensing right down to the water's surface.
```

**What I did (lightbox)** · `engineering/eng-grid/gimbaled-sensor-array/contribution.md`
```
Integrated the 4K and IR cameras on the gimbal alongside the optical flow sensor and lidar.
```

**Result (lightbox)** · `engineering/eng-grid/gimbaled-sensor-array/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/gimbaled-sensor-array/tags.md`
```
Electrical
Mechanical
```

**Photo 1 caption** · `engineering/eng-grid/gimbaled-sensor-array/1.md`
```
Gimbaled sensor array
```

### VTX Stack — Avionics Packaging

_Sailfish  ·  also on the home strip (position 3)  ·  folder `engineering/eng-grid/vtx-stack/`_

**Title** · `engineering/eng-grid/vtx-stack/title.md`
```
VTX Stack — Avionics Packaging
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/vtx-stack/blurb.md`
```
Dual VTX stack — digital 5.8GHz for the 4K feed, analog 5.8GHz for infrared — actively cooled and vibration-isolated.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/vtx-stack/detail.md`
```
4K colour goes out over a digital VTX on 5.8GHz RHCP; the infrared feed goes out over an analog VTX on 5.8GHz LHCP. Both modules have their own custom active-cooling setup, are vibration-isolated, and route waste heat back toward the battery cells.
```

**Requirements (lightbox)** · `engineering/eng-grid/vtx-stack/requirements.md`
```
Transmit two independent video feeds without the VTX modules overheating or shaking loose in flight.
```

**What I did (lightbox)** · `engineering/eng-grid/vtx-stack/contribution.md`
```
Packaged and cooled the dual VTX stack, and vibration-isolated the mounts.
```

**Result (lightbox)** · `engineering/eng-grid/vtx-stack/result.md`
```
Untested how much the heat-routing helps cold-weather battery performance — noted as a possible improvement, not yet verified.
```

**Tags (one per line)** · `engineering/eng-grid/vtx-stack/tags.md`
```
Electrical
```

**Photo 1 caption** · `engineering/eng-grid/vtx-stack/1.md`
```
VTX stack, nose cone open
```

### Long-Range Video Transmission Systems

_Sailfish  ·  folder `engineering/eng-grid/video-tx/`_

**Title** · `engineering/eng-grid/video-tx/title.md`
```
Long-Range Video Transmission Systems
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/video-tx/blurb.md`
```
Long-range 5.8GHz video transmission engineering, also the subject of a Physics Extended Essay.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/video-tx/detail.md`
```
Detailed write-up lives on LinkedIn and hasn't been transcribed here yet.
```

**Requirements (lightbox)** · `engineering/eng-grid/video-tx/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/video-tx/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/video-tx/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/video-tx/tags.md`
```
Research
Electrical
```

**Photo 1 caption** · `engineering/eng-grid/video-tx/1.md`
```
Video transmission range test
```

### Autonomous Flight Electronics

_Sailfish  ·  folder `engineering/eng-grid/autonomy-electronics/`_

**Title** · `engineering/eng-grid/autonomy-electronics/title.md`
```
Autonomous Flight Electronics
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/autonomy-electronics/blurb.md`
```
Placeholder — not yet written up.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/autonomy-electronics/detail.md`
```
Placeholder — not yet written up.
```

**Requirements (lightbox)** · `engineering/eng-grid/autonomy-electronics/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/autonomy-electronics/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/autonomy-electronics/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/autonomy-electronics/tags.md`
```
Electrical
Software
```

**Photo 1 caption** · `engineering/eng-grid/autonomy-electronics/1.md`
```
Autonomous flight electronics
```

### Autonomous Flight Software — Configuration & Simulation

_Sailfish  ·  folder `engineering/eng-grid/autonomy-software/`_

**Title** · `engineering/eng-grid/autonomy-software/title.md`
```
Autonomous Flight Software — Configuration & Simulation
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/autonomy-software/blurb.md`
```
Redundant failsafe configuration and simulation testing for autonomous flight, on ArduPilot.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/autonomy-software/detail.md`
```
Configured and simulation-tested redundant failsafes for autonomous flight in ArduPilot, so a single sensor or link failure doesn't turn into a lost aircraft.
```

**Requirements (lightbox)** · `engineering/eng-grid/autonomy-software/requirements.md`
```
Make a single sensor or link failure survivable during an autonomous mission.
```

**What I did (lightbox)** · `engineering/eng-grid/autonomy-software/contribution.md`
```
Configured and simulation-tested the redundant ArduPilot failsafes.
```

**Result (lightbox)** · `engineering/eng-grid/autonomy-software/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/autonomy-software/tags.md`
```
Software
```

**Photo 1 caption** · `engineering/eng-grid/autonomy-software/1.md`
```
ArduPilot failsafe simulation
```

### Advanced ESC Harmonic Notch Filtering

_Sailfish  ·  folder `engineering/eng-grid/esc-notch-filtering/`_

**Title** · `engineering/eng-grid/esc-notch-filtering/title.md`
```
Advanced ESC Harmonic Notch Filtering
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/esc-notch-filtering/blurb.md`
```
Tuned harmonic notch filters on the ESCs to cut motor-noise vibration from the flight-control loop.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/esc-notch-filtering/detail.md`
```
Placeholder — not yet written up.
```

**Requirements (lightbox)** · `engineering/eng-grid/esc-notch-filtering/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/esc-notch-filtering/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/esc-notch-filtering/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/esc-notch-filtering/tags.md`
```
Electrical
Software
```

**Photo 1 caption** · `engineering/eng-grid/esc-notch-filtering/1.md`
```
Notch-filtered vibration graph
```

### Optimized Search-Pattern Modeling

_Sailfish  ·  folder `engineering/eng-grid/search-pattern/`_

**Title** · `engineering/eng-grid/search-pattern/title.md`
```
Optimized Search-Pattern Modeling
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/search-pattern/blurb.md`
```
Mathematical modeling of an optimized search pattern for marine search-and-rescue coverage, also the subject of a Math IA.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/search-pattern/detail.md`
```
Detailed write-up lives on LinkedIn and hasn't been transcribed here yet.
```

**Requirements (lightbox)** · `engineering/eng-grid/search-pattern/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/search-pattern/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/search-pattern/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/search-pattern/tags.md`
```
Research
Software
```

**Photo 1 caption** · `engineering/eng-grid/search-pattern/1.md`
```
Search-pattern model
```

### Antenna Tracker

_Sailfish  ·  also on the home strip (position 4)  ·  folder `engineering/eng-grid/antenna-tracker/`_

**Title** · `engineering/eng-grid/antenna-tracker/title.md`
```
Antenna Tracker
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/antenna-tracker/blurb.md`
```
A self-tracking directional antenna array that points itself at the aircraft using GPS, compass, and redundant accelerometers.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/antenna-tracker/detail.md`
```
Runs a flight controller with GPS and compass, flashed with ArduPilot's antenna-tracking firmware, driving gimbal servos to keep the array pointed at the aircraft. It auto-calibrates its own location and heading and cross-checks angle with redundant internal accelerometers. Digital VRX feeds an HDMI output; analog VRX drives its own screen and HDMI output. The array is four high-gain 14dBi triple-feed directional patch antennas (2 RHCP, 2 LHCP) plus four medium-gain dual-patch antennas (2 RHCP, 2 LHCP), on a two-servo gimbal mount and tripod.
```

**Requirements (lightbox)** · `engineering/eng-grid/antenna-tracker/requirements.md`
```
Keep a directional antenna array pointed at a moving aircraft without a person manually aiming it.
```

**What I did (lightbox)** · `engineering/eng-grid/antenna-tracker/contribution.md`
```
Flashed and configured the ArduPilot antenna-tracking firmware, wired the GPS/compass/accelerometer stack, and built the two-servo gimbal mount and antenna array.
```

**Result (lightbox)** · `engineering/eng-grid/antenna-tracker/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/antenna-tracker/tags.md`
```
Electrical
Mechanical
Software
```

**Photo 1 caption** · `engineering/eng-grid/antenna-tracker/1.md`
```
Antenna tracker array
```

### Portable Ground Station

_Sailfish  ·  folder `engineering/eng-grid/groundstation/`_

**Title** · `engineering/eng-grid/groundstation/title.md`
```
Portable Ground Station
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/groundstation/blurb.md`
```
Placeholder — not yet written up.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/groundstation/detail.md`
```
Placeholder — not yet written up.
```

**Requirements (lightbox)** · `engineering/eng-grid/groundstation/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/groundstation/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/groundstation/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/groundstation/tags.md`
```
Electrical
Mechanical
```

**Photo 1 caption** · `engineering/eng-grid/groundstation/1.md`
```
Portable ground station
```

### Arm & Transfer Mechanism

_FTC  ·  also on the home strip (position 5)  ·  folder `engineering/eng-grid/arm-transfer/`_

**Title** · `engineering/eng-grid/arm-transfer/title.md`
```
Arm & Transfer Mechanism
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/arm-transfer/blurb.md`
```
Placeholder — not yet written up.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/arm-transfer/detail.md`
```
Placeholder — not yet written up.
```

**Requirements (lightbox)** · `engineering/eng-grid/arm-transfer/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/arm-transfer/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/arm-transfer/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/arm-transfer/tags.md`
```
Mechanical
CAD
```

**Photo 1 caption** · `engineering/eng-grid/arm-transfer/1.md`
```
Arm & transfer mechanism
```

### Custom CNC Chassis

_FTC  ·  also on the home strip (position 6)  ·  folder `engineering/eng-grid/cnc-chassis/`_

**Title** · `engineering/eng-grid/cnc-chassis/title.md`
```
Custom CNC Chassis
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/cnc-chassis/blurb.md`
```
Placeholder — not yet written up.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/cnc-chassis/detail.md`
```
Placeholder — not yet written up.
```

**Requirements (lightbox)** · `engineering/eng-grid/cnc-chassis/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/cnc-chassis/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/cnc-chassis/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/cnc-chassis/tags.md`
```
Manufacturing
Mechanical
```

**Photo 1 caption** · `engineering/eng-grid/cnc-chassis/1.md`
```
CNC chassis
```

### Mentoring Technical Skills & Onboarding

_FTC  ·  folder `engineering/eng-grid/mentoring-onboarding/`_

**Title** · `engineering/eng-grid/mentoring-onboarding/title.md`
```
Mentoring Technical Skills & Onboarding
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/mentoring-onboarding/blurb.md`
```
Mentored technical skills to younger members of the team as part of onboarding.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/mentoring-onboarding/detail.md`
```
Ran mentoring sessions covering technical skills — CAD, machining, and assembly practices — for newer, younger members of the team.
```

**Requirements (lightbox)** · `engineering/eng-grid/mentoring-onboarding/requirements.md`
```
Bring new team members up to speed on CAD and shop skills.
```

**What I did (lightbox)** · `engineering/eng-grid/mentoring-onboarding/contribution.md`
```
Ran mentoring sessions covering technical skills for newer, younger members of the team.
```

**Result (lightbox)** · `engineering/eng-grid/mentoring-onboarding/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/mentoring-onboarding/tags.md`
```
Leadership
```

**Photo 1 caption** · `engineering/eng-grid/mentoring-onboarding/1.md`
```
Mentoring session
```

### Local Girl Guides Group Events

_FTC  ·  folder `engineering/eng-grid/girl-guides-outreach/`_

**Title** · `engineering/eng-grid/girl-guides-outreach/title.md`
```
Local Girl Guides Group Events
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/girl-guides-outreach/blurb.md`
```
Placeholder — not yet written up.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/girl-guides-outreach/detail.md`
```
Placeholder — not yet written up.
```

**Requirements (lightbox)** · `engineering/eng-grid/girl-guides-outreach/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/girl-guides-outreach/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/girl-guides-outreach/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/girl-guides-outreach/tags.md`
```
Outreach
```

**Photo 1 caption** · `engineering/eng-grid/girl-guides-outreach/1.md`
```
Girl Guides outreach event
```

### Lighthouse Database

_FTC  ·  folder `engineering/eng-grid/lighthouse-database/`_

**Title** · `engineering/eng-grid/lighthouse-database/title.md`
```
Lighthouse Database
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/lighthouse-database/blurb.md`
```
Placeholder — not yet written up.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/lighthouse-database/detail.md`
```
Placeholder — not yet written up.
```

**Requirements (lightbox)** · `engineering/eng-grid/lighthouse-database/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/lighthouse-database/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/lighthouse-database/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/lighthouse-database/tags.md`
```
Software
```

**Photo 1 caption** · `engineering/eng-grid/lighthouse-database/1.md`
```
Lighthouse database
```

### Electroplating Graphite (Chemistry IA)

_Standalone  ·  folder `engineering/eng-grid/electroplating-graphite/`_

**Title** · `engineering/eng-grid/electroplating-graphite/title.md`
```
Electroplating Graphite (Chemistry IA)
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/electroplating-graphite/blurb.md`
```
Electroplated graphite as the subject of a Chemistry Internal Assessment.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/electroplating-graphite/detail.md`
```
Placeholder — not yet written up.
```

**Requirements (lightbox)** · `engineering/eng-grid/electroplating-graphite/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/electroplating-graphite/contribution.md`
```
Placeholder — not yet written up.
```

**Result (lightbox)** · `engineering/eng-grid/electroplating-graphite/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/electroplating-graphite/tags.md`
```
Research
Materials
```

**Photo 1 caption** · `engineering/eng-grid/electroplating-graphite/1.md`
```
Electroplated graphite
```

### Free Little Library

_Standalone  ·  folder `engineering/eng-grid/free-little-library/`_

**Title** · `engineering/eng-grid/free-little-library/title.md`
```
Free Little Library
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/free-little-library/blurb.md`
```
Built a free little library as a Scouts project.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/free-little-library/detail.md`
```
Built and installed a free little library as part of a Scouts community project.
```

**Requirements (lightbox)** · `engineering/eng-grid/free-little-library/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/free-little-library/contribution.md`
```
Designed and built the free little library structure.
```

**Result (lightbox)** · `engineering/eng-grid/free-little-library/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/free-little-library/tags.md`
```
Manufacturing
Community
```

**Photo 1 caption** · `engineering/eng-grid/free-little-library/1.md`
```
Free little library
```

### Self-Hosted Private Server

_Standalone  ·  folder `engineering/eng-grid/self-hosted-server/`_

**Title** · `engineering/eng-grid/self-hosted-server/title.md`
```
Self-Hosted Private Server
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/self-hosted-server/blurb.md`
```
A home server behind a reverse proxy, running Nextcloud, Syncthing, private comms, and a few hosted sites.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/self-hosted-server/detail.md`
```
Everything runs behind a reverse proxy: Nextcloud, Syncthing, and an Obsidian vault, alongside private communications and a few hosted websites and utilities.
```

**Requirements (lightbox)** · `engineering/eng-grid/self-hosted-server/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/self-hosted-server/contribution.md`
```
Set up and maintain the reverse proxy, Nextcloud, Syncthing, and hosted services.
```

**Result (lightbox)** · `engineering/eng-grid/self-hosted-server/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/self-hosted-server/tags.md`
```
Software
Electrical
```

**Photo 1 caption** · `engineering/eng-grid/self-hosted-server/1.md`
```
Home server rack
```

### Stationary-Bike Generator

_Standalone  ·  folder `engineering/eng-grid/bike-generator/`_

**Title** · `engineering/eng-grid/bike-generator/title.md`
```
Stationary-Bike Generator
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/bike-generator/blurb.md`
```
A generator that attaches to a stationary bike, built with a business plan for SHAD — won the prototype award.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/bike-generator/detail.md`
```
Built for SHAD: a generator that attaches to a stationary bike, backed by a business plan pitching it to gyms. Like most human-power alternative energy, the physics works, but it doesn't come close to competing with solar on cost.
```

**Requirements (lightbox)** · `engineering/eng-grid/bike-generator/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/bike-generator/contribution.md`
```
Designed and built the generator prototype and co-wrote the business plan.
```

**Result (lightbox)** · `engineering/eng-grid/bike-generator/result.md`
```
Won the prototype award at SHAD.
```

**Tags (one per line)** · `engineering/eng-grid/bike-generator/tags.md`
```
Mechanical
Research
```

**Photo 1 caption** · `engineering/eng-grid/bike-generator/1.md`
```
Stationary-bike generator
```

### MBot Pickup Arm

_Standalone  ·  folder `engineering/eng-grid/mbot-pickup-arm/`_

**Title** · `engineering/eng-grid/mbot-pickup-arm/title.md`
```
MBot Pickup Arm
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/mbot-pickup-arm/blurb.md`
```
Outfitted an MBot with a scoop and flipper to pick up objects — self-taught, without a team or guidance.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/mbot-pickup-arm/detail.md`
```
The first robotics project done solo, without a team or guidance. Self-taught 3D printing, CAD in Onshape, design for manufacturing tolerances, and moving-part design, as a project for tech class.
```

**Requirements (lightbox)** · `engineering/eng-grid/mbot-pickup-arm/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/mbot-pickup-arm/contribution.md`
```
Designed and built the scoop-and-flipper pickup mechanism and self-taught the CAD/printing skills needed to make it.
```

**Result (lightbox)** · `engineering/eng-grid/mbot-pickup-arm/result.md`
```
Placeholder — not yet written up.
```

**Tags (one per line)** · `engineering/eng-grid/mbot-pickup-arm/tags.md`
```
Mechanical
CAD
```

**Photo 1 caption** · `engineering/eng-grid/mbot-pickup-arm/1.md`
```
MBot with scoop and flipper
```

### Wind-Powered Fan

_Standalone  ·  folder `engineering/eng-grid/wind-powered-fan/`_

**Title** · `engineering/eng-grid/wind-powered-fan/title.md`
```
Wind-Powered Fan
```

**Blurb (card + detail panel + lightbox)** · `engineering/eng-grid/wind-powered-fan/blurb.md`
```
A handheld wind-powered fan — and a joke about greenwashing in consumer marketing.
```

**Detail (longer paragraph, detail panel only)** · `engineering/eng-grid/wind-powered-fan/detail.md`
```
A propeller captures rotational energy from the wind and transfers it with a timing belt to a second propeller that blows air into your face. Built as a spoof project at the University of Waterloo Catalyst summer program.
```

**Requirements (lightbox)** · `engineering/eng-grid/wind-powered-fan/requirements.md`
```
Placeholder — not yet written up.
```

**What I did (lightbox)** · `engineering/eng-grid/wind-powered-fan/contribution.md`
```
Designed and built the propeller-to-propeller wind-power mechanism.
```

**Result (lightbox)** · `engineering/eng-grid/wind-powered-fan/result.md`
```
Works, provided it's windy — the project's own punchline.
```

**Tags (one per line)** · `engineering/eng-grid/wind-powered-fan/tags.md`
```
Mechanical
Research
```

**Photo 1 caption** · `engineering/eng-grid/wind-powered-fan/1.md`
```
Wind-powered fan
```

---

# 4. Stub pages

> These four pages are linked from the top bar / footer but have no real content yet. Everything on them is hardcoded.

## 4.1 `/impactful-robotics`

**Eyebrow** · _hardcoded in `src/pages/impactful-robotics.astro`_
```
// LUC DESAUTELS · PROJECT SAILFISH
```

**Title** · _hardcoded in `src/pages/impactful-robotics.astro`_
```
Project
Sailfish.
```

**Body** · _hardcoded in `src/pages/impactful-robotics.astro`_
```
Content coming soon.
```

## 4.2 `/competitive-robotics`

**Eyebrow** · _hardcoded in `src/pages/competitive-robotics.astro`_
```
// LUC DESAUTELS · FIRST TECH CHALLENGE
```

**Title** · _hardcoded in `src/pages/competitive-robotics.astro`_
```
First Tech
Challenge.
```

**Body** · _hardcoded in `src/pages/competitive-robotics.astro`_
```
Content coming soon.
```

## 4.3 `/drone-videography`

**Eyebrow** · _hardcoded in `src/pages/drone-videography.astro`_
```
// LUC DESAUTELS · DRONE VIDEOGRAPHY
```

**Title** · _hardcoded in `src/pages/drone-videography.astro`_
```
Drone
Videography.
```

**Body** · _hardcoded in `src/pages/drone-videography.astro`_
```
Landscapes and natural environments filmed from above. Content coming soon.
```

## 4.4 `/resume`

**Eyebrow** · _hardcoded in `src/pages/resume.astro`_
```
// LUC DESAUTELS · RÉSUMÉ
```

**Title** · _hardcoded in `src/pages/resume.astro`_
```
Résumé.
```

**Body** · _hardcoded in `src/pages/resume.astro`_
```
Content coming soon.
```

## 4.5 `/404`

**Eyebrow** · _hardcoded in `src/pages/404.astro`_
```
404
```

**Title** · _hardcoded in `src/pages/404.astro`_
```
That page hasn't been built yet.
```

**Body** · _hardcoded in `src/pages/404.astro`  ("home page" and "Project Sailfish" are links)_
```
Try the home page, or jump straight to Project Sailfish.
```

---

# 5. SEO / metadata

> Browser tab titles, search-result descriptions, and link-preview cards. Not visible on the page itself.

**Default page title** · _hardcoded in `src/layouts/BaseLayout.astro`_
```
Luc Desautels — robotics, drone photography, and side quests
```

**Default description** · _hardcoded in `src/layouts/BaseLayout.astro`_
```
Luc Desautels' personal portfolio. Project Sailfish (open-source marine SAR drone), FTC Team 16366, drone videography, and more.
```

**Link-preview image alt** · _hardcoded in `src/layouts/BaseLayout.astro`_
```
Luc Desautels — robotics, drone photography, and side quests
```

**/engineering — title** · _hardcoded in `src/pages/engineering.astro`_
```
Engineering portfolio · Luc Desautels
```

**/engineering — description** · _hardcoded in `src/pages/engineering.astro`_
```
The full engineering portfolio: ~28 sub-projects across Sailfish, FTC, and standalone work.
```

**/impactful-robotics — title / description** · _hardcoded in `src/pages/impactful-robotics.astro`_
```
Project Sailfish · Luc Desautels
Project Sailfish — an autonomous sailing robotics program.
```

**/competitive-robotics — title / description** · _hardcoded in `src/pages/competitive-robotics.astro`_
```
First Tech Challenge · Luc Desautels
First Tech Challenge — competitive robotics program.
```

**/drone-videography — title / description** · _hardcoded in `src/pages/drone-videography.astro`_
```
Drone Videography · Luc Desautels
Nature drone videography — landscapes and natural environments filmed from above.
```

**/resume — title / description** · _hardcoded in `src/pages/resume.astro`_
```
Résumé · Luc Desautels
Résumé — Luc Desautels.
```

**/404 — title** · _hardcoded in `src/pages/404.astro`_
```
Not found — Luc Desautels
```

**Contact details (structured data + links)** · _hardcoded in `CONTENT.json` → `site.contact`_
```
email: L@desautels.net
github: github.com/lucdesautels
linkedin: linkedin.com/in/luc-desautels
```

---

# Appendix — text files not covered above

_None — every `.md` file under `Final_Images/` appears somewhere in this document._
