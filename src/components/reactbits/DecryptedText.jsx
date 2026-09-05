/**
 * @param {object} props
 * @param {string} props.text - The final resolved string.
 * @param {number} [props.speed=45] - Milliseconds between scramble frames.
 * @param {number} [props.revealPerTick=1] - Characters locked in per settle step.
 * @param {React.ElementType} [props.as='span'] - Rendered element.
 */
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useScrollReveal } from "../../hooks/useScrollReveal";

// The scramble starts when most of the run is on screen, measured against the
// viewport itself rather than through the shared reveal's early margin: the
// point of it is that the reader watches the characters settle.
const REVEAL_OPTIONS = { threshold: 0.6, rootMargin: "0px" };

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
  const { ref, visible } = useScrollReveal(REVEAL_OPTIONS);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!visible) return undefined;
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
  }, [visible, text, speed, revealPerTick]);

  return (
    <Tag
      ref={ref}
      className={clsx("rb-decrypted", className)}
      role="img"
      aria-label={text}
      {...rest}
    >
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
};

export default DecryptedText;
