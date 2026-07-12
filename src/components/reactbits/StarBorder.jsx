/**
 * StarBorder — React Bits
 *
 * Wraps content in a hairline frame with a soft accent glow that orbits the top
 * and bottom edges on a loop, giving a button or card a living, premium border
 * without any hue outside the red accent. Renders as a real element via `as`,
 * so it can be a `Link`, `button`, or plain block.
 *
 * @param {object} props
 * @param {string} [props.color='var(--ds-accent-bright)'] - Glow colour.
 * @param {number} [props.speed=6] - Seconds per orbit.
 * @param {string} [props.innerClassName] - Classes for the inner content layer.
 * @param {React.ElementType} [props.as='div'] - Rendered wrapper element.
 */
import clsx from "clsx";

const StarBorder = ({
  children,
  color = "var(--ds-accent-bright)",
  speed = 6,
  as: Tag = "div",
  className,
  innerClassName,
  style,
  ...rest
}) => (
  <Tag
    className={clsx("rb-star-border", className)}
    style={{ "--rb-star-color": color, "--rb-star-speed": `${speed}s`, ...style }}
    {...rest}
  >
    <span aria-hidden="true" className="rb-star-glow rb-star-glow-bottom" />
    <span aria-hidden="true" className="rb-star-glow rb-star-glow-top" />
    <span className={clsx("rb-star-inner block", innerClassName)}>{children}</span>
  </Tag>
);

export default StarBorder;
