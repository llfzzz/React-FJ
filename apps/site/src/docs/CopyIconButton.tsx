import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

/** Icon-only copy control for code blocks (bundled icons, no CDN). */
export function CopyIconButton({ value, label = 'Copy code' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard unavailable — leave the button in its idle state */
    }
  };

  return (
    <button
      type="button"
      className="copy-icon-btn"
      data-copied={copied || undefined}
      aria-label={copied ? 'Copied' : label}
      title={copied ? 'Copied' : label}
      onClick={copy}
    >
      {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
      <span aria-live="polite" className="visually-hidden">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </button>
  );
}
