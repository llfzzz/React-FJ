import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";
import type { EasingToken } from "../motion/types";
import { easeVar } from "../motion/types";

export interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Whether the content is expanded. */
  open: boolean;
  /** Transition duration in ms. @default 280 */
  duration?: number;
  /** Easing token. @default "out" */
  easing?: EasingToken;
  /** Remove children from the DOM when closed. @default false */
  unmountOnExit?: boolean;
}

/**
 * Free Joy — Collapse (effect)
 * Smoothly expands/collapses to its content's natural height — accordions,
 * "show more", filter panels. Animates max-height/opacity only. Under reduced
 * motion it snaps open/closed with no travel.
 */
export function Collapse({ children, open, duration = 280, easing = "out", unmountOnExit = false, style, ...rest }: CollapseProps) {
  const reduced = useReducedMotion();
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | undefined>(open ? undefined : 0);
  // When unmountOnExit is off, children always stay mounted (just clipped).
  const [render, setRender] = React.useState(open || !unmountOnExit);

  React.useEffect(() => {
    if (open) setRender(true);
  }, [open]);

  React.useLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    if (reduced) {
      setHeight(open ? undefined : 0);
      if (!open && unmountOnExit) setRender(false);
      return;
    }
    if (open) {
      // Expand: 0 → measured, then release to auto so content can reflow.
      setHeight(inner.scrollHeight);
      const id = setTimeout(() => setHeight(undefined), duration);
      return () => clearTimeout(id);
    } else {
      // Collapse: auto → measured → 0 for a transitionable start value.
      setHeight(inner.scrollHeight);
      const id = requestAnimationFrame(() => setHeight(0));
      return () => cancelAnimationFrame(id);
    }
  }, [open, reduced, duration, unmountOnExit]);

  const onEnd = () => {
    if (!open && unmountOnExit) setRender(false);
  };

  return (
    <div
      style={{
        overflow: "hidden",
        height: height === undefined ? "auto" : height,
        transition: reduced ? "none" : `height ${duration}ms ${easeVar(easing)}`,
        ...style,
      }}
      onTransitionEnd={onEnd}
      aria-hidden={!open}
      // Clipped-but-mounted content must not stay keyboard-reachable.
      inert={!open}
      {...rest}
    >
      <div ref={innerRef}>{render ? children : null}</div>
    </div>
  );
}
