/**
 * @module useCountUp
 * @description Animates a numeric value from 0 up to `target` on first
 * intersection with the viewport. Returns a ref to attach to the displayed
 * element and the current displayed string. Honors prefers-reduced-motion by
 * jumping straight to the final value with no animation.
 */
import { useEffect, useRef, useState } from "react";

const REVEAL_OPTIONS = { threshold: 0.4 };

const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5);

/**
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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.unobserve(entry.target);

        const start = performance.now();
        let frame = 0;

        const tick = (now) => {
          const elapsed = now - start;
          const t = Math.min(1, elapsed / durationMs);
          setValue(Math.round(target * easeOutQuint(t)));
          if (t < 1) {
            frame = requestAnimationFrame(tick);
          }
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
      },
      REVEAL_OPTIONS,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, durationMs]);

  return { ref, display: `${prefix}${value}${suffix}` };
};
