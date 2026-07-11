/**
 * ScrollReveal — React Bits
 *
 * Ties a paragraph's word-by-word reveal to the scroll position: each word
 * ramps from blurred and dim to sharp and solid as the block travels up
 * through the viewport, so the copy "develops" while the reader scrolls.
 *
 * @param {object} props
 * @param {string} props.children - The text to reveal (plain string).
 * @param {number} [props.baseOpacity=0.15] - Starting opacity for each word.
 * @param {number} [props.blur=4] - Starting blur (px) for each word.
 * @param {React.ElementType} [props.as='p'] - Rendered wrapper element.
 */
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";

const Word = ({ children, progress, range, baseOpacity, blur }) => {
  const opacity = useTransform(progress, range, [baseOpacity, 1]);
  const filter = useTransform(progress, range, [`blur(${blur}px)`, "blur(0px)"]);
  return (
    <motion.span className="inline-block" style={{ opacity, filter }}>
      {children}
    </motion.span>
  );
};

const ScrollReveal = ({
  children = "",
  baseOpacity = 0.15,
  blur = 4,
  as: Tag = "p",
  className,
  ...rest
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.5"],
  });
  const words = String(children).split(" ");
  const MotionTag = motion(Tag);

  return (
    <MotionTag ref={ref} className={clsx(className)} aria-label={String(children)} {...rest}>
      {words.map((word, index) => {
        const start = index / words.length;
        const end = (index + 1) / words.length;
        return (
          <span key={index} aria-hidden="true">
            <Word progress={scrollYProgress} range={[start, end]} baseOpacity={baseOpacity} blur={blur}>
              {word}
            </Word>
            {index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </MotionTag>
  );
};

export default ScrollReveal;
