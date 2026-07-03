import type { ImplementationDoc } from '../types';

/**
 * Raw implementation sources for the 4-format code switcher.
 *
 * - `js` for fj-ui components is the actual synced .jsx source (never drifts);
 *   for fj-effects components it's the generated type-stripped port under
 *   ./generated (see scripts/gen-impl-js.mjs).
 * - `ts` for fj-ui components is the hand-authored port under ./sources
 *   (the .jsx merged with its .d.ts); for fj-effects it's the actual .tsx source.
 * - `css` / `tailwind` are hand-authored reproductions under ./sources.
 *
 * Everything is lazy: each source becomes its own on-demand chunk.
 */
type RawLoaders = Record<string, () => Promise<string>>;

const FJ_UI_SOURCES = import.meta.glob('../../../../../packages/fj-ui/components/*/*.jsx', {
  query: '?raw',
  import: 'default',
}) as RawLoaders;

const FJ_EFFECTS_SOURCES = import.meta.glob('../../../../../packages/fj-effects/components/*.tsx', {
  query: '?raw',
  import: 'default',
}) as RawLoaders;

const AUTHORED_SOURCES = import.meta.glob('./sources/*.{ts,css,tailwind}.txt', {
  query: '?raw',
  import: 'default',
}) as RawLoaders;

const GENERATED_SOURCES = import.meta.glob('./generated/*.txt', {
  query: '?raw',
  import: 'default',
}) as RawLoaders;

/** "TextReveal.jsx" → "text-reveal" (matches registry ids). */
function kebabBasename(path: string): string {
  const base = path.split('/').pop() ?? path;
  const name = base.replace(/\.(jsx|tsx)$/, '');
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function byKebabId(loaders: RawLoaders): Map<string, () => Promise<string>> {
  const map = new Map<string, () => Promise<string>>();
  for (const [path, loader] of Object.entries(loaders)) {
    map.set(kebabBasename(path), loader);
  }
  return map;
}

const fjUiById = byKebabId(FJ_UI_SOURCES);
const fjEffectsById = byKebabId(FJ_EFFECTS_SOURCES);

function authored(id: string, format: 'ts' | 'css' | 'tailwind'): (() => Promise<string>) | undefined {
  return AUTHORED_SOURCES[`./sources/${id}.${format}.txt`];
}

interface ImplOptions {
  notes?: ImplementationDoc['notes'];
  notApplicable?: ImplementationDoc['notApplicable'];
}

/**
 * Assembles the ImplementationDoc for a component id. Sources resolve in this
 * order: fj-ui synced source (js) / authored port (ts), then fj-effects real
 * source (ts) / generated port (js), then authored css/tailwind if present.
 */
export function impl(id: string, opts: ImplOptions = {}): ImplementationDoc {
  const sources: ImplementationDoc['sources'] = {};

  const js = fjUiById.get(id) ?? GENERATED_SOURCES[`./generated/${id}.js.txt`];
  if (js) sources.js = js;

  const ts = authored(id, 'ts') ?? fjEffectsById.get(id);
  if (ts) sources.ts = ts;

  const css = authored(id, 'css');
  if (css) sources.css = css;

  const tailwind = authored(id, 'tailwind');
  if (tailwind) sources.tailwind = tailwind;

  return {
    sources,
    notes: opts.notes,
    notApplicable: opts.notApplicable,
  };
}
