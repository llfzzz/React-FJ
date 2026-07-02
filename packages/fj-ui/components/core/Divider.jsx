import React from "react";

/**
 * Free Joy — Divider
 * Hairline separator. Horizontal or vertical, with an optional centered label.
 */
export function Divider({ orientation = "horizontal", label, inset = 0, style, ...rest }) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        style={{ width: 1, alignSelf: "stretch", background: "var(--border)", margin: `0 ${inset}px`, ...style }}
        {...rest}
      />
    );
  }
  if (label) {
    return (
      <div role="separator" style={{ display: "flex", alignItems: "center", gap: 14, margin: `${inset}px 0`, ...style }} {...rest}>
        <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-caps)", textTransform: "uppercase", color: "var(--text-subtle)" }}>{label}</span>
        <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>
    );
  }
  return <hr role="separator" style={{ border: "none", borderTop: "1px solid var(--border)", margin: `${inset}px 0`, width: "100%", ...style }} {...rest} />;
}
