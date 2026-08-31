/**
 * Reports which surface register sits under the fixed nav, so the bar can adopt
 * it rather than picking one contrast and hoping.
 *
 * A one-pixel band is watched directly beneath the bar, and the light sections
 * are observed against it. Whichever of them intersects the band is the section
 * currently behind the bar; when none does, the page is on the dark default.
 * Sections never have to opt in to being found, only to being light.
 *
 * The observer fires when a boundary crosses the band and stays silent
 * otherwise, which is what keeps this off the main thread during a scroll.
 * Reading the section under the bar by hit test costs a forced layout flush per
 * sample, and a hit test can only notice a boundary it did not cause by
 * sampling on a timer, so the two costs compound.
 *
 * @param {React.RefObject<HTMLElement>} headerRef - Ref to the fixed nav header.
 * @returns {'light'|'dark'} The surface register currently under the nav.
 */
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const useAdaptiveNavSurface = (headerRef) => {
  const [surface, setSurface] = useState("dark");
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    let observer = null;
    // Which light sections are currently in the band. A Set rather than a flag
    // because two sections touch the band on the frame their border crosses it,
    // and the leaving one must not cancel the arriving one.
    const inBand = new Set();

    const connect = () => {
      if (observer) observer.disconnect();
      inBand.clear();

      const header = headerRef.current;
      const bandTop = header ? header.getBoundingClientRect().bottom : 0;
      const bandBottom = window.innerHeight - bandTop - 1;
      if (bandBottom < 0) return;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) inBand.add(entry.target);
            else inBand.delete(entry.target);
          }
          setSurface(inBand.size > 0 ? "light" : "dark");
        },
        { rootMargin: `-${bandTop}px 0px -${bandBottom}px 0px`, threshold: 0 },
      );

      for (const section of document.querySelectorAll('[data-surface="light"]')) {
        observer.observe(section);
      }
    };

    connect();
    // The band is positioned from the viewport height, so it is rebuilt rather
    // than adjusted when that changes.
    window.addEventListener("resize", connect);

    return () => {
      window.removeEventListener("resize", connect);
      if (observer) observer.disconnect();
    };
  }, [headerRef, pathname]);

  return surface;
};

export default useAdaptiveNavSurface;
