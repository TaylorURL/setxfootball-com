/**
 * Application entry point. Mounts the root React component into the DOM, wraps
 * it in the design-system ThemeProvider locked to the single camp theme
 * (graphite neutrals + camp-red accent), mounts the global Toaster, and reports
 * web vitals.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, Toaster } from "@bradley-t-t/sunday-design-system";
import "@bradley-t-t/sunday-design-system/styles.css";
import "./index.css";
import App from "./app/App";
import reportWebVitals from "./hooks/reportWebVitals";
import ErrorBoundary from "./components/ErrorBoundary";

/** The camp ships one deliberate theme — graphite neutrals with the camp-red accent. */
const CAMP_THEME = "gray";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme={CAMP_THEME} themes={[CAMP_THEME]} storageKey="setx-theme">
        <App />
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

reportWebVitals();
