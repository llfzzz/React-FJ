import { useEffect, useState } from 'react';
import { SegmentedControl } from '@fj';
import type { ComponentDoc, ImplLanguage, ImplStyling } from '../registry/types';
import {
  IMPL_LANGUAGE_LABELS,
  IMPL_LANGUAGE_ORDER,
  IMPL_STYLING_LABELS,
  IMPL_STYLING_ORDER,
} from '../registry/types';
import { useCodeStyle } from '../lib/codeStyle';
import { CodeBlock } from './CodeBlock';

/** Loaded sources, cached for the session (each loader resolves once). */
const sourceCache = new Map<() => Promise<string>, string>();

type LoadState =
  | { status: 'loading' }
  | { status: 'ready'; codes: string[] }
  | { status: 'error' };

/**
 * The language × styling implementation viewer. Two independent pickers —
 * JavaScript/TypeScript and CSS/Tailwind — combine into one complete,
 * copy-ready variant: the component file, plus the shared stylesheet when the
 * styling method is plain CSS. Both selections are global (useCodeStyle) and
 * persist across pages. Styling-neutral components (visuals computed in JS)
 * render the same source for either styling; the Style picker goes inert with
 * the reason alongside.
 */
export function ImplementationBlock({ doc }: { doc: ComponentDoc }) {
  const { language, styling, setLanguage, setStyling } = useCodeStyle();
  const implementation = doc.implementation;
  const variant = implementation?.variants[`${language}-${styling}`];
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    if (!variant) return;
    const loaders = variant.files.map((f) => f.load);
    if (loaders.every((loader) => sourceCache.has(loader))) {
      setState({ status: 'ready', codes: loaders.map((loader) => sourceCache.get(loader) ?? '') });
      return;
    }
    let alive = true;
    setState({ status: 'loading' });
    Promise.all(
      loaders.map((loader) =>
        loader().then((code) => {
          sourceCache.set(loader, code);
          return code;
        }),
      ),
    ).then(
      (codes) => {
        if (alive) setState({ status: 'ready', codes });
      },
      () => {
        if (alive) setState({ status: 'error' });
      },
    );
    return () => {
      alive = false;
    };
  }, [variant]);

  if (!implementation) return null;

  const stylingNeutral = implementation.stylingNeutral;
  const note = stylingNeutral ? undefined : implementation.notes?.[styling];
  const ready = state.status === 'ready' && variant && state.codes.length === variant.files.length;

  return (
    <div className="impl-block">
      <div className="impl-bar">
        <div className="impl-picker">
          <span className="impl-picker-label" id={`impl-language-${doc.id}`}>
            Language
          </span>
          <SegmentedControl
            size="sm"
            options={IMPL_LANGUAGE_ORDER.map((option) => ({
              value: option,
              label: IMPL_LANGUAGE_LABELS[option],
            }))}
            value={language}
            onChange={(next) => setLanguage(next as ImplLanguage)}
          />
        </div>
        <div
          className={stylingNeutral ? 'impl-picker impl-picker--inert' : 'impl-picker'}
          inert={Boolean(stylingNeutral)}
        >
          <span className="impl-picker-label" id={`impl-styling-${doc.id}`}>
            Style
          </span>
          <SegmentedControl
            size="sm"
            options={IMPL_STYLING_ORDER.map((option) => ({
              value: option,
              label: IMPL_STYLING_LABELS[option],
            }))}
            value={styling}
            onChange={(next) => setStyling(next as ImplStyling)}
          />
        </div>
      </div>
      {stylingNeutral && <p className="doc-note impl-note">{stylingNeutral}</p>}
      {note && variant && <p className="doc-note impl-note">{note}</p>}
      {variant ? (
        ready ? (
          variant.files.map((file, index) => (
            <div className="impl-file" key={file.name}>
              <div className="impl-file-head">
                <span className="impl-file-name">{file.name}</span>
              </div>
              <CodeBlock code={state.codes[index]} lang={file.lang} maxHeight={480} />
            </div>
          ))
        ) : state.status === 'error' ? (
          <p className="impl-unavailable">Couldn’t load this source. Reload to try again.</p>
        ) : (
          <div className="impl-loading" aria-hidden />
        )
      ) : (
        <p className="impl-unavailable">
          {`No ${IMPL_LANGUAGE_LABELS[language]} + ${IMPL_STYLING_LABELS[styling]} implementation is published for ${doc.name} yet.`}
        </p>
      )}
    </div>
  );
}
