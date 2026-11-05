import type { SimParams, Target } from "./engine";

export interface Preset {
  id: string;
  name: string;
  tag: string;
  blurb: string;
  params: SimParams;
}

const T = (id: string, x: number, y: number, kind: Target["kind"], label: string): Target => ({ id, x, y, kind, label });

const base: SimParams = {
  U: 15,
  enduranceMin: 25,
  reservePct: 20,
  delay: 20,
  Rs: 40,
  r0k: 0,
  windSpd: 4,
  windFrom: 250,
  curSpd: 0.8,
  curTo: 120,
  home: { x: -1100, y: -650 },
  lkp: { x: 0, y: 0 },
  sigma: 380,
  stopOnContact: false,
  targets: [],
};

const P = (o: Partial<SimParams>): SimParams => ({ ...base, ...o, home: { ...(o.home ?? base.home) }, lkp: { ...(o.lkp ?? base.lkp) }, targets: (o.targets ?? []).map((t) => ({ ...t })) });

export const PRESETS: Preset[] = [
  {
    id: "paper",
    name: "From the paper",
    tag: "FIG. 12",
    blurb: "The exact inputs behind Figure 12 of the IA: wind (1.2, −2.2), current (2, −1.35), b = 30 m/rad.",
    params: P({
      U: 15,
      enduranceMin: 27,
      reservePct: 10,
      delay: 30,
      Rs: 30 * Math.PI, // b = Rs/π = 30 m/rad
      windSpd: Math.hypot(1.2, -2.2),
      windFrom: (Math.atan2(1.2, -2.2) * 180) / Math.PI + 180,
      curSpd: Math.hypot(2, -1.35),
      curTo: (Math.atan2(2, -1.35) * 180) / Math.PI,
      home: { x: 500, y: -400 },
      lkp: { x: 100, y: 100 },
      sigma: 650,
      targets: [T("p1", 260, -180, "person", "PIW"), T("p2", -520, 410, "raft", "Life raft")],
    }),
  },
  {
    id: "calm",
    name: "Glass-calm bay",
    tag: "BASELINE",
    blurb: "No wind, no current. Every spiral variant collapses into the same clean Archimedean curve.",
    params: P({
      windSpd: 0,
      curSpd: 0,
      home: { x: -800, y: -500 },
      sigma: 360,
      targets: [T("c1", 150, 110, "person", "Swimmer"), T("c2", -260, -330, "debris", "Paddleboard")],
    }),
  },
  {
    id: "rip",
    name: "Rip current",
    tag: "DRIFT",
    blurb: "A 2 m/s rip drags the swimmer offshore. Watch the naive spiral get left behind.",
    params: P({
      U: 14,
      enduranceMin: 22,
      windSpd: 3,
      windFrom: 200,
      curSpd: 2.0,
      curTo: 60,
      home: { x: -500, y: -300 },
      Rs: 35,
      sigma: 300,
      targets: [T("r1", 90, -60, "person", "Swimmer"), T("r2", -150, 220, "person", "Rescuer")],
    }),
  },
  {
    id: "gale",
    name: "Crosswind gale",
    tag: "WIND",
    blurb: "10 m/s crosswind: the drone crabs hard, ground speed swings 5→25 m/s, yet coverage stays perfect.",
    params: P({
      U: 18,
      windSpd: 10,
      windFrom: 290,
      curSpd: 0.6,
      curTo: 150,
      home: { x: -400, y: -1300 },
      Rs: 45,
      sigma: 420,
      targets: [T("g1", -210, 160, "raft", "Life raft"), T("g2", 330, 280, "person", "PIW")],
    }),
  },
  {
    id: "headwind",
    name: "Headwind home",
    tag: "BATTERY",
    blurb: "Easy tailwind out, brutal headwind back. Bingo comes early because RTH is expensive.",
    params: P({
      U: 15,
      enduranceMin: 25,
      windSpd: 8,
      windFrom: 222,
      curSpd: 0.5,
      curTo: 40,
      home: { x: -1400, y: -1500 },
      sigma: 360,
      targets: [T("h1", 240, -90, "person", "PIW")],
    }),
  },
  {
    id: "offshore",
    name: "Far offshore",
    tag: "RANGE",
    blurb: "Datum 4.5 km out. Most of the pack is spent getting there and back — the spiral gets what's left.",
    params: P({
      U: 20,
      enduranceMin: 30,
      reservePct: 15,
      windSpd: 5,
      windFrom: 300,
      curSpd: 1.1,
      curTo: 170,
      home: { x: -3400, y: -2900 },
      Rs: 50,
      sigma: 450,
      targets: [T("o1", -120, -260, "raft", "Life raft")],
    }),
  },
  {
    id: "night",
    name: "Night · thermal",
    tag: "NARROW SWATH",
    blurb: "A thermal camera flies low with a 15 m scan radius: many tight revolutions, high bank at the centre.",
    params: P({
      U: 12,
      enduranceMin: 20,
      Rs: 15,
      windSpd: 2.5,
      windFrom: 20,
      curSpd: 0.5,
      curTo: 250,
      home: { x: -350, y: 420 },
      sigma: 140,
      targets: [T("n1", 45, -30, "person", "PIW"), T("n2", -110, 95, "person", "PIW 2")],
    }),
  },
  {
    id: "debris",
    name: "Debris field",
    tag: "MULTI-CONTACT",
    blurb: "Capsized vessel, scattered survivors. Mission returns home the moment every contact is found.",
    params: P({
      windSpd: 5,
      windFrom: 190,
      curSpd: 1.0,
      curTo: 85,
      home: { x: -900, y: 700 },
      sigma: 420,
      stopOnContact: true,
      targets: [
        T("d1", 35, 20, "debris", "Hull"),
        T("d2", -140, 120, "person", "PIW 1"),
        T("d3", 230, -170, "person", "PIW 2"),
        T("d4", -60, -320, "raft", "Raft"),
        T("d5", 420, 210, "debris", "Cooler"),
      ],
    }),
  },
  {
    id: "fixedwing",
    name: "Long-range fixed-wing",
    tag: "SAILFISH-CLASS",
    blurb: "25 m/s cruise, an hour of endurance and a 70 m swath — a kilometre-wide spiral.",
    params: P({
      U: 25,
      enduranceMin: 55,
      reservePct: 20,
      delay: 45,
      Rs: 70,
      windSpd: 7,
      windFrom: 260,
      curSpd: 1.3,
      curTo: 135,
      home: { x: -2600, y: -1200 },
      sigma: 1000,
      targets: [T("f1", 520, 340, "raft", "Life raft"), T("f2", -880, -150, "person", "PIW")],
    }),
  },
];

export const DEFAULT_PRESET = "gale";
