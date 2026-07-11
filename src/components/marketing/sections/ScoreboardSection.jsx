/**
 * ScoreboardSection — the stat band beneath the hero. A four-column hairline
 * grid with very large numerals and a short label for each fact. The
 * numerals count up from zero when the band scrolls into view.
 */
import { HERO_STATS } from "../../../content/campContent";
import { CAMP_FACTS_ID } from "./HeroSection";
import { useCountUp } from "../../../hooks/useCountUp";
import { surfaceProps } from "../surface";
import { SpotlightCard } from "../../reactbits";

const STAT_NUMERIC = HERO_STATS.map((stat) => {
  const match = String(stat.value).match(/^(\$?)(\d+)([+\-–]?)(.*)$/);
  if (!match) return { ...stat, numeric: null };
  const [, prefix, digits, modifier, rest] = match;
  return {
    ...stat,
    numeric: Number(digits),
    prefix,
    suffix: `${modifier}${rest}`,
  };
});

const Stat = ({ stat }) => {
  const { ref, display } = useCountUp(stat.numeric ?? 0, {
    prefix: stat.prefix ?? "",
    suffix: stat.suffix ?? "",
    durationMs: 1500,
  });

  return (
    // React Bits — SpotlightCard washes each stat cell with an accent glow that
    // tracks the cursor, so the scoreboard lights up as you move across it.
    <SpotlightCard className="group relative flex flex-col px-5 py-12 sm:px-8 sm:py-16" size={260}>
      <span aria-hidden="true" className="absolute inset-x-5 top-0 h-px origin-left scale-x-0 bg-ds-accent transition-transform duration-500 ease-out group-hover:scale-x-100" />
      <span
        ref={ref}
        className="editorial-display mono-num text-5xl text-ds-accent-bright sm:text-6xl lg:text-7xl"
      >
        {stat.numeric == null ? stat.value : display}
      </span>
      <span className="mono-tag mt-5 text-ds-text-muted transition-colors duration-300 group-hover:text-ds-text">
        {stat.label}
      </span>
    </SpotlightCard>
  );
};

const ScoreboardSection = ({ surface }) => (
  <section
    id={CAMP_FACTS_ID}
    {...surfaceProps(surface)}
    className="relative border-b border-ds-border bg-ds-bg"
  >
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <div className="grid grid-cols-2 divide-x divide-ds-border border-x border-ds-border sm:grid-cols-4">
        {STAT_NUMERIC.map((stat) => (
          <Stat key={stat.label} stat={stat} />
        ))}
      </div>
    </div>
  </section>
);

export default ScoreboardSection;
