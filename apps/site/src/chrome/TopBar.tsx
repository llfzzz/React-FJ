import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Kbd } from '@fj';
import logoMark from '@fj/assets/logo-mark.svg';

const NAV = [
  { label: 'Docs', to: '/docs/introduction', match: '/docs' },
  { label: 'Playground', to: '/playground', match: '/playground' },
];

const GITHUB_OWNER = 'llfzzz';
const GITHUB_REPO = 'React-FJ';
const GITHUB_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
const STARS_CACHE_KEY = `fj:gh-stars:${GITHUB_OWNER}/${GITHUB_REPO}`;
const STARS_TTL_MS = 24 * 60 * 60 * 1000; // refetch at most once a day

function formatStars(count: number): string {
  if (count < 1000) return String(count);
  return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`;
}

/**
 * Reads the repo's real stargazer count from the public GitHub API. The value
 * is cached in localStorage and only refetched when it's older than a day, so
 * the badge auto-updates daily without burning the 60-req/hr unauthenticated
 * rate limit. Returns null while unknown (loading, offline, or rate-limited) —
 * the button still renders and links out.
 */
function readCachedStars(): number | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STARS_CACHE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { count: number; at: number };
    return Date.now() - cached.at < STARS_TTL_MS ? cached.count : null;
  } catch {
    return null;
  }
}

function useGitHubStars(): number | null {
  const [stars, setStars] = useState<number | null>(readCachedStars);

  useEffect(() => {
    if (stars !== null) return; // fresh cache hit — no fetch needed today
    const controller = new AbortController();
    fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { stargazers_count?: number }) => {
        if (typeof data.stargazers_count !== 'number') return;
        setStars(data.stargazers_count);
        try {
          localStorage.setItem(
            STARS_CACHE_KEY,
            JSON.stringify({ count: data.stargazers_count, at: Date.now() }),
          );
        } catch {
          /* storage full or blocked — the in-memory value is enough */
        }
      })
      .catch(() => {
        /* offline or rate-limited — keep the button, just omit the count */
      });
    return () => controller.abort();
  }, [stars]);

  return stars;
}

/** GitHub mark — lucide v1 dropped brand icons, so we inline the official glyph. */
function GithubMark({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.31-.54-1.53.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.23 1.92 1.23 3.23 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22 0 1.6-.01 2.9-.01 3.29 0 .32.21.7.83.58C20.56 22.29 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
    </svg>
  );
}

export function GitHubButton() {
  const stars = useGitHubStars();
  const repo = `${GITHUB_OWNER}/${GITHUB_REPO}`;
  return (
    <a
      className="github-btn"
      href={GITHUB_URL}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={stars === null ? `${repo} on GitHub` : `${repo} on GitHub — ${stars} stars`}
      title="View on GitHub"
    >
      <GithubMark size={16} />
      {stars !== null && <span className="github-btn-count">{formatStars(stars)}</span>}
    </a>
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
        <GitHubButton />
      </div>
    </header>
  );
}
