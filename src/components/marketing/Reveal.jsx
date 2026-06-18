/**
 * Reveal — design-system motion primitive for the public marketing surfaces.
 *
 * Wraps content in the shared `.scroll-animate` reveal vocabulary (defined in
 * index.css, reduced-motion aware) and drives it from a per-element
 * IntersectionObserver. One component replaces the scattered class-string +
 * observer boilerplate the landing page used to hand-roll.
 *
 * @param {object} props
 * @param {'up'|'left'|'right'|'scale'} [props.variant='up'] - Entrance direction.
 * @param {1|2|3|4|5|6|7|8} [props.delay] - Stagger step (maps to `.delay-N`).
 * @param {React.ElementType} [props.as='div'] - Rendered element/tag.
 */
import clsx from "clsx";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const VARIANT_CLASS = {
  up: "",
  left: "from-left",
  right: "from-right",
  scale: "scale-in",
};

const Reveal = ({ variant = "up", delay, as: Tag = "div", className, children, ...rest }) => {
  const { ref, visible } = useScrollReveal();

  return (
    <Tag
      ref={ref}
      className={clsx(
        "scroll-animate",
        VARIANT_CLASS[variant],
        delay && `delay-${delay}`,
        visible && "animate-visible",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
