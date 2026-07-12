/**
 * Waves — React Bits
 *
 * A field of horizontal hairlines that ripple as travelling sine waves across a
 * canvas, layered front-to-back with falling opacity. A calm, atmospheric
 * backdrop for closing callout bands. Line colour follows the current register.
 *
 * @param {object} props
 * @param {number} [props.lineCount=7] - Number of stacked wave lines.
 * @param {number} [props.amplitude=18] - Wave height in pixels.
 * @param {number} [props.speed=0.6] - Phase advance per frame.
 * @param {string} [props.lineColor='var(--ds-accent)'] - Stroke colour.
 */
import { useEffect, useRef } from "react";
import clsx from "clsx";

const Waves = ({
  lineCount = 7,
  amplitude = 18,
  speed = 0.6,
  lineColor = "var(--ds-accent)",
  className,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stroke = getComputedStyle(canvas).getPropertyValue("color").trim() || "#e11d2a";

    let phase = 0;
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
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;

      for (let line = 0; line < lineCount; line += 1) {
        const baseY = (height / (lineCount + 1)) * (line + 1);
        const depth = 1 - line / lineCount;
        ctx.globalAlpha = 0.06 + depth * 0.22;
        ctx.beginPath();
        for (let x = 0; x <= width; x += 8) {
          const y =
            baseY +
            Math.sin(x * 0.008 + phase + line * 0.6) * amplitude * depth +
            Math.sin(x * 0.02 - phase * 0.7) * amplitude * 0.35 * depth;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      if (!reduced) phase += speed * 0.03;
      draw();
      raf = requestAnimationFrame(loop);
    };

    // Pause the animation whenever the band is scrolled off screen.
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
  }, [lineCount, amplitude, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={clsx("h-full w-full", className)}
      style={{ color: lineColor }}
    />
  );
};

export default Waves;
