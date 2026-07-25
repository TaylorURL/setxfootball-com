/**
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
