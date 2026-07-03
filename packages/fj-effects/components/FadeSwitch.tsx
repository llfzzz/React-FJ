import * as React from "react";
import { useReducedMotion } from "../motion/useReducedMotion";

export interface FadeSwitchProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Changing this key crossfades to the new children. */
  switchKey: string | number;
  /** Transition style. @default "fade" */
  mode?: "fade" | "slide-up" | "scale";
  /** Transition duration in ms. @default 300 */
  duration?: number;
  /** Disable (children swap instantly). @default false */
  disabled?: boolean;
}

/**
 * Free Joy — FadeSwitch (effect)
 * Crossfades between content when `switchKey` changes — tab panels, step
 * screens, rotating quotes. Holds a fixed footprint by stacking the outgoing
 * and incoming layers. Instant swap under reduced motion or when disabled.
 */
export function FadeSwitch({
  children,
  switchKey,
  mode = "fade",
  duration = 300,
  disabled = false,
  style,
  ...rest
}: FadeSwitchProps) {
  const reduced = useReducedMotion();
  const instant = disabled || reduced;
  const [shown, setShown] = React.useState<{ key: React.Key; node: React.ReactNode }>({
    key: switchKey,
    node: children,
  });
  const [entering, setEntering] = React.useState(false);

  React.useEffect(() => {
    if (switchKey === shown.key) {
      setShown((s) => ({ ...s, node: children }));
      return;
    }
    if (instant) {
      setShown({ key: switchKey, node: children });
      return;
    }
    setEntering(true);
    setShown({ key: switchKey, node: children });
    const id = requestAnimationFrame(() => setEntering(false));
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [switchKey, children, instant]);

  const enter: React.CSSProperties =
    mode === "slide-up"
      ? { opacity: 0, transform: "translateY(8px)" }
      : mode === "scale"
        ? { opacity: 0, transform: "scale(0.98)" }
        : { opacity: 0 };

  return (
    <div style={{ position: "relative", ...style }} {...rest}>
      <div
        key={shown.key}
        style={
          instant
            ? undefined
            : {
                ...(entering ? enter : { opacity: 1, transform: "none" }),
                transition: `opacity ${duration}ms var(--ease-out), transform ${duration}ms var(--ease-out)`,
              }
        }
      >
        {shown.node}
      </div>
    </div>
  );
}
