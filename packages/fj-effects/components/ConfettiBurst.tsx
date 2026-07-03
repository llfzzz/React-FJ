import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";
import type { PerformanceMode } from "../motion/types";

const CAP = 40; // hard cap on pieces

export interface ConfettiBurstProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  /** How the burst fires. @default "click" */
  trigger?: "click" | "mount" | "manual";
  /** Controlled fire for trigger="manual" (fires on false→true). */
  active?: boolean;
  /** Piece count (capped at 40; "lite" caps at 20). @default 28 */
  count?: number;
  /** Piece colors (FJ tokens or CSS colors). @default coral/sun/bloom/success */
  colors?: string[];
  /** Spread radius in px. @default 90 */
  spread?: number;
  /** Fall duration in ms. @default 900 */
  duration?: number;
  /** "lite" caps the piece count at 20. @default "full" */
  performance?: PerformanceMode;
  /** Called when the burst finishes. */
  onDone?: () => void;
}

interface Piece {
  dx: number;
  dy: number;
  rot: number;
  color: string;
  size: number;
}

/**
 * Free Joy — ConfettiBurst (effect)
 * A one-shot celebration burst for success moments — a completed onboarding, a
 * published mix. Pieces are capped, auto-clean after the fall, and are entirely
 * suppressed under reduced motion (the children still render and fire onDone).
 */
export function ConfettiBurst({
  children,
  trigger = "click",
  active = false,
  count = 28,
  colors = ["var(--joy-500)", "var(--sun-500)", "var(--bloom-500)", "var(--success-500)"],
  spread = 90,
  duration = 900,
  performance = "full",
  onDone,
  style,
  ...rest
}: ConfettiBurstProps) {
  const reduced = useReducedMotion();
  const [burstId, setBurstId] = React.useState<number | null>(null);
  const prevActive = React.useRef(active);
  const n = Math.min(performance === "lite" ? 20 : CAP, Math.max(0, count));

  const fire = React.useCallback(() => {
    if (reduced) {
      onDone?.();
      return;
    }
    setBurstId(Date.now());
  }, [reduced, onDone]);

  // mount trigger
  React.useEffect(() => {
    if (trigger === "mount") fire();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // manual trigger (false → true)
  React.useEffect(() => {
    if (trigger === "manual" && active && !prevActive.current) fire();
    prevActive.current = active;
  }, [active, trigger, fire]);

  const pieces = React.useMemo<Piece[]>(() => {
    if (burstId === null) return [];
    return Array.from({ length: n }, () => {
      const angle = Math.random() * Math.PI * 2;
      const dist = spread * (0.4 + Math.random() * 0.6);
      return {
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - spread * 0.4,
        rot: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 6 + Math.random() * 4,
      };
    });
  }, [burstId, n, spread, colors]);

  return (
    <span
      onClick={() => trigger === "click" && fire()}
      style={{ position: "relative", display: "inline-block", ...style }}
      {...rest}
    >
      {children}
      {burstId !== null && (
        <span aria-hidden="true" key={burstId} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {pieces.map((p, i) => (
            <span
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: p.size,
                height: p.size * 0.6,
                background: p.color,
                borderRadius: 1,
                ["--fj-dx" as string]: `${p.dx}px`,
                ["--fj-dy" as string]: `${p.dy}px`,
                ["--fj-rot" as string]: `${p.rot}deg`,
                animation: `fj-confetti ${duration}ms var(--ease-out) forwards`,
              } as React.CSSProperties}
              onAnimationEnd={i === 0 ? () => { setBurstId(null); onDone?.(); } : undefined}
            />
          ))}
        </span>
      )}
      <style>{`
        @keyframes fj-confetti {
          0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--fj-dx)), calc(-50% + var(--fj-dy) + 60px)) rotate(var(--fj-rot)); opacity: 0; }
        }
      `}</style>
    </span>
  );
}
