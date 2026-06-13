/**
 * Application entry point. Mounts the root React component into the DOM,
 * wraps it in the design-system ThemeProvider (dark by default), mounts the
 * global Toaster, and reports web vitals.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, Toaster } from "@bradley-t-t/sunday-design-system";
import "./index.css";
import App from "./app/App";
import reportWebVitals from "./hooks/reportWebVitals";
import ErrorBoundary from "./components/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <App />
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

reportWebVitals();
