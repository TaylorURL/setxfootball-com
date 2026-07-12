/**
 * CoachesSection — the background-checked coaching staff, each rendered as a
 * roster card with a tight display name, role, and a hairline divider list of
 * credentials. Defaults to the dark register so the cards read as printed on
 * a deep field-coal slab.
 */
import { ShieldCheck, Star } from "lucide-react";
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { COACHES } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import { SpotlightCard } from "../../reactbits";

const CoachesSection = ({ surface }) => (
  <section
    {...surfaceProps(surface)}
    className="surface-seam relative border-b border-ds-border bg-ds-bg-elevated py-24 sm:py-32 lg:py-40"
  >
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal>
        <SectionIntro
          badge={
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5" /> Background Checked
            </span>
          }
          title={<>Meet the<br />coaches.</>}
        >
          Every coach has cleared a background check and brings real coaching and
          playing experience to the field.
        </SectionIntro>
      </Reveal>

      <div className="mt-20 grid grid-cols-1 gap-12 border-t border-ds-border pt-16 lg:grid-cols-2 lg:gap-16">
        {COACHES.map((coach, index) => (
          <Reveal key={coach.name} variant="up" delay={index + 1}>
            {/* React Bits — SpotlightCard adds a cursor-tracked accent wash to each roster card. */}
            <SpotlightCard as="article" className="card-lift relative border border-ds-border bg-ds-surface p-8 sm:p-10">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-ds-accent" />
              <div className="flex items-start gap-5">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ds-accent-soft text-ds-accent-bright">
                  <coach.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="mono-tag-sm text-ds-text-faint">{coach.role}</span>
                  <h3 className="editorial-display mt-2 text-3xl text-ds-text sm:text-4xl">
                    {coach.name}
                  </h3>
                </div>
              </div>

              <ul className="mt-8 space-y-3 border-t border-ds-border pt-6">
                {coach.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-2 h-px w-3 shrink-0 bg-ds-accent" />
                    <span className="editorial-body text-[15px] text-ds-text-muted">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-center gap-3 border border-ds-border bg-ds-surface-2 px-4 py-3">
                <Star className="h-3.5 w-3.5 shrink-0 text-ds-accent-bright" />
                <span className="mono-tag text-ds-text">{coach.highlight}</span>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default CoachesSection;
