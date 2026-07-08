import * as React from "react";
import { ensureKeyframes } from "../motion/keyframes";
import { useReducedMotion } from "../motion/useReducedMotion";

ensureKeyframes(
  "fj-shake",
  `@keyframes fj-shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(calc(-1 * var(--fj-shake-amp, 4px))); }
    40% { transform: translateX(var(--fj-shake-amp, 4px)); }
    60% { transform: translateX(calc(-1 * var(--fj-shake-amp, 4px))); }
    80% { transform: translateX(var(--fj-shake-amp, 4px)); }
  }`,
);
ensureKeyframes(
  "fj-warn-pulse",
  `@keyframes fj-warn-pulse {
    0%, 100% { box-shadow: 0 0 0 0 transparent; }
    30% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--warn-500) 40%, transparent); }
  }`,
);

export interface ErrorShakeProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** "error" shakes; "warning" pulses a ring. @default "error" */
  mode?: "error" | "warning";
  /** Controlled: play when this flips to true. */
  active?: boolean;
  /** Shake amplitude in px. @default 4 */
  intensity?: number;
  /** Animation duration in ms. @default 400 */
  duration?: number;
  /** Called when the animation ends. */
  onDone?: () => void;
  /** Disable (children unchanged). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — ErrorShake (effect)
 * A short horizontal shake (error) or a warning-colored pulse, played when
 * `active` flips true — for a rejected form field or a failed action. Under
 * reduced motion it flashes the ring once instead of shaking.
 */
export function ErrorShake({
  children,
  mode = "error",
  active = false,
  intensity = 4,
  duration = 400,
  onDone,
  disabled = false,
  style,
  ...rest
}: ErrorShakeProps) {
  const reduced = useReducedMotion();
  const [playing, setPlaying] = React.useState(false);
  const prev = React.useRef(active);

  React.useEffect(() => {
    if (active && !prev.current && !disabled) setPlaying(true);
    prev.current = active;
  }, [active, disabled]);

  const useShake = mode === "error" && !reduced;
  const animation = playing
    ? useShake
      ? `fj-shake ${duration}ms var(--ease-out)`
      : `fj-warn-pulse ${Math.max(duration, 500)}ms var(--ease-out)`
    : "none";

  return (
    <div
      style={{
        display: "inline-block",
        borderRadius: "inherit",
        ["--fj-shake-amp" as string]: `${intensity}px`,
        animation,
        ...style,
      } as React.CSSProperties}
      onAnimationEnd={(e) => {
        // animationend bubbles — ignore animations finishing inside children.
        if (e.animationName !== "fj-shake" && e.animationName !== "fj-warn-pulse") return;
        setPlaying(false);
        onDone?.();
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
