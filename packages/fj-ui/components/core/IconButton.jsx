import React from "react";

const ACC = {
  coral: ["var(--joy-500)", "var(--joy-600)", "var(--white)"],
  sun:   ["var(--sun-500)", "var(--sun-700)", "var(--ink)"],
  bloom: ["var(--bloom-500)", "var(--bloom-700)", "var(--white)"],
};

/**
 * Free Joy — IconButton
 * Square/round icon-only button. Variants ghost | solid | outline.
 * `accent` recolors the solid fill per-instance.
 */
export function IconButton({
  variant = "ghost",
  size = "md",
  accent = "coral",
  round = true,
  disabled = false,
  style,
  children,
  ...rest
}) {
  const dim = { sm: 32, md: 40, lg: 48 }[size] || 40;
  const [base, hover, on] = ACC[accent] || [accent, accent, "var(--white)"];
  const [h, setH] = React.useState(false);
  const looks = {
    ghost:   { background: h ? "var(--surface-hover)" : "transparent", color: "var(--text)", border: "1px solid transparent" },
    solid:   { background: h ? hover : base, color: on, border: "1px solid transparent" },
    outline: { background: h ? "var(--surface-hover)" : "var(--surface)", color: "var(--text)", border: "1px solid var(--border-strong)" },
  }[variant];
  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: dim,
        height: dim,
        padding: 0,
        borderRadius: round ? "var(--radius-pill)" : "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? "var(--opacity-disabled)" : 1,
        transition: "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
        ...looks,
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
