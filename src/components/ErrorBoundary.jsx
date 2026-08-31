/**
 * The last line of defence: catches a render error anywhere below it and shows
 * a reload prompt instead of a blank page.
 *
 * Mounted at the very top in `src/index.js`, outside the providers, so a failure
 * inside a provider still has somewhere to land.
 */
import { Component } from "react";

// Deliberately dependency-free, not even the shared action class, because if
// the failure reached the top of the tree, anything this screen imports could be
// the thing that threw. The classes are written out on purpose.
const DefaultFallback = () => (
  <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 bg-ds-bg px-6 text-center">
    <span className="mono-tag text-ds-accent-bright">System Error</span>
    <h1 className="editorial-display editorial-display-tight max-w-xl text-4xl text-ds-text sm:text-5xl">
      Something
      <br />
      <span className="text-ds-accent-bright">went wrong.</span>
    </h1>
    <p className="max-w-sm text-sm text-ds-text-muted">
      An unexpected error interrupted the page. Reloading usually clears it.
    </p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="mono-tag inline-flex min-h-control items-center gap-2 border border-ds-accent bg-ds-accent px-5 py-3 text-ds-on-accent hover:border-ds-accent-bright hover:bg-ds-accent-bright"
    >
      Reload Page
    </button>
  </div>
);

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
