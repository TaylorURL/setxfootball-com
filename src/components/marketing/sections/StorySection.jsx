/**
 * StorySection — the mission intro and "started by neighbors" story, with the
 * field photo and the supporting story pillars.
 */
import { Container, Section, Grid, Card, Text, Eyebrow } from "@bradley-t-t/sunday-design-system";
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import VarsityNumber from "../../brand/VarsityNumber";
import { STORY_IMAGE, STORY_PILLARS } from "../../../content/campContent";

const StorySection = () => (
  <Section space="xl" className="bg-ds-bg">
    <Container size="xl">
      <Reveal className="mb-16 lg:mb-24">
        <SectionIntro
          eyebrow="Our Mission"
          title={<>Built for our <span className="text-ds-accent-bright">community.</span></>}
        >
          SETX Youth Football Camp was built to give every kid in Daisetta and
          Southeast Texas a shot at the field. Two days of fundamentals, fun, and
          confidence — no pay-to-play.
        </SectionIntro>
      </Reveal>

      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal variant="left" className="relative">
          <Card variant="outline" padding="none" className="relative overflow-hidden">
            <span aria-hidden="true" className="accent-edge absolute inset-x-0 top-0 z-10 h-1.5" />
            <img src={STORY_IMAGE} alt="Coaches and campers on the field" className="h-[460px] w-full object-cover" />
          </Card>
          <Card variant="elevated" className="absolute -bottom-7 -right-6 hidden items-center gap-4 sm:flex">
            <VarsityNumber>03</VarsityNumber>
            <div>
              <div className="heading-stencil text-2xl leading-none text-ds-text">Season 03</div>
              <Eyebrow className="mt-1.5">Strong &amp; Growing</Eyebrow>
            </div>
          </Card>
        </Reveal>

        <Reveal variant="right" delay={2}>
          <div className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.24em] text-ds-accent-bright">
            <span aria-hidden="true" className="inline-block h-0.5 w-10 rounded-full bg-ds-accent" />
            The Story
          </div>
          <h2 className="heading-stencil heading-stencil-tight mb-6 text-4xl text-ds-text sm:text-5xl">
            Started by neighbors. <br />
            <span className="text-ds-accent-bright">Run for neighbors.</span>
          </h2>
          <div className="space-y-4">
            <Text tone="muted" size="lg">
              Growing up in Daisetta, we didn't have many youth sports options —
              so we built one. SETXYFC is a community-first, majority-free
              football camp offering two half-days of fundamentals, fun, and
              confidence-building instruction.
            </Text>
            <Text tone="muted" size="lg">
              Drinks, snacks, and a camp shirt for every participant — registered
              or not — because inclusion matters more than optics. Now in our
              third year, the camp keeps growing, and we're proud of what this
              community has built together.
            </Text>
          </div>

          <Grid cols={2} gap={3} className="mt-8">
            {STORY_PILLARS.map((item, index) => (
              <Reveal key={item.title} variant="up" delay={index + 1}>
                <Card variant="surface" padding="md" interactive className="h-full">
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-ds-md bg-ds-accent-soft text-ds-accent-bright">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <Text size="sm" weight="semibold">{item.title}</Text>
                  </div>
                  <Text size="xs" tone="muted">{item.body}</Text>
                </Card>
              </Reveal>
            ))}
          </Grid>
        </Reveal>
      </div>
    </Container>
  </Section>
);

export default StorySection;
