/**
 * @param {object} props
 * @param {string[]} props.texts - Words to cycle through.
 * @param {number} [props.interval=2600] - Milliseconds each word is shown.
 * @param {React.ElementType} [props.as='span'] - Rendered wrapper element.
 */
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

const RotatingText = ({ texts = [], interval = 2600, as: Tag = "span", className, ...rest }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (texts.length <= 1) return undefined;
    const id = setInterval(() => setIndex((prev) => (prev + 1) % texts.length), interval);
    return () => clearInterval(id);
  }, [texts.length, interval]);

  return (
    <Tag className={clsx("relative inline-flex overflow-hidden align-bottom", className)} {...rest}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className="inline-block"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
    </Tag>
  );
};

export default RotatingText;
