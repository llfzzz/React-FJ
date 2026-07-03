import * as React from "react";
import { useInView } from "../motion/useInView";
import { useReducedMotion } from "../motion/useReducedMotion";

export interface StaggerListProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  /** Per-child delay in ms. @default 60 */
  stagger?: number;
  /** Per-child duration in ms. @default 480 */
  duration?: number;
  /** Entry style. @default "up" */
  from?: "up" | "fade" | "scale";
  /** Lead-in delay before the first child in ms. @default 0 */
  initialDelay?: number;
  /** Element/tag to render as the container. @default "div" */
  as?: React.ElementType;
  /** Disable (children appear immediately). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — StaggerList (effect)
 * Reveals its direct children one after another when the list scrolls into
 * view. Great for feature grids and lists. Only transform/opacity animate.
 * Under reduced motion (or disabled) all children appear at once.
 */
export function StaggerList({
  children,
  stagger = 60,
  duration = 480,
  from = "up",
  initialDelay = 0,
  as: Tag = "div",
  disabled = false,
  style,
  ...rest
}: StaggerListProps) {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLElement>({ once: true });
  const active = disabled || reduced || inView;

  const hidden: React.CSSProperties =
    from === "scale"
      ? { opacity: 0, transform: "scale(0.96)" }
      : from === "fade"
        ? { opacity: 0 }
        : { opacity: 0, transform: "translateY(14px)" };

  const items = React.Children.toArray(children);

  return (
    <Tag ref={ref} style={style} {...rest}>
      {items.map((child, i) => (
        <div
          key={i}
          style={
            reduced || disabled
              ? undefined
              : {
                  ...(active ? { opacity: 1, transform: "none" } : hidden),
                  transition: `opacity ${duration}ms var(--ease-emphasized) ${initialDelay + i * stagger}ms, transform ${duration}ms var(--ease-emphasized) ${initialDelay + i * stagger}ms`,
                }
          }
        >
          {child}
        </div>
      ))}
    </Tag>
  );
}
