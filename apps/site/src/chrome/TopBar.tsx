import { Link, useLocation } from 'react-router-dom';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type ThemeMode } from '../lib/theme';
import logoMark from '@fj/assets/logo-mark.svg';

const NAV = [
  { label: 'Docs', to: '/docs/introduction', match: '/docs' },
  { label: 'Components', to: '/components', match: '/components' },
  { label: 'Playground', to: '/playground', match: '/playground' },
];

const NEXT_MODE: Record<ThemeMode, ThemeMode> = { light: 'dark', dark: 'system', system: 'light' };
const MODE_ICON: Record<ThemeMode, typeof Sun> = { light: Sun, dark: Moon, system: Monitor };
const MODE_LABEL: Record<ThemeMode, string> = {
  light: 'Theme: light',
  dark: 'Theme: dark',
  system: 'Theme: follows your system',
};

export function ThemeToggle() {
  const { mode, setMode } = useTheme();
  const Icon = MODE_ICON[mode];
  const label = `${MODE_LABEL[mode]} — switch to ${NEXT_MODE[mode]}`;
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={label}
      title={label}
      onClick={() => setMode(NEXT_MODE[mode])}
    >
      <Icon size={18} aria-hidden />
    </button>
  );
}

export function TopBar() {
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
        <ThemeToggle />
      </div>
    </header>
  );
}
