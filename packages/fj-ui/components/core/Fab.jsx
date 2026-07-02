import React from "react";

const ACC = {
  coral: ["var(--joy-500)", "var(--joy-600)", "var(--white)"],
  sun:   ["var(--sun-500)", "var(--sun-700)", "var(--ink)"],
  bloom: ["var(--bloom-500)", "var(--bloom-700)", "var(--white)"],
};

/**
 * Free Joy — Fab (Floating Action Button)
 * Round (or extended w/ label) floating button. `fixed` pins it to a corner.
 */
export function Fab({
  icon,
  label,
  accent = "coral",
  size = "md",
  fixed = true,
  position = "bottom-right",
  style,
  ...rest
}) {
  const dim = { md: 56, lg: 64 }[size] || 56;
  const [base, hover, on] = ACC[accent] || [accent, accent, "var(--white)"];
  const [h, setH] = React.useState(false);
  const corner = {
    "bottom-right": { bottom: 28, right: 28 },
    "bottom-left": { bottom: 28, left: 28 },
    "top-right": { top: 28, right: 28 },
    "top-left": { top: 28, left: 28 },
  }[position] || {};
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        position: fixed ? "fixed" : "relative",
        ...(fixed ? corner : {}),
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: label ? 10 : 0,
        height: dim,
        width: label ? "auto" : dim,
        padding: label ? "0 24px" : 0,
        borderRadius: "var(--radius-pill)",
        border: "none",
        cursor: "pointer",
        background: h ? hover : base,
        color: on,
        fontFamily: "var(--font-text)",
        fontWeight: "var(--weight-semibold)",
        fontSize: "var(--text-base)",
        boxShadow: "var(--shadow-lg)",
        transform: h ? "translateY(-1px)" : "none",
        transition: "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
        zIndex: "var(--z-fab)",
        ...style,
      }}
      {...rest}
    >
      {icon}
      {label}
    </button>
  );
}
