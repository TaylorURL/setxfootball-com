import Reveal from "../Reveal";
import { surfaceProps } from "../surface";
import { ScrollReveal } from "../../reactbits";
import CampIcon from "../../ui/CampIcon";

const DifferentiatorSection = ({ surface }) => (
  <section
    {...surfaceProps(surface)}
    className="relative bg-ds-bg-recessed py-16 sm:py-20 lg:py-24"
  >
    <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
      <Reveal
        variant="scale"
        className="relative grid grid-cols-1 gap-10 overflow-hidden rounded-ds-xl border-rule border-ds-ink bg-ds-gold p-8 text-ds-on-gold shadow-hard-xl sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12 lg:p-12"
      >
        <div className="relative max-w-4xl">
          <span className="inline-flex items-center rounded-ds-sm border-rule border-ds-ink bg-ds-bg-elevated px-3 py-1.5 text-ds-text">
            <span className="label-caps">What Sets Us Apart</span>
          </span>
          <h2 className="display mt-5 text-3xl sm:text-4xl lg:text-5xl">
            Camps don&apos;t usually look like this.
          </h2>
          <p className="body-copy mt-7 max-w-measure text-lg sm:text-xl">
            What sets SETXYFC apart is who shows up to coach.{" "}
            <span className="font-bold">Outside professional and high-level athletes</span> attend
            as guest coaches and speakers, so campers hear about the game from people who have
            played it at that level.
          </p>

          <div
            data-surface="paper"
            className="mt-10 max-w-3xl rounded-ds-lg border-rule border-ds-border-strong bg-ds-bg-elevated px-6 py-6 text-ds-text sm:px-8 sm:py-7"
          >
            <ScrollReveal as="p" className="display text-2xl sm:text-3xl">
              We are more than a camp. We are mentors and advocates, here for your kids on and off
              the field.
            </ScrollReveal>
          </div>
        </div>
        <CampIcon name="mvp" size={96} className="justify-self-center lg:justify-self-end" />
      </Reveal>
    </div>
  </section>
);

export default DifferentiatorSection;
