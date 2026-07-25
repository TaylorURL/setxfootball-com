import { Handshake } from "lucide-react";
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { SPONSOR_IMAGES } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import { GlareHover, SplitText } from "../../reactbits";

const SponsorsSection = ({ surface = "light" }) => (
  <section
    {...surfaceProps(surface)}
    className="surface-seam relative border-b border-ds-border bg-ds-bg py-24 sm:py-32 lg:py-40"
  >
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal>
        <SectionIntro
          badge={
            <span className="inline-flex items-center gap-2">
              <Handshake className="h-3.5 w-3.5" /> Our Partners
            </span>
          }
          title={<SplitText text="Thank you to our sponsors." splitType="words" delay={55} />}
        >
          We're grateful for the local businesses and families whose generosity
          keeps the camp free for kids who need it.
        </SectionIntro>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-6 border-t border-ds-border pt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {SPONSOR_IMAGES.map((sponsorImage, index) => (
          <Reveal key={sponsorImage} variant="up" delay={index + 1}>
            <GlareHover className="card-lift relative overflow-hidden border border-ds-border">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-px bg-ds-accent" />
              <div className="aspect-[4/3] overflow-hidden bg-ds-surface">
                <img
                  src={sponsorImage}
                  alt={`SETX Football Camp sponsor banner ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05]"
                />
              </div>
            </GlareHover>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default SponsorsSection;
