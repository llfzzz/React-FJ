import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeProvider } from '../lib/theme';
import { SiteLayout, DocsLayout } from './layouts';
import { LandingPage } from '../pages/landing/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { StubPage } from '../pages/StubPage';
import { IntroductionPage } from '../pages/docs/IntroductionPage';
import { InstallationPage } from '../pages/docs/InstallationPage';
import { UsagePage } from '../pages/docs/UsagePage';
import { ComponentsIndexPage } from '../pages/components/ComponentsIndexPage';
import { ComponentPage } from '../pages/components/ComponentPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<LandingPage />} />
            <Route element={<DocsLayout />}>
              <Route path="docs" element={<Navigate to="/docs/introduction" replace />} />
              <Route path="docs/introduction" element={<IntroductionPage />} />
              <Route path="docs/installation" element={<InstallationPage />} />
              <Route path="docs/usage" element={<UsagePage />} />
              <Route path="components" element={<ComponentsIndexPage />} />
              <Route path="components/:id" element={<ComponentPage />} />
              <Route path="playground" element={<StubPage title="Playground" />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
