import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { CodeStyleProvider } from '../lib/codeStyle';
import { SiteLayout, DocsLayout } from './layouts';
import { LandingPage } from '../pages/landing/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { IntroductionPage } from '../pages/docs/IntroductionPage';
import { InstallationPage } from '../pages/docs/InstallationPage';
import { UsagePage } from '../pages/docs/UsagePage';
import { ComponentsIndexPage } from '../pages/components/ComponentsIndexPage';
import { ComponentPage } from '../pages/components/ComponentPage';
import { PlaygroundPage } from '../pages/playground/PlaygroundPage';
import { IndexPage } from '../pages/index/IndexPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <CodeStyleProvider>
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
              {/* The Index — one flat, newest-first stack of every item. */}
              <Route path="animation" element={<IndexPage />} />
              <Route path="animation/:id" element={<ComponentPage />} />
              {/* Retired pages redirect to the Index: the pre-split /effects
                  gallery and the removed animation guide. */}
              <Route path="effects" element={<Navigate to="/animation" replace />} />
              <Route path="docs/effects-guide" element={<Navigate to="/animation" replace />} />
              <Route path="playground" element={<PlaygroundPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CodeStyleProvider>
  );
}
