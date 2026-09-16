/** The businesses and families funding the camp. */
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { SPONSORS, SPONSOR_NOTES } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import { SplitText } from "../../reactbits";
import Photo from "../../ui/Photo";
import { actionClass } from "../../ui/actionClass";
import { CAMP_PHONE } from "../../../utils/constants";

const SponsorsSection = ({ surface }) => (
  <>
    <section {...surfaceProps(surface)} className="relative bg-ds-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
        <Reveal>
          <SectionIntro
            as="h1"
            eyebrow="Our Partners"
            title={<SplitText text="Thank you to our sponsors." splitType="words" delay={55} />}
          >
            We are grateful for the local businesses and families whose generosity keeps the camp
            free for kids who need it.
          </SectionIntro>
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SPONSORS.map(({ name, image }, index) => (
            <Reveal as="li" key={name} variant="up" delay={index + 1}>
              <div className="card card-lift overflow-hidden">
                {/* `contain`, not `cover`: a sponsor's mark is the one thing on
                    this page that must not be cropped to fit a tile. */}
                <div className="flex aspect-[4/3] items-center justify-center bg-ds-bg-elevated p-8">
                  <Photo
                    image={image}
                    alt={`${name}, SETX Football Camp sponsor`}
                    sizes="(min-width: 1024px) 30vw, 90vw"
                    priority={index === 0}
                    className="max-h-full w-full object-contain"
                  />
                </div>
                <p className="flex items-center gap-2.5 border-t-rule border-ds-border-strong bg-ds-bg px-5 py-4 text-[15px] font-bold text-ds-text">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-ds-accent" />
                  {name}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {SPONSOR_NOTES.map(({ title, body }, index) => (
            <Reveal key={title} variant="up" delay={index + 1} className="flex">
              <div className="card-flat w-full p-7">
                <h2 className="heading text-[22px] text-ds-text">{title}</h2>
                <p className="body-copy mt-3 text-[15px] text-ds-text-muted">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section data-surface="navy" data-deferred="" className="bg-ds-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
        <Reveal
          variant="scale"
          className="grid grid-cols-1 gap-8 rounded-ds-xl border-rule border-ds-ink bg-ds-gold p-8 text-ds-on-gold sm:p-12 lg:grid-cols-[1.5fr_auto] lg:items-center lg:p-14"
        >
          <div>
            <h2 className="display text-3xl sm:text-4xl lg:text-5xl">
              Put your business on the wall.
            </h2>
            <p className="body-copy mt-5 max-w-measure text-lg sm:text-xl">
              One call gets you a price for the season, a spot on this page, and a banner at the
              field.
            </p>
          </div>
          <a
            href={`tel:${CAMP_PHONE}`}
            className={actionClass({ tone: "navy", size: "lg", className: "shrink-0" })}
          >
            Call the Camp
          </a>
        </Reveal>
      </div>
    </section>
  </>
);

export default SponsorsSection;
