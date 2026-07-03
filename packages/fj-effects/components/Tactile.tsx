import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";

export interface TactileProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  /** Scale while pressed. @default 0.96 */
  scale?: number;
  /** Press transition duration in ms. @default 120 */
  duration?: number;
  /** Disable (children unchanged). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — Tactile (effect)
 * Adds a satisfying press-down (scale + settle) to any child — buttons, cards,
 * tappable tiles. Works with mouse and touch. Under reduced motion the press
 * is instant with no scaling.
 */
export function Tactile({ children, scale = 0.96, duration = 120, disabled = false, style, ...rest }: TactileProps) {
  const reduced = useReducedMotion();
  const [pressed, setPressed] = React.useState(false);
  const inactive = disabled || reduced;

  const down = () => !inactive && setPressed(true);
  const up = () => setPressed(false);

  return (
    <span
      onMouseDown={down}
      onMouseUp={up}
      onMouseLeave={up}
      onTouchStart={down}
      onTouchEnd={up}
      style={{
        display: "inline-block",
        transform: pressed ? `scale(${scale})` : "scale(1)",
        transition: inactive ? "none" : `transform ${duration}ms var(--ease-out)`,
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
