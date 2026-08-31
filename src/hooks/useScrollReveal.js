/**
 * Returns [ref, visible]. `visible` latches true on first intersection and never
 * flips back, so elements don't re-animate on scroll-up. Pairs with the
 * `.scroll-animate` / `.animate-visible` classes in index.css.
 */
import { useEffect, useRef, useState } from "react";

const DEFAULT_OPTIONS = { threshold: 0.12, rootMargin: "0px 0px -60px 0px" };

export const useScrollReveal = (options = DEFAULT_OPTIONS) => {
  const { threshold, rootMargin } = { ...DEFAULT_OPTIONS, ...options };
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, visible };
};
