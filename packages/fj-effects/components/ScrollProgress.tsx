import * as React from "react";

export interface ScrollProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Bar thickness in px. @default 3 */
  height?: number;
  /** Bar color (FJ token or CSS color). @default var(--accent) */
  color?: string;
  /** Edge to pin the bar to. @default "top" */
  position?: "top" | "bottom";
  /** Track a specific scrollable element instead of the window. */
  target?: React.RefObject<HTMLElement | null>;
  /** z-index. @default var(--z-sticky) */
  zIndex?: number | string;
}

/**
 * Free Joy — ScrollProgress (effect)
 * A thin reading-progress bar pinned to the top (or bottom) of the viewport
 * that fills as the page scrolls. It only scales on the X axis — no layout,
 * no reflow — so it's safe to leave on documentation pages. Reduced-motion
 * safe: it reflects position, it isn't a decorative animation.
 */
export function ScrollProgress({
  height = 3,
  color = "var(--accent)",
  position = "top",
  target,
  zIndex = "var(--z-sticky)",
  style,
  ...rest
}: ScrollProgressProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const el = target?.current;
    const compute = () => {
      if (el) {
        const max = el.scrollHeight - el.clientHeight;
        setProgress(max > 0 ? el.scrollTop / max : 0);
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      }
    };
    const src: HTMLElement | Window = el ?? window;
    compute();
    src.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      src.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [target]);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      aria-label="Reading progress"
      style={{
        position: target ? "sticky" : "fixed",
        [position]: 0,
        left: 0,
        right: 0,
        height,
        zIndex: zIndex as React.CSSProperties["zIndex"],
        transformOrigin: "left",
        transform: `scaleX(${progress})`,
        background: color,
        pointerEvents: "none",
        ...style,
      }}
      {...rest}
    />
  );
}
