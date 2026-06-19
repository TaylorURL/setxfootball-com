/**
 * PerksSection — "What every camper gets": the no-pay-to-play promise rendered
 * as a row of perk cards.
 */
import { Shirt } from "lucide-react";
import { Container, Section, Grid, Card, Text } from "@bradley-t-t/sunday-design-system";
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { CAMPER_PERKS } from "../../../content/campContent";

const PerksSection = () => (
  <Section space="xl" className="bg-ds-bg">
    <Container size="xl">
      <Reveal className="mb-14">
        <SectionIntro
          badge={<><Shirt className="h-3.5 w-3.5" /> The Deal</>}
          title="What every camper gets."
        >
          No hidden fees, no pay-to-play. Sign up for the shirts and the rest
          comes with showing up.
        </SectionIntro>
      </Reveal>
      <Grid cols={4} gap={5}>
        {CAMPER_PERKS.map((perk, index) => (
          <Reveal key={perk.title} variant="up" delay={index + 1}>
            <Card variant="surface" padding="lg" interactive className="h-full">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-ds-lg bg-ds-accent-soft text-ds-accent-bright">
                <perk.icon className="h-5 w-5" />
              </span>
              <h3 className="heading-stencil text-xl text-ds-text">{perk.title}</h3>
              <Text size="sm" tone="muted" className="mt-2">{perk.body}</Text>
            </Card>
          </Reveal>
        ))}
      </Grid>
    </Container>
  </Section>
);

export default PerksSection;
