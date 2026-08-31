/**
 * The first thing the keyboard reaches on any page. It sits off-screen until it
 * takes focus, then lands on the page's own content instead of making someone
 * tab through the whole navigation to reach it.
 */
const SkipLink = () => (
  <a
    href="#main"
    className="mono-tag sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-spark focus:inline-flex focus:min-h-control focus:items-center focus:border focus:border-ds-accent focus:bg-ds-bg focus:px-5 focus:text-ds-text"
  >
    Skip to Content
  </a>
);

export default SkipLink;
