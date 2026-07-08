import { PageHeader } from '@fj';
import { DocSection } from '../../docs/DocSection';
import { usePageTitle } from '../../lib/usePageTitle';
import { ColorToken, TokenGrid } from './tokenHelpers';

const NEUTRALS = [
  { name: '--paper', note: 'page background' },
  { name: '--paper-2', note: 'sunken / subtle fill' },
  { name: '--paper-3', note: 'hovered surface' },
  { name: '--ink', note: 'primary text' },
  { name: '--ink-2', note: 'secondary text' },
  { name: '--ink-3', note: 'muted / placeholder' },
  { name: '--ink-4', note: 'faint / disabled' },
  { name: '--line', note: 'hairline border' },
  { name: '--line-strong', note: 'emphasized border' },
];

const JOY = ['--joy-50', '--joy-100', '--joy-200', '--joy-300', '--joy-400', '--joy-500', '--joy-600', '--joy-700'];
const SUN = ['--sun-100', '--sun-300', '--sun-500', '--sun-700'];
const BLOOM = ['--bloom-100', '--bloom-300', '--bloom-500', '--bloom-700'];

const SEMANTIC = [
  '--success-100', '--success-500', '--success-700',
  '--warn-100', '--warn-500', '--warn-700',
  '--danger-100', '--danger-500', '--danger-700',
  '--info-100', '--info-500', '--info-700',
];

const ALIASES = [
  { name: '--bg', note: 'page background' },
  { name: '--surface', note: 'raised surface' },
  { name: '--surface-2', note: 'muted surface' },
  { name: '--surface-hover', note: 'hovered surface' },
  { name: '--text', note: 'primary text' },
  { name: '--text-muted', note: 'secondary text' },
  { name: '--text-subtle', note: 'muted text' },
  { name: '--text-disabled', note: 'disabled text' },
  { name: '--border', note: 'default border' },
  { name: '--border-strong', note: 'emphasized border' },
  { name: '--accent', note: 'interactive accent' },
  { name: '--accent-hover', note: 'accent hover' },
  { name: '--accent-press', note: 'accent pressed' },
  { name: '--accent-soft', note: 'accent wash' },
  { name: '--overlay', note: 'dialog backdrop' },
  { name: '--overlay-heavy', note: 'immersive backdrop' },
];

const CHART = ['--chart-1', '--chart-2', '--chart-3', '--chart-4', '--chart-5', '--chart-6'];

export function ColorsPage() {
  usePageTitle('Color tokens');
  return (
    <article>
      <PageHeader
        eyebrow="Design tokens"
        title="Colors"
        description="Warm paper, soft ink, one vivid accent. Every value below is read live from the running stylesheet."
      />
      <DocSection id="aliases" title="Semantic aliases (use these)">
        <p className="doc-note">
          Components read the aliases, never the raw ramps — that is what makes retheming and
          re-accenting possible.
        </p>
        <TokenGrid>
          {ALIASES.map((token) => (
            <ColorToken key={token.name} {...token} />
          ))}
        </TokenGrid>
      </DocSection>
      <DocSection id="neutrals" title="Neutrals — paper and ink">
        <TokenGrid>
          {NEUTRALS.map((token) => (
            <ColorToken key={token.name} {...token} />
          ))}
        </TokenGrid>
      </DocSection>
      <DocSection id="joy" title="Joy Coral — the accent ramp">
        <TokenGrid>
          {JOY.map((name) => (
            <ColorToken key={name} name={name} />
          ))}
        </TokenGrid>
      </DocSection>
      <DocSection id="support" title="Sun and Bloom — small punctuation only">
        <TokenGrid>
          {[...SUN, ...BLOOM].map((name) => (
            <ColorToken key={name} name={name} />
          ))}
        </TokenGrid>
      </DocSection>
      <DocSection id="semantic" title="Semantic ramps">
        <TokenGrid>
          {SEMANTIC.map((name) => (
            <ColorToken key={name} name={name} />
          ))}
        </TokenGrid>
      </DocSection>
      <DocSection id="chart" title="Chart ramp (use in order)">
        <TokenGrid>
          {CHART.map((name) => (
            <ColorToken key={name} name={name} />
          ))}
        </TokenGrid>
      </DocSection>
    </article>
  );
}
