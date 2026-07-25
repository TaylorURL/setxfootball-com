/**
 * The design-system preset supplies every `ds-*` scale bound to the active
 * `data-theme`. The `primary` (neutral ramp) and `accent` (red) scales below
 * exist only for the gradient and hero treatments that sit outside the token
 * system — reach for `ds-*` everywhere else.
 */
const dsPreset = require("@bradley-t-t/sunday-design-system/tailwind-preset");

module.exports = {
  presets: [dsPreset],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./node_modules/@bradley-t-t/sunday-design-system/dist/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },
        accent: {
          50: "var(--accent-50)",
          100: "var(--accent-100)",
          200: "var(--accent-200)",
          300: "var(--accent-300)",
          400: "var(--accent-400)",
          500: "var(--accent-500)",
          600: "var(--accent-600)",
          700: "var(--accent-700)",
          800: "var(--accent-800)",
          900: "var(--accent-900)",
        },
      },
    },
  },
  plugins: [],
};
