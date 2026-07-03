import { Link, useLocation } from 'react-router-dom';
import { Moon, Search, Sun } from 'lucide-react';
import { Kbd } from '@fj';
import { useTheme } from '../lib/theme';
import logoMark from '@fj/assets/logo-mark.svg';

const NAV = [
  { label: 'Docs', to: '/docs/introduction', match: '/docs' },
  { label: 'Components', to: '/components', match: '/components' },
  { label: 'Playground', to: '/playground', match: '/playground' },
];

export function ThemeToggle() {
  const { resolved, setMode } = useTheme();
  const next = resolved === 'dark' ? 'light' : 'dark';
  const Icon = resolved === 'dark' ? Moon : Sun;
  const label = `Theme: ${resolved} — switch to ${next}`;
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={label}
      title={label}
      onClick={() => setMode(next)}
    >
      <Icon size={18} aria-hidden />
    </button>
  );
}

export function TopBar({ onSearch }: { onSearch?: () => void }) {
  const { pathname } = useLocation();
  return (
    <header className="topbar fj-glass-strong">
      <div className="container topbar-inner">
        <Link to="/" className="brand">
          <img src={logoMark} alt="" />
          Free Joy
        </Link>
        <nav className="topbar-nav" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="topbar-link"
              aria-current={pathname.startsWith(item.match) || undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="topbar-spacer" />
        {onSearch && (
          <button type="button" className="search-btn" onClick={onSearch}>
            <Search size={15} aria-hidden />
            <span className="search-btn-label">Search</span>
            <Kbd keys={['⌘', 'K']} size="sm" />
          </button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
