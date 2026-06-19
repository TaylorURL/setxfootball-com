/**
 * PlaybookSection — "How it works": the three-step sign-up playbook.
 */
import { Container, Section, Grid, Card, Text } from "@bradley-t-t/sunday-design-system";
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import VarsityNumber from "../../brand/VarsityNumber";
import { PLAYBOOK } from "../../../content/campContent";

const PlaybookSection = () => (
  <Section space="xl" className="border-t border-ds-border bg-ds-bg-elevated">
    <Container size="xl">
      <Reveal className="mb-14">
        <SectionIntro eyebrow="The Playbook" title="How it works.">
          Three steps from the couch to the field. No payment due until after
          you've signed up.
        </SectionIntro>
      </Reveal>
      <Grid cols={3} gap={6}>
        {PLAYBOOK.map((play, index) => (
          <Reveal key={play.title} variant="up" delay={index + 1}>
            <Card variant="surface" padding="lg" className="relative h-full overflow-hidden">
              <span aria-hidden="true" className="accent-edge absolute inset-x-0 top-0 h-1" />
              <div className="mb-5 flex items-center justify-between">
                <VarsityNumber>{String(index + 1).padStart(2, "0")}</VarsityNumber>
                <play.icon className="h-6 w-6 text-ds-text-faint" />
              </div>
              <h3 className="heading-stencil text-2xl text-ds-text">{play.title}</h3>
              <Text size="sm" tone="muted" className="mt-2">{play.body}</Text>
            </Card>
          </Reveal>
        ))}
      </Grid>
    </Container>
  </Section>
);

export default PlaybookSection;
