import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useTrigger } from "../motion/useTrigger";
import type { TriggerMode } from "../motion/types";

const MAX_BLUR = 12; // motion-policy cap on animated blur

export interface BlurRevealProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The text to reveal, split per word. */
  text: string;
  /** When to play. @default "inview" */
  trigger?: Extract<TriggerMode, "inview" | "mount" | "manual">;
  /** Controlled play state for trigger="manual". */
  active?: boolean;
  /** ms per word. @default 480 */
  duration?: number;
  /** ms between words. @default 60 */
  stagger?: number;
  /** Initial blur in px (capped at 12). @default 8 */
  blur?: number;
  /** Vertical travel in px. @default 6 */
  lift?: number;
  /** Play only once. @default true */
  once?: boolean;
  /** Plain text, no reveal. @default false */
  disabled?: boolean;
}

/**
 * Free Joy — BlurReveal (effect)
 * Words sharpen out of a soft blur with a small lift, staggered left to right —
 * an editorial entrance for section titles and hero lines. Blur is hard-capped
 * at 12px. Renders plain text under reduced motion.
 */
export function BlurReveal({
  text,
  trigger = "inview",
  active,
  duration = 480,
  stagger = 60,
  blur = 8,
  lift = 6,
  once = true,
  disabled = false,
  style,
  ...rest
}: BlurRevealProps) {
  const reduced = useReducedMotion();
  const { ref, active: shown } = useTrigger(trigger, { once, active, disabled });
  const effBlur = Math.min(blur, MAX_BLUR);

  if (disabled || reduced) {
    return (
      <span style={style} {...rest}>
        {text}
      </span>
    );
  }

  const units = text.split(/(\s+)/).filter(Boolean);

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      role="text"
      aria-label={text}
      style={{ display: "inline-block", whiteSpace: "pre-wrap", ...style }}
      {...rest}
    >
      {units.map((u, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            opacity: shown ? 1 : 0,
            transform: shown ? "none" : `translateY(${lift}px)`,
            filter: shown ? "none" : `blur(${effBlur}px)`,
            transition: `opacity ${duration}ms var(--ease-out), transform ${duration}ms var(--ease-out), filter ${duration}ms var(--ease-out)`,
            transitionDelay: `${i * stagger}ms`,
          }}
        >
          {u}
        </span>
      ))}
    </span>
  );
}
