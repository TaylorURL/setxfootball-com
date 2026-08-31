/**
 * @param {object} props
 * @param {'up'|'down'|'left'|'right'} [props.direction='up'] - Entrance vector.
 * @param {number} [props.distance=48] - Travel distance in pixels.
 * @param {number} [props.delay=0] - Entrance delay in seconds.
 * @param {number} [props.duration=0.8] - Entrance duration in seconds.
 * @param {boolean} [props.scale=false] - Also scale up from 0.94.
 * @param {React.ElementType} [props.as='div'] - Rendered element.
 */
import { motion } from "framer-motion";

const AXIS = {
  up: { key: "y", sign: 1 },
  down: { key: "y", sign: -1 },
  left: { key: "x", sign: 1 },
  right: { key: "x", sign: -1 },
};

const AnimatedContent = ({
  children,
  direction = "up",
  distance = 48,
  delay = 0,
  duration = 0.8,
  scale = false,
  as = "div",
  className,
  ...rest
}) => {
  const MotionTag = motion(as);
  const { key, sign } = AXIS[direction] ?? AXIS.up;
  const hidden = { opacity: 0, [key]: sign * distance, ...(scale ? { scale: 0.94 } : null) };
  const visible = { opacity: 1, x: 0, y: 0, ...(scale ? { scale: 1 } : null) };

  return (
    <MotionTag
      className={className}
      initial={hidden}
      whileInView={visible}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export default AnimatedContent;
