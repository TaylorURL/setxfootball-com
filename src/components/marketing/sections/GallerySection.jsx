/**
 * GallerySection — the past-seasons photo mosaic. Sharp edges, hairline frames,
 * caption tags that slide in on hover. Generous gutters.
 */
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { GALLERY } from "../../../content/campContent";

const GallerySection = () => (
  <section className="relative border-b border-ds-border bg-ds-bg py-24 sm:py-32 lg:py-40">
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal>
        <SectionIntro
          eyebrow="Camp Memories"
          title={<>From the<br />sideline.</>}
        >
          Snapshots from past seasons — the energy, the learning, and the
          friendships that keep this camp going.
        </SectionIntro>
      </Reveal>

      <div className="mt-16 grid auto-rows-[150px] grid-cols-4 gap-2 border-t border-ds-border pt-12 sm:auto-rows-[200px] sm:gap-3 lg:auto-rows-[230px]">
        {GALLERY.map((item, index) => (
          <Reveal key={item.src} variant="scale" delay={index + 1} className={item.span}>
            <div className="group relative h-full w-full overflow-hidden border border-ds-border">
              <img
                src={item.src}
                alt={`SETX Youth Football Camp — ${item.caption}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ds-bg/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="mono-tag-sm pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-2 bg-ds-bg/85 px-3 py-1.5 text-white opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:opacity-100">
                <span aria-hidden="true" className="inline-block h-px w-3 bg-ds-accent" />
                {item.caption}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default GallerySection;
