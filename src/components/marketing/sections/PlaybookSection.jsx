import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { PLAYBOOK } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import { SplitText, ShinyText, DecryptedText, CountUp } from "../../reactbits";

const PlaybookSection = ({ surface }) => (
  <section
    {...surfaceProps(surface)}
    className="surface-seam relative border-b border-ds-border bg-ds-bg-elevated py-24 sm:py-32 lg:py-40"
  >
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal>
        <SectionIntro
          eyebrow={<ShinyText text="How It Works" speed={5} />}
          title={<SplitText text="From signup to sideline in three steps." splitType="words" delay={55} />}
        >
          Three steps from the couch to the field. No payment due until after
          you've signed up.
        </SectionIntro>
      </Reveal>

      <div className="mt-20 grid grid-cols-1 gap-x-10 gap-y-16 border-t border-ds-border pt-16 lg:grid-cols-3">
        {PLAYBOOK.map((play, index) => (
          <Reveal key={play.title} variant="up" delay={index + 1}>
            <div className="group grid grid-cols-[auto_1fr] gap-x-6">
              <CountUp
                to={index + 1}
                from={0}
                duration={0.9 + index * 0.2}
                className="editorial-display text-[5rem] leading-none text-ds-accent-bright transition-transform duration-500 ease-out group-hover:-translate-y-1 sm:text-[6rem]"
              />
              <div className="pt-2">
                <DecryptedText text={`Step ${index + 1}`} className="mono-tag-sm text-ds-text-faint" />
                <h3 className="editorial-display mt-3 text-3xl text-ds-text sm:text-4xl">
                  {play.title}
                </h3>
                <p className="editorial-body mt-4 text-[15px] text-ds-text-muted">
                  {play.body}
                </p>
                <play.icon
                  className="mt-5 h-5 w-5 text-ds-text-faint transition-colors duration-300 group-hover:text-ds-accent-bright"
                  aria-hidden="true"
                />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default PlaybookSection;
