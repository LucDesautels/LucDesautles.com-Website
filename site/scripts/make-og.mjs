// One-off generator for /public/og.png (the social-share card).
// Uses sharp (already present via Astro's image pipeline) to rasterize an SVG.
// Re-run with: node scripts/make-og.mjs
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "..", "public", "og.png");

const W = 1200, H = 630;
const cream = "#f1ede3";
const ink = "#1a1714";
const inkDim = "#5f5a51";
const accent = "#d96a36";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${cream}"/>
  <rect x="0" y="0" width="${W}" height="10" fill="${accent}"/>

  <text x="90" y="150" font-family="Georgia, 'Times New Roman', serif"
        font-size="30" letter-spacing="6" fill="${inkDim}">PERSONAL PORTFOLIO</text>

  <text x="84" y="320" font-family="Georgia, 'Times New Roman', serif"
        font-size="170" font-weight="500" fill="${ink}">Luc</text>
  <text x="84" y="470" font-family="Georgia, 'Times New Roman', serif"
        font-size="170" font-style="italic" fill="${ink}">Desautels<tspan fill="${accent}">.</tspan></text>

  <text x="90" y="560" font-family="Arial, Helvetica, sans-serif"
        font-size="34" fill="${inkDim}">Robotics &#183; Drone photography &#183; Side quests</text>

  <rect x="1040" y="120" width="70" height="70" fill="${accent}"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log("wrote", out);
