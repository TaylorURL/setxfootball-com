/**
 * GlareHover — React Bits
 *
 * Sweeps a diagonal glare across the surface on hover — a quick sheen that
 * reads like light catching a printed card. Pure CSS (see reactbits.css); the
 * glare is hidden entirely under reduced-motion.
 *
 * @param {object} props
 * @param {string} [props.glareColor='var(--ds-sheen-strong)'] - Glare tint.
 * @param {number} [props.speed=650] - Sweep duration in milliseconds.
 * @param {React.ElementType} [props.as='div'] - Rendered element.
 */
import clsx from "clsx";

const GlareHover = ({
  children,
  glareColor = "var(--ds-sheen-strong)",
  speed = 650,
  as: Tag = "div",
  className,
  style,
  ...rest
}) => (
  <Tag
    className={clsx("rb-glare-hover", className)}
    style={{ "--rb-glare-color": glareColor, "--rb-glare-speed": `${speed}ms`, ...style }}
    {...rest}
  >
    {children}
    <span aria-hidden="true" className="rb-glare" />
  </Tag>
);

export default GlareHover;
