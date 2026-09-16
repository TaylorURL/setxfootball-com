// The roster: one white card per coach on the ink ground, the number at the
// corner the way a jersey carries it.
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { COACHES } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import CampIcon from "../../ui/CampIcon";

const CoachesSection = ({ surface = "navy" }) => (
  <section {...surfaceProps(surface)} className="relative bg-ds-bg py-16 sm:py-20 lg:py-24">
    <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
      <Reveal>
        <SectionIntro eyebrow="Background Checked" title="Meet the coaches.">
          Every coach has cleared a background check and brings real coaching and playing experience
          to the field.
        </SectionIntro>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {COACHES.map((coach, index) => (
          <Reveal key={coach.name} variant="up" delay={index + 1} className="flex">
            <article
              data-surface="paper"
              className="card flex w-full flex-col p-8 text-ds-text sm:p-9"
            >
              <div className="flex items-start justify-between gap-4">
                <CampIcon name={coach.icon} size={56} />
                <span className="numeral text-5xl text-ds-accent">{coach.number}</span>
              </div>
              <span className="label-caps mt-5 text-ds-text-muted">{coach.role}</span>
              <h3 className="display mt-1.5 text-3xl text-ds-text">{coach.name}</h3>

              <ul className="mt-6 space-y-3">
                {coach.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-ds-accent"
                    />
                    <span className="body-copy text-[15px] text-ds-text-muted">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 inline-flex w-fit items-center gap-2 rounded-ds-sm border-rule border-ds-border-strong bg-ds-accent px-3.5 py-2 text-ds-on-accent">
                <span className="label-caps">{coach.highlight}</span>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default CoachesSection;
