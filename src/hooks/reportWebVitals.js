/**
 * Create React App's web-vitals hook, kept at its default: `src/index.js` calls
 * it with no callback, so nothing is collected here. Field metrics come from
 * the analytics provider instead. Pass a function to route the metrics
 * somewhere, one call per entry.
 *
 * @param {Function} [onPerfEntry] - called once per metric entry
 */
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
