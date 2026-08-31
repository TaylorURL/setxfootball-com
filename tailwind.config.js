/**
 * The design-system preset supplies every `ds-*` scale bound to the active
 * `data-theme`. The `primary` (neutral ramp) and `accent` (red) scales below
 * exist only for the gradient and hero treatments that sit outside the token
 * system. Reach for `ds-*` everywhere else.
 */
const dsPreset = require("@bradley-t-t/sunday-design-system/tailwind-preset");

/**
 * Tailwind cannot put an opacity modifier on a colour declared as a bare
 * `var(--ds-*)`, which is how the vendored preset declares every `ds-*` scale:
 * `bg-ds-bg/85` compiles to a declaration the browser drops, so a translucent
 * surface paints nothing at all. Redeclaring the same names as functions lets
 * the modifier through as a `color-mix`, and leaves the unmodified case
 * byte-for-byte what the preset gives.
 *
 * The `startsWith` guard is what keeps that safe. For an unmodified utility
 * Tailwind passes its own `var(--tw-*-opacity)` placeholder in place of a
 * number, and arithmetic on that string yields `NaN%`: another declaration the
 * browser throws away, this time falling the colour silently back to
 * `inherit`.
 */
const DS_COLOR_NAMES = [
  "bg",
  "bg-recessed",
  "bg-elevated",
  "surface",
  "surface-2",
  "surface-3",
  "border",
  "border-strong",
  "border-input",
  "border-hover",
  "text",
  "text-muted",
  "text-faint",
  "accent",
  "accent-bright",
  "accent-glow",
  "accent-soft",
  "accent-softer",
  "on-accent",
  "on-media",
  "on-media-muted",
  "on-media-ring",
  "glow-neutral",
  "positive",
  "positive-soft",
  "warning",
  "warning-soft",
  "danger",
  "danger-soft",
  "violet",
  "violet-soft",
  "indigo",
  "indigo-soft",
  "cyan",
  "cyan-soft",
  "slate",
  "slate-soft",
  "overlay",
  "glass-fill",
  "glass-border",
  "companion-contact",
  "companion-aura",
];

const dsColor =
  (name) =>
  ({ opacityValue }) => {
    const token = `var(--ds-${name})`;
    const modified =
      opacityValue !== undefined &&
      opacityValue !== "1" &&
      !String(opacityValue).startsWith("var(--tw-");
    return modified
      ? `color-mix(in srgb, ${token} calc(${opacityValue} * 100%), transparent)`
      : token;
  };

const ds = Object.fromEntries(DS_COLOR_NAMES.map((name) => [name, dsColor(name)]));

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
        ds,
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
      // The preset names dropdown through tooltip. These are the layers this
      // site adds: `base` and `raised` for in-page stacking, `sticky-nav` for
      // the fixed bar that has to clear in-page stickies, and `spark` for the
      // click effect, which is drawn over everything including a modal.
      zIndex: {
        base: "1",
        raised: "10",
        "sticky-nav": "1150",
        spark: "1700",
      },
      minHeight: {
        control: "var(--control-h)",
      },
      height: {
        control: "var(--control-h)",
      },
      // The design system already names the curve and the three motion steps.
      // Mapping Tailwind's own `ease-out` onto it is what stops the site running
      // two nearly identical easings side by side.
      transitionTimingFunction: {
        out: "var(--ease-out)",
      },
      transitionDuration: {
        press: "var(--duration-press)",
        state: "var(--duration-state)",
        enter: "var(--duration-enter)",
      },
      maxWidth: {
        measure: "var(--measure)",
      },
    },
  },
  plugins: [],
};
