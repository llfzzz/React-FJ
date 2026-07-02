import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { ThemeProvider } from '../lib/theme';
import { SiteLayout, DocsLayout } from './layouts';
import { LandingPage } from '../pages/landing/LandingPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { StubPage } from '../pages/StubPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function DocStub() {
  const { slug = '' } = useParams();
  const title = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') : 'Docs';
  return <StubPage title={title} />;
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
              <Route path="docs/:slug" element={<DocStub />} />
              <Route path="components" element={<StubPage title="Components" />} />
              <Route path="playground" element={<StubPage title="Playground" />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
