import { usePageTitle } from '../lib/usePageTitle';

/** Temporary stand-in while a chapter is being written (removed in later phases). */
export function StubPage({ title }: { title: string }) {
  usePageTitle(title);
  return (
    <div className="placeholder-page">
      <span className="fj-eyebrow">In progress</span>
      <h1>{title}</h1>
      <p>This chapter is being written. It arrives with the docs engine.</p>
    </div>
  );
}
