/**
 * Everything above the router: the error boundary, the providers and the
 * surface every page is drawn on.
 *
 * The browser entry and the build-time prerender both mount this, so the two
 * cannot drift into rendering different trees. A provider added to one and not
 * the other would show up as a hydration mismatch on every page.
 *
 * There is no toast host, deliberately. The design system publishes one flat
 * bundle, so a host mounted above the router pulls the whole component library
 * in front of the first screen of every page, including the marketing pages
 * that render none of it. Nothing here raises a toast; a page that wants one
 * mounts its own host, in a chunk that has already paid for the package.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The app, already wrapped in its router.
 */
import React, { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import ErrorBoundary from "./ErrorBoundary";
import { SundayAnalyticsProvider } from "../library/sunday-analyzer";

// One theme, deliberately: the surface below is locked to it.
export const CAMP_THEME = "gray";

const ANALYTICS_SITE_KEY = "sa_8ab80eead8d6ccdf704cc9193851da97";

/**
 * The surface every page is drawn on.
 *
 * A design system that ships several themes needs a provider around them:
 * something to hold which one is current, to persist the choice and to hand a
 * switcher a way to change it. This site has one theme and no switcher, so all
 * that is left of that job is the `ds-root` class and the theme attribute the
 * `--ds-*` token set is keyed off, and those are a wrapper element rather than a
 * context. Writing them here is what keeps the component library - and the
 * animation, popover and chart packages it is built on - out of the bundle every
 * reader downloads before the first screen, on pages that render none of it.
 *
 * The attribute is stamped on the document element too, because the page's own
 * background and text colour are set on `body`, which sits outside this wrapper
 * and would otherwise resolve neither token.
 */
const ThemeSurface = ({ children }) => {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", CAMP_THEME);
    return () => document.documentElement.removeAttribute("data-theme");
  }, []);

  return (
    <div className="ds-root" data-theme={CAMP_THEME}>
      {children}
    </div>
  );
};

const Root = ({ children }) => (
  <React.StrictMode>
    <ErrorBoundary>
      <SundayAnalyticsProvider siteKey={ANALYTICS_SITE_KEY}>
        <HelmetProvider>
          <ThemeSurface>{children}</ThemeSurface>
        </HelmetProvider>
      </SundayAnalyticsProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

export default Root;
