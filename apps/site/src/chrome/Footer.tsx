import { Link } from 'react-router-dom';

const LINKS = [
  { label: 'Introduction', to: '/docs/introduction' },
  { label: 'Components', to: '/components' },
  { label: 'Animation', to: '/animation' },
  { label: 'Playground', to: '/playground' },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-wordmark">
              Free Joy
              <span className="brand-dot" aria-hidden />
            </span>
            <p className="footer-tagline">Built for the making, not the metrics.</p>
          </div>
          <nav className="footer-links" aria-label="Footer">
            {LINKS.map((link) => (
              <Link key={link.to} to={link.to} className="footer-link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Free Joy — made quietly.</span>
          <span>Design system v0.1</span>
        </div>
      </div>
    </footer>
  );
}
