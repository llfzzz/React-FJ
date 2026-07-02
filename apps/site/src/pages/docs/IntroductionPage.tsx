import { Link } from 'react-router-dom';
import { Badge, PageHeader, Stack, Text } from '@fj';
import { DocSection } from '../../docs/DocSection';
import { CATEGORY_LABELS, presentCategories, REGISTRY } from '../../registry';
import { usePageTitle } from '../../lib/usePageTitle';

export function IntroductionPage() {
  usePageTitle('Introduction');
  return (
    <article>
      <PageHeader
        eyebrow="Get started"
        title="Introduction"
        description="Free Joy is a minimalist component library inspired by youth, individuality, and quiet confidence."
      />

      <DocSection id="what" title="What Free Joy is">
        <div className="doc-prose">
          <p>
            FJ balances expressive energy with refined simplicity: clean layouts, generous spacing,
            modular components, and subtle details that feel free rather than flashy. It ships as
            React components on top of a token-driven CSS foundation — theme once, and every
            surface follows.
          </p>
          <p>
            The system is opinionated on purpose. One warm accent (Joy Coral) is reserved for
            interactive affordances. Type is editorial: Bricolage Grotesque for display, Hanken
            Grotesk for reading, JetBrains Mono for code and eyebrow labels. Motion is quick and
            gentle — and always respects reduced-motion preferences.
          </p>
        </div>
      </DocSection>

      <DocSection id="principles" title="Principles">
        <ul className="doc-list">
          <li>Paper and ink neutrals; the accent lives inside interactive elements only.</li>
          <li>Hairline borders before shadows; shadows stay soft and warm.</li>
          <li>Pills for interactive shapes; 12–18px radii for content surfaces.</li>
          <li>Sections breathe — the spacing scale leans on its upper end.</li>
          <li>Decorative motion is confined to the effects family, one flagship per view.</li>
          <li>Sentence case everywhere; the mono uppercase eyebrow is the only exception.</li>
        </ul>
      </DocSection>

      <DocSection id="families" title="Component families">
        <div className="doc-prose">
          <p>
            {REGISTRY.length} components are documented so far, organized by family. The catalog
            grows steadily — undocumented upstream components are pulled in as their pages are
            written.
          </p>
        </div>
        <Stack direction="row" gap={10} wrap style={{ marginTop: 'var(--space-3)' }}>
          {presentCategories().map((category) => (
            <Badge key={category} tone="accent">
              {CATEGORY_LABELS[category]}
            </Badge>
          ))}
        </Stack>
        <Text variant="small" style={{ marginTop: 'var(--space-4)' }}>
          Head to the <Link to="/components">catalog</Link> to browse them all, or continue to{' '}
          <Link to="/docs/installation">installation</Link>.
        </Text>
      </DocSection>
    </article>
  );
}
