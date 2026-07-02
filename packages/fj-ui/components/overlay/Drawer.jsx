import React from "react";

/**
 * Free Joy — Drawer
 * Slide-in panel anchored to any edge, with a scrim. Controlled via `open`.
 */
export function Drawer({
  open,
  onClose,
  side = "right",
  size = 380,
  title,
  children,
  footer,
  style,
}) {
  const panelRef = React.useRef(null);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const sel = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const panel = panelRef.current;
    const first = panel && panel.querySelector(sel);
    (first || panel) && (first || panel).focus();
    const onKey = (e) => {
      if (e.key === "Escape") { onClose && onClose(); }
      else if (e.key === "Tab" && panel) {
        const items = Array.from(panel.querySelectorAll(sel)).filter((el) => el.offsetParent !== null);
        if (!items.length) { e.preventDefault(); return; }
        const firstEl = items[0], lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (prev && prev.focus) prev.focus();
    };
  }, [open, onClose]);

  const horizontal = side === "left" || side === "right";
  const hidden = { left: "translateX(-100%)", right: "translateX(100%)", top: "translateY(-100%)", bottom: "translateY(100%)" }[side];
  const anchor = {
    left:   { top: 0, left: 0, bottom: 0, width: size, height: "100%" },
    right:  { top: 0, right: 0, bottom: 0, width: size, height: "100%" },
    top:    { top: 0, left: 0, right: 0, height: size, width: "100%" },
    bottom: { bottom: 0, left: 0, right: 0, height: size, width: "100%" },
  }[side];
  const radius = {
    left: "0 var(--radius-xl) var(--radius-xl) 0",
    right: "var(--radius-xl) 0 0 var(--radius-xl)",
    top: "0 0 var(--radius-xl) var(--radius-xl)",
    bottom: "var(--radius-xl) var(--radius-xl) 0 0",
  }[side];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: "var(--z-drawer)", pointerEvents: open ? "auto" : "none" }} aria-hidden={!open}>
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0, background: "var(--overlay)",
          backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
          opacity: open ? 1 : 0, transition: "opacity var(--dur-base) var(--ease-out)",
        }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === "string" ? title : undefined}
        ref={panelRef}
        tabIndex={-1}
        style={{
          position: "absolute", ...anchor, display: "flex", flexDirection: "column",
          background: "var(--surface)", borderRadius: radius, boxShadow: "var(--shadow-lg)",
          transform: open ? "none" : hidden,
          transition: "transform var(--dur-slow) var(--ease-out)",
          ...style,
        }}
      >
        {(title || onClose) && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: "var(--weight-semibold)", color: "var(--text)" }}>{title}</span>
            {onClose && <button onClick={onClose} aria-label="Close" style={{ width: 32, height: 32, border: "none", background: "transparent", cursor: "pointer", color: "var(--text-muted)", fontSize: 22, borderRadius: "var(--radius-sm)" }}>×</button>}
          </div>
        )}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>{children}</div>
        {footer && <div style={{ padding: "16px 24px", borderTop: "1px solid var(--border)" }}>{footer}</div>}
      </div>
    </div>
  );
}
