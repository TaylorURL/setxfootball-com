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
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMove = (event) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
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
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </Tag>
  );
};

export default SpotlightCard;
