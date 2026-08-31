import { useEffect, useRef, useState } from "react";

const REVEAL_OPTIONS = { threshold: 0.4 };

const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

/**
 * Counts a number up once, the first time its element scrolls into view.
 *
 * Returns a ref for the element to observe, plus the current display string.
 * Under reduced motion the target is set immediately and no animation runs.
 *
 * @param {number} target - The number to animate up to.
 * @param {object} [opts]
 * @param {number} [opts.durationMs=1400] - How long the count-up takes.
 * @param {string} [opts.suffix=""] - Appended after the number every frame.
 * @param {string} [opts.prefix=""] - Prepended before the number every frame.
 */
export const useCountUp = (target, { durationMs = 1400, suffix = "", prefix = "" } = {}) => {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof target !== "number") return undefined;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setValue(target);
      return undefined;
    }

    // The frame handle lives out here so unmounting mid-count can cancel it.
    // An IntersectionObserver discards whatever its callback returns, so a
    // cleanup function declared inside it is never called.
    let frame = 0;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      observer.unobserve(entry.target);

      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const t = Math.min(1, elapsed / durationMs);
        setValue(Math.round(target * easeOutQuint(t)));
        if (t < 1) {
          frame = requestAnimationFrame(tick);
        }
      };

      frame = requestAnimationFrame(tick);
    }, REVEAL_OPTIONS);

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target, durationMs]);

  return { ref, display: `${prefix}${value}${suffix}` };
};
