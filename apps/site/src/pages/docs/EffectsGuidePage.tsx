import { Link } from 'react-router-dom';
import { Alert, Badge, PageHeader, Stack } from '@fj';
import { DocSection } from '../../docs/DocSection';
import { usePageTitle } from '../../lib/usePageTitle';

const PERF_RULES = [
  'Animate only transform and opacity — never width/height/top/left — so effects never trigger layout or reflow.',
  'No parallax, no flashing, no bounce outside a tiny spring on toggles.',
  'Blur radii and particle counts are hard-capped (Sparkles ≤ 24 DOM nodes; ConfettiBurst ≤ 40 pieces).',
  'A performance="lite" prop trims cost where it counts: Sparkles halves its count, Aurora lowers blur, TiltCard drops its glare layer, ConfettiBurst caps at 20.',
  'Decorative loops live only in the effects family — never in dense product UI.',
];

const A11Y_RULES = [
  'Decorative layers (glows, ribbons, particles, sheens) are aria-hidden and pointer-transparent.',
  'Text effects keep the full, readable string as the accessible name (aria-label); the animated fragments are hidden.',
  'Status effects expose the right role — SuccessCheck is role="img" with a label, LoaderDots and ScrollProgress use role="status"/"progressbar".',
  'Focus is never animated away, and nothing relies on color or motion as the only signal.',
];

const REDUCED = [
  'A global CSS kill switch (tokens/base.css) collapses every CSS animation and transition under prefers-reduced-motion.',
  'That switch can’t stop JavaScript motion (requestAnimationFrame loops, timers, pointer tracking), so every effect that runs such logic also checks useReducedMotion() and renders an explicit static fallback.',
  'Fallbacks are meaningful, not blank: CountUp shows the final number, TextReveal shows plain text, Aurora keeps its wash but stops drifting, ConfettiBurst simply doesn’t fire (and still calls onDone).',
];

const REFERENCES = [
  { name: 'React Bits', license: 'MIT', use: 'Inspiration for the effects catalog and individual effect ideas only — no source, assets, branding, or pages were copied.' },
  { name: 'Lucide', license: 'ISC', use: 'Icons throughout the site chrome and some components.' },
  { name: 'Shiki', license: 'MIT', use: 'Syntax highlighting in the code blocks.' },
  { name: 'Fontsource (Bricolage Grotesque, Hanken Grotesk, JetBrains Mono)', license: 'OFL', use: 'Self-hosted variable typefaces.' },
];

export function EffectsGuidePage() {
  usePageTitle('Motion & effects guide');
  return (
    <article>
      <PageHeader
        eyebrow="Effects & Motion"
        title="Motion & effects guide"
        description="How FJ uses motion: where it belongs, the performance and accessibility rules every effect follows, and how reduced motion is handled."
      />

      <DocSection id="philosophy" title="Where motion belongs">
        <div className="doc-prose">
          <p>
            Richer motion is welcome on the landing page, hero sections, the{' '}
            <Link to="/effects">effects gallery</Link>, empty states, onboarding, and a few featured
            cards. Business-like documentation — props tables, search results, dense content — stays
            restrained. The goal is a site that feels alive without ever getting in the way of
            reading or getting work done.
          </p>
        </div>
      </DocSection>

      <DocSection id="inventory" title="What exists">
        <div className="doc-prose">
          <p>
            The <strong>fj-effects</strong> package adds {23} configurable effects on top of the
            seven original FJ effects and the built-in micro-motion already in components like
            Spinner, Progress, Skeleton, Toast, and Modal. They’re grouped into six families —
            browse them all in the <Link to="/effects">gallery</Link>.
          </p>
          <Stack direction="row" gap={8} wrap>
            <Badge tone="accent">Text effects</Badge>
            <Badge tone="accent">Interaction</Badge>
            <Badge tone="accent">Surfaces</Badge>
            <Badge tone="accent">Backgrounds</Badge>
            <Badge tone="accent">Status effects</Badge>
            <Badge tone="accent">Motion &amp; transitions</Badge>
          </Stack>
        </div>
      </DocSection>

      <DocSection id="performance" title="Performance rules">
        <ul className="doc-list">
          {PERF_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="accessibility" title="Accessibility rules">
        <ul className="doc-list">
          {A11Y_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="reduced-motion" title="Reduced motion">
        <Alert tone="info" title="Graceful static fallbacks, not just a kill switch">
          Every effect degrades to a meaningful still state when the reader asks for reduced motion.
        </Alert>
        <ul className="doc-list">
          {REDUCED.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
      </DocSection>

      <DocSection id="config" title="Consistent configuration">
        <div className="doc-prose">
          <p>
            Effects share a small, predictable prop vocabulary so they’re easy to learn:{' '}
            <code>duration</code>, <code>delay</code>, <code>easing</code> (an FJ easing token),{' '}
            <code>trigger</code> (mount / inview / hover / click / manual), <code>loop</code>,{' '}
            <code>speed</code>, <code>intensity</code>, <code>performance</code>, and{' '}
            <code>disabled</code> — each applied where it makes sense. Colors, radii, shadows, and
            timings all come from FJ tokens, so effects stay on-brand in both themes.
          </p>
        </div>
      </DocSection>

      <DocSection id="references" title="References & licenses">
        <div className="doc-prose">
          <p>
            FJ’s visual identity is the source of truth. External work is used as inspiration or
            under a compatible license, never copied:
          </p>
        </div>
        <ul className="doc-list">
          {REFERENCES.map((ref) => (
            <li key={ref.name}>
              <strong>{ref.name}</strong> <Badge>{ref.license}</Badge> — {ref.use}
            </li>
          ))}
        </ul>
      </DocSection>
    </article>
  );
}
