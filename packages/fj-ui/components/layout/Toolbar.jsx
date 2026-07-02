import React from "react";

/**
 * Free Joy — Toolbar
 * Slim control row for tables and list views: filters/search in `start`,
 * bulk actions in `end`. Wraps gracefully on narrow screens.
 */
export function Toolbar({ start, end, sticky = false, style, children }) {
  return (
    <div
      role="toolbar"
      style={{
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
        padding: "var(--space-3) 0",
        ...(sticky
          ? {
              position: "sticky", top: 0, zIndex: "var(--z-sticky)",
              background: "var(--glass-bg-strong)",
              WebkitBackdropFilter: "blur(var(--glass-blur)) saturate(160%)",
              backdropFilter: "blur(var(--glass-blur)) saturate(160%)",
            }
          : null),
        ...style,
      }}
    >
      {start}
      {children}
      {end && <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>{end}</div>}
    </div>
  );
}
