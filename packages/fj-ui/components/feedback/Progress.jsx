import React from "react";

const ACC = { coral: "var(--joy-500)", sun: "var(--sun-500)", bloom: "var(--bloom-500)" };

/**
 * Free Joy — Progress
 * Determinate or indeterminate progress bar. `accent` recolors the fill.
 */
export function Progress({
  value = 0,
  max = 100,
  indeterminate = false,
  accent = "coral",
  size = "md",
  showLabel = false,
  style,
  ...rest
}) {
  const h = { sm: 5, md: 8, lg: 12 }[size] || 8;
  const color = ACC[accent] || accent;
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", ...style }} {...rest}>
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
        style={{ position: "relative", flex: 1, height: h, borderRadius: 999, background: "var(--paper-3)", overflow: "hidden" }}
      >
        <div style={{
          position: "absolute", top: 0, bottom: 0,
          left: indeterminate ? 0 : 0,
          width: indeterminate ? "40%" : `${pct}%`,
          borderRadius: 999, background: color,
          animation: indeterminate ? "fj-prog 1.2s var(--ease-in-out) infinite" : "none",
          transition: indeterminate ? "none" : "width var(--dur-base) var(--ease-out)",
        }} />
      </div>
      {showLabel && !indeterminate && (
        <span style={{ minWidth: 38, textAlign: "right", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{Math.round(pct)}%</span>
      )}
      <style dangerouslySetInnerHTML={{ __html: "@keyframes fj-prog{0%{left:-40%}100%{left:100%}}" }} />
    </div>
  );
}
