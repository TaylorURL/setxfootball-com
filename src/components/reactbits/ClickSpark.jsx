/**
 * ClickSpark — React Bits
 *
 * A transparent canvas overlay that fires a short burst of radial spark lines
 * wherever the user clicks. Mounted once near the app root so every click
 * anywhere on the site gets the same accent-red flourish. Pointer events pass
 * straight through, so it never interferes with the UI beneath it, and the
 * draw loop idles completely between clicks (no permanent rAF) to stay light.
 *
 * @param {object} props
 * @param {string} [props.sparkColor='#ff2e3d'] - Spark stroke colour.
 * @param {number} [props.sparkCount=8] - Lines per burst.
 * @param {number} [props.sparkRadius=18] - Max reach of each line in pixels.
 * @param {number} [props.duration=420] - Burst lifetime in milliseconds.
 */
import { useEffect, useRef } from "react";

const ClickSpark = ({
  sparkColor = "#ff2e3d",
  sparkCount = 8,
  sparkRadius = 18,
  duration = 420,
  children,
}) => {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    let raf = null;

    const draw = (now) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = now - spark.start;
        if (elapsed >= duration) return false;
        const progress = easeOut(elapsed / duration);
        const distance = progress * sparkRadius;
        const length = sparkRadius * 0.4 * (1 - progress);
        const x1 = spark.x + distance * Math.cos(spark.angle);
        const y1 = spark.y + distance * Math.sin(spark.angle);
        const x2 = spark.x + (distance + length) * Math.cos(spark.angle);
        const y2 = spark.y + (distance + length) * Math.sin(spark.angle);
        ctx.strokeStyle = sparkColor;
        ctx.globalAlpha = 1 - progress;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });
      ctx.globalAlpha = 1;
      // Idle out once the last spark has faded — no permanent animation frame.
      if (sparksRef.current.length > 0) {
        raf = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        raf = null;
      }
    };

    const handleClick = (event) => {
      if (reduced) return;
      const now = performance.now();
      for (let i = 0; i < sparkCount; i += 1) {
        sparksRef.current.push({
          x: event.clientX,
          y: event.clientY,
          angle: (2 * Math.PI * i) / sparkCount,
          start: now,
        });
      }
      if (raf === null) raf = requestAnimationFrame(draw);
    };
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", handleClick);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [sparkColor, sparkCount, sparkRadius, duration]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[60]"
      />
      {children}
    </>
  );
};

export default ClickSpark;
