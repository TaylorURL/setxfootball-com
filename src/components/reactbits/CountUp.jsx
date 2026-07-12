/**
 * CountUp — React Bits
 *
 * Animates a number from a start value up to a target the first time it scrolls
 * into view, easing out so the last digits settle gently. Framer Motion's
 * spring drives the tween; reduced-motion jumps straight to the final value.
 *
 * @param {object} props
 * @param {number} props.to - The final value.
 * @param {number} [props.from=0] - The starting value.
 * @param {number} [props.duration=1.6] - Seconds for the tween.
 * @param {string} [props.prefix=''] - Text before the number (e.g. "$").
 * @param {string} [props.suffix=''] - Text after the number (e.g. "+").
 * @param {React.ElementType} [props.as='span'] - Rendered element.
 */
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import clsx from "clsx";

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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [value, setValue] = useState(from);

  useEffect(() => {
    if (!inView) return undefined;
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
  }, [inView, from, to, duration]);

  return (
    <Tag ref={ref} className={clsx("mono-num", className)} {...rest}>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </Tag>
  );
};

export default CountUp;
