import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useTrigger } from "../motion/useTrigger";
import type { TriggerMode } from "../motion/types";

export interface SuccessCheckProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Pixel diameter. @default 48 */
  size?: number;
  /** Check + ring color. @default var(--success-500) */
  color?: string;
  /** Stroke-draw duration in ms. @default 500 */
  duration?: number;
  /** Show the soft pulsing ring. @default true */
  ring?: boolean;
  /** When to play. @default "mount" */
  trigger?: Extract<TriggerMode, "mount" | "inview" | "manual">;
  /** Controlled play state for trigger="manual". */
  active?: boolean;
  /** Accessible label. @default "Success" */
  label?: string;
}

/**
 * Free Joy — SuccessCheck (effect)
 * An SVG checkmark that draws itself in, with an optional soft ring — for
 * confirmations and completed steps. Reduced motion shows the finished check
 * instantly.
 */
export function SuccessCheck({
  size = 48,
  color = "var(--success-500)",
  duration = 500,
  ring = true,
  trigger = "mount",
  active,
  label = "Success",
  style,
  ...rest
}: SuccessCheckProps) {
  const reduced = useReducedMotion();
  const { ref, active: on } = useTrigger(trigger, { once: true, active });
  const drawn = reduced || on;
  const len = 28; // path length of the checkmark

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      role="img"
      aria-label={label}
      style={{ display: "inline-flex", position: "relative", width: size, height: size, color, ...style }}
      {...rest}
    >
      {ring && drawn && !reduced && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `2px solid ${color}`,
            animation: "fj-check-ring 700ms var(--ease-out) forwards",
          }}
        />
      )}
      <svg width={size} height={size} viewBox="0 0 52 52" aria-hidden="true">
        <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
        <path
          d="M14 27 L23 35 L38 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: len,
            strokeDashoffset: drawn ? 0 : len,
            transition: reduced ? "none" : `stroke-dashoffset ${duration}ms var(--ease-out)`,
          }}
        />
      </svg>
      <style>{`
        @keyframes fj-check-ring {
          from { transform: scale(0.7); opacity: 0.6; }
          to { transform: scale(1.15); opacity: 0; }
        }
      `}</style>
    </span>
  );
}
