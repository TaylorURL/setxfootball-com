/**
 * Hit-tests the element just below the nav and walks up for the nearest
 * `data-surface`. Doing it by probe rather than by registration means sections
 * never have to opt in — anything without the attribute defaults to dark.
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

  // Without this the probe hits the nav itself — elementFromPoint honours
  // pointer-events, so disabling it for one frame lets us see through.
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

    // Two frames: one for the route DOM to commit, one for layout to settle.
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
