import React from "react";

/**
 * Free Joy — Avatar
 * Image or initials, circular. sizes: sm | md | lg
 */
export function Avatar({ src, name = "", size = "md", style, ...rest }) {
  const px = { sm: 28, md: 40, lg: 56 }[size] || 40;
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: px,
        height: px,
        borderRadius: "var(--radius-pill)",
        background: "var(--joy-100)",
        color: "var(--joy-700)",
        fontFamily: "var(--font-text)",
        fontWeight: "var(--weight-semibold)",
        fontSize: px * 0.36,
        overflow: "hidden",
        flex: "none",
        ...style,
      }}
      {...rest}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials || "?"
      )}
    </span>
  );
}
