// Generates the "template" placeholder images that live in src/Final_Images/
// until a real photo replaces them: a solid color background with the
// slot's own folder path centered on it as text, so the folder tree is
// self-documenting when you're browsing it looking for what to replace.
//
// Text is rendered via an SVG rasterized through sharp, with the site's
// Matrixtype font embedded directly as a base64 @font-face — this avoids
// depending on whatever fonts happen to be installed on the machine/CI
// runner (sharp bundles its own fontconfig/pango/librsvg, which don't
// necessarily have any system fonts registered).

import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONT_PATH = path.resolve(__dirname, "../../public/fonts/matrixtype-font/Matrixtype-lxMZX.ttf");
const FONT_B64 = fs.readFileSync(FONT_PATH).toString("base64");

// Muted, mid-dark palette so light text always reads clearly on top —
// picked to sit near the site's existing cream/charcoal/olive tones rather
// than clash with it once a real photo replaces the placeholder.
const PALETTE = [
  "#8a7f6b", "#5b6b5e", "#4a5568", "#7c6a58",
  "#3f4a52", "#6b5b73", "#5c6b73", "#6f6a4f",
];

function pickColor(slotPath) {
  let hash = 0;
  for (let i = 0; i < slotPath.length; i++) hash = (hash * 31 + slotPath.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

// Aspect overrides by slot-path pattern — best-effort so placeholders don't
// look badly stretched under object-fit:cover; falls back to 4:3.
const ASPECT_RULES = [
  [/\/hero$/, 16 / 10],
  [/\/extra/, 4 / 3],
  [/home\/hero\/portrait$/, 4 / 5],
  [/home\/hero\//, 3 / 4],
  [/robotics-intro\/(left|right)-image$/, 3 / 4],
  [/toc-gallery\//, 3 / 4],
];

function pickAspect(slotPath) {
  for (const [re, ratio] of ASPECT_RULES) if (re.test(slotPath)) return ratio;
  return 4 / 3;
}

const LONG_EDGE = 1400;

function dimsFor(aspect) {
  if (aspect >= 1) return { w: LONG_EDGE, h: Math.round(LONG_EDGE / aspect) };
  return { w: Math.round(LONG_EDGE * aspect), h: LONG_EDGE };
}

function wrapLines(slotPath, maxCharsPerLine) {
  // Wrap on "/" boundaries so a long path breaks into readable chunks
  // instead of splitting a folder name mid-word.
  const parts = slotPath.split("/");
  const lines = [];
  let cur = "";
  for (const part of parts) {
    const withSlash = cur ? part + "/" : part + "/";
    const candidate = cur + withSlash;
    if (candidate.length > maxCharsPerLine && cur) {
      lines.push(cur);
      cur = withSlash;
    } else {
      cur = candidate;
    }
  }
  if (cur) lines.push(cur.replace(/\/$/, (m) => m)); // keep trailing slash off the very last segment below
  // Strip a trailing slash only on the final line's final segment (the leaf/basename).
  if (lines.length) lines[lines.length - 1] = lines[lines.length - 1].replace(/\/$/, "");
  return lines;
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Render a placeholder PNG for `slotPath` (e.g. "engineering/eng-grid/cnc-chassis/hero")
 * to `outPath`. Synchronous-ish (returns a Promise); safe to call many times in a loop.
 */
export async function renderPlaceholder(slotPath, outPath) {
  const aspect = pickAspect(slotPath);
  const { w, h } = dimsFor(aspect);
  const bg = pickColor(slotPath);
  const fg = "#f1ede3";

  const fontSize = Math.round(w / 26);
  const maxChars = Math.round(w / (fontSize * 0.62));
  const lines = wrapLines(slotPath, maxChars);

  const lineHeight = fontSize * 1.35;
  const totalHeight = lines.length * lineHeight;
  const startY = h / 2 - totalHeight / 2 + fontSize * 0.85;

  const tspans = lines
    .map((line, i) => `<tspan x="50%" y="${Math.round(startY + i * lineHeight)}">${escapeXml(line)}</tspan>`)
    .join("");

  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <style>
    @font-face { font-family: 'Matrixtype'; src: url(data:font/ttf;base64,${FONT_B64}) format('truetype'); }
    text { font-family: 'Matrixtype', monospace; font-size: ${fontSize}px; fill: ${fg}; text-anchor: middle; letter-spacing: 0.5px; }
  </style>
  <rect width="100%" height="100%" fill="${bg}"/>
  <text>${tspans}</text>
</svg>`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(outPath);
}
