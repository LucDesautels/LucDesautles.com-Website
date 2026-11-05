// ─────────────────────────────────────────────────────────────────────────
// SAR spiral — mission engine.
//
// Pure, DOM-free model of the constant-airspeed Archimedean search spiral from
// the Math IA ("Modélisation d'une trajectoire de recherche pour un drone de
// sauvetage maritime"). Everything the /sar-spiral page draws is precomputed
// here into typed arrays, so playback/scrubbing is just indexing. Kept free of
// the DOM so a lightweight scroll-animation easter egg can reuse it later.
//
// Frames & conventions
//   x = east, y = north, metres, seconds. Bearings are clockwise from north.
//   Wind is given meteorologically (the bearing it blows FROM); current is
//   given oceanographically (the bearing it sets TOWARD).
//   C(t) = C0 + v_c·t            datum (drifts with the water)
//   P(t) = C(t) + r(θ)·[cosθ, sinθ],   r(θ) = r0 + (Rs/π)·θ
//   v_air = θ'·w(θ) + v_eff,     v_eff = v_c − v_wind,   |v_air| = U
//   ⇒ θ'²·|w|² + θ'·(2 w·v_eff) + (|v_eff|² − U²) = 0,  take the + root.
//
// Refinements over the submitted paper (see the page's "notes" section):
//   • The two straight legs divide by a vector in the paper; here they're the
//     proper interception quadratics |D + v·τ| = U·τ (closed form).
//   • The intercept aims at the spiral's first point C(t1) + (r0, 0).
//   • The + root is not just "practically" right: when |v_eff| < U, A·C < 0 so
//     √Δ > |B| — the + root is always positive, the − root always negative.
//   • θ' depends on θ only (the ODE is autonomous), so t(θ) is a plain
//     quadrature; we still integrate in time with RK4 for even sampling.
//   • The flight-time constraint T is enforced as a live "bingo" check:
//     leave the spiral the instant elapsed + RTH(now) ≥ usable endurance.
// ─────────────────────────────────────────────────────────────────────────

export type Vec = { x: number; y: number };

export type TargetKind = "person" | "raft" | "debris";
export interface Target {
  id: string;
  /** Offset from the datum, metres, in the datum (water) frame — targets drift with the current. */
  x: number;
  y: number;
  kind: TargetKind;
  label: string;
}

export interface SimParams {
  U: number; // airspeed, m/s
  enduranceMin: number; // T, minutes of flight at U
  reservePct: number; // battery % to land with
  delay: number; // t_delay, s
  Rs: number; // scan radius, m
  r0k: number; // r0 as a multiple of Rs
  windSpd: number;
  windFrom: number; // deg
  curSpd: number;
  curTo: number; // deg
  home: Vec;
  lkp: Vec; // C0 — last known position
  sigma: number; // spread of the probability field around the datum, m
  stopOnContact: boolean;
  targets: Target[];
}

export const MODE = { STANDBY: 0, INTERCEPT: 1, SEARCH: 2, RTH: 3, LANDED: 4 } as const;
export type ModeId = (typeof MODE)[keyof typeof MODE];
export const MODE_NAMES = ["STANDBY", "INTERCEPT", "SEARCH", "RTH", "LANDED"] as const;

export const G = 9.81;
export const DT = 0.25; // mission sample step, s

// ── vector helpers ───────────────────────────────────────────────────────
export const v = (x: number, y: number): Vec => ({ x, y });
export const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
export const mul = (a: Vec, k: number): Vec => ({ x: a.x * k, y: a.y * k });
export const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;
export const len = (a: Vec) => Math.hypot(a.x, a.y);
/** Unit vector for a compass bearing (deg, clockwise from north). */
export const fromBearing = (deg: number, k = 1): Vec => {
  const r = (deg * Math.PI) / 180;
  return { x: Math.sin(r) * k, y: Math.cos(r) * k };
};
export const bearingOf = (a: Vec) => ((Math.atan2(a.x, a.y) * 180) / Math.PI + 360) % 360;

export function windVec(p: SimParams): Vec {
  return fromBearing(p.windFrom + 180, p.windSpd);
}
export function currentVec(p: SimParams): Vec {
  return fromBearing(p.curTo, p.curSpd);
}

/**
 * Time to fly from a moving start to a target, holding airspeed U.
 * Solves |D + rel·τ| = U·τ for the smallest τ > 0, where D is the target's
 * offset at τ=0 and rel is the target's velocity relative to the air mass.
 */
export function interceptTime(D: Vec, rel: Vec, U: number): number {
  const a = U * U - dot(rel, rel);
  const b = dot(D, rel);
  const c = dot(D, D);
  if (c < 1e-9) return 0;
  if (Math.abs(a) < 1e-9) return b < 0 ? c / (-2 * b) : Infinity;
  const disc = b * b + a * c;
  if (disc < 0) return Infinity;
  const s = Math.sqrt(disc);
  if (a > 0) return (b + s) / a;
  // Target escapes faster than we fly: only catchable while it's closing.
  const r1 = (b + s) / a;
  const r2 = (b - s) / a;
  const pos = [r1, r2].filter((r) => r > 0);
  return pos.length ? Math.min(...pos) : Infinity;
}

/** RTH time from P to home with wind vw (home is fixed ⇒ moves at −vw in the air frame). */
export function rthTime(P: Vec, H: Vec, vw: Vec, U: number) {
  return interceptTime(sub(H, P), mul(vw, -1), U);
}

/** θ' from the IA's quadratic. NaN when no positive root exists (|v_eff| ≥ U). */
export function thetaDot(theta: number, r0: number, b: number, veff: Vec, U: number): number {
  const r = r0 + b * theta;
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const wx = b * c - r * s;
  const wy = b * s + r * c;
  const A = wx * wx + wy * wy; // = b² + r²
  const B = 2 * (wx * veff.x + wy * veff.y);
  const C = dot(veff, veff) - U * U;
  const disc = B * B - 4 * A * C;
  if (disc < 0) return NaN;
  const td = (-B + Math.sqrt(disc)) / (2 * A);
  return td > 0 ? td : NaN;
}

function rk4Theta(theta: number, dt: number, r0: number, b: number, veff: Vec, U: number) {
  const k1 = thetaDot(theta, r0, b, veff, U);
  const k2 = thetaDot(theta + (dt / 2) * k1, r0, b, veff, U);
  const k3 = thetaDot(theta + (dt / 2) * k2, r0, b, veff, U);
  const k4 = thetaDot(theta + dt * k3, r0, b, veff, U);
  return theta + (dt / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
}

// ── mission ──────────────────────────────────────────────────────────────

export interface MissionEvent {
  t: number;
  kind: "start" | "takeoff" | "intercept" | "contact" | "bingo" | "rth" | "land" | "warn";
  label: string;
  detail?: string;
  targetId?: string;
}

export interface Mission {
  p: SimParams;
  n: number;
  t: Float64Array;
  x: Float64Array; // ground position
  y: Float64Array;
  dfx: Float64Array; // position relative to the datum (water frame)
  dfy: Float64Array;
  ax: Float32Array; // air velocity
  ay: Float32Array;
  gx: Float32Array; // ground velocity
  gy: Float32Array;
  mode: Uint8Array;
  theta: Float32Array;
  r: Float32Array;
  rth: Float32Array; // time to fly home from here, s
  hdg: Float32Array; // smoothed heading (deg, unwrapped then wrapped)
  bank: Float32Array; // deg, + = right wing down
  pitch: Float32Array; // deg
  turb: Float32Array; // 0..1 turbulence factor for nav-ball wobble
  alt: Float32Array; // m AGL (cosmetic, derived from Rs + FOV)
  // key times
  t1: number; // intercept
  t2: number; // leave spiral
  t3: number; // land
  tEnd: number; // end of timeline
  T: number; // endurance, s
  Tuse: number; // usable endurance (minus reserve), s
  vw: Vec;
  vc: Vec;
  veff: Vec;
  b: number;
  r0: number;
  cruiseAlt: number;
  events: MissionEvent[];
  contacts: { id: string; t: number; i: number }[];
  warnings: string[];
  feasible: boolean;
  bingoReason: "battery" | "contact" | "infeasible" | "none";
  planned: { x: Float32Array; y: Float32Array }; // ideal spiral in the datum frame up to θ(t2)
  thetaEnd: number;
  landPct: number;
}

const HFOV_DEG = 80; // cosmetic: camera FOV used to show ALT = Rs / tan(FOV/2)

export function datumAt(p: SimParams, vc: Vec, t: number): Vec {
  return { x: p.lkp.x + vc.x * t, y: p.lkp.y + vc.y * t };
}

export function simulateMission(p: SimParams): Mission {
  const U = p.U;
  const T = p.enduranceMin * 60;
  const Tuse = T * (1 - p.reservePct / 100);
  const vw = windVec(p);
  const vc = currentVec(p);
  const veff = sub(vc, vw);
  const b = p.Rs / Math.PI;
  const r0 = p.r0k * p.Rs;
  const warnings: string[] = [];
  const events: MissionEvent[] = [];
  let feasible = true;

  if (len(veff) >= U * 0.995) {
    feasible = false;
    warnings.push("Current and wind out-run the drone relative to the water (|v_c − v_wind| ≥ U): no constant-airspeed spiral exists.");
  }
  if (len(vw) >= U * 0.995) warnings.push("Wind ≥ airspeed — the drone cannot make way upwind, RTH may be impossible.");

  // growable buffers (we don't know n ahead of time)
  const cap = Math.ceil((p.delay + T + 60) / DT) + 64;
  const t = new Float64Array(cap);
  const X = new Float64Array(cap);
  const Y = new Float64Array(cap);
  const DX = new Float64Array(cap);
  const DY = new Float64Array(cap);
  const AX = new Float32Array(cap);
  const AY = new Float32Array(cap);
  const GX = new Float32Array(cap);
  const GY = new Float32Array(cap);
  const M = new Uint8Array(cap);
  const TH = new Float32Array(cap);
  const R = new Float32Array(cap);
  const RTH = new Float32Array(cap);
  let n = 0;

  const contacts: Mission["contacts"] = [];
  const found = new Set<string>();

  const push = (tt: number, P: Vec, air: Vec, gnd: Vec, mode: number, th = 0, rr = 0) => {
    if (n >= cap) return;
    const C = datumAt(p, vc, tt);
    t[n] = tt;
    X[n] = P.x;
    Y[n] = P.y;
    DX[n] = P.x - C.x;
    DY[n] = P.y - C.y;
    AX[n] = air.x;
    AY[n] = air.y;
    GX[n] = gnd.x;
    GY[n] = gnd.y;
    M[n] = mode;
    TH[n] = th;
    R[n] = rr;
    RTH[n] = mode === MODE.STANDBY || mode === MODE.LANDED ? 0 : rthTime(P, p.home, vw, U);
    // detections (any airborne phase — the camera never switches off)
    if (mode !== MODE.STANDBY && mode !== MODE.LANDED) {
      for (const tg of p.targets) {
        if (found.has(tg.id)) continue;
        if (Math.hypot(DX[n] - tg.x, DY[n] - tg.y) <= p.Rs) {
          found.add(tg.id);
          contacts.push({ id: tg.id, t: tt, i: n });
          events.push({ t: tt, kind: "contact", label: `Contact · ${tg.label}`, targetId: tg.id });
        }
      }
    }
    n++;
  };

  const H = p.home;
  const zero = v(0, 0);
  events.push({ t: 0, kind: "start", label: "Alert received", detail: "Datum issued at the last known position" });

  // ── standby (on the pad) ──
  let tt = 0;
  while (tt < p.delay - 1e-9) {
    push(tt, H, zero, zero, MODE.STANDBY);
    tt += DT;
  }
  tt = p.delay;
  events.push({ t: p.delay, kind: "takeoff", label: "Takeoff" });

  // ── intercept the spiral's start point S(t) = C(t) + (r0, 0) ──
  const S0 = add(datumAt(p, vc, p.delay), v(r0, 0));
  const tau = interceptTime(sub(S0, H), veff, U);
  let bingoReason: Mission["bingoReason"] = "none";
  let t1 = Infinity;
  let t2 = p.delay;
  let P = { ...H };
  let thetaEnd = 0;

  if (!isFinite(tau)) {
    feasible = false;
    warnings.push("The drifting datum can't be intercepted at this airspeed.");
  }

  const bingoAt = (time: number, pos: Vec) => time - p.delay + rthTime(pos, H, vw, U) >= Tuse;

  let aborted = false;
  if (isFinite(tau)) {
    const vair = mul(add(sub(S0, H), mul(veff, tau)), tau > 0 ? 1 / tau : 0);
    const vg = add(vair, vw);
    const tStart = p.delay;
    const tStop = p.delay + tau;
    while (tt < tStop - 1e-9) {
      P = add(H, mul(vg, tt - tStart));
      if (bingoAt(tt, P)) {
        aborted = true;
        break;
      }
      push(tt, P, vair, vg, MODE.INTERCEPT);
      tt += DT;
    }
    if (!aborted) {
      tt = tStop;
      P = add(H, mul(vg, tau));
      t1 = tStop;
      events.push({ t: t1, kind: "intercept", label: "Intercept · spiral start", detail: `${(len(sub(S0, H)) / 1000).toFixed(2)} km from home at takeoff` });
    } else {
      warnings.push("Bingo before reaching the datum — it's out of range for this battery.");
      events.push({ t: tt, kind: "bingo", label: "Bingo · datum out of range" });
    }
  }

  // ── the spiral ──
  if (isFinite(t1) && feasible) {
    let theta = 0;
    const thetaMax = 4000;
    while (true) {
      const C = datumAt(p, vc, tt);
      const r = r0 + b * theta;
      const c = Math.cos(theta);
      const s = Math.sin(theta);
      P = { x: C.x + r * c, y: C.y + r * s };
      const td = thetaDot(theta, r0, b, veff, U);
      if (!isFinite(td)) {
        warnings.push("No positive θ' root — the spiral can't be held here.");
        bingoReason = "infeasible";
        break;
      }
      const wx = b * c - r * s;
      const wy = b * s + r * c;
      const air = { x: td * wx + veff.x, y: td * wy + veff.y };
      const gnd = { x: td * wx + vc.x, y: td * wy + vc.y };
      if (bingoAt(tt, P)) {
        bingoReason = "battery";
        break;
      }
      const before = contacts.length;
      push(tt, P, air, gnd, MODE.SEARCH, theta, r);
      if (p.stopOnContact && contacts.length > before && contacts.length >= p.targets.length) {
        bingoReason = "contact";
        tt += DT;
        theta = rk4Theta(theta, DT, r0, b, veff, U);
        break;
      }
      if (n >= cap - 8 || theta > thetaMax) break;
      theta = rk4Theta(theta, DT, r0, b, veff, U);
      tt += DT;
    }
    thetaEnd = theta;
    t2 = tt;
    const C = datumAt(p, vc, tt);
    const r = r0 + b * theta;
    P = { x: C.x + r * Math.cos(theta), y: C.y + r * Math.sin(theta) };
    if (bingoReason === "battery") events.push({ t: t2, kind: "bingo", label: "Bingo · leave spiral", detail: "Elapsed + RTH time = usable endurance" });
    else if (bingoReason === "contact") events.push({ t: t2, kind: "rth", label: "All contacts found · RTH" });
    else events.push({ t: t2, kind: "rth", label: "Leave spiral" });
  } else if (!aborted) {
    t2 = tt;
  } else {
    t2 = tt;
    bingoReason = "battery";
  }

  // ── return to home ──
  const tauR = rthTime(P, H, vw, U);
  let t3 = t2;
  if (isFinite(tauR)) {
    const vg = mul(sub(H, P), tauR > 0 ? 1 / tauR : 0);
    const vair = sub(vg, vw);
    const P2 = { ...P };
    const tStart = tt;
    while (tt < tStart + tauR - 1e-9 && n < cap - 4) {
      push(tt, add(P2, mul(vg, tt - tStart)), vair, vg, MODE.RTH);
      tt += DT;
    }
    t3 = tStart + tauR;
    events.push({ t: t3, kind: "land", label: "Landed at home" });
  } else {
    warnings.push("Home can't be reached against this wind.");
    t3 = tt;
  }
  tt = t3;
  // tail: a few seconds on the pad so the playhead can rest
  const tEnd = t3 + 15;
  while (tt <= tEnd && n < cap) {
    push(tt, H, zero, zero, MODE.LANDED);
    tt += DT;
  }

  // ── derived attitude channels ──
  const hdg = new Float32Array(n);
  const bank = new Float32Array(n);
  const pitch = new Float32Array(n);
  const turb = new Float32Array(n);
  const alt = new Float32Array(n);
  const cruiseAlt = p.Rs / Math.tan(((HFOV_DEG / 2) * Math.PI) / 180);

  // unwrapped heading of the air vector (nose direction)
  const raw = new Float64Array(n);
  let prev = 0;
  let lastValid = 0;
  for (let i = 0; i < n; i++) {
    const sp = Math.hypot(AX[i], AY[i]);
    let h = sp > 0.1 ? Math.atan2(AX[i], AY[i]) : lastValid;
    lastValid = h;
    if (i > 0) {
      while (h - prev > Math.PI) h -= 2 * Math.PI;
      while (h - prev < -Math.PI) h += 2 * Math.PI;
    }
    raw[i] = h;
    prev = h;
  }
  // when on the pad, point the nose toward the first leg
  const firstAir = M.findIndex((m) => m === MODE.INTERCEPT || m === MODE.SEARCH);
  if (firstAir > 0) for (let i = 0; i < firstAir; i++) raw[i] = raw[firstAir];
  const smooth = zeroPhase(raw, 0.45);
  for (let i = 0; i < n; i++) hdg[i] = (((smooth[i] * 180) / Math.PI) % 360 + 360) % 360;

  // bank from coordinated turn: tan φ = V·ψ̇ / g
  const bk = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const a = smooth[Math.max(0, i - 1)];
    const c = smooth[Math.min(n - 1, i + 1)];
    const rate = (c - a) / (2 * DT);
    const airborne = M[i] !== MODE.STANDBY && M[i] !== MODE.LANDED;
    bk[i] = airborne ? (Math.atan((U * rate) / G) * 180) / Math.PI : 0;
    bk[i] = Math.max(-62, Math.min(62, bk[i]));
  }
  const bkS = zeroPhase(bk, 0.35);

  // crosswind change → turbulence factor
  const windMag = len(vw);
  const cross = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const hd = (hdg[i] * Math.PI) / 180;
    const nose = { x: Math.sin(hd), y: Math.cos(hd) };
    cross[i] = nose.x * vw.y - nose.y * vw.x; // crosswind component
  }
  const takeoffT = p.delay;
  for (let i = 0; i < n; i++) {
    bank[i] = bkS[i];
    const airborne = M[i] !== MODE.STANDBY && M[i] !== MODE.LANDED;
    const dc = i > 0 && i < n - 1 ? Math.abs(cross[i + 1] - cross[i - 1]) / (2 * DT) : 0;
    turb[i] = airborne ? Math.min(1, 0.12 + windMag / 14 + dc * 0.6) : 0;
    // pitch: load-factor pull in turns + climb/descent near takeoff/landing
    const phi = (Math.abs(bkS[i]) * Math.PI) / 180;
    let pt = airborne ? 2 + 7 * (1 / Math.cos(phi) - 1) : 0;
    const sinceTO = t[i] - takeoffT;
    const toLand = t3 - t[i];
    if (airborne && sinceTO >= 0 && sinceTO < 14) pt += 13 * Math.sin((Math.PI * sinceTO) / 14) ** 0.6;
    if (airborne && toLand >= 0 && toLand < 14) pt -= 9 * Math.sin((Math.PI * toLand) / 14) ** 0.6;
    pitch[i] = Math.min(30, pt);
    // altitude: climb/descend over 14 s
    let a = 0;
    if (airborne) {
      a = cruiseAlt;
      if (sinceTO < 14) a = cruiseAlt * smoothstep(sinceTO / 14);
      if (toLand < 14) a = Math.min(a, cruiseAlt * smoothstep(Math.max(0, toLand) / 14));
    }
    alt[i] = a;
  }

  // planned spiral (ideal, datum frame) — sampled by θ
  const thMax = Math.max(thetaEnd, 0.01);
  const NP = Math.min(4000, Math.max(200, Math.ceil(thMax * 24)));
  const px = new Float32Array(NP + 1);
  const py = new Float32Array(NP + 1);
  for (let k = 0; k <= NP; k++) {
    const th = (thMax * k) / NP;
    const r = r0 + b * th;
    px[k] = r * Math.cos(th);
    py[k] = r * Math.sin(th);
  }

  const used = t3 - p.delay;
  const landPct = Math.max(0, 100 * (1 - used / T));
  events.sort((a, b2) => a.t - b2.t);

  return {
    p,
    n,
    t: t.subarray(0, n),
    x: X.subarray(0, n),
    y: Y.subarray(0, n),
    dfx: DX.subarray(0, n),
    dfy: DY.subarray(0, n),
    ax: AX.subarray(0, n),
    ay: AY.subarray(0, n),
    gx: GX.subarray(0, n),
    gy: GY.subarray(0, n),
    mode: M.subarray(0, n),
    theta: TH.subarray(0, n),
    r: R.subarray(0, n),
    rth: RTH.subarray(0, n),
    hdg,
    bank,
    pitch,
    turb,
    alt,
    t1: isFinite(t1) ? t1 : t2,
    t2,
    t3,
    tEnd,
    T,
    Tuse,
    vw,
    vc,
    veff,
    b,
    r0,
    cruiseAlt,
    events,
    contacts,
    warnings,
    feasible,
    bingoReason,
    planned: { x: px, y: py },
    thetaEnd,
    landPct,
  };
}

function smoothstep(x: number) {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
}

/** Forward-backward exponential smoother (zero phase lag). tau in seconds. */
function zeroPhase(src: ArrayLike<number>, tau: number): Float64Array {
  const n = src.length;
  const out = new Float64Array(n);
  if (!n) return out;
  const a = 1 - Math.exp(-DT / tau);
  let s = src[0];
  for (let i = 0; i < n; i++) {
    s += a * (src[i] - s);
    out[i] = s;
  }
  s = out[n - 1];
  for (let i = n - 1; i >= 0; i--) {
    s += a * (out[i] - s);
    out[i] = s;
  }
  return out;
}

/** Fractional sample index for time t (clamped). */
export function indexAt(m: Mission, time: number): number {
  if (time <= m.t[0]) return 0;
  if (time >= m.t[m.n - 1]) return m.n - 1;
  // samples are (almost) uniform in DT; correct locally
  let i = Math.min(m.n - 2, Math.max(0, Math.floor((time - m.t[0]) / DT)));
  while (i > 0 && m.t[i] > time) i--;
  while (i < m.n - 2 && m.t[i + 1] <= time) i++;
  const span = m.t[i + 1] - m.t[i];
  return i + (span > 0 ? (time - m.t[i]) / span : 0);
}

export function lerpArr(a: ArrayLike<number>, fi: number) {
  const i = Math.floor(fi);
  const f = fi - i;
  if (i >= a.length - 1) return a[a.length - 1];
  return a[i] + (a[i + 1] - a[i]) * f;
}

export function lerpAngle(a: ArrayLike<number>, fi: number) {
  const i = Math.floor(fi);
  const f = fi - i;
  if (i >= a.length - 1) return a[a.length - 1];
  let d = a[i + 1] - a[i];
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return (a[i] + d * f + 360) % 360;
}

// ── coverage grid ────────────────────────────────────────────────────────

/**
 * Coverage painted onto the water (datum frame). Each cell remembers when it
 * was first seen and when it was re-seen on later, distinct passes, so the map
 * can shade overlap and the scrubber can rewind it.
 */
export class Coverage {
  n: number;
  cell: number;
  ox: number; // world (datum-frame) x of cell 0's left edge
  oy: number; // world y of cell 0's bottom edge
  levels: number;
  pass: Float32Array[]; // pass[k][i] = time of the (k+1)th distinct pass
  last: Float32Array;
  count: Uint8Array;
  gap: number;
  constructor(cx: number, cy: number, half: number, n: number, levels = 3, gap = 4) {
    this.n = n;
    this.cell = (2 * half) / n;
    this.ox = cx - half;
    this.oy = cy - half;
    this.levels = levels;
    this.pass = Array.from({ length: levels }, () => new Float32Array(n * n).fill(Infinity));
    this.last = new Float32Array(n * n).fill(-Infinity);
    this.count = new Uint8Array(n * n);
    this.gap = gap;
  }
  stamp(x: number, y: number, R: number, time: number) {
    const { n, cell } = this;
    const gx = (x - this.ox) / cell;
    const gy = (y - this.oy) / cell;
    const rr = R / cell;
    const i0 = Math.max(0, Math.floor(gx - rr));
    const i1 = Math.min(n - 1, Math.ceil(gx + rr));
    const j0 = Math.max(0, Math.floor(gy - rr));
    const j1 = Math.min(n - 1, Math.ceil(gy + rr));
    const r2 = rr * rr;
    for (let j = j0; j <= j1; j++) {
      const dy = j + 0.5 - gy;
      for (let i = i0; i <= i1; i++) {
        const dx = i + 0.5 - gx;
        if (dx * dx + dy * dy > r2) continue;
        const k = j * n + i;
        const c = this.count[k];
        if (c === 0) {
          this.pass[0][k] = time;
          this.count[k] = 1;
        } else if (time - this.last[k] > this.gap && c < this.levels) {
          this.pass[c][k] = time;
          this.count[k] = c + 1;
        }
        this.last[k] = time;
      }
    }
  }
  /** Stamp along a segment so fast/small footprints leave no holes. */
  sweep(x0: number, y0: number, x1: number, y1: number, R: number, ta: number, tb: number) {
    const d = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.max(1, Math.ceil(d / Math.max(0.5, Math.min(R * 0.5, this.cell * 1.5))));
    for (let s = 1; s <= steps; s++) {
      const f = s / steps;
      this.stamp(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, R, ta + (tb - ta) * f);
    }
  }
}

export function coverMission(m: Mission, n = 420): Coverage {
  // only the search phase paints coverage (keeps the grid tight on the spiral)
  let maxR = m.p.Rs;
  for (let i = 0; i < m.n; i++) if (m.mode[i] === MODE.SEARCH) maxR = Math.max(maxR, Math.hypot(m.dfx[i], m.dfy[i]));
  const half = maxR + m.p.Rs * 1.6;
  const gap = Math.max(4, (2 * m.p.Rs) / m.p.U);
  const cov = new Coverage(0, 0, half, n, 3, gap);
  let started = false;
  for (let i = 1; i < m.n; i++) {
    if (m.mode[i] !== MODE.SEARCH) {
      if (started && m.mode[i - 1] === MODE.SEARCH && m.mode[i] === MODE.RTH) {
        // finish the last sliver up to the hand-off
        cov.sweep(m.dfx[i - 1], m.dfy[i - 1], m.dfx[i], m.dfy[i], m.p.Rs, m.t[i - 1], m.t[i]);
      }
      continue;
    }
    if (!started) {
      cov.stamp(m.dfx[i], m.dfy[i], m.p.Rs, m.t[i]);
      started = true;
      continue;
    }
    cov.sweep(m.dfx[i - 1], m.dfy[i - 1], m.dfx[i], m.dfy[i], m.p.Rs, m.t[i - 1], m.t[i]);
  }
  return cov;
}

/** Probability mass of a cell under the circular Gaussian (σ) at the datum. */
export function cellProb(cov: Coverage, i: number, j: number, sigma: number) {
  const x = cov.ox + (i + 0.5) * cov.cell;
  const y = cov.oy + (j + 0.5) * cov.cell;
  const s2 = sigma * sigma;
  return (Math.exp(-(x * x + y * y) / (2 * s2)) / (2 * Math.PI * s2)) * cov.cell * cov.cell;
}

/** Cumulative POD and covered area on a regular time grid. */
export function podCurve(cov: Coverage, sigma: number, t0: number, t1: number, bins = 240) {
  const pod = new Float64Array(bins + 1);
  const area = new Float64Array(bins + 1);
  const dt = (t1 - t0) / bins || 1;
  const p0 = cov.pass[0];
  for (let j = 0; j < cov.n; j++) {
    for (let i = 0; i < cov.n; i++) {
      const k = j * cov.n + i;
      const ft = p0[k];
      if (!isFinite(ft)) continue;
      const b = Math.max(0, Math.min(bins, Math.ceil((ft - t0) / dt)));
      pod[b] += cellProb(cov, i, j, sigma);
      area[b] += cov.cell * cov.cell;
    }
  }
  for (let b = 1; b <= bins; b++) {
    pod[b] += pod[b - 1];
    area[b] += area[b - 1];
  }
  return { pod, area, t0, t1, dt, bins };
}
