/**
 * @module csv
 * @description Small, reusable helpers for building and downloading CSV files
 * on the client, with formula-injection hardening.
 */

const FORMULA_TRIGGER_PATTERN = /^[=+\-@\t\r]/;

/**
 * Sanitizes a single CSV cell to prevent formula/CSV injection (CWE-1236):
 * wraps every value in quotes, escapes internal quotes, and neutralizes leading
 * formula-trigger characters.
 * @param {*} value
 * @returns {string}
 */
export const sanitizeCsvCell = (value) => {
  const text = value == null ? "" : String(value);
  const guarded = FORMULA_TRIGGER_PATTERN.test(text) ? `'${text}` : text;
  return `"${guarded.replace(/"/g, '""')}"`;
};

/**
 * Serializes a matrix of rows into a CSV string with every cell sanitized.
 * @param {Array<Array<*>>} rows - Including any header row.
 * @returns {string}
 */
export const toCsv = (rows) =>
  rows.map((row) => row.map(sanitizeCsvCell).join(",")).join("\n");

/**
 * Triggers a browser download of text content as a named file.
 * @param {string} filename
 * @param {string} content
 * @param {string} [mimeType="text/csv"]
 */
export const downloadTextFile = (filename, content, mimeType = "text/csv") => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};
