import React from "react";

const ACC = {
  coral: ["var(--joy-500)", "var(--joy-600)", "var(--white)"],
  sun:   ["var(--sun-500)", "var(--sun-700)", "var(--ink)"],
  bloom: ["var(--bloom-500)", "var(--bloom-700)", "var(--white)"],
};

/**
 * Free Joy — SplitButton
 * A primary action plus a caret that opens a small menu of secondary actions.
 * menu: [{ label, onSelect }]
 */
export function SplitButton({
  children,
  onClick,
  menu = [],
  accent = "coral",
  size = "md",
  style,
  ...rest
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const [base, hover, on] = ACC[accent] || [accent, accent, "var(--white)"];
  const h = { sm: 36, md: 44, lg: 54 }[size] || 44;

  React.useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const seg = {
    height: h,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: base,
    color: on,
    border: "none",
    cursor: "pointer",
    fontFamily: "var(--font-text)",
    fontWeight: "var(--weight-semibold)",
    fontSize: "var(--text-base)",
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex", ...style }} {...rest}>
      <button
        onClick={onClick}
        onMouseEnter={(e) => (e.currentTarget.style.background = hover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = base)}
        style={{ ...seg, padding: "0 20px", borderRadius: "var(--radius-pill) 0 0 var(--radius-pill)" }}
      >
        {children}
      </button>
      <span style={{ width: 1, height: h, background: "rgba(255,255,255,0.28)" }} />
      <button
        aria-label="More actions"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={(e) => (e.currentTarget.style.background = hover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = base)}
        style={{ ...seg, width: h, borderRadius: "0 var(--radius-pill) var(--radius-pill) 0", fontSize: 18 }}
      >
        ▾
      </button>
      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            minWidth: 200,
            padding: 6,
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-md)",
            zIndex: "var(--z-sticky)",
          }}
        >
          {menu.map((m, i) => (
            <button
              key={i}
              role="menuitem"
              onClick={() => { setOpen(false); m.onSelect && m.onSelect(); }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              style={{
                display: "flex", width: "100%", alignItems: "center",
                padding: "9px 12px", border: "none", background: "transparent",
                cursor: "pointer", textAlign: "left", borderRadius: "var(--radius-sm)",
                fontFamily: "var(--font-text)", fontSize: "var(--text-sm)", color: "var(--text)",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
