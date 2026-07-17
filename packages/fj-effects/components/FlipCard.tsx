import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";

export interface FlipCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Face shown at rest. */
  front: React.ReactNode;
  /** Face revealed by the flip. */
  back: React.ReactNode;
  /** What flips the card. @default "hover" */
  trigger?: "hover" | "click";
  /** Flip axis. @default "horizontal" (rotates around Y) */
  direction?: "horizontal" | "vertical";
  /** Flip duration in ms. @default 600 */
  duration?: number;
  /** Show only the front face, no flip. @default false */
  disabled?: boolean;
}

/**
 * Free Joy — FlipCard (effect)
 * A two-faced card that flips in 3D to reveal its back — feature reveals,
 * pricing hovers, playful "about" tiles. Only one face is ever exposed to
 * assistive tech and the tab order. Reduced motion swaps faces instantly.
 */
export function FlipCard({
  front,
  back,
  trigger = "hover",
  direction = "horizontal",
  duration = 600,
  disabled = false,
  style,
  ...rest
}: FlipCardProps) {
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = React.useState(false);
  const rotate = direction === "vertical" ? "rotateX" : "rotateY";

  if (disabled) {
    return (
      <div style={style} {...rest}>
        {front}
      </div>
    );
  }

  const bind: React.HTMLAttributes<HTMLDivElement> =
    trigger === "click"
      ? {
          role: "button",
          tabIndex: 0,
          "aria-pressed": flipped,
          onClick: () => setFlipped((f) => !f),
          onKeyDown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setFlipped((f) => !f);
            }
          },
        }
      : {
          onMouseEnter: () => setFlipped(true),
          onMouseLeave: () => setFlipped(false),
          onFocus: () => setFlipped(true),
          onBlur: () => setFlipped(false),
        };

  // The hidden face stays visible through the first half of the turn, then
  // winks out — unreachable for AT and the tab order, seamless to the eye.
  const face = (hidden: boolean): React.CSSProperties => ({
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    visibility: hidden ? "hidden" : "visible",
    transition: reduced ? "none" : `visibility 0s ${duration / 2}ms`,
  });

  return (
    <div
      style={{ display: "inline-block", perspective: 1000, cursor: trigger === "click" ? "pointer" : undefined, ...style }}
      {...bind}
      {...rest}
    >
      <div
        style={{
          position: "relative",
          transformStyle: "preserve-3d",
          transform: flipped ? `${rotate}(180deg)` : "none",
          transition: reduced ? "none" : `transform ${duration}ms var(--ease-emphasized)`,
        }}
      >
        <div aria-hidden={flipped} style={face(flipped)}>
          {front}
        </div>
        <div aria-hidden={!flipped} style={{ position: "absolute", inset: 0, transform: `${rotate}(180deg)`, ...face(!flipped) }}>
          {back}
        </div>
      </div>
    </div>
  );
}
