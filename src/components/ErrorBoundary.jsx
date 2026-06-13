import { Component } from "react";

/**
 * Catches render errors in its subtree so a thrown exception doesn't
 * blank the whole app. Renders an optional `fallback` when an error
 * has been captured.
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
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

export default ErrorBoundary;
