import { useEffect, useState, type ReactNode } from 'react';
import type { ComponentDoc, ImplLanguage, ImplStyling } from '../registry/types';
import {
  IMPL_LANGUAGE_LABELS,
  IMPL_LANGUAGE_ORDER,
  IMPL_STYLING_LABELS,
  IMPL_STYLING_ORDER,
} from '../registry/types';
import { useCodeStyle } from '../lib/codeStyle';
import { CodeBlock } from './CodeBlock';
import { ImplSelect } from './ImplSelect';

/** Tailwind CSS logomark, drawn inline so no external asset loads. */
function TailwindMark() {
  return (
    <svg viewBox="0 0 54 33" width="13" height="8" fill="currentColor" aria-hidden="true">
      <path d="M27 0C19.8 0 15.3 3.6 13.5 10.8C16.2 7.2 19.35 5.85 22.95 6.75C25.004 7.263 26.472 8.754 28.098 10.403C30.744 13.09 33.808 16.2 40.5 16.2C47.7 16.2 52.2 12.6 54 5.4C51.3 9 48.15 10.35 44.55 9.45C42.496 8.937 41.028 7.446 39.402 5.797C36.756 3.11 33.692 0 27 0ZM13.5 16.2C6.3 16.2 1.8 19.8 0 27C2.7 23.4 5.85 22.05 9.45 22.95C11.504 23.463 12.972 24.954 14.598 26.603C17.244 29.29 20.308 32.4 27 32.4C34.2 32.4 38.7 28.8 40.5 21.6C37.8 25.2 34.65 26.55 31.05 25.65C28.996 25.137 27.528 23.646 25.902 21.997C23.256 19.31 20.192 16.2 13.5 16.2Z" />
    </svg>
  );
}

const LANGUAGE_BADGES: Record<ImplLanguage, ReactNode> = {
  js: 'JS',
  ts: 'TS',
};

const STYLING_BADGES: Record<ImplStyling, ReactNode> = {
  css: 'CSS',
  tailwind: <TailwindMark />,
};

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
        <ImplSelect
          label="Language"
          options={IMPL_LANGUAGE_ORDER.map((option) => ({
            value: option,
            label: IMPL_LANGUAGE_LABELS[option],
            badge: LANGUAGE_BADGES[option],
          }))}
          value={language}
          onChange={setLanguage}
        />
        <div
          className={stylingNeutral ? 'impl-picker impl-picker--inert' : 'impl-picker'}
          inert={Boolean(stylingNeutral)}
        >
          <ImplSelect
            label="Style"
            options={IMPL_STYLING_ORDER.map((option) => ({
              value: option,
              label: IMPL_STYLING_LABELS[option],
              badge: STYLING_BADGES[option],
            }))}
            value={styling}
            onChange={setStyling}
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
