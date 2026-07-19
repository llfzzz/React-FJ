import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, PageHeader } from '@fj';
import type { Category, ComponentDoc } from '../../registry/types';
import { CATEGORY_LABELS, docPath, indexDocs, presentIndexCategories } from '../../registry';
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
 * timers/rAF loops exist only while it's visible, so the whole stack stays
 * cheap however many items it holds. The wrapper keeps a fixed height either
 * way, so mounting never shifts the layout.
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
    <div ref={ref} className="index-entry-preview" aria-hidden="true">
      {near && doc.render(defaultValues(doc.controls))}
    </div>
  );
}

/**
 * One entry of the stack. The whole card is the click target, split across
 * two links to the same page: the preview column is wrapped in its own link
 * (demos stay hover-live inside it, and their clicks bubble up into
 * navigation), while the name link's ::after stretches over the text body.
 * The copy button sits above that overlay and keeps working on its own.
 */
function IndexEntry({ doc }: { doc: ComponentDoc }) {
  const added = formatAdded(doc.addedAt);
  return (
    <article className="index-entry" data-doc={doc.id}>
      {/* Duplicate of the name link for pointers only — hidden from AT/tabs. */}
      <Link
        to={docPath(doc)}
        className="index-entry-preview-wrap"
        tabIndex={-1}
        aria-hidden="true"
      >
        <LazyPreview doc={doc} />
      </Link>
      <div className="index-entry-body">
        <div className="index-entry-head">
          <h2 className="index-entry-name">
            <Link to={docPath(doc)} className="index-entry-anchor">
              {doc.name}
            </Link>
          </h2>
          {doc.status && doc.status !== 'stable' && (
            <Badge tone="accent">{STATUS_LABELS[doc.status]}</Badge>
          )}
          <Badge>{CATEGORY_LABELS[doc.category]}</Badge>
          {added && <span className="index-entry-date">Added {added}</span>}
        </div>
        <p className="index-entry-blurb">{doc.blurb}</p>
        <div className="index-entry-install">
          <code>{doc.importLine}</code>
          <CopyIconButton value={doc.importLine} label={`Copy ${doc.name} import`} />
        </div>
      </div>
    </article>
  );
}

/**
 * The Index — one flat, newest-first stack of everything in the library:
 * components and animations together, unclassified, explicit `addedAt` first
 * with name as the stable tiebreaker. The category chips optionally narrow the
 * list without changing that order. Full docs stay on each item's own page.
 */
export function IndexPage() {
  usePageTitle('Index');
  const docs = useMemo(() => indexDocs(), []);
  const categories = presentIndexCategories();
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const visible = filter === 'all' ? docs : docs.filter((doc) => doc.category === filter);

  return (
    <article>
      <PageHeader title="Index" />
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
      <div className="index-stack">
        {visible.map((doc) => (
          <IndexEntry key={doc.id} doc={doc} />
        ))}
      </div>
    </article>
  );
}
