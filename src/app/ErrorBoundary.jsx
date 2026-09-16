/**
 * The last line of defence: catches a render error anywhere below it and shows
 * a reload prompt instead of a blank page.
 *
 * Mounted at the very top in `src/index.js`, outside the providers, so a failure
 * inside a provider still has somewhere to land.
 *
 * A ChunkLoadError is the special case where the document a visitor is holding
 * points at a bundle the new deploy has replaced. The chunk fetch either
 * returns a 404 or, if the SPA fallback swallows it, the HTML the fallback
 * hands back. Either way the browser cannot execute it. Reloading once picks
 * up the current document, and a sessionStorage flag stops the reload from
 * looping if the problem is not a stale bundle.
 */
import { Component } from "react";
import { actionClass } from "../components/ui/actionClass";

const CHUNK_RELOAD_KEY = "chunk-reload-attempted";

const isChunkLoadError = (error) => {
  if (!error) return false;
  if (error.name === "ChunkLoadError") return true;
  const message = String(error.message || error);
  return /Loading chunk|Loading CSS chunk|ChunkLoadError|Failed to fetch dynamically imported module|Unexpected token '<'/i.test(
    message,
  );
};

// Deliberately dependency-free, not even the shared action class, because if
// the failure reached the top of the tree, anything this screen imports could be
// the thing that threw. The classes are written out on purpose.
const DefaultFallback = () => (
  <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-5 bg-ds-bg px-6 text-center">
    <span className="eyebrow">System Error</span>
    <h1 className="display max-w-xl text-4xl text-ds-text sm:text-5xl">
      Something
      <br />
      <span className="text-ds-accent-bright">went wrong.</span>
    </h1>
    <p className="max-w-sm text-sm text-ds-text-muted">
      An unexpected error interrupted the page. Reloading usually clears it.
    </p>
    <button type="button" onClick={() => window.location.reload()} className={actionClass()}>
      Reload Page
    </button>
  </div>
);

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidMount() {
    // A clean mount means the chunk problem the last reload was chasing is
    // behind us, so the guard resets for a subsequent deploy in the same tab.
    if (!this.state.hasError && typeof window !== "undefined") {
      try {
        window.sessionStorage.removeItem(CHUNK_RELOAD_KEY);
      } catch {
        // sessionStorage may be blocked; the flag stays, which only costs the
        // next chunk error a fallback instead of a reload.
      }
    }
  }

  componentDidCatch(error, info) {
    if (isChunkLoadError(error) && typeof window !== "undefined") {
      let alreadyReloaded = false;
      try {
        alreadyReloaded = window.sessionStorage.getItem(CHUNK_RELOAD_KEY) === "1";
        if (!alreadyReloaded) window.sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
      } catch {
        // Private mode blocks sessionStorage. The one-shot reload still helps
        // the common case, so fall through and take it.
      }
      if (!alreadyReloaded) {
        window.location.reload();
        return;
      }
    }
    console.error("Render error:", error, info?.componentStack);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? <DefaultFallback />;
    return this.props.children;
  }
}

export default ErrorBoundary;
