import React from "react";

/**
 * Free Joy — Container
 * Centered, max-width content column with responsive side padding.
 */
export function Container({ size = "lg", pad = true, style, children, ...rest }) {
  const max = { sm: 640, md: 820, lg: 1080, xl: 1280, full: "100%" }[size] ?? 1080;
  return (
    <div
      style={{
        width: "100%",
        maxWidth: max,
        marginInline: "auto",
        paddingInline: pad ? "clamp(20px, 5vw, 40px)" : 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
