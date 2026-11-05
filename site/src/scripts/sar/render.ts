// Map renderer: ocean, flow, probability field, coverage painted on the water,
// the planned spiral, tracks, markers and the drone — one 2D canvas.

import { type Coverage, type Mission, MODE, datumAt, indexAt, lerpArr, lerpAngle } from "@/lib/sar/engine";
import { type Comparison, PATTERNS, type PatternId } from "@/lib/sar/compare";

export interface Camera {
  cx: number;
  cy: number;
  s: number; // px per metre (CSS px)
}

export interface Layers {
  planned: boolean;
  coverage: boolean;
  overlap: boolean;
  prob: boolean;
  swath: boolean;
  flow: boolean;
  future: boolean;
  reveal: boolean;
}

export const PHASE_COLORS = ["#4a5d61", "#7cc4ff", "#e9692f", "#b49cff", "#4fd18b"];

const TAU = Math.PI * 2;

export class MapRenderer {
  ctx: CanvasRenderingContext2D;
  W = 0;
  H = 0;
  dpr = 1;
  private covCanvas = document.createElement("canvas");
  private covCtx: CanvasRenderingContext2D;
  private covImg: ImageData | null = null;
  private covT = NaN;
  private covRef: Coverage | null = null;
  private bg: HTMLCanvasElement | null = null;

  constructor(public canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
    this.covCtx = this.covCanvas.getContext("2d")!;
  }

  resize() {
    const r = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(r.width * this.dpr));
    const h = Math.max(1, Math.round(r.height * this.dpr));
    if (w !== this.canvas.width || h !== this.canvas.height) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.bg = null;
    }
    this.W = r.width;
    this.H = r.height;
  }

  toScreen(cam: Camera, x: number, y: number) {
    return { x: this.W / 2 + (x - cam.cx) * cam.s, y: this.H / 2 - (y - cam.cy) * cam.s };
  }
  toWorld(cam: Camera, sx: number, sy: number) {
    return { x: cam.cx + (sx - this.W / 2) / cam.s, y: cam.cy - (sy - this.H / 2) / cam.s };
  }

  private background() {
    if (this.bg) return this.bg;
    const c = document.createElement("canvas");
    c.width = this.canvas.width;
    c.height = this.canvas.height;
    const g = c.getContext("2d")!;
    const lg = g.createLinearGradient(0, 0, 0, c.height);
    lg.addColorStop(0, "#0a1c23");
    lg.addColorStop(1, "#06131a");
    g.fillStyle = lg;
    g.fillRect(0, 0, c.width, c.height);
    const rg = g.createRadialGradient(c.width / 2, c.height / 2, Math.min(c.width, c.height) * 0.2, c.width / 2, c.height / 2, Math.max(c.width, c.height) * 0.75);
    rg.addColorStop(0, "rgba(20,60,70,0.25)");
    rg.addColorStop(1, "rgba(0,0,0,0.55)");
    g.fillStyle = rg;
    g.fillRect(0, 0, c.width, c.height);
    this.bg = c;
    return c;
  }

  // ── coverage texture (datum frame) ──
  private updateCoverage(cov: Coverage, t: number, overlap: boolean) {
    if (this.covRef !== cov) {
      this.covCanvas.width = cov.n;
      this.covCanvas.height = cov.n;
      this.covImg = this.covCtx.createImageData(cov.n, cov.n);
      this.covRef = cov;
      this.covT = NaN;
    }
    const key = Math.round(t * 2) / 2 + (overlap ? 0.25 : 0);
    if (key === this.covT) return;
    this.covT = key;
    const n = cov.n;
    const d = this.covImg!.data;
    const [p0, p1, p2] = cov.pass;
    for (let j = 0; j < n; j++) {
      const row = (n - 1 - j) * n; // flip y: texture row 0 = north edge
      for (let i = 0; i < n; i++) {
        const k = j * n + i;
        const o = (row + i) * 4;
        const a = p0[k];
        if (!(a <= t)) {
          d[o + 3] = 0;
          continue;
        }
        let lvl = 1;
        let lastPass = a;
        if (overlap) {
          if (p1[k] <= t) {
            lvl = 2;
            lastPass = p1[k];
          }
          if (p2 && p2[k] <= t) {
            lvl = 3;
            lastPass = p2[k];
          }
        }
        const age = t - lastPass;
        const fresh = age < 30 ? 1 - age / 30 : 0;
        // teal → bright aqua for overlaps; fresh paint glows
        const base = lvl === 1 ? 0.2 : lvl === 2 ? 0.4 : 0.56;
        d[o] = 70 + 60 * (lvl - 1) + 120 * fresh;
        d[o + 1] = 190 + 22 * (lvl - 1) + 50 * fresh;
        d[o + 2] = 200 + 18 * (lvl - 1) + 40 * fresh;
        d[o + 3] = 255 * Math.min(0.85, base + 0.32 * fresh * fresh);
      }
    }
    this.covCtx.putImageData(this.covImg!, 0, 0);
  }

  draw(o: {
    cam: Camera;
    m: Mission;
    cov: Coverage;
    cmp: Comparison | null;
    ghosts: Set<PatternId>;
    t: number;
    layers: Layers;
    wall: number;
    hot: string | null;
    dropMode: boolean;
    attitude: { bank: number };
  }) {
    const { ctx, W, H } = this;
    const { cam, m, t, layers } = o;
    const p = m.p;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.drawImage(this.background(), 0, 0, W, H);

    const fi = indexAt(m, t);
    const C = datumAt(p, m.vc, t);
    const S = (x: number, y: number) => this.toScreen(cam, x, y);

    this.grid(cam);
    if (layers.flow) this.flow(cam, m, t);

    // probability field around the datum
    if (layers.prob) {
      const c = S(C.x, C.y);
      const r3 = p.sigma * 3 * cam.s;
      const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r3);
      g.addColorStop(0, "rgba(255,170,90,0.20)");
      g.addColorStop(0.33, "rgba(255,140,70,0.09)");
      g.addColorStop(0.66, "rgba(255,120,60,0.025)");
      g.addColorStop(1, "rgba(255,120,60,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(c.x, c.y, r3, 0, TAU);
      ctx.fill();
      ctx.save();
      ctx.setLineDash([2, 6]);
      ctx.lineWidth = 1;
      ctx.font = '9.5px "JetBrains Mono", monospace';
      ctx.textAlign = "left";
      for (const [k, lbl] of [[1, "1σ · 39%"], [2, "2σ · 86%"]] as const) {
        const rr = p.sigma * k * cam.s;
        if (rr < 12) continue;
        ctx.strokeStyle = "rgba(255,170,100,0.28)";
        ctx.beginPath();
        ctx.arc(c.x, c.y, rr, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,190,140,0.55)";
        ctx.fillText(lbl, c.x + rr * 0.707 + 4, c.y - rr * 0.707 - 2);
      }
      ctx.restore();
    }

    // coverage painted on the water
    if (layers.coverage) {
      this.updateCoverage(o.cov, t, layers.overlap);
      const cov = o.cov;
      const tl = S(C.x + cov.ox, C.y + cov.oy + cov.n * cov.cell);
      const size = cov.n * cov.cell * cam.s;
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(this.covCanvas, tl.x, tl.y, size, size);
      ctx.restore();
    }

    // drift trail LKP → datum
    {
      const a = S(p.lkp.x, p.lkp.y);
      const b = S(C.x, C.y);
      ctx.save();
      ctx.strokeStyle = "rgba(255,190,140,0.45)";
      ctx.setLineDash([3, 4]);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.restore();
    }

    // planned spiral (water frame) — dotted, travels with the datum
    if (layers.planned && m.thetaEnd > 0) {
      const pl = m.planned;
      const stride = Math.max(1, Math.floor(pl.x.length / 1800));
      const ri = Math.max(0, lerpArr(m.r, fi));
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineWidth = 1.4;
      ctx.setLineDash([0.5, 5]);
      // flown part (inside current θ) dim, ahead brighter
      const thNow = m.mode[Math.floor(fi)] === MODE.SEARCH ? lerpArr(m.theta, fi) : m.mode[Math.floor(fi)] > MODE.SEARCH ? m.thetaEnd : 0;
      const kNow = Math.round((thNow / m.thetaEnd) * (pl.x.length - 1));
      const seg = (from: number, to: number, style: string) => {
        if (to <= from) return;
        ctx.strokeStyle = style;
        ctx.beginPath();
        for (let k = from; k <= to; k += stride) {
          const q = S(C.x + pl.x[k], C.y + pl.y[k]);
          if (k === from) ctx.moveTo(q.x, q.y);
          else ctx.lineTo(q.x, q.y);
        }
        const q = S(C.x + pl.x[to], C.y + pl.y[to]);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      };
      seg(0, Math.min(kNow, pl.x.length - 1), "rgba(255,255,255,0.22)");
      seg(Math.min(kNow, pl.x.length - 1), pl.x.length - 1, "rgba(255,255,255,0.55)");
      ctx.restore();
      void ri;
    }

    // ghost patterns
    if (o.cmp && o.ghosts.size) {
      for (const run of o.cmp.runs) {
        if (!o.ghosts.has(run.id)) continue;
        const meta = PATTERNS.find((q) => q.id === run.id)!;
        const end = t;
        ctx.save();
        ctx.strokeStyle = meta.color;
        ctx.globalAlpha = 0.75;
        ctx.lineWidth = 1.4;
        ctx.setLineDash(meta.dash.length ? meta.dash : []);
        ctx.beginPath();
        let last = -1;
        for (let i = 0; i < run.n && run.t[i] <= end; i += 2) {
          const q = S(run.gx[i], run.gy[i]);
          if (i === 0) ctx.moveTo(q.x, q.y);
          else ctx.lineTo(q.x, q.y);
          last = i;
        }
        ctx.stroke();
        if (last >= 0 && t >= run.t[0] && t <= run.tEnd) {
          const q = S(run.gx[last], run.gy[last]);
          ctx.setLineDash([]);
          ctx.globalAlpha = 1;
          ctx.fillStyle = meta.color;
          ctx.beginPath();
          ctx.arc(q.x, q.y, 4, 0, TAU);
          ctx.fill();
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(meta.short, q.x + 7, q.y - 6);
        }
        ctx.restore();
      }
    }

    // future track (faint) and flown track (by phase)
    const iNow = Math.floor(fi);
    const stride = Math.max(1, Math.floor(m.n / 5000));
    if (layers.future) {
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.13)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      let started = false;
      for (let i = iNow; i < m.n; i += stride) {
        if (m.mode[i] === MODE.STANDBY || m.mode[i] === MODE.LANDED) continue;
        const q = S(m.x[i], m.y[i]);
        if (!started) {
          ctx.moveTo(q.x, q.y);
          started = true;
        } else ctx.lineTo(q.x, q.y);
      }
      ctx.stroke();
      ctx.restore();
    }
    {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.92;
      let cur = -1;
      let prev: { x: number; y: number } | null = null;
      const flush = () => {
        if (cur >= 0) ctx.stroke();
        cur = -1;
      };
      const visit = (q: { x: number; y: number }, mode: number) => {
        const air = mode !== MODE.STANDBY && mode !== MODE.LANDED;
        if (!air) {
          flush();
          prev = null;
          return;
        }
        if (mode !== cur) {
          flush();
          cur = mode;
          ctx.strokeStyle = PHASE_COLORS[mode];
          ctx.lineWidth = mode === MODE.SEARCH ? 1.6 : 1.8;
          ctx.beginPath();
          const s0 = prev ?? q;
          ctx.moveTo(s0.x, s0.y);
        }
        ctx.lineTo(q.x, q.y);
        prev = q;
      };
      for (let i = 0; i < iNow; i += stride) visit(S(m.x[i], m.y[i]), m.mode[i]);
      visit(S(lerpArr(m.x, fi), lerpArr(m.y, fi)), m.mode[iNow]);
      flush();
      ctx.restore();
    }

    // event markers on the map (intercept / bingo)
    for (const ev of m.events) {
      if (ev.kind !== "intercept" && ev.kind !== "bingo" && ev.kind !== "rth") continue;
      if (ev.t > t) continue;
      const ei = indexAt(m, ev.t);
      const q = S(lerpArr(m.x, ei), lerpArr(m.y, ei));
      ctx.save();
      ctx.strokeStyle = ev.kind === "intercept" ? "#7cc4ff" : "#b49cff";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.rect(q.x - 4, q.y - 4, 8, 8);
      ctx.stroke();
      ctx.font = '9.5px "JetBrains Mono", monospace';
      ctx.fillStyle = "rgba(238,243,241,0.8)";
      ctx.fillText(ev.kind === "intercept" ? "INTERCEPT" : "BINGO", q.x + 8, q.y + 12);
      ctx.restore();
    }

    // home
    this.home(S(p.home.x, p.home.y), o.hot === "home");
    // LKP
    this.lkp(S(p.lkp.x, p.lkp.y), o.hot === "lkp");
    // datum
    this.datum(S(C.x, C.y), o.wall, m);

    // targets
    for (const tg of p.targets) {
      const q = S(C.x + tg.x, C.y + tg.y);
      const c = m.contacts.find((cc) => cc.id === tg.id);
      const found = c && c.t <= t;
      if (!found && !layers.reveal) continue;
      this.target(q, tg.kind, tg.label, found ? c!.t : null, t, o.hot === "tg:" + tg.id);
    }

    // drone
    const mode = m.mode[iNow];
    const dx = lerpArr(m.x, fi);
    const dy = lerpArr(m.y, fi);
    const dq = S(dx, dy);
    const airborne = mode !== MODE.STANDBY && mode !== MODE.LANDED;
    if (layers.swath && airborne) {
      const rr = p.Rs * cam.s;
      ctx.save();
      ctx.fillStyle = "rgba(120,230,235,0.07)";
      ctx.strokeStyle = "rgba(140,235,240,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(dq.x, dq.y, rr, 0, TAU);
      ctx.fill();
      ctx.stroke();
      if (rr > 14) {
        // rotating scan sweep
        const a0 = (o.wall * 2.4) % TAU;
        const g = ctx.createConicGradient ? ctx.createConicGradient(a0, dq.x, dq.y) : null;
        if (g) {
          g.addColorStop(0, "rgba(140,235,240,0.35)");
          g.addColorStop(0.18, "rgba(140,235,240,0)");
          g.addColorStop(1, "rgba(140,235,240,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(dq.x, dq.y, rr, 0, TAU);
          ctx.fill();
        }
      }
      ctx.restore();
    }
    if (airborne) {
      // ground-velocity vector (where it's actually going over the ground)
      const gxv = lerpArr(m.gx, fi);
      const gyv = lerpArr(m.gy, fi);
      const look = 18; // seconds ahead
      const tip = S(dx + gxv * look, dy + gyv * look);
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(dq.x, dq.y);
      ctx.lineTo(tip.x, tip.y);
      ctx.stroke();
      const ang = Math.atan2(tip.y - dq.y, tip.x - dq.x);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.beginPath();
      ctx.moveTo(tip.x, tip.y);
      ctx.lineTo(tip.x - 7 * Math.cos(ang - 0.4), tip.y - 7 * Math.sin(ang - 0.4));
      ctx.lineTo(tip.x - 7 * Math.cos(ang + 0.4), tip.y - 7 * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    this.drone(dq, lerpAngle(m.hdg, fi), o.attitude.bank, airborne, mode === MODE.SEARCH);

    if (o.dropMode) {
      ctx.save();
      ctx.strokeStyle = "rgba(233,105,47,0.6)";
      ctx.setLineDash([6, 6]);
      ctx.lineWidth = 2;
      ctx.strokeRect(4, 4, W - 8, H - 8);
      ctx.restore();
    }
    this.scaleBar(cam);
  }

  private grid(cam: Camera) {
    const { ctx, W, H } = this;
    const steps = [25, 50, 100, 250, 500, 1000, 2500, 5000, 10000];
    let g = steps[steps.length - 1];
    for (const s of steps) {
      if (s * cam.s >= 80) {
        g = s;
        break;
      }
    }
    const tl = this.toWorld(cam, 0, 0);
    const br = this.toWorld(cam, W, H);
    ctx.save();
    ctx.lineWidth = 1;
    const minor = g / 5;
    if (minor * cam.s > 14) {
      ctx.strokeStyle = "rgba(170,225,235,0.035)";
      ctx.beginPath();
      for (let x = Math.ceil(tl.x / minor) * minor; x <= br.x; x += minor) {
        const sx = Math.round(this.toScreen(cam, x, 0).x) + 0.5;
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, H);
      }
      for (let y = Math.ceil(br.y / minor) * minor; y <= tl.y; y += minor) {
        const sy = Math.round(this.toScreen(cam, 0, y).y) + 0.5;
        ctx.moveTo(0, sy);
        ctx.lineTo(W, sy);
      }
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(170,225,235,0.08)";
    ctx.beginPath();
    for (let x = Math.ceil(tl.x / g) * g; x <= br.x; x += g) {
      const sx = Math.round(this.toScreen(cam, x, 0).x) + 0.5;
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, H);
    }
    for (let y = Math.ceil(br.y / g) * g; y <= tl.y; y += g) {
      const sy = Math.round(this.toScreen(cam, 0, y).y) + 0.5;
      ctx.moveTo(0, sy);
      ctx.lineTo(W, sy);
    }
    ctx.stroke();
    ctx.restore();
  }

  private scaleBar(cam: Camera) {
    const { ctx, H } = this;
    const steps = [10, 25, 50, 100, 250, 500, 1000, 2000, 5000, 10000];
    let L = 100;
    for (const s of steps) if (s * cam.s <= 130) L = s;
    const px = L * cam.s;
    const x0 = this.W / 2 - px / 2;
    const y0 = H - 16;
    if (this.W < 640) return;
    ctx.save();
    ctx.strokeStyle = "rgba(238,243,241,0.6)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x0, y0 - 4);
    ctx.lineTo(x0, y0);
    ctx.lineTo(x0 + px, y0);
    ctx.lineTo(x0 + px, y0 - 4);
    ctx.stroke();
    ctx.font = '9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = "rgba(238,243,241,0.7)";
    ctx.fillText(L >= 1000 ? `${L / 1000} km` : `${L} m`, x0 + px + 6, y0 + 3);
    ctx.restore();
  }

  private flow(cam: Camera, m: Mission, t: number) {
    const { ctx, W, H } = this;
    const viewW = W / cam.s;
    const draw = (vel: { x: number; y: number }, base: number, per: number, style: (a: number) => string, len: number, salt: number, lw: number) => {
      const spd = Math.hypot(vel.x, vel.y);
      const lvl = Math.log2(viewW / base);
      const k0 = Math.floor(lvl);
      const frac = lvl - k0;
      for (const [k, wgt] of [[k0, 1 - frac], [k0 + 1, frac]] as const) {
        if (wgt < 0.02) continue;
        const L = base * Math.pow(2, k) / 4;
        const tl = this.toWorld(cam, 0, 0);
        const br = this.toWorld(cam, W, H);
        const ox = vel.x * t;
        const oy = vel.y * t;
        const i0 = Math.floor((tl.x - ox) / L) - 1;
        const i1 = Math.floor((br.x - ox) / L) + 1;
        const j0 = Math.floor((br.y - oy) / L) - 1;
        const j1 = Math.floor((tl.y - oy) / L) + 1;
        if ((i1 - i0) * (j1 - j0) > 900) continue;
        ctx.strokeStyle = style(wgt);
        ctx.lineWidth = lw;
        ctx.beginPath();
        for (let i = i0; i <= i1; i++) {
          for (let j = j0; j <= j1; j++) {
            for (let q = 0; q < per; q++) {
              const h1 = hash(i, j, q + salt);
              const h2 = hash(j, i, q * 7 + salt + 3);
              const wx = (i + h1) * L + ox;
              const wy = (j + h2) * L + oy;
              const s = this.toScreen(cam, wx, wy);
              const l = spd > 0.05 ? len * (0.5 + hash(i, q, j) * 0.8) : 1.2;
              const ux = spd > 0.05 ? vel.x / spd : 1;
              const uy = spd > 0.05 ? vel.y / spd : 0;
              ctx.moveTo(s.x, s.y);
              ctx.lineTo(s.x - ux * l, s.y + uy * l);
            }
          }
        }
        ctx.stroke();
      }
    };
    // current: short teal flecks riding the water
    draw(m.vc, 1400, 3, (a) => `rgba(110,210,215,${0.22 * a})`, 4 + Math.hypot(m.vc.x, m.vc.y) * 5, 1, 1.3);
    // wind: long faint cat's-paws
    if (Math.hypot(m.vw.x, m.vw.y) > 0.2) draw(m.vw, 2600, 2, (a) => `rgba(235,240,240,${0.08 * a})`, 10 + Math.hypot(m.vw.x, m.vw.y) * 3.2, 9, 1);
  }

  private home(q: { x: number; y: number }, hot: boolean) {
    const { ctx } = this;
    ctx.save();
    ctx.fillStyle = "rgba(6,19,26,0.85)";
    ctx.strokeStyle = hot ? "#ffffff" : "rgba(238,243,241,0.85)";
    ctx.lineWidth = hot ? 2 : 1.4;
    ctx.beginPath();
    ctx.arc(q.x, q.y, 11, 0, TAU);
    ctx.fill();
    ctx.stroke();
    ctx.font = '600 11px "Khand", sans-serif';
    ctx.fillStyle = "#eef3f1";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("H", q.x, q.y + 0.5);
    ctx.font = '9.5px "JetBrains Mono", monospace';
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(238,243,241,0.7)";
    ctx.fillText("HOME", q.x + 15, q.y + 1);
    ctx.restore();
  }

  private lkp(q: { x: number; y: number }, hot: boolean) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(q.x, q.y);
    ctx.rotate(Math.PI / 4);
    ctx.strokeStyle = hot ? "#ffffff" : "rgba(255,190,140,0.85)";
    ctx.lineWidth = hot ? 2 : 1.3;
    ctx.fillStyle = "rgba(6,19,26,0.8)";
    ctx.fillRect(-6, -6, 12, 12);
    ctx.strokeRect(-6, -6, 12, 12);
    ctx.restore();
    ctx.save();
    ctx.font = '9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = "rgba(255,200,160,0.75)";
    ctx.fillText("LKP", q.x + 12, q.y - 8);
    ctx.restore();
  }

  private datum(q: { x: number; y: number }, wall: number, m: Mission) {
    const { ctx } = this;
    ctx.save();
    const pulse = (wall * 0.6) % 1;
    ctx.strokeStyle = `rgba(255,170,100,${0.5 * (1 - pulse)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(q.x, q.y, 6 + pulse * 18, 0, TAU);
    ctx.stroke();
    ctx.strokeStyle = "#ffb27a";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(q.x - 9, q.y);
    ctx.lineTo(q.x - 3, q.y);
    ctx.moveTo(q.x + 3, q.y);
    ctx.lineTo(q.x + 9, q.y);
    ctx.moveTo(q.x, q.y - 9);
    ctx.lineTo(q.x, q.y - 3);
    ctx.moveTo(q.x, q.y + 3);
    ctx.lineTo(q.x, q.y + 9);
    ctx.stroke();
    ctx.fillStyle = "#ffb27a";
    ctx.beginPath();
    ctx.arc(q.x, q.y, 1.8, 0, TAU);
    ctx.fill();
    // current arrow
    const sp = Math.hypot(m.vc.x, m.vc.y);
    if (sp > 0.05) {
      const L = 16 + sp * 10;
      const ux = m.vc.x / sp;
      const uy = -m.vc.y / sp;
      const ax = q.x + ux * 12;
      const ay = q.y + uy * 12;
      const bx = q.x + ux * (12 + L);
      const by = q.y + uy * (12 + L);
      ctx.strokeStyle = "rgba(110,210,215,0.85)";
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
      const ang = Math.atan2(by - ay, bx - ax);
      ctx.fillStyle = "rgba(110,210,215,0.9)";
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx - 6 * Math.cos(ang - 0.45), by - 6 * Math.sin(ang - 0.45));
      ctx.lineTo(bx - 6 * Math.cos(ang + 0.45), by - 6 * Math.sin(ang + 0.45));
      ctx.closePath();
      ctx.fill();
    }
    ctx.font = '9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = "rgba(255,200,160,0.85)";
    ctx.fillText("DATUM", q.x + 11, q.y + 14);
    ctx.restore();
  }

  private target(q: { x: number; y: number }, kind: string, label: string, foundAt: number | null, t: number, hot: boolean) {
    const { ctx } = this;
    ctx.save();
    const found = foundAt !== null;
    if (found) {
      const since = t - foundAt!;
      if (since < 40) {
        for (let r = 0; r < 3; r++) {
          const ph = ((since / 4 + r / 3) % 1);
          ctx.strokeStyle = `rgba(120,235,240,${0.7 * (1 - ph)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(q.x, q.y, 6 + ph * 34, 0, TAU);
          ctx.stroke();
        }
      }
    }
    const col = found ? "#ff8a3d" : "rgba(255,255,255,0.45)";
    ctx.fillStyle = found ? col : "rgba(6,19,26,0.6)";
    ctx.strokeStyle = found ? "#fff" : "rgba(255,255,255,0.45)";
    ctx.lineWidth = hot ? 2 : 1.2;
    ctx.beginPath();
    if (kind === "raft") {
      ctx.roundRect ? ctx.roundRect(q.x - 6, q.y - 5, 12, 10, 3) : ctx.rect(q.x - 6, q.y - 5, 12, 10);
    } else if (kind === "debris") {
      ctx.moveTo(q.x, q.y - 6);
      ctx.lineTo(q.x + 6, q.y + 5);
      ctx.lineTo(q.x - 6, q.y + 5);
      ctx.closePath();
    } else {
      ctx.arc(q.x, q.y, 5.5, 0, TAU);
    }
    ctx.fill();
    ctx.stroke();
    if (kind === "person" && found) {
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(q.x, q.y, 9, 0, TAU);
      ctx.stroke();
    }
    ctx.font = '9.5px "JetBrains Mono", monospace';
    ctx.fillStyle = found ? "rgba(255,225,200,0.95)" : "rgba(238,243,241,0.4)";
    ctx.fillText(found ? `${label} · ${fmt(foundAt!)}` : `${label} ?`, q.x + 11, q.y - 8);
    ctx.restore();
  }

  private drone(q: { x: number; y: number }, hdg: number, bank: number, airborne: boolean, searching: boolean) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(q.x, q.y);
    // glow
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 22);
    g.addColorStop(0, searching ? "rgba(233,105,47,0.45)" : "rgba(255,255,255,0.25)");
    g.addColorStop(1, "rgba(233,105,47,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, TAU);
    ctx.fill();
    ctx.rotate((hdg * Math.PI) / 180);
    const k = airborne ? 1 : 0.82;
    ctx.scale(k, k);
    // shadow on the water (offset when airborne)
    if (airborne) {
      ctx.save();
      ctx.translate(5, 6);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      plane(ctx, 0);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = "#f4f1ea";
    ctx.strokeStyle = "#0b0f10";
    ctx.lineWidth = 1;
    plane(ctx, bank);
    ctx.fill();
    ctx.stroke();
    // nose / accent
    ctx.fillStyle = "#e9692f";
    ctx.beginPath();
    ctx.arc(0, -8, 2, 0, TAU);
    ctx.fill();
    ctx.restore();
  }
}

/** Top-down fixed-wing silhouette, nose up (−y). Bank foreshortens the wings. */
function plane(ctx: CanvasRenderingContext2D, bank: number) {
  const span = 15;
  const c = Math.cos((bank * Math.PI) / 180);
  const L = span * (0.55 + 0.45 * c) * (bank > 0 ? 0.92 : 1.08);
  const R = span * (0.55 + 0.45 * c) * (bank > 0 ? 1.08 : 0.92);
  ctx.beginPath();
  ctx.moveTo(0, -11);
  ctx.quadraticCurveTo(2.4, -8, 2.2, -3);
  ctx.lineTo(R, -1);
  ctx.lineTo(R, 2.2);
  ctx.lineTo(2, 2.2);
  ctx.lineTo(1.5, 7);
  ctx.lineTo(5.5, 9);
  ctx.lineTo(5.5, 11);
  ctx.lineTo(0, 10.5);
  ctx.lineTo(-5.5, 11);
  ctx.lineTo(-5.5, 9);
  ctx.lineTo(-1.5, 7);
  ctx.lineTo(-2, 2.2);
  ctx.lineTo(-L, 2.2);
  ctx.lineTo(-L, -1);
  ctx.lineTo(-2.2, -3);
  ctx.quadraticCurveTo(-2.4, -8, 0, -11);
  ctx.closePath();
}

function hash(a: number, b: number, c: number) {
  let h = (a * 374761393 + b * 668265263 + c * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return ((h >>> 0) % 10000) / 10000;
}

export function fmt(s: number) {
  const neg = s < 0;
  s = Math.abs(s);
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60);
  return `${neg ? "−" : ""}${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}
