/**
 * A line that arrives one word at a time, each rising and sharpening into
 * place.
 *
 * The words are the only thing a reader is meant to see: the wrapper carries
 * the whole string as its accessible name and every span is hidden from the
 * accessibility tree, so a screen reader is read one sentence rather than
 * twenty fragments.
 *
 * @param {object} props
 * @param {string} props.text - The string to animate.
 * @param {number} [props.delay=120] - Per-word stagger in milliseconds.
 * @param {'top'|'bottom'} [props.direction='bottom'] - Where words rise from.
 * @param {React.ElementType} [props.as='p'] - Rendered wrapper element.
 */
import { Fragment } from "react";
import clsx from "clsx";

const BlurText = ({
  text = "",
  delay = 120,
  direction = "bottom",
  as: Tag = "p",
  className,
  ...rest
}) => {
  const words = text.split(" ");

  return (
    <Tag
      className={clsx("inline-block", className)}
      style={{ "--rb-blur-from": direction === "top" ? "-16px" : "16px" }}
      aria-label={text}
      {...rest}
    >
      {/* The space belongs to the line rather than to the word before it. A
          word box is inline-block, and a space at the end of one is at the end
          of a line box, which is where the browser drops it: the words would
          run together. Outside the box it is an ordinary space between two
          inline-level boxes, and it carries the wrap opportunity too. */}
      {words.map((word, index) => (
        <Fragment key={index}>
          <span
            aria-hidden="true"
            className="inline-block rb-blur-word"
            style={{ "--rb-blur-delay": `${index * delay}ms` }}
          >
            {word}
          </span>
          {index < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
};

export default BlurText;
