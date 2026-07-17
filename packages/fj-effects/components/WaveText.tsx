import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useInView } from "../motion/useInView";
import { useReducedMotion } from "../motion/useReducedMotion";

const KF = "fj-wave-rise";
ensureKeyframes(
  KF,
  `@keyframes ${KF} {
    0%, 100% { transform: none; }
    50% { transform: translateY(calc(var(--fj-wave-distance, 6px) * -1)); }
  }`,
);

export interface WaveTextProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The text to animate, split per character. */
  text: string;
  /** When the wave plays. @default "loop" */
  trigger?: "loop" | "mount" | "inview";
  /** Rise height in px (kept small). @default 6 */
  distance?: number;
  /** ms per character cycle. @default 1200 */
  duration?: number;
  /** ms stagger between adjacent characters. @default 60 */
  stagger?: number;
  /** Plain text, no wave. @default false */
  disabled?: boolean;
}

/**
 * Free Joy — WaveText (effect)
 * Characters take turns rising in a gentle wave — playful hero words and
 * section accents. The full string stays readable as one aria-label; the
 * per-character spans are decoration. Reduced motion renders plain text.
 */
export function WaveText({
  text,
  trigger = "loop",
  distance = 6,
  duration = 1200,
  stagger = 60,
  disabled = false,
  style,
  ...rest
}: WaveTextProps) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLSpanElement>({ once: true, disabled: trigger !== "inview" });

  if (disabled || reduced) {
    return (
      <span ref={ref} style={style} {...rest}>
        {text}
      </span>
    );
  }

  const playing = trigger !== "inview" || inView;

  return (
    <span
      ref={ref}
      role="text"
      aria-label={text}
      style={{ display: "inline-block", ["--fj-wave-distance" as string]: `${distance}px`, ...style } as React.CSSProperties}
      {...rest}
    >
      <span aria-hidden="true">
        {Array.from(text).map((ch, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              animation: playing
                ? `${KF} ${duration}ms var(--ease-in-out) ${i * stagger}ms ${trigger === "loop" ? "infinite" : "1"}`
                : "none",
            }}
          >
            {ch}
          </span>
        ))}
      </span>
    </span>
  );
}
