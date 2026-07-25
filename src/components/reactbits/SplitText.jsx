/**
 * @param {object} props
 * @param {string} props.text - The string to animate.
 * @param {'chars'|'words'} [props.splitType='chars'] - Split granularity.
 * @param {number} [props.delay=40] - Per-item stagger in milliseconds.
 * @param {React.ElementType} [props.as='span'] - Rendered wrapper element.
 */
import { useMemo } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const SplitText = ({
  text = "",
  splitType = "chars",
  delay = 40,
  as: Tag = "span",
  className,
  ...rest
}) => {
  const MotionTag = motion(Tag);
  const units = useMemo(
    () => (splitType === "words" ? text.split(/(\s+)/) : Array.from(text)),
    [text, splitType],
  );

  return (
    <MotionTag
      className={clsx("inline-block", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: delay / 1000 }}
      aria-label={text}
      {...rest}
    >
      {units.map((unit, index) =>
        unit.trim() === "" ? (
          <span key={index} aria-hidden="true">
            {unit}
          </span>
        ) : (
          <motion.span
            key={index}
            aria-hidden="true"
            className="inline-block will-change-transform"
            variants={{
              hidden: { opacity: 0, y: "0.5em", filter: "blur(4px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { type: "spring", stiffness: 260, damping: 24 },
              },
            }}
          >
            {unit}
          </motion.span>
        ),
      )}
    </MotionTag>
  );
};

export default SplitText;
