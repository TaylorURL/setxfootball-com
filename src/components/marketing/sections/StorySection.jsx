import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { STORY_IMAGE, STORY_PILLARS } from "../../../content/campContent";
import { surfaceProps } from "../surface";
import Photo from "../../ui/Photo";
import { TiltedCard } from "../../reactbits";

const StorySection = ({ surface = "light" }) => (
  <section
    {...surfaceProps(surface)}
    className="surface-seam relative border-b border-ds-border bg-ds-bg py-24 sm:py-32 lg:py-40"
  >
    <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-10">
      <Reveal className="max-w-4xl">
        <SectionIntro
          as="h1"
          eyebrow="Our Mission"
          title={
            <>
              Built for our
              <br />
              <span className="text-ds-accent-bright">community.</span>
            </>
          }
        >
          SETX Youth Football Camp was built to give every kid in Daisetta and Southeast Texas a
          shot at the field. Two days of fundamentals, fun, and confidence. No pay-to-play.
        </SectionIntro>
      </Reveal>

      <div className="mt-20 grid grid-cols-1 gap-12 border-t border-ds-border pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal variant="left" className="relative">
          <TiltedCard
            max={8}
            scale={1.02}
            className="group relative overflow-hidden bg-ds-surface-2"
          >
            <Photo
              image={STORY_IMAGE}
              alt="Campers and coaches spread across the field at warm-ups in Daisetta, Texas"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="photo-mute h-[520px] w-full bg-ds-surface-2 object-cover"
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-ds-bg/60 via-transparent to-transparent"
            />
            <div className="absolute bottom-6 left-6 border-l-2 border-ds-accent bg-ds-bg/85 px-5 py-4 backdrop-blur-sm">
              <p className="mono-tag-sm text-ds-text-faint">Now in our</p>
              <p className="editorial-display mt-1 text-2xl text-ds-text">Third year and growing</p>
            </div>
          </TiltedCard>
        </Reveal>

        <Reveal variant="right" delay={2}>
          <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
            <span aria-hidden="true" className="accent-tick is-on w-10" />
            The Story
          </span>
          <h2 className="editorial-display editorial-display-tight mt-5 text-4xl text-ds-text sm:text-5xl">
            Started by neighbors.
            <br />
            <span className="text-ds-accent-bright">Run for neighbors.</span>
          </h2>
          <div className="editorial-body mt-6 max-w-measure space-y-5">
            <p className="text-lg text-ds-text-muted">
              Growing up in Daisetta, we didn’t have many youth sports options, so we built one.
              SETXYFC is a community-first, majority-free football camp offering two half-days of
              confidence-building instruction.
            </p>
            <p className="text-lg text-ds-text-muted">
              Drinks, snacks, and a camp shirt for every participant, registered or not, because
              inclusion matters more than optics. Now in our third year, the camp keeps growing, and
              we’re proud of what this community has built together.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 border-t border-ds-border pt-10 sm:grid-cols-2">
            {STORY_PILLARS.map((item, index) => (
              <Reveal key={item.title} variant="up" delay={index + 1}>
                <div className="group left-rule-accent pl-4">
                  <item.icon
                    className="h-5 w-5 text-ds-accent-bright transition-transform duration-state ease-out group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                  <p className="editorial-display mt-3 text-lg text-ds-text">{item.title}</p>
                  <p className="editorial-body mt-2 text-sm text-ds-text-muted">{item.body}</p>
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
