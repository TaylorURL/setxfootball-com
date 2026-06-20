/**
 * DifferentiatorSection — the "what sets us apart" band: an editorial dark slab
 * with crosshair technical corners, a tight display headline, and a pull-quote
 * card beneath. Mono microcopy throughout.
 */
import { Sparkles } from "lucide-react";
import Reveal from "../Reveal";

const DifferentiatorSection = () => (
  <section className="relative border-b border-ds-border bg-ds-bg py-24 sm:py-32 lg:py-40">
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal variant="scale" className="relative tech-corners overflow-hidden border border-ds-border bg-ds-bg-elevated p-10 sm:p-16 lg:p-24">
        <div aria-hidden="true" className="field-grid absolute inset-0 opacity-30" />
        <div aria-hidden="true" className="scoreboard-grain absolute inset-0" />
        <div className="relative max-w-4xl">
          <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-ds-accent" />
            What Sets Us Apart
          </span>
          <h3 className="editorial-display editorial-display-tight mt-7 text-4xl text-white sm:text-6xl lg:text-7xl">
            Camps don&apos;t<br />
            usually look<br />
            <span className="text-ds-accent-bright">like this.</span>
          </h3>
          <p className="editorial-body mt-8 max-w-3xl text-lg leading-relaxed text-white/75 sm:text-xl">
            What truly sets SETXYFC apart is the presence of{" "}
            <span className="font-semibold text-white">outside professional and high-level athletes</span>{" "}
            who attend as guest coaches and speakers — giving campers exposure to
            real-world experience, motivation, and insight most camps simply
            cannot offer.
          </p>

          <div className="mt-12 max-w-3xl border-l-2 border-ds-accent bg-ds-bg/60 px-7 py-7 backdrop-blur-sm sm:px-9 sm:py-9">
            <Sparkles className="h-5 w-5 text-ds-accent-bright" />
            <p className="editorial-display mt-4 text-2xl leading-tight text-white sm:text-3xl">
              We are more than a camp. We are mentors, leaders, and advocates —
              here for your kids on and off the field.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default DifferentiatorSection;
