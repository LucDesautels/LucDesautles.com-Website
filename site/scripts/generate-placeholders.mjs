#!/usr/bin/env node
// Fills in a generated placeholder PNG (solid color + centered slot-path
// text) for every image slot that doesn't have a real photo yet.
//
// Usage:
//   node scripts/generate-placeholders.mjs             — process every slot
//     listed in scripts/migration-report.json (written by migrate-content.mjs)
//     that doesn't already have a real file.
//   node scripts/generate-placeholders.mjs --slot=<path> [--slot=<path> ...]
//     — generate (or regenerate) a placeholder for one or more specific
//     slots, e.g. after adding a brand-new image field to content.ts.
//
// Never overwrites a slot that already has ANY image file in it.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPlaceholder } from "./lib/placeholder.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, "..");
const FI = path.join(SITE_ROOT, "src/Final_Images");
const REPORT_PATH = path.join(__dirname, "migration-report.json");

const IMAGE_EXT_RE = /\.(png|jpe?g|webp|avif|gif)$/i;

function slotHasFile(slot) {
  const dir = path.join(FI, path.dirname(slot));
  const base = path.basename(slot);
  if (!fs.existsSync(dir)) return false;
  return fs.readdirSync(dir).some((f) => IMAGE_EXT_RE.test(f) && path.parse(f).name === base);
}

const cliSlots = process.argv
  .slice(2)
  .filter((a) => a.startsWith("--slot="))
  .map((a) => a.slice("--slot=".length));

let slots = cliSlots;
if (slots.length === 0) {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error("No scripts/migration-report.json found and no --slot=<path> given. Run migrate-content.mjs first.");
    process.exit(1);
  }
  const report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
  slots = report.placeholdersNeeded;
}

let made = 0;
let skipped = 0;
for (const slot of slots) {
  if (slotHasFile(slot)) {
    skipped++;
    continue;
  }
  const outPath = path.join(FI, slot + ".png");
  await renderPlaceholder(slot, outPath);
  made++;
}
console.log(`Generated ${made} placeholder(s), skipped ${skipped} slot(s) that already had a real file.`);
