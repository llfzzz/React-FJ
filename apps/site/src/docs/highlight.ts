import type { HighlighterCore } from 'shiki/core';

/**
 * Lazy, fine-grained shiki: only the languages the docs actually use and the
 * JS regex engine (no wasm). The code block is always a dark, warm panel —
 * FJ's docs convention — so one dark syntax theme is enough; the panel
 * background itself comes from FJ tokens (see .codeblock CSS).
 */
let highlighterPromise: Promise<HighlighterCore> | null = null;

function loadHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
    ]);
    return createHighlighterCore({
      themes: [import('@shikijs/themes/vitesse-dark')],
      langs: [
        import('@shikijs/langs/tsx'),
        import('@shikijs/langs/bash'),
        import('@shikijs/langs/css'),
        import('@shikijs/langs/jsonc'),
        import('@shikijs/langs/html'),
      ],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    });
  })();
  return highlighterPromise;
}

export async function highlightCode(code: string, lang: string = 'tsx'): Promise<string> {
  const highlighter = await loadHighlighter();
  return highlighter.codeToHtml(code, { lang, theme: 'vitesse-dark' });
}
