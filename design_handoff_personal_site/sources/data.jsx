// Shared content for all three directions of Luc's portfolio.
// Single source of truth so direction files only handle visual treatment.

const SITE = {
  name: "Luc Desautels",
  tagline: "My main focus right now is in robotics, however I also rock climb, play fiddle, and have a passion for drone photography.",
  meta: [
    { label: "Currently", value: "Engineering" },
    { label: "Based in", value: "Toronto, Ontario" },
    { label: "Focus", value: "Robotics & Aerospace" },
  ],
  contact: {
    email: "luc@desautels.net",
    github: "github.com/lucdesautels",
    linkedin: "linkedin.com/in/lucdesautels",
  },
};

// "What I've worked on" — the side-by-side robotics block.
const ROBOTICS = [
  {
    eyebrow: "Impactful Robotics",
    title: "Project Sailfish",
    href: "#sailfish",
    caption: "Sailfish drone, generation 3",
    intro: {
      label: "Intro to Sailfish",
      body: "A proof of technology for a low-cost, autonomous marine search and rescue drone. We set out to reduce the time and cost for Coast Guard and volunteer rescue to make first visual contact.",
    },
    rows: [
      { eyebrow: "Proof Point",   title: "Letter from the Airforce Foundation", body: "Recognition from the CEO of the Airforce Foundation, endorsed by a Navy Captain who has advised the Chief of Defense Staff." },
      { eyebrow: "Technical",     title: "My Technical Work",                   body: "Deep experience in mechanical design and simulation, electrical engineering, and software for autonomous systems across three generations of prototypes." },
      { eyebrow: "Leadership",    title: "Leadership and Entrepreneurship",     body: "Founded and led a team of 6 high school students. Engaged Coast Guard personnel, university professors, and industry experts to shape requirements and direction." },
      { eyebrow: "Volunteering",  title: "Open Sourced",                        body: "Open sourced the project to share our learnings and enable others working on similar problems in the drone and SAR communities." },
    ],
  },
  {
    eyebrow: "Competitive Robotics",
    title: "FTC",
    href: "#ftc",
    caption: "FTC competition robot, Ontario Championship 2024",
    intro: {
      label: "Intro to FTC",
      body: "Five years in FIRST Tech Challenge competitive robotics — two years learning the basics, one doing mechanical-electrical chassis design, and two as a mentor.",
    },
    rows: [
      { eyebrow: "Proof Point",   title: "Inspire Award and Worlds",            body: "Placed #1 in the 2024 FTC Ontario Championships (Inspire Award) and went on to represent Canada at the world championships in Houston, Texas." },
      { eyebrow: "Technical",     title: "My Work on Mechanical",               body: "Worked on important sub-assemblies including the custom CNC chassis and arm transfer system. Learnt quickly through hands-on projects." },
      { eyebrow: "Leadership",    title: "Mentoring and Team Building",         body: "Continued as a mentor giving insights on design and leadership challenges. Teaching peers and writing documentation to transfer skills to younger team members." },
      { eyebrow: "Volunteering",  title: "Outreach Projects",                   body: "Girl Guide STEM seminars, 3D printer workshops, teaching in grade 5 design club, and curating bilingual self-study STEM resources." },
    ],
  },
];

// "What I value" — engineering + creative principles.
const VALUES = {
  engineering: {
    label: "What I value in engineering work",
    points: [
      { k: "01", t: "Real constraints",  d: "Cost, weight, time. The constraint is the design." },
      { k: "02", t: "Ship the prototype", d: "First-principles thinking only matters once it flies." },
      { k: "03", t: "Document everything", d: "Future-me and the next person inherit the project." },
    ],
  },
  creative: {
    label: "What I value in a creative & professional environment",
    points: [
      { k: "01", t: "High trust, high tempo", d: "Move fast, disagree well, ship together." },
      { k: "02", t: "Curiosity over hierarchy", d: "Good ideas can come from the most junior person in the room." },
      { k: "03", t: "Outdoors-adjacent",       d: "I do my best thinking after a long walk or a hard climb." },
    ],
  },
};

// Sections grouped into meta-groups so different audiences can skim.
// "standout" flag = the one that gets bigger / accent / different treatment.
const META_GROUPS = [
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
          { standout: true, title: "5.8 GHz video over open water", body: "Investigated 5.8 GHz digital video transmission over water for drone camera systems — multipath, antenna polarization, and range." },
          { title: "Optimized SAR spiral", body: "Modelled the flight path for a search-and-rescue drone with a parametric optimized spiral considering wind drift and ocean current." },
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
          { standout: true, title: "Nature Drone Videography", body: "Exploring landscapes from above through drone photography and videography of natural environments." },
          { title: "Violin", body: "10 years of violin in the Celtic and folk fiddle style. I comfortably play 20+ numbers and enjoy jamming with others." },
          { title: "Philosophy", body: "Exploring moral ethics through our school's philosophy club, TOK class, and English coursework." },
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
          { standout: true, title: "SHAD", body: "Canada-wide STEM enrichment program connecting students from across the country for intensive design challenges." },
          { title: "Waterloo Catalyst", body: "Engineering and entrepreneurship program at the University of Waterloo." },
          { title: "Scouts Jamboree", body: "Large-scale Scouts gathering bringing together members from across the region for outdoor activities and community." },
        ],
      },
      {
        id: "sidequests",
        title: "Side Quests",
        items: [
          { standout: true, title: "Light suit night skiing", body: "Skiing the bunny hill at night wearing a fully wired EL-suit. Mostly to make other skiers smile." },
          { title: "Dance Show MC", body: "Hosted the school dance show. Suit on, jokes prepared, mostly improvised." },
          { title: "Prank Day", body: "Coordinated school-wide prank day. Logistics ran smoother than most of my robotics builds." },
        ],
      },
    ],
  },
];

// Dedicated pages the user is planning — surfaced as a thin nav across all directions.
const DEDICATED_PAGES = [
  { label: "Impactful Robotics",    href: "#sailfish" },
  { label: "Competitive Robotics",  href: "#ftc" },
  { label: "Drone Videography",     href: "#videography" },
  { label: "More Interests",        href: "#more" },
];

// Horizontal-scroll gallery items (Lando-Norris-style scattered moments).
// Mix of sub-projects (Sailfish/FTC parts) and hobby photography.
const GALLERY = [
  { tag: "SAILFISH",  label: "Fuselage VTX stack",          desc: "Custom camera + 5.8GHz transmitter packed into the fuselage nose. Three iterations." },
  { tag: "SAILFISH",  label: "Tilt-rotor mount, gen 3",     desc: "Carbon-tube tilt-rotor mounts. Printed jigs to keep symmetry under 0.5mm." },
  { tag: "FTC",       label: "CNC chassis plate",           desc: "Custom aluminum CNC chassis — first time taking a part from CAD through fixturing to operating." },
  { tag: "FTC",       label: "Arm transfer system",         desc: "Sub-assembly I owned. Two-stage transfer mechanism with a passive deadband." },
  { tag: "OUTDOORS",  label: "First lead climb",            desc: "Sport lead 5.10c outdoors. Equal parts terror and joy." },
  { tag: "VIDEO",     label: "Fog over Algonquin",          desc: "Early-morning mavic flight. The fog burned off in 11 minutes." },
  { tag: "VIOLIN",    label: "Folk jam, Ottawa Valley",     desc: "Sat in with three older fiddlers. Outclassed; survived." },
  { tag: "SCOUTS",    label: "Backcountry, La Vérendrye",   desc: "5-day canoe trip. Rain for 4 of them." },
];

if (typeof window !== "undefined") {
  Object.assign(window, { SITE, ROBOTICS, VALUES, META_GROUPS, DEDICATED_PAGES, GALLERY });
}
