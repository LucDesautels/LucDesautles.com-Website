// Single source of truth for site copy.
// EDIT: site/CONTENT.json — not this file.
// This file re-exports the JSON with TypeScript types for the components.

import raw from "../../CONTENT.json";

// ── Types ────────────────────────────────────────────────────────────────────

export type MetaTuple = { label: string; value: string };

export type RoboticsSlide = {
  eyebrow: string;
  title: string;
  body: string;
  longBody?: string;
  caption?: string;
  imageLabel: string;
  image?: string;
  extras?: { label: string; image?: string }[];
};
export type RoboticsProgram = {
  eyebrow: string;
  title: string;
  subtitle?: string;
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
  /** Real photo for the card; falls back to the stripe placeholder. */
  image?: string;
  href?: string;
};
export type Group    = { id: string; title: string; items: Item[] };
export type MetaGroup = {
  id: string;
  title: string;
  subtitle: string;
  audiences: string[];
  groups: Group[];
};

export type TocItem    = { tag: string; label: string; h: number; w: number; big?: boolean };
export type TocSection = {
  id: string;
  label: string;
  tone: string;
  dark?: boolean;
  items: TocItem[];
};

export type Subproject = { tag: string; domain: string; label: string; desc: string };

export type EngTag =
  | "Research"
  | "Mechanical"
  | "Electrical"
  | "Software"
  | "CAD"
  | "Manufacturing"
  | "Materials"
  | "Aero"
  | "Field test"
  | "Open source";

export type EngImage   = { src: string; caption: string };

/** Program-section image: `src` missing → the striped placeholder, labelled. */
export type EngSlot  = { src?: string; caption?: string; label?: string };
export type EngSkill = {
  id: string;
  title: string;
  /** One sentence — this is the row copy. */
  desc: string;
  tags: EngTag[];
  /** The longer write-up, lightbox only. */
  long: string;
  images: EngSlot[];
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
  image?: string;
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
};

// ── Exports ──────────────────────────────────────────────────────────────────

export const SITE        = raw.site as { name: string; tagline: string; meta: MetaTuple[]; contact: { email: string; github: string; linkedin: string } };
export const RESUME_HREF = raw.resumeHref as string;
export const ROBOTICS    = raw.robotics    as RoboticsProgram[];
export const VALUES      = raw.values      as { engineering: { label: string; points: { k: string; t: string; d: string }[] }; creative: { label: string; points: { k: string; t: string; d: string }[] } };
export const META_GROUPS = raw.metaGroups  as MetaGroup[];
export const DEDICATED_PAGES = raw.dedicatedPages as { label: string; href: string }[];
export const TOC         = raw.toc         as TocSection[];
export const SUBPROJECTS = raw.subprojects as Subproject[];
export const DOMAINS     = raw.domains     as string[];
export const ENG_PROGRAMS = raw.engPrograms as EngProgram[];
export const ENG_PROJECTS = raw.engineering as EngProject[];
export const ENG_TAGS    = raw.engTags     as EngTag[];
