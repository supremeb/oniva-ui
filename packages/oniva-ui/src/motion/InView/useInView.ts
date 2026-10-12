import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions {
  /** Stop observing after the first intersection. Default `true`. */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
}

/**
 * IntersectionObserver hook. Returns a callback ref and `inView`. Where IntersectionObserver is
 * unavailable (SSR, old browsers, jsdom) `inView` is `true` so content is never stuck hidden.
 */
export function useInView<T extends Element = HTMLElement>({ once = true, rootMargin = '0px', threshold = 0.1 }: UseInViewOptions = {}) {
  const [el, setEl] = useState<T | null>(null);
  const [inView, setInView] = useState(typeof IntersectionObserver === 'undefined');
  const done = useRef(false);

  useEffect(() => {
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) {
            done.current = true;
            io.disconnect();
          }
        } else if (!once) setInView(false);
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [el, once, rootMargin, threshold]);

  return { ref: setEl as (node: T | null) => void, inView };
}
