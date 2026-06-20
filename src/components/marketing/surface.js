/**
 * surface — the section-level light/dark switch.
 *
 * Marketing sections inherit the dark `[data-theme="gray"]` register by
 * default. Passing `surface="light"` flips the section's `--ds-*` tokens to
 * the paper register (off-white background, near-black text, deeper red).
 * The page composes its rhythm by alternating which sections opt in.
 *
 * @param {'light'|'dark'} [surface] - Optional surface override for a section.
 * @returns {object} Props to spread on the section root.
 */
export const surfaceProps = (surface) =>
  surface === "light" ? { "data-surface": "light" } : {};
