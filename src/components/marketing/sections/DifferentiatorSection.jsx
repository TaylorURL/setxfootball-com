/**
 * DifferentiatorSection — the dark "what sets us apart" band: guest pro athletes
 * and the mentors-and-advocates promise. An intentional image-forward band that
 * sits over its own dark surface.
 */
import { Sparkles } from "lucide-react";
import { Container, Section } from "@bradley-t-t/sunday-design-system";
import Reveal from "../Reveal";

const DifferentiatorSection = () => (
  <Section space="xl" className="bg-ds-bg">
    <Container size="xl">
      <Reveal variant="scale" className="scoreboard-grain relative overflow-hidden rounded-ds-2xl bg-slate-950 p-10 text-center md:p-16">
        <span aria-hidden="true" className="accent-edge absolute inset-x-0 top-0 h-1.5" />
        <span aria-hidden="true" className="accent-edge absolute inset-x-0 bottom-0 h-1.5" />
        <div aria-hidden="true" className="field-grid absolute inset-0 opacity-30" />
        <div className="relative">
          <span className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.24em] text-accent-300">
            <span aria-hidden="true" className="inline-block h-0.5 w-10 rounded-full bg-accent-400" />
            What Sets Us Apart
            <span aria-hidden="true" className="inline-block h-0.5 w-10 rounded-full bg-accent-400" />
          </span>
          <h3 className="heading-stencil heading-stencil-tight mb-6 text-3xl text-white md:text-5xl lg:text-6xl">
            Camps don&apos;t usually look like this.
          </h3>
          <p className="mx-auto mb-8 max-w-3xl text-base leading-relaxed text-slate-300 md:text-lg">
            What truly sets SETXYFC apart is the presence of{" "}
            <span className="font-semibold text-white">outside professional and high-level athletes</span>{" "}
            who attend as guest coaches and speakers — giving campers exposure to
            real-world experience, motivation, and insight most camps simply
            cannot offer.
          </p>
          <div className="mx-auto max-w-2xl rounded-ds-xl border border-white/15 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-8">
            <Sparkles className="mx-auto mb-3 h-5 w-5 text-accent-300" />
            <p className="heading-stencil text-2xl leading-tight text-white sm:text-3xl">
              We are more than a camp. We are mentors, leaders, and advocates —
              here for your kids on and off the field.
            </p>
          </div>
        </div>
      </Reveal>
    </Container>
  </Section>
);

export default DifferentiatorSection;
