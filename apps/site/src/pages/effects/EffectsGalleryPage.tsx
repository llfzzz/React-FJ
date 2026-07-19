import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { PageHeader } from '@fj';
import { docPath, effectDocs } from '../../registry';
import { defaultValues } from '../../registry/snippet';
import { usePageTitle } from '../../lib/usePageTitle';

/**
 * The animation gallery: a grid of live mini-previews, one card per animation
 * type. Each card renders the animation at its default settings and links to
 * its full page (playground, props, language × styling code, a11y notes).
 */
export function EffectsGalleryPage() {
  usePageTitle('Animation');
  const docs = useMemo(() => effectDocs(), []);

  return (
    <article>
      <PageHeader
        eyebrow="Animation"
        title="Animation gallery"
        description={`All ${docs.length} animation types in one place — reusable, token-driven animations for hero and showcase surfaces. Preview them live, then open any one for its playground, props, code, and accessibility notes.`}
      />

      <div className="effects-gallery">
        {docs.map((doc) => (
          <Link key={doc.id} to={docPath(doc)} className="effect-card" data-effect={doc.id}>
            <div className="effect-card-preview" aria-hidden="true">
              {doc.render(defaultValues(doc.controls))}
            </div>
            <div className="effect-card-meta">
              <div className="effect-card-head">
                <span className="effect-card-name">{doc.name}</span>
                <ArrowUpRight size={15} aria-hidden />
              </div>
              <p className="effect-card-blurb">{doc.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
