import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";

const VISIBLE_DEPTHS = 3; // deeper cards park behind the last visible level

export interface CardStackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The cards, top of the deck first. */
  children?: React.ReactNode;
  /** Auto-advance interval in ms; 0 = advance on click/Enter/Space only. @default 0 */
  interval?: number;
  /** Send-to-back travel duration in ms. @default 500 */
  duration?: number;
  /** Vertical offset per depth level in px. @default 10 */
  offset?: number;
  /** Scale step per depth level. @default 0.05 */
  scale?: number;
  /** Static stack — no advancing. @default false */
  disabled?: boolean;
}

/**
 * Free Joy — CardStack (effect)
 * A small deck of stacked cards; activating it flings the top card aside and
 * tucks it in at the back — testimonials, tips, photo piles. Only the top card
 * is exposed to assistive tech. Reduced motion reorders instantly, no fling.
 */
export function CardStack({
  children,
  interval = 0,
  duration = 500,
  offset = 10,
  scale = 0.05,
  disabled = false,
  style,
  ...rest
}: CardStackProps) {
  const reduced = useReducedMotion();
  const items = React.Children.toArray(children);
  const n = items.length;
  const [order, setOrder] = React.useState<number[]>([]);
  const [leaving, setLeaving] = React.useState(false);
  const timeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Stale orders (after children changes) fall back to natural order.
  const depths = order.length === n ? order : items.map((_, i) => i);
  const rotateBack = (o: number[]) => [...o.slice(1), o[0]];

  const advance = React.useCallback(() => {
    if (disabled || n < 2 || timeout.current !== undefined) return;
    if (reduced) {
      setOrder((o) => rotateBack(o.length === n ? o : Array.from({ length: n }, (_, i) => i)));
      return;
    }
    setLeaving(true);
    timeout.current = setTimeout(() => {
      timeout.current = undefined;
      setLeaving(false);
      setOrder((o) => rotateBack(o.length === n ? o : Array.from({ length: n }, (_, i) => i)));
    }, duration);
  }, [disabled, n, reduced, duration]);

  React.useEffect(() => () => clearTimeout(timeout.current), []);

  React.useEffect(() => {
    if (disabled || interval <= 0 || n < 2) return;
    const id = setInterval(advance, interval);
    return () => clearInterval(id);
  }, [disabled, interval, n, advance]);

  return (
    <div
      role="button"
      tabIndex={disabled ? undefined : 0}
      aria-roledescription="card stack"
      onClick={advance}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          advance();
        }
      }}
      style={{ display: "inline-grid", cursor: disabled ? undefined : "pointer", ...style }}
      {...rest}
    >
      {items.map((item, i) => {
        const depth = depths.indexOf(i);
        const level = Math.min(depth, VISIBLE_DEPTHS - 1);
        const top = depth === 0;
        return (
          <div
            key={(React.isValidElement(item) && item.key) || i}
            aria-hidden={!top}
            style={{
              gridArea: "1 / 1",
              zIndex: n - depth,
              pointerEvents: top ? undefined : "none",
              transform:
                leaving && top
                  ? "translateX(45%) rotate(6deg)"
                  : `translateY(${level * offset}px) scale(${1 - level * scale})`,
              opacity: leaving && top ? 0 : 1,
              transformOrigin: "bottom center",
              transition: reduced
                ? "none"
                : `transform ${duration}ms var(--ease-emphasized), opacity ${duration}ms var(--ease-out)`,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
