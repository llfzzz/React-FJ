import * as React from "react";
import { useTrigger } from "../motion/useTrigger";
import { useReducedMotion } from "../motion/useReducedMotion";
import type { TriggerMode } from "../motion/types";

const TONES: Record<string, string> = {
  sun: "var(--sun-200)",
  coral: "var(--joy-100)",
  bloom: "var(--bloom-200)",
};

export interface HighlighterProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  /** Highlight tone. @default "sun" */
  color?: "sun" | "coral" | "bloom" | string;
  /** When the swipe plays. @default "inview" */
  trigger?: Extract<TriggerMode, "inview" | "hover" | "mount">;
  /** Lead-in delay in ms. @default 0 */
  delay?: number;
  /** Swipe duration in ms. @default 480 */
  duration?: number;
  /** Disable (plain text). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — Highlighter (effect)
 * A marker swipe fills in behind text when it scrolls into view — for a single
 * emphasized phrase. Reduced motion shows the highlight already filled.
 */
export function Highlighter({
  children,
  color = "sun",
  trigger = "inview",
  delay = 0,
  duration = 480,
  disabled = false,
  style,
  ...rest
}: HighlighterProps) {
  const reduced = useReducedMotion();
  const { ref, active, bind } = useTrigger(trigger, { once: true, disabled });
  const filled = disabled || reduced || active;
  const tone = TONES[color] || color;

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      {...bind}
      style={{
        position: "relative",
        display: "inline",
        padding: "0.05em 0.15em",
        margin: "0 -0.15em",
        backgroundImage: `linear-gradient(${tone}, ${tone})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        backgroundSize: `${filled ? 100 : 0}% 100%`,
        transition: reduced ? "none" : `background-size ${duration}ms var(--ease-out) ${delay}ms`,
        borderRadius: "var(--radius-xs)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
