// Single source of truth for site copy. Ported verbatim from
// design_handoff_personal_site/sources/data.jsx — do not paraphrase.

export type MetaTuple = { label: string; value: string };

export const SITE = {
  name: "Luc Desautels",
  tagline:
    "My main focus right now is in robotics, however I also rock climb, play fiddle, and have a passion for drone photography.",
  meta: [
    { label: "Currently", value: "Engineering" },
    { label: "Based in", value: "Toronto, Ontario" },
    { label: "Focus", value: "Robotics & Aerospace" },
  ] satisfies MetaTuple[],
  contact: {
    email: "L@desautels.net",
    github: "github.com/lucdesautels",
    linkedin: "linkedin.com/in/lucdesautels",
  },
};

// Until a real resume.pdf lands in /public, the "Résumé" buttons fall back to
// a prefilled mailto request. Swap this to "/resume.pdf" the moment the file
// is uploaded — every call site reads from this constant.
export const RESUME_HREF =
  "mailto:L@desautels.net?subject=Resume%20request&body=Hi%20Luc%20%E2%80%94%20could%20you%20send%20me%20your%20latest%20resume%3F%20Thanks%21";

export type RoboticsSlide = {
  eyebrow: string;
  title: string;
  body: string;
  longBody?: string;
  caption?: string;
  imageLabel: string;
  // Local image (downloaded into /public/placeholders) — if present, the
  // carousel + lightbox render an <img>. Falls back to the diagonal-stripe
  // Placeholder when omitted.
  image?: string;
  extras?: { label: string; image?: string }[];
};
export type RoboticsProgram = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  href: string;
  slides: RoboticsSlide[];
};

export const ROBOTICS: RoboticsProgram[] = [
  {
    eyebrow: "Impactful Robotics",
    title: "Project Sailfish",
    subtitle: "An Altum Robotics initiative.",
    href: "/#sailfish",
    slides: [
      {
        eyebrow: "Quick Info",
        title: "Intro to Sailfish",
        body: "A proof of technology for a low-cost, autonomous marine search and rescue drone. We set out to reduce the time and cost for Coast Guard and volunteer rescue to make first visual contact.",
        longBody: "Project Sailfish is a proof of technology for a low-cost, autonomous marine search and rescue drone. We set out to reduce the time and cost for Coast Guard and volunteer rescue crews to make first visual contact with a person in the water. Three generations of prototypes — each a step closer to a system that any rescue org could fly without a manufacturer in the loop.",
        caption: "Sailfish Gen.3 · field test, Lake Ontario",
        imageLabel: "SAILFISH GEN.3 — HERO",
        image: "/placeholders/sf-0.jpg",
        extras: [
          { label: "TAIL VIEW",   image: "/placeholders/sf-0a.jpg" },
          { label: "AVIONICS BAY", image: "/placeholders/sf-0b.jpg" },
        ],
      },
      {
        eyebrow: "Proof Point",
        title: "Letter from the Airforce Foundation",
        body: "Recognition from the CEO of the Airforce Foundation, endorsed by a Navy Captain who has advised the Chief of Defense Staff.",
        longBody: "The Air Force Foundation's CEO wrote a personal endorsement of Sailfish, co-signed by a retired Navy Captain who has advised the Canadian Chief of Defense Staff. They specifically called out the cost ceiling, the open-source release, and the relevance to volunteer SAR units operating without dedicated air assets.",
        caption: "Endorsement letter · scanned original",
        imageLabel: "AFF LETTER — SCAN",
        image: "/placeholders/sf-1.jpg",
      },
      {
        eyebrow: "Technical",
        title: "My Technical Work",
        body: "Deep experience in mechanical design and simulation, electrical engineering, and software for autonomous systems across three generations of prototypes.",
        longBody: "Across three generations I owned: fuselage CAD and CFRP layup planning; the 5.8 GHz video stack tuned for over-water multipath; a thrust-stand campaign that fed motor/prop selection; and the autonomy loop running spiral-search paths on a Pixhawk + companion compute. Each generation traded weight, range, and complexity differently and the lessons stacked.",
        caption: "Exploded view · CAD generation 3",
        imageLabel: "EXPLODED CAD — GEN.3",
        image: "/placeholders/sf-2.jpg",
        extras: [
          { label: "VTX STACK",           image: "/placeholders/sf-2a.jpg" },
          { label: "WING CARRY-THROUGH",  image: "/placeholders/sf-2b.jpg" },
          { label: "FOAM-CORE FLOAT",     image: "/placeholders/sf-2c.jpg" },
        ],
      },
      {
        eyebrow: "Leadership",
        title: "Leadership and Entrepreneurship",
        body: "Founded and led a team of 6 high school students. Engaged Coast Guard personnel, university professors, and industry experts to shape requirements and direction.",
        longBody: "I founded the project and led a team of 6 high schoolers across two design cycles. I built the relationships that turned this from a school project into something credible: interviews with Coast Guard auxiliary crews, professors at Waterloo and UofT, and industry mentors. The team has shipped peer-reviewed write-ups and won two local engineering awards.",
        caption: "Team standup · Toronto workshop",
        imageLabel: "TEAM PHOTO — STANDUP",
        image: "/placeholders/sf-3.jpg",
      },
      {
        eyebrow: "Volunteering",
        title: "Open Sourced",
        body: "Open sourced the project to share our learnings and enable others working on similar problems in the drone and SAR communities.",
        longBody: "The full design — CAD, firmware, build notes, and the lessons from each generation — is published openly. The goal is for any volunteer SAR unit, university lab, or hobbyist team to be able to pick up where we left off without re-deriving the basics. The repo has been mirrored on a few Coast Guard auxiliary servers.",
        caption: "GitHub repository · public release",
        imageLabel: "OSS REPO — README",
        image: "/placeholders/sf-4.jpg",
      },
    ],
  },
  {
    eyebrow: "Competitive Robotics",
    title: "FIRST® Tech Challenge",
    subtitle: "Team 16366 TFS Robotic Unicorns",
    href: "/#ftc",
    slides: [
      {
        eyebrow: "Quick Info",
        title: "Intro to FTC",
        body: "Five years in FIRST Tech Challenge competitive robotics — two years learning the basics, one doing mechanical-electrical chassis design, and two as a mentor.",
        longBody: "Five years in FIRST Tech Challenge — two years learning the basics on a rookie team, one year owning the mechanical-electrical chassis as a builder, and two years as a mentor on Team 16366. FTC is where I learned to ship under deadline pressure with a rotating cast of teammates, and it's where I figured out I like teaching the craft as much as doing it.",
        caption: "Team 16366 · Ontario Championship 2024",
        imageLabel: "FTC COMP ROBOT — HERO",
        image: "/placeholders/ftc-0.jpg",
        extras: [
          { label: "DRIVETRAIN", image: "/placeholders/ftc-0a.jpg" },
          { label: "ARM SYSTEM", image: "/placeholders/ftc-0b.jpg" },
        ],
      },
      {
        eyebrow: "Proof Point",
        title: "Inspire Award and Worlds",
        body: "Placed #1 in the 2024 FTC Ontario Championships (Inspire Award) and went on to represent Canada at the world championships in Houston, Texas.",
        longBody: "Inspire is FTC's top award — judges across engineering, outreach, and team culture pick one team out of the province. We won it in 2024 and represented Ontario at the world championship in Houston, Texas. That trip was a benchmark: we saw what world-class teams look like and came home with a sharper picture of what's possible.",
        caption: "Inspire Award · Ontario Championship",
        imageLabel: "INSPIRE AWARD — STAGE",
        image: "/placeholders/ftc-1.jpg",
      },
      {
        eyebrow: "Technical",
        title: "My Work on Mechanical",
        body: "Worked on important sub-assemblies including the custom CNC chassis and arm transfer system. Learnt quickly through hands-on projects.",
        longBody: "I owned the CNC chassis plate from concept through fixturing and ops — my first time taking a part all the way from CAD into manufacturing. I also designed the two-stage arm transfer system that gave us a passive deadband and made our autonomous routines a lot more reliable. Both subsystems are documented as build references for the rookie team.",
        caption: "CNC chassis plate · finishing pass",
        imageLabel: "CNC CHASSIS — TOOLPATH",
        image: "/placeholders/ftc-2.jpg",
        extras: [
          { label: "FIXTURING",    image: "/placeholders/ftc-2a.jpg" },
          { label: "ARM TRANSFER", image: "/placeholders/ftc-2b.jpg" },
        ],
      },
      {
        eyebrow: "Leadership",
        title: "Mentoring and Team Building",
        body: "Continued as a mentor giving insights on design and leadership challenges. Teaching peers and writing documentation to transfer skills to younger team members.",
        longBody: "After my competing years I stayed on as a mentor for two seasons. My focus has been writing design and leadership documentation that survives team turnover — onboarding decks, manufacturing checklists, and lessons-learned from past seasons. I want the rookies who join next year to start two months ahead of where I started.",
        caption: "Design review · winter build",
        imageLabel: "MENTOR SESSION — REVIEW",
        image: "/placeholders/ftc-3.jpg",
      },
      {
        eyebrow: "Volunteering",
        title: "Outreach Projects",
        body: "Girl Guide STEM seminars, 3D printer workshops, teaching in grade 5 design club, and curating bilingual self-study STEM resources.",
        longBody: "Outreach is one of the reasons our team wins Inspire. I've run Girl Guide STEM seminars, hands-on 3D printer workshops at the local makerspace, design club sessions for grade 5 students, and I curate a bilingual self-study STEM resource collection that gets shared with families looking for after-school enrichment.",
        caption: "Grade 5 design club · TFS",
        imageLabel: "OUTREACH WORKSHOP — KIDS",
        image: "/placeholders/ftc-4.jpg",
      },
    ],
  },
];

export const VALUES = {
  engineering: {
    label: "What I value in engineering work",
    points: [
      { k: "01", t: "Real constraints",   d: "Cost, weight, time. The constraint is the design." },
      { k: "02", t: "Ship the prototype", d: "First-principles thinking only matters once it flies." },
      { k: "03", t: "Document everything", d: "Future-me and the next person inherit the project." },
    ],
  },
  creative: {
    label: "What I value in a creative & professional environment",
    points: [
      { k: "01", t: "High trust, high tempo",   d: "Move fast, disagree well, ship together." },
      { k: "02", t: "Curiosity over hierarchy", d: "Good ideas can come from the most junior person in the room." },
      { k: "03", t: "Outdoors-adjacent",        d: "I do my best thinking after a long walk or a hard climb." },
    ],
  },
};

export type Item = { standout?: boolean; outlined?: boolean; title: string; body: string; href?: string };
export type Group = { id: string; title: string; items: Item[] };
export type MetaGroup = {
  id: string;
  title: string;
  subtitle: string;
  audiences: string[];
  groups: Group[];
};

export const META_GROUPS: MetaGroup[] = [
  {
    id: "academics",
    title: "Academics",
    subtitle: "School + research",
    audiences: ["Employers", "Co-founders", "Teams"],
    groups: [
      {
        id: "education",
        title: "Education",
        items: [
          { standout: true, title: "TFS & Scholar's Guild", body: "Top 10% of students at TFS, a rigorous bilingual International Baccalaureate high school. Selected for the Scholar's Guild for academics and leadership." },
          { title: "IB Diploma Program", body: "Completed the full IB Diploma Program, focusing on physics, math, and chemistry to build a foundation for engineering." },
          { title: "Bilingual (French)", body: "Since a young age my education has been in French, and I've become bilingual in an English-only family." },
        ],
      },
      {
        id: "research",
        title: "Research",
        items: [
          { title: "5.8 GHz video over open water", body: "Investigated 5.8 GHz digital video transmission over water for drone camera systems — multipath, antenna polarization, and range." },
          { standout: true, title: "Optimized SAR spiral", body: "Modelled the flight path for a search-and-rescue drone with a parametric optimized spiral considering wind drift and ocean current." },
          { title: "Motor & prop efficiency", body: "Efficiency testing on electric drone motors and propellers across a thrust-stand setup, building a usable lookup table for sizing." },
        ],
      },
    ],
  },
  {
    id: "well-rounded",
    title: "Well rounded",
    subtitle: "Outside the lab",
    audiences: ["Co-founders", "Teams", "Friends"],
    groups: [
      {
        id: "sports",
        title: "Sports",
        items: [
          { standout: true, title: "Rock Climbing", body: "Serious about climbing for 4 years. I climb 5.12 on Top-Rope and V6 for Bouldering. I expect to join the UBC climbing team." },
          { title: "Skiing", body: "11 years of skiing with extensive lessons. Level 1 Instructor Certification. I can ski any double black diamond at places like Whistler." },
          { title: "Sailing", body: "Recreational sailing on the coast. A sport I enjoy with friends that requires support and cooperation." },
        ],
      },
      {
        id: "creatives",
        title: "Creatives",
        items: [
          { standout: true, title: "Nature Drone Videography", body: "Exploring landscapes from above through drone photography and videography of natural environments.", href: "/drone-videography" },
          { title: "Violin", body: "10 years of violin in the Celtic and folk fiddle style. I comfortably play 20+ numbers and enjoy jamming with others." },
          { title: "Philosophy", body: "Exploring moral ethics through our school's philosophy club, TOK class, and English coursework." },
          { outlined: true, title: "Web Design", body: "Designing and coding interactive web experiences — this portfolio included — with motion-first layouts and custom scroll-driven animations." },
        ],
      },
      {
        id: "scouts",
        title: "Scouts",
        items: [
          { standout: true, title: "12 years in Scouts", body: "12 years from Beavers at age 5 to Venturer Scout. Scouts is about teamwork, building outdoor skills, discipline, service, loyalty, integrity and kindness." },
          { title: "Chief Scout's Award", body: "Earned the Chief Scout's Award, a designation requiring a volunteer project. I built a community library box." },
          { title: "Duke of Edinburgh", body: "Achieved the Silver Medal with Gold expected after completing the multi-day outdoors challenge." },
        ],
      },
    ],
  },
  {
    id: "experiences",
    title: "Experiences",
    subtitle: "Programs + side quests",
    audiences: ["Teams", "Friends"],
    groups: [
      {
        id: "summer",
        title: "Summer Programs",
        items: [
          { title: "SHAD", body: "Canada-wide STEM enrichment program connecting students from across the country for intensive design challenges." },
          { title: "Waterloo Catalyst", body: "Engineering and entrepreneurship program at the University of Waterloo." },
          { title: "Scouts Jamboree", body: "Large-scale Scouts gathering bringing together members from across the region for outdoor activities and community." },
        ],
      },
      {
        id: "sidequests",
        title: "Side Quests",
        items: [
          { title: "Light suit night skiing", body: "Skiing the bunny hill at night wearing a fully wired EL-suit. Mostly to make other skiers smile." },
          { standout: true, title: "Dance Show MC", body: "Hosted the school dance show. Suit on, jokes prepared, mostly improvised." },
          { title: "Prank Day", body: "Coordinated school-wide prank day. Logistics ran smoother than most of my robotics builds." },
        ],
      },
    ],
  },
];

// Root-relative hrefs so the topbar nav works from any page (engineering,
// 404, etc), not just the homepage. Browsers resolve `/#x` to the homepage
// when not already on it, and just jump to the anchor when already there.
export const DEDICATED_PAGES = [
  { label: "Impactful Robotics",   href: "/#sailfish" },
  { label: "Competitive Robotics", href: "/#ftc" },
  { label: "Drone Videography",    href: "/drone-videography" },
  { label: "More Interests",       href: "/#more" },
];

// Horizontal-scroll TOC tiles. `tone` is the section's background color used
// when it's the dominant section in the pinned viewport; `dark` flips text to
// the light palette while that section is active.
export type TocItem = { tag: string; label: string; h: number; w: number; big?: boolean };
export type TocSection = {
  id: string;
  label: string;
  tone: string;
  dark?: boolean;
  items: TocItem[];
};

export const TOC: TocSection[] = [
  {
    id: "academics",
    label: "Academics",
    tone: "#f1ede3", // same as landing cream
    items: [
      { tag: "EDUCATION", label: "TFS & Scholar's Guild", h: 340, w: 230 },
      { tag: "EDUCATION", label: "IB Diploma Program", h: 240, w: 200 },
      { tag: "RESEARCH",  label: "5.8 GHz over water", h: 300, w: 260, big: true },
      { tag: "RESEARCH",  label: "SAR spiral optimization", h: 220, w: 200 },
      { tag: "RESEARCH",  label: "Motor & prop efficiency", h: 280, w: 210 },
    ],
  },
  {
    id: "robotics",
    label: "Robotics",
    tone: "#161412", // telemetry dark
    dark: true,
    items: [
      { tag: "SAILFISH", label: "Sailfish Gen 3", h: 340, w: 260, big: true },
      { tag: "SAILFISH", label: "Fuselage VTX stack", h: 250, w: 200 },
      { tag: "SAILFISH", label: "Field test, Lake Ontario", h: 280, w: 220 },
      { tag: "FTC",      label: "Ontario Champions 2024", h: 320, w: 240 },
      { tag: "FTC",      label: "CNC chassis plate", h: 230, w: 200 },
      { tag: "FTC",      label: "Arm transfer system", h: 260, w: 210 },
    ],
  },
  {
    id: "wellrounded",
    label: "Well-rounded",
    tone: "#f1ede3",
    items: [
      { tag: "SPORTS",   label: "Lead climb 5.10c", h: 340, w: 230, big: true },
      { tag: "SPORTS",   label: "Whistler, double-black", h: 240, w: 200 },
      { tag: "CREATIVE", label: "Algonquin fog", h: 280, w: 240 },
      { tag: "CREATIVE", label: "Folk fiddle jam", h: 220, w: 200 },
      { tag: "SCOUTS",   label: "La Vérendrye canoe", h: 290, w: 220 },
    ],
  },
  {
    id: "experiences",
    label: "Experiences",
    tone: "#f1ede3",
    items: [
      { tag: "SHAD",      label: "SHAD program", h: 300, w: 240, big: true },
      { tag: "PROGRAM",   label: "Waterloo Catalyst", h: 240, w: 200 },
      { tag: "SIDEQUEST", label: "Light suit ski night", h: 280, w: 210 },
      { tag: "SIDEQUEST", label: "Dance Show MC", h: 230, w: 200 },
    ],
  },
];

export type Subproject = { tag: string; domain: string; label: string; desc: string };
export const SUBPROJECTS: Subproject[] = [
  { tag: "SAILFISH", domain: "MECHANICAL",    label: "Fuselage VTX stack",      desc: "5.8GHz transmitter + camera packed into the nose." },
  { tag: "SAILFISH", domain: "ELECTRICAL",    label: "Tilt-rotor controller",   desc: "4-axis PWM mixer for tilt-thrust transitions." },
  { tag: "SAILFISH", domain: "CAD",           label: "Wing carry-through CAD",  desc: "Carbon spar layup planned via parametric models." },
  { tag: "FTC",      domain: "MANUFACTURING", label: "CNC chassis plate",       desc: "First time taking a part CAD→fixturing→ops." },
  { tag: "FTC",      domain: "MECHANICAL",    label: "Arm transfer system",     desc: "Two-stage transfer with a passive deadband." },
  { tag: "FTC",      domain: "SOFTWARE",      label: "Auto routine pathing",    desc: "Spline-based path planner for autonomous." },
  { tag: "SAILFISH", domain: "MATERIALS",     label: "Foam-core flotation",     desc: "Closed-cell flotation that survived 5 belly landings." },
  { tag: "SAILFISH", domain: "SOFTWARE",      label: "Ground-station UI",       desc: "Telemetry dashboard built on top of Mavlink." },
];

export const DOMAINS = ["ALL", "MECHANICAL", "ELECTRICAL", "CAD", "MANUFACTURING", "MATERIALS", "SOFTWARE"];

// ───────────────────────────────────────────────────────────────────────────
// Full engineering portfolio (dedicated page). Each project has 1–3 tags.
// Tags drive the top-of-page filter. Description shows in the hover detail.
// ───────────────────────────────────────────────────────────────────────────
export type EngTag =
  | "Research"
  | "Mechanical"
  | "Electrical"
  | "Software"
  | "CAD"
  | "Manufacturing"
  | "Materials"
  | "Aero"
  | "Field test"
  | "Open source";

export type EngImage = { src: string; caption: string };
export type EngProject = {
  id: string;
  title: string;
  blurb: string;
  detail: string;
  tags: EngTag[];
  parent?: "Sailfish" | "FTC" | "Standalone";
  year?: string;
  // 1–5 images. The detail-panel carousel + lightbox render these. Each has
  // a caption shown over the image.
  images: EngImage[];
  // Extended write-up shown in the lightbox.
  requirements: string;
  contribution: string;   // "what I did"
  result: string;
};

export const ENG_PROJECTS: EngProject[] = [
  {
    id: "vtx-stack", parent: "Sailfish", year: "2024",
    title: "Fuselage VTX stack",
    blurb: "5.8 GHz video transmitter + analog camera + DC-DC packed into the nose cone, balanced for CG.",
    detail: "An iteration of three nose layouts. The final design buries the VTX heat-sink in the airflow channel, keeps the antenna two wavelengths from the carbon spar, and lets the camera tilt 22° forward without recutting the fuselage.",
    tags: ["Electrical", "Mechanical", "Aero"],
    images: [
      { src: "/placeholders/eng/eng-01.jpg", caption: "VTX + camera stack, nose cone open" },
      { src: "/placeholders/eng/eng-02.jpg", caption: "Heat-sink seated in the airflow channel" },
      { src: "/placeholders/eng/eng-03.jpg", caption: "CG balance check on the bench" },
    ],
    requirements: "Fit a 5.8 GHz VTX, analog camera and DC-DC converter in the nose without shifting CG aft of the spar, and keep the VTX cool through a 20-minute flight.",
    contribution: "Designed three competing nose layouts in CAD, ran a thermal mock-up with a dummy heat load, and picked the layout that ducted cooling air over the heat-sink.",
    result: "Final stack runs ~18°C cooler than the first attempt, holds CG within 4mm of target, and the camera tilt is now a bolt-on change instead of a re-cut.",
  },
  {
    id: "tilt-rotor", parent: "Sailfish", year: "2024",
    title: "Tilt-rotor controller",
    blurb: "4-axis PWM mixer that smooths the transition between hover and forward flight thrust vectoring.",
    detail: "Built on top of a Teensy reading the Pixhawk's PWM bus, the mixer applies a sigmoid blend between hover and forward modes so the pilot never sees a hard mode-switch. Tuned over twelve bench tests before it ever flew.",
    tags: ["Electrical", "Software"],
    images: [
      { src: "/placeholders/eng/eng-04.jpg", caption: "Teensy mixer board, bench harness" },
      { src: "/placeholders/eng/eng-05.jpg", caption: "Transition tuning run, logged" },
    ],
    requirements: "Blend hover and forward-flight thrust vectoring without a jarring mode-switch, using only the existing PWM bus — no autopilot firmware changes allowed.",
    contribution: "Wrote the sigmoid mixing firmware on a Teensy, built a bench harness to replay PWM logs, and tuned the blend curve across twelve test runs.",
    result: "The hover-to-cruise transition is now smooth enough that test pilots stopped noticing it; zero mode-switch upsets across the Gen.3 flight campaign.",
  },
  {
    id: "carry-through", parent: "Sailfish", year: "2024",
    title: "Wing carry-through CAD",
    blurb: "Parametric Solidworks model of the carbon spar carry-through — every dimension is driven by airfoil + payload.",
    detail: "A single design table swaps payload mass, wing span, and root chord and regenerates the carry-through, layup schedule, and CNC fixture in one shot. Saved me roughly two weeks across Gen.2 → Gen.3.",
    tags: ["CAD", "Mechanical", "Materials"],
    images: [
      { src: "/placeholders/eng/eng-06.jpg", caption: "Parametric carry-through, design table open" },
      { src: "/placeholders/eng/eng-07.jpg", caption: "Regenerated CNC fixture from the same model" },
    ],
    requirements: "Make the spar carry-through re-derive itself when payload or wing geometry changes, so a redesign doesn't mean re-drawing the fixture and layup by hand.",
    contribution: "Built the fully parametric Solidworks model with a master design table driving the carry-through, layup schedule and fixture geometry together.",
    result: "A geometry change that used to take two weeks now regenerates in an afternoon — and the fixture can never drift out of sync with the part.",
  },
  {
    id: "cnc-chassis", parent: "FTC", year: "2024",
    title: "CNC chassis plate",
    blurb: "First time taking a part all the way from CAD into fixturing, ops planning, and post-process.",
    detail: "6061 plate, 4mm thick, with weight-relief pockets and dowel holes for stack-up alignment. I learned more from the two scrapped first attempts than the successful third — and wrote the team's first \"how we manufacture a chassis plate\" doc.",
    tags: ["Manufacturing", "Mechanical", "CAD"],
    images: [
      { src: "/placeholders/eng/eng-08.jpg", caption: "Finished 6061 chassis plate" },
      { src: "/placeholders/eng/eng-09.jpg", caption: "Workholding + op planning on the mill" },
      { src: "/placeholders/eng/eng-10.jpg", caption: "Two scrapped first attempts" },
    ],
    requirements: "Produce a flat, light, dimensionally-accurate chassis plate with reliable dowel alignment — and document the process so the next builder can repeat it.",
    contribution: "Owned the part end to end: CAD, weight-relief pockets, fixturing, op order, and the post-process. Wrote the team's first chassis-machining doc.",
    result: "The third plate shipped into competition; the doc cut the team's chassis lead time roughly in half and is still the reference today.",
  },
  {
    id: "arm-transfer", parent: "FTC", year: "2024",
    title: "Arm transfer system",
    blurb: "Two-stage handoff between intake and arm with a passive deadband to absorb mis-timed cycles.",
    detail: "The deadband is a compliant urethane finger that absorbs roughly ±8° of timing slop. Made our autonomous block-cycle reliable enough to ship into competition without a brittle vision-based handshake.",
    tags: ["Mechanical", "Manufacturing"],
    images: [
      { src: "/placeholders/eng/eng-11.jpg", caption: "Two-stage transfer assembly" },
      { src: "/placeholders/eng/eng-12.jpg", caption: "Compliant urethane deadband finger" },
    ],
    requirements: "Hand a game element from intake to arm reliably in autonomous, without depending on a fragile vision-timed handshake.",
    contribution: "Designed the two-stage mechanical handoff and a compliant urethane finger that swallows timing error, then cycle-tested it to failure.",
    result: "Absorbs ±8° of timing slop; autonomous block-cycle reliability went from intermittent to competition-ready without any vision code.",
  },
  {
    id: "auto-pathing", parent: "FTC", year: "2024",
    title: "Auto routine pathing",
    blurb: "Spline-based autonomous path planner — drag points in a tool, get a deployable routine.",
    detail: "A Kotlin tool that lets the drive team author paths visually, exports them as a serialized routine the robot reads at startup. Cut autonomous iteration time from ~30 min per change to ~2 min.",
    tags: ["Software"],
    images: [
      { src: "/placeholders/eng/eng-13.jpg", caption: "Visual path editor, spline control points" },
      { src: "/placeholders/eng/eng-14.jpg", caption: "Exported routine running on the field" },
    ],
    requirements: "Let the drive team change autonomous paths without recompiling robot code or understanding the codebase.",
    contribution: "Built a Kotlin spline editor with drag-able control points that serializes paths the robot loads at startup.",
    result: "Autonomous iteration dropped from ~30 minutes per change to ~2 — the drive team now tunes paths between matches.",
  },
  {
    id: "foam-flotation", parent: "Sailfish", year: "2023",
    title: "Foam-core flotation",
    blurb: "Closed-cell EPP flotation rated to keep the airframe nose-up after a soft water landing.",
    detail: "Two iterations of foam blocks shaped to match the fuselage's lower mold-line, sealed under heat-shrink. Survived five intentional belly-landings on Lake Ontario without water ingress.",
    tags: ["Materials", "Mechanical", "Field test"],
    images: [
      { src: "/placeholders/eng/eng-15.jpg", caption: "Shaped EPP flotation blocks" },
      { src: "/placeholders/eng/eng-16.jpg", caption: "Heat-shrink seal before a water test" },
      { src: "/placeholders/eng/eng-17.jpg", caption: "Belly-landing test, Lake Ontario" },
    ],
    requirements: "Keep the airframe floating nose-up and dry long enough to recover it after an unplanned water landing.",
    contribution: "Shaped two iterations of closed-cell EPP to the fuselage mold-line, sealed them under heat-shrink, and ran the water-landing test campaign.",
    result: "Survived five intentional belly-landings with zero water ingress; the airframe floated nose-up every time, well within the recovery window.",
  },
  {
    id: "groundstation", parent: "Sailfish", year: "2024",
    title: "Ground-station UI",
    blurb: "Mavlink telemetry dashboard with a flight-tape, payload state, and a one-click \"return to launch\".",
    detail: "Tauri + Svelte app that swallows the Mavlink stream and exposes the bits a SAR operator actually wants in one screen. The big red RTL button is wired to a confirmation dialog because I learned that lesson early.",
    tags: ["Software"],
    images: [
      { src: "/placeholders/eng/eng-18.jpg", caption: "Ground-station dashboard in flight" },
      { src: "/placeholders/eng/eng-19.jpg", caption: "Operator running it from the shoreline" },
    ],
    requirements: "Give a non-pilot SAR operator the few telemetry values that matter and a safe, one-action way to bring the aircraft home.",
    contribution: "Built a Tauri + Svelte app over the Mavlink stream, designed the single-screen layout, and gated the RTL action behind a confirm dialog.",
    result: "Operators run the whole mission from one screen; the confirm-gated RTL has caught two accidental presses in field testing.",
  },
  {
    id: "vid-58ghz", parent: "Sailfish", year: "2024",
    title: "5.8 GHz over open water",
    blurb: "Research: characterising 5.8 GHz analog video transmission across multipath-heavy water surface.",
    detail: "Bench-and-field study of multipath fade, antenna polarization, and range with three antenna patterns. Findings shaped the Gen.3 antenna placement and inform the next paper draft.",
    tags: ["Research", "Electrical", "Field test"],
    images: [
      { src: "/placeholders/eng/eng-20.jpg", caption: "Antenna test rig on the water" },
      { src: "/placeholders/eng/eng-21.jpg", caption: "Logged fade vs. range, three patterns" },
    ],
    requirements: "Understand how 5.8 GHz analog video degrades over open water so the Gen.3 antenna can be placed deliberately, not by guesswork.",
    contribution: "Designed the bench-and-field test protocol, measured multipath fade and range across three antenna polarizations, and analysed the logs.",
    result: "Produced a clear fade-vs-range picture that set the Gen.3 antenna placement; the data is the backbone of a paper draft in progress.",
  },
  {
    id: "sar-spiral", parent: "Sailfish", year: "2024",
    title: "Optimized SAR spiral",
    blurb: "Parametric optimised spiral flight path for search-and-rescue, with wind drift + ocean current built in.",
    detail: "Closed-form spiral parameters as a function of search radius, wind vector, and a moving search-object. Implemented as a Mission Planner script the autopilot consumes directly.",
    tags: ["Research", "Software"],
    images: [
      { src: "/placeholders/eng/eng-22.jpg", caption: "Optimised spiral vs. naive search pattern" },
      { src: "/placeholders/eng/eng-23.jpg", caption: "Mission Planner script generating the path" },
    ],
    requirements: "Cover a drifting search area efficiently when both the aircraft and the target are being pushed by wind and current.",
    contribution: "Derived closed-form spiral parameters as a function of search radius, wind and current, and wrote the Mission Planner script that emits the path.",
    result: "The optimised pattern covers a moving search area with noticeably less overlap than a fixed spiral, and the autopilot flies it directly.",
  },
  {
    id: "thrust-stand", parent: "Sailfish", year: "2023",
    title: "Motor + prop efficiency stand",
    blurb: "Custom load-cell rig characterising thrust, current, and efficiency across motor/prop combos.",
    detail: "An Arduino + INA226 + load cell rig logs thrust, current, and RPM into a CSV. Output is a usable lookup table the team consults when sizing propulsion — no more guessing from spec sheets.",
    tags: ["Research", "Electrical", "Mechanical"],
    images: [
      { src: "/placeholders/eng/eng-24.jpg", caption: "Load-cell thrust stand, full rig" },
      { src: "/placeholders/eng/eng-25.jpg", caption: "INA226 current sensing + Arduino logger" },
      { src: "/placeholders/eng/eng-26.jpg", caption: "Efficiency lookup table, plotted" },
    ],
    requirements: "Replace spec-sheet guesswork with measured thrust, current and efficiency data for the motor/prop combos the team actually owns.",
    contribution: "Built the load-cell + INA226 + Arduino rig, wrote the logging firmware, and ran every motor/prop pairing in the parts bin.",
    result: "A measured efficiency lookup table the team now sizes propulsion from — propulsion choices are evidence-based instead of hopeful.",
  },
  {
    id: "battery-pack", parent: "Sailfish", year: "2024",
    title: "Spot-welded 6S Li-ion pack",
    blurb: "Custom 6S2P Li-ion pack with BMS, fused taps, and a hard-mounted XT60 outlet inside the fuselage.",
    detail: "Designed for the Gen.3 endurance flight envelope. The pack runs through a 30A BMS with low-voltage cutoff matched to the autopilot's failsafe threshold, so the bird returns home before cells sag.",
    tags: ["Electrical", "Manufacturing"],
    images: [
      { src: "/placeholders/eng/eng-27.jpg", caption: "Spot-welded 6S2P pack, fused taps" },
      { src: "/placeholders/eng/eng-28.jpg", caption: "BMS wiring + XT60 outlet mounted" },
    ],
    requirements: "Power the Gen.3 endurance envelope safely, with a low-voltage cutoff that triggers the autopilot's return-home before cells are damaged.",
    contribution: "Spec'd and spot-welded the 6S2P pack, added fused balance taps, and matched the 30A BMS cutoff to the autopilot failsafe threshold.",
    result: "The pack delivers the endurance target and the cutoff has brought the aircraft home twice before voltage sag became a problem.",
  },
  {
    id: "wing-cfd", parent: "Sailfish", year: "2024",
    title: "Wing CFD + tuft test",
    blurb: "OpenFOAM run on the Gen.3 wing followed by a tuft test in a borrowed wind tunnel for validation.",
    detail: "Simulation predicted a separation bubble at 12° AOA at our cruise Re. The tuft test confirmed it to within ~1.5°, which was enough trust to set the autopilot's pitch limits with confidence.",
    tags: ["Aero", "Research", "Mechanical"],
    images: [
      { src: "/placeholders/eng/eng-29.jpg", caption: "OpenFOAM pressure field on the wing" },
      { src: "/placeholders/eng/eng-30.jpg", caption: "Tuft test in a borrowed wind tunnel" },
      { src: "/placeholders/eng/eng-31.jpg", caption: "Sim vs. tuft separation, overlaid" },
    ],
    requirements: "Know where the Gen.3 wing stalls before committing autopilot pitch limits — and trust the number enough to fly on it.",
    contribution: "Ran the OpenFOAM simulation, then designed and filmed a tuft test in a borrowed tunnel to validate the predicted separation.",
    result: "Sim and tuft test agreed within ~1.5° AOA; the autopilot pitch limits were set from validated data, not a safety guess.",
  },
  {
    id: "oss-release", parent: "Sailfish", year: "2024",
    title: "Open-source release",
    blurb: "Full Sailfish CAD, firmware, build notes, and lessons published on a permissive license.",
    detail: "Three generations of work, packaged so a volunteer SAR unit or university lab can fork it without re-deriving the basics. Mirrored across multiple Coast Guard auxiliary servers and university labs.",
    tags: ["Open source", "Software"],
    images: [
      { src: "/placeholders/eng/eng-32.jpg", caption: "Public repository — CAD, firmware, build notes" },
    ],
    requirements: "Package three generations of Sailfish work so another team can pick it up without re-deriving everything from scratch.",
    contribution: "Cleaned and documented the CAD, firmware and build notes, wrote the lessons-learned, and published the whole project on a permissive license.",
    result: "The repo has been mirrored across multiple Coast Guard auxiliary servers and university labs — the work outlives the team.",
  },
  {
    id: "el-suit", parent: "Standalone", year: "2023",
    title: "EL-wire light suit",
    blurb: "Wearable EL-wire ski suit with onboard inverter + battery sized for a full evening on the bunny hill.",
    detail: "150ft of EL wire stitched into a ski suit, driven by a custom 12V boost board. Built mostly to make other skiers smile, but it taught me a surprising amount about power budgeting and waterproofing flexible electronics.",
    tags: ["Electrical", "Manufacturing"],
    images: [
      { src: "/placeholders/eng/eng-33.jpg", caption: "EL-wire suit lit up on the hill" },
      { src: "/placeholders/eng/eng-34.jpg", caption: "Custom 12V boost board + battery pocket" },
    ],
    requirements: "Light up a wearable suit brightly enough to be fun, run a whole evening on one battery, and survive snow and motion.",
    contribution: "Stitched 150ft of EL wire into a ski suit and built a custom 12V boost inverter; sealed the electronics against snow.",
    result: "Ran a full evening of night skiing on one charge — and taught me more about power budgeting and waterproofing flex electronics than any class.",
  },
  {
    id: "library-box", parent: "Standalone", year: "2022",
    title: "Community library box",
    blurb: "Outdoor weatherised book-share box built for the Chief Scout's Award community project.",
    detail: "CAD'd, cut, assembled and stained from scratch. Cedar exterior, polycarbonate door, magnetic latch, and a foundation poured to keep it level through a Toronto winter. Still standing two years later.",
    tags: ["Mechanical", "CAD", "Manufacturing"],
    images: [
      { src: "/placeholders/eng/eng-35.jpg", caption: "Finished library box, installed" },
      { src: "/placeholders/eng/eng-36.jpg", caption: "Cedar carcass during assembly" },
      { src: "/placeholders/eng/eng-37.jpg", caption: "Poured foundation, kept level" },
    ],
    requirements: "Build a weatherproof book-share box that survives a Toronto winter and stays level on uneven ground, for the Chief Scout's Award.",
    contribution: "CAD'd the box, cut and assembled the cedar carcass, fit a polycarbonate door and magnetic latch, and poured a level foundation.",
    result: "Still standing and in daily use two years later — books stay dry and the box hasn't shifted through two winters.",
  },
  {
    id: "rookie-docs", parent: "FTC", year: "2024",
    title: "Rookie onboarding docs",
    blurb: "Three-deck onboarding pack covering CAD workflow, machining workflow, and design review etiquette.",
    detail: "Started after our Inspire run because skills kept walking out the door at graduation. The docs cut a new builder's time-to-first-shipped-part from ~6 weeks to ~2.",
    tags: ["Open source"],
    images: [
      { src: "/placeholders/eng/eng-38.jpg", caption: "Onboarding deck — CAD + machining workflow" },
    ],
    requirements: "Stop losing hard-won skills every graduation by getting them out of people's heads and into something a rookie can follow.",
    contribution: "Wrote three onboarding decks — CAD workflow, machining workflow, and design-review etiquette — from how the team actually works.",
    result: "A new builder's time-to-first-shipped-part dropped from ~6 weeks to ~2; the decks are now part of every season's kickoff.",
  },
  {
    id: "stem-bilingual", parent: "Standalone", year: "2024",
    title: "Bilingual STEM resource map",
    blurb: "Curated bilingual EN/FR self-study STEM resources for families and outreach attendees.",
    detail: "A Notion site organising freely-available STEM material in EN and FR by age and subject. Hands out at Girl Guide STEM seminars and 3D-printer workshops; quietly used by a few francophone teachers I know.",
    tags: ["Open source"],
    images: [
      { src: "/placeholders/eng/eng-39.jpg", caption: "Bilingual STEM resource map, by age + subject" },
    ],
    requirements: "Give outreach families a trustworthy, free, bilingual starting point for STEM learning instead of a search-engine guess.",
    contribution: "Curated freely-available EN/FR STEM material and organised it by age and subject into a shareable Notion site.",
    result: "Handed out at Girl Guide seminars and 3D-printer workshops, and quietly adopted by a few francophone teachers.",
  },
  {
    id: "drone-photo", parent: "Standalone", year: "2024",
    title: "Drone photography rig",
    blurb: "Modified consumer drone payload mount for stable RAW capture on landscape shoots.",
    detail: "Replaced the stock camera tray with a vibration-damped CF mount holding a small mirrorless. Used for the landscape work in the photography portion of the site.",
    tags: ["Mechanical", "CAD"],
    images: [
      { src: "/placeholders/eng/eng-40.jpg", caption: "Vibration-damped CF camera mount" },
      { src: "/placeholders/eng/eng-41.jpg", caption: "Mirrorless body fitted to the rig" },
      { src: "/placeholders/eng/eng-42.jpg", caption: "Fog over Algonquin, RAW capture" },
      { src: "/placeholders/eng/eng-43.jpg", caption: "Ridgeline at golden hour" },
      { src: "/placeholders/eng/eng-44.jpg", caption: "Coastline, low pass" },
    ],
    requirements: "Carry a small mirrorless on a consumer drone steadily enough for sharp RAW landscape frames.",
    contribution: "Designed a vibration-damped carbon-fibre mount to replace the stock tray, then test-flew it on real landscape shoots.",
    result: "Sharp hand-graded RAW frames — the rig produced the landscape photography featured elsewhere on this site.",
  },
  {
    id: "fiddle-pickup", parent: "Standalone", year: "2023",
    title: "Violin contact pickup",
    blurb: "Hand-wound piezo + buffered preamp built to amplify a folk fiddle without ruining the tone.",
    detail: "A piezo disc mounted on the bridge feeds a JFET buffer running on a 9V tucked into the chinrest. Sounds dramatically better than the cheap commercial pickup it replaced. Used at three folk jams.",
    tags: ["Electrical"],
    images: [
      { src: "/placeholders/eng/eng-45.jpg", caption: "Piezo + JFET buffer, built up" },
      { src: "/placeholders/eng/eng-46.jpg", caption: "Pickup fitted to the fiddle bridge" },
    ],
    requirements: "Amplify a folk fiddle for live playing without the brittle, quacky tone a cheap pickup adds.",
    contribution: "Built a bridge-mounted piezo with a JFET buffer preamp on a 9V, tuned to keep the instrument's natural voice.",
    result: "Sounds dramatically warmer than the commercial pickup it replaced; gigged at three folk jams without complaint.",
  },
];

export const ENG_TAGS: EngTag[] = [
  "Research", "Mechanical", "Electrical", "Software", "CAD",
  "Manufacturing", "Materials", "Aero", "Field test", "Open source",
];
