import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";

ensureKeyframes(
  "fj-marquee",
  `@keyframes fj-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }`,
);

const FADE_MASK = "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)";

export interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The item strip to scroll (logos, tags, quotes). */
  children?: React.ReactNode;
  /** Seconds per loop. @default 24 */
  duration?: number;
  /** Scroll direction. @default "left" */
  direction?: "left" | "right";
  /** Pause while hovered. @default true */
  pauseOnHover?: boolean;
  /** Gap between items in px. @default 24 */
  gap?: number;
  /** Fade the strip out at both edges. @default true */
  fade?: boolean;
  /** Static row, no scrolling. @default false */
  disabled?: boolean;
}

/**
 * Free Joy — Marquee (effect)
 * An infinite, seamless ticker for decorative streams — logo walls, tag clouds.
 * The strip is rendered twice (the clone is aria-hidden and inert) and one
 * composited transform loops the track. Reduced motion renders a single static,
 * readable row with no clone.
 */
export function Marquee({
  children,
  duration = 24,
  direction = "left",
  pauseOnHover = true,
  gap = 24,
  fade = true,
  disabled = false,
  style,
  ...rest
}: MarqueeProps) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = React.useState(false);
  const animate = !disabled && !reduced;

  const group = (clone: boolean) => (
    <div
      aria-hidden={clone || undefined}
      inert={clone || undefined}
      style={{ display: "flex", alignItems: "center", gap, paddingRight: gap, flexShrink: 0 }}
    >
      {children}
    </div>
  );

  return (
    <div
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
      style={{
        overflow: "hidden",
        ...(fade ? { maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK } : {}),
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: animate ? `fj-marquee ${duration}s linear infinite` : "none",
          animationDirection: direction === "right" ? "reverse" : undefined,
          animationPlayState: paused ? "paused" : undefined,
          willChange: animate ? "transform" : undefined,
        }}
      >
        {group(false)}
        {animate && group(true)}
      </div>
    </div>
  );
}
