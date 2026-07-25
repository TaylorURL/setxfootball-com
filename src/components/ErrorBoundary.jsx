import { Component } from "react";

// Deliberately dependency-free: plain button, token classes that resolve from
// :root. If the failure reached the top of the tree, anything fancier here
// would throw too.
const DefaultFallback = () => (
  <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 bg-ds-bg px-6 text-center">
    <span className="mono-tag text-ds-accent-bright">System Error</span>
    <h1 className="editorial-display editorial-display-tight max-w-xl text-4xl text-ds-text sm:text-5xl">
      Something<br />
      <span className="text-ds-accent-bright">went wrong.</span>
    </h1>
    <p className="max-w-sm text-sm text-ds-text-muted">
      An unexpected error interrupted the page. Reloading usually clears it.
    </p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="mono-tag inline-flex items-center gap-2 border border-ds-accent bg-ds-accent px-5 py-3 text-white transition-colors duration-200 hover:bg-ds-accent-bright hover:border-ds-accent-bright"
    >
      Reload page
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
