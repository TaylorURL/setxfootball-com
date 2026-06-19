/**
 * CoachesSection — the background-checked coaching staff, each as a roster card
 * with a jersey number and highlight strip.
 */
import { ShieldCheck, Star } from "lucide-react";
import { Container, Section, Grid, Card, Text, Eyebrow } from "@bradley-t-t/sunday-design-system";
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import VarsityNumber from "../../brand/VarsityNumber";
import { COACHES } from "../../../content/campContent";

const CoachesSection = () => (
  <Section space="xl" className="border-t border-ds-border bg-ds-bg-elevated">
    <Container size="xl">
      <Reveal className="mb-16">
        <SectionIntro
          badge={<><ShieldCheck className="h-3.5 w-3.5" /> Background Checked</>}
          title="Meet the Coaches"
        >
          Every coach has cleared a background check and brings real coaching and
          playing experience to the field.
        </SectionIntro>
      </Reveal>

      <Grid cols={2} gap={6}>
        {COACHES.map((coach, index) => (
          <Reveal key={coach.name} variant="scale" delay={index + 1}>
            <Card variant="surface" padding="lg" interactive className="relative h-full overflow-hidden">
              <span aria-hidden="true" className="accent-edge absolute inset-x-0 top-0 h-1" />
              <div className="mb-6 flex items-start gap-4">
                <VarsityNumber size="lg">{coach.number}</VarsityNumber>
                <div className="min-w-0 flex-1">
                  <Eyebrow strong className="text-ds-accent-bright">{coach.role}</Eyebrow>
                  <h3 className="heading-stencil mt-1.5 text-3xl text-ds-text">{coach.name}</h3>
                </div>
                <coach.icon className="h-5 w-5 shrink-0 text-ds-text-faint" />
              </div>
              <ul className="mb-6 space-y-2.5">
                {coach.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ds-accent" />
                    <Text size="sm" tone="muted">{point}</Text>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 rounded-ds-md bg-ds-surface-2 p-3.5">
                <Star className="h-3.5 w-3.5 text-ds-accent-bright" />
                <Eyebrow strong>{coach.highlight}</Eyebrow>
              </div>
            </Card>
          </Reveal>
        ))}
      </Grid>
    </Container>
  </Section>
);

export default CoachesSection;
