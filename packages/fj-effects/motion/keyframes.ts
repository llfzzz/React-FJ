const injected = new Set<string>();

/**
 * Injects a block of keyframes / @property rules into <head> exactly once per
 * name, into a single shared <style data-fj-effects> tag. This improves on the
 * per-instance <style> tags the synced fj-ui effects use: 200 shimmer skeletons
 * share one rule instead of 200 duplicates.
 *
 * No-op without a document (SSR-safe).
 */
export function ensureKeyframes(name: string, css: string): void {
  if (typeof document === "undefined") return;
  if (injected.has(name)) return;
  injected.add(name);

  let styleEl = document.head.querySelector<HTMLStyleElement>("style[data-fj-effects]");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.setAttribute("data-fj-effects", "");
    document.head.appendChild(styleEl);
  }
  styleEl.appendChild(document.createTextNode(css));
}
