/**
 * DifferentiatorSection — the "what sets us apart" band: an editorial dark slab
 * with a tight display headline and a pull-quote card beneath. Always reads
 * dark — the dark slab is the point — but accepts a `surface` override for
 * pages that want a different rhythm.
 */
import { Sparkles } from "lucide-react";
import Reveal from "../Reveal";
import { surfaceProps } from "../surface";
import { DotGrid, ShinyText, ScrollReveal } from "../../reactbits";

const DifferentiatorSection = ({ surface }) => (
  <section
    {...surfaceProps(surface)}
    className="surface-seam relative border-b border-ds-border bg-ds-bg py-24 sm:py-32 lg:py-40"
  >
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal variant="scale" className="relative overflow-hidden border border-ds-border bg-ds-bg-elevated p-10 sm:p-16 lg:p-24">
        {/* React Bits — an interactive DotGrid replaces the static grain so the
            slab reacts to the cursor. */}
        <DotGrid className="absolute inset-0 opacity-60" gap={38} dotSize={1.5} />
        <div aria-hidden="true" className="scoreboard-grain absolute inset-0" />
        <div className="relative max-w-4xl">
          <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
            <span aria-hidden="true" className="accent-tick is-on w-10" />
            <ShinyText text="What Sets Us Apart" speed={5} />
          </span>
          <h3 className="editorial-display editorial-display-tight mt-7 text-4xl text-ds-text sm:text-6xl lg:text-7xl">
            Camps don&apos;t<br />
            usually look<br />
            <span className="text-ds-accent-bright">like this.</span>
          </h3>
          <p className="editorial-body mt-8 max-w-3xl text-lg leading-relaxed text-ds-text-muted sm:text-xl">
            What truly sets SETXYFC apart is the presence of{" "}
            <span className="font-semibold text-ds-text">outside professional and high-level athletes</span>{" "}
            who attend as guest coaches and speakers — giving campers exposure to
            real-world experience, motivation, and insight most camps simply
            cannot offer.
          </p>

          <div className="mt-12 max-w-3xl border-l-2 border-ds-accent bg-ds-bg/60 px-7 py-7 backdrop-blur-sm sm:px-9 sm:py-9">
            <Sparkles className="h-5 w-5 text-ds-accent-bright" />
            {/* React Bits — ScrollReveal develops the pull-quote word-by-word as it scrolls. */}
            <ScrollReveal
              as="p"
              className="editorial-display mt-4 text-2xl leading-tight text-ds-text sm:text-3xl"
            >
              We are more than a camp. We are mentors, leaders, and advocates — here for your kids on and off the field.
            </ScrollReveal>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default DifferentiatorSection;
