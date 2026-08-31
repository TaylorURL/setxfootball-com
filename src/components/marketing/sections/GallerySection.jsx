/**
 * Photographs from past camps.
 *
 * Captions sit on the tile at rest rather than arriving on hover, because a
 * phone has no hover to reveal them with.
 */
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { GALLERY, GALLERY_NOTES } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import { TiltedCard } from "../../reactbits";
import Photo from "../../ui/Photo";

const GallerySection = ({ surface }) => (
  <section
    {...surfaceProps(surface)}
    className="surface-seam relative border-b border-ds-border bg-ds-bg py-24 sm:py-32 lg:py-40"
  >
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal>
        <SectionIntro
          as="h1"
          eyebrow="Camp Memories"
          title={
            <>
              From the
              <br />
              sideline.
            </>
          }
        >
          Snapshots from past seasons. The energy, the learning, and the friendships that keep this
          camp going.
        </SectionIntro>
      </Reveal>

      <ul className="mt-16 grid auto-rows-[150px] grid-cols-4 gap-2 border-t border-ds-border pt-12 sm:auto-rows-[200px] sm:gap-3 lg:auto-rows-[230px]">
        {GALLERY.map((item, index) => (
          <Reveal
            as="li"
            key={item.caption}
            variant="scale"
            delay={index + 1}
            className={item.span}
          >
            <TiltedCard
              max={7}
              scale={1.04}
              className="group relative h-full w-full overflow-hidden border border-ds-border bg-ds-surface-2"
            >
              <Photo
                image={item.image}
                alt={`${item.caption} at SETX Youth Football Camp`}
                sizes="(min-width: 1024px) 30vw, 50vw"
                priority={index === 0}
                className="photo-mute h-full w-full bg-ds-surface-2 object-cover"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ds-bg/80 via-ds-bg/10 to-transparent"
              />
              <span className="mono-tag-sm pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 text-ds-text">
                <span aria-hidden="true" className="inline-block h-px w-3 bg-ds-accent" />
                {item.caption}
              </span>
            </TiltedCard>
          </Reveal>
        ))}
      </ul>

      <div className="mt-16 grid grid-cols-1 gap-10 border-t border-ds-border pt-14 sm:grid-cols-3 sm:gap-8">
        {GALLERY_NOTES.map(({ title, body }, index) => (
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

export default GallerySection;
