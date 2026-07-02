import React from "react";

/**
 * Free Joy — Tooltip
 * Hover/focus label bubble. Wraps a single trigger child.
 * Restrained dark bubble; placement: top | bottom | left | right.
 */
export function Tooltip({ label, placement = "top", style, children }) {
  const [open, setOpen] = React.useState(false);
  const pos = {
    top:    { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    left:   { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
    right:  { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
  }[placement];
  return (
    <span
      style={{ position: "relative", display: "inline-flex", ...style }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <span
        role="tooltip"
        style={{
          position: "absolute",
          ...pos,
          whiteSpace: "nowrap",
          padding: "6px 10px",
          background: "var(--ink)",
          color: "var(--paper)",
          fontSize: "var(--text-xs)",
          fontWeight: "var(--weight-medium)",
          borderRadius: "var(--radius-sm)",
          boxShadow: "var(--shadow-md)",
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transform: `${pos.transform} translateY(${open ? 0 : "2px"})`,
          transition: "opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
          pointerEvents: "none",
          zIndex: "var(--z-tooltip)",
        }}
      >
        {label}
      </span>
    </span>
  );
}
