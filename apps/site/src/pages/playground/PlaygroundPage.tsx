import { useState, type CSSProperties } from 'react';
import {
  Badge,
  Button,
  Card,
  Input,
  PageHeader,
  Progress,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Tabs,
  Tag,
  Text,
} from '@fj';
import { DocSection } from '../../docs/DocSection';
import { CodeBlock } from '../../docs/CodeBlock';
import { usePageTitle } from '../../lib/usePageTitle';

type Accent = 'coral' | 'sun' | 'bloom';
type Radius = 'crisp' | 'default' | 'soft';

/** Token overrides per accent — everything stays inside the FJ ramps. */
const ACCENT_VARS: Record<Accent, Record<string, string>> = {
  coral: {},
  sun: {
    '--accent': 'var(--sun-500)',
    '--accent-hover': 'var(--sun-700)',
    '--accent-press': 'var(--sun-700)',
    '--accent-soft': 'var(--sun-100)',
    '--border-focus': 'var(--sun-500)',
    '--ring': '0 0 0 3px var(--sun-300)',
    /* literal: sun fills need dark text even under a theme that flips var(--ink) */
    '--text-on-accent': '#1C1C1A',
  },
  bloom: {
    '--accent': 'var(--bloom-500)',
    '--accent-hover': 'var(--bloom-700)',
    '--accent-press': 'var(--bloom-700)',
    '--accent-soft': 'var(--bloom-100)',
    '--border-focus': 'var(--bloom-500)',
    '--ring': '0 0 0 3px var(--bloom-300)',
    '--text-on-accent': 'var(--white)',
  },
};

const RADIUS_VARS: Record<Radius, Record<string, string>> = {
  crisp: {
    '--radius-xs': '2px',
    '--radius-sm': '5px',
    '--radius-md': '8px',
    '--radius-lg': '12px',
    '--radius-xl': '18px',
  },
  default: {},
  soft: {
    '--radius-xs': '6px',
    '--radius-sm': '10px',
    '--radius-md': '16px',
    '--radius-lg': '24px',
    '--radius-xl': '34px',
  },
};

function overrideSnippet(accent: Accent, radius: Radius): string {
  const vars = { ...ACCENT_VARS[accent], ...RADIUS_VARS[radius] };
  const entries = Object.entries(vars);
  if (entries.length === 0) {
    return `/* Free Joy defaults — no overrides needed. */`;
  }
  return `/* Load after @fj/styles.css */\n:root {\n${entries
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n')}\n}`;
}

function SampleApp() {
  const [tab, setTab] = useState('publish');
  const [quiet, setQuiet] = useState(true);
  return (
    <Stack gap={20}>
      <Stack direction="row" gap={12} align="center" justify="space-between" wrap>
        <Tabs
          items={[
            { id: 'publish', label: 'Publish' },
            { id: 'drafts', label: 'Drafts' },
            { id: 'circle', label: 'Circle' },
          ]}
          value={tab}
          onChange={setTab}
        />
        <Stack direction="row" gap={8} align="center">
          <Badge tone="accent">New</Badge>
          <Tag accent="coral" dot>
            Sketchbook
          </Tag>
        </Stack>
      </Stack>
      <Card>
        <Stack gap={16}>
          <Text variant="h4" as="h3">
            Publish a sketch
          </Text>
          <Input label="Title" defaultValue="Morning pages" />
          <Select label="Share with" options={['Only me', 'My circle', 'Anyone with the link']} />
          <Switch checked={quiet} onChange={setQuiet} label="Quiet mode — no notifications" />
          <Progress value={66} showLabel aria-label="Upload progress" />
          <Stack direction="row" gap={10} justify="flex-end">
            <Button variant="secondary">Save draft</Button>
            <Button>Publish quietly</Button>
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
}

export function PlaygroundPage() {
  usePageTitle('Theme playground');
  const [accent, setAccent] = useState<Accent>('coral');
  const [radius, setRadius] = useState<Radius>('default');

  const vars = { ...ACCENT_VARS[accent], ...RADIUS_VARS[radius] } as CSSProperties;

  return (
    <article>
      <PageHeader
        eyebrow="Playground"
        title="Theme playground"
        description="Retheme the system with controlled, token-bound knobs. Everything stays inside FJ's design rules — no arbitrary styling."
      />
      <div className="playground">
        <aside className="showcase-side playground-side" aria-label="Theme knobs">
          <span className="fj-eyebrow">Theme</span>
          <div className="control-panel">
            <div className="control-row">
              <span className="control-label">accent</span>
              <SegmentedControl
                size="sm"
                full
                options={[
                  { value: 'coral', label: 'Coral' },
                  { value: 'sun', label: 'Sun' },
                  { value: 'bloom', label: 'Bloom' },
                ]}
                value={accent}
                onChange={(value) => setAccent(value as Accent)}
              />
            </div>
            <div className="control-row">
              <span className="control-label">radius</span>
              <SegmentedControl
                size="sm"
                full
                options={[
                  { value: 'crisp', label: 'Crisp' },
                  { value: 'default', label: 'Default' },
                  { value: 'soft', label: 'Soft' },
                ]}
                value={radius}
                onChange={(value) => setRadius(value as Radius)}
              />
            </div>
          </div>
        </aside>
        <div className="playground-stage-wrap">
          <div className="playground-stage" style={vars}>
            <SampleApp />
          </div>
        </div>
      </div>
      <DocSection id="override" title="Your override">
        <p className="doc-note">
          Copy this into a stylesheet loaded after <code>@fj/styles.css</code>. Accents remap the
          semantic aliases to another FJ ramp; radii move in small, sanctioned steps. Interactive
          pills stay pills.
        </p>
        <CodeBlock code={overrideSnippet(accent, radius)} lang="css" />
      </DocSection>
      <DocSection id="rules" title="What the playground will not do">
        <ul className="doc-list">
          <li>No arbitrary hex values — accents come from the Joy, Sun, and Bloom ramps.</li>
          <li>No density knob: component paddings are fixed by design, not tokens.</li>
          <li>No motion overrides — durations and easings are system-wide decisions.</li>
        </ul>
      </DocSection>
    </article>
  );
}
