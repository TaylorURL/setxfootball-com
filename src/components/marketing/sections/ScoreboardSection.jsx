/**
 * ScoreboardSection — the stat band beneath the hero. Renders the camp facts as
 * a scoreboard grid and anchors the hero's scroll cue.
 */
import { Container } from "@bradley-t-t/sunday-design-system";
import { HERO_STATS } from "../../../content/campContent";
import { CAMP_FACTS_ID } from "./HeroSection";

const ScoreboardSection = () => (
  <section
    id={CAMP_FACTS_ID}
    className="scoreboard-grain relative overflow-hidden border-y border-ds-border bg-ds-bg-elevated"
  >
    <Container size="xl" className="py-10 sm:py-12">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-ds-xl border border-ds-border bg-ds-border sm:grid-cols-4">
        {HERO_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center bg-ds-bg-elevated px-5 py-7 text-center">
            <dd className="heading-stencil ds-tabular text-4xl text-ds-accent-bright sm:text-5xl">{stat.value}</dd>
            <dt className="mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-ds-text-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </Container>
  </section>
);

export default ScoreboardSection;
