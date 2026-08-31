/**
 * @param {object} props
 * @param {number} [props.gap=34] - Spacing between dots in pixels.
 * @param {number} [props.dotSize=2] - Base dot radius in pixels.
 * @param {number} [props.proximity=110] - Cursor influence radius in pixels.
 * @param {string} [props.baseColor='var(--ds-border-strong)'] - Resting colour.
 * @param {string} [props.activeColor='var(--ds-accent-bright)'] - Near-cursor colour.
 */
import { useEffect, useRef } from "react";
import clsx from "clsx";

const DotGrid = ({
  gap = 34,
  dotSize = 2,
  proximity = 110,
  baseColor = "var(--ds-border-strong)",
  activeColor = "var(--ds-accent-bright)",
  className,
}) => {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Canvas cannot resolve a CSS variable, so both tokens are resolved once
    // through a throwaway element that inherits the surface register.
    // Two probes rather than one repainted: writing a style between two reads
    // forces the layout engine to settle twice in the same frame.
    const baseProbe = document.createElement("span");
    const activeProbe = document.createElement("span");
    baseProbe.style.cssText = `color:${baseColor};position:absolute;visibility:hidden`;
    activeProbe.style.cssText = `color:${activeColor};position:absolute;visibility:hidden`;
    canvas.parentElement?.append(baseProbe, activeProbe);
    const base = getComputedStyle(baseProbe).color;
    const active = getComputedStyle(activeProbe).color;
    baseProbe.remove();
    activeProbe.remove();

    let raf;
    // The field only changes when the pointer does, so movement is what marks
    // the canvas dirty. Without this the grid repaints every frame for as long
    // as it is on screen, drawing an identical picture.
    let dirty = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      dirty = true;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
      dirty = true;
    };
    const handleLeave = () => {
      pointer.current = { x: -9999, y: -9999 };
      dirty = true;
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    const paint = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      for (let x = gap; x < width; x += gap) {
        for (let y = gap; y < height; y += gap) {
          const dx = x - pointer.current.x;
          const dy = y - pointer.current.y;
          const nearness = reduced ? 0 : Math.max(0, 1 - Math.hypot(dx, dy) / proximity);
          ctx.globalAlpha = 1;
          ctx.fillStyle = base;
          ctx.beginPath();
          ctx.arc(x, y, dotSize + nearness * dotSize * 1.6, 0, Math.PI * 2);
          ctx.fill();
          // Both colours arrive from the CSS tokens as opaque strings, so there
          // are no channels to interpolate. Painting the near-cursor colour over
          // the base at the proximity weight composites to the same blend.
          if (nearness > 0) {
            ctx.globalAlpha = nearness;
            ctx.fillStyle = active;
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      if (dirty) {
        paint();
        dirty = false;
      }
      raf = requestAnimationFrame(draw);
    };

    // A dot field with no proximity response is a still image, so it is painted
    // once and never asks for a frame.
    if (reduced) {
      paint();
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseleave", handleLeave);
      };
    }

    // Only paint while the field is on screen.
    let onScreen = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !onScreen) {
          onScreen = true;
          draw();
        } else if (!entry.isIntersecting && onScreen) {
          onScreen = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [gap, dotSize, proximity, baseColor, activeColor]);

  return <canvas ref={canvasRef} aria-hidden="true" className={clsx("rb-canvas", className)} />;
};

export default DotGrid;
