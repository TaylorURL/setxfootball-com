/**
 * @param {object} props
 * @param {number} [props.size=52] - Cell size in pixels.
 * @param {number} [props.speed=0.4] - Drift speed in pixels per frame.
 * @param {'diagonal'|'up'|'right'} [props.direction='diagonal'] - Drift vector.
 * @param {string} [props.lineColor='var(--ds-border)'] - Grid line colour.
 */
import { useEffect, useRef } from "react";
import clsx from "clsx";

const Squares = ({
  size = 52,
  speed = 0.4,
  direction = "diagonal",
  lineColor = "var(--ds-border)",
  className,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const computed = getComputedStyle(canvas);
    const stroke = computed.getPropertyValue("color").trim() || "rgba(255,255,255,0.1)";
    // Canvas fillStyle can't resolve CSS variables, so read the resolved --ds-bg
    // (inherited from whatever surface register the canvas sits inside) for the
    // edge vignette. Fall back to the near-black canvas if it can't be read.
    const bgColor = computed.getPropertyValue("--ds-bg").trim() || "#0a0a0a";

    let offset = { x: 0, y: 0 };
    let raf;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = stroke;

      const startX = -((offset.x % size) + size);
      const startY = -((offset.y % size) + size);
      for (let x = startX; x < width + size; x += size) {
        for (let y = startY; y < height + size; y += size) {
          ctx.strokeRect(x, y, size, size);
        }
      }

      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.4,
      );
      gradient.addColorStop(0, "transparent");
      gradient.addColorStop(1, bgColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const loop = () => {
      if (!reduced) {
        if (direction === "diagonal") {
          offset.x += speed;
          offset.y += speed;
        } else if (direction === "up") {
          offset.y += speed;
        } else {
          offset.x += speed;
        }
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    // Only animate while the canvas is actually on screen — the loop stops
    // entirely when the section scrolls out of view.
    let onScreen = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !onScreen) {
          onScreen = true;
          loop();
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
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [size, speed, direction]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={clsx("h-full w-full", className)}
      style={{ color: lineColor }}
    />
  );
};

export default Squares;
