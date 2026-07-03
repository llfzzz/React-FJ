import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";

export interface RotatingTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The words to cycle through. */
  words: string[];
  /** ms each word stays visible. @default 2000 */
  interval?: number;
  /** Enter/exit style. @default "slide" */
  mode?: "slide" | "fade";
  /** Transition duration in ms. @default 400 */
  duration?: number;
  /** Pause cycling while hovered. @default true */
  pauseOnHover?: boolean;
  /** Show only the first word, no cycling. @default false */
  disabled?: boolean;
}

/**
 * Free Joy — RotatingText (effect)
 * Cycles a slot of words with a gentle slide or fade — "Build something ___".
 * Landing/hero surfaces. Under reduced motion it crossfades instantly and can
 * still advance, but with no travel.
 */
export function RotatingText({
  words,
  interval = 2000,
  mode = "slide",
  duration = 400,
  pauseOnHover = true,
  disabled = false,
  style,
  ...rest
}: RotatingTextProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (disabled || words.length < 2 || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [disabled, words.length, paused, interval]);

  const current = words[disabled ? 0 : index] ?? "";
  const travel = mode === "slide" && !reduced;

  return (
    <span
      style={{ display: "inline-flex", overflow: "hidden", verticalAlign: "bottom", ...style }}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      aria-live="polite"
      {...rest}
    >
      <span
        key={current + index}
        style={{
          display: "inline-block",
          animation: disabled
            ? "none"
            : `fj-rotate-in ${duration}ms var(--ease-emphasized)`,
        }}
      >
        {current}
      </span>
      <style>{`
        @keyframes fj-rotate-in {
          from { opacity: 0; transform: ${travel ? "translateY(100%)" : "none"}; }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </span>
  );
}
