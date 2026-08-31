/**
 * @module helpers
 * @description Utility functions for formatting and date calculations.
 */

/**
 * Formats a date string as a long US date (e.g. "January 1, 2025").
 * @param {string} dateString
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Formats a number as US currency (e.g. "$5.00").
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Returns the current four-digit year.
 * @returns {number}
 */
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

/**
 * Returns the number of days elapsed since the given date string.
 *
 * Rounds up, so a registration created any time today counts as one day old
 * rather than zero. The edit window is measured with this, which means a parent
 * gets `EDIT_WINDOW_DAYS` calendar days rather than a rolling window to the
 * hour. The absolute difference also means a future date reads as elapsed
 * rather than negative; no caller passes one, and the callers that gate on this
 * would treat a negative as an expired window if it did.
 *
 * @param {string} dateString
 * @returns {number|null} Number of days, or null if no date provided.
 */
export const getDaysSince = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
