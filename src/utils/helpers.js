/**
 * @module helpers
 * @description Utility functions for formatting, validation, and date calculations.
 */

/**
 * Formats a 10-digit phone number string as (XXX) XXX-XXXX.
 * @param {string} phone
 * @returns {string} Formatted phone number, or the original value if not 10 digits.
 */
export const formatPhone = (phone) => {
  const cleaned = ("" + phone).replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return "(" + match[1] + ") " + match[2] + "-" + match[3];
  }
  return phone;
};

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
 * Formats a date string as a short US date with time (e.g. "Jan 1, 2025, 02:30 PM").
 * @param {string} dateString
 * @returns {string}
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
 * Validates an email address against a basic pattern.
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validates that a phone number contains exactly 10 digits.
 * @param {string} phone
 * @returns {boolean}
 */
export const validatePhone = (phone) => {
  const cleaned = ("" + phone).replace(/\D/g, "");
  return cleaned.length === 10;
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
