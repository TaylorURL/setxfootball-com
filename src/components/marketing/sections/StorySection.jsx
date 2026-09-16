import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { STORY_IMAGE, STORY_PILLARS } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import Photo from "../../ui/Photo";
import CampIcon from "../../ui/CampIcon";

const StorySection = ({ surface }) => (
  <section {...surfaceProps(surface)} className="relative bg-ds-bg py-16 sm:py-20 lg:py-24">
    <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
      <Reveal>
        <SectionIntro
          as="h1"
          eyebrow="Our Mission"
          title="Built for our community."
          className="max-w-4xl"
        >
          SETX Youth Football Camp was built to give every kid in Daisetta and Southeast Texas a
          shot at the field. Two days of fundamentals, fun, and confidence. No pay-to-play.
        </SectionIntro>
      </Reveal>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
        <Reveal variant="left" className="relative pb-8">
          <div className="group photo-frame bg-ds-bg-elevated p-2.5">
            <Photo
              image={STORY_IMAGE}
              alt="Campers and coaches spread across the field at warm-ups in Daisetta, Texas"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="photo-zoom h-[280px] w-full rounded-ds-md object-cover sm:h-[360px]"
            />
            <p className="label-caps mt-2.5 text-ds-text-muted">Warm-ups · Daisetta, TX</p>
          </div>
          <div className="absolute bottom-0 left-5 rounded-ds-md border-rule border-ds-border-strong bg-ds-accent px-5 py-3 text-ds-on-accent shadow-hard-sm">
            <p className="label-caps">Now in our</p>
            <p className="numeral mt-1 text-3xl">Third year</p>
          </div>
        </Reveal>

        <Reveal variant="right" delay={2}>
          <span className="eyebrow">The Story</span>
          <h2 className="display mt-5 text-3xl text-ds-text sm:text-4xl">
            Started by neighbors. Run for neighbors.
          </h2>
          <div className="body-copy mt-6 max-w-measure space-y-4">
            <p className="text-base text-ds-text-muted">
              Growing up in Daisetta, we didn&apos;t have many youth sports options, so we built
              one. SETXYFC is a community-first, majority-free football camp offering two half-days
              of confidence-building instruction.
            </p>
            <p className="text-base text-ds-text-muted">
              Drinks, snacks, and a camp shirt for every participant, registered or not, because
              inclusion matters more than optics. Now in our third year, the camp keeps growing, and
              we&apos;re proud of what this community has built together.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {STORY_PILLARS.map((item, index) => (
              <Reveal key={item.title} variant="up" delay={index + 1}>
                <div className="card-flat group flex h-full items-start gap-4 p-5">
                  <CampIcon name={item.icon} size={40} />
                  <div>
                    <p className="heading text-lg text-ds-text">{item.title}</p>
                    <p className="body-copy mt-1.5 text-sm text-ds-text-muted">{item.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default StorySection;
