import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Layers, MousePointerClick, SwatchBook, Wind } from 'lucide-react';
import {
  AmbientBackground,
  AnimatedBorder,
  Avatar,
  Badge,
  Button,
  Card,
  CountUp,
  Grid,
  Kbd,
  Reveal,
  Spinner,
  SpotlightCard,
  Stack,
  StatusDot,
  Tag,
  Text,
  TextReveal,
} from '@fj';
import { GradientText, GridPattern, Magnetic } from '@fj-effects';
import { usePageTitle } from '../../lib/usePageTitle';
import { effectDocs, presentCategories, REGISTRY } from '../../registry';

const STATS = [
  { value: REGISTRY.length, label: 'documented components' },
  { value: presentCategories().length, label: 'component families' },
  { value: effectDocs().length, label: 'animations' },
];

const PRINCIPLES = [
  {
    icon: MousePointerClick,
    title: 'One vivid accent',
    body: 'Joy Coral lives inside buttons, links, and selection — so a tap target is always obvious.',
  },
  {
    icon: SwatchBook,
    title: 'Tokens first',
    body: 'Every color, radius, shadow, and duration is a CSS custom property. Theme once, everywhere.',
  },
  {
    icon: Layers,
    title: 'Frosted glass, quiet depth',
    body: 'Bars and panels rest on translucent glass and hairline borders — depth without heavy shadows or glare.',
  },
  {
    icon: Wind,
    title: 'Animation that respects you',
    body: '80–640 ms, gentle easings, reduced-motion aware. No bounce, no parallax, no theatre.',
  },
];

function PeekCard({ title, to, children }: { title: string; to: string; children: ReactNode }) {
  return (
    <Link to={to} className="peek-link">
      <Card interactive style={{ height: '100%' }}>
        <Stack gap={16}>
          <Text variant="eyebrow">{title}</Text>
          <div className="peek-body">{children}</div>
        </Stack>
      </Card>
    </Link>
  );
}

export function LandingPage() {
  usePageTitle();
  return (
    <>
      <AmbientBackground variant="warm" style={{ marginTop: -64, paddingTop: 64 }}>
        <GridPattern type="dot" size={26} opacity={0.35}>
          <section className="hero container">
            <Reveal>
              <Text variant="eyebrow">Free Joy design system</Text>
            </Reveal>
            <h1 className="hero-title">
              <TextReveal text="A calm home for your" />{' '}
              <GradientText>interface</GradientText>.
            </h1>
          <Reveal delay={240}>
            <p className="hero-lead">
              Free Joy is a minimalist component library with quiet confidence — clean layouts,
              generous spacing, and details that feel free rather than flashy.
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="hero-actions">
              <Magnetic>
                <Link to="/docs/introduction" className="btn btn-primary btn-lg">
                  Get started
                </Link>
              </Magnetic>
              <Link to="/components" className="btn btn-secondary btn-lg">
                Browse components
              </Link>
            </div>
          </Reveal>
          <Reveal delay={480}>
            <dl className="hero-stats">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <dt className="hero-stat-value">
                    <CountUp value={stat.value} />
                  </dt>
                  <dd className="hero-stat-label">{stat.label}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          </section>
        </GridPattern>
      </AmbientBackground>

      <section className="landing-section container">
        <Reveal>
          <div className="section-head">
            <Text variant="eyebrow">Why Free Joy</Text>
            <h2 className="section-title">
              Built for the making, not the metrics.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <Grid min={250} gap={20}>
            {PRINCIPLES.map((p) => (
              <SpotlightCard key={p.title} style={{ height: '100%' }}>
                <Stack gap={12}>
                  <span className="principle-icon" aria-hidden>
                    <p.icon size={20} />
                  </span>
                  <Text variant="h4" as="h3">
                    {p.title}
                  </Text>
                  <Text variant="small">{p.body}</Text>
                </Stack>
              </SpotlightCard>
            ))}
          </Grid>
        </Reveal>
      </section>

      <section className="landing-section container">
        <Reveal>
          <div className="section-head">
            <Text variant="eyebrow">A quick look</Text>
            <h2 className="section-title">
              Real components, living quietly.
            </h2>
            <Text variant="lead">Every piece below is the actual library — hover, press, look around.</Text>
          </div>
        </Reveal>
        <Reveal>
          <Grid min={280} gap={20}>
            <PeekCard title="Buttons" to="/components">
              <Stack direction="row" gap={10} wrap align="center">
                <Button size="sm">Start free</Button>
                <Button size="sm" variant="secondary">
                  Preview
                </Button>
                <Button size="sm" variant="ghost">
                  Skip
                </Button>
                <Button size="sm" loading>
                  Saving
                </Button>
              </Stack>
            </PeekCard>
            <PeekCard title="Badges and tags" to="/components">
              <Stack direction="row" gap={10} wrap align="center">
                <Badge tone="accent">New</Badge>
                <Badge tone="success">Published</Badge>
                <Badge tone="warn">Draft</Badge>
                <Tag accent="bloom" dot>
                  Sketchbook
                </Tag>
                <Tag accent="sun">Weekly</Tag>
              </Stack>
            </PeekCard>
            <PeekCard title="People and presence" to="/components">
              <Stack direction="row" gap={16} align="center">
                <Avatar name="June Ito" />
                <Avatar name="Ana Reyes" />
                <Stack gap={8}>
                  <StatusDot tone="online" label="In the studio" />
                  <StatusDot tone="away" label="Stepped out" />
                </Stack>
              </Stack>
            </PeekCard>
            <PeekCard title="Keys and loading" to="/components">
              <Stack direction="row" gap={16} align="center" wrap>
                <Kbd keys={['⌘', 'K']} />
                <Kbd keys={['Shift', 'Enter']} size="sm" />
                <Spinner size={18} label="Uploading" />
              </Stack>
            </PeekCard>
            <PeekCard title="Editorial type" to="/components">
              <Stack gap={6}>
                <Text variant="h3" as="p">
                  Sketchbooks are here
                </Text>
                <Text variant="small">Share work-in-progress with people who care.</Text>
              </Stack>
            </PeekCard>
            <PeekCard title="Status feedback" to="/components">
              <Stack gap={10}>
                <StatusDot tone="success" pulse label="All services calm" />
                <StatusDot tone="danger" label="One upload failed" />
              </Stack>
            </PeekCard>
          </Grid>
        </Reveal>
      </section>

      <section className="landing-section container">
        <Reveal>
          <AnimatedBorder radius="var(--radius-xl)" padding="var(--space-6)">
            <div className="cta-band">
              <Stack gap={10}>
                <Text variant="h3" as="h2">
                  Start with the docs.
                </Text>
                <Text variant="small">
                  Installation, tokens, theming, and a playground for every component.
                </Text>
              </Stack>
              <Link to="/docs/installation" className="btn btn-primary">
                Read the docs
              </Link>
            </div>
          </AnimatedBorder>
        </Reveal>
      </section>
    </>
  );
}
