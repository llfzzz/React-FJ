import { describe, expect, it } from 'vitest';
import { defaultValues, jsxSnippet } from './snippet';
import type { ControlDef } from './types';

const controls: ControlDef[] = [
  { type: 'text', prop: 'children', defaultValue: 'Start free' },
  { type: 'select', prop: 'variant', options: ['primary', 'secondary'], defaultValue: 'primary' },
  { type: 'select', prop: 'size', options: ['sm', 'md', 'lg'], defaultValue: 'md' },
  { type: 'boolean', prop: 'loading', defaultValue: false },
  { type: 'boolean', prop: 'full', defaultValue: true },
  { type: 'number', prop: 'count', defaultValue: 3 },
];

describe('defaultValues', () => {
  it('collects control defaults keyed by prop', () => {
    expect(defaultValues(controls)).toEqual({
      children: 'Start free',
      variant: 'primary',
      size: 'md',
      loading: false,
      full: true,
      count: 3,
    });
  });
});

describe('jsxSnippet', () => {
  it('renders only children when everything is default', () => {
    expect(jsxSnippet('Button', controls, defaultValues(controls))).toBe(
      '<Button>Start free</Button>',
    );
  });

  it('serializes non-default strings, booleans, and numbers', () => {
    const values = {
      ...defaultValues(controls),
      variant: 'secondary',
      loading: true,
      full: false,
      count: 7,
    };
    expect(jsxSnippet('Button', controls, values)).toBe(
      '<Button variant="secondary" loading full={false} count={7}>Start free</Button>',
    );
  });

  it('self-closes without a children control', () => {
    const bare: ControlDef[] = [
      { type: 'select', prop: 'tone', options: ['info', 'warn'], defaultValue: 'info' },
    ];
    expect(jsxSnippet('Alert', bare, { tone: 'warn' })).toBe('<Alert tone="warn" />');
    expect(jsxSnippet('Alert', bare, { tone: 'info' })).toBe('<Alert />');
  });
});
