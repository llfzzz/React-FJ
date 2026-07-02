import React from "react";
import { Spinner } from "../feedback/Spinner.jsx";

const ACC = {
  coral: ["var(--accent)", "var(--accent-hover)", "var(--text-on-accent)"],
  sun:   ["var(--sun-500)", "var(--sun-700)", "var(--ink)"],
  bloom: ["var(--bloom-500)", "var(--bloom-700)", "var(--white)"],
};

/**
 * Free Joy — Button
 * Variants: primary | secondary | ghost | danger
 * Sizes: sm | md | lg
 * `accent` recolors the primary fill per-instance; `loading` shows a spinner
 * and blocks interaction (aria-busy).
 */
export function Button({
  variant = "primary",
  size = "md",
  accent = "coral",
  iconLeft,
  iconRight,
  disabled = false,
  loading = false,
  full = false,
  style,
  children,
  ...rest
}) {
  const sizes = {
    sm: { padding: "0 14px", height: 36, fontSize: "var(--text-sm)", gap: 6, spin: 14 },
    md: { padding: "0 20px", height: 44, fontSize: "var(--text-base)", gap: 8, spin: 16 },
    lg: { padding: "0 28px", height: 54, fontSize: "var(--text-md)", gap: 10, spin: 18 },
  };
  const [accBase, accHover, accOn] = ACC[accent] || [accent, accent, "var(--white)"];
  const variants = {
    primary: {
      background: accBase,
      color: accOn,
      border: "1px solid transparent",
    },
    secondary: {
      background: "var(--surface)",
      color: "var(--text)",
      border: "1px solid var(--border-strong)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text)",
      border: "1px solid transparent",
    },
    danger: {
      background: "var(--danger-500)",
      color: "var(--white)",
      border: "1px solid transparent",
    },
  };
  const s = sizes[size] || sizes.md;
  const v = variants[variant] || variants.primary;

  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);

  const hoverBg = {
    primary: accHover,
    secondary: "var(--surface-hover)",
    ghost: "var(--surface-hover)",
    danger: "var(--danger-700)",
  }[variant];

  const inert = disabled || loading;

  return (
    <button
      disabled={inert}
      aria-busy={loading || undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        display: full ? "flex" : "inline-flex",
        width: full ? "100%" : undefined,
        alignItems: "center",
        justifyContent: "center",
        gap: s.gap,
        height: s.height,
        padding: s.padding,
        fontFamily: "var(--font-text)",
        fontWeight: "var(--weight-semibold)",
        fontSize: s.fontSize,
        lineHeight: 1,
        borderRadius: "var(--radius-pill)",
        cursor: loading ? "progress" : disabled ? "not-allowed" : "pointer",
        opacity: disabled ? "var(--opacity-disabled)" : 1,
        transform: active && !inert ? "scale(0.97)" : "scale(1)",
        transition: "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
        whiteSpace: "nowrap",
        ...v,
        background: hover && !inert ? hoverBg : v.background,
        ...style,
      }}
      {...rest}
    >
      {loading ? <Spinner size={s.spin} thickness={2} color="currentColor" /> : iconLeft}
      {children}
      {iconRight}
    </button>
  );
}
