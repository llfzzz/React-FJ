import type { ImplFile, ImplVariant, ImplementationDoc } from '../types';

/**
 * Raw implementation sources for the language × styling code switcher.
 *
 * Every component resolves four complete variants from two authored ports and
 * one shared stylesheet:
 *
 * - `sources/<id>.tsx-css.txt`      TypeScript component styled by classes
 *                                   (imports "./<Name>.css")
 * - `sources/<id>.css.txt`          the stylesheet those classes live in,
 *                                   shared verbatim by both languages
 * - `sources/<id>.tsx-tailwind.txt` TypeScript component styled by utilities
 * - `generated/<id>.jsx-css.txt` and `generated/<id>.jsx-tailwind.txt`
 *                                   the JavaScript ports, type-stripped from
 *                                   the TSX sources by `pnpm gen:impl`
 *
 * Components that draw their visuals in JavaScript (particles, cursor math,
 * keyed crossfades…) have no styling axis: `stylingNeutral` serves the real
 * source per language instead — the synced .jsx / authored .ts.txt for fj-ui,
 * the generated .js.txt port / real .tsx for fj-effects.
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

const AUTHORED_SOURCES = import.meta.glob('./sources/*.txt', {
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

/** "tilt-card" → "TiltCard" (the display file name of a port). */
function pascalId(id: string): string {
  return id.replace(/(^|-)([a-z0-9])/g, (_, __, ch: string) => ch.toUpperCase());
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

function file(
  name: string,
  lang: string,
  load: (() => Promise<string>) | undefined,
): ImplFile | undefined {
  return load ? { name, lang, load } : undefined;
}

function variant(...files: (ImplFile | undefined)[]): ImplVariant | undefined {
  const present = files.filter((f): f is ImplFile => Boolean(f));
  // A variant is only served complete: a css combo missing its stylesheet
  // (or component) renders the "not published" notice instead.
  return present.length === files.length ? { files: present } : undefined;
}

interface ImplOptions {
  notes?: ImplementationDoc['notes'];
  /** Why the Style axis is inert for this component (visuals computed in JS). */
  stylingNeutral?: string;
}

/**
 * Assembles the ImplementationDoc for a component id from the authored ports
 * (ts) + generated ports (js) + shared stylesheet — or, for styling-neutral
 * components, from the real per-language sources.
 */
export function impl(id: string, opts: ImplOptions = {}): ImplementationDoc {
  const name = pascalId(id);
  const variants: ImplementationDoc['variants'] = {};

  if (opts.stylingNeutral) {
    const js = fjUiById.get(id) ?? GENERATED_SOURCES[`./generated/${id}.js.txt`];
    const ts = AUTHORED_SOURCES[`./sources/${id}.ts.txt`] ?? fjEffectsById.get(id);
    const jsVariant = variant(file(`${name}.jsx`, 'tsx', js));
    const tsVariant = variant(file(`${name}.tsx`, 'tsx', ts));
    if (jsVariant) {
      variants['js-css'] = jsVariant;
      variants['js-tailwind'] = jsVariant;
    }
    if (tsVariant) {
      variants['ts-css'] = tsVariant;
      variants['ts-tailwind'] = tsVariant;
    }
  } else {
    const stylesheet = file(`${name}.css`, 'css', AUTHORED_SOURCES[`./sources/${id}.css.txt`]);
    variants['ts-css'] = variant(
      file(`${name}.tsx`, 'tsx', AUTHORED_SOURCES[`./sources/${id}.tsx-css.txt`]),
      stylesheet,
    );
    variants['js-css'] = variant(
      file(`${name}.jsx`, 'tsx', GENERATED_SOURCES[`./generated/${id}.jsx-css.txt`]),
      stylesheet,
    );
    variants['ts-tailwind'] = variant(
      file(`${name}.tsx`, 'tsx', AUTHORED_SOURCES[`./sources/${id}.tsx-tailwind.txt`]),
    );
    variants['js-tailwind'] = variant(
      file(`${name}.jsx`, 'tsx', GENERATED_SOURCES[`./generated/${id}.jsx-tailwind.txt`]),
    );
  }

  return {
    variants,
    notes: opts.notes,
    stylingNeutral: opts.stylingNeutral,
  };
}
