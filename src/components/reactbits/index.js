/**
 * Local build of React Bits (reactbits.dev, MIT), retuned for this design
 * system — expect divergence from upstream. Canvas components read the live
 * `--ds-*` tokens so they follow the surface register, and the shared CSS layer
 * in reactbits.css is imported once from src/index.js.
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
