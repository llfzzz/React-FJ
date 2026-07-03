import { useEffect, useState } from "react";

/**
 * Tracks the user's `prefers-reduced-motion` setting, live.
 *
 * The global CSS kill switch (tokens/base.css) collapses CSS animations and
 * transitions, but it can't stop JavaScript-driven motion — rAF loops, timers,
 * pointer tracking. Every fj-effect that runs such logic reads this hook and
 * renders an explicit static fallback when it returns true.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    // Safari <14 only supports the deprecated addListener signature.
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  return reduced;
}
