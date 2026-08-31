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
        <div
          className={clsx(
            "mono-tag mb-6 inline-flex items-center gap-3 text-ds-accent-bright",
            centered && "justify-center",
          )}
        >
          <span aria-hidden="true" className="inline-block h-px w-10 bg-ds-accent" />
          {badge || eyebrow}
        </div>
      )}
      <Heading
        className={clsx(
          "editorial-display editorial-display-tight text-ds-text",
          "text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem]",
        )}
      >
        {title}
      </Heading>
      {children && (
        <p
          className={clsx(
            "editorial-body mt-6 text-lg text-ds-text-muted sm:text-xl",
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
