/**
 * @param {object} props
 * @param {number} [props.padding=90] - Activation radius (px) around the element.
 * @param {number} [props.strength=0.35] - Fraction of cursor offset followed.
 * @param {React.ElementType} [props.as='div'] - Rendered element.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import clsx from "clsx";

const Magnet = ({
  children,
  padding = 90,
  strength = 0.35,
  as = "div",
  className,
  ...rest
}) => {
  const ref = useRef(null);
  const [reduced, setReduced] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 18, mass: 0.4 });
  const MotionTag = motion(as);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return undefined;
    const handleMove = (event) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      if (
        Math.abs(dx) < rect.width / 2 + padding &&
        Math.abs(dy) < rect.height / 2 + padding
      ) {
        x.set(dx * strength);
        y.set(dy * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [padding, strength, reduced, x, y]);

  return (
    <MotionTag
      ref={ref}
      className={clsx("inline-flex", className)}
      style={reduced ? undefined : { x: sx, y: sy }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export default Magnet;
