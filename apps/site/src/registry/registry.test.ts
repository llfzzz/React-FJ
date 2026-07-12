import { describe, expect, it } from 'vitest';
import { adjacentDocs, getComponentDoc, presentCategories, REGISTRY } from './index';
import { CATEGORY_ORDER, type ImplVariantKey } from './types';

const VARIANT_KEYS: ImplVariantKey[] = ['js-css', 'ts-css', 'js-tailwind', 'ts-tailwind'];

describe('registry integrity', () => {
  it('has unique ids and names', () => {
    const ids = REGISTRY.map((doc) => doc.id);
    const names = REGISTRY.map((doc) => doc.name);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(names).size).toBe(names.length);
  });

  it('keeps every doc complete: blurb, import line, props, a11y', () => {
    for (const doc of REGISTRY) {
      expect(doc.blurb.length, doc.id).toBeGreaterThan(10);
      // Components import from '@fj'; new effects import from '@fj-effects'.
      expect(doc.importLine, doc.id).toMatch(/from '@fj(-effects)?'/);
      expect(doc.importLine, doc.id).toContain(doc.name);
      expect(doc.props.length, doc.id).toBeGreaterThan(0);
      expect(doc.a11y.length, doc.id).toBeGreaterThan(0);
    }
  });

  it('ships all four language × styling combinations', () => {
    for (const doc of REGISTRY) {
      const { variants, stylingNeutral } = doc.implementation;
      for (const key of VARIANT_KEYS) {
        const variant = variants[key];
        expect(variant, `${doc.id}.${key}: variant missing`).toBeTruthy();
        expect(variant!.files.length, `${doc.id}.${key}: no files`).toBeGreaterThan(0);
      }
      if (stylingNeutral) {
        // The Style axis is inert: both styling choices serve the same source.
        expect(variants['js-css']).toBe(variants['js-tailwind']);
        expect(variants['ts-css']).toBe(variants['ts-tailwind']);
        expect(stylingNeutral.length, `${doc.id}: reason too short`).toBeGreaterThan(20);
      } else {
        // CSS combos pair the component with its stylesheet; Tailwind is one file.
        expect(variants['ts-css']!.files, `${doc.id}.ts-css`).toHaveLength(2);
        expect(variants['js-css']!.files, `${doc.id}.js-css`).toHaveLength(2);
        expect(variants['ts-css']!.files[1].name.endsWith('.css'), `${doc.id}: stylesheet`).toBe(
          true,
        );
        expect(variants['ts-tailwind']!.files, `${doc.id}.ts-tailwind`).toHaveLength(1);
        expect(variants['js-tailwind']!.files, `${doc.id}.js-tailwind`).toHaveLength(1);
      }
    }
  });

  it('names variant files consistently per language', () => {
    for (const doc of REGISTRY) {
      const { variants } = doc.implementation;
      expect(variants['ts-css']!.files[0].name.endsWith('.tsx'), doc.id).toBe(true);
      expect(variants['js-css']!.files[0].name.endsWith('.jsx'), doc.id).toBe(true);
    }
  });

  it('keeps select control defaults inside their options', () => {
    for (const doc of REGISTRY) {
      for (const control of doc.controls) {
        if (control.type === 'select') {
          expect(control.options, `${doc.id}.${control.prop}`).toContain(control.defaultValue);
        }
      }
    }
  });

  it('is sorted by canonical category order', () => {
    const indices = REGISTRY.map((doc) => CATEGORY_ORDER.indexOf(doc.category));
    expect([...indices].sort((a, b) => a - b)).toEqual(indices);
  });

  it('looks up docs and neighbors', () => {
    const button = getComponentDoc('button');
    expect(button?.name).toBe('Button');
    expect(getComponentDoc('nope')).toBeUndefined();
    const { prev, next } = adjacentDocs(REGISTRY[1].id);
    expect(prev?.id).toBe(REGISTRY[0].id);
    expect(next?.id).toBe(REGISTRY[2].id);
  });

  it('reports only categories that exist', () => {
    for (const category of presentCategories()) {
      expect(REGISTRY.some((doc) => doc.category === category)).toBe(true);
    }
  });
});
