const js = require("@eslint/js");
const globals = require("globals");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");

/**
 * The rules below are the ones this codebase can break silently. Everything
 * else comes from the recommended sets.
 *
 * `react/react-in-jsx-scope` is off because the automatic JSX runtime resolves
 * the factory itself, and `prop-types` is off because the components are typed
 * by their call sites rather than at runtime.
 */
module.exports = [
  { ignores: ["build/**", "coverage/**", "node_modules/**", "vendor/**"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      // `process` is not a browser global. Create React App substitutes each
      // prefixed variable at build time, so the source reads them off `process`
      // and the bundle never contains the object.
      globals: { ...globals.browser, ...globals.es2021, process: "readonly" },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: "detect" } },
    plugins: { react, "react-hooks": reactHooks },
    rules: {
      ...react.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "smart"],
      "no-implicit-coercion": "error",
      "no-nested-ternary": "warn",
    },
  },
  {
    files: ["**/*.test.{js,jsx}", "**/setupTests.js"],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
  },
  {
    files: ["*.config.js", "postcss.config.js", "tailwind.config.js", "eslint.config.js"],
    languageOptions: { sourceType: "commonjs", globals: { ...globals.node } },
  },
  {
    // Build steps run under Node, and reporting what they did to the build log is
    // the whole of their output.
    files: ["scripts/**/*.js"],
    languageOptions: { sourceType: "commonjs", globals: { ...globals.node } },
    rules: { "no-console": "off" },
  },
];
