import React from "react";

/**
 * Free Joy — Skeleton
 * Loading placeholder with a gentle shimmer. Shapes: text | circle | rect.
 */
export function Skeleton({
  variant = "text",
  width,
  height,
  lines = 1,
  radius,
  style,
  ...rest
}) {
  const base = {
    background: "linear-gradient(90deg, var(--paper-2) 25%, var(--paper-3) 37%, var(--paper-2) 63%)",
    backgroundSize: "400% 100%",
    animation: "fj-shimmer 1.4s ease infinite",
  };
  const css = <style dangerouslySetInnerHTML={{ __html: "@keyframes fj-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}" }} />;

  if (variant === "circle") {
    const d = width || height || 44;
    return <span style={{ display: "inline-block", width: d, height: d, borderRadius: "50%", ...base, ...style }} {...rest}>{css}</span>;
  }
  if (variant === "rect") {
    return <span style={{ display: "block", width: width || "100%", height: height || 120, borderRadius: radius ?? "var(--radius-md)", ...base, ...style }} {...rest}>{css}</span>;
  }
  // text — possibly multiple lines
  return (
    <span style={{ display: "flex", flexDirection: "column", gap: 9, width: width || "100%", ...style }} {...rest}>
      {Array.from({ length: lines }).map((_, i) => (
        <span key={i} style={{
          display: "block", height: height || 12, borderRadius: 999,
          width: i === lines - 1 && lines > 1 ? "65%" : "100%", ...base,
        }} />
      ))}
      {css}
    </span>
  );
}
