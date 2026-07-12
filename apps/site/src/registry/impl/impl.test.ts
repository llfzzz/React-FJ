import { describe, expect, it } from 'vitest';
import { buttonDoc } from '../entries/button';
import { REGISTRY } from '../index';
import type { ComponentDoc, ImplVariantKey } from '../types';

/** Loads the source of one file of a variant. */
async function load(doc: ComponentDoc, key: ImplVariantKey, index = 0): Promise<string> {
  const file = doc.implementation.variants[key]?.files[index];
  expect(file, `${doc.id}: missing ${key} file[${index}]`).toBeTruthy();
  return file!.load();
}

/**
 * Content-sanity checks for the language × styling implementation sources.
 * Button is the template component: its four variants prove the raw-source
 * pipeline (authored TSX ports + shared stylesheet + generated JS ports)
 * end to end.
 */
describe('implementation variants (Button)', () => {
  it('serves the TypeScript + CSS combo as a typed port plus its stylesheet', async () => {
    const variant = buttonDoc.implementation.variants['ts-css'];
    expect(variant?.files.map((f) => f.name)).toEqual(['Button.tsx', 'Button.css']);
    const code = await load(buttonDoc, 'ts-css');
    expect(code).toContain('export interface ButtonProps');
    expect(code).toContain('import "./Button.css"');
    expect(code).toContain('fj-btn'); // classes, not inline styles
    const css = await load(buttonDoc, 'ts-css', 1);
    expect(css).toContain('.fj-btn');
    expect(css).toContain(':focus-visible');
    expect(css).toContain(':disabled');
    expect(css).toContain('prefers-reduced-motion');
    expect(css).toContain('var(--'); // FJ tokens, not hardcoded colors
  });

  it('serves the JavaScript + CSS combo free of TypeScript syntax', async () => {
    const variant = buttonDoc.implementation.variants['js-css'];
    expect(variant?.files.map((f) => f.name)).toEqual(['Button.jsx', 'Button.css']);
    const js = await load(buttonDoc, 'js-css');
    expect(js).toContain('export function Button');
    expect(js).toContain('import "./Button.css"');
    expect(js).not.toContain('interface ');
    expect(js).not.toContain(': ButtonProps');
  });

  it('shares one stylesheet loader between both languages', () => {
    const { variants } = buttonDoc.implementation;
    expect(variants['ts-css']?.files[1]?.load).toBe(variants['js-css']?.files[1]?.load);
  });

  it('serves the Tailwind combos as a single utility-styled file per language', async () => {
    expect(buttonDoc.implementation.variants['ts-tailwind']?.files.map((f) => f.name)).toEqual([
      'Button.tsx',
    ]);
    const ts = await load(buttonDoc, 'ts-tailwind');
    expect(ts).toContain('export interface ButtonProps');
    expect(ts).toContain('bg-[var(--fj-btn-accent)]');
    expect(ts).toContain('focus-visible:');
    const js = await load(buttonDoc, 'js-tailwind');
    expect(js).toContain('export function Button');
    expect(js).not.toContain('interface ');
  });

  it('drift canary: every documented prop appears in both TypeScript ports', async () => {
    const tsCss = await load(buttonDoc, 'ts-css');
    const tsTailwind = await load(buttonDoc, 'ts-tailwind');
    for (const prop of buttonDoc.props) {
      expect(tsCss, `prop "${prop.name}" missing from button.tsx-css.txt`).toContain(prop.name);
      expect(tsTailwind, `prop "${prop.name}" missing from button.tsx-tailwind.txt`).toContain(
        prop.name,
      );
    }
  });
});

describe('registry-wide implementation variants', () => {
  /** Docs whose Style axis is inert (visuals computed in JS). */
  const neutralDocs = REGISTRY.filter((doc) => doc.implementation.stylingNeutral);
  const portedDocs = REGISTRY.filter((doc) => !doc.implementation.stylingNeutral);

  it('styling-neutral docs serve the identical source for CSS and Tailwind', () => {
    expect(neutralDocs.length).toBeGreaterThan(0);
    for (const doc of neutralDocs) {
      const { variants } = doc.implementation;
      expect(variants['js-css'], `${doc.id}: js variant`).toBeTruthy();
      expect(variants['js-css']).toBe(variants['js-tailwind']);
      expect(variants['ts-css']).toBe(variants['ts-tailwind']);
    }
  });

  it('generated JS ports resolve and name the component (staleness canary)', async () => {
    for (const doc of portedDocs) {
      const js = await load(doc, 'js-css');
      expect(
        js,
        `${doc.id}: component ${doc.name} not in generated JS — run \`pnpm gen:impl\``,
      ).toContain(`function ${doc.name}`);
      expect(js, `${doc.id}: TS syntax leaked into the JS port`).not.toContain('interface ');
    }
  });

  it('styling-neutral JS variants resolve and name the component', async () => {
    for (const doc of neutralDocs) {
      const js = await load(doc, 'js-css');
      expect(js, `${doc.id}: component ${doc.name} not in JS source`).toContain(
        `function ${doc.name}`,
      );
      const ts = await load(doc, 'ts-css');
      expect(ts, `${doc.id}: component ${doc.name} not in TS source`).toContain(
        `function ${doc.name}`,
      );
    }
  });

  it('CSS-mode components import the stylesheet they ship with', async () => {
    for (const doc of portedDocs) {
      const code = await load(doc, 'ts-css');
      const stylesheet = doc.implementation.variants['ts-css']?.files[1];
      expect(stylesheet, `${doc.id}: missing stylesheet`).toBeTruthy();
      expect(code, `${doc.id}: component must import ./${stylesheet!.name}`).toContain(
        `import "./${stylesheet!.name}"`,
      );
    }
  });
});
