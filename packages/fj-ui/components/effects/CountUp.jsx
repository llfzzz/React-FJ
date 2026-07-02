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

function format(n, decimals, separator) {
  const parts = n.toFixed(decimals).split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return parts.join(".");
}

/**
 * Free Joy — CountUp (effect)
 * Number that counts up when scrolled into view. Pairs with Stat for
 * dashboards and marketing metrics. Shows the final value instantly under
 * reduced motion.
 */
export function CountUp({
  value = 0,
  duration = 1200,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  once = true,
  style,
  ...rest
}) {
  const reduced = useReducedMotion();
  const ref = React.useRef(null);
  const [display, setDisplay] = React.useState(reduced ? value : 0);
  const started = React.useRef(false);

  React.useEffect(() => {
    if (reduced) { setDisplay(value); return; }
    const el = ref.current;
    if (!el) return;
    let raf;
    const run = () => {
      const t0 = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - t0) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(value * eased);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && (!once || !started.current)) { started.current = true; run(); }
      });
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [value, duration, once, reduced]);

  return (
    <span
      ref={ref}
      aria-label={`${prefix}${format(value, decimals, separator)}${suffix}`}
      style={{ fontVariantNumeric: "tabular-nums", ...style }}
      {...rest}
    >
      <span aria-hidden="true">{prefix}{format(display, decimals, separator)}{suffix}</span>
    </span>
  );
}
