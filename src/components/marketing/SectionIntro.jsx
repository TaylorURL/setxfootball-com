/**
 * @param {object} props
 * @param {string} [props.eyebrow] - Optional small uppercase label.
 * @param {React.ReactNode} [props.badge] - Optional inline icon + label group
 *   (rendered with the same register as eyebrow).
 * @param {React.ReactNode} props.title - Display heading content.
 * @param {'h1'|'h2'} [props.as='h2'] - Heading level. The section that leads a
 *   route sets h1; every section under it keeps the default.
 * @param {React.ReactNode} [props.children] - Supporting copy beneath the heading.
 * @param {'start'|'center'} [props.align='start'] - Text alignment.
 * @param {string} [props.className]
 */
import clsx from "clsx";

const SectionIntro = ({
  eyebrow,
  badge,
  title,
  children,
  as: Heading = "h2",
  align = "start",
  className,
}) => {
  const centered = align === "center";
  return (
    <div className={clsx(centered ? "text-center" : "text-left", className)}>
      {(eyebrow || badge) && (
        <div className={clsx("mb-6", centered && "flex justify-center")}>
          <span className="eyebrow">{badge || eyebrow}</span>
        </div>
      )}
      <Heading
        className={clsx(
          "display text-ds-text",
          "text-[2.25rem] sm:text-[2.75rem] lg:text-[3.25rem]",
        )}
      >
        {title}
      </Heading>
      {children && (
        <p
          className={clsx(
            "body-copy mt-5 text-base text-ds-text-muted sm:text-lg",
            "max-w-2xl",
            centered && "mx-auto",
          )}
        >
          {children}
        </p>
      )}
    </div>
  );
};

export default SectionIntro;
