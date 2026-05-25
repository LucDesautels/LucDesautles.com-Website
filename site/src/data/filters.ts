// Content filter system. Both the in-hero pill bar and the floating indicator
// share these constants and the applyFilter helper so state stays in sync via
// the body class + a custom event.

export type FilterId = "full" | "eng-acad" | "engineering" | "non-eng";

export interface FilterDef {
  id: FilterId;
  baseLabel: string;       // shown when this filter is NOT active
  selectedLabel: string;   // shown when this filter IS active (adds "only")
  shortLabel: string;      // compact label used in the indicator's switch row
  description: string;     // shown under the indicator's active filter name
  bodyClass: string;       // class added to <body> while filter is active
  jumpTo?: string;         // selector to scroll into view after applying
}

export const FILTERS: FilterDef[] = [
  {
    id: "full",
    baseLabel: "The full picture",
    selectedLabel: "The full picture",
    shortLabel: "Full",
    description: "Everything on the site.",
    bodyClass: "filter-full",
  },
  {
    id: "eng-acad",
    baseLabel: "Engineering & Academics",
    selectedLabel: "Engineering & Academics only",
    shortLabel: "Eng + Acad",
    description: "robotics work, sub-projects, and academics.",
    bodyClass: "filter-eng-acad",
    jumpTo: "#robotics-intro",
  },
  {
    id: "engineering",
    baseLabel: "Engineering only",
    selectedLabel: "Engineering only",
    shortLabel: "Eng",
    description: "robotics work and supporting research.",
    bodyClass: "filter-engineering",
    jumpTo: "#robotics-intro",
  },
  {
    id: "non-eng",
    baseLabel: "Non-engineering only",
    selectedLabel: "Non-engineering only",
    shortLabel: "Non-eng",
    description: "academics, well-rounded, and experiences.",
    bodyClass: "filter-non-eng",
    jumpTo: "#academics",
  },
];

// External link — same target as "Full project grid →" under sub-projects.
export const ENG_PORTFOLIO_HREF = "/engineering";

export const FILTER_EVENT = "luc:filter-change";

export function getFilter(): FilterId {
  if (typeof document === "undefined") return "full";
  return (document.body.dataset.filter as FilterId) || "full";
}

export function applyFilter(id: FilterId) {
  if (typeof document === "undefined") return;
  const body = document.body;
  // Strip any existing filter-* class.
  Array.from(body.classList).forEach((c) => {
    if (c.startsWith("filter-")) body.classList.remove(c);
  });
  const f = FILTERS.find((x) => x.id === id);
  if (!f) return;
  body.classList.add(f.bodyClass);
  body.dataset.filter = id;
  window.dispatchEvent(new CustomEvent(FILTER_EVENT, { detail: { filter: id } }));

  // After the layout has settled, scroll to the relevant section. Prefer
  // Lenis so the jump rides the same easing as wheel scrolls.
  const lenis = (window as unknown as { lenis?: { scrollTo: (t: number | string | HTMLElement, opts?: object) => void } }).lenis;
  if (f.jumpTo) {
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(f.jumpTo!);
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: 0 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  } else if (id === "full") {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
