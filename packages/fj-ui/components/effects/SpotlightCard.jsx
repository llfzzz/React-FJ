import React from "react";

/**
 * Free Joy — SpotlightCard (effect)
 * A Card whose surface carries a soft warm highlight that follows the cursor.
 * For flagship/showcase cards only — not dense data views. The spotlight is
 * pure background paint: no layout shift, dark-mode safe via --accent-soft.
 */
export function SpotlightCard({
  size = 320,
  padding = "var(--space-5)",
  radius = "var(--radius-lg)",
  interactive = true,
  style,
  children,
  ...rest
}) {
  const ref = React.useRef(null);
  const [hover, setHover] = React.useState(false);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--fj-mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--fj-my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: radius,
        padding,
        boxShadow: hover && interactive ? "var(--shadow-md)" : "var(--shadow-xs)",
        transform: hover && interactive ? "translateY(-2px)" : "translateY(0)",
        transition: "box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
        ...style,
      }}
      {...rest}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(${size}px circle at var(--fj-mx, 50%) var(--fj-my, 40%), var(--accent-soft), transparent 70%)`,
          opacity: hover ? 1 : 0,
          transition: "opacity var(--dur-base) var(--ease-out)",
        }}
      />
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}
