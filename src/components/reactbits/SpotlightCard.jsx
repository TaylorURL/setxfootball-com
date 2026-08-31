/**
 * @param {object} props
 * @param {string} [props.spotlightColor='var(--ds-accent-soft)'] - Wash colour.
 * @param {number} [props.size=320] - Spotlight diameter in pixels.
 * @param {React.ElementType} [props.as='div'] - Rendered element.
 */
import { useRef, useState } from "react";
import clsx from "clsx";

const SpotlightCard = ({
  children,
  spotlightColor = "var(--ds-accent-soft)",
  size = 320,
  as: Tag = "div",
  className,
  ...rest
}) => {
  const ref = useRef(null);
  const glowRef = useRef(null);
  const [opacity, setOpacity] = useState(0);

  // The pointer position is written straight onto the element as two custom
  // properties. Holding it in state would re-render this subtree on every
  // mousemove, which is a render per frame for a value only the gradient reads.
  const handleMove = (event) => {
    const rect = ref.current?.getBoundingClientRect();
    const glow = glowRef.current;
    if (!rect || !glow) return;
    glow.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    glow.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={clsx("relative overflow-hidden", className)}
      {...rest}
    >
      <span
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(${size}px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </Tag>
  );
};

export default SpotlightCard;
