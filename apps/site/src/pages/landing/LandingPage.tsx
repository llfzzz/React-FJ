import { Link } from 'react-router-dom';
import { usePageTitle } from '../../lib/usePageTitle';

/* Phase-1 placeholder — the full landing (hero effects, feature grid,
   component peek) lands with the core component sync. */
export function LandingPage() {
  usePageTitle();
  return (
    <section className="placeholder-page" style={{ paddingBlock: 'var(--space-10)' }}>
      <span className="fj-eyebrow">Free Joy design system</span>
      <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, var(--text-4xl))' }}>
        A calm home for your interface.
      </h1>
      <p style={{ fontSize: 'var(--text-md)' }}>
        Components with quiet confidence — clean layouts, generous spacing, and details that feel
        free rather than flashy.
      </p>
      <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/docs/introduction" className="btn btn-primary btn-lg">
          Get started
        </Link>
        <Link to="/components" className="btn btn-secondary btn-lg">
          Browse components
        </Link>
      </div>
    </section>
  );
}
