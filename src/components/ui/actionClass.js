/**
 * @module actionClass
 * @description The class string behind every call to action on the site.
 *
 * One source of truth for how an action looks, so the register CTA, the footer
 * CTA and the staff export button cannot drift apart. Only the paint lives
 * here: the element stays native, a `button`, a router `Link` or an `a`,
 * because the cursor, press and focus affordances in index.css are bound to
 * those tags rather than to a class.
 */
import clsx from "clsx";

/**
 * @enum {string} How much weight the action carries on its surface.
 */
const TONES = {
  primary:
    "border-ds-accent bg-ds-accent text-ds-on-accent hover:border-ds-accent-bright hover:bg-ds-accent-bright",
  secondary:
    "border-ds-border-strong bg-ds-surface text-ds-text-muted hover:border-ds-text-muted hover:text-ds-text",
  outline: "border-ds-border-strong bg-transparent text-ds-text hover:border-ds-text-muted",
  danger: "border-ds-danger/40 bg-ds-danger-soft text-ds-danger hover:bg-ds-danger/20",
  dashed:
    "border-dashed border-ds-border-strong bg-ds-bg text-ds-text-muted hover:border-ds-accent hover:text-ds-accent-bright",
};

/**
 * @enum {string} Horizontal padding and gap. Height comes from the shared
 * control token, so every size clears the 44px touch floor.
 */
const PADDING = {
  sm: "gap-2 px-3 py-2",
  md: "gap-2 px-5 py-3",
  lg: "gap-2 px-6 py-4",
};

/**
 * @param {object} [options]
 * @param {'primary'|'secondary'|'outline'|'danger'|'dashed'} [options.tone='primary']
 * @param {'sm'|'md'|'lg'} [options.size='md']
 * @param {boolean} [options.block=false] - Fill the available width.
 * @param {string} [options.className] - Per-call-site additions.
 * @returns {string} The className for the control.
 */
export const actionClass = ({ tone = "primary", size = "md", block = false, className } = {}) =>
  clsx(
    "mono-tag min-h-control select-none items-center justify-center border",
    "disabled:cursor-not-allowed disabled:opacity-60",
    TONES[tone],
    PADDING[size],
    block ? "flex w-full" : "inline-flex",
    className,
  );
