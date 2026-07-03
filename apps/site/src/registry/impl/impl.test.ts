import { describe, expect, it } from 'vitest';
import { buttonDoc } from '../entries/button';

/**
 * Content-sanity checks for the 4-format implementation sources. Button is the
 * template component: its four variants prove the raw-source pipeline (synced
 * .jsx via ?raw glob + authored .txt ports) end to end.
 */
describe('implementation sources (Button)', () => {
  it('serves the actual synced .jsx source as the JavaScript variant', async () => {
    const js = await buttonDoc.implementation?.sources.js?.();
    expect(js).toContain('export function Button');
    expect(js).toContain('var(--'); // FJ tokens, not hardcoded colors
    expect(js).toContain('aria-busy');
  });

  it('serves a typed port as the TypeScript variant', async () => {
    const ts = await buttonDoc.implementation?.sources.ts?.();
    expect(ts).toContain('export interface ButtonProps');
    expect(ts).toContain('export function Button');
    expect(ts).toContain('var(--');
  });

  it('serves an HTML+CSS reproduction covering the interactive states', async () => {
    const css = await buttonDoc.implementation?.sources.css?.();
    expect(css).toContain(':focus-visible');
    expect(css).toContain(':hover');
    expect(css).toContain(':disabled');
    expect(css).toContain('prefers-reduced-motion');
    expect(css).toContain('var(--');
  });

  it('serves a Tailwind reproduction built on FJ token variables', async () => {
    const tailwind = await buttonDoc.implementation?.sources.tailwind?.();
    expect(tailwind).toContain('bg-[var(--accent)]');
    expect(tailwind).toContain('focus-visible:');
    expect(tailwind).toContain('export function Button');
  });

  it('drift canary: every documented prop appears in the TypeScript port', async () => {
    const ts = (await buttonDoc.implementation?.sources.ts?.()) ?? '';
    for (const prop of buttonDoc.props) {
      expect(ts, `prop "${prop.name}" missing from button.ts.txt`).toContain(prop.name);
    }
  });
});
