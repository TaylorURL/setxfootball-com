/**
 * FadeContent — React Bits
 *
 * The quietest reveal: a straight opacity (and optional slight blur) fade-in
 * when the block scrolls into view, with no positional travel. Use where a
 * slide would fight the layout — image walls, dense grids, inline chips.
 *
 * @param {object} props
 * @param {number} [props.delay=0] - Entrance delay in seconds.
 * @param {number} [props.duration=0.9] - Entrance duration in seconds.
 * @param {boolean} [props.blur=false] - Also lift a soft blur on entrance.
 * @param {React.ElementType} [props.as='div'] - Rendered element.
 */
import { motion } from "framer-motion";

const FadeContent = ({
  children,
  delay = 0,
  duration = 0.9,
  blur = false,
  as = "div",
  className,
  ...rest
}) => {
  const MotionTag = motion(as);
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...(blur ? { filter: "blur(8px)" } : null) }}
      whileInView={{ opacity: 1, ...(blur ? { filter: "blur(0px)" } : null) }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export default FadeContent;
