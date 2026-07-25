/**
 * @param {object} props
 * @param {string} props.sentence - The phrase to walk through.
 * @param {number} [props.interval=1400] - Milliseconds each word holds focus.
 * @param {number} [props.blur=5] - Blur radius (px) applied to unfocused words.
 * @param {string} [props.borderColor='var(--ds-accent)'] - Frame colour.
 */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const TrueFocus = ({
  sentence = "",
  interval = 1400,
  blur = 5,
  borderColor = "var(--ds-accent)",
  className,
}) => {
  const words = sentence.split(" ");
  const [active, setActive] = useState(0);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);
  const [frame, setFrame] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (words.length <= 1) return undefined;
    const id = setInterval(() => setActive((prev) => (prev + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  useEffect(() => {
    const node = wordRefs.current[active];
    const parent = containerRef.current;
    if (!node || !parent) return;
    const nodeRect = node.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    setFrame({
      x: nodeRect.left - parentRect.left,
      y: nodeRect.top - parentRect.top,
      width: nodeRect.width,
      height: nodeRect.height,
    });
  }, [active, sentence]);

  return (
    <span ref={containerRef} className={clsx("relative inline-flex flex-wrap gap-x-[0.3em]", className)}>
      {words.map((word, index) => (
        <span
          key={index}
          ref={(el) => (wordRefs.current[index] = el)}
          className="inline-block transition-[filter,opacity] duration-500"
          style={{
            filter: index === active ? "blur(0px)" : `blur(${blur}px)`,
            opacity: index === active ? 1 : 0.55,
          }}
        >
          {word}
        </span>
      ))}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0"
        animate={{ x: frame.x, y: frame.y, width: frame.width, height: frame.height }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        {["-top-1 -left-1 border-l border-t", "-top-1 -right-1 border-r border-t", "-bottom-1 -left-1 border-l border-b", "-bottom-1 -right-1 border-r border-b"].map(
          (corner) => (
            <span
              key={corner}
              className={clsx("absolute h-2 w-2", corner)}
              style={{ borderColor }}
            />
          ),
        )}
      </motion.span>
    </span>
  );
};

export default TrueFocus;
