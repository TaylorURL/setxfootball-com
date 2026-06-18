/**
 * SectionIntro — the canonical marketing section header: an optional eyebrow
 * (either a rule-flanked label or a soft accent badge), a display heading, and
 * optional supporting copy. Codifies the typographic rhythm every public
 * section shares so they stay visually consistent.
 *
 * @param {object} props
 * @param {string} [props.eyebrow] - Rule-flanked uppercase label.
 * @param {React.ReactNode} [props.badge] - Badge contents (takes precedence over eyebrow).
 * @param {React.ReactNode} props.title - Display heading content.
 * @param {React.ReactNode} [props.children] - Supporting copy below the heading.
 * @param {'center'|'start'} [props.align='center'] - Text alignment.
 */
import clsx from "clsx";
import { Badge, Heading, Text } from "@bradley-t-t/sunday-design-system";

const RuleEyebrow = ({ children }) => (
  <span className="mb-4 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ds-accent-bright">
    <span className="h-px w-8 bg-ds-accent" />
    {children}
    <span className="h-px w-8 bg-ds-accent" />
  </span>
);

const SectionIntro = ({ eyebrow, badge, title, children, align = "center", className }) => {
  const centered = align === "center";
  return (
    <div className={clsx(centered && "text-center", className)}>
      {badge ? (
        <Badge tone="accent" variant="soft" size="lg" className="mb-4">
          {badge}
        </Badge>
      ) : (
        eyebrow && <RuleEyebrow>{eyebrow}</RuleEyebrow>
      )}
      <Heading level="display" className="mb-4">
        {title}
      </Heading>
      {children && (
        <Text tone="muted" size="lg" className={clsx(centered && "mx-auto max-w-2xl")}>
          {children}
        </Text>
      )}
    </div>
  );
};

export default SectionIntro;
