// /sar-spiral controller: state, controls, presets, camera, timeline, HUD.

import {
  type Coverage,
  type Mission,
  type SimParams,
  type Target,
  MODE,
  bearingOf,
  coverMission,
  datumAt,
  fromBearing,
  indexAt,
  lerpAngle,
  lerpArr,
  podCurve,
  simulateMission,
  windVec,
  currentVec,
} from "@/lib/sar/engine";
import { type Comparison, PATTERNS, type PatternId, comparePatterns } from "@/lib/sar/compare";
import { DEFAULT_PRESET, PRESETS } from "@/lib/sar/presets";
import { type Camera, type Layers, MapRenderer, PHASE_COLORS, fmt } from "./render";
import { NavBall } from "./navball";
import { LineChart, buildDistChart, buildPodChart, drawMini } from "./charts";

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector(sel) as T;
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll(sel)) as T[];

const app = $("[data-sar-app]");
if (app) init();

type CamMode = "overview" | "drone" | "datum";

function init() {
  const canvas = $<HTMLCanvasElement>("[data-map]");
  const renderer = new MapRenderer(canvas);
  const navball = new NavBall($<HTMLCanvasElement>("[data-navball]"));
  const hud = $("[data-hud]");

  const clone = (p: SimParams): SimParams => ({ ...p, home: { ...p.home }, lkp: { ...p.lkp }, targets: p.targets.map((t) => ({ ...t })) });

  const fromHash = location.hash.replace("#", "");
  let presetId = PRESETS.some((p) => p.id === fromHash) ? fromHash : DEFAULT_PRESET;
  let params = clone(PRESETS.find((p) => p.id === presetId)!.params);

  let m: Mission = simulateMission(params);
  let cov: Coverage = coverMission(m);
  let curve = podCurve(cov, params.sigma, 0, m.tEnd, 600);
  let cmp: Comparison | null = null;
  let cmpTimer = 0;

  let t = 0;
  let playing = true;
  let speed = 15;
  let camMode: CamMode = "overview";
  const zoom: Record<CamMode, number> = { overview: 1, drone: 1, datum: 1 };
  const off: Record<CamMode, { x: number; y: number }> = { overview: { x: 0, y: 0 }, drone: { x: 0, y: 0 }, datum: { x: 0, y: 0 } };
  let cam: Camera = { cx: 0, cy: 0, s: 0.2 };
  let camInit = false;
  const layers: Layers = { planned: true, coverage: true, overlap: true, prob: true, swath: true, flow: true, future: true, reveal: true };
  const ghosts = new Set<PatternId>();
  let dropMode = false;
  let hot: string | null = null;
  let dirty = false;
  let lastWall = performance.now();
  let lastHud = 0;
  let lastMini = 0;
  let att = { h: 0, p: 0, b: 0 };
  const miniCache = new Map<string, ImageData>();

  // ── recompute ────────────────────────────────────────────────────────
  function recompute(full = true) {
    m = simulateMission(params);
    cov = coverMission(m);
    curve = podCurve(cov, params.sigma, 0, m.tEnd, 600);
    t = Math.min(t, m.tEnd);
    buildTimeline();
    renderContacts();
    renderWarnings();
    syncControls();
    clearTimeout(cmpTimer);
    if (full) runCompare();
    else cmpTimer = window.setTimeout(runCompare, 280);
  }
  function runCompare() {
    cmp = comparePatterns(m);
    miniCache.clear();
    renderCmpChip();
    if (!cmpEl.hidden) openCompare(true);
  }
  const requestRecompute = () => {
    dirty = true;
  };

  // ── controls ─────────────────────────────────────────────────────────
  const sliders = $$<HTMLInputElement>('input[type="range"][data-k]');
  const getVal = (k: string): number => {
    if (k === "datumDist") return Math.hypot(params.lkp.x - params.home.x, params.lkp.y - params.home.y) / 1000;
    if (k === "datumBrg") return Math.round(bearingOf({ x: params.lkp.x - params.home.x, y: params.lkp.y - params.home.y }));
    return (params as any)[k];
  };
  const setVal = (k: string, v: number) => {
    if (k === "datumDist" || k === "datumBrg") {
      const d = k === "datumDist" ? v * 1000 : getVal("datumDist") * 1000;
      const b = k === "datumBrg" ? v : getVal("datumBrg");
      const o = fromBearing(b, d);
      params.lkp = { x: params.home.x + o.x, y: params.home.y + o.y };
      return;
    }
    (params as any)[k] = v;
  };
  const fmtVal = (k: string, v: number, unit: string) => {
    if (k === "r0k") return `${v.toFixed(2)} ${unit}`;
    if (k === "datumDist") return `${v.toFixed(2)} ${unit}`;
    if (k === "U") return `${v.toFixed(1)} ${unit}`;
    return `${Math.round(v)} ${unit}`;
  };
  for (const el of sliders) {
    el.addEventListener("input", () => {
      setVal(el.dataset.k!, parseFloat(el.value));
      markEdited();
      requestRecompute();
    });
    el.addEventListener("change", () => recompute(false));
  }
  const stopCb = $<HTMLInputElement>('input[data-k="stopOnContact"]');
  stopCb.addEventListener("change", () => {
    params.stopOnContact = stopCb.checked;
    markEdited();
    recompute();
  });
  for (const el of $$<HTMLInputElement>("[data-layer]")) {
    el.addEventListener("change", () => {
      (layers as any)[el.dataset.layer!] = el.checked;
    });
  }

  function syncControls() {
    for (const el of sliders) {
      const k = el.dataset.k!;
      let v = getVal(k);
      if (document.activeElement !== el) el.value = String(v);
      v = parseFloat(el.value);
      const min = parseFloat(el.min);
      const max = parseFloat(el.max);
      el.style.setProperty("--p", `${((v - min) / (max - min)) * 100}%`);
      const out = $(`[data-out="${k}"]`);
      if (out) out.textContent = fmtVal(k, getVal(k), el.dataset.unit ?? "");
    }
    stopCb.checked = params.stopOnContact;
    const b = params.Rs / Math.PI;
    $("[data-bnote]").innerHTML = `b = Rs/π = <b>${b.toFixed(1)} m/rad</b> · arms <b>${(2 * params.Rs).toFixed(0)} m</b> apart<br>ALT ≈ ${m.cruiseAlt.toFixed(0)} m for an 80° camera`;
    pads.wind.draw();
    pads.cur.draw();
    const ve = Math.hypot(m.veff.x, m.veff.y);
    const ratio = ve / params.U;
    const feas = $("[data-feas]");
    feas.classList.toggle("is-tight", ratio > 0.7 && ratio < 1);
    feas.classList.toggle("is-bad", ratio >= 0.995);
    $("[data-feas-bar]").style.width = `${Math.min(100, ratio * 100)}%`;
    $("[data-feas-val]").textContent = `${ve.toFixed(1)} m/s · ${Math.round(ratio * 100)}% of U`;
  }

  // vector pads
  class Pad {
    c: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    constructor(public kind: "wind" | "cur", public max: number) {
      this.c = $<HTMLCanvasElement>(`[data-pad="${kind}"] canvas`);
      this.ctx = this.c.getContext("2d")!;
      const set = (e: PointerEvent) => {
        const r = this.c.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 2 - 1;
        const y = -(((e.clientY - r.top) / r.height) * 2 - 1);
        const R = 0.86;
        let mag = Math.min(1, Math.hypot(x, y) / R) * this.max;
        mag = Math.round(mag * 10) / 10;
        let brg = bearingOf({ x, y });
        if (e.shiftKey) brg = Math.round(brg / 15) * 15;
        brg = Math.round(brg);
        if (this.kind === "wind") {
          params.windSpd = mag;
          params.windFrom = (brg + 180) % 360;
        } else {
          params.curSpd = mag;
          params.curTo = brg;
        }
        markEdited();
        requestRecompute();
      };
      this.c.addEventListener("pointerdown", (e) => {
        this.c.setPointerCapture(e.pointerId);
        set(e);
      });
      this.c.addEventListener("pointermove", (e) => {
        if (this.c.hasPointerCapture(e.pointerId)) set(e);
      });
      this.c.addEventListener("pointerup", () => recompute(false));
      this.c.addEventListener("dblclick", () => {
        if (this.kind === "wind") params.windSpd = 0;
        else params.curSpd = 0;
        recompute(false);
      });
    }
    draw() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const css = this.c.clientWidth || 112;
      const px = Math.round(css * dpr);
      if (this.c.width !== px) {
        this.c.width = px;
        this.c.height = px;
      }
      const ctx = this.ctx;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const W = css;
      const c = W / 2;
      const R = c * 0.86;
      ctx.clearRect(0, 0, W, W);
      ctx.strokeStyle = "rgba(190,230,235,0.14)";
      ctx.lineWidth = 1;
      for (const k of [1 / 3, 2 / 3, 1]) {
        ctx.beginPath();
        ctx.arc(c, c, R * k, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(c - R, c);
      ctx.lineTo(c + R, c);
      ctx.moveTo(c, c - R);
      ctx.lineTo(c, c + R);
      ctx.stroke();
      ctx.font = '8.5px "JetBrains Mono", monospace';
      ctx.fillStyle = "rgba(169,188,188,0.6)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("N", c, 5);
      ctx.fillText("S", c, W - 5);
      ctx.fillText("E", W - 4, c);
      ctx.fillText("W", 4, c);
      const vec = this.kind === "wind" ? windVec(params) : currentVec(params);
      const mag = Math.hypot(vec.x, vec.y);
      const L = (mag / this.max) * R;
      const ux = mag > 0 ? vec.x / mag : 0;
      const uy = mag > 0 ? -vec.y / mag : 0;
      const col = this.kind === "wind" ? "#eef3f1" : "#6ed2d7";
      const tipX = c + ux * L;
      const tipY = c + uy * L;
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      if (L > 6) {
        const a = Math.atan2(uy, ux);
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.moveTo(tipX + Math.cos(a) * 3, tipY + Math.sin(a) * 3);
        ctx.lineTo(tipX - 7 * Math.cos(a - 0.5), tipY - 7 * Math.sin(a - 0.5));
        ctx.lineTo(tipX - 7 * Math.cos(a + 0.5), tipY - 7 * Math.sin(a + 0.5));
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = "#e9692f";
      ctx.beginPath();
      ctx.arc(tipX, tipY, 4, 0, Math.PI * 2);
      ctx.fill();
      const out = $(`[data-padout="${this.kind}"]`);
      if (this.kind === "wind") out.innerHTML = params.windSpd > 0 ? `<b>${params.windSpd.toFixed(1)} m/s</b><br>from ${String(Math.round(params.windFrom) % 360).padStart(3, "0")}°` : `<b>calm</b><br>&nbsp;`;
      else out.innerHTML = params.curSpd > 0 ? `<b>${params.curSpd.toFixed(1)} m/s</b><br>→ ${String(Math.round(params.curTo) % 360).padStart(3, "0")}°` : `<b>slack</b><br>&nbsp;`;
    }
  }
  const pads = { wind: new Pad("wind", 15), cur: new Pad("cur", 3) };

  // ── presets ──────────────────────────────────────────────────────────
  const presetBtns = $$<HTMLButtonElement>("[data-preset]");
  function markEdited() {
    presetBtns.forEach((b) => b.classList.remove("is-on"));
  }
  function applyPreset(id: string) {
    const pr = PRESETS.find((p) => p.id === id);
    if (!pr) return;
    presetId = id;
    params = clone(pr.params);
    presetBtns.forEach((b) => b.classList.toggle("is-on", b.dataset.preset === id));
    history.replaceState(null, "", `#${id}`);
    t = 0;
    recompute();
    off.overview = { x: 0, y: 0 };
    off.datum = { x: 0, y: 0 };
    off.drone = { x: 0, y: 0 };
    zoom.overview = zoom.datum = zoom.drone = 1;
    setPlaying(true);
    flash(`${pr.name}`, true);
  }
  presetBtns.forEach((b) => b.addEventListener("click", () => applyPreset(b.dataset.preset!)));
  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "");
    if (id !== presetId && PRESETS.some((p) => p.id === id)) applyPreset(id);
  });
  presetBtns.forEach((b) => b.classList.toggle("is-on", b.dataset.preset === presetId));
  // thumbnails, lazily
  (function thumbs(i = 0) {
    if (i >= presetBtns.length) return;
    const go = () => {
      const btn = presetBtns[i];
      const pr = PRESETS.find((p) => p.id === btn.dataset.preset)!;
      drawThumb(btn.querySelector("canvas")!, simulateMission(clone(pr.params)));
      thumbs(i + 1);
    };
    "requestIdleCallback" in window ? (window as any).requestIdleCallback(go, { timeout: 400 }) : setTimeout(go, 30);
  })();

  function drawThumb(c: HTMLCanvasElement, mm: Mission) {
    const ctx = c.getContext("2d")!;
    const W = c.width;
    ctx.fillStyle = "#08161c";
    ctx.fillRect(0, 0, W, W);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (let i = 0; i < mm.n; i += 4) {
      x0 = Math.min(x0, mm.x[i]);
      x1 = Math.max(x1, mm.x[i]);
      y0 = Math.min(y0, mm.y[i]);
      y1 = Math.max(y1, mm.y[i]);
    }
    const s = (W - 12) / Math.max(x1 - x0, y1 - y0, 1);
    const ox = W / 2 - ((x0 + x1) / 2) * s;
    const oy = W / 2 + ((y0 + y1) / 2) * s;
    ctx.lineWidth = 1;
    let cur = -1;
    for (let i = 0; i < mm.n; i += 3) {
      const md = mm.mode[i];
      if (md === MODE.STANDBY || md === MODE.LANDED) continue;
      if (md !== cur) {
        if (cur >= 0) ctx.stroke();
        ctx.strokeStyle = PHASE_COLORS[md];
        ctx.beginPath();
        ctx.moveTo(ox + mm.x[i] * s, oy - mm.y[i] * s);
        cur = md;
      } else ctx.lineTo(ox + mm.x[i] * s, oy - mm.y[i] * s);
    }
    if (cur >= 0) ctx.stroke();
    ctx.fillStyle = "#eef3f1";
    ctx.beginPath();
    ctx.arc(ox + mm.p.home.x * s, oy - mm.p.home.y * s, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── timeline ─────────────────────────────────────────────────────────
  const track = $("[data-tl-track]");
  const phasesEl = $("[data-tl-phases]");
  const marksEl = $("[data-tl-marks]");
  const headEl = $("[data-tl-head]");
  const doneEl = $("[data-tl-done]");
  const hoverEl = $("[data-tl-hover]");
  const playBtn = $("[data-tl-play]");

  function buildTimeline() {
    const E = m.tEnd;
    const segs: [number, number, number][] = [
      [0, params.delay, 0],
      [params.delay, m.t1, 1],
      [m.t1, m.t2, 2],
      [m.t2, m.t3, 3],
      [m.t3, E, 0],
    ];
    phasesEl.innerHTML = segs
      .filter(([a, b]) => b - a > 0.01)
      .map(([a, b, k]) => `<i class="p${k}" style="flex:${b - a} 0 0" title=""></i>`)
      .join("");
    marksEl.innerHTML = m.events
      .filter((e) => e.kind !== "start")
      .map((e, i) => `<div class="mk" data-kind="${e.kind}" data-t="${e.t}" data-i="${i}" style="left:${(e.t / E) * 100}%"><i></i></div>`)
      .join("");
    $("[data-tl-end]").textContent = fmt(E);
  }
  const phaseName = (time: number) => {
    const i = Math.floor(indexAt(m, time));
    return ["Standby", "Intercept", "Spiral search", "Return to home", "Landed"][m.mode[i]];
  };
  let scrubbing = false;
  const timeFromX = (clientX: number) => {
    const r = track.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * m.tEnd;
  };
  track.addEventListener("pointerdown", (e) => {
    const mk = (e.target as HTMLElement).closest(".mk") as HTMLElement | null;
    if (mk) {
      seek(parseFloat(mk.dataset.t!) - 0.01);
      return;
    }
    scrubbing = true;
    track.setPointerCapture(e.pointerId);
    seek(timeFromX(e.clientX));
  });
  track.addEventListener("pointermove", (e) => {
    const tt = timeFromX(e.clientX);
    if (scrubbing) seek(tt);
    const r = track.getBoundingClientRect();
    const mk = (e.target as HTMLElement).closest(".mk") as HTMLElement | null;
    let label = phaseName(tt);
    let at = tt;
    if (mk) {
      const ev = m.events.find((q) => Math.abs(q.t - parseFloat(mk.dataset.t!)) < 1e-6);
      if (ev) {
        label = ev.label + (ev.detail ? `<small>${ev.detail}</small>` : "");
        at = ev.t;
      }
    }
    hoverEl.style.display = "block";
    hoverEl.style.left = `${((at / m.tEnd) * r.width).toFixed(1)}px`;
    hoverEl.innerHTML = `T+${fmt(at)} · ${label}`;
  });
  track.addEventListener("pointerup", () => (scrubbing = false));
  track.addEventListener("pointerleave", () => {
    if (!scrubbing) hoverEl.style.display = "none";
  });
  function seek(tt: number) {
    t = Math.max(0, Math.min(m.tEnd, tt));
    lastToastT = t;
  }
  function jumpEvent(dir: 1 | -1) {
    const evs = [0, ...m.events.filter((e) => e.kind !== "start").map((e) => e.t), m.tEnd];
    if (dir > 0) {
      const nx = evs.find((e) => e > t + 0.5);
      seek(nx ?? m.tEnd);
    } else {
      const pv = [...evs].reverse().find((e) => e < t - 1.5);
      seek(pv ?? 0);
    }
  }
  $("[data-tl-prev]").addEventListener("click", () => jumpEvent(-1));
  $("[data-tl-next]").addEventListener("click", () => jumpEvent(1));
  function setPlaying(on: boolean) {
    playing = on;
    if (on && t >= m.tEnd - 0.01) t = 0;
    playBtn.textContent = on ? "❚❚" : "▶";
    playBtn.setAttribute("aria-label", on ? "Pause" : "Play");
  }
  playBtn.addEventListener("click", () => setPlaying(!playing));
  $$<HTMLButtonElement>("[data-spd]").forEach((b) =>
    b.addEventListener("click", () => {
      speed = parseFloat(b.dataset.spd!);
      $$("[data-spd]").forEach((q) => q.classList.toggle("is-on", q === b));
    }),
  );

  // ── camera ───────────────────────────────────────────────────────────
  const camBtns = $$<HTMLButtonElement>("[data-cam]");
  function setCam(mode: CamMode) {
    camMode = mode;
    camBtns.forEach((b) => b.classList.toggle("is-on", b.dataset.cam === mode));
  }
  camBtns.forEach((b) => b.addEventListener("click", () => setCam(b.dataset.cam as CamMode)));
  const dropBtn = $("[data-drop]");
  dropBtn.addEventListener("click", () => {
    dropMode = !dropMode;
    dropBtn.classList.toggle("is-on", dropMode);
    canvas.classList.toggle("is-drop", dropMode);
  });

  let overviewBox = { x0: 0, x1: 1, y0: 0, y1: 1 };
  function computeOverviewBox() {
    let x0 = Math.min(params.home.x, params.lkp.x), x1 = Math.max(params.home.x, params.lkp.x);
    let y0 = Math.min(params.home.y, params.lkp.y), y1 = Math.max(params.home.y, params.lkp.y);
    for (let i = 0; i < m.n; i += 4) {
      x0 = Math.min(x0, m.x[i]);
      x1 = Math.max(x1, m.x[i]);
      y0 = Math.min(y0, m.y[i]);
      y1 = Math.max(y1, m.y[i]);
    }
    const pad = params.Rs * 1.5;
    overviewBox = { x0: x0 - pad, x1: x1 + pad, y0: y0 - pad, y1: y1 + pad };
  }
  function targetCam(): Camera {
    const W = renderer.W;
    const H = renderer.H;
    const fi = indexAt(m, t);
    let c: { x: number; y: number };
    let s: number;
    if (camMode === "overview") {
      const b = overviewBox;
      const pl = W > 900 ? 250 : 20, pr = W > 900 ? 190 : 20, pt = 70, pb = W > 900 ? 40 : 120;
      s = Math.min((W - pl - pr) / (b.x1 - b.x0), (H - pt - pb) / (b.y1 - b.y0));
      // centre the box inside the padded region
      const cxS = pl + (W - pl - pr) / 2;
      const cyS = pt + (H - pt - pb) / 2;
      c = { x: (b.x0 + b.x1) / 2 - (cxS - W / 2) / s, y: (b.y0 + b.y1) / 2 + (cyS - H / 2) / s };
    } else if (camMode === "drone") {
      c = { x: lerpArr(m.x, fi), y: lerpArr(m.y, fi) };
      s = Math.min(W, H) / Math.max(14 * params.Rs, 500);
    } else {
      c = datumAt(params, m.vc, t);
      let maxR = params.Rs;
      for (let k = 0; k < m.planned.x.length; k += 8) maxR = Math.max(maxR, Math.hypot(m.planned.x[k], m.planned.y[k]));
      s = (Math.min(W, H) * 0.8) / (2 * (maxR + params.Rs * 1.5));
    }
    return { cx: c.x + off[camMode].x, cy: c.y + off[camMode].y, s: s * zoom[camMode] };
  }

  // ── map interaction ──────────────────────────────────────────────────
  type Drag = { kind: "pan" | "home" | "lkp" | "tg"; id?: string; sx: number; sy: number; moved: boolean };
  let drag: Drag | null = null;
  const local = (e: PointerEvent | WheelEvent | MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  function hitTest(sx: number, sy: number): string | null {
    const near = (x: number, y: number, r: number) => {
      const q = renderer.toScreen(cam, x, y);
      return Math.hypot(q.x - sx, q.y - sy) < r;
    };
    if (near(params.home.x, params.home.y, 15)) return "home";
    if (near(params.lkp.x, params.lkp.y, 13)) return "lkp";
    const C = datumAt(params, m.vc, t);
    for (const tg of params.targets) if (near(C.x + tg.x, C.y + tg.y, 11)) return "tg:" + tg.id;
    return null;
  }
  canvas.addEventListener("pointerdown", (e) => {
    fadeHint();
    const p = local(e);
    if (dropMode) {
      const w = renderer.toWorld(cam, p.x, p.y);
      const C = datumAt(params, m.vc, t);
      const n = params.targets.length + 1;
      const kinds: Target["kind"][] = ["person", "raft", "debris"];
      params.targets.push({ id: `u${Date.now().toString(36)}`, x: w.x - C.x, y: w.y - C.y, kind: kinds[(n - 1) % 3], label: `Target ${n}` });
      markEdited();
      recompute(false);
      return;
    }
    const h = hitTest(p.x, p.y);
    canvas.setPointerCapture(e.pointerId);
    if (h === "home" || h === "lkp") drag = { kind: h, sx: p.x, sy: p.y, moved: false };
    else if (h?.startsWith("tg:")) drag = { kind: "tg", id: h.slice(3), sx: p.x, sy: p.y, moved: false };
    else {
      drag = { kind: "pan", sx: p.x, sy: p.y, moved: false };
      canvas.classList.add("is-panning");
    }
  });
  canvas.addEventListener("pointermove", (e) => {
    const p = local(e);
    if (!drag) {
      const h = hitTest(p.x, p.y);
      if (h !== hot) {
        hot = h;
        canvas.classList.toggle("is-hot", !!h && !dropMode);
      }
      return;
    }
    const dx = p.x - drag.sx;
    const dy = p.y - drag.sy;
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.moved = true;
    if (drag.kind === "pan") {
      off[camMode].x -= dx / cam.s;
      off[camMode].y += dy / cam.s;
      cam.cx -= dx / cam.s;
      cam.cy += dy / cam.s;
    } else {
      const w = renderer.toWorld(cam, p.x, p.y);
      if (drag.kind === "home") params.home = w;
      else if (drag.kind === "lkp") params.lkp = w;
      else {
        const C = datumAt(params, m.vc, t);
        const tg = params.targets.find((q) => q.id === drag!.id);
        if (tg) {
          tg.x = w.x - C.x;
          tg.y = w.y - C.y;
        }
      }
      canvas.classList.add("is-drag");
      markEdited();
      requestRecompute();
    }
    drag.sx = p.x;
    drag.sy = p.y;
  });
  const endDrag = () => {
    if (drag && drag.kind !== "pan" && drag.moved) recompute(false);
    drag = null;
    canvas.classList.remove("is-panning", "is-drag");
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      fadeHint();
      const p = local(e);
      const f = Math.exp(-e.deltaY * (e.deltaMode === 1 ? 0.05 : 0.0016));
      const before = renderer.toWorld(cam, p.x, p.y);
      zoom[camMode] = Math.max(0.15, Math.min(40, zoom[camMode] * f));
      cam.s *= f;
      const after = renderer.toWorld(cam, p.x, p.y);
      cam.cx += before.x - after.x;
      cam.cy += before.y - after.y;
      off[camMode].x += before.x - after.x;
      off[camMode].y += before.y - after.y;
    },
    { passive: false },
  );
  canvas.addEventListener("dblclick", () => {
    zoom[camMode] = 1;
    off[camMode] = { x: 0, y: 0 };
  });

  // ── contacts list ───────────────────────────────────────────────────
  const contactsEl = $("[data-contacts]");
  function renderContacts() {
    const list = params.targets;
    $("[data-contacts-count]").textContent = `${m.contacts.length}/${list.length}`;
    if (!list.length) {
      contactsEl.innerHTML = `<li class="contacts__empty">No targets. Use <b>⊕ Target</b> on the map to drop one onto the water.</li>`;
      return;
    }
    contactsEl.innerHTML = list
      .map((tg) => {
        const c = m.contacts.find((q) => q.id === tg.id);
        return `<li class="ct" data-ct="${tg.id}" data-t="${c ? c.t : ""}" title="${c ? "Jump to the contact" : "Not found this mission"}"><span class="ct__ic"></span><span>${escapeHtml(tg.label)}</span><span class="ct__t">${c ? "T+" + fmt(c.t) : "—"}</span><button class="ct__x" type="button" data-ct-del="${tg.id}" aria-label="Remove ${escapeHtml(tg.label)}">×</button></li>`;
      })
      .join("");
    updateContactStates();
  }
  function updateContactStates() {
    for (const li of $$("[data-ct]", contactsEl)) {
      const ct = parseFloat(li.dataset.t || "NaN");
      li.classList.toggle("is-found", ct <= t);
    }
  }
  contactsEl.addEventListener("click", (e) => {
    const del = (e.target as HTMLElement).closest("[data-ct-del]") as HTMLElement | null;
    if (del) {
      params.targets = params.targets.filter((q) => q.id !== del.dataset.ctDel);
      markEdited();
      recompute(false);
      return;
    }
    const li = (e.target as HTMLElement).closest("[data-ct]") as HTMLElement | null;
    if (li && li.dataset.t) {
      seek(parseFloat(li.dataset.t) - 2);
      setPlaying(false);
    }
  });
  $("[data-clear-targets]").addEventListener("click", () => {
    params.targets = [];
    markEdited();
    recompute(false);
  });

  // ── warnings, toasts, hint ──────────────────────────────────────────
  const warnEl = $("[data-warn]");
  function renderWarnings() {
    warnEl.hidden = !m.warnings.length;
    warnEl.innerHTML = m.warnings.map(escapeHtml).join("<br>");
  }
  const toastEl = $("[data-toast]");
  let toastTimer = 0;
  function flash(msg: string, cool = false) {
    toastEl.textContent = msg;
    toastEl.classList.toggle("is-cool", cool);
    toastEl.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toastEl.classList.remove("is-on"), 2600);
  }
  let lastToastT = 0;
  const hintEl = $("[data-hint]");
  const fadeHint = () => hintEl.classList.add("is-faded");
  setTimeout(fadeHint, 12000);

  // ── HUD panels ───────────────────────────────────────────────────────
  $$("[data-collapse]").forEach((b) => b.addEventListener("click", () => b.parentElement!.classList.toggle("is-open")));
  const attPanel = $("[data-hp='att']");
  const chip = $("[data-cmp-open]");
  const placeChip = () => {
    if (window.innerWidth > 720) chip.style.top = `${attPanel.offsetTop + attPanel.offsetHeight + 10}px`;
    else chip.style.top = "";
  };
  new ResizeObserver(placeChip).observe(attPanel);
  // route the in-page anchor through Lenis (a native jump re-enters its scroll handler)
  $$<HTMLAnchorElement>('a[href^="#sar-"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const lenis = (window as any).lenis;
      if (!lenis) return;
      e.preventDefault();
      lenis.scrollTo(a.getAttribute("href"), { offset: -10 });
    }),
  );

  const el = {
    pill: $("[data-md-pill]"),
    name: $("[data-md-name]"),
    sub: $("[data-md-sub]"),
    clk: $("[data-clk]"),
    prev: $("[data-clk-prev]"),
    next: $("[data-clk-next]"),
    hdg: $("[data-att-hdg]"),
    bank: $("[data-att-bank]"),
    pitch: $("[data-att-pitch]"),
    crab: $("[data-att-crab]"),
    batPct: $("[data-bat-pct]"),
    segR: $("[data-seg='reserve']"),
    segH: $("[data-seg='rth']"),
    segS: $("[data-seg='search']"),
    batLand: $("[data-bat-land]"),
    batLeft: $("[data-bat-left]"),
    batRth: $("[data-bat-rth]"),
    batSearch: $("[data-bat-search]"),
    batLandTxt: $("[data-bat-land-txt]"),
    batCover: $("[data-bat-cover]"),
    batSum: $("[data-bat-sum]"),
    tel: Object.fromEntries($$("[data-tel]").map((q) => [q.dataset.tel!, q])) as Record<string, HTMLElement>,
    now: $("[data-tl-now]"),
    env: $<HTMLCanvasElement>("[data-env]"),
  };
  const PILL = ["STANDBY", "GUIDED", "AUTO", "RTL", "LANDED"];
  const NAME = ["On the pad", "Intercept", "Spiral search", "Return home", "Mission complete"];

  const curveAt = (arr: Float64Array, time: number) => {
    const k = Math.max(0, Math.min(curve.bins, Math.floor((time - curve.t0) / curve.dt)));
    return arr[k];
  };
  const km2 = (a: number) => (a >= 1e6 ? `${(a / 1e6).toFixed(2)} km²` : `${(a / 1e4).toFixed(1)} ha`);
  const dist = (d: number) => (d >= 1000 ? `${(d / 1000).toFixed(2)} km` : `${Math.round(d)} m`);
  const deg3 = (d: number) => String(Math.round(((d % 360) + 360) % 360) % 360).padStart(3, "0");
  const sgn = (v: number, dp = 0) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(dp)}`;

  function updateHud() {
    const fi = indexAt(m, t);
    const i = Math.floor(fi);
    const mode = m.mode[i];
    el.pill.textContent = PILL[mode];
    el.pill.dataset.m = String(mode);
    el.name.textContent = NAME[mode];
    const vcS = Math.hypot(m.vc.x, m.vc.y);
    if (mode === MODE.STANDBY) el.sub.textContent = vcS > 0.05 ? `Datum drifting ${vcS.toFixed(1)} m/s → ${deg3(params.curTo)}°` : "Datum holding still";
    else if (mode === MODE.INTERCEPT) el.sub.textContent = `Spiral start ${dist(Math.hypot(lerpArr(m.dfx, fi) - m.r0, lerpArr(m.dfy, fi)))} · ETA ${fmt(m.t1 - t)}`;
    else if (mode === MODE.SEARCH) {
      const th = lerpArr(m.theta, fi);
      const td = (lerpArr(m.theta, Math.min(m.n - 1, fi + 1)) - th) / 0.25;
      el.sub.textContent = `Rev ${(th / (2 * Math.PI)).toFixed(2)} · r ${Math.round(lerpArr(m.r, fi))} m · θ′ ${((td * 180) / Math.PI).toFixed(1)}°/s`;
    } else if (mode === MODE.RTH) el.sub.textContent = `${dist(Math.hypot(lerpArr(m.x, fi) - params.home.x, lerpArr(m.y, fi) - params.home.y))} to home · ETA ${fmt(m.t3 - t)}`;
    else el.sub.textContent = `Landed with ${Math.round(m.landPct)}% · ${m.contacts.length}/${params.targets.length} contacts`;

    el.clk.textContent = fmt(t);
    const evs = m.events.filter((e) => e.kind !== "start");
    const prev = [...evs].reverse().find((e) => e.t <= t);
    const next = evs.find((e) => e.t > t && (layers.reveal || e.kind !== "contact"));
    el.prev.innerHTML = prev ? `<span>${escapeHtml(prev.label)}</span><b>T+${fmt(t - prev.t)}</b>` : `<span>Alert received</span><b>T+${fmt(t)}</b>`;
    el.next.innerHTML = next ? `<span>${escapeHtml(next.label)}</span><b>T−${fmt(next.t - t)}</b>` : "";

    // battery
    const airborne = mode !== MODE.STANDBY && mode !== MODE.LANDED;
    const used = mode === MODE.STANDBY ? 0 : mode === MODE.LANDED ? m.t3 - params.delay : t - params.delay;
    const pct = Math.max(0, 100 * (1 - used / m.T));
    const rth = airborne ? lerpArr(m.rth, fi) : 0;
    const rthPct = (100 * rth) / m.T;
    const res = Math.min(pct, params.reservePct);
    const rthW = Math.max(0, Math.min(pct - res, rthPct));
    const searchW = Math.max(0, pct - res - rthW);
    el.batPct.textContent = String(Math.round(pct));
    el.batPct.parentElement!.classList.toggle("is-low", pct < params.reservePct + 10 && pct >= params.reservePct);
    el.batPct.parentElement!.classList.toggle("is-crit", pct < params.reservePct);
    el.segR.style.width = `${res}%`;
    el.segH.style.width = `${rthW}%`;
    el.segS.style.width = `${searchW}%`;
    el.segH.style.display = rthW > 0.05 ? "" : "none";
    el.segS.style.display = searchW > 0.05 ? "" : "none";
    el.batLand.style.left = `calc(${m.landPct}% + 0px)`;
    el.batLeft.innerHTML = `${fmt((pct / 100) * m.T)} <small>at ${params.U} m/s</small>`;
    el.batRth.innerHTML = airborne ? `${fmt(rth)} <small>· ${rthPct.toFixed(0)}%</small>` : "—";
    const searchLeft = mode <= MODE.SEARCH ? Math.max(0, m.t2 - Math.max(t, m.t1)) : 0;
    el.batSearch.innerHTML = mode <= MODE.SEARCH ? `${fmt(searchLeft)} <small>→ bingo T+${fmt(m.t2)}</small>` : `<small>spiral complete</small>`;
    el.batLandTxt.innerHTML = `${m.landPct.toFixed(0)}% <small>reserve ${params.reservePct}%</small>`;
    const aNow = curveAt(curve.area, t);
    const aEnd = curve.area[curve.bins];
    const pNow = curveAt(curve.pod, t);
    const pEnd = curve.pod[curve.bins];
    el.batSum.innerHTML =
      mode <= MODE.SEARCH && m.t2 > t
        ? `Bingo <b>T−${fmt(m.t2 - t)}</b> · lands with <b>${m.landPct.toFixed(0)}%</b>`
        : mode === MODE.RTH
          ? `Home in <b>${fmt(m.t3 - t)}</b> · lands with <b>${m.landPct.toFixed(0)}%</b>`
          : `Landed with <b>${m.landPct.toFixed(0)}%</b>`;
    el.batCover.innerHTML = aEnd - aNow > 1 ? `${km2(aEnd - aNow)} <small>POD → ${(pEnd * 100).toFixed(0)}%</small>` : `<small>nothing — plan flown</small>`;

    // telemetry
    const ax = lerpArr(m.ax, fi), ay = lerpArr(m.ay, fi);
    const gx = lerpArr(m.gx, fi), gy = lerpArr(m.gy, fi);
    const as = Math.hypot(ax, ay);
    const gs = Math.hypot(gx, gy);
    const hdg = lerpAngle(m.hdg, fi);
    const trk = gs > 0.3 ? bearingOf({ x: gx, y: gy }) : hdg;
    let crab = trk - hdg;
    if (crab > 180) crab -= 360;
    if (crab < -180) crab += 360;
    const nose = fromBearing(hdg);
    const head = -(m.vw.x * nose.x + m.vw.y * nose.y);
    const cross = m.vw.x * nose.y - m.vw.y * nose.x;
    el.tel.as.innerHTML = `${as.toFixed(1)} <small>m/s</small>`;
    el.tel.gs.innerHTML = `${gs.toFixed(1)} <small>m/s</small>`;
    el.tel.trk.innerHTML = `${deg3(trk)}°`;
    el.tel.alt.innerHTML = `${Math.round(lerpArr(m.alt, fi))} <small>m</small>`;
    el.tel.hw.innerHTML = airborne ? `${head >= 0 ? "H" : "T"} ${Math.abs(head).toFixed(1)} · X ${sgn(cross, 1)}` : "—";
    el.tel.home.textContent = dist(Math.hypot(lerpArr(m.x, fi) - params.home.x, lerpArr(m.y, fi) - params.home.y));
    el.tel.datum.textContent = dist(Math.hypot(lerpArr(m.dfx, fi), lerpArr(m.dfy, fi)));
    el.tel.pod.innerHTML = `${(pNow * 100).toFixed(1)}<small>%</small>`;
    el.tel.area.textContent = km2(aNow);
    el.hdg.textContent = deg3(att.h);
    el.bank.textContent = `${sgn(att.b)}°`;
    el.pitch.textContent = `${sgn(att.p)}°`;
    el.crab.textContent = airborne ? `${sgn(crab)}°` : "0°";
    el.now.textContent = fmt(t);
    drawEnv(hdg);
    updateContactStates();
    $$<HTMLElement>(".mk", marksEl).forEach((q) => q.classList.toggle("is-past", parseFloat(q.dataset.t!) <= t));
  }

  function drawEnv(hdg: number) {
    const c = el.env;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const css = c.clientWidth || 76;
    if (!css) return;
    if (c.width !== Math.round(css * dpr)) {
      c.width = Math.round(css * dpr);
      c.height = c.width;
    }
    const ctx = c.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const W = css, cc = W / 2, R = cc - 9;
    ctx.clearRect(0, 0, W, W);
    ctx.strokeStyle = "rgba(190,230,235,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cc, cc, R, 0, Math.PI * 2);
    ctx.stroke();
    // rotate so the nose is up
    const rot = (-hdg * Math.PI) / 180;
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = "rgba(169,188,188,0.8)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const [lbl, b] of [["N", 0], ["E", 90], ["S", 180], ["W", 270]] as const) {
      const a = rot + (b * Math.PI) / 180;
      ctx.fillText(lbl, cc + Math.sin(a) * (R + 5), cc - Math.cos(a) * (R + 5));
    }
    const arrow = (vec: { x: number; y: number }, max: number, col: string) => {
      const sp = Math.hypot(vec.x, vec.y);
      if (sp < 0.05) return;
      const b = (Math.atan2(vec.x, vec.y)) + rot;
      const L = Math.min(1, sp / max) * (R - 4) + 4;
      const ux = Math.sin(b), uy = -Math.cos(b);
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(cc - ux * L * 0.5, cc - uy * L * 0.5);
      ctx.lineTo(cc + ux * L * 0.5, cc + uy * L * 0.5);
      ctx.stroke();
      const tx = cc + ux * L * 0.5, ty = cc + uy * L * 0.5, a = Math.atan2(uy, ux);
      ctx.beginPath();
      ctx.moveTo(tx + Math.cos(a) * 2, ty + Math.sin(a) * 2);
      ctx.lineTo(tx - 5 * Math.cos(a - 0.5), ty - 5 * Math.sin(a - 0.5));
      ctx.lineTo(tx - 5 * Math.cos(a + 0.5), ty - 5 * Math.sin(a + 0.5));
      ctx.closePath();
      ctx.fill();
    };
    arrow(m.vw, 12, "rgba(238,243,241,0.9)");
    arrow(m.vc, 2.5, "rgba(110,210,215,0.95)");
    // nose tick
    ctx.fillStyle = "#e9692f";
    ctx.beginPath();
    ctx.moveTo(cc, cc - R + 1);
    ctx.lineTo(cc - 4, cc - R + 8);
    ctx.lineTo(cc + 4, cc - R + 8);
    ctx.closePath();
    ctx.fill();
  }

  // ── compare ──────────────────────────────────────────────────────────
  const cmpEl = $("[data-cmp]");
  const podChart = new LineChart($<HTMLCanvasElement>('[data-chart="pod"]'));
  const distChart = new LineChart($<HTMLCanvasElement>('[data-chart="dist"]'));
  function renderCmpChip() {
    const bars = $("[data-cmp-bars]");
    const sum = $("[data-cmp-sum]");
    if (cmp) {
      const ia = cmp.runs.find((r) => r.id === "ia")!;
      const nb = cmp.runs.filter((r) => r.id !== "ia").sort((a, b) => b.score - a.score)[0];
      const nbMeta = PATTERNS.find((p) => p.id === nb.id)!;
      sum.innerHTML = `IA spiral <b>${Math.round(ia.score * 100)}</b> · next ${nbMeta.short} ${Math.round(nb.score * 100)}`;
    } else sum.textContent = "Spiral infeasible — nothing to compare";
    if (!cmp) {
      bars.innerHTML = `<span class="cb"><span class="cb__n">—</span><span class="cb__t"></span><span class="cb__v"></span></span>`;
      return;
    }
    bars.innerHTML = PATTERNS.map((p) => {
      const r = cmp!.runs.find((q) => q.id === p.id)!;
      return `<span class="cb${p.id === "ia" ? " is-hero" : ""}" title="${p.name}: search score"><span class="cb__n">${p.short}</span><span class="cb__t"><i style="width:${Math.min(100, r.score * 100).toFixed(1)}%;background:${p.color}"></i></span><span class="cb__v">${Math.round(r.score * 100)}</span></span>`;
    }).join("");
  }
  function openCompare(refresh = false) {
    if (!cmp) {
      flash("Nothing to compare — the spiral isn't feasible");
      return;
    }
    cmpEl.hidden = false;
    buildPodChart(podChart, cmp);
    buildDistChart(distChart, cmp);
    podChart.draw();
    distChart.draw();
    const best = Math.max(...cmp.runs.map((r) => r.score));
    const tbody = $("tbody", $("[data-cmp-table]"));
    tbody.innerHTML = PATTERNS.map((p) => {
      const r = cmp!.runs.find((q) => q.id === p.id)!;
      const isBest = r.score === best;
      return `<tr class="${isBest ? "is-best" : ""}"><td><i style="background:${p.color}"></i>${p.name}</td><td class="${isBest ? "best" : ""}">${(r.score * 100).toFixed(1)}</td><td>${(r.order * 100).toFixed(0)}%</td><td>${(r.podEnd * 100).toFixed(1)}%</td><td>${isFinite(r.t50) ? "+" + fmt(r.t50) : "never"}</td><td>${r.found.length}/${params.targets.length}</td></tr>`;
    }).join("");
    for (const p of PATTERNS) {
      const r = cmp.runs.find((q) => q.id === p.id)!;
      $("[data-mini-score]", $(`[data-mini="${p.id}"]`)).textContent = `${Math.round(r.score * 100)}`;
    }
    if (!refresh) lastMini = 0;
  }
  chip.addEventListener("click", () => openCompare());
  $("[data-cmp-close]").addEventListener("click", () => (cmpEl.hidden = true));
  $$<HTMLButtonElement>("[data-series]").forEach((b) =>
    b.addEventListener("click", (e) => {
      const id = b.dataset.series as PatternId;
      const gh = (e.target as HTMLElement).closest("[data-ghost]") as HTMLElement | null;
      if (gh) {
        if (ghosts.has(id)) ghosts.delete(id);
        else ghosts.add(id);
        gh.classList.toggle("is-on", ghosts.has(id));
        return;
      }
      for (const ch of [podChart, distChart]) {
        if (ch.visible.has(id)) ch.visible.delete(id);
        else ch.visible.add(id);
        ch.draw();
      }
      b.classList.toggle("is-on", podChart.visible.has(id));
    }),
  );

  // ── tooltips ─────────────────────────────────────────────────────────
  const tipBox = $("[data-tipbox]");
  let tipTimer = 0;
  $$("[data-tip]").forEach((q) => {
    q.addEventListener("pointerenter", () => {
      clearTimeout(tipTimer);
      tipTimer = window.setTimeout(() => {
        const r = q.getBoundingClientRect();
        tipBox.textContent = q.dataset.tip!;
        const left = r.right + 12 + 240 < window.innerWidth ? r.right + 12 : Math.max(8, r.left);
        const top = r.right + 12 + 240 < window.innerWidth ? r.top : r.bottom + 6;
        tipBox.style.left = `${left}px`;
        tipBox.style.top = `${top}px`;
        tipBox.classList.add("is-on");
      }, 380);
    });
    q.addEventListener("pointerleave", () => {
      clearTimeout(tipTimer);
      tipBox.classList.remove("is-on");
    });
  });

  // ── keyboard ─────────────────────────────────────────────────────────
  window.addEventListener("keydown", (e) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" && (e.target as HTMLInputElement).type !== "range" && (e.target as HTMLInputElement).type !== "checkbox") return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const r = app!.getBoundingClientRect();
    if (r.bottom < 80 || r.top > window.innerHeight - 80) return; // only while the app is on screen
    if (tag === "INPUT" && (e.key.startsWith("Arrow") || e.key === " ")) return; // let sliders/checkboxes have their keys
    switch (e.key) {
      case " ":
        e.preventDefault();
        setPlaying(!playing);
        break;
      case "ArrowRight":
        e.preventDefault();
        seek(t + (e.shiftKey ? 60 : 10));
        break;
      case "ArrowLeft":
        e.preventDefault();
        seek(t - (e.shiftKey ? 60 : 10));
        break;
      case "]":
        jumpEvent(1);
        break;
      case "[":
        jumpEvent(-1);
        break;
      case "1":
        setCam("overview");
        break;
      case "2":
        setCam("drone");
        break;
      case "3":
        setCam("datum");
        break;
      case "h":
      case "H":
        hud.classList.toggle("is-hidden");
        break;
      case "c":
      case "C":
        if (cmpEl.hidden) openCompare();
        else cmpEl.hidden = true;
        break;
      case "Escape":
        cmpEl.hidden = true;
        if (dropMode) dropBtn.click();
        break;
    }
  });

  // ── loop ─────────────────────────────────────────────────────────────
  let visible = true;
  new IntersectionObserver((ents) => (visible = ents[0].isIntersecting)).observe(app!);

  function frame(now: number) {
    const dtw = Math.min(0.1, (now - lastWall) / 1000);
    lastWall = now;
    if (dirty) {
      dirty = false;
      recompute(false);
    }
    if (!visible) {
      requestAnimationFrame(frame);
      return;
    }
    const prevT = t;
    if (playing && !scrubbing) {
      t += dtw * speed;
      if (t >= m.tEnd) {
        t = m.tEnd;
        setPlaying(false);
        flash(`Mission complete · ${m.contacts.length}/${params.targets.length} contacts · landed with ${Math.round(m.landPct)}%`, true);
      }
      // event toasts while playing
      for (const ev of m.events) {
        if (ev.t > lastToastT && ev.t <= t && ev.kind !== "start" && ev.kind !== "land") flash(`${ev.label} · T+${fmt(ev.t)}`, ev.kind === "contact");
      }
      lastToastT = t;
    } else lastToastT = t;
    void prevT;

    renderer.resize();
    computeOverviewBox();
    const tc = targetCam();
    if (!camInit) {
      cam = tc;
      camInit = true;
    } else if (!drag || drag.kind !== "pan") {
      const k = 1 - Math.exp(-dtw * (camMode === "overview" ? 5 : 9));
      cam.cx += (tc.cx - cam.cx) * k;
      cam.cy += (tc.cy - cam.cy) * k;
      cam.s = Math.exp(Math.log(cam.s) + (Math.log(tc.s) - Math.log(cam.s)) * k);
    }

    // attitude with a gentle, deterministic wobble (wall-clock driven)
    const fi = indexAt(m, t);
    const tb = lerpArr(m.bank, fi);
    const tp = lerpArr(m.pitch, fi);
    const th = lerpAngle(m.hdg, fi);
    const turb = lerpArr(m.turb, fi);
    const w = now / 1000;
    const A = turb * 2.2;
    const wb = A * (0.55 * Math.sin(w * 1.3 + 0.2) + 0.3 * Math.sin(w * 2.9 + 1.1) + 0.15 * Math.sin(w * 5.3));
    const wp = A * 0.5 * (0.6 * Math.sin(w * 1.1 + 2) + 0.4 * Math.sin(w * 3.7));
    const wy = A * 0.3 * Math.sin(w * 0.7 + 0.5);
    const ka = 1 - Math.exp(-dtw * 10);
    att.b += (tb + wb - att.b) * ka;
    att.p += (tp + wp - att.p) * ka;
    let dh = th + wy - att.h;
    while (dh > 180) dh -= 360;
    while (dh < -180) dh += 360;
    att.h = (att.h + dh * ka + 360) % 360;

    renderer.draw({ cam, m, cov, cmp, ghosts, t, layers, wall: w, hot, dropMode, attitude: { bank: att.b } });
    navball.draw(att.h, att.p, att.b, 45);

    // timeline head
    const f = t / m.tEnd;
    headEl.style.left = `${f * 100}%`;
    doneEl.style.width = `${f * 100}%`;
    doneEl.style.background = "linear-gradient(90deg, rgba(255,255,255,0.0), rgba(255,255,255,0.35))";

    if (now - lastHud > 70) {
      lastHud = now;
      updateHud();
    }
    if (!cmpEl.hidden && cmp && now - lastMini > 260) {
      lastMini = now;
      podChart.playhead = Math.max(0, t - cmp.t0);
      distChart.playhead = podChart.playhead;
      podChart.draw();
      distChart.draw();
      for (const p of PATTERNS) drawMini($<HTMLCanvasElement>(`[data-mini="${p.id}"] canvas`), cmp, p.id, m, t, miniCache);
    }
    requestAnimationFrame(frame);
  }

  recompute();
  updateHud();
  requestAnimationFrame(frame);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
