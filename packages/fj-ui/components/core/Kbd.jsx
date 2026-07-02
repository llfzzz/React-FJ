import React from "react";

/**
 * Free Joy — Kbd
 * Keyboard shortcut badge. Pass a combo string ("⌘ K", "Ctrl+C") or use
 * `keys` for separate keycaps.
 */
export function Kbd({ keys, size = "md", style, children }) {
  const pad = size === "sm" ? "1px 6px" : "2px 8px";
  const fs = size === "sm" ? 10.5 : 12;
  const cap = (content, i) => (
    <kbd
      key={i}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: fs,
        lineHeight: 1.5,
        color: "var(--text-muted)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderBottomWidth: 2,
        borderRadius: 6,
        padding: pad,
        whiteSpace: "nowrap",
      }}
    >
      {content}
    </kbd>
  );
  if (keys && keys.length) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, ...style }}>
        {keys.map((k, i) => cap(k, i))}
      </span>
    );
  }
  return <span style={{ display: "inline-flex", ...style }}>{cap(children, 0)}</span>;
}
