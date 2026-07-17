import {
  AnimatedUnderline,
  BlurReveal,
  GradientText,
  Highlighter,
  RotatingText,
  ScrambleText,
  Typewriter,
  WaveText,
  type AnimatedUnderlineProps,
  type BlurRevealProps,
  type HighlighterProps,
  type RotatingTextProps,
  type ScrambleTextProps,
  type TypewriterProps,
  type WaveTextProps,
} from '@fj-effects';
import { Text } from '@fj';
import type { ComponentDoc, ControlValues } from '../types';
import { impl } from '../impl';

/** Remount on knob change so entrance effects replay. */
const replayKey = (values: ControlValues) => JSON.stringify(values);

export const gradientTextDoc: ComponentDoc = {
  id: 'gradient-text',
  name: 'GradientText',
  category: 'effects-text',
  blurb: 'A heading painted with a slow-moving FJ gradient — for hero words, not body copy.',
  keywords: ['gradient', 'text', 'animation', 'hero', 'motion'],
  importLine: "import { GradientText } from '@fj-effects';",
  implementation: impl('gradient-text'),
  replayable: true,
  controls: [
    { type: 'text', prop: 'children', label: 'Text', defaultValue: 'made with joy' },
    { type: 'number', prop: 'duration', label: 'Seconds / loop', defaultValue: 6, min: 2, max: 16, step: 1 },
    { type: 'number', prop: 'angle', defaultValue: 100, min: 0, max: 180, step: 10 },
    { type: 'boolean', prop: 'loop', defaultValue: true },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)' }}>
      <GradientText duration={Number(v.duration)} angle={Number(v.angle)} loop={Boolean(v.loop)}>
        {String(v.children)}
      </GradientText>
    </span>
  ),
  code: (v) =>
    `<GradientText${v.duration !== 6 ? ` duration={${Number(v.duration)}}` : ''}${
      v.angle !== 100 ? ` angle={${Number(v.angle)}}` : ''
    }${v.loop === false ? ' loop={false}' : ''}>\n  ${String(v.children)}\n</GradientText>`,
  props: [
    { name: 'colors', type: 'string[]', defaultValue: 'coral→bloom→sun', description: 'Gradient stops (FJ tokens or CSS colors).' },
    { name: 'duration', type: 'number', defaultValue: '6', description: 'Seconds per loop.' },
    { name: 'angle', type: 'number', defaultValue: '100', description: 'Gradient angle in degrees.' },
    { name: 'loop', type: 'boolean', defaultValue: 'true', description: 'Keep the gradient moving.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Render plain text, no gradient.' },
  ],
  a11y: [
    'The text stays real, selectable text — the gradient is paint via background-clip.',
    'Reduced motion (or loop={false}) holds the gradient still; the color still reads.',
    'Reserve for short display text — gradient fills hurt readability on body copy.',
  ],
};

export const rotatingTextDoc: ComponentDoc = {
  id: 'rotating-text',
  name: 'RotatingText',
  category: 'effects-text',
  blurb: 'Cycles a slot of words with a gentle slide or fade — “Build something ___”.',
  keywords: ['rotating', 'words', 'cycle', 'animation', 'hero'],
  importLine: "import { RotatingText } from '@fj-effects';",
  implementation: impl('rotating-text', {
    stylingNeutral:
      'Cycling words is JavaScript state — the swap is animated inline, so there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  replayable: true,
  controls: [
    { type: 'select', prop: 'mode', options: ['slide', 'fade'], defaultValue: 'slide' },
    { type: 'number', prop: 'interval', label: 'ms / word', defaultValue: 2000, min: 800, max: 4000, step: 200 },
    { type: 'number', prop: 'duration', defaultValue: 400, min: 150, max: 800, step: 50 },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-semibold)' }}>
      Build something{' '}
      <span style={{ color: 'var(--accent)' }}>
        <RotatingText
          words={['playful', 'honest', 'yours', 'lasting']}
          mode={v.mode as RotatingTextProps['mode']}
          interval={Number(v.interval)}
          duration={Number(v.duration)}
        />
      </span>
    </span>
  ),
  code: (v) => `<RotatingText
  words={['playful', 'honest', 'yours', 'lasting']}${v.mode !== 'slide' ? `\n  mode="fade"` : ''}${
    v.interval !== 2000 ? `\n  interval={${Number(v.interval)}}` : ''
  }${v.duration !== 400 ? `\n  duration={${Number(v.duration)}}` : ''} />`,
  props: [
    { name: 'words', type: 'string[]', description: 'The words to cycle through.' },
    { name: 'interval', type: 'number', defaultValue: '2000', description: 'ms each word stays visible.' },
    { name: 'mode', type: '"slide" | "fade"', defaultValue: '"slide"', description: 'Enter/exit style.' },
    { name: 'duration', type: 'number', defaultValue: '400', description: 'Transition duration in ms.' },
    { name: 'pauseOnHover', type: 'boolean', defaultValue: 'true', description: 'Pause cycling while hovered.' },
  ],
  a11y: [
    'The slot is aria-live="polite" so each new word is announced calmly.',
    'Reduced motion drops the travel — words crossfade in place with no vertical slide.',
    'Keep the word list short and same-length-ish to avoid layout jitter.',
  ],
};

export const animatedUnderlineDoc: ComponentDoc = {
  id: 'animated-underline',
  name: 'AnimatedUnderline',
  category: 'effects-text',
  blurb: 'A restrained underline that draws in on hover or scroll — safe for docs links.',
  keywords: ['underline', 'link', 'hover', 'animation'],
  importLine: "import { AnimatedUnderline } from '@fj-effects';",
  implementation: impl('animated-underline'),
  replayable: true,
  controls: [
    { type: 'select', prop: 'trigger', options: ['hover', 'inview', 'mount'], defaultValue: 'hover' },
    { type: 'number', prop: 'thickness', defaultValue: 2, min: 1, max: 6, step: 1 },
    { type: 'number', prop: 'duration', defaultValue: 320, min: 120, max: 800, step: 40 },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ fontSize: 'var(--text-lg)' }}>
      Read the{' '}
      <AnimatedUnderline
        trigger={v.trigger as AnimatedUnderlineProps['trigger']}
        thickness={Number(v.thickness)}
        duration={Number(v.duration)}
        style={{ color: 'var(--accent)', cursor: 'pointer' }}
      >
        design principles
      </AnimatedUnderline>
    </span>
  ),
  code: (v) => `<AnimatedUnderline${v.trigger !== 'hover' ? ` trigger="${String(v.trigger)}"` : ''}${
    v.thickness !== 2 ? ` thickness={${Number(v.thickness)}}` : ''
  }>
  design principles
</AnimatedUnderline>`,
  props: [
    { name: 'trigger', type: '"hover" | "inview" | "mount"', defaultValue: '"hover"', description: 'When the underline draws in.' },
    { name: 'color', type: 'string', defaultValue: 'var(--accent)', description: 'Underline color.' },
    { name: 'thickness', type: 'number', defaultValue: '2', description: 'Line thickness in px.' },
    { name: 'offset', type: 'number', defaultValue: '2', description: 'Gap below the baseline in px.' },
    { name: 'duration', type: 'number', defaultValue: '320', description: 'Draw duration in ms.' },
  ],
  a11y: [
    'The underline is background paint, so it never affects the accessible name.',
    'Reduced motion shows the underline immediately with no draw-in.',
    'Pair with a real color/weight change on links — don’t rely on the underline alone.',
  ],
};

export const highlighterDoc: ComponentDoc = {
  id: 'highlighter',
  name: 'Highlighter',
  category: 'effects-text',
  blurb: 'A marker swipe fills in behind a phrase as it scrolls into view.',
  keywords: ['highlight', 'marker', 'emphasis', 'scroll', 'animation'],
  importLine: "import { Highlighter } from '@fj-effects';",
  implementation: impl('highlighter'),
  replayable: true,
  controls: [
    { type: 'select', prop: 'color', options: ['sun', 'coral', 'bloom'], defaultValue: 'sun' },
    { type: 'select', prop: 'trigger', options: ['inview', 'hover', 'mount'], defaultValue: 'mount' },
    { type: 'number', prop: 'duration', defaultValue: 480, min: 200, max: 1000, step: 40 },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ fontSize: 'var(--text-lg)', lineHeight: 1.8 }}>
      Free Joy keeps the interface calm so the{' '}
      <Highlighter
        color={v.color as HighlighterProps['color']}
        trigger={v.trigger as HighlighterProps['trigger']}
        duration={Number(v.duration)}
      >
        work stays loud
      </Highlighter>
      .
    </span>
  ),
  code: (v) => `<Highlighter${v.color !== 'sun' ? ` color="${String(v.color)}"` : ''}${
    v.trigger !== 'inview' ? ` trigger="${String(v.trigger)}"` : ''
  }>
  work stays loud
</Highlighter>`,
  props: [
    { name: 'color', type: '"sun" | "coral" | "bloom" | string', defaultValue: '"sun"', description: 'Highlight tone.' },
    { name: 'trigger', type: '"inview" | "hover" | "mount"', defaultValue: '"inview"', description: 'When the swipe plays.' },
    { name: 'delay', type: 'number', defaultValue: '0', description: 'Lead-in delay in ms.' },
    { name: 'duration', type: 'number', defaultValue: '480', description: 'Swipe duration in ms.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Plain text, no highlight.' },
  ],
  a11y: [
    'The highlight is background paint behind real text — contrast holds.',
    'Reduced motion shows the highlight already filled, with no swipe.',
    'Use sparingly — one highlighted phrase per passage keeps the emphasis meaningful.',
  ],
};

export const typewriterDoc: ComponentDoc = {
  id: 'typewriter',
  name: 'Typewriter',
  category: 'effects-text',
  blurb: 'Types a line character by character with a blinking caret — hero taglines, playful one-liners.',
  keywords: ['typewriter', 'typing', 'caret', 'terminal', 'text', 'animation'],
  importLine: "import { Typewriter } from '@fj-effects';",
  implementation: impl('typewriter', {
    stylingNeutral:
      'Typing slices the string in JavaScript one character at a time — there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  replayable: true,
  controls: [
    { type: 'text', prop: 'text', label: 'Text', defaultValue: 'Made with joy, typed live.' },
    { type: 'number', prop: 'interval', label: 'ms / char', defaultValue: 45, min: 20, max: 120, step: 5 },
    { type: 'boolean', prop: 'caret', defaultValue: true },
    { type: 'select', prop: 'trigger', options: ['mount', 'inview'], defaultValue: 'mount' },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-semibold)' }}>
      <Typewriter
        text={String(v.text)}
        interval={Number(v.interval)}
        caret={Boolean(v.caret)}
        trigger={v.trigger as TypewriterProps['trigger']}
      />
    </span>
  ),
  code: (v) => `<Typewriter text="${String(v.text)}"${v.interval !== 45 ? ` interval={${Number(v.interval)}}` : ''}${
    v.caret === false ? ' caret={false}' : ''
  }${v.trigger !== 'mount' ? ` trigger="${String(v.trigger)}"` : ''} />`,
  props: [
    { name: 'text', type: 'string', description: 'The string to type.' },
    { name: 'interval', type: 'number', defaultValue: '45', description: 'ms per character.' },
    { name: 'delay', type: 'number', defaultValue: '0', description: 'Lead-in delay in ms.' },
    { name: 'caret', type: 'boolean', defaultValue: 'true', description: 'Blinking caret while typing.' },
    { name: 'trigger', type: '"mount" | "inview" | "manual"', defaultValue: '"mount"', description: 'When to play.' },
    { name: 'onDone', type: '() => void', description: 'Called when the last character lands.' },
  ],
  a11y: [
    'The full line is exposed as an aria-label from the first frame — assistive tech never hears half a word.',
    'Reduced motion renders the finished line instantly; onDone still fires.',
    'Never gate meaning behind the animation finishing — taglines, not instructions.',
  ],
};

export const scrambleTextDoc: ComponentDoc = {
  id: 'scramble-text',
  name: 'ScrambleText',
  category: 'effects-text',
  blurb: 'Reveals a short display string left to right out of a churn of random characters.',
  keywords: ['scramble', 'decrypt', 'shuffle', 'glitch', 'text', 'animation'],
  importLine: "import { ScrambleText } from '@fj-effects';",
  implementation: impl('scramble-text', {
    stylingNeutral:
      'Each frame substitutes random characters generated in JavaScript — there is no stylesheet or utility set to switch. CSS and Tailwind show the same source.',
  }),
  replayable: true,
  controls: [
    { type: 'text', prop: 'text', label: 'Text', defaultValue: 'FREE JOY' },
    { type: 'number', prop: 'duration', defaultValue: 800, min: 300, max: 2000, step: 100 },
    { type: 'select', prop: 'trigger', options: ['mount', 'hover', 'inview'], defaultValue: 'mount' },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--weight-bold)', letterSpacing: '0.02em' }}>
      <ScrambleText
        text={String(v.text)}
        duration={Number(v.duration)}
        trigger={v.trigger as ScrambleTextProps['trigger']}
      />
    </span>
  ),
  code: (v) => `<ScrambleText text="${String(v.text)}"${v.duration !== 800 ? ` duration={${Number(v.duration)}}` : ''}${
    v.trigger !== 'mount' ? ` trigger="${String(v.trigger)}"` : ''
  } />`,
  props: [
    { name: 'text', type: 'string', description: 'The string to reveal.' },
    { name: 'duration', type: 'number', defaultValue: '800', description: 'Full-reveal duration in ms.' },
    { name: 'charset', type: 'string', defaultValue: 'A–Z a–z 0–9 #%&', description: 'Characters the scramble draws from.' },
    { name: 'trigger', type: '"mount" | "hover" | "inview" | "manual"', defaultValue: '"mount"', description: 'When to play.' },
    { name: 'onDone', type: '() => void', description: 'Called when the reveal finishes.' },
  ],
  a11y: [
    'The churning glyphs are aria-hidden; the root exposes the real text as an aria-label throughout.',
    'Reduced motion shows the plain text — no churn at all.',
    'Short display strings only — scrambled body copy is unreadable noise.',
  ],
};

export const blurRevealDoc: ComponentDoc = {
  id: 'blur-reveal',
  name: 'BlurReveal',
  category: 'effects-text',
  blurb: 'Words sharpen out of a soft blur with a small lift — an editorial entrance for titles.',
  keywords: ['blur', 'reveal', 'focus', 'stagger', 'text', 'animation'],
  importLine: "import { BlurReveal } from '@fj-effects';",
  implementation: impl('blur-reveal'),
  replayable: true,
  controls: [
    { type: 'text', prop: 'text', label: 'Text', defaultValue: 'Softness is a feature, not a flaw.' },
    { type: 'number', prop: 'stagger', defaultValue: 60, min: 0, max: 150, step: 10 },
    { type: 'number', prop: 'blur', label: 'Blur (px)', defaultValue: 8, min: 2, max: 12, step: 1 },
    { type: 'select', prop: 'trigger', options: ['mount', 'inview'], defaultValue: 'mount' },
  ],
  render: (v) => (
    <span key={replayKey(v)} style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-semibold)' }}>
      <BlurReveal
        text={String(v.text)}
        stagger={Number(v.stagger)}
        blur={Number(v.blur)}
        trigger={v.trigger as BlurRevealProps['trigger']}
      />
    </span>
  ),
  code: (v) => `<BlurReveal text="${String(v.text)}"${v.stagger !== 60 ? ` stagger={${Number(v.stagger)}}` : ''}${
    v.blur !== 8 ? ` blur={${Number(v.blur)}}` : ''
  }${v.trigger !== 'mount' ? ` trigger="${String(v.trigger)}"` : ''} />`,
  props: [
    { name: 'text', type: 'string', description: 'The text to reveal, split per word.' },
    { name: 'trigger', type: '"inview" | "mount" | "manual"', defaultValue: '"inview"', description: 'When to play.' },
    { name: 'duration', type: 'number', defaultValue: '480', description: 'ms per word.' },
    { name: 'stagger', type: 'number', defaultValue: '60', description: 'ms between words.' },
    { name: 'blur', type: 'number', defaultValue: '8', description: 'Initial blur in px (capped at 12).' },
    { name: 'lift', type: 'number', defaultValue: '6', description: 'Vertical travel in px.' },
  ],
  a11y: [
    'Words are aria-hidden fragments under a root that carries the full text as an aria-label.',
    'Reduced motion renders one plain span of text — no fragments, no filter.',
    'The animated blur is hard-capped at 12px — the sanctioned capped-blur exception to transform/opacity-only motion.',
  ],
};

export const waveTextDoc: ComponentDoc = {
  id: 'wave-text',
  name: 'WaveText',
  category: 'effects-text',
  blurb: 'Characters take turns rising in a gentle wave — playful hero words and accents.',
  keywords: ['wave', 'text', 'characters', 'bounce', 'stagger', 'animation'],
  importLine: "import { WaveText } from '@fj-effects';",
  implementation: impl('wave-text'),
  replayable: true,
  controls: [
    { type: 'select', prop: 'trigger', options: ['loop', 'mount', 'inview'], defaultValue: 'loop' },
    { type: 'text', prop: 'text', defaultValue: 'Make it joyful' },
    { type: 'number', prop: 'distance', defaultValue: 6, min: 2, max: 12, step: 1 },
    { type: 'number', prop: 'stagger', defaultValue: 60, min: 20, max: 150, step: 10 },
  ],
  render: (v) => (
    <span key={replayKey(v)}>
      <Text variant="h3" as="div">
        <WaveText
          text={String(v.text)}
          trigger={v.trigger as WaveTextProps['trigger']}
          distance={Number(v.distance)}
          stagger={Number(v.stagger)}
        />
      </Text>
    </span>
  ),
  code: (v) => `<WaveText text="${String(v.text)}"${v.trigger !== 'loop' ? ` trigger="${String(v.trigger)}"` : ''}${
    v.distance !== 6 ? ` distance={${Number(v.distance)}}` : ''
  }${v.stagger !== 60 ? ` stagger={${Number(v.stagger)}}` : ''} />`,
  props: [
    { name: 'text', type: 'string', description: 'The text to animate, split per character.' },
    { name: 'trigger', type: '"loop" | "mount" | "inview"', defaultValue: '"loop"', description: 'When the wave plays.' },
    { name: 'distance', type: 'number', defaultValue: '6', description: 'Rise height in px (kept small).' },
    { name: 'duration', type: 'number', defaultValue: '1200', description: 'ms per character cycle.' },
    { name: 'stagger', type: 'number', defaultValue: '60', description: 'ms stagger between adjacent characters.' },
    { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Plain text, no wave.' },
  ],
  a11y: [
    'The full string stays readable as one aria-label; the per-character spans are aria-hidden.',
    'Reduced motion renders the plain string — no splitting, no rise.',
    'Keep the rise small (default 6px) so lines never collide; loop it in heroes, not body copy.',
  ],
};
