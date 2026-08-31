import { createContext } from "react";

/**
 * @typedef {object} SundayAnalyticsApi
 * @property {(name: string, props?: Record<string, unknown>) => void} track
 *   Accepts a call and records nothing: the ingest pipeline stores pageviews
 *   only.
 */

/** @type {import('react').Context<SundayAnalyticsApi | null>} */
export const SundayAnalyticsContext = createContext(null);
