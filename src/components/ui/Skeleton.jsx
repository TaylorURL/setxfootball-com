/**
 * The one placeholder primitive. Every waiting screen composes its shapes from
 * this rather than inventing its own, so the box a reader is looking at is
 * already the size and position of the thing that replaces it.
 *
 * Wrap a screen's placeholders in `LoadingRegion`, which marks the wait busy and
 * announces it once, so a screen reader hears "Loading" rather than a recital of
 * empty boxes.
 *
 * @param {object} props
 * @param {string} [props.className] - Box size and shape, from the content it stands in for.
 * @param {React.ElementType} [props.as='div'] - Rendered element.
 */
import clsx from "clsx";

const Skeleton = ({ as: Tag = "div", className, ...rest }) => (
  <Tag aria-hidden="true" className={clsx("skeleton", className)} {...rest} />
);

/**
 * @param {object} props
 * @param {string} props.label - What is loading, announced politely, once.
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children - The placeholder shapes.
 */
export const LoadingRegion = ({ label, className, children }) => (
  <div aria-busy="true" aria-live="polite" role="status" className={className}>
    <span className="sr-only">{label}</span>
    {children}
  </div>
);

export default Skeleton;
