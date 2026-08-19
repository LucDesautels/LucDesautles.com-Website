import fs from "node:fs";
import path from "node:path";
import type { ImageMetadata } from "astro";

// Every image slot on the site lives under src/Final_Images/, addressed by a
// "slot path" — a repo-relative path with no extension, e.g.
// "engineering/eng-grid/cnc-chassis/hero". A slot always has a real file:
// either a real photo, or a generated placeholder PNG with the same slot
// path baked into it as text (see scripts/lib/placeholder.mjs +
// scripts/generate-placeholders.mjs). Because of that guarantee, callers
// never need to branch on "missing image" — resolveImage() always returns
// something Astro can render.
//
// Text works the same way: every editable copy field is its own
// `<slotPath>.md` file sitting next to the images for that item. One field,
// one file, plain text (no frontmatter) — see IMAGE_GUIDE.md.

// Resolved from the CWD (Astro/Vite always run with the project root as CWD,
// in both `astro dev` and `astro build`) rather than import.meta.url — once
// this module is bundled into dist/chunks/ for SSG output generation,
// import.meta.url points at the *built* chunk's location, not this source
// file, which would resolve Final_Images to the wrong place entirely.
export const FINAL_IMAGES_DIR = path.resolve(process.cwd(), "src/Final_Images");

// Single eager glob over the whole tree — Astro's image pipeline optimizes
// (resize/convert/lazy-load) every match at build time. Extensions are
// listed both-case since Windows/exported-photo filenames are inconsistent.
const IMAGE_GLOB = import.meta.glob<{ default: ImageMetadata }>(
  "../Final_Images/**/*.{png,jpg,jpeg,webp,avif,gif,PNG,JPG,JPEG,WEBP,AVIF,GIF}",
  { eager: true },
);

const IMAGE_MAP: Record<string, ImageMetadata> = {};
for (const [specifier, mod] of Object.entries(IMAGE_GLOB)) {
  // specifier looks like "../Final_Images/engineering/eng-grid/cnc-chassis/hero.jpg"
  const rel = specifier.replace(/^\.\.\/Final_Images\//, "").replace(/\.[a-zA-Z0-9]+$/, "");
  IMAGE_MAP[rel.toLowerCase()] = mod.default;
}

/** Resolve a slot path (no extension) to build-time image metadata for <Image>/<Picture>. */
export function resolveImage(slotPath: string): ImageMetadata {
  const meta = IMAGE_MAP[slotPath.toLowerCase()];
  if (!meta) {
    throw new Error(
      `[finalImages] Missing image slot "${slotPath}" — expected a file under src/Final_Images/${slotPath}.*. Run "npm run generate:placeholders".`,
    );
  }
  return meta;
}

/** True if a slot path resolves to a real file — lets callers make an optional image truly optional. */
export function hasImage(slotPath: string): boolean {
  return slotPath.toLowerCase() in IMAGE_MAP;
}

const textCache = new Map<string, string>();

/** Read the plain-text/markdown body at a slot path (`<slotPath>.md`), trimmed. */
export function readText(slotPath: string): string {
  const cached = textCache.get(slotPath);
  if (cached !== undefined) return cached;
  const filePath = path.join(FINAL_IMAGES_DIR, `${slotPath}.md`);
  let text: string;
  try {
    text = fs.readFileSync(filePath, "utf-8").trim();
  } catch {
    throw new Error(`[finalImages] Missing text slot "${slotPath}" — expected src/Final_Images/${slotPath}.md`);
  }
  textCache.set(slotPath, text);
  return text;
}

/** Like readText, but returns "" instead of throwing when the field is genuinely optional. */
export function readTextOptional(slotPath: string | undefined): string {
  if (!slotPath) return "";
  const filePath = path.join(FINAL_IMAGES_DIR, `${slotPath}.md`);
  if (!fs.existsSync(filePath)) return "";
  return readText(slotPath);
}

/**
 * Minimal inline-markdown → HTML: **bold** and *italic* only. Escapes HTML
 * first, so it's safe to use with `set:html` even though these files are
 * fully trusted (site-owner-authored) content, not user input.
 */
export function mdInline(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}

/** Split a multi-line tags.md into a clean list of freeform tag strings. */
export function readTagList(slotPath: string): string[] {
  const text = readTextOptional(slotPath);
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
