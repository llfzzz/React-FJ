import { describe, expect, it } from 'vitest';
import { adjacentDocs, getComponentDoc, presentCategories, REGISTRY } from './index';
import { CATEGORY_ORDER } from './types';

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

  it('ships all four implementation formats (or a reason for missing CSS/Tailwind)', () => {
    for (const doc of REGISTRY) {
      const { sources, notApplicable } = doc.implementation;
      // Every component has a real JS source (synced .jsx or generated port)
      // and a TypeScript source.
      expect(typeof sources.js, `${doc.id}.js`).toBe('function');
      expect(typeof sources.ts, `${doc.id}.ts`).toBe('function');
      // CSS and Tailwind must be present OR carry an explicit not-applicable reason.
      for (const format of ['css', 'tailwind'] as const) {
        const hasSource = typeof sources[format] === 'function';
        const hasReason = Boolean(notApplicable?.[format]);
        expect(hasSource || hasReason, `${doc.id}.${format}: needs a source or a notApplicable reason`).toBe(true);
      }
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
