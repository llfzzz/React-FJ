import { useEffect, useState } from 'react';
import { SegmentedControl } from '@fj';
import type { ComponentDoc, ImplFormat } from '../registry/types';
import { IMPL_FORMAT_LABELS, IMPL_FORMAT_ORDER } from '../registry/types';
import { useCodeStyle } from '../lib/codeStyle';
import { CodeBlock } from './CodeBlock';

const DEFAULT_LANGS: Record<ImplFormat, string> = {
  js: 'tsx',
  ts: 'tsx',
  css: 'html',
  tailwind: 'tsx',
};

/** Loaded sources, cached for the session (each loader resolves once). */
const sourceCache = new Map<() => Promise<string>, string>();

type LoadState = { status: 'loading' } | { status: 'ready'; code: string } | { status: 'error' };

/**
 * The 4-format implementation viewer: JavaScript / TypeScript / CSS / Tailwind.
 * The selected style is global (useCodeStyle) and persists across pages; a
 * format a component can't support renders its notApplicable reason instead.
 */
export function ImplementationBlock({ doc }: { doc: ComponentDoc }) {
  const { style, setStyle } = useCodeStyle();
  const implementation = doc.implementation;
  const loader = implementation?.sources[style];
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    if (!loader) return;
    const cached = sourceCache.get(loader);
    if (cached !== undefined) {
      setState({ status: 'ready', code: cached });
      return;
    }
    let alive = true;
    setState({ status: 'loading' });
    loader().then(
      (code) => {
        sourceCache.set(loader, code);
        if (alive) setState({ status: 'ready', code });
      },
      () => {
        if (alive) setState({ status: 'error' });
      },
    );
    return () => {
      alive = false;
    };
  }, [loader]);

  if (!implementation) return null;

  const note = implementation.notes?.[style];
  const lang = implementation.langs?.[style] ?? DEFAULT_LANGS[style];
  const notApplicable =
    !loader && (style === 'css' || style === 'tailwind')
      ? implementation.notApplicable?.[style]
      : undefined;

  return (
    <div className="impl-block">
      <div className="impl-bar">
        <SegmentedControl
          size="sm"
          options={IMPL_FORMAT_ORDER.map((format) => ({
            value: format,
            label: IMPL_FORMAT_LABELS[format],
          }))}
          value={style}
          onChange={(next) => setStyle(next as ImplFormat)}
        />
      </div>
      {note && loader && <p className="doc-note impl-note">{note}</p>}
      {loader ? (
        state.status === 'ready' ? (
          <CodeBlock code={state.code} lang={lang} maxHeight={480} />
        ) : state.status === 'error' ? (
          <p className="impl-unavailable">Couldn’t load this source. Reload to try again.</p>
        ) : (
          <div className="impl-loading" aria-hidden />
        )
      ) : (
        <p className="impl-unavailable">
          {notApplicable ??
            `No ${IMPL_FORMAT_LABELS[style]} implementation is published for ${doc.name} yet.`}
        </p>
      )}
    </div>
  );
}
