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

    const probe = document.createElement("span");
    probe.style.cssText = `color:${baseColor};position:absolute;visibility:hidden`;
    canvas.parentElement?.appendChild(probe);
    const base = getComputedStyle(probe).color;
    probe.style.color = activeColor;
    const active = getComputedStyle(probe).color;
    probe.remove();

    const parseRGB = (str) => (str.match(/\d+/g) || [128, 128, 128]).map(Number);
    const [br, bg, bb] = parseRGB(base);
    const [ar, ag, ab] = parseRGB(active);

    let raf;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const handleLeave = () => {
      pointer.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      for (let x = gap; x < width; x += gap) {
        for (let y = gap; y < height; y += gap) {
          const dx = x - pointer.current.x;
          const dy = y - pointer.current.y;
          const dist = Math.hypot(dx, dy);
          const t = reduced ? 0 : Math.max(0, 1 - dist / proximity);
          const r = Math.round(br + (ar - br) * t);
          const g = Math.round(bg + (ag - bg) * t);
          const b = Math.round(bb + (ab - bb) * t);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.beginPath();
          ctx.arc(x, y, dotSize + t * dotSize * 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };

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

  return <canvas ref={canvasRef} aria-hidden="true" className={clsx("h-full w-full", className)} />;
};

export default DotGrid;
