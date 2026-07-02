import React from "react";

/**
 * Free Joy — CopyButton
 * Copies `value` to the clipboard and flips to a confirmation state briefly.
 */
export function CopyButton({
  value = "",
  label = "Copy",
  copiedLabel = "Copied",
  size = "sm",
  style,
  ...rest
}) {
  const [copied, setCopied] = React.useState(false);
  const dims = {
    sm: { height: 32, padding: "0 12px", fontSize: "var(--text-sm)" },
    md: { height: 40, padding: "0 16px", fontSize: "var(--text-base)" },
  }[size] || { height: 32, padding: "0 12px", fontSize: "var(--text-sm)" };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
    } catch (e) { /* clipboard blocked */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      onClick={copy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        ...dims,
        fontFamily: "var(--font-text)",
        fontWeight: "var(--weight-semibold)",
        lineHeight: 1,
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        color: copied ? "var(--success-700)" : "var(--text)",
        transition: "color var(--dur-fast) var(--ease-out)",
        ...style,
      }}
      {...rest}
    >
      <span
        aria-hidden="true"
        style={{
          width: 15, height: 15, flex: "none",
          backgroundColor: "currentColor",
          WebkitMaskImage: `url(https://unpkg.com/lucide-static@0.456.0/icons/${copied ? "check" : "copy"}.svg)`,
          maskImage: `url(https://unpkg.com/lucide-static@0.456.0/icons/${copied ? "check" : "copy"}.svg)`,
          WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat",
          WebkitMaskPosition: "center", maskPosition: "center",
          WebkitMaskSize: "contain", maskSize: "contain",
        }}
      />
      {copied ? copiedLabel : label}
    </button>
  );
}
