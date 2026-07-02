import type { ReactNode } from 'react';

/** Anchored documentation section with an editorial heading. */
export function DocSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="doc-section" aria-labelledby={`section-${id}`}>
      <h2 className="doc-h2" id={`section-${id}`}>
        {title}
      </h2>
      {children}
    </section>
  );
}
