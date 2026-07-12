/**
 * GradientText — React Bits
 *
 * Fills the text with an animated multi-stop gradient that drifts left/right.
 * Defaults to the camp's athletic-red / paper ramp so it stays on-palette; pass
 * a custom `colors` array to retune it. Honours reduced-motion (freezes).
 *
 * @param {object} props
 * @param {string[]} [props.colors] - Gradient stops, looped for a seamless drift.
 * @param {number} [props.speed=8] - Seconds per full cycle.
 * @param {React.ElementType} [props.as='span'] - Rendered element.
 */
import clsx from "clsx";

const DEFAULT_COLORS = ["#ff2e3d", "#ffffff", "#e11d2a", "#ff8a92", "#ff2e3d"];

const GradientText = ({
  children,
  colors = DEFAULT_COLORS,
  speed = 8,
  as: Tag = "span",
  className,
  style,
  ...rest
}) => {
  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;
  return (
    <Tag className={clsx("rb-gradient-text", className)} style={style} {...rest}>
      <span
        className="rb-gradient-fill"
        style={{ backgroundImage: gradient, "--rb-gradient-speed": `${speed}s` }}
      >
        {children}
      </span>
    </Tag>
  );
};

export default GradientText;
