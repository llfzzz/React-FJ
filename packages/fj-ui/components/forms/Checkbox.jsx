import React from "react";

/**
 * Free Joy — Checkbox
 */
export function Checkbox({ checked = false, onChange, disabled = false, label, id, style, ...rest }) {
  const fid = id || React.useId();
  return (
    <label
      htmlFor={fid}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 20,
          height: 20,
          flex: "none",
          borderRadius: "var(--radius-xs)",
          border: `1.5px solid ${checked ? "var(--accent)" : "var(--border-strong)"}`,
          background: checked ? "var(--accent)" : "var(--surface)",
          color: "var(--white)",
          transition: "all var(--dur-fast) var(--ease-out)",
        }}
      >
        {checked && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </span>
      <input
        id={fid}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked, e)}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }}
        {...rest}
      />
      {label && <span style={{ fontSize: "var(--text-base)", color: "var(--text)" }}>{label}</span>}
    </label>
  );
}
