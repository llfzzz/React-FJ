import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Alert, Button, PageHeader } from '@fj';
import { DocSection } from '../../docs/DocSection';
import { usePageTitle } from '../../lib/usePageTitle';
import { TokenName } from './tokenHelpers';

const DURATIONS = [
  { name: '--dur-instant', ms: 80, note: 'micro state flips' },
  { name: '--dur-fast', ms: 120, note: 'buttons, inputs' },
  { name: '--dur-base', ms: 200, note: 'cards, dropdowns, dialogs' },
  { name: '--dur-slow', ms: 360, note: 'drawers, page sections' },
  { name: '--dur-slower', ms: 640, note: 'reveals & hero entrances' },
];

const EASINGS = [
  { name: '--ease-out', note: 'default UI' },
  { name: '--ease-in-out', note: 'movement A→B' },
  { name: '--ease-in', note: 'exits' },
  { name: '--ease-emphasized', note: 'hero / reveal entrances' },
  { name: '--ease-spring', note: 'thumbs & toggles only' },
];

export function MotionPage() {
  usePageTitle('Motion tokens');
  const [run, setRun] = useState(0);
  return (
    <article>
      <PageHeader
        eyebrow="Design tokens"
        title="Motion"
        description="Quick and gentle: fades and small translates, no bounce, no parallax. Decorative loops live only in the effects family."
        actions={
          <Button variant="secondary" size="sm" iconLeft={<RotateCcw size={14} aria-hidden />} onClick={() => setRun((r) => r + 1)}>
            Replay all
          </Button>
        }
      />
      <DocSection id="durations" title="Durations">
        <div className="motion-rows" key={`dur-${run}`}>
          {DURATIONS.map((duration) => (
            <div className="motion-row" key={duration.name}>
              <div className="type-scale-meta">
                <TokenName name={duration.name} />
                <span className="token-note">
                  {duration.ms}ms — {duration.note}
                </span>
              </div>
              <div className="motion-track">
                <span
                  className="motion-ball"
                  style={{ animation: `fj-demo-slide var(${duration.name}) var(--ease-out) 240ms both` }}
                  aria-hidden
                />
              </div>
            </div>
          ))}
        </div>
      </DocSection>
      <DocSection id="easings" title="Easings">
        <div className="motion-rows" key={`ease-${run}`}>
          {EASINGS.map((easing) => (
            <div className="motion-row" key={easing.name}>
              <div className="type-scale-meta">
                <TokenName name={easing.name} />
                <span className="token-note">{easing.note}</span>
              </div>
              <div className="motion-track">
                <span
                  className="motion-ball"
                  style={{ animation: `fj-demo-slide 900ms var(${easing.name}) 240ms both` }}
                  aria-hidden
                />
              </div>
            </div>
          ))}
        </div>
      </DocSection>
      <DocSection id="stagger" title="Stagger — 45ms per index">
        <div className="motion-stagger" key={`stagger-${run}`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              className="motion-dot"
              style={{ animation: `fj-demo-pop 480ms var(--ease-emphasized) calc(240ms + var(--stagger) * ${index}) both` }}
              aria-hidden
            />
          ))}
        </div>
      </DocSection>
      <DocSection id="reduced" title="Reduced motion">
        <Alert tone="info" title="A global kill switch, not per-component opt-ins">
          Under prefers-reduced-motion every animation and transition collapses to a near-instant
          step (tokens/base.css), and JS-driven effects check matchMedia themselves. Turn the OS
          setting on and every demo above simply shows its end state.
        </Alert>
      </DocSection>
    </article>
  );
}
