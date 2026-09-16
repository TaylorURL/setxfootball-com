/**
 * @module actionClass
 * @description The class string behind every call to action on the site.
 *
 * One source of truth for how an action looks, so the register CTA, the footer
 * CTA and the staff export button cannot drift apart. Only the paint lives
 * here: the element stays native, a `button`, a router `Link` or an `a`,
 * because the cursor, press and focus affordances in index.css are bound to
 * those tags rather than to a class.
 *
 * Every action is a tight-cornered block set in caps. The filled ones carry
 * no rule; the outline one carries the one-pixel rule the cards use.
 */
import clsx from "clsx";

/**
 * @enum {string} How much weight the action carries on its surface.
 */
const TONES = {
  primary:
    "border-ds-accent bg-ds-accent text-ds-on-accent hover:border-ds-accent-bright hover:bg-ds-accent-bright",
  navy: "border-ds-text bg-ds-text text-ds-bg hover:opacity-90",
  secondary: "border-ds-text bg-ds-bg-elevated text-ds-text hover:bg-ds-surface-2",
  outline: "border-ds-text bg-transparent text-ds-text hover:bg-ds-bg-elevated",
  gold: "border-ds-gold bg-ds-gold text-ds-on-gold hover:brightness-95",
  // For a button sitting on the red panel: a white rule and white type, and
  // the fill comes in on hover. Navy on red is the one pairing the palette
  // does not allow.
  inverse:
    "border-ds-on-gold bg-transparent text-ds-on-gold hover:bg-ds-on-gold hover:text-ds-gold",
  danger:
    "border-ds-accent bg-ds-accent-soft text-ds-accent-bright hover:bg-ds-accent hover:text-ds-on-accent",
  dashed:
    "border-dashed border-ds-text bg-transparent text-ds-text hover:bg-ds-bg-elevated hover:border-ds-accent",
  ghost: "border-transparent bg-transparent text-ds-text hover:bg-ds-surface-2",
};

/**
 * @enum {string} Horizontal padding, gap and type size. Height comes from the
 * shared control token, so every size clears the 44px touch floor.
 */
const SIZES = {
  sm: "gap-2 px-4 py-2 text-[12px]",
  md: "gap-2.5 px-6 py-3 text-[14px]",
  lg: "gap-3 px-8 py-4 text-[15px]",
};

/**
 * @param {object} [options]
 * @param {'primary'|'navy'|'secondary'|'outline'|'gold'|'inverse'|'danger'|'dashed'|'ghost'} [options.tone='primary']
 * @param {'sm'|'md'|'lg'} [options.size='md']
 * @param {boolean} [options.block=false] - Fill the available width.
 * @param {string} [options.className] - Per-call-site additions.
 * @returns {string} The className for the control.
 */
export const actionClass = ({ tone = "primary", size = "md", block = false, className } = {}) =>
  clsx(
    "min-h-control select-none items-center justify-center rounded-ds-sm border-rule font-bold uppercase tracking-[0.06em] leading-none",
    "disabled:cursor-not-allowed disabled:opacity-60",
    TONES[tone],
    SIZES[size],
    block ? "flex w-full" : "inline-flex",
    className,
  );
