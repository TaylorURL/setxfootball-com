/**
 * VarsityNumber — the camp's jersey-patch number chip: a stencil numeral on a
 * camp-red tile with the brand glow. One source of truth for the varsity
 * "roster number" treatment used across the hero, the registration steps, and
 * the dashboard season cards.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The numeral (e.g. "01", 3).
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Chip scale.
 * @param {string} [props.className]
 */
import clsx from "clsx";

const SIZES = {
  sm: "h-11 w-11 text-[1.25rem] brand-chip-shadow-sm",
  md: "h-12 w-12 text-[1.5rem] brand-chip-shadow",
  lg: "h-14 w-14 text-[1.75rem] brand-chip-shadow",
};

const VarsityNumber = ({ children, size = "md", className }) => (
  <span
    className={clsx(
      "heading-stencil ds-tabular inline-flex items-center justify-center rounded-ds-md bg-ds-accent text-white ring-1 ring-white/15",
      SIZES[size],
      className,
    )}
  >
    {children}
  </span>
);

export default VarsityNumber;
