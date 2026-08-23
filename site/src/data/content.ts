// Single source of truth for site copy and image paths.
// EDIT: drop a file into site/src/Final_Images/ — see IMAGE_GUIDE.md.
// CONTENT.json holds structure (ids, hrefs, ordering) and slot paths, not
// the literal words — this file resolves those slot paths into real text
// and build-time-optimized images for the components to consume.

import type { ImageMetadata } from "astro";
import raw from "../../CONTENT.json";
import { resolveImage, resolveHoverImage, readText, readTagList } from "../lib/finalImages";

// ── Types (resolved — what components actually consume) ────────────────────

export type MetaTuple = { label: string; value: string };

export type RoboticsSlide = {
  eyebrow: string;
  title: string;
  body: string;
  longBody: string;
  caption: string;
  imageLabel: string;
  image: ImageMetadata;
  extras: { label: string; image: ImageMetadata }[];
};
export type RoboticsProgram = {
  eyebrow: string;
  title: string;
  subtitle: string;
  href: string;
  slides: RoboticsSlide[];
};

export type Item = {
  standout?: boolean;
  outlined?: boolean;
  /** Text-only card: no image, full-width band, room for `long`. (MetaRail) */
  essay?: boolean;
  title: string;
  body: string;
  /** Second paragraph, essay cards only. */
  long?: string;
  image: ImageMetadata;
  /** Second image in the same folder (any filename besides hero.*), shown on hover if present. */
  hoverImage?: ImageMetadata;
  href?: string;
};
export type Group = { id: string; title: string; items: Item[] };
export type MetaGroup = {
  id: string;
  title: string;
  subtitle: string;
  audiences: string[];
  groups: Group[];
};

export type TocItem = { tag: string; label: string; h: number; w: number; big?: boolean; image: ImageMetadata };
export type TocSection = {
  id: string;
  label: string;
  tone: string;
  dark?: boolean;
  items: TocItem[];
};

/** Freeform — typing a new word in a project's tags.md creates a new tag everywhere it's used. */
export type EngTag = string;

export type EngImage = { src: ImageMetadata; caption: string };

export type EngSlotImage = { src: ImageMetadata; caption?: string; label?: string };
export type EngSkill = {
  id: string;
  title: string;
  /** One sentence — this is the row copy. */
  desc: string;
  tags: EngTag[];
  /** The longer write-up, lightbox only. */
  long: string;
  images: EngSlotImage[];
};
/** One of the three big programs above the grid, with its skill rows. */
export type EngProgram = {
  id: string;
  eyebrow: string;
  title: string;
  role: string;
  years: string;
  href?: string;
  blurb: string;
  image?: ImageMetadata;
  imageLabel: string;
  caption?: string;
  skills: EngSkill[];
};

export type EngProject = {
  id: string;
  title: string;
  blurb: string;
  detail: string;
  tags: EngTag[];
  parent?: "Sailfish" | "FTC" | "Standalone";
  year?: string;
  images: EngImage[];
  requirements: string;
  contribution: string;
  result: string;
  /** Shows on the home page's sub-projects strip when true, ordered by homeFeaturedOrder. */
  homeFeatured: boolean;
  homeFeaturedOrder: number | null;
};

// ── Resolvers ────────────────────────────────────────────────────────────

type Raw = typeof raw;

/** True if x isn't null/undefined — narrows a .map(...).filter(isDefined) to drop the missing ones. */
function isDefined<T>(x: T | null | undefined): x is T {
  return x != null;
}

function resolveSlide(s: Raw["robotics"][number]["slides"][number]): RoboticsSlide | null {
  const image = resolveImage(s.image);
  if (!image) return null;
  return {
    eyebrow: s.eyebrow,
    title: readText(s.title),
    body: readText(s.body),
    longBody: readText(s.longBody),
    caption: readText(s.caption),
    imageLabel: s.imageLabel,
    image,
    extras: s.extras
      .map((e) => {
        const img = resolveImage(e.image);
        return img ? { label: e.label, image: img } : null;
      })
      .filter(isDefined),
  };
}

function resolveItem(it: Raw["metaGroups"][number]["groups"][number]["items"][number]): Item | null {
  const image = resolveImage(it.image);
  if (!image) return null;
  return {
    standout: it.standout,
    outlined: it.outlined,
    essay: it.essay,
    title: readText(it.title),
    body: readText(it.body),
    long: it.long ? readText(it.long) : undefined,
    image,
    hoverImage: resolveHoverImage(it.image),
    href: it.href,
  };
}

function resolveEngProject(p: Raw["engineering"][number]): EngProject | null {
  const images = p.images
    .map((img) => {
      const src = resolveImage(img.src);
      return src ? { src, caption: readText(img.caption) } : null;
    })
    .filter(isDefined);
  if (images.length === 0) return null;
  return {
    id: p.id,
    parent: p.parent as EngProject["parent"],
    year: p.year,
    title: readText(p.title),
    blurb: readText(p.blurb),
    detail: readText(p.detail),
    tags: readTagList(p.tags),
    images,
    requirements: readText(p.requirements),
    contribution: readText(p.contribution),
    result: readText(p.result),
    homeFeatured: p.homeFeatured,
    homeFeaturedOrder: p.homeFeaturedOrder,
  };
}

function resolveEngProgram(prog: Raw["engPrograms"][number]): EngProgram {
  const skills = prog.skills
    .map((sk) => {
      const images = sk.images
        .map((im) => {
          const src = resolveImage(im.src);
          return src
            ? { src, caption: "caption" in im ? im.caption : undefined, label: "label" in im ? im.label : undefined }
            : null;
        })
        .filter(isDefined);
      if (images.length === 0) return null;
      return {
        id: sk.id,
        title: readText(sk.title),
        desc: readText(sk.desc),
        tags: sk.tags,
        long: readText(sk.long),
        images,
      };
    })
    .filter(isDefined);
  return {
    id: prog.id,
    eyebrow: prog.eyebrow,
    title: prog.title,
    role: readText(prog.role),
    years: readText(prog.years),
    href: prog.href,
    blurb: readText(prog.blurb),
    image: resolveImage(prog.image),
    imageLabel: prog.imageLabel,
    caption: prog.caption ? readText(prog.caption) : undefined,
    skills,
  };
}

// ── Exports ──────────────────────────────────────────────────────────────

export const SITE = {
  ...raw.site,
  tagline: readText(raw.site.tagline),
  meta: raw.site.meta.map((m) => ({ label: m.label, value: readText(m.value) })),
} as { name: string; tagline: string; meta: MetaTuple[]; contact: { email: string; github: string; linkedin: string } };

export const RESUME_HREF = raw.resumeHref as string;

export const ROBOTICS: RoboticsProgram[] = raw.robotics.map((prog) => ({
  eyebrow: prog.eyebrow,
  title: prog.title,
  subtitle: readText(prog.subtitle),
  href: prog.href,
  slides: prog.slides.map(resolveSlide).filter(isDefined),
}));

export const VALUES = {
  engineering: {
    label: raw.values.engineering.label,
    points: raw.values.engineering.points.map((p) => ({ k: p.k, t: readText(p.t), d: readText(p.d) })),
  },
  creative: {
    label: raw.values.creative.label,
    points: raw.values.creative.points.map((p) => ({ k: p.k, t: readText(p.t), d: readText(p.d) })),
  },
};

export const META_GROUPS: MetaGroup[] = raw.metaGroups.map((meta) => ({
  id: meta.id,
  title: meta.title,
  subtitle: meta.subtitle,
  audiences: meta.audiences,
  groups: meta.groups.map((g) => ({ id: g.id, title: g.title, items: g.items.map(resolveItem).filter(isDefined) })),
}));

export const DEDICATED_PAGES = raw.dedicatedPages as { label: string; href: string }[];

export const TOC: TocSection[] = raw.toc.map((sec) => ({
  id: sec.id,
  label: sec.label,
  tone: sec.tone,
  dark: sec.dark,
  items: sec.items
    .map((it) => {
      const image = resolveImage(it.image);
      return image ? { tag: it.tag, label: it.label, h: it.h, w: it.w, big: it.big, image } : null;
    })
    .filter(isDefined),
}));

export const ENG_PROGRAMS: EngProgram[] = raw.engPrograms.map(resolveEngProgram);
export const ENG_PROJECTS: EngProject[] = raw.engineering.map(resolveEngProject).filter(isDefined);

/** Union of every tag actually in use across the full project grid — drives the /engineering filter pills. */
export const ENG_TAGS: EngTag[] = Array.from(new Set(ENG_PROJECTS.flatMap((p) => p.tags))).sort();

/** The home page's sub-projects strip: a curated view onto ENG_PROJECTS, not a separate content type. */
export const HOME_FEATURED_PROJECTS: EngProject[] = ENG_PROJECTS.filter((p) => p.homeFeatured).sort(
  (a, b) => (a.homeFeaturedOrder ?? 0) - (b.homeFeaturedOrder ?? 0),
);

export const ENG_LANDER = {
  sailfishImage: resolveImage(raw.engLander.sailfishImage),
  ftcArmImage: resolveImage(raw.engLander.ftcArmImage),
  thrustStandImage: resolveImage(raw.engLander.thrustStandImage),
  byline: readText(raw.engLander.byline),
  tagline: readText(raw.engLander.tagline),
  scrollProgramsLabel: readText(raw.engLander.scrollProgramsLabel),
  scrollGridLabel: readText(raw.engLander.scrollGridLabel),
  telemetry: raw.engLander.telemetry.map(readText),
};

export const ENG_PROGRAMS_SECTION = {
  eyebrow: readText(raw.engProgramsSection.eyebrow),
  title: readText(raw.engProgramsSection.title),
  lede: readText(raw.engProgramsSection.lede),
};

export const ROBOTICS_INTRO = {
  leftImage: resolveImage(raw.roboticsIntro.leftImage),
  rightImage: resolveImage(raw.roboticsIntro.rightImage),
  sailfishBlurb: readText(raw.roboticsIntro.sailfishBlurb),
  ftcBlurb: readText(raw.roboticsIntro.ftcBlurb),
};

export const HERO_IMAGES = {
  portrait: resolveImage(raw.hero.portrait),
  inTheField: resolveImage(raw.hero.inTheField),
  outdoors: resolveImage(raw.hero.outdoors),
};
