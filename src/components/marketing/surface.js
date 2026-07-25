/**
 * Sections are dark by default; opting into "light" flips every `--ds-*` token
 * for that subtree. Pages compose their rhythm by alternating which ones opt in.
 *
 * @param {'light'|'dark'} [surface] - Optional surface override for a section.
 * @returns {object} Props to spread on the section root.
 */
export const surfaceProps = (surface) =>
  surface === "light" ? { "data-surface": "light" } : {};
