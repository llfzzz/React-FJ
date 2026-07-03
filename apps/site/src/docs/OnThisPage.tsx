import { useEffect, useState, type RefObject } from 'react';
import { useLocation } from 'react-router-dom';

interface Heading {
  id: string;
  text: string;
}

/**
 * Sticky "on this page" rail built from the current route's own `.doc-h2`
 * headings (rendered by DocSection) — no per-page wiring needed. Renders
 * nothing below two headings, so plain pages (catalog) stay single-column.
 */
export function OnThisPage({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const { pathname } = useLocation();
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const nodes = Array.from(container.querySelectorAll<HTMLHeadingElement>('.doc-h2[id]'));
    setHeadings(nodes.map((node) => ({ id: node.id, text: node.textContent ?? '' })));
    setActiveId(nodes[0]?.id ?? null);
  }, [pathname, containerRef]);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b,
        );
        setActiveId(topmost.target.id);
      },
      { rootMargin: '-96px 0px -70% 0px' },
    );
    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="on-this-page" aria-label="On this page">
      <span className="fj-eyebrow">On this page</span>
      <ul>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`} aria-current={heading.id === activeId ? 'location' : undefined}>
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
