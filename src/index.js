/**
 * Application entry point. Mounts the root React component into the DOM, wraps
 * it in the design-system ThemeProvider locked to the single camp theme
 * (graphite neutrals + camp-red accent), mounts the global Toaster, and reports
 * web vitals.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider, Toaster } from "@bradley-t-t/sunday-design-system";
import "@bradley-t-t/sunday-design-system/styles.css";
import "./index.css";
import "./components/reactbits/reactbits.css";
import App from "./app/App";
import reportWebVitals from "./hooks/reportWebVitals";
import ErrorBoundary from "./components/ErrorBoundary";
import { SundayAnalyticsProvider } from "./library/sunday-analyzer";

/** The camp ships one deliberate theme — graphite neutrals with the camp-red accent. */
const CAMP_THEME = "gray";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <SundayAnalyticsProvider siteKey="sa_8ab80eead8d6ccdf704cc9193851da97">
        <HelmetProvider>
          <ThemeProvider defaultTheme={CAMP_THEME} themes={[CAMP_THEME]} storageKey="setx-theme">
            <App />
            <Toaster position="bottom-right" />
          </ThemeProvider>
        </HelmetProvider>
      </SundayAnalyticsProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

reportWebVitals();
