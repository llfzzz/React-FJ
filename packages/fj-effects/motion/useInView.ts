import { useEffect, useRef, useState } from "react";

export interface UseInViewOptions {
  /** Stop observing after the first entry. @default true */
  once?: boolean;
  /** IntersectionObserver threshold. @default 0.2 */
  threshold?: number;
  /** IntersectionObserver rootMargin. @default "0px" */
  margin?: string;
  /** Skip observing entirely (treated as always in view). @default false */
  disabled?: boolean;
}

export interface UseInViewResult<T extends Element> {
  ref: React.RefObject<T | null>;
  inView: boolean;
}

/**
 * Reports whether the referenced element is in the viewport, via
 * IntersectionObserver. The shared scroll-trigger primitive for fj-effects.
 * When `disabled` (or IO is unavailable), it reports true so content is never
 * trapped hidden.
 */
export function useInView<T extends Element = HTMLElement>(options: UseInViewOptions = {}): UseInViewResult<T> {
  const { once = true, threshold = 0.2, margin = "0px", disabled = false } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setInView(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, threshold, margin, disabled]);

  return { ref, inView };
}
