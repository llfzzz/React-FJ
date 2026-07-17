import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export interface NumberTickerProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The number to display; changing it rolls the digits. */
  value: number;
  /** ms per roll. @default 600 */
  duration?: number;
  /** Minimum digit count, left-padded with 0 so columns don't pop in. @default 0 */
  padTo?: number;
  /** Plain text, no rolling columns. @default false */
  disabled?: boolean;
}

/** "1234.5" → chars, integer part left-padded to `padTo` digits. */
function formatValue(value: number, padTo: number): string {
  const sign = value < 0 ? "-" : "";
  const [int, frac] = String(Math.abs(value)).split(".");
  return sign + int.padStart(padTo, "0") + (frac !== undefined ? `.${frac}` : "");
}

/**
 * Free Joy — NumberTicker (effect)
 * Odometer-style digit columns that roll to the value on change — live stats,
 * scores, counters. (CountUp interpolates a value over time; NumberTicker
 * rolls per-digit columns whenever `value` changes.) The whole value is one
 * accessible label; reduced motion snaps the columns instantly.
 */
export function NumberTicker({
  value,
  duration = 600,
  padTo = 0,
  disabled = false,
  style,
  ...rest
}: NumberTickerProps) {
  const reduced = useReducedMotion();
  const display = formatValue(value, padTo);

  if (disabled) {
    return (
      <span style={style} {...rest}>
        {display}
      </span>
    );
  }

  return (
    <span
      role="text"
      aria-label={String(value)}
      style={{ display: "inline-block", lineHeight: 1, fontVariantNumeric: "tabular-nums", ...style }}
      {...rest}
    >
      <span aria-hidden="true" style={{ display: "inline-flex" }}>
        {Array.from(display).map((ch, i) => {
          // Keyed from the right so the ones column keeps its identity as
          // digit count grows (padTo avoids the pop-in entirely).
          const key = display.length - i;
          if (!/[0-9]/.test(ch)) {
            return (
              <span key={`s${key}`} style={{ display: "inline-block" }}>
                {ch}
              </span>
            );
          }
          return (
            <span key={key} style={{ display: "inline-block", height: "1em", overflow: "hidden" }}>
              <span
                style={{
                  display: "block",
                  transform: `translateY(${-Number(ch)}em)`,
                  transition: reduced ? "none" : `transform ${duration}ms var(--ease-emphasized)`,
                }}
              >
                {DIGITS.map((d) => (
                  <span key={d} style={{ display: "block", height: "1em" }}>
                    {d}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
