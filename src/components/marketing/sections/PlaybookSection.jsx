// The playbook sits on navy: a yard line under the heading, and the three steps as white cards with their number and their mark.
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { PLAYBOOK } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import { SplitText, CountUp } from "../../reactbits";
import CampIcon from "../../ui/CampIcon";

const PlaybookSection = ({ surface = "navy" }) => (
  <section
    {...surfaceProps(surface)}
    className="relative overflow-hidden bg-ds-bg py-16 sm:py-20 lg:py-24"
  >
    <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
      <Reveal>
        <SectionIntro
          eyebrow="How It Works"
          title={
            <SplitText
              text="From sign-up to sideline in three steps."
              splitType="words"
              delay={55}
            />
          }
        >
          Three steps from the couch to the field. Nothing is due until after you have signed up.
        </SectionIntro>
      </Reveal>

      <div aria-hidden="true" className="yard-line mt-12" />

      <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {PLAYBOOK.map((play, index) => (
          <Reveal key={play.title} variant="up" delay={index + 1} className="flex">
            <article
              data-surface="paper"
              className="card group flex w-full flex-col p-7 text-ds-text sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <CountUp
                  to={index + 1}
                  from={0}
                  duration={0.9 + index * 0.2}
                  className="numeral text-[3.5rem] text-ds-accent transition-transform duration-state ease-out group-hover:-translate-y-1"
                />
                <CampIcon name={play.icon} size={48} />
              </div>
              <h3 className="display mt-4 text-2xl text-ds-text">{play.title}</h3>
              <p className="body-copy mt-3 text-[15px] text-ds-text-muted">{play.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default PlaybookSection;
