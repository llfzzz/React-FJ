import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge, PageHeader } from '@fj';
import { adjacentDocs, CATEGORY_LABELS, getComponentDoc } from '../../registry';
import { Showcase } from '../../docs/Showcase';
import { CodeBlock } from '../../docs/CodeBlock';
import { ImplementationBlock } from '../../docs/ImplementationBlock';
import { PropsTable } from '../../docs/PropsTable';
import { DocSection } from '../../docs/DocSection';
import { usePageTitle } from '../../lib/usePageTitle';

function UnknownComponent({ id }: { id: string }) {
  usePageTitle('Component not found');
  return (
    <div className="placeholder-page">
      <span className="notfound-code">Not documented</span>
      <h1>No component called “{id}”.</h1>
      <p>It may not be documented yet — the catalog grows steadily.</p>
      <Link to="/components" className="btn btn-primary">
        Browse the catalog
      </Link>
    </div>
  );
}

export function ComponentPage() {
  const { id = '' } = useParams();
  const doc = getComponentDoc(id);
  usePageTitle(doc?.name);
  if (!doc) return <UnknownComponent id={id} />;

  const { prev, next } = adjacentDocs(doc.id);

  return (
    <article className="component-page">
      <PageHeader
        eyebrow={CATEGORY_LABELS[doc.category]}
        title={doc.name}
        description={doc.blurb}
        actions={<Badge tone="accent">{CATEGORY_LABELS[doc.category]}</Badge>}
      />

      <Showcase doc={doc} />

      <DocSection id="usage" title="Usage">
        <CodeBlock code={doc.importLine} lang="tsx" />
      </DocSection>

      {doc.implementation && (
        <DocSection id="implementation" title="Implementation">
          <p className="doc-note">
            The full component source, ready to copy into your own project. Pick the style you
            work in — the CSS and Tailwind versions reproduce the same look and states.
          </p>
          <ImplementationBlock doc={doc} />
        </DocSection>
      )}

      {doc.examples?.map((example) => (
        <DocSection key={example.title} id={example.title.toLowerCase().replace(/\s+/g, '-')} title={example.title}>
          {example.description && <p className="doc-note">{example.description}</p>}
          <div className="example-stage">{example.render()}</div>
          <CodeBlock code={example.code} lang="tsx" maxHeight={320} />
        </DocSection>
      ))}

      <DocSection id="props" title="Props">
        <PropsTable props={doc.props} />
      </DocSection>

      <DocSection id="accessibility" title="Accessibility">
        <ul className="doc-list">
          {doc.a11y.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </DocSection>

      <nav className="pager" aria-label="Component pagination">
        {prev ? (
          <Link to={`/components/${prev.id}`} className="pager-link">
            <ArrowLeft size={15} aria-hidden />
            <span>
              <small>Previous</small>
              {prev.name}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/components/${next.id}`} className="pager-link pager-next">
            <span>
              <small>Next</small>
              {next.name}
            </span>
            <ArrowRight size={15} aria-hidden />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
