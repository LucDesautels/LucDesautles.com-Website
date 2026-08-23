// One-off extraction: pulls the 36 base64 JPEG turntable frames out of the
// Fusion 360 "strip" HTML export and writes them as individual .jpg files.
import fs from "node:fs";
import path from "node:path";

const SRC = "C:\\Users\\lucah\\Downloads\\Luc Website Files\\Sailfish\\Picture version Sailfish Gen 3 UAV_2026-Aug-01_09-11-24PM_CustomizedView17912562483_strip.html";
const OUT_DIR = path.join(process.cwd(), "public", "sailfish-turntable");

const content = fs.readFileSync(SRC, "utf8");
const lines = content.split("\n");

// The frame array literal lives on the `imageUrls.push` / `eval([...])` line.
const arrayLine = lines.find((l) => l.includes("eval(['data:image"));
if (!arrayLine) {
  throw new Error("Could not find the frame array line in the source HTML.");
}

const matches = [...arrayLine.matchAll(/data:image\/jpeg;base64,([A-Za-z0-9+/=]+)/g)];
console.log(`Found ${matches.length} frames.`);

fs.mkdirSync(OUT_DIR, { recursive: true });

matches.forEach((m, i) => {
  const buf = Buffer.from(m[1], "base64");
  const name = `frame-${String(i + 1).padStart(2, "0")}.jpg`;
  fs.writeFileSync(path.join(OUT_DIR, name), buf);
});

console.log(`Wrote ${matches.length} frames to ${OUT_DIR}`);
