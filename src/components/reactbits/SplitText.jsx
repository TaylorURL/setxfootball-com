/**
 * A line that arrives one unit at a time, each rising and sharpening into place.
 *
 * The entrance is the same keyframe BlurText uses, so a heading and a paragraph
 * of body copy settle on one curve rather than on two that nearly agree. What
 * this adds is the wait: a heading further down the page is meant to arrive as
 * the reader reaches it, not while it is still off screen. A paused animation
 * with a `backwards` fill is that held state exactly - the units sit in the
 * frame they would have started from - so letting it run is the whole of the
 * trigger and nothing is drawn twice.
 *
 * Units are staggered by the same delay a JS runtime would have applied, handed
 * over as a custom property per unit, which leaves the animation on the
 * compositor and out of the main thread the rest of the page is waiting on.
 *
 * The units are the only thing a reader is meant to see: the wrapper carries the
 * whole string as its accessible name and every span is hidden from the
 * accessibility tree, so a screen reader is read one line rather than twenty
 * fragments.
 *
 * @param {object} props
 * @param {string} props.text - The string to animate.
 * @param {'chars'|'words'} [props.splitType='chars'] - Split granularity.
 * @param {number} [props.delay=40] - Per-unit stagger in milliseconds.
 * @param {React.ElementType} [props.as='span'] - Rendered wrapper element.
 */
import { useMemo } from "react";
import clsx from "clsx";
import { useScrollReveal } from "../../hooks/useScrollReveal";

// A line starts when a third of it is on screen, measured against the viewport
// itself: a heading is short enough that the shared reveal's early margin would
// fire it a screen before the reader gets there.
const REVEAL_OPTIONS = { threshold: 0.3, rootMargin: "0px" };

const SplitText = ({
  text = "",
  splitType = "chars",
  delay = 40,
  as: Tag = "span",
  className,
  ...rest
}) => {
  const { ref, visible } = useScrollReveal(REVEAL_OPTIONS);

  // A words split keeps the whitespace between words as units of its own, which
  // is what leaves the line somewhere to wrap. Those gaps are not animated and
  // take no turn in the stagger: a slot spent on a space is a hole in the run.
  const units = useMemo(() => {
    const parts = splitType === "words" ? text.split(/(\s+)/) : Array.from(text);
    let turn = 0;
    return parts.map((part) => {
      const blank = part.trim() === "";
      return { part, blank, at: blank ? 0 : turn++ * delay };
    });
  }, [text, splitType, delay]);

  return (
    <Tag
      ref={ref}
      className={clsx("inline-block", className)}
      style={{ "--rb-blur-from": "0.5em", "--rb-blur-amount": "4px" }}
      role="img"
      aria-label={text}
      {...rest}
    >
      {units.map(({ part, blank, at }, index) =>
        blank ? (
          <span key={index} aria-hidden="true">
            {part}
          </span>
        ) : (
          <span
            key={index}
            aria-hidden="true"
            className={clsx("inline-block rb-blur-word", !visible && "rb-blur-word-held")}
            style={{ "--rb-blur-delay": `${at}ms` }}
          >
            {part}
          </span>
        ),
      )}
    </Tag>
  );
};

export default SplitText;
