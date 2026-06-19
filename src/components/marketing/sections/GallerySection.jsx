/**
 * GallerySection — the past-seasons photo mosaic, each tile revealing a caption
 * on hover.
 */
import { Container, Section, Card } from "@bradley-t-t/sunday-design-system";
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { GALLERY } from "../../../content/campContent";

const GallerySection = () => (
  <Section space="xl" className="bg-ds-bg">
    <Container size="xl">
      <Reveal className="mb-14">
        <SectionIntro eyebrow="Camp Memories" title="From the Sideline">
          Snapshots from past seasons — the energy, the learning, and the
          friendships that keep this camp going.
        </SectionIntro>
      </Reveal>

      <div className="grid auto-rows-[140px] grid-cols-4 gap-3 sm:auto-rows-[180px] sm:gap-4 lg:auto-rows-[200px]">
        {GALLERY.map((item, index) => (
          <Reveal key={item.src} variant="scale" delay={index + 1} className={item.span}>
            <Card variant="outline" padding="none" className="group relative h-full w-full overflow-hidden">
              <img
                src={item.src}
                alt={`SETX Youth Football Camp — ${item.caption}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 ease-ds-out group-hover:scale-[1.06]"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="pointer-events-none absolute bottom-2 left-2.5 inline-flex items-center gap-1.5 rounded-ds-full bg-slate-950/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <span className="inline-block h-0.5 w-2.5 bg-accent-400" />
                {item.caption}
              </span>
            </Card>
          </Reveal>
        ))}
      </div>
    </Container>
  </Section>
);

export default GallerySection;
