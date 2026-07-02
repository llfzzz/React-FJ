import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PanelLeft, X } from 'lucide-react';
import { TopBar } from '../chrome/TopBar';
import { Footer } from '../chrome/Footer';
import { DocsSidebar, SidebarNav } from '../chrome/DocsSidebar';

/** Top bar + footer around every page. */
export function SiteLayout() {
  return (
    <>
      <TopBar />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

/** Sidebar layout for docs/component pages; drawer below 900px. */
export function DocsLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the drawer when navigation happens inside it.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    panelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      openButtonRef.current?.focus();
    };
  }, [drawerOpen]);

  return (
    <div className="docs">
      <DocsSidebar />
      <div className="docs-mobilebar">
        <button type="button" ref={openButtonRef} onClick={() => setDrawerOpen(true)}>
          <PanelLeft size={16} aria-hidden />
          Browse docs
        </button>
      </div>
      {drawerOpen && (
        <>
          <button
            type="button"
            className="drawer-backdrop"
            aria-label="Close navigation"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="drawer-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Documentation navigation"
            tabIndex={-1}
            ref={panelRef}
          >
            <div className="drawer-head">
              <span className="fj-eyebrow">Free Joy docs</span>
              <button
                type="button"
                className="icon-btn"
                aria-label="Close navigation"
                onClick={() => setDrawerOpen(false)}
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            <SidebarNav />
          </div>
        </>
      )}
      <div className="docs-content">
        <Outlet />
      </div>
    </div>
  );
}
