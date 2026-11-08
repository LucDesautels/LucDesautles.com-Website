// Comparison charts: POD over time and distance-from-datum over time (the
// IA's Fig. 5 "distance gradient"), plus small-multiple coverage maps.
// Thin 2px lines, recessive grid, crosshair + tooltip on hover, legend above.

import { type Comparison, PATTERNS, type PatternId } from "@/lib/sar/compare";
import type { Mission } from "@/lib/sar/engine";
import { fmt } from "./render";

interface Series {
  id: PatternId;
  xs: ArrayLike<number>; // seconds from t0
  ys: ArrayLike<number>;
  n: number;
}

const PAD = { l: 44, r: 12, t: 8, b: 24 };

export class LineChart {
  private ctx: CanvasRenderingContext2D;
  private tip: HTMLDivElement;
  private hoverX: number | null = null;
  series: Series[] = [];
  ref: { xs: ArrayLike<number>; ys: ArrayLike<number>; n: number; label: string } | null = null;
  xMax = 1;
  yMax = 1;
  yFmt: (v: number) => string = (v) => v.toFixed(0);
  yTicks: number[] = [];
  playhead = 0; // seconds from t0
  visible = new Set<PatternId>(PATTERNS.map((p) => p.id));

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.tip = document.createElement("div");
    this.tip.className = "ctip";
    canvas.parentElement!.appendChild(this.tip);
    canvas.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      this.hoverX = e.clientX - r.left;
      this.draw();
    });
    canvas.addEventListener("pointerleave", () => {
      this.hoverX = null;
      this.tip.style.display = "none";
      this.draw();
    });
  }

  draw() {
    const c = this.canvas;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = c.clientWidth;
    const H = c.clientHeight;
    if (!W || !H) return;
    if (c.width !== Math.round(W * dpr)) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
    const ctx = this.ctx;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const pw = W - PAD.l - PAD.r;
    const ph = H - PAD.t - PAD.b;
    const X = (x: number) => PAD.l + (x / this.xMax) * pw;
    const Y = (y: number) => PAD.t + ph - (y / this.yMax) * ph;

    // grid + axes (recessive)
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = "rgba(169,188,188,0.75)";
    ctx.strokeStyle = "rgba(190,230,235,0.08)";
    ctx.lineWidth = 1;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (const yt of this.yTicks) {
      const y = Math.round(Y(yt)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(PAD.l, y);
      ctx.lineTo(W - PAD.r, y);
      ctx.stroke();
      ctx.fillText(this.yFmt(yt), PAD.l - 6, y);
    }
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const stepMin = niceStep(this.xMax / 60 / 5);
    for (let mm = 0; mm * 60 <= this.xMax + 1; mm += stepMin) {
      const x = X(mm * 60);
      ctx.fillText(`${mm}m`, x, H - PAD.b + 6);
    }
    ctx.strokeStyle = "rgba(190,230,235,0.25)";
    ctx.beginPath();
    ctx.moveTo(PAD.l, Y(0) + 0.5);
    ctx.lineTo(W - PAD.r, Y(0) + 0.5);
    ctx.stroke();

    // reference (ideal)
    if (this.ref) {
      ctx.save();
      ctx.strokeStyle = "rgba(238,243,241,0.35)";
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < this.ref.n; i++) {
        const x = X(this.ref.xs[i]);
        const y = Y(this.ref.ys[i]);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // series — hero (IA) drawn last so it sits on top; clipped to the plot
    ctx.save();
    ctx.beginPath();
    ctx.rect(PAD.l, PAD.t - 2, pw, ph + 4);
    ctx.clip();
    const order = [...this.series].sort((a, b) => (a.id === "ia" ? 1 : 0) - (b.id === "ia" ? 1 : 0));
    for (const s of order) {
      if (!this.visible.has(s.id)) continue;
      const meta = PATTERNS.find((p) => p.id === s.id)!;
      ctx.save();
      ctx.strokeStyle = meta.color;
      ctx.lineWidth = s.id === "ia" ? 2.4 : 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.setLineDash(meta.dash);
      ctx.beginPath();
      const stride = Math.max(1, Math.floor(s.n / 600));
      for (let i = 0; i < s.n; i += stride) {
        const x = X(s.xs[i]);
        const y = Y(s.ys[i]);
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.stroke();
      ctx.restore();
      // off-chart marker
      let off = -1;
      for (let i = 0; i < s.n; i++) if (s.ys[i] > this.yMax && s.xs[i] <= this.xMax) { off = i; break; }
      if (off >= 0) {
        ctx.fillStyle = meta.color;
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(`${meta.short} ↑ off chart`, Math.min(X(s.xs[off]) + 4, W - PAD.r - 110), PAD.t + 2);
      }
    }
    ctx.restore();

    // playhead
    if (this.playhead > 0 && this.playhead <= this.xMax) {
      const x = Math.round(X(this.playhead)) + 0.5;
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.beginPath();
      ctx.moveTo(x, PAD.t);
      ctx.lineTo(x, PAD.t + ph);
      ctx.stroke();
    }

    // hover crosshair + tooltip
    if (this.hoverX !== null && this.hoverX >= PAD.l && this.hoverX <= W - PAD.r) {
      const xv = ((this.hoverX - PAD.l) / pw) * this.xMax;
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(this.hoverX + 0.5, PAD.t);
      ctx.lineTo(this.hoverX + 0.5, PAD.t + ph);
      ctx.stroke();
      ctx.setLineDash([]);
      const rows: string[] = [`<div class="h">+${fmt(xv)} into the search</div>`];
      for (const meta of PATTERNS) {
        const s = this.series.find((q) => q.id === meta.id);
        if (!s || !this.visible.has(s.id)) continue;
        const v = sampleAt(s, xv);
        if (v === null) continue;
        // ring around the hovered point (2px surface ring)
        ctx.fillStyle = meta.color;
        ctx.strokeStyle = "#060e12";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.hoverX, Y(v), 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        rows.push(`<div class="r"><i style="background:${meta.color}"></i><span>${meta.short}</span><b>${this.yFmt(v)}</b></div>`);
      }
      this.tip.innerHTML = rows.join("");
      this.tip.style.display = "block";
      const left = this.hoverX + 14 + 170 > W ? this.hoverX - 180 : this.hoverX + 14;
      this.tip.style.left = `${left + 10}px`;
      this.tip.style.top = `30px`;
    }
  }
}

function sampleAt(s: Series, x: number): number | null {
  if (!s.n) return null;
  if (x <= s.xs[0]) return s.ys[0];
  if (x >= s.xs[s.n - 1]) return s.ys[s.n - 1];
  let lo = 0;
  let hi = s.n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (s.xs[mid] <= x) lo = mid;
    else hi = mid;
  }
  const f = (x - s.xs[lo]) / (s.xs[hi] - s.xs[lo] || 1);
  return s.ys[lo] + (s.ys[hi] - s.ys[lo]) * f;
}

function niceStep(raw: number) {
  const c = [1, 2, 5, 10, 15, 20, 30, 60];
  for (const s of c) if (s >= raw) return s;
  return 60;
}

export function buildPodChart(ch: LineChart, cmp: Comparison) {
  const bins = cmp.bins;
  const xs = new Float64Array(bins + 1);
  for (let k = 0; k <= bins; k++) xs[k] = k * cmp.dt;
  ch.series = cmp.runs.map((r) => ({ id: r.id, xs, ys: r.pod, n: bins + 1 }));
  ch.ref = { xs, ys: cmp.ideal, n: bins + 1, label: "Ideal" };
  ch.xMax = cmp.t1 - cmp.t0;
  ch.yMax = 1;
  ch.yTicks = [0, 0.25, 0.5, 0.75, 1];
  ch.yFmt = (v) => `${Math.round(v * 100)}%`;
}

export function buildDistChart(ch: LineChart, cmp: Comparison) {
  let yMax = 1;
  let iaMax = 1;
  ch.series = cmp.runs.map((r) => {
    const xs = new Float64Array(r.n);
    for (let i = 0; i < r.n; i++) xs[i] = r.t[i] - cmp.t0;
    for (let i = 0; i < r.n; i++)
      if (xs[i] <= cmp.t1 - cmp.t0) {
        yMax = Math.max(yMax, r.dist[i]);
        if (r.id === "ia") iaMax = Math.max(iaMax, r.dist[i]);
      }
    return { id: r.id, xs, ys: r.dist, n: r.n };
  });
  // a drifting pattern can run kilometres away; clip so the IA curve stays readable
  yMax = Math.min(yMax, iaMax * 1.6);
  ch.ref = null;
  ch.xMax = cmp.t1 - cmp.t0;
  const step = niceDist(yMax / 4);
  ch.yMax = Math.ceil(yMax / step) * step;
  ch.yTicks = [];
  for (let y = 0; y <= ch.yMax + 1e-6; y += step) ch.yTicks.push(y);
  ch.yFmt = (v) => (ch.yMax >= 2000 ? `${(v / 1000).toFixed(1)}k` : `${Math.round(v)}`) + "m";
}

function niceDist(raw: number) {
  const c = [25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000];
  for (const s of c) if (s >= raw) return s;
  return 10000;
}

/** Small-multiple coverage map for one pattern, in the water frame, at time t. */
export function drawMini(canvas: HTMLCanvasElement, cmp: Comparison, id: PatternId, m: Mission, t: number, cache: Map<string, ImageData>) {
  const run = cmp.runs.find((r) => r.id === id)!;
  const meta = PATTERNS.find((p) => p.id === id)!;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = canvas.clientWidth;
  if (!W) return;
  const px = Math.round(W * dpr);
  if (canvas.width !== px) {
    canvas.width = px;
    canvas.height = px;
  }
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#08161c";
  ctx.fillRect(0, 0, px, px);
  const cov = run.cov;
  const n = cov.n;
  // probability field
  const s = px / (2 * cmp.view);
  const cx = px / 2;
  const cy = px / 2;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, m.p.sigma * 3 * s);
  g.addColorStop(0, "rgba(255,160,80,0.25)");
  g.addColorStop(0.4, "rgba(255,140,70,0.08)");
  g.addColorStop(1, "rgba(255,120,60,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, px, px);
  // coverage at t
  const key = `${id}:${Math.round(t)}`;
  let img = cache.get(key);
  if (!img) {
    img = new ImageData(n, n);
    const d = img.data;
    const [p0, p1] = cov.pass;
    for (let j = 0; j < n; j++) {
      const row = (n - 1 - j) * n;
      for (let i = 0; i < n; i++) {
        const k = j * n + i;
        if (!(p0[k] <= t)) continue;
        const o = (row + i) * 4;
        const lvl = p1[k] <= t ? 2 : 1;
        d[o] = lvl === 2 ? 150 : 80;
        d[o + 1] = 220;
        d[o + 2] = 225;
        d[o + 3] = lvl === 2 ? 150 : 85;
      }
    }
    cache.set(key, img);
    if (cache.size > 40) cache.delete(cache.keys().next().value as string);
  }
  const tmp = document.createElement("canvas");
  tmp.width = n;
  tmp.height = n;
  tmp.getContext("2d")!.putImageData(img, 0, 0);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(tmp, (cov.ox + cmp.view) * s, (cmp.view - (cov.oy + n * cov.cell)) * s, n * cov.cell * s, n * cov.cell * s);
  // track
  ctx.strokeStyle = meta.color;
  ctx.lineWidth = 1.2 * dpr;
  ctx.setLineDash(meta.dash.map((d) => d * dpr * 0.7));
  ctx.beginPath();
  let last = 0;
  for (let i = 0; i < run.n && run.t[i] <= t; i += 2) {
    const x = cx + run.dfx[i] * s;
    const y = cy - run.dfy[i] * s;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    last = i;
  }
  ctx.stroke();
  ctx.setLineDash([]);
  if (t >= run.t[0]) {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(cx + run.dfx[last] * s, cy - run.dfy[last] * s, 2.5 * dpr, 0, Math.PI * 2);
    ctx.fill();
  }
  // datum + targets
  ctx.strokeStyle = "#ffb27a";
  ctx.lineWidth = dpr;
  ctx.beginPath();
  ctx.moveTo(cx - 5 * dpr, cy);
  ctx.lineTo(cx + 5 * dpr, cy);
  ctx.moveTo(cx, cy - 5 * dpr);
  ctx.lineTo(cx, cy + 5 * dpr);
  ctx.stroke();
  for (const tg of m.p.targets) {
    const f = run.found.find((q) => q.id === tg.id);
    const hit = f && f.t <= t;
    ctx.fillStyle = hit ? "#ff8a3d" : "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(cx + tg.x * s, cy - tg.y * s, (hit ? 3.2 : 2.2) * dpr, 0, Math.PI * 2);
    ctx.fill();
  }
}
