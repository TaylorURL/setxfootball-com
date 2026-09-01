/**
 * A drifting grid, used as the ground of a section rather than as content.
 *
 * The canvas draws only the moving lines. The vignette that fades them into the
 * page edge is a sibling element carrying a CSS gradient, which keeps a
 * full-surface fill out of the per-frame path and lets the fade follow the
 * surface register live instead of being resolved once at mount.
 *
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
    const stroke = getComputedStyle(canvas).getPropertyValue("color").trim();

    const offset = { x: 0, y: 0 };
    let raf = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      draw();
    };

    // Every line is one subpath of a single stroke. Stroking each cell as its
    // own rectangle costs a path per cell, which at this size is several
    // hundred per frame for the same picture.
    function draw() {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;
      ctx.strokeStyle = stroke;
      ctx.beginPath();
      for (let x = -(offset.x % size); x < width + size; x += size) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = -(offset.y % size); y < height + size; y += size) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }

    const loop = () => {
      if (direction === "diagonal") {
        offset.x += speed;
        offset.y += speed;
      } else if (direction === "up") {
        offset.y += speed;
      } else {
        offset.x += speed;
      }
      draw();
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("resize", resize);
    resize();

    // Under reduced motion the grid is a still image, so it is painted once and
    // no frame is ever requested. Freezing the offset while leaving the loop
    // running would repaint an identical canvas sixty times a second.
    if (reduced) {
      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    // Only animate while the canvas is on screen and the tab is the one being
    // looked at. Anywhere else the loop stops entirely rather than drifting a
    // picture nobody is in front of. `raf` doubles as the running flag, so
    // whichever of the two conditions changes, the state it lands in is the
    // same.
    let onScreen = false;
    const sync = () => {
      const wanted = onScreen && !document.hidden;
      if (wanted && raf === null) {
        raf = requestAnimationFrame(loop);
      } else if (!wanted && raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    observer.observe(canvas);
    document.addEventListener("visibilitychange", sync);

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", sync);
      observer.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [size, speed, direction]);

  // The caller positions the group; the canvas and its vignette fill it. Every
  // call site passes `absolute inset-0`, so the wrapper is already the
  // containing block for the fade.
  return (
    <span aria-hidden="true" className={clsx("pointer-events-none block", className)}>
      <canvas ref={canvasRef} className="rb-canvas" style={{ color: lineColor }} />
      <span
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, transparent 0%, var(--ds-bg) 72%)",
        }}
      />
    </span>
  );
};

export default Squares;
