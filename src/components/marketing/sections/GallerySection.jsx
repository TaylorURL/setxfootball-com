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
import Photo from "../../ui/Photo";

const GallerySection = ({ surface }) => (
  <section {...surfaceProps(surface)} className="relative bg-ds-bg py-16 sm:py-20 lg:py-24">
    <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
      <Reveal>
        <SectionIntro as="h1" eyebrow="Camp Memories" title="From the sideline.">
          Snapshots from past seasons. The energy, the learning, and the friendships that keep this
          camp going.
        </SectionIntro>
      </Reveal>

      <ul className="mt-14 grid auto-rows-[150px] grid-cols-4 gap-3 sm:auto-rows-[200px] sm:gap-4 lg:auto-rows-[230px]">
        {GALLERY.map((item, index) => (
          <Reveal
            as="li"
            key={item.caption}
            variant="scale"
            delay={index + 1}
            className={item.span}
          >
            <figure className="group photo-frame relative h-full w-full shadow-hard">
              <Photo
                image={item.image}
                alt={`${item.caption} at SETX Youth Football Camp`}
                sizes="(min-width: 1024px) 30vw, 50vw"
                priority={index === 0}
                className="photo-zoom h-full w-full object-cover"
              />
              <figcaption className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center rounded-ds-sm border-rule border-ds-border-strong bg-ds-bg-elevated px-3 py-1.5 text-ds-text">
                <span className="label-caps">{item.caption}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {GALLERY_NOTES.map(({ title, body }, index) => (
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
);

export default GallerySection;
