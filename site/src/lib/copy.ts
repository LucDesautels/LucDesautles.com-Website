// Copy text to the clipboard — including on non-secure origins.
//
// `navigator.clipboard` only exists in a *secure context* (https, or
// localhost). Serving the dev site over a plain-http address such as a
// Tailscale IP leaves it `undefined`, so the copy buttons silently did
// nothing. When the async API isn't available we fall back to a hidden
// <textarea> + `document.execCommand("copy")`, which works everywhere as long
// as it runs inside the user's click.

function legacyCopy(text: string): boolean {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.setAttribute("aria-hidden", "true");
  ta.style.cssText =
    "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;";
  document.body.appendChild(ta);

  const sel = document.getSelection();
  const prev = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;

  ta.focus({ preventScroll: true });
  ta.select();
  ta.setSelectionRange(0, text.length);

  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  ta.remove();
  if (sel && prev) {
    sel.removeAllRanges();
    sel.addRange(prev);
  }
  return ok;
}

/** Resolves true if the text reached the clipboard. */
export async function copyText(text: string): Promise<boolean> {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      /* permission denied / not focused — try the legacy path */
    }
  }
  return legacyCopy(text);
}
