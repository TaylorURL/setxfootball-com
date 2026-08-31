import { useCallback, useEffect, useMemo, useRef } from "react";

import { collectPageview } from "./collect";
import { DEFAULT_API_URL } from "./constants";
import { SundayAnalyticsContext } from "./context";
import { subscribeToRouteChanges } from "./history";
import { sendHit } from "./transport";

/**
 * Router-agnostic pageview tracking: mounting is enough, no route hook needed.
 * Cookieless — the session id lives in sessionStorage, never a cookie.
 *
 * @param {object} props
 * @param {string} props.siteKey - public site key from analytics_sites
 * @param {string} [props.apiUrl] - ingest endpoint; defaults to the hosted function
 * @param {import('react').ReactNode} props.children
 */
export function SundayAnalyticsProvider({ siteKey, apiUrl = DEFAULT_API_URL, children }) {
  // Dedupe consecutive hits for the same path — replaceState often fires for
  // in-place state updates that aren't real navigations.
  const lastPathRef = useRef(null);

  useEffect(() => {
    if (!siteKey || typeof window === "undefined") return undefined;

    const trackPageview = () => {
      const path = `${window.location.pathname}${window.location.search}`;
      if (path === lastPathRef.current) return;
      lastPathRef.current = path;
      sendHit(apiUrl, collectPageview(siteKey));
    };

    // The first hit waits for the main thread to go quiet. A pageview that
    // arrives a moment later is the same pageview; one sent during load
    // competes with the reader's first tap.
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(trackPageview, { timeout: 3000 })
      : window.setTimeout(trackPageview, 1200);
    const unsubscribe = subscribeToRouteChanges(trackPageview);

    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      unsubscribe();
    };
  }, [siteKey, apiUrl]);

  // The ingest pipeline stores pageviews only, so a custom event has nowhere to
  // go. The context still carries `track` so a call site that makes one is a
  // discarded event rather than a crash.
  const track = useCallback(() => {}, []);

  const api = useMemo(() => ({ track }), [track]);

  return <SundayAnalyticsContext.Provider value={api}>{children}</SundayAnalyticsContext.Provider>;
}

export default SundayAnalyticsProvider;
