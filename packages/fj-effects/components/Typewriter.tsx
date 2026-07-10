import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useTrigger } from "../motion/useTrigger";
import type { TriggerMode } from "../motion/types";

ensureKeyframes(
  "fj-caret",
  `@keyframes fj-caret {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }`,
);

export interface TypewriterProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The string to type. */
  text: string;
  /** ms per character. @default 45 */
  interval?: number;
  /** Lead-in delay in ms before typing starts. @default 0 */
  delay?: number;
  /** Show the blinking caret while typing. @default true */
  caret?: boolean;
  /** When to play. @default "mount" */
  trigger?: Extract<TriggerMode, "mount" | "inview" | "manual">;
  /** Controlled play state for trigger="manual". */
  active?: boolean;
  /** Called when the last character lands (immediately under reduced motion). */
  onDone?: () => void;
  /** Show the full text, no typing. @default false */
  disabled?: boolean;
}

/**
 * Free Joy — Typewriter (effect)
 * Types a string character by character with a blinking caret — hero taglines
 * and playful one-liners. An invisible full-text ghost reserves the final box,
 * so typing never shifts layout. Reduced motion shows the full text instantly.
 */
export function Typewriter({
  text,
  interval = 45,
  delay = 0,
  caret = true,
  trigger = "mount",
  active,
  onDone,
  disabled = false,
  style,
  ...rest
}: TypewriterProps) {
  const reduced = useReducedMotion();
  const { ref, active: on } = useTrigger(trigger, { once: true, active, disabled });
  const [count, setCount] = React.useState(0);
  const onDoneRef = React.useRef(onDone);
  onDoneRef.current = onDone;

  React.useEffect(() => {
    if (disabled) return;
    if (!on) {
      setCount(0);
      return;
    }
    if (reduced) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let tick: ReturnType<typeof setInterval> | undefined;
    const lead = setTimeout(() => {
      tick = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(tick);
            return c;
          }
          return c + 1;
        });
      }, interval);
    }, delay);
    return () => {
      clearTimeout(lead);
      if (tick) clearInterval(tick);
    };
  }, [on, reduced, disabled, text, interval, delay]);

  const done = count >= text.length && text.length > 0;
  React.useEffect(() => {
    if (done && !disabled) onDoneRef.current?.();
  }, [done, disabled]);

  if (disabled || reduced) {
    return (
      <span ref={ref as React.RefObject<HTMLSpanElement>} style={style} {...rest}>
        {text}
      </span>
    );
  }

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      role="text"
      aria-label={text}
      style={{ position: "relative", display: "inline-block", whiteSpace: "pre-wrap", ...style }}
      {...rest}
    >
      {/* Invisible ghost reserves the final box so typing never reflows. */}
      <span aria-hidden="true" style={{ visibility: "hidden" }}>
        {text}
      </span>
      <span aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
        {text.slice(0, count)}
        {caret && on && !done && (
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: "1em",
              verticalAlign: "-0.1em",
              marginLeft: 1,
              background: "currentColor",
              animation: "fj-caret 1s steps(1) infinite",
            }}
          />
        )}
      </span>
    </span>
  );
}
