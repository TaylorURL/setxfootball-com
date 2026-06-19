/**
 * Application entry point. Mounts the root React component into the DOM,
 * wraps it in the design-system ThemeProvider (dark / light / gray, dark by
 * default), mounts the global Toaster, and reports web vitals.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, Toaster } from "@bradley-t-t/sunday-design-system";
import "@bradley-t-t/sunday-design-system/styles.css";
import "./index.css";
import App from "./app/App";
import reportWebVitals from "./hooks/reportWebVitals";
import ErrorBoundary from "./components/ErrorBoundary";

/** The three themes the camp brand ships, cycled by the design-system ThemeToggle. */
const THEMES = ["dark", "light", "gray"];

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" themes={THEMES} storageKey="setx-theme">
        <App />
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

reportWebVitals();
