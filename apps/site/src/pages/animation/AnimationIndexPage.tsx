import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Badge, PageHeader } from '@fj';
import type { AnimationCategory, ComponentDoc } from '../../registry/types';
import {
  animationIndexDocs,
  CATEGORY_LABELS,
  docPath,
  presentAnimationCategories,
} from '../../registry';
import { defaultValues } from '../../registry/snippet';
import { CopyIconButton } from '../../docs/CopyIconButton';
import { usePageTitle } from '../../lib/usePageTitle';

const STATUS_LABELS: Record<NonNullable<ComponentDoc['status']>, string> = {
  stable: 'Stable',
  new: 'New',
  updated: 'Updated',
  experimental: 'Experimental',
};

function formatAdded(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Mounts the live preview only while the entry is near the viewport (300px of
 * headroom) and unmounts it again once it scrolls far away — each preview's
 * timers/rAF loops exist only while it's visible, so 47 stacked previews stay
 * cheap. The wrapper keeps a fixed min-height either way, so mounting never
 * shifts the layout.
 */
function LazyPreview({ doc }: { doc: ComponentDoc }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: '300px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="anim-entry-preview" aria-hidden="true">
      {near && doc.render(defaultValues(doc.controls))}
    </div>
  );
}

function AnimationIndexEntry({ doc }: { doc: ComponentDoc }) {
  const added = formatAdded(doc.addedAt);
  return (
    <article className="anim-entry" data-animation={doc.id}>
      <LazyPreview doc={doc} />
      <div className="anim-entry-body">
        <div className="anim-entry-head">
          <h2 className="anim-entry-name">{doc.name}</h2>
          {doc.status && doc.status !== 'stable' && (
            <Badge tone="accent">{STATUS_LABELS[doc.status]}</Badge>
          )}
          <Badge>{CATEGORY_LABELS[doc.category]}</Badge>
          {added && <span className="anim-entry-date">Added {added}</span>}
        </div>
        <p className="anim-entry-blurb">{doc.blurb}</p>
        <div className="anim-entry-install">
          <code>{doc.importLine}</code>
          <CopyIconButton value={doc.importLine} label={`Copy ${doc.name} import`} />
        </div>
        <Link to={docPath(doc)} className="anim-entry-link">
          View documentation
          <ArrowUpRight size={14} aria-hidden />
        </Link>
      </div>
    </article>
  );
}

/**
 * The animation index — the single entry point for browsing every animation.
 * All items stack vertically, newest first (explicit addedAt metadata, name as
 * the stable tiebreaker); the category chips filter the list without changing
 * that order. Full docs stay on each animation's own page.
 */
export function AnimationIndexPage() {
  usePageTitle('Animation index');
  const docs = useMemo(() => animationIndexDocs(), []);
  const categories = presentAnimationCategories();
  const [filter, setFilter] = useState<AnimationCategory | 'all'>('all');
  const visible = filter === 'all' ? docs : docs.filter((doc) => doc.category === filter);

  return (
    <article>
      <PageHeader
        eyebrow="Animation"
        title="Animation index"
        description={`All ${docs.length} animations in one stack, newest first. FJ ships them as source — copy the implementation from any animation's page. Every one respects prefers-reduced-motion.`}
      />
      <div className="control-chips catalog-filter" role="group" aria-label="Filter by category">
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
      <div className="anim-index">
        {visible.map((doc) => (
          <AnimationIndexEntry key={doc.id} doc={doc} />
        ))}
      </div>
    </article>
  );
}
