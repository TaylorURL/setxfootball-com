/**
 * useAdaptiveNavSurface — detects which surface register (light vs dark) is
 * currently sitting under the fixed top navigation, so the nav's foreground
 * can flip to stay readable as the page scrolls across the alternating
 * light/dark section rhythm.
 *
 * Strategy: each tick (rAF-throttled scroll/resize, plus a re-sample on route
 * change) we probe the DOM element a few pixels below the nav using
 * `elementFromPoint`, then walk its ancestor chain looking for the nearest
 * `data-surface` attribute. No section needs to be registered with the hook;
 * any `[data-surface="light"]` block (the shared section helper already sets
 * this) is detected automatically — anything else defaults to dark.
 *
 * @param {React.RefObject<HTMLElement>} headerRef - Ref to the fixed nav header.
 * @returns {'light'|'dark'} The surface register currently under the nav.
 */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const PROBE_OFFSET_PX = 4;

const readSurfaceAt = (header) => {
  if (!header || typeof document === "undefined") return "dark";
  const rect = header.getBoundingClientRect();
  const probeX = Math.max(1, Math.min(window.innerWidth - 1, window.innerWidth / 2));
  const probeY = Math.max(1, rect.bottom + PROBE_OFFSET_PX);

  // elementFromPoint respects pointer-events:none, so we briefly hide the nav
  // from hit testing while we sample the surface beneath it.
  const previousPointerEvents = header.style.pointerEvents;
  header.style.pointerEvents = "none";
  const target = document.elementFromPoint(probeX, probeY);
  header.style.pointerEvents = previousPointerEvents;

  if (!target) return "dark";

  let cursor = target;
  while (cursor && cursor !== document.body) {
    const surface = cursor.getAttribute && cursor.getAttribute("data-surface");
    if (surface === "light") return "light";
    if (surface === "dark") return "dark";
    cursor = cursor.parentElement;
  }
  return "dark";
};

const useAdaptiveNavSurface = (headerRef) => {
  const [surface, setSurface] = useState("dark");
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    let rafId = 0;
    let current = "dark";

    const sample = () => {
      rafId = 0;
      const next = readSurfaceAt(headerRef.current);
      if (next !== current) {
        current = next;
        setSurface(next);
      }
    };

    const schedule = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(sample);
    };

    // Re-sample after the new route's DOM has been committed.
    const settle = window.requestAnimationFrame(() => {
      sample();
      window.requestAnimationFrame(sample);
    });

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (rafId) window.cancelAnimationFrame(rafId);
      window.cancelAnimationFrame(settle);
    };
  }, [headerRef, pathname]);

  return surface;
};

export default useAdaptiveNavSurface;
