import { Component } from "react";

/**
 * Default recovery screen shown when the subtree throws. Uses design-system
 * token classes (which resolve from `:root` defaults even outside the
 * ThemeProvider) and a plain button so it stays resilient if the failure
 * reached the top of the tree.
 */
const DefaultFallback = () => (
  <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-ds-bg px-6 text-center">
    <h1 className="text-xl font-bold text-ds-text">Something went wrong</h1>
    <p className="max-w-sm text-sm text-ds-text-muted">
      An unexpected error interrupted the page. Reloading usually clears it.
    </p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="rounded-ds-md bg-ds-accent px-4 py-2 text-sm font-semibold text-ds-on-accent transition-colors duration-150 ease-ds-out hover:opacity-90"
    >
      Reload page
    </button>
  </div>
);

/**
 * Catches render errors in its subtree so a thrown exception doesn't blank the
 * whole app. Renders `fallback` when provided, otherwise a default recovery
 * screen.
 */
class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Render error:", error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? <DefaultFallback />;
    return this.props.children;
  }
}

export default ErrorBoundary;
