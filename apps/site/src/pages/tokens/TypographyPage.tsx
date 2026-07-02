import { PageHeader } from '@fj';
import { DocSection } from '../../docs/DocSection';
import { usePageTitle } from '../../lib/usePageTitle';
import { TokenName } from './tokenHelpers';

const SCALE = [
  { name: '--text-5xl', px: 88, sample: 'Aa' },
  { name: '--text-4xl', px: 64, sample: 'Aa' },
  { name: '--text-3xl', px: 48, sample: 'Quiet confidence' },
  { name: '--text-2xl', px: 36, sample: 'Quiet confidence' },
  { name: '--text-xl', px: 28, sample: 'Quiet confidence' },
  { name: '--text-lg', px: 22, sample: 'Built for the making, not the metrics.' },
  { name: '--text-md', px: 18, sample: 'Built for the making, not the metrics.' },
  { name: '--text-base', px: 16, sample: 'Built for the making, not the metrics.' },
  { name: '--text-sm', px: 14, sample: 'Built for the making, not the metrics.' },
  { name: '--text-xs', px: 12, sample: 'Built for the making, not the metrics.' },
];

const FAMILIES = [
  {
    token: '--font-display',
    label: 'Display — Bricolage Grotesque',
    sample: 'A calm home for your creative practice.',
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--text-2xl)',
      fontWeight: 600,
      letterSpacing: 'var(--tracking-tight)',
      lineHeight: 'var(--leading-tight)',
    },
  },
  {
    token: '--font-text',
    label: 'Text — Hanken Grotesk',
    sample: 'Publish work-in-progress, keep sketchbooks, and share in quiet circles. Calm reading at 1.5–1.65 leading.',
    style: { fontFamily: 'var(--font-text)', fontSize: 'var(--text-md)', lineHeight: 'var(--leading-relaxed)' },
  },
  {
    token: '--font-mono',
    label: 'Mono — JetBrains Mono',
    sample: 'PUBLISHED QUIETLY — 2026-07-03 09:41',
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      letterSpacing: 'var(--tracking-caps)',
      textTransform: 'uppercase' as const,
      color: 'var(--text-subtle)',
    },
  },
];

const WEIGHTS = [
  { name: '--weight-regular', value: 400 },
  { name: '--weight-medium', value: 500 },
  { name: '--weight-semibold', value: 600 },
  { name: '--weight-bold', value: 700 },
];

export function TypographyPage() {
  usePageTitle('Typography tokens');
  return (
    <article>
      <PageHeader
        eyebrow="Design tokens"
        title="Typography"
        description="Characterful display, friendly text, mono punctuation. Sentence case everywhere — the eyebrow is the only uppercase."
      />
      <DocSection id="families" title="Families">
        <div className="type-specimens">
          {FAMILIES.map((family) => (
            <div className="type-specimen" key={family.token}>
              <div className="type-specimen-head">
                <span className="token-note">{family.label}</span>
                <TokenName name={family.token} />
              </div>
              <p style={family.style}>{family.sample}</p>
            </div>
          ))}
        </div>
      </DocSection>
      <DocSection id="scale" title="Scale — editorial, confident jumps">
        <div className="type-scale">
          {SCALE.map((step) => (
            <div className="type-scale-row" key={step.name}>
              <div className="type-scale-meta">
                <TokenName name={step.name} />
                <span className="token-note">{step.px}px</span>
              </div>
              <p
                style={{
                  fontFamily: step.px >= 28 ? 'var(--font-display)' : 'var(--font-text)',
                  fontSize: `var(${step.name})`,
                  fontWeight: step.px >= 28 ? 600 : 400,
                  lineHeight: step.px >= 28 ? 1.05 : 1.4,
                  letterSpacing: step.px >= 28 ? 'var(--tracking-tight)' : undefined,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {step.sample}
              </p>
            </div>
          ))}
        </div>
      </DocSection>
      <DocSection id="weights" title="Weights">
        <div className="type-scale">
          {WEIGHTS.map((weight) => (
            <div className="type-scale-row" key={weight.name}>
              <div className="type-scale-meta">
                <TokenName name={weight.name} />
                <span className="token-note">{weight.value}</span>
              </div>
              <p style={{ fontSize: 'var(--text-lg)', fontWeight: weight.value }}>
                Made quietly, weighed carefully.
              </p>
            </div>
          ))}
        </div>
      </DocSection>
    </article>
  );
}
