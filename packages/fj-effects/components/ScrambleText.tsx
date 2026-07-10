import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useTrigger } from "../motion/useTrigger";
import type { TriggerMode } from "../motion/types";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&";
const SHUFFLE_MS = 40; // re-randomize at most this often — calm flicker, low cost

export interface ScrambleTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The string to reveal. */
  text: string;
  /** Full-reveal duration in ms. @default 800 */
  duration?: number;
  /** Characters the scramble draws from. @default A–Z a–z 0–9 #%& */
  charset?: string;
  /** When to play. @default "mount" */
  trigger?: Extract<TriggerMode, "mount" | "inview" | "hover" | "manual">;
  /** Controlled play state for trigger="manual". */
  active?: boolean;
  /** Called when the reveal finishes (immediately under reduced motion). */
  onDone?: () => void;
  /** Show the plain text, no scramble. @default false */
  disabled?: boolean;
}

/**
 * Free Joy — ScrambleText (effect)
 * Reveals a short display string left-to-right out of a churn of random
 * characters — logos, hero words, easter eggs. An invisible ghost reserves the
 * final box so random glyph widths never shift layout. Reduced motion shows
 * the plain text with no churn.
 */
export function ScrambleText({
  text,
  duration = 800,
  charset = CHARSET,
  trigger = "mount",
  active,
  onDone,
  disabled = false,
  style,
  ...rest
}: ScrambleTextProps) {
  const reduced = useReducedMotion();
  const { ref, active: on, bind } = useTrigger(trigger, { once: true, active, disabled });
  const [output, setOutput] = React.useState<string | null>(null);
  const onDoneRef = React.useRef(onDone);
  onDoneRef.current = onDone;

  React.useEffect(() => {
    if (!on || reduced || disabled) {
      setOutput(null);
      if (on && !disabled) onDoneRef.current?.();
      return;
    }
    let raf = 0;
    const start = performance.now();
    let lastShuffle = -Infinity;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      if (p >= 1) {
        setOutput(null);
        onDoneRef.current?.();
        return;
      }
      if (now - lastShuffle >= SHUFFLE_MS) {
        lastShuffle = now;
        const settled = Math.floor(p * text.length);
        let next = text.slice(0, settled);
        for (let i = settled; i < text.length; i += 1) {
          const ch = text[i];
          next += /\s/.test(ch) ? ch : charset[Math.floor(Math.random() * charset.length)];
        }
        setOutput(next);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, reduced, disabled, text, duration, charset]);

  if (disabled || reduced) {
    return (
      <span ref={ref as React.RefObject<HTMLSpanElement>} style={style} {...rest}>
        {text}
      </span>
    );
  }

  return (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      {...bind}
      role="text"
      aria-label={text}
      style={{ position: "relative", display: "inline-block", whiteSpace: "pre-wrap", ...style }}
      {...rest}
    >
      {/* Invisible ghost reserves the final box so random glyphs never reflow. */}
      <span aria-hidden="true" style={{ visibility: "hidden" }}>
        {text}
      </span>
      <span aria-hidden="true" style={{ position: "absolute", inset: 0 }}>
        {output ?? text}
      </span>
    </span>
  );
}
