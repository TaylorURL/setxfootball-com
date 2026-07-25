/**
 * @param {object} props
 * @param {string} props.text - The final resolved string.
 * @param {number} [props.speed=45] - Milliseconds between scramble frames.
 * @param {number} [props.revealPerTick=1] - Characters locked in per settle step.
 * @param {React.ElementType} [props.as='span'] - Rendered element.
 */
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import clsx from "clsx";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*<>/";
const randChar = (i) => CHARS[(i * 7 + Math.floor(performance.now() / 30)) % CHARS.length];

const DecryptedText = ({
  text = "",
  speed = 45,
  revealPerTick = 1,
  as: Tag = "span",
  className,
  ...rest
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView) return undefined;
    let revealed = 0;
    const id = setInterval(() => {
      revealed += revealPerTick;
      setDisplay(
        text
          .split("")
          .map((char, i) => (i < revealed || char === " " ? char : randChar(i)))
          .join(""),
      );
      if (revealed >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [inView, text, speed, revealPerTick]);

  return (
    <Tag ref={ref} className={clsx("rb-decrypted", className)} aria-label={text} {...rest}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
};

export default DecryptedText;
