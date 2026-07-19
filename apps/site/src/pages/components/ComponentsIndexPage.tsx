import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, Grid, PageHeader, Stack, Text } from '@fj';
import type { Category } from '../../registry/types';
import { CATEGORY_LABELS, componentDocs, docPath, presentCategories } from '../../registry';
import { usePageTitle } from '../../lib/usePageTitle';

export function ComponentsIndexPage() {
  usePageTitle('Components');
  const [filter, setFilter] = useState<Category | 'all'>('all');
  const docs = componentDocs();
  const categories = presentCategories();
  const visible = filter === 'all' ? docs : docs.filter((doc) => doc.category === filter);

  return (
    <div>
      <PageHeader
        eyebrow="Catalog"
        title="Components"
        description={`${docs.length} documented components, one calm voice. Filter by group or browse the lot.`}
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
      <Grid min={250} gap={16}>
        {visible.map((doc) => (
          <Link key={doc.id} to={docPath(doc)} className="peek-link">
            <Card interactive style={{ height: '100%' }}>
              <Stack gap={10}>
                <Stack direction="row" gap={10} align="center" justify="space-between">
                  <Text variant="h4" as="h3">
                    {doc.name}
                  </Text>
                  <Badge>{CATEGORY_LABELS[doc.category]}</Badge>
                </Stack>
                <Text variant="small">{doc.blurb}</Text>
              </Stack>
            </Card>
          </Link>
        ))}
      </Grid>
    </div>
  );
}
