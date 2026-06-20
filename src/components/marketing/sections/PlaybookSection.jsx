/**
 * PlaybookSection — "How it works": the three-step sign-up flow rendered as a
 * numbered editorial sequence with large hanging step numerals.
 */
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { PLAYBOOK } from "../../../content/campContent";

const PlaybookSection = () => (
  <section className="relative border-b border-ds-border bg-ds-bg-elevated py-24 sm:py-32 lg:py-40">
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal>
        <SectionIntro
          eyebrow="How It Works"
          title={<>From signup to sideline in three steps.</>}
        >
          Three steps from the couch to the field. No payment due until after
          you've signed up.
        </SectionIntro>
      </Reveal>

      <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-16 border-t border-ds-border pt-16 lg:grid-cols-3">
        {PLAYBOOK.map((play, index) => (
          <Reveal key={play.title} variant="up" delay={index + 1}>
            <div className="grid grid-cols-[auto_1fr] gap-x-6">
              <span className="editorial-display mono-num text-[5rem] leading-none text-ds-accent-bright sm:text-[6rem]">
                {index + 1}
              </span>
              <div className="pt-2">
                <span className="mono-tag-sm text-ds-text-faint">Step {index + 1}</span>
                <h3 className="editorial-display mt-3 text-3xl text-ds-text sm:text-4xl">
                  {play.title}
                </h3>
                <p className="editorial-body mt-4 text-[15px] text-ds-text-muted">
                  {play.body}
                </p>
                <play.icon className="mt-5 h-5 w-5 text-ds-text-faint" aria-hidden="true" />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default PlaybookSection;
