/**
 * Everything above the router: the error boundary, the providers and the toast
 * host.
 *
 * The browser entry and the build-time prerender both mount this, so the two
 * cannot drift into rendering different trees. A provider added to one and not
 * the other would show up as a hydration mismatch on every page.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - The app, already wrapped in its router.
 */
import React, { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider, Toaster } from "@bradley-t-t/sunday-design-system";
import ErrorBoundary from "../components/ErrorBoundary";
import { SundayAnalyticsProvider } from "../library/sunday-analyzer";

// One theme, deliberately: the ThemeProvider is locked to it.
export const CAMP_THEME = "gray";

const ANALYTICS_SITE_KEY = "sa_8ab80eead8d6ccdf704cc9193851da97";

/**
 * The toast host renders into `document.body` through a portal, and a portal is
 * not something a document rendered ahead of time can carry: the build emits
 * nothing for it and the browser would try to adopt the body's own children as
 * its contents. Mounting it once the page is live sidesteps that, and costs a
 * reader nothing, since the host holds no content until an action raises a toast.
 */
const ToastHost = () => {
  const [live, setLive] = useState(false);
  useEffect(() => setLive(true), []);
  return live ? <Toaster position="bottom-right" /> : null;
};

const Root = ({ children }) => (
  <React.StrictMode>
    <ErrorBoundary>
      <SundayAnalyticsProvider siteKey={ANALYTICS_SITE_KEY}>
        <HelmetProvider>
          <ThemeProvider defaultTheme={CAMP_THEME} themes={[CAMP_THEME]} storageKey="setx-theme">
            {children}
            <ToastHost />
          </ThemeProvider>
        </HelmetProvider>
      </SundayAnalyticsProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

export default Root;
