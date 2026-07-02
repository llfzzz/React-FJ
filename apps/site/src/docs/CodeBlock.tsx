import { useEffect, useState } from 'react';
import { highlightCode } from './highlight';
import { CopyIconButton } from './CopyIconButton';

interface CodeBlockProps {
  code: string;
  lang?: string;
  /** Cap the height and scroll beyond it (px). */
  maxHeight?: number;
}

export function CodeBlock({ code, lang = 'tsx', maxHeight }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setHtml(null);
    highlightCode(code, lang).then(
      (result) => {
        if (alive) setHtml(result);
      },
      () => {
        /* highlighting failed — the plain fallback stays visible */
      },
    );
    return () => {
      alive = false;
    };
  }, [code, lang]);

  return (
    <div className="codeblock">
      <div className="codeblock-actions">
        <CopyIconButton value={code} />
      </div>
      {html ? (
        <div
          className="codeblock-body"
          style={maxHeight ? { maxHeight } : undefined}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="codeblock-body" style={maxHeight ? { maxHeight } : undefined}>
          <pre className="codeblock-fallback">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
