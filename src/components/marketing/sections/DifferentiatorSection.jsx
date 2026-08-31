import { Sparkles } from "lucide-react";
import Reveal from "../Reveal";
import { surfaceProps } from "../surface";
import { DotGrid, ScrollReveal } from "../../reactbits";

const DifferentiatorSection = ({ surface }) => (
  <section
    {...surfaceProps(surface)}
    className="surface-seam relative border-b border-ds-border bg-ds-bg py-24 sm:py-32 lg:py-40"
  >
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal
        variant="scale"
        className="relative overflow-hidden border border-ds-border bg-ds-bg-elevated p-10 sm:p-16 lg:p-24"
      >
        <DotGrid className="absolute inset-0 opacity-60" gap={38} dotSize={1.5} />
        <div aria-hidden="true" className="pointer-events-none scoreboard-grain absolute inset-0" />
        <div className="relative max-w-4xl">
          <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
            <span aria-hidden="true" className="accent-tick is-on w-10" />
            What Sets Us Apart
          </span>
          <h2 className="editorial-display editorial-display-tight mt-7 text-4xl text-ds-text sm:text-6xl lg:text-7xl">
            Camps don&apos;t
            <br />
            usually look
            <br />
            <span className="text-ds-accent-bright">like this.</span>
          </h2>
          <p className="editorial-body mt-8 max-w-measure text-lg leading-relaxed text-ds-text-muted sm:text-xl">
            What sets SETXYFC apart is who shows up to coach.{" "}
            <span className="font-semibold text-ds-text">
              Outside professional and high-level athletes
            </span>{" "}
            attend as guest coaches and speakers, so campers hear about the game from people who
            have played it at that level.
          </p>

          <div className="mt-12 max-w-3xl border-l-2 border-ds-accent bg-ds-bg/60 px-7 py-7 backdrop-blur-sm sm:px-9 sm:py-9">
            <Sparkles className="h-5 w-5 text-ds-accent-bright" aria-hidden="true" />
            <ScrollReveal
              as="p"
              className="editorial-display mt-4 text-2xl leading-tight text-ds-text sm:text-3xl"
            >
              We are more than a camp. We are mentors and advocates, here for your kids on and off
              the field.
            </ScrollReveal>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default DifferentiatorSection;
