// Nav ball: a real orthographic sphere, shaded per pixel, rotated by the
// drone's heading / pitch / bank. Per-pixel keeps it perfectly smooth at any
// attitude (no polygon popping), and it's only ~150×150 so it's cheap.

const D2R = Math.PI / 180;

export class NavBall {
  private ctx: CanvasRenderingContext2D;
  private img: ImageData | null = null;
  private size = 0;
  private dpr = 1;
  private last = { h: NaN, p: NaN, b: NaN };

  constructor(private canvas: HTMLCanvasElement) {
    this.ctx = canvas.getContext("2d")!;
  }

  private resize() {
    const css = this.canvas.clientWidth || 150;
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    const px = Math.round(css * this.dpr);
    if (px !== this.size) {
      this.size = px;
      this.canvas.width = px;
      this.canvas.height = px;
      this.img = this.ctx.createImageData(px, px);
      this.last.h = NaN;
    }
  }

  /** heading/pitch/bank in degrees (bank + = right wing down). */
  draw(hdg: number, pitch: number, bank: number, bankLimit = 45) {
    this.resize();
    if (Math.abs(hdg - this.last.h) < 0.05 && Math.abs(pitch - this.last.p) < 0.03 && Math.abs(bank - this.last.b) < 0.03) return;
    this.last = { h: hdg, p: pitch, b: bank };
    const ctx = this.ctx;
    const S = this.size;
    const img = this.img!;
    const data = img.data;
    const R = S / 2 - 6 * this.dpr; // leave room for the bezel
    const cx = S / 2;
    const cy = S / 2;

    // body axes in world (E, N, U)
    const ps = Math.sin(pitch * D2R), pc = Math.cos(pitch * D2R);
    const bs = Math.sin(bank * D2R), bc = Math.cos(bank * D2R);
    const hs = Math.sin(hdg * D2R), hc = Math.cos(hdg * D2R);
    // start: fwd=N, right=E, up=U ; roll about fwd, pitch about right, yaw about U
    // after roll
    let rE = bc, rN = 0, rU = -bs; // right
    let uE = bs, uN = 0, uU = bc; // up
    let fE = 0, fN = 1, fU = 0; // fwd
    // pitch: fwd' = c·fwd + s·up ; up' = −s·fwd + c·up
    const f2E = pc * fE + ps * uE, f2N = pc * fN + ps * uN, f2U = pc * fU + ps * uU;
    const u2E = -ps * fE + pc * uE, u2N = -ps * fN + pc * uN, u2U = -ps * fU + pc * uU;
    fE = f2E; fN = f2N; fU = f2U; uE = u2E; uN = u2N; uU = u2U;
    // yaw (clockwise bearing): e' = e·cos + n·sin ; n' = −e·sin + n·cos
    const yaw = (e: number, n: number): [number, number] => [e * hc + n * hs, -e * hs + n * hc];
    [fE, fN] = yaw(fE, fN);
    [rE, rN] = yaw(rE, rN);
    [uE, uN] = yaw(uE, uN);

    const lineW = 0.012;
    for (let py = 0; py < S; py++) {
      const v = -(py + 0.5 - cy) / R;
      for (let px = 0; px < S; px++) {
        const u = (px + 0.5 - cx) / R;
        const o = (py * S + px) * 4;
        const rr = u * u + v * v;
        if (rr > 1) {
          data[o + 3] = 0;
          continue;
        }
        const z = Math.sqrt(1 - rr);
        // world direction of this point on the ball
        const dE = fE * z + rE * u + uE * v;
        const dN = fN * z + rN * u + uN * v;
        const dU = fU * z + rU * u + uU * v;
        const lat = Math.asin(Math.max(-1, Math.min(1, dU))); // rad
        const lon = Math.atan2(dE, dN);
        const sky = dU >= 0;
        // base colours
        let r: number, g: number, b: number;
        if (sky) {
          const k = Math.min(1, lat / 1.2);
          r = 38 + 20 * (1 - k);
          g = 104 + 40 * (1 - k);
          b = 158 + 40 * (1 - k);
        } else {
          const k = Math.min(1, -lat / 1.2);
          r = 150 - 50 * k;
          g = 84 - 30 * k;
          b = 42 - 16 * k;
        }
        // grid: parallels every 10°, meridians every 30°
        const latDeg = lat / D2R;
        const pDist = Math.abs(latDeg - Math.round(latDeg / 10) * 10) * D2R;
        const cosLat = Math.max(0.05, Math.cos(lat));
        const mStep = 30 * D2R;
        const mDist = Math.abs(lon - Math.round(lon / mStep) * mStep) * cosLat;
        let line = 0;
        if (Math.abs(latDeg) < 85) {
          line = Math.max(line, 1 - smooth(pDist / lineW));
          line = Math.max(line, 0.8 * (1 - smooth(mDist / lineW)));
        }
        const horizon = 1 - smooth(Math.abs(lat) / (lineW * 1.6));
        r += (235 - r) * line * 0.55;
        g += (240 - g) * line * 0.55;
        b += (235 - b) * line * 0.55;
        r += (255 - r) * horizon;
        g += (255 - g) * horizon;
        b += (255 - b) * horizon;
        // lighting: soft lambert + rim darkening + specular glint
        const lam = 0.45 + 0.55 * z;
        const spec = Math.pow(Math.max(0, -0.35 * u + 0.45 * v + 0.82 * z), 28) * 70;
        r = r * lam + spec;
        g = g * lam + spec;
        b = b * lam + spec;
        // anti-aliased edge
        const edge = Math.min(1, (1 - Math.sqrt(rr)) * R * 0.9);
        data[o] = r;
        data[o + 1] = g;
        data[o + 2] = b;
        data[o + 3] = 255 * edge;
      }
    }
    ctx.clearRect(0, 0, S, S);
    ctx.putImageData(img, 0, 0);

    // projected labels: headings on the horizon, pitch numbers on the nose meridian
    const project = (latD: number, lonD: number) => {
      const la = latD * D2R, lo = lonD * D2R;
      const wE = Math.cos(la) * Math.sin(lo), wN = Math.cos(la) * Math.cos(lo), wU = Math.sin(la);
      const zz = wE * fE + wN * fN + wU * fU;
      const uu = wE * rE + wN * rN + wU * rU;
      const vv = wE * uE + wN * uN + wU * uU;
      return { x: cx + uu * R, y: cy - vv * R, z: zz };
    };
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `600 ${10 * this.dpr}px "JetBrains Mono", monospace`;
    const names: Record<number, string> = { 0: "N", 90: "E", 180: "S", 270: "W" };
    for (let lo = 0; lo < 360; lo += 30) {
      const p = project(4.5, lo);
      if (p.z < 0.15) continue;
      ctx.globalAlpha = Math.min(1, (p.z - 0.15) * 2.4);
      ctx.fillStyle = names[lo] ? "#ffffff" : "rgba(255,255,255,0.75)";
      ctx.fillText(names[lo] ?? String(lo / 10).padStart(2, "0"), p.x, p.y);
    }
    ctx.font = `500 ${8 * this.dpr}px "JetBrains Mono", monospace`;
    for (let la = -60; la <= 60; la += 20) {
      if (la === 0) continue;
      const p = project(la, hdg + 12);
      if (p.z < 0.2) continue;
      ctx.globalAlpha = Math.min(0.85, (p.z - 0.2) * 2);
      ctx.fillStyle = "#fff";
      ctx.fillText(String(Math.abs(la)), p.x, p.y);
    }
    ctx.restore();

    // bezel + bank scale
    ctx.save();
    ctx.translate(cx, cy);
    ctx.lineWidth = 1.2 * this.dpr;
    ctx.strokeStyle = "rgba(190,230,235,0.35)";
    ctx.beginPath();
    ctx.arc(0, 0, R + 0.5 * this.dpr, 0, Math.PI * 2);
    ctx.stroke();
    const ticks = [0, 10, 20, 30, 45, 60];
    for (const tk of ticks) {
      for (const sgn of tk === 0 ? [1] : [-1, 1]) {
        const a = (-90 + sgn * tk) * D2R;
        const big = tk === 0 || tk === 30 || tk === 60;
        const r1 = R + 1.5 * this.dpr;
        const r2 = R + (big ? 6 : 4) * this.dpr;
        ctx.strokeStyle = tk >= bankLimit ? "rgba(255,93,93,0.9)" : "rgba(238,243,241,0.75)";
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
        ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
        ctx.stroke();
      }
    }
    // bank pointer (rotates with the horizon)
    ctx.save();
    ctx.rotate(-bank * D2R);
    ctx.fillStyle = Math.abs(bank) > bankLimit ? "#ff5d5d" : "#e9692f";
    ctx.beginPath();
    ctx.moveTo(0, -R + 1 * this.dpr);
    ctx.lineTo(-5 * this.dpr, -R + 9 * this.dpr);
    ctx.lineTo(5 * this.dpr, -R + 9 * this.dpr);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // fixed aircraft symbol
    const w = R * 0.42;
    ctx.strokeStyle = "#0b0f10";
    ctx.lineWidth = 5 * this.dpr;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const sym = () => {
      ctx.beginPath();
      ctx.moveTo(-w, 0);
      ctx.lineTo(-w * 0.35, 0);
      ctx.lineTo(-w * 0.16, w * 0.2);
      ctx.lineTo(0, 0);
      ctx.lineTo(w * 0.16, w * 0.2);
      ctx.lineTo(w * 0.35, 0);
      ctx.lineTo(w, 0);
      ctx.stroke();
    };
    sym();
    ctx.strokeStyle = "#ffb547";
    ctx.lineWidth = 2.4 * this.dpr;
    sym();
    ctx.fillStyle = "#ffb547";
    ctx.beginPath();
    ctx.arc(0, 0, 2.2 * this.dpr, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function smooth(x: number) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  return x * x * (3 - 2 * x);
}
