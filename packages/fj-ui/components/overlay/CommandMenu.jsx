import React from "react";

/**
 * Free Joy — CommandMenu (⌘K palette)
 * Full-screen searchable command palette. Controlled via `open`.
 * commands: [{ id, label, hint, icon, group, onRun }]
 */
export function CommandMenu({ open, onClose, commands = [], placeholder = "Type a command or search…" }) {
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef(null);
  const prevFocus = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      prevFocus.current = document.activeElement;
      setQ(""); setActive(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
    } else if (prevFocus.current) {
      if (prevFocus.current.focus) prevFocus.current.focus();
      prevFocus.current = null;
    }
  }, [open]);

  const filtered = commands.filter((c) =>
    !q || (c.label + " " + (c.hint || "") + " " + (c.group || "")).toLowerCase().includes(q.toLowerCase())
  );

  React.useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose && onClose();
      else if (e.key === "Tab") e.preventDefault();
      else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(filtered.length - 1, a + 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
      else if (e.key === "Enter") { const c = filtered[active]; if (c) { onClose && onClose(); c.onRun && c.onRun(); } }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, active, onClose]);

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: "var(--z-command)", display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: "12vh" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "var(--overlay)", backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }} />
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: "relative", width: 600, maxWidth: "calc(100vw - 40px)", maxHeight: "70vh", display: "flex", flexDirection: "column",
          background: "var(--glass-bg-strong)", backdropFilter: "blur(var(--glass-blur-lg)) saturate(180%)", WebkitBackdropFilter: "blur(var(--glass-blur-lg)) saturate(180%)",
          border: "1px solid var(--glass-border)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)", overflow: "hidden",
          animation: "fj-cmd-in var(--dur-base) var(--ease-out)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <span aria-hidden="true" style={{
            width: 20, height: 20, flex: "none", backgroundColor: "var(--text-subtle)",
            WebkitMaskImage: "url(https://unpkg.com/lucide-static@0.456.0/icons/search.svg)", maskImage: "url(https://unpkg.com/lucide-static@0.456.0/icons/search.svg)",
            WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center", WebkitMaskSize: "contain", maskSize: "contain",
          }} />
          <input
            ref={inputRef}
            value={q}
            placeholder={placeholder}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-text)", fontSize: "var(--text-md)", color: "var(--text)" }}
          />
          <kbd style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-subtle)", border: "1px solid var(--border)", borderRadius: 6, padding: "2px 6px" }}>ESC</kbd>
        </div>
        <div style={{ overflow: "auto", padding: 8 }}>
          {filtered.length === 0 && <div style={{ padding: "28px 16px", textAlign: "center", color: "var(--text-subtle)", fontSize: "var(--text-sm)" }}>No results for “{q}”</div>}
          {filtered.map((c, i) => (
            <button
              key={c.id || i}
              onMouseEnter={() => setActive(i)}
              onClick={() => { onClose && onClose(); c.onRun && c.onRun(); }}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", border: "none",
                cursor: "pointer", textAlign: "left", borderRadius: "var(--radius-md)",
                background: i === active ? "var(--surface-hover)" : "transparent",
                fontFamily: "var(--font-text)", color: "var(--text)",
              }}
            >
              {c.icon && <span aria-hidden="true" style={{
                width: 18, height: 18, flex: "none", backgroundColor: "var(--text-muted)",
                WebkitMaskImage: `url(https://unpkg.com/lucide-static@0.456.0/icons/${c.icon}.svg)`, maskImage: `url(https://unpkg.com/lucide-static@0.456.0/icons/${c.icon}.svg)`,
                WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center", WebkitMaskSize: "contain", maskSize: "contain",
              }} />}
              <span style={{ flex: 1, fontSize: "var(--text-sm)", fontWeight: "var(--weight-medium)" }}>{c.label}</span>
              {c.hint && <span style={{ fontSize: "var(--text-xs)", color: "var(--text-subtle)" }}>{c.hint}</span>}
            </button>
          ))}
        </div>
        <style dangerouslySetInnerHTML={{ __html: "@keyframes fj-cmd-in{from{opacity:0;transform:translateY(-8px) scale(0.98)}to{opacity:1;transform:none}}" }} />
      </div>
    </div>
  );
}
