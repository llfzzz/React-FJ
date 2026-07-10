import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";

/**
 * Runs a DOM update (e.g. flipping `data-theme` on <html>) inside a
 * View-Transitions crossfade when the browser supports it and the user hasn't
 * asked for reduced motion. Always applies the update; the transition is
 * progressive enhancement. Wire this into your theme toggle.
 */
export function runThemeTransition(update: () => void): void {
  const start = (document as Document & {
    startViewTransition?: (cb: () => void) => unknown;
  }).startViewTransition;
  const prefersReduced =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || typeof start !== "function") {
    update();
    return;
  }
  start.call(document, update);
}

export interface ThemeTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Crossfade duration in ms. @default 320 */
  duration?: number;
  /** Disable the crossfade (instant swap). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — ThemeTransition (effect)
 * A self-contained demo of the theme-switch crossfade: it toggles `data-theme`
 * on a scoped preview surface and crossfades the old/new looks. In production
 * you call `runThemeTransition()` from your real theme toggle for a full-page
 * View-Transitions crossfade. Instant under reduced motion.
 */
export function ThemeTransition({ children, duration = 320, disabled = false, style, ...rest }: ThemeTransitionProps) {
  const reduced = useReducedMotion();
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  const [fading, setFading] = React.useState(false);
  const instant = disabled || reduced;

  const flip = () => {
    const next = theme === "light" ? "dark" : "light";
    if (instant) {
      setTheme(next);
      return;
    }
    setFading(true);
    // Brief fade-out, swap, fade back in — a scoped stand-in for the API.
    setTimeout(() => {
      setTheme(next);
      setFading(false);
    }, duration / 2);
  };

  return (
    <div
      data-theme={theme}
      onClick={flip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault(); // Space must not scroll the page
          flip();
        }
      }}
      style={{
        cursor: "pointer",
        borderRadius: "var(--radius-lg)",
        background: "var(--bg)",
        color: "var(--text)",
        opacity: fading ? 0 : 1,
        transition: instant ? "none" : `opacity ${duration / 2}ms var(--ease-in-out)`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
