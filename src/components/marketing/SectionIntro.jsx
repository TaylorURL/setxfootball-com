/**
 * SectionIntro — the canonical marketing section header. Codifies the
 * typographic rhythm every public section shares so they stay visually
 * consistent.
 *
 * Two intros to choose from:
 *  - `eyebrow`: an accent-rule-flanked uppercase label (varsity look)
 *  - `badge`: a soft accent badge for shorter callouts
 *
 * Headings render in the stadium-stencil display weight so section titles
 * read like signage.
 *
 * @param {object} props
 * @param {string} [props.eyebrow] - Stripe-flanked uppercase label.
 * @param {React.ReactNode} [props.badge] - Badge contents (takes precedence over eyebrow).
 * @param {React.ReactNode} props.title - Display heading content.
 * @param {React.ReactNode} [props.children] - Supporting copy below the heading.
 * @param {'center'|'start'} [props.align='center'] - Text alignment.
 */
import clsx from "clsx";
import { Badge, Text } from "@bradley-t-t/sunday-design-system";

const StripeEyebrow = ({ children, centered }) => (
  <span
    className={clsx(
      "mb-5 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.24em] text-ds-accent-bright",
      centered ? "justify-center" : "justify-start",
    )}
  >
    <span aria-hidden="true" className="sideline-stripes inline-block h-1 w-10 rounded-sm" />
    {children}
    <span aria-hidden="true" className="sideline-stripes inline-block h-1 w-10 rounded-sm" />
  </span>
);

const SectionIntro = ({ eyebrow, badge, title, children, align = "center", className }) => {
  const centered = align === "center";
  return (
    <div className={clsx(centered && "text-center", className)}>
      {badge ? (
        <Badge tone="accent" variant="soft" size="lg" className="mb-4 uppercase tracking-[0.16em]">
          {badge}
        </Badge>
      ) : (
        eyebrow && <StripeEyebrow centered={centered}>{eyebrow}</StripeEyebrow>
      )}
      <h2
        className={clsx(
          "heading-stencil heading-stencil-tight mb-4 text-[2.25rem] text-ds-text sm:text-5xl lg:text-[3.5rem]",
        )}
      >
        {title}
      </h2>
      {children && (
        <Text tone="muted" size="lg" className={clsx(centered && "mx-auto max-w-2xl")}>
          {children}
        </Text>
      )}
    </div>
  );
};

export default SectionIntro;
