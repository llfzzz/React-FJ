import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Badge, PageHeader } from '@fj';
import type { Category } from '../../registry/types';
import { CATEGORY_LABELS, effectDocs } from '../../registry';
import { defaultValues } from '../../registry/snippet';
import { usePageTitle } from '../../lib/usePageTitle';

/**
 * The Effects & Motion gallery: a filterable grid of live mini-previews. Each
 * card renders the effect at its default settings and links to the full
 * component page (playground, props, 4-format code, a11y notes).
 */
export function EffectsGalleryPage() {
  usePageTitle('Effects & Motion');
  const docs = useMemo(() => effectDocs(), []);
  const categories = useMemo(() => {
    const present = new Set(docs.map((d) => d.category));
    return Array.from(present) as Category[];
  }, [docs]);
  const [filter, setFilter] = useState<Category | 'all'>('all');

  const visible = filter === 'all' ? docs : docs.filter((d) => d.category === filter);

  return (
    <article>
      <PageHeader
        eyebrow="Effects & Motion"
        title="Motion gallery"
        description="Reusable, token-driven effects for hero and showcase surfaces. Preview them live, then open any one for its playground, props, code, and accessibility notes."
      />

      <div className="control-chips catalog-filter" role="group" aria-label="Filter by effect family">
        <button
          type="button"
          className="control-chip"
          aria-pressed={filter === 'all'}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className="control-chip"
            aria-pressed={filter === category}
            onClick={() => setFilter(category)}
          >
            {CATEGORY_LABELS[category]}
          </button>
        ))}
      </div>

      <div className="effects-gallery">
        {visible.map((doc) => (
          <Link key={doc.id} to={`/components/${doc.id}`} className="effect-card" data-effect={doc.id}>
            <div className="effect-card-preview" aria-hidden="true">
              {doc.render(defaultValues(doc.controls))}
            </div>
            <div className="effect-card-meta">
              <div className="effect-card-head">
                <span className="effect-card-name">{doc.name}</span>
                <ArrowUpRight size={15} aria-hidden />
              </div>
              <p className="effect-card-blurb">{doc.blurb}</p>
              <Badge tone="accent">{CATEGORY_LABELS[doc.category]}</Badge>
            </div>
          </Link>
        ))}
      </div>
    </article>
  );
}
