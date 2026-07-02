import { useEffect, useState } from 'react';
import { useTheme } from '../../lib/theme';

/** Live computed value of a CSS custom property; tracks theme changes. */
export function useTokenValue(name: string): string {
  const { resolved } = useTheme();
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
  }, [name, resolved]);
  return value;
}

export function TokenName({ name }: { name: string }) {
  return <code className="token-name">{name}</code>;
}

/** One color swatch row: live swatch + var name + computed value. */
export function ColorToken({ name, note }: { name: string; note?: string }) {
  const value = useTokenValue(name);
  return (
    <div className="color-token">
      <span className="color-token-swatch" style={{ background: `var(${name})` }} aria-hidden />
      <div className="color-token-meta">
        <TokenName name={name} />
        {note && <span className="token-note">{note}</span>}
      </div>
      <span className="token-value">{value}</span>
    </div>
  );
}

export function TokenGrid({ children }: { children: React.ReactNode }) {
  return <div className="token-grid">{children}</div>;
}
