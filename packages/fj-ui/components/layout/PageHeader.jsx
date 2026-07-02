import React from "react";

/**
 * Free Joy — PageHeader
 * Editorial page/section opener: optional breadcrumb + mono eyebrow,
 * display-type title, calm description, right-aligned actions.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  breadcrumb,
  divider = true,
  style,
}) {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", gap: 14,
        paddingBottom: "var(--space-5)",
        borderBottom: divider ? "1px solid var(--border)" : "none",
        marginBottom: "var(--space-6)",
        ...style,
      }}
    >
      {breadcrumb}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          {eyebrow && (
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)",
              textTransform: "uppercase", letterSpacing: "var(--tracking-caps)",
              color: "var(--text-subtle)",
            }}>
              {eyebrow}
            </span>
          )}
          <h1 style={{
            margin: 0, fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)",
            fontWeight: "var(--weight-semibold)", lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tight)", color: "var(--text)", textWrap: "balance",
          }}>
            {title}
          </h1>
          {description && (
            <p style={{
              margin: 0, maxWidth: "58ch", fontSize: "var(--text-md)",
              lineHeight: "var(--leading-normal)", color: "var(--text-muted)", textWrap: "pretty",
            }}>
              {description}
            </p>
          )}
        </div>
        {actions && <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "none" }}>{actions}</div>}
      </div>
    </div>
  );
}
