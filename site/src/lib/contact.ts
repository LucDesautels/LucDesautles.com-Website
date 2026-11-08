// Shared contact helpers (safe to import from both Astro frontmatter and
// browser scripts).
//
// The address is shipped to the page *encoded* (reversed + base64) and only
// decoded in the browser, so a naive scraper reading the HTML never sees a
// plain `name@domain` string. It's obfuscation, not encryption.

export const encodeObf = (s: string): string => btoa(s.split("").reverse().join(""));
export const decodeObf = (e: string): string => atob(e).split("").reverse().join("");

/** The subject the secure-contact procedure requires (see /contact). */
export const SECURE_SUBJECT = "Secured Contact Request";

const DRAFT_BODY = "Hello Luc,\n\nI was looking at your website and wanted to get in touch about ";

/** mailto: link (no subject) with a starter body. */
export function mailtoHref(address: string, body: string = DRAFT_BODY): string {
  return `mailto:${address}?body=${encodeURIComponent(body)}`;
}

/** Starter text, also used to pre-fill the contact form. */
export const DRAFT_TEXT = DRAFT_BODY;

/** Fill every `[data-obf]` element's text with its decoded value. */
export function fillObf(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>("[data-obf]").forEach((el) => {
    try {
      el.textContent = decodeObf(el.dataset.obf!);
    } catch {
      /* leave the placeholder */
    }
  });
}
