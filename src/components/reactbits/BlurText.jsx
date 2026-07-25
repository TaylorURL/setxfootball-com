/**
 * @param {object} props
 * @param {string} props.text - The string to animate.
 * @param {number} [props.delay=120] - Per-word stagger in milliseconds.
 * @param {'top'|'bottom'} [props.direction='bottom'] - Where words rise from.
 * @param {React.ElementType} [props.as='p'] - Rendered wrapper element.
 */
import { motion } from "framer-motion";
import clsx from "clsx";

const BlurText = ({
  text = "",
  delay = 120,
  direction = "bottom",
  as: Tag = "p",
  className,
  ...rest
}) => {
  const MotionTag = motion(Tag);
  const words = text.split(" ");
  const fromY = direction === "top" ? -16 : 16;

  return (
    <MotionTag
      className={clsx("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: delay / 1000 }}
      aria-label={text}
      {...rest}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          aria-hidden="true"
          className="inline-block will-change-[transform,filter]"
          variants={{
            hidden: { opacity: 0, y: fromY, filter: "blur(8px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
            },
          }}
        >
          {word}
          {index < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
};

export default BlurText;
