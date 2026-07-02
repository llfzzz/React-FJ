import { Link } from 'react-router-dom';
import { usePageTitle } from '../lib/usePageTitle';

export function NotFoundPage() {
  usePageTitle('Page not found');
  return (
    <div className="placeholder-page">
      <span className="notfound-code">404 — not found</span>
      <h1>This page wandered off quietly.</h1>
      <p>The address may have changed, or it never existed. Either way, home is close by.</p>
      <Link to="/" className="btn btn-primary">
        Back to Free Joy
      </Link>
    </div>
  );
}
