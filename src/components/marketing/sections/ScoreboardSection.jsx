/**
 * ScoreboardSection — the stat band beneath the hero. Editorial register:
 * a four-column hairline grid with very large numerals and mono labels.
 */
import { HERO_STATS } from "../../../content/campContent";
import { CAMP_FACTS_ID } from "./HeroSection";

const ScoreboardSection = () => (
  <section
    id={CAMP_FACTS_ID}
    className="relative border-b border-ds-border bg-ds-bg"
  >
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <div className="grid grid-cols-2 divide-x divide-ds-border border-x border-ds-border sm:grid-cols-4">
        {HERO_STATS.map((stat, index) => (
          <div
            key={stat.label}
            className="relative flex flex-col px-5 py-12 sm:px-8 sm:py-16"
          >
            <span className="mono-tag-sm text-ds-text-faint">
              0{index + 1}
            </span>
            <span className="editorial-display mono-num mt-4 text-5xl text-ds-accent-bright sm:text-6xl lg:text-7xl">
              {stat.value}
            </span>
            <span className="mono-tag mt-5 text-ds-text-muted">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ScoreboardSection;
