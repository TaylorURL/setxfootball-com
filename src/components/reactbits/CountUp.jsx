/**
 * @param {object} props
 * @param {number} props.to - The final value.
 * @param {number} [props.from=0] - The starting value.
 * @param {number} [props.duration=1.6] - Seconds for the tween.
 * @param {string} [props.prefix=''] - Text before the number (e.g. "$").
 * @param {string} [props.suffix=''] - Text after the number (e.g. "+").
 * @param {React.ElementType} [props.as='span'] - Rendered element.
 */
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useScrollReveal } from "../../hooks/useScrollReveal";

// The count starts against the viewport itself, with none of the shared
// reveal's early margin: a figure that has finished counting before the reader
// reaches it is a figure that never counted.
const REVEAL_OPTIONS = { threshold: 0.4, rootMargin: "0px" };

const CountUp = ({
  to,
  from = 0,
  duration = 1.6,
  prefix = "",
  suffix = "",
  as: Tag = "span",
  className,
  ...rest
}) => {
  const { ref, visible } = useScrollReveal(REVEAL_OPTIONS);
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!visible) return undefined;
    // A reader who asked for less motion gets the final figure, with no frame
    // loop competing with their next interaction.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return undefined;
    }
    let raf;
    let startTs;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (ts) => {
      if (startTs === undefined) startTs = ts;
      const progress = Math.min((ts - startTs) / (duration * 1000), 1);
      setValue(Math.round(from + (to - from) * ease(progress)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, from, to, duration]);

  return (
    <Tag ref={ref} className={clsx("mono-num", className)} {...rest}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </Tag>
  );
};

export default CountUp;
