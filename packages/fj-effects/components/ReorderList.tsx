import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";

export interface ReorderListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The items; each child needs a stable key for FLIP tracking. */
  children?: React.ReactNode;
  /** ms per position transition. @default 400 */
  duration?: number;
  /** Reorder instantly, no travel. @default false */
  disabled?: boolean;
}

/**
 * Free Joy — ReorderList (effect)
 * When the order of its children changes, each item glides from its old spot
 * to the new one (the FLIP technique) — sorted tables, ranked lists, filters.
 * The DOM order is always the real order; transforms only bridge the move.
 * Reduced motion snaps items to their new positions.
 */
export function ReorderList({ children, duration = 400, disabled = false, style, ...rest }: ReorderListProps) {
  const reduced = useReducedMotion();
  const itemRefs = React.useRef(new Map<React.Key, HTMLDivElement>());
  const prevRects = React.useRef(new Map<React.Key, DOMRect>());
  const items = React.Children.toArray(children).filter(React.isValidElement);

  React.useLayoutEffect(() => {
    const next = new Map<React.Key, DOMRect>();
    itemRefs.current.forEach((el, key) => next.set(key, el.getBoundingClientRect()));
    if (!reduced && !disabled) {
      itemRefs.current.forEach((el, key) => {
        const from = prevRects.current.get(key);
        const to = next.get(key);
        if (!from || !to) return;
        const dx = from.left - to.left;
        const dy = from.top - to.top;
        if (dx === 0 && dy === 0) return;
        // Invert to the old position, then let the transition play it back.
        el.style.transition = "none";
        el.style.transform = `translate(${dx}px, ${dy}px)`;
        void el.offsetWidth; // flush, so the transition below starts from the inverted spot
        el.style.transition = `transform ${duration}ms var(--ease-emphasized)`;
        el.style.transform = "";
      });
    }
    prevRects.current = next;
  });

  return (
    <div style={style} {...rest}>
      {items.map((item) => {
        const key = item.key ?? "";
        return (
          <div
            key={key}
            ref={(el) => {
              if (el) itemRefs.current.set(key, el);
              else itemRefs.current.delete(key);
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
