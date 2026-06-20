/**
 * VarsityNumber — the camp's jersey-patch numeral on a camp-red square. Sharp
 * corners, tabular numerals, restrained ring. One source of truth for the
 * "roster number" treatment used across the hero, registration steps, and
 * dashboard season cards.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The numeral (e.g. "01", 3).
 * @param {'sm'|'md'|'lg'} [props.size='md'] - Chip scale.
 * @param {string} [props.className]
 */
import clsx from "clsx";

const SIZES = {
  sm: "h-10 w-10 text-[1.125rem] brand-chip-shadow-sm",
  md: "h-12 w-12 text-[1.375rem] brand-chip-shadow",
  lg: "h-14 w-14 text-[1.625rem] brand-chip-shadow",
};

const VarsityNumber = ({ children, size = "md", className }) => (
  <span
    className={clsx(
      "heading-stencil ds-tabular mono-num inline-flex items-center justify-center bg-ds-accent text-white ring-1 ring-white/10",
      SIZES[size],
      className,
    )}
  >
    {children}
  </span>
);

export default VarsityNumber;
