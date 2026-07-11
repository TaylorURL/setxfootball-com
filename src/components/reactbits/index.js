/**
 * React Bits — a local install of the React Bits component library
 * (https://reactbits.dev, MIT). Each component is a self-contained, dependency
 * -light build tuned to this site's monochrome editorial system: the framer
 * -motion motion primitives reuse the app's existing `framer-motion` install,
 * the canvas backdrops read the live `--ds-*` tokens so they follow the
 * light/dark surface register, and every effect degrades cleanly under
 * `prefers-reduced-motion`. The shared CSS layer lives in `reactbits.css`
 * (imported once from `src/index.js`).
 *
 * This barrel is the single import surface for the whole library:
 *   import { SplitText, SpotlightCard, Squares } from "components/reactbits";
 */

// Text animations
export { default as SplitText } from "./SplitText";
export { default as BlurText } from "./BlurText";
export { default as ShinyText } from "./ShinyText";
export { default as GradientText } from "./GradientText";
export { default as RotatingText } from "./RotatingText";
export { default as DecryptedText } from "./DecryptedText";
export { default as TrueFocus } from "./TrueFocus";
export { default as ScrollReveal } from "./ScrollReveal";
export { default as CountUp } from "./CountUp";

// Animation & interaction primitives
export { default as AnimatedContent } from "./AnimatedContent";
export { default as FadeContent } from "./FadeContent";
export { default as ClickSpark } from "./ClickSpark";
export { default as Magnet } from "./Magnet";
export { default as StarBorder } from "./StarBorder";
export { default as SpotlightCard } from "./SpotlightCard";
export { default as TiltedCard } from "./TiltedCard";
export { default as GlareHover } from "./GlareHover";

// Canvas backgrounds
export { default as Squares } from "./Squares";
export { default as Waves } from "./Waves";
export { default as DotGrid } from "./DotGrid";
