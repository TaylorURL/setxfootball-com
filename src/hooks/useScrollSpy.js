/**
 * @module useScrollSpy
 * @description Tracks which in-page section is currently in view and returns its
 * id, so navigation can highlight the active destination. Observes each section
 * via a single IntersectionObserver tuned to fire when a section crosses the
 * upper third of the viewport. No-ops (returns the first id) when given no ids.
 */
import { useEffect, useState } from "react";

const OBSERVER_OPTIONS = { rootMargin: "-45% 0px -50% 0px", threshold: 0 };

export const useScrollSpy = (sectionIds = []) => {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null);

  useEffect(() => {
    if (sectionIds.length === 0) return undefined;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActiveId(visible.target.id);
    }, OBSERVER_OPTIONS);

    const nodes = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
};
