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
import { ColorsPage } from '../pages/tokens/ColorsPage';
import { TypographyPage } from '../pages/tokens/TypographyPage';
import { SpacingPage } from '../pages/tokens/SpacingPage';
import { MotionPage } from '../pages/tokens/MotionPage';
import { PlaygroundPage } from '../pages/playground/PlaygroundPage';
import { EffectsGalleryPage } from '../pages/effects/EffectsGalleryPage';
import { EffectsGuidePage } from '../pages/docs/EffectsGuidePage';

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
              <Route path="docs/tokens/colors" element={<ColorsPage />} />
              <Route path="docs/tokens/typography" element={<TypographyPage />} />
              <Route path="docs/tokens/spacing" element={<SpacingPage />} />
              <Route path="docs/tokens/motion" element={<MotionPage />} />
              <Route path="docs/effects-guide" element={<EffectsGuidePage />} />
              <Route path="components" element={<ComponentsIndexPage />} />
              <Route path="components/:id" element={<ComponentPage />} />
              <Route path="effects" element={<EffectsGalleryPage />} />
              <Route path="playground" element={<PlaygroundPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CodeStyleProvider>
  );
}
