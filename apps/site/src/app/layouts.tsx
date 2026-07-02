import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { PanelLeft } from 'lucide-react';
import { Drawer } from '@fj';
import { TopBar } from '../chrome/TopBar';
import { Footer } from '../chrome/Footer';
import { DocsSidebar, SidebarNav } from '../chrome/DocsSidebar';
import { CommandK, useCommandK } from '../chrome/CommandK';

/** Top bar + footer around every page. */
export function SiteLayout() {
  const { open, openMenu, closeMenu } = useCommandK();
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <TopBar onSearch={openMenu} />
      <main className="site-main" id="main">
        <Outlet />
      </main>
      <Footer />
      <CommandK open={open} onClose={closeMenu} />
    </>
  );
}

/** Sidebar layout for docs/component pages; FJ Drawer below 900px. */
export function DocsLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the drawer when navigation happens inside it.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <div className="docs">
      <DocsSidebar />
      <div className="docs-mobilebar">
        <button type="button" onClick={() => setDrawerOpen(true)}>
          <PanelLeft size={16} aria-hidden />
          Browse docs
        </button>
      </div>
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side="left"
        size={300}
        title="Free Joy docs"
      >
        <SidebarNav />
      </Drawer>
      <div className="docs-content">
        <Outlet />
      </div>
    </div>
  );
}
