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
 * Free Joy — TextReveal (effect)
 * Editorial headline reveal: words (or characters) rise in with a gentle
 * stagger when scrolled into view. Showcase surfaces only — heroes, section
 * titles, empty states. Renders plain text under reduced motion.
 */
export function TextReveal({
  text = "",
  by = "word",
  delay = 0,
  stagger = 45,
  duration = 640,
  once = true,
  style,
  ...rest
}) {
  const reduced = useReducedMotion();
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { setShown(true); if (once) io.disconnect(); }
          else if (!once) setShown(false);
        });
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, reduced]);

  if (reduced) {
    return <span style={style} {...rest}>{text}</span>;
  }

  const units = by === "char" ? Array.from(text) : text.split(/(\s+)/).filter(Boolean);

  return (
    <span ref={ref} aria-label={text} role="text" style={{ display: "inline-block", whiteSpace: "pre-wrap", ...style }} {...rest}>
      {units.map((u, i) => (
        <span key={i} aria-hidden="true" style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
          <span
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              transform: shown ? "translateY(0)" : "translateY(105%)",
              opacity: shown ? 1 : 0,
              transition: `transform ${duration}ms var(--ease-emphasized) ${delay + i * stagger}ms, opacity ${duration * 0.6}ms var(--ease-out) ${delay + i * stagger}ms`,
            }}
          >
            {u}
          </span>
        </span>
      ))}
    </span>
  );
}
