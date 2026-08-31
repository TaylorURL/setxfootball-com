/**
 * Sections are dark by default; opting into "light" flips every `--ds-*` token
 * for that subtree. Pages compose their rhythm by alternating which ones opt in.
 *
 * Every section spread with this also carries `data-deferred`, which is what
 * `index.css` keys `content-visibility` off: a section the reader has not
 * scrolled to costs nothing to style or lay out, and once it has been rendered
 * once the browser remembers its height, so the scrollbar settles where it was.
 *
 * @param {'light'|'dark'} [surface] - Optional surface override for a section.
 * @returns {object} Props to spread on the section root.
 */
export const surfaceProps = (surface) => ({
  "data-deferred": "",
  ...(surface === "light" ? { "data-surface": "light" } : {}),
});
