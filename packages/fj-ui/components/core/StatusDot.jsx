import React from "react";

const TONES = {
  success: "var(--success-500)",
  warn: "var(--warn-500)",
  danger: "var(--danger-500)",
  info: "var(--info-500)",
  neutral: "var(--ink-4)",
  accent: "var(--accent)",
  // presence aliases
  online: "var(--success-500)",
  away: "var(--warn-500)",
  busy: "var(--danger-500)",
  offline: "var(--ink-4)",
};

/**
 * Free Joy — StatusDot
 * Tiny status indicator dot with optional label and pulse.
 * Never the only signal: pair with a label or accessible text.
 */
export function StatusDot({ tone = "neutral", pulse = false, size = 8, label, ring = false, style, ...rest }) {
  const color = TONES[tone] || tone;
  return (
    <span
      role={label ? undefined : "img"}
      aria-label={label ? undefined : `status: ${tone}`}
      style={{ display: "inline-flex", alignItems: "center", gap: 8, ...style }}
      {...rest}
    >
      <span style={{ position: "relative", width: size, height: size, flex: "none", display: "inline-block" }}>
        {pulse && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: color, opacity: 0.5,
              animation: "fjDotPulse 2s var(--ease-out) infinite",
            }}
          />
        )}
        <span
          style={{
            position: "absolute", inset: 0, borderRadius: "50%", background: color,
            boxShadow: ring ? "0 0 0 2px var(--surface)" : "none",
          }}
        />
      </span>
      {label && <span style={{ fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{label}</span>}
      {pulse && <style dangerouslySetInnerHTML={{ __html: "@keyframes fjDotPulse{0%{transform:scale(1);opacity:.5}70%{transform:scale(2.4);opacity:0}100%{transform:scale(2.4);opacity:0}}" }} />}
    </span>
  );
}
