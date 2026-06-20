/**
 * PerksSection — "What every camper gets": the no-pay-to-play promise rendered
 * as a clean four-column editorial grid with hairline dividers and ample
 * whitespace.
 */
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { CAMPER_PERKS } from "../../../content/campContent";

const PerksSection = () => (
  <section className="relative border-b border-ds-border bg-ds-bg py-24 sm:py-32 lg:py-40">
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal>
        <SectionIntro
          eyebrow="What's Included"
          title={<>What every camper gets.</>}
        >
          No hidden fees, no pay-to-play. Sign up for the shirts and the rest
          comes with showing up.
        </SectionIntro>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-y-12 border-t border-ds-border pt-12 sm:grid-cols-2 sm:gap-x-12 lg:grid-cols-4 lg:gap-x-10">
        {CAMPER_PERKS.map((perk, index) => (
          <Reveal key={perk.title} variant="up" delay={index + 1}>
            <div className="left-rule-accent pl-5">
              <perk.icon className="h-6 w-6 text-ds-accent-bright" aria-hidden="true" />
              <h3 className="editorial-display mt-5 text-2xl text-ds-text sm:text-3xl">
                {perk.title}
              </h3>
              <p className="editorial-body mt-3 text-[15px] text-ds-text-muted">
                {perk.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default PerksSection;
