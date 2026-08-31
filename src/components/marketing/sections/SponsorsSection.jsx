/** The businesses and families funding the camp. */
import { Handshake } from "lucide-react";
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { SPONSORS, SPONSOR_NOTES } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import { GlareHover, SplitText } from "../../reactbits";
import Photo from "../../ui/Photo";

const SponsorsSection = ({ surface = "light" }) => (
  <section
    {...surfaceProps(surface)}
    className="surface-seam relative border-b border-ds-border bg-ds-bg py-24 sm:py-32 lg:py-40"
  >
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal>
        <SectionIntro
          as="h1"
          badge={
            <span className="inline-flex items-center gap-2">
              <Handshake className="h-3.5 w-3.5" aria-hidden="true" /> Our Partners
            </span>
          }
          title={<SplitText text="Thank you to our sponsors." splitType="words" delay={55} />}
        >
          We’re grateful for the local businesses and families whose generosity keeps the camp free
          for kids who need it.
        </SectionIntro>
      </Reveal>

      <ul className="mt-16 grid grid-cols-1 gap-6 border-t border-ds-border pt-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {SPONSORS.map(({ name, image }, index) => (
          <Reveal as="li" key={name} variant="up" delay={index + 1}>
            <GlareHover className="card-lift relative overflow-hidden border border-ds-border bg-ds-bg-elevated">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 z-raised h-px bg-ds-accent"
              />
              {/* `contain`, not `cover`: a sponsor's mark is the one thing on
                  this page that must not be cropped to fit a tile. */}
              <div className="flex aspect-[4/3] items-center justify-center bg-ds-surface p-8">
                <Photo
                  image={image}
                  alt={`${name}, SETX Football Camp sponsor`}
                  sizes="(min-width: 1024px) 30vw, 90vw"
                  priority={index === 0}
                  className="max-h-full w-full object-contain"
                />
              </div>
              <p className="mono-tag-sm border-t border-ds-border px-5 py-4 text-ds-text-muted">
                {name}
              </p>
            </GlareHover>
          </Reveal>
        ))}
      </ul>

      <div className="mt-16 grid grid-cols-1 gap-10 border-t border-ds-border pt-14 sm:grid-cols-3 sm:gap-8">
        {SPONSOR_NOTES.map(({ title, body }, index) => (
          <Reveal key={title} variant="up" delay={index + 1}>
            <h2 className="editorial-display text-2xl text-ds-text sm:text-3xl">{title}</h2>
            <p className="editorial-body mt-4 text-[15px] leading-relaxed text-ds-text-muted">
              {body}
            </p>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default SponsorsSection;
