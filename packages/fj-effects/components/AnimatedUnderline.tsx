import * as React from "react";
import { useTrigger } from "../motion/useTrigger";
import { useReducedMotion } from "../motion/useReducedMotion";
import type { TriggerMode } from "../motion/types";

export interface AnimatedUnderlineProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  /** When the underline draws in. @default "hover" */
  trigger?: Extract<TriggerMode, "hover" | "inview" | "mount">;
  /** Underline color (FJ token or CSS color). @default var(--accent) */
  color?: string;
  /** Line thickness in px. @default 2 */
  thickness?: number;
  /** Gap below the text baseline in px. @default 2 */
  offset?: number;
  /** Draw duration in ms. @default 320 */
  duration?: number;
  /** Disable the effect (plain text). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — AnimatedUnderline (effect)
 * A restrained underline that draws in from the left on hover or scroll.
 * Safe for docs links and inline emphasis. Reduced motion shows a static
 * underline immediately.
 */
export function AnimatedUnderline({
  children,
  trigger = "hover",
  color = "var(--accent)",
  thickness = 2,
  offset = 2,
  duration = 320,
  disabled = false,
  style,
  ...rest
}: AnimatedUnderlineProps) {
  const reduced = useReducedMotion();
  const { ref, active, bind } = useTrigger(trigger, { once: true, disabled });
  const drawn = disabled || reduced || active;

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      {...bind}
      style={{
        position: "relative",
        display: "inline-block",
        backgroundImage: `linear-gradient(${color}, ${color})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: `0 calc(100% + ${offset}px)`,
        backgroundSize: `${drawn ? 100 : 0}% ${thickness}px`,
        transition: reduced ? "none" : `background-size ${duration}ms var(--ease-out)`,
        paddingBottom: offset + thickness,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
