/**
 * ShinyText — React Bits
 *
 * A soft highlight sheen sweeps across the text on a loop. The base colour is
 * inherited (`currentColor`) so it adopts whatever the surrounding editorial
 * register sets; the sweep highlight defaults to the paper white but can be
 * pointed at the accent for a red glint.
 *
 * @param {object} props
 * @param {string} props.text - The string to render.
 * @param {number} [props.speed=5] - Seconds per sweep.
 * @param {string} [props.highlight] - CSS colour for the moving highlight.
 * @param {React.ElementType} [props.as='span'] - Rendered element.
 */
import clsx from "clsx";

const ShinyText = ({ text, speed = 5, highlight, as: Tag = "span", className, style, ...rest }) => (
  <Tag
    className={clsx("rb-shiny-text", className)}
    style={{
      "--rb-shiny-speed": `${speed}s`,
      ...(highlight ? { "--rb-shiny-highlight": highlight } : null),
      ...style,
    }}
    {...rest}
  >
    {text}
  </Tag>
);

export default ShinyText;
