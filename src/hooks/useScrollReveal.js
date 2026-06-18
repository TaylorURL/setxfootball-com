/**
 * @module useScrollReveal
 * @description Reveals an element once it scrolls into view. Returns a ref to
 * attach to the target and a `visible` flag that flips true on first intersect
 * (and stays true). Pairs with the `.scroll-animate` / `.animate-visible`
 * motion vocabulary in index.css, which already honors reduced-motion.
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
