import React from "react";

function useNarrow(bp) {
  const [narrow, setNarrow] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia(`(max-width: ${bp}px)`).matches
  );
  React.useEffect(() => {
    const m = window.matchMedia(`(max-width: ${bp}px)`);
    const f = () => setNarrow(m.matches);
    if (m.addEventListener) m.addEventListener("change", f); else m.addListener(f);
    return () => { if (m.removeEventListener) m.removeEventListener("change", f); else m.removeListener(f); };
  }, [bp]);
  return narrow;
}

/**
 * Free Joy — AppShell
 * Product-app scaffold: sunken sticky sidebar + frosted sticky topbar + content.
 * Below `breakpoint` the sidebar hides — pass your own Drawer for mobile nav
 * and open it from a control in `topbar`.
 */
export function AppShell({
  sidebar,
  topbar,
  sidebarWidth = 264,
  contentMaxWidth = "var(--container)",
  padded = true,
  breakpoint = 900,
  style,
  children,
}) {
  const narrow = useNarrow(breakpoint);
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", ...style }}>
      {sidebar && !narrow && (
        <aside
          style={{
            width: sidebarWidth, flex: "none",
            position: "sticky", top: 0, height: "100vh", overflowY: "auto",
            background: "var(--bg-sunken)", borderRight: "1px solid var(--border)",
          }}
        >
          {sidebar}
        </aside>
      )}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {topbar && (
          <header
            style={{
              position: "sticky", top: 0, zIndex: "var(--z-sticky)",
              background: "var(--glass-bg-strong)",
              WebkitBackdropFilter: "blur(var(--glass-blur-lg)) saturate(180%)",
              backdropFilter: "blur(var(--glass-blur-lg)) saturate(180%)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {topbar}
          </header>
        )}
        <main
          style={{
            flex: 1, width: "100%", maxWidth: contentMaxWidth, margin: "0 auto",
            padding: padded ? (narrow ? "var(--space-5) var(--space-4)" : "var(--space-6)") : 0,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
