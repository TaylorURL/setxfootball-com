/**
 * SectionIntro — the canonical marketing section header. Editorial register:
 * a monospace eyebrow with a hairline accent rule, a tight industrial-grotesque
 * display title, and a left-aligned supporting paragraph. Section titles read
 * like editorial spreads, not banners.
 *
 * @param {object} props
 * @param {string} [props.eyebrow] - Optional mono uppercase label.
 * @param {React.ReactNode} [props.badge] - Optional inline icon + label group
 *   (rendered with the same mono register as eyebrow).
 * @param {React.ReactNode} props.title - Display heading content.
 * @param {React.ReactNode} [props.children] - Supporting copy beneath the heading.
 * @param {'start'|'center'} [props.align='start'] - Text alignment.
 * @param {string} [props.index] - Optional section index ("01", "02") rendered as
 *   a hanging numeral in the editorial register.
 * @param {string} [props.className]
 */
import clsx from "clsx";

const SectionIntro = ({
  eyebrow,
  badge,
  title,
  children,
  align = "start",
  index,
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
      <div
        className={clsx(
          "flex items-baseline gap-5",
          centered && "justify-center",
        )}
      >
        {index && (
          <span
            className="mono-tag-lg shrink-0 translate-y-[-0.5em] text-ds-text-faint"
            aria-hidden="true"
          >
            {index}
          </span>
        )}
        <h2
          className={clsx(
            "editorial-display editorial-display-tight text-ds-text",
            "text-[2.5rem] sm:text-[3.5rem] lg:text-[4.5rem]",
          )}
        >
          {title}
        </h2>
      </div>
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
