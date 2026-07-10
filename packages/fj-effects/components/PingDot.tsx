import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";

ensureKeyframes(
  "fj-ping",
  `@keyframes fj-ping {
    from { transform: scale(1); opacity: 0.55; }
    to { transform: scale(2.6); opacity: 0; }
  }`,
);

const CORNERS = {
  "top-right": { top: 0, right: 0, transform: "translate(35%, -35%)" },
  "top-left": { top: 0, left: 0, transform: "translate(-35%, -35%)" },
  "bottom-right": { bottom: 0, right: 0, transform: "translate(35%, 35%)" },
  "bottom-left": { bottom: 0, left: 0, transform: "translate(-35%, 35%)" },
} as const;

export interface PingDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Optional anchor; the dot pins to one of its corners when present. */
  children?: React.ReactNode;
  /** Dot diameter in px. @default 10 */
  size?: number;
  /** Dot color. @default var(--accent) */
  color?: string;
  /** Speed multiplier (period 1800ms / speed). @default 1 */
  speed?: number;
  /** Corner to pin to (with children). @default "top-right" */
  position?: keyof typeof CORNERS;
  /** Accessible label. @default "New activity" */
  label?: string;
  /** Steady dot, no echo. @default false */
  disabled?: boolean;
}

/**
 * Free Joy — PingDot (effect)
 * A notification dot with a radiating echo — "something new here". Pin it to a
 * corner of any anchor, or use it inline. Under reduced motion (or disabled)
 * the echo is not rendered; the solid dot keeps the meaning. For semantic
 * status colors see fj-ui's StatusDot — PingDot is the attention ping.
 */
export function PingDot({
  children,
  size = 10,
  color = "var(--accent)",
  speed = 1,
  position = "top-right",
  label = "New activity",
  disabled = false,
  style,
  ...rest
}: PingDotProps) {
  const reduced = useReducedMotion();
  const echo = !disabled && !reduced;
  const pinned = children != null;

  const cluster = (clusterStyle?: React.CSSProperties, clusterRest?: typeof rest) => (
    <span
      role="status"
      aria-label={label}
      style={{
        position: pinned ? "absolute" : "relative",
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        ...(pinned ? CORNERS[position] : { verticalAlign: "middle" }),
        ...clusterStyle,
      }}
      {...clusterRest}
    >
      {echo && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: color,
            animation: `fj-ping ${1800 / speed}ms var(--ease-out) infinite`,
          }}
        />
      )}
    </span>
  );

  if (!pinned) return cluster(style, rest);

  return (
    <span style={{ position: "relative", display: "inline-block", ...style }} {...rest}>
      {children}
      {cluster()}
    </span>
  );
}
