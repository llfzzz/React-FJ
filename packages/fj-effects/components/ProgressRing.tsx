import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useTrigger } from "../motion/useTrigger";
import type { TriggerMode } from "../motion/types";

export interface ProgressRingProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Progress 0–100 (clamped). */
  value: number;
  /** Pixel diameter. @default 48 */
  size?: number;
  /** Ring stroke width in px. @default 4 */
  strokeWidth?: number;
  /** Value-arc color. @default var(--accent) */
  color?: string;
  /** Sweep duration in ms. @default 600 */
  duration?: number;
  /** Show the % label in the center. @default false */
  showValue?: boolean;
  /** When to sweep in. @default "mount" */
  trigger?: Extract<TriggerMode, "mount" | "inview" | "manual">;
  /** Controlled play state for trigger="manual". */
  active?: boolean;
  /** Accessible label. @default "Progress" */
  label?: string;
}

/**
 * Free Joy — ProgressRing (effect)
 * A circular progress ring that sweeps to its value — goals, scores, upload
 * completion. Later value changes animate through the same transition, so it
 * works controlled too. Reduced motion renders the final value instantly.
 */
export function ProgressRing({
  value,
  size = 48,
  strokeWidth = 4,
  color = "var(--accent)",
  duration = 600,
  showValue = false,
  trigger = "mount",
  active,
  label = "Progress",
  style,
  ...rest
}: ProgressRingProps) {
  const reduced = useReducedMotion();
  const { ref, active: on } = useTrigger(trigger, { once: true, active });
  const clamped = Math.max(0, Math.min(100, value));
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const shown = reduced || on ? clamped : 0;

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      aria-label={label}
      style={{ display: "inline-flex", position: "relative", width: size, height: size, color, ...style }}
      {...rest}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.15}
          strokeWidth={strokeWidth}
        />
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference * (1 - shown / 100),
              transition: reduced ? "none" : `stroke-dashoffset ${duration}ms var(--ease-out)`,
            }}
          />
        </g>
      </svg>
      {showValue && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            fontSize: Math.max(10, Math.round(size * 0.26)),
            fontWeight: "var(--weight-semibold)" as React.CSSProperties["fontWeight"],
            fontVariantNumeric: "tabular-nums",
            color: "var(--ink-1)",
          }}
        >
          {Math.round(clamped)}%
        </span>
      )}
    </span>
  );
}
