import React from "react";

function useReducedMotion() {
  const [r, setR] = React.useState(
    () => typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setR(m.matches);
    if (m.addEventListener) m.addEventListener("change", f); else m.addListener(f);
    return () => { if (m.removeEventListener) m.removeEventListener("change", f); else m.removeListener(f); };
  }, []);
  return r;
}

/**
 * Free Joy — Reveal (effect)
 * Fade + rise for a section entering the viewport. `cascade` staggers direct
 * children. No layout shift: only transform/opacity animate.
 */
export function Reveal({
  delay = 0,
  y = 14,
  duration = 640,
  once = true,
  cascade = false,
  stagger = 60,
  threshold = 0.15,
  style,
  children,
  ...rest
}) {
  const reduced = useReducedMotion();
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (reduced) { setShown(true); return; }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { setShown(true); if (once) io.disconnect(); }
          else if (!once) setShown(false);
        });
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold, reduced]);

  const anim = (extraDelay) =>
    reduced
      ? {}
      : {
          transform: shown ? "translateY(0)" : `translateY(${y}px)`,
          opacity: shown ? 1 : 0,
          transition: `transform ${duration}ms var(--ease-emphasized) ${delay + extraDelay}ms, opacity ${duration * 0.7}ms var(--ease-out) ${delay + extraDelay}ms`,
        };

  if (cascade) {
    return (
      <div ref={ref} style={style} {...rest}>
        {React.Children.map(children, (child, i) => (
          <div style={anim(i * stagger)}>{child}</div>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} style={{ ...anim(0), ...style }} {...rest}>
      {children}
    </div>
  );
}
