/**
 * TiltedCard — React Bits
 *
 * Tilts its children in 3D toward the cursor on hover, with a spring settle and
 * a gentle scale, giving photos and cards a tactile, physical response. The
 * perspective is subtle by design so it reads as premium, not gimmicky.
 *
 * @param {object} props
 * @param {number} [props.max=10] - Maximum tilt in degrees on each axis.
 * @param {number} [props.scale=1.03] - Hover scale factor.
 * @param {React.ElementType} [props.as='div'] - Rendered element.
 */
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import clsx from "clsx";

const TiltedCard = ({
  children,
  max = 10,
  scale = 1.03,
  as = "div",
  className,
  ...rest
}) => {
  const ref = useRef(null);
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const rx = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const ry = useSpring(useMotionValue(0), { stiffness: 260, damping: 22 });
  const s = useSpring(useMotionValue(1), { stiffness: 260, damping: 22 });
  const MotionTag = motion(as);

  const handleMove = (event) => {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * max * 2);
    rx.set(-py * max * 2);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    s.set(1);
  };

  return (
    <MotionTag
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => !reduced && s.set(scale)}
      onMouseLeave={reset}
      className={clsx("[transform-style:preserve-3d]", className)}
      style={reduced ? undefined : { rotateX: rx, rotateY: ry, scale: s, transformPerspective: 900 }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export default TiltedCard;
