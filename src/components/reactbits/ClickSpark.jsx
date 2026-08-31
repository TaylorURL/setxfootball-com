/**
 * A short burst of lines at the pointer on every press, drawn to a fixed
 * full-window canvas that sits above the page and takes no pointer events.
 *
 * Mounted once at the app root, outside the router, because the canvas is sized
 * to the window and listens on it: remounting per route would rebuild both on
 * every navigation. Children are passed through so it can wrap a tree rather
 * than needing a place of its own in one.
 *
 * @param {object} props
 * @param {string} [props.sparkColor='var(--ds-accent-bright)'] - Spark stroke colour.
 * @param {number} [props.sparkCount=8] - Lines per burst.
 * @param {number} [props.sparkRadius=18] - Max reach of each line in pixels.
 * @param {number} [props.duration=420] - Burst lifetime in milliseconds.
 */
import { useEffect, useRef } from "react";

const ClickSpark = ({
  sparkColor = "var(--ds-accent-bright)",
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
    // Canvas cannot resolve a CSS variable, so the token is resolved once off
    // the canvas itself, which inherits the document's register.
    canvas.style.color = sparkColor;
    const stroke = getComputedStyle(canvas).color;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    let raf = null;

    // Clearing the whole viewport would repaint every pixel of a full-screen
    // layer for a burst that covers a few hundred. The live sparks all sit
    // within sparkRadius of their origin, so only that band is cleared.
    const clearLive = () => {
      const reach = sparkRadius * 1.6 + 4;
      for (const spark of sparksRef.current) {
        ctx.clearRect(spark.x - reach, spark.y - reach, reach * 2, reach * 2);
      }
    };

    const draw = (now) => {
      clearLive();
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
        ctx.strokeStyle = stroke;
        ctx.globalAlpha = 1 - progress;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });
      ctx.globalAlpha = 1;
      // Idle out once the last spark has faded, so no animation frame runs at rest.
      if (sparksRef.current.length > 0) {
        raf = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        raf = null;
      }
    };

    // Bound to the press, not to the click. A click event only arrives after
    // the button is released, and on a link it lands in the same task as the
    // route change, so the first frame of the burst queues behind a full
    // re-render and the effect reads as late.
    const handlePress = (event) => {
      if (reduced || event.button > 0) return;
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
    window.addEventListener("pointerdown", handlePress);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", handlePress);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [sparkColor, sparkCount, sparkRadius, duration]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="rb-canvas pointer-events-none fixed inset-0 z-spark"
      />
      {children}
    </>
  );
};

export default ClickSpark;
