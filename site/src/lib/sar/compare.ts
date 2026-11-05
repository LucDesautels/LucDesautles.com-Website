// ─────────────────────────────────────────────────────────────────────────
// Search-pattern comparison.
//
// Every pattern starts where the IA spiral starts (same intercept, same t1),
// flies the same airspeed U and leaves at its OWN bingo (elapsed + RTH ≥
// usable endurance). Coverage is scored in the water frame, against a
// circular Gaussian of spread σ around the drifting datum.
//
// The three spirals are the same equation solved in three different frames:
//   • IA spiral      — the datum (water) frame: the frame the survivor is in.
//   • Ground-locked  — the ground frame (GPS waypoints; wind compensated,
//                      current ignored).
//   • Naive          — the air frame: θ' = U/|w| with no wind or current at
//                      all, so it drifts by −(v_c − v_wind) off the datum.
// Expanding square & sector search are flown in the water frame (like a
// coast-guard vessel, which drifts with the current), wind compensated.
// ─────────────────────────────────────────────────────────────────────────

import {
  Coverage,
  DT,
  type Mission,
  type Vec,
  add,
  datumAt,
  dot,
  fromBearing,
  interceptTime,
  len,
  mul,
  podCurve,
  rthTime,
  sub,
  thetaDot,
  v,
} from "./engine";

export type PatternId = "ia" | "ground" | "naive" | "square" | "sector";

export interface PatternMeta {
  id: PatternId;
  name: string;
  short: string;
  color: string;
  dash: number[];
  blurb: string;
}

// Categorical order validated for the dark surface (dataviz validator, all PASS).
export const PATTERNS: PatternMeta[] = [
  { id: "ia", name: "Constant-airspeed spiral (IA)", short: "IA spiral", color: "#e9692f", dash: [], blurb: "Archimedean spiral solved in the water's frame, holding airspeed U." },
  { id: "naive", name: "Naive spiral", short: "Naive", color: "#3987e5", dash: [6, 4], blurb: "Same spiral, but ignoring wind and current — it slides off the datum." },
  { id: "ground", name: "Ground-locked spiral", short: "Ground", color: "#199e70", dash: [2, 3], blurb: "GPS spiral: wind compensated, current ignored. Drifts at −v_c." },
  { id: "square", name: "Expanding square", short: "Square", color: "#c98500", dash: [9, 3, 2, 3], blurb: "IAMSAR SS pattern, legs 1,1,2,2,3,3… × 2Rs, in the water frame." },
  { id: "sector", name: "Sector search", short: "Sector", color: "#d55181", dash: [1, 4], blurb: "IAMSAR VS pattern: 120° turns through the datum, expanding radius." },
];

export interface PatternRun {
  id: PatternId;
  t: Float64Array;
  dfx: Float32Array; // datum-frame position
  dfy: Float32Array;
  gx: Float32Array; // ground position
  gy: Float32Array;
  n: number;
  tEnd: number; // its own bingo
  cov: Coverage;
  pod: Float64Array;
  area: Float64Array;
  found: { id: string; t: number }[];
  dist: Float32Array; // |df| per sample (distance gradient)
  score: number; // AUC(POD) / AUC(ideal disk growth)
  order: number; // AUC(POD) / AUC(same area, perfect order)
  podEnd: number;
  t50: number; // time (from t1) to 50% POD, or Infinity
  pathLen: number; // datum-frame metres flown in the search phase
}

export interface Comparison {
  runs: PatternRun[];
  t0: number;
  t1: number; // common window end (IA spiral's bingo)
  bins: number;
  dt: number;
  ideal: Float64Array;
  half: number;
  view: number; // half-width that frames the IA spiral (small multiples)
}

const SDT = 0.5; // pattern sample step

function speedAlong(e: Vec, veff: Vec, U: number) {
  // |s·e + veff| = U ⇒ s = −e·veff + √((e·veff)² + U² − |veff|²)
  const ev = dot(e, veff);
  const disc = ev * ev + U * U - dot(veff, veff);
  return disc > 0 ? -ev + Math.sqrt(disc) : NaN;
}

interface Track {
  t: number[];
  dx: number[];
  dy: number[];
}

/** Spiral solved in a frame moving at `f` over the ground. */
function spiralInFrame(m: Mission, f: Vec, budget: (t: number, g: Vec) => boolean): Track {
  const { r0, b, vw, vc } = m;
  const U = m.p.U;
  const ve = sub(f, vw);
  const out: Track = { t: [], dx: [], dy: [] };
  const C1 = datumAt(m.p, vc, m.t1);
  let th = 0;
  let tt = m.t1;
  for (let guard = 0; guard < 40000; guard++) {
    const r = r0 + b * th;
    const cen = add(C1, mul(f, tt - m.t1));
    const g = { x: cen.x + r * Math.cos(th), y: cen.y + r * Math.sin(th) };
    const C = datumAt(m.p, vc, tt);
    out.t.push(tt);
    out.dx.push(g.x - C.x);
    out.dy.push(g.y - C.y);
    if (budget(tt, g)) break;
    // RK4
    const k1 = thetaDot(th, r0, b, ve, U);
    const k2 = thetaDot(th + (SDT / 2) * k1, r0, b, ve, U);
    const k3 = thetaDot(th + (SDT / 2) * k2, r0, b, ve, U);
    const k4 = thetaDot(th + SDT * k3, r0, b, ve, U);
    const nth = th + (SDT / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    if (!isFinite(nth)) break;
    th = nth;
    tt += SDT;
  }
  return out;
}

/** Fly a polyline of water-frame waypoints at airspeed U (wind compensated). */
function polylineInWater(m: Mission, start: Vec, wps: Vec[], budget: (t: number, g: Vec) => boolean): Track {
  const U = m.p.U;
  const out: Track = { t: [], dx: [], dy: [] };
  let pos = { ...start };
  let tt = m.t1;
  let wi = 0;
  for (let guard = 0; guard < 40000 && wi < wps.length; guard++) {
    const C = datumAt(m.p, m.vc, tt);
    out.t.push(tt);
    out.dx.push(pos.x);
    out.dy.push(pos.y);
    if (budget(tt, add(C, pos))) break;
    let remain = SDT;
    while (remain > 1e-6 && wi < wps.length) {
      const to = sub(wps[wi], pos);
      const d = len(to);
      if (d < 1e-6) {
        wi++;
        continue;
      }
      const e = mul(to, 1 / d);
      const s = speedAlong(e, m.veff, U);
      if (!isFinite(s) || s <= 0) {
        wi = wps.length;
        break;
      }
      const step = s * remain;
      if (step >= d) {
        pos = { ...wps[wi] };
        remain -= d / s;
        wi++;
      } else {
        pos = add(pos, mul(e, step));
        remain = 0;
      }
    }
    tt += SDT;
  }
  return out;
}

function squareWaypoints(start: Vec, S: number, maxLen: number): Vec[] {
  // CCW to match the spiral: N, W, S, E with legs 1,1,2,2,3,3… × S
  const dirs = [v(0, 1), v(-1, 0), v(0, -1), v(1, 0)];
  const out: Vec[] = [];
  let p = { ...start };
  let total = 0;
  for (let k = 0; total < maxLen; k++) {
    const L = S * (Math.floor(k / 2) + 1);
    p = add(p, mul(dirs[k % 4], L));
    total += L;
    out.push(p);
  }
  return out;
}

function sectorWaypoints(Rs: number, maxLen: number): Vec[] {
  const out: Vec[] = [];
  let total = 0;
  let R = 4 * Rs;
  for (let cycle = 0; total < maxLen; cycle++) {
    for (let pattern = 0; pattern < 2 && total < maxLen; pattern++) {
      const base = pattern * 30 + cycle * 15;
      for (let k = 0; k < 3; k++) {
        const a = base + k * 120;
        out.push(fromBearing(a, R));
        out.push(fromBearing(a + 60, R));
        out.push(v(0, 0));
        total += 3 * R;
      }
    }
    R *= 1.6;
  }
  return out;
}

export function comparePatterns(m: Mission, gridN = 300): Comparison | null {
  if (!m.feasible || m.t2 <= m.t1 + 1) return null;
  const p = m.p;
  const U = p.U;
  const budget = (tt: number, g: Vec) => tt - p.delay + rthTime(g, p.home, m.vw, U) >= m.Tuse;
  const maxLen = U * m.T * 1.5;
  const start = v(m.r0, 0);

  const tracks: Record<PatternId, Track> = {
    ia: spiralInFrame(m, m.vc, budget),
    ground: spiralInFrame(m, v(0, 0), budget),
    naive: spiralInFrame(m, m.vw, budget),
    square: polylineInWater(m, start, squareWaypoints(start, 2 * p.Rs, maxLen), budget),
    sector: polylineInWater(m, start, sectorWaypoints(p.Rs, maxLen), budget),
  };

  // shared grid, centred on the datum: big enough for the IA spiral + 3σ
  let iaMax = p.Rs;
  const ia = tracks.ia;
  for (let i = 0; i < ia.t.length; i++) iaMax = Math.max(iaMax, Math.hypot(ia.dx[i], ia.dy[i]));
  const half = Math.max(iaMax + p.Rs * 2, 3 * p.sigma) * 1.15;
  const gap = Math.max(4, (2 * p.Rs) / U);
  const t0 = m.t1;
  const t1 = m.t1 + Math.max(10, ia.t[ia.t.length - 1] - m.t1);
  const bins = 240;

  // ideal: disk growing at the still-air sweep rate 2·Rs·U, perfectly in order
  const ideal = new Float64Array(bins + 1);
  const s2 = p.sigma * p.sigma;
  for (let k = 0; k <= bins; k++) {
    const A = 2 * p.Rs * U * ((t1 - t0) * (k / bins));
    ideal[k] = 1 - Math.exp(-A / (2 * Math.PI * s2));
  }
  const idealAUC = ideal.reduce((a, b) => a + b, 0);

  const runs: PatternRun[] = PATTERNS.map((meta) => {
    const tr = tracks[meta.id];
    const n = tr.t.length;
    const t = Float64Array.from(tr.t);
    const dfx = Float32Array.from(tr.dx);
    const dfy = Float32Array.from(tr.dy);
    const gx = new Float32Array(n);
    const gy = new Float32Array(n);
    const dist = new Float32Array(n);
    const cov = new Coverage(0, 0, half, gridN, 2, gap);
    const found: PatternRun["found"] = [];
    const seen = new Set<string>();
    let pathLen = 0;
    for (let i = 0; i < n; i++) {
      const C = datumAt(p, m.vc, t[i]);
      gx[i] = C.x + dfx[i];
      gy[i] = C.y + dfy[i];
      dist[i] = Math.hypot(dfx[i], dfy[i]);
      if (i === 0) cov.stamp(dfx[0], dfy[0], p.Rs, t[0]);
      else {
        cov.sweep(dfx[i - 1], dfy[i - 1], dfx[i], dfy[i], p.Rs, t[i - 1], t[i]);
        pathLen += Math.hypot(dfx[i] - dfx[i - 1], dfy[i] - dfy[i - 1]);
      }
      for (const tg of p.targets) {
        if (seen.has(tg.id)) continue;
        if (Math.hypot(dfx[i] - tg.x, dfy[i] - tg.y) <= p.Rs) {
          seen.add(tg.id);
          found.push({ id: tg.id, t: t[i] });
        }
      }
    }
    const curve = podCurve(cov, p.sigma, t0, t1, bins);
    let auc = 0;
    let aucSame = 0;
    let t50 = Infinity;
    for (let k = 0; k <= bins; k++) {
      auc += curve.pod[k];
      aucSame += 1 - Math.exp(-curve.area[k] / (2 * Math.PI * s2));
      if (!isFinite(t50) && curve.pod[k] >= 0.5) t50 = k * curve.dt;
    }
    return {
      id: meta.id,
      t,
      dfx,
      dfy,
      gx,
      gy,
      n,
      tEnd: t[n - 1],
      cov,
      pod: curve.pod,
      area: curve.area,
      found,
      dist,
      score: idealAUC > 0 ? auc / idealAUC : 0,
      order: aucSame > 0 ? Math.min(1, auc / aucSame) : 0,
      podEnd: curve.pod[bins],
      t50,
      pathLen,
    };
  });

  return { runs, t0, t1, bins, dt: (t1 - t0) / bins, ideal, half, view: Math.min(half, (iaMax + p.Rs * 2) * 1.12) };
}

export { interceptTime, DT };
