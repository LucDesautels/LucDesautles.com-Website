#!/usr/bin/env node
// One-time migration: reads the CURRENT site/CONTENT.json (the old
// literal-text / literal-path system), builds the new
// src/Final_Images/ tree from it (copying forward real photos that
// actually exist on disk, seeding every editable-text field into its own
// .md file), and writes the new CONTENT.json where those fields are now
// slot-path strings instead of literal values.
//
// Safe to re-run: it never deletes anything, and it skips copying into a
// slot that already has a real (non-generated) file. Run
// `node scripts/generate-placeholders.mjs` afterward to fill in every slot
// that didn't get a real photo carried forward.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, "..");
const OLD_CONTENT_PATH = path.join(SITE_ROOT, "CONTENT.json");
const FI = path.join(SITE_ROOT, "src/Final_Images");
const PUBLIC = path.join(SITE_ROOT, "public");
const UPLOADED_MEDIA = path.join(SITE_ROOT, "src/Uploaded Media");

const OLD = JSON.parse(fs.readFileSync(OLD_CONTENT_PATH, "utf8"));

const report = { copied: [], placeholdersNeeded: [], declaredButMissing: [], orphansOnDisk: [] };

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function writeMd(slot, value) {
  const p = path.join(FI, slot + ".md");
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, (value ?? "").toString().trim() + "\n", "utf8");
}
function slug(s) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip accents (é -> e, etc.)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/['’"()]/g, "")
    .replace(/(\d)\.(\d)/g, "$1-$2") // "5.10c" -> "5-10c", not "510c"
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

const placedSlots = new Set();
/** Copy a real photo forward from an old /public path (e.g. "/images/x/1.jpg") into `slot`, if it exists on disk. */
function placeImage(slot, oldPublicRelPath) {
  if (placedSlots.has(slot)) return slot;
  if (oldPublicRelPath) {
    const src = path.join(PUBLIC, oldPublicRelPath.replace(/^\//, ""));
    if (fs.existsSync(src) && fs.statSync(src).isFile()) {
      const ext = path.extname(src);
      const dest = path.join(FI, slot + ext);
      ensureDir(path.dirname(dest));
      fs.copyFileSync(src, dest);
      placedSlots.add(slot);
      report.copied.push({ slot, from: oldPublicRelPath });
      return slot;
    }
    report.declaredButMissing.push({ slot, expected: oldPublicRelPath });
  }
  report.placeholdersNeeded.push(slot);
  return slot;
}
/** Register a slot that reuses a photo already placed under `canonicalSlot` elsewhere — no copy, just shares the file. */
function shareImage(canonicalSlot) {
  return canonicalSlot;
}

// ── site / values ────────────────────────────────────────────────────────
const NEW = {
  _note:
    "Copy and image paths now live under site/src/Final_Images/ — see IMAGE_GUIDE.md. This file holds structure (ids, hrefs, tags-as-files, ordering) and text/image slot paths, not the literal words.",
  site: { ...OLD.site }, // name/meta/contact stay literal — structural, "never changing"
  resumeHref: OLD.resumeHref,
};
writeMd("home/hero/tagline", OLD.site.tagline);
NEW.site = { ...OLD.site, tagline: "home/hero/tagline" };

// ── robotics (Sailfish / FTC slide comparison) ─────────────────────────────
const ROBOTICS_FOLDER = { "Project Sailfish": "sailfish", "FIRST® Tech Challenge": "ftc" };
const SLIDE_SLUG = ["1-quick-info", "2-proof-point", "3-technical", "4-leadership", "5-open-sourced"];

NEW.robotics = OLD.robotics.map((prog) => {
  const progFolder = ROBOTICS_FOLDER[prog.title];
  const base = `home/robotics-compare/${progFolder}`;
  writeMd(`${base}/subtitle`, prog.subtitle);
  return {
    eyebrow: prog.eyebrow,
    title: prog.title,
    subtitle: `${base}/subtitle`,
    href: prog.href,
    slides: prog.slides.map((s, i) => {
      const sbase = `${base}/${SLIDE_SLUG[i]}`;
      writeMd(`${sbase}/title`, s.title);
      writeMd(`${sbase}/body`, s.body);
      writeMd(`${sbase}/long-body`, s.longBody);
      writeMd(`${sbase}/caption`, s.caption);
      placeImage(`${sbase}/hero`, s.image);
      return {
        eyebrow: s.eyebrow,
        title: `${sbase}/title`,
        body: `${sbase}/body`,
        longBody: `${sbase}/long-body`,
        caption: `${sbase}/caption`,
        imageLabel: s.imageLabel,
        image: `${sbase}/hero`,
        extras: (s.extras || []).map((e, ei) => {
          const slot = `${sbase}/extra-${ei + 1}`;
          placeImage(slot, e.image);
          return { label: e.label, image: slot };
        }),
      };
    }),
  };
});

// ── values / principles ─────────────────────────────────────────────────
function principlePoints(list, columnFolder) {
  return list.map((p) => {
    const s = slug(p.t);
    const base = `home/principles/${columnFolder}/${s}`;
    writeMd(`${base}/title`, p.t);
    writeMd(`${base}/desc`, p.d);
    return { k: p.k, t: `${base}/title`, d: `${base}/desc` };
  });
}
NEW.values = {
  engineering: { label: OLD.values.engineering.label, points: principlePoints(OLD.values.engineering.points, "engineering") },
  creative: { label: OLD.values.creative.label, points: principlePoints(OLD.values.creative.points, "creative") },
};

// ── metaGroups (academics / well-rounded / experiences) ────────────────────
const META_FOLDER = { academics: "academics", "well-rounded": "well-rounded", experiences: "experiences" };
const GROUP_FOLDER = { summer: "summer-programs", sidequests: "side-quests" }; // rename to match plan; others reuse their own id

NEW.metaGroups = OLD.metaGroups.map((meta) => {
  const metaBase = `home/${META_FOLDER[meta.id]}`;
  return {
    id: meta.id,
    title: meta.title,
    subtitle: meta.subtitle,
    audiences: meta.audiences,
    groups: meta.groups.map((g) => {
      const groupFolder = GROUP_FOLDER[g.id] || g.id;
      const gbase = `${metaBase}/${groupFolder}`;
      return {
        id: g.id,
        title: g.title,
        items: g.items.map((it) => {
          const ibase = `${gbase}/${slug(it.title)}`;
          writeMd(`${ibase}/title`, it.title);
          writeMd(`${ibase}/body`, it.body);
          if (it.long) writeMd(`${ibase}/long`, it.long);
          placeImage(`${ibase}/hero`, it.image ? it.image : undefined);
          return {
            standout: it.standout,
            outlined: it.outlined,
            essay: it.essay,
            title: `${ibase}/title`,
            body: `${ibase}/body`,
            long: it.long ? `${ibase}/long` : undefined,
            image: `${ibase}/hero`,
            href: it.href,
          };
        }),
      };
    }),
  };
});

// ── dedicatedPages / toc ────────────────────────────────────────────────
NEW.dedicatedPages = OLD.dedicatedPages;

const TOC_FOLDER = { academics: "academics", robotics: "robotics", wellrounded: "well-rounded", experiences: "experiences" };
NEW.toc = OLD.toc.map((sec) => {
  const base = `home/toc-gallery/${TOC_FOLDER[sec.id] || sec.id}`;
  return {
    id: sec.id,
    label: sec.label,
    tone: sec.tone,
    dark: sec.dark,
    items: sec.items.map((it) => {
      const slot = `${base}/${slug(it.label)}`;
      placeImage(slot, undefined); // no old source — placeholder only, per current inventory
      return { tag: it.tag, label: it.label, h: it.h, w: it.w, big: it.big, image: slot };
    }),
  };
});

// ── engineering (eng-grid) ───────────────────────────────────────────────
NEW.engineering = OLD.engineering.map((p) => {
  const base = `engineering/eng-grid/${p.id}`;
  writeMd(`${base}/title`, p.title);
  writeMd(`${base}/blurb`, p.blurb);
  writeMd(`${base}/detail`, p.detail);
  writeMd(`${base}/requirements`, p.requirements);
  writeMd(`${base}/contribution`, p.contribution);
  writeMd(`${base}/result`, p.result);
  writeMd(`${base}/tags`, p.tags.join("\n"));
  const images = p.images.map((img, i) => {
    const slot = `${base}/${i + 1}`;
    placeImage(slot, img.src);
    writeMd(slot, img.caption); // caption.md sits next to N.jpg at the same slot path
    return { src: slot, caption: slot };
  });
  return {
    id: p.id,
    parent: p.parent,
    year: p.year,
    title: `${base}/title`,
    blurb: `${base}/blurb`,
    detail: `${base}/detail`,
    tags: `${base}/tags`,
    images,
    requirements: `${base}/requirements`,
    contribution: `${base}/contribution`,
    result: `${base}/result`,
    homeFeatured: false,
    homeFeaturedOrder: null,
  };
});

const HOME_FEATURED_ORDER = [
  "vtx-stack", "tilt-rotor", "carry-through", "cnc-chassis",
  "arm-transfer", "auto-pathing", "foam-flotation", "groundstation",
];
for (const proj of NEW.engineering) {
  const idx = HOME_FEATURED_ORDER.indexOf(proj.id);
  if (idx !== -1) {
    proj.homeFeatured = true;
    proj.homeFeaturedOrder = idx + 1;
  }
}

function engGridBase(id) {
  return `engineering/eng-grid/${id}`;
}
function engGridImageSlots(id) {
  const proj = OLD.engineering.find((p) => p.id === id);
  return proj.images.map((_, i) => `${engGridBase(id)}/${i + 1}`);
}

// ── engPrograms (Skills by program) ─────────────────────────────────────
// Skill-image sharing map: skill id -> either an eng-grid project id (reuse
// all its images) or a list of explicit [slot, oldPublicPath] pairs when the
// skill's photos live somewhere other than the matching eng-grid folder.
const SKILL_SHARES_ENG_GRID = {
  "ftc-cnc": "cnc-chassis",
  "ftc-arm": "arm-transfer",
  "ftc-auto": "auto-pathing",
  "sf-materials": "foam-flotation",
  "sf-video": "vid-58ghz",
  "sf-assembly": "carry-through",
  "sf-avionics": "vtx-stack",
  "sf-tiltrotor": "tilt-rotor",
  "sf-aero": "wing-cfd",
  "sf-propulsion": "thrust-stand",
  "sf-battery": "battery-pack",
  "sf-sar": "sar-spiral",
  "sf-groundstation": "groundstation",
  "misc-drone-photo": "drone-photo",
  "misc-el-suit": "el-suit",
  "misc-fiddle": "fiddle-pickup",
};
// Skills whose images instead reuse specific robotics-compare slide slots.
const SKILL_SHARES_ROBOTICS = {
  "ftc-design-review": ["home/robotics-compare/ftc/3-technical/extra-1", "home/robotics-compare/ftc/3-technical/extra-2"],
};
// ftc-docs: first image shares eng-grid rookie-docs, second shares the FTC leadership slide hero.
const SKILL_MIXED_SHARES = {
  "ftc-docs": [{ eng: "rookie-docs" }, { robotics: "home/robotics-compare/ftc/4-leadership/hero" }],
};

const PROGRAM_FOLDER = { ftc: "ftc", sailfish: "sailfish", misc: "misc" };

NEW.engPrograms = OLD.engPrograms.map((prog) => {
  const pbase = `engineering/eng-programs/${PROGRAM_FOLDER[prog.id]}`;
  writeMd(`${pbase}/role`, prog.role);
  writeMd(`${pbase}/years`, prog.years);
  writeMd(`${pbase}/blurb`, prog.blurb);
  if (prog.caption) writeMd(`${pbase}/caption`, prog.caption);
  if (prog.image) placeImage(`${pbase}/hero`, prog.image);
  else placeImage(`${pbase}/hero`, undefined);

  return {
    id: prog.id,
    eyebrow: prog.eyebrow,
    title: prog.title,
    role: `${pbase}/role`,
    years: `${pbase}/years`,
    href: prog.href,
    blurb: `${pbase}/blurb`,
    image: `${pbase}/hero`,
    imageLabel: prog.imageLabel,
    caption: prog.caption ? `${pbase}/caption` : undefined,
    skills: prog.skills.map((sk) => {
      const sbase = `${pbase}/skills/${sk.id.replace(/^(ftc|sf|misc)-/, "")}`;
      writeMd(`${sbase}/title`, sk.title);
      writeMd(`${sbase}/desc`, sk.desc);
      writeMd(`${sbase}/long`, sk.long);

      let images;
      if (SKILL_SHARES_ENG_GRID[sk.id]) {
        const gridId = SKILL_SHARES_ENG_GRID[sk.id];
        const gridImages = OLD.engineering.find((p) => p.id === gridId).images;
        const slots = engGridImageSlots(gridId);
        images = sk.images.map((im, i) => ({ src: shareImage(slots[i] ?? slots[slots.length - 1]), caption: im.caption }));
      } else if (SKILL_SHARES_ROBOTICS[sk.id]) {
        const slots = SKILL_SHARES_ROBOTICS[sk.id];
        images = sk.images.map((im, i) => ({ src: shareImage(slots[i]), caption: im.caption }));
      } else if (SKILL_MIXED_SHARES[sk.id]) {
        const shares = SKILL_MIXED_SHARES[sk.id];
        images = sk.images.map((im, i) => {
          const share = shares[i];
          const slot = share.eng ? engGridImageSlots(share.eng)[0] : share.robotics;
          return { src: shareImage(slot), caption: im.caption };
        });
      } else {
        images = sk.images.map((im, i) => {
          const slot = `${sbase}/${i + 1}`;
          placeImage(slot, im.src);
          return { src: slot, caption: im.caption, label: im.label };
        });
      }

      return {
        id: sk.id,
        title: `${sbase}/title`,
        desc: `${sbase}/desc`,
        tags: sk.tags,
        long: `${sbase}/long`,
        images,
      };
    }),
  };
});

// ── eng-lander decorative chips — reuse obviously-matching real content ────
placeImage("engineering/eng-lander/sailfish-gen3", undefined);
placeImage("engineering/eng-lander/ftc-arm-transfer", undefined);
placeImage("engineering/eng-lander/thrust-stand", undefined);
NEW.engLander = {
  sailfishImage: shareImage("home/robotics-compare/sailfish/1-quick-info/hero"),
  ftcArmImage: shareImage(engGridImageSlots("arm-transfer")[0]),
  thrustStandImage: shareImage(engGridImageSlots("thrust-stand")[0]),
};

// ── robotics-intro flanking images + blurbs ─────────────────────────────
if (fs.existsSync(UPLOADED_MEDIA)) {
  const files = fs
    .readdirSync(UPLOADED_MEDIA)
    .filter((f) => /\.(png|jpe?g|webp|avif|gif)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  const [leftFile, rightFile] = files;
  if (leftFile) {
    const ext = path.extname(leftFile);
    ensureDir(path.join(FI, "home/robotics-intro"));
    fs.copyFileSync(path.join(UPLOADED_MEDIA, leftFile), path.join(FI, "home/robotics-intro/left-image" + ext));
    placedSlots.add("home/robotics-intro/left-image");
    report.copied.push({ slot: "home/robotics-intro/left-image", from: `src/Uploaded Media/${leftFile}` });
  } else placeImage("home/robotics-intro/left-image", undefined);
  if (rightFile) {
    const ext = path.extname(rightFile);
    ensureDir(path.join(FI, "home/robotics-intro"));
    fs.copyFileSync(path.join(UPLOADED_MEDIA, rightFile), path.join(FI, "home/robotics-intro/right-image" + ext));
    placedSlots.add("home/robotics-intro/right-image");
    report.copied.push({ slot: "home/robotics-intro/right-image", from: `src/Uploaded Media/${rightFile}` });
  } else placeImage("home/robotics-intro/right-image", undefined);
} else {
  placeImage("home/robotics-intro/left-image", undefined);
  placeImage("home/robotics-intro/right-image", undefined);
}
writeMd("home/robotics-intro/sailfish-blurb", "Three generations of an open-sourced autonomous SAR drone. Built to reach lost crews faster.");
writeMd("home/robotics-intro/ftc-blurb", "Five years FTC — competitor, mechanical lead, mentor. Ontario Inspire 2024 + Worlds, Houston.");
NEW.roboticsIntro = {
  leftImage: "home/robotics-intro/left-image",
  rightImage: "home/robotics-intro/right-image",
  sailfishBlurb: "home/robotics-intro/sailfish-blurb",
  ftcBlurb: "home/robotics-intro/ftc-blurb",
};

// ── hero polaroids ───────────────────────────────────────────────────────
const HERO_DIR = path.join(PUBLIC, "images/homepage/hero");
const HERO_SLOTS = ["portrait", "in-the-field", "outdoors"];
if (fs.existsSync(HERO_DIR)) {
  const files = fs.readdirSync(HERO_DIR).filter((f) => /\.(png|jpe?g|webp|gif|avif)$/i.test(f)).sort();
  files.forEach((f, i) => {
    if (!HERO_SLOTS[i]) return;
    const slot = `home/hero/${HERO_SLOTS[i]}`;
    const ext = path.extname(f);
    ensureDir(path.join(FI, "home/hero"));
    fs.copyFileSync(path.join(HERO_DIR, f), path.join(FI, slot + ext));
    placedSlots.add(slot);
    report.copied.push({ slot, from: `public/images/homepage/hero/${f}` });
  });
}
for (const s of HERO_SLOTS) if (!placedSlots.has(`home/hero/${s}`)) report.placeholdersNeeded.push(`home/hero/${s}`);
NEW.hero = { portrait: "home/hero/portrait", inTheField: "home/hero/in-the-field", outdoors: "home/hero/outdoors" };

// ── write the new CONTENT.json ───────────────────────────────────────────
fs.writeFileSync(OLD_CONTENT_PATH, JSON.stringify(NEW, null, 2) + "\n", "utf8");

// ── orphaned real photos still sitting under public/images/, unreferenced ──
function walk(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, base));
    else if (/\.(png|jpe?g|webp|gif|avif)$/i.test(entry.name)) out.push(path.relative(base, full).replace(/\\/g, "/"));
  }
  return out;
}
const copiedFromPaths = new Set(report.copied.map((c) => c.from.replace(/^\//, "")));
if (fs.existsSync(path.join(PUBLIC, "images"))) {
  for (const rel of walk(path.join(PUBLIC, "images"))) {
    if (!copiedFromPaths.has(`images/${rel}`)) report.orphansOnDisk.push(`public/images/${rel}`);
  }
}

fs.writeFileSync(path.join(__dirname, "migration-report.json"), JSON.stringify(report, null, 2), "utf8");
console.log(`Copied forward: ${report.copied.length}`);
console.log(`Needing a generated placeholder: ${report.placeholdersNeeded.length}`);
console.log(`Declared in old CONTENT.json but missing on disk: ${report.declaredButMissing.length}`);
console.log(`Orphaned real photos left in public/images/ (unreferenced, not moved): ${report.orphansOnDisk.length}`);
console.log(`Full report: scripts/migration-report.json`);
