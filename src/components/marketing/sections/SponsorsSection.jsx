/**
 * SponsorsSection — thank-you wall for the local businesses and families that
 * keep the camp free.
 */
import { Handshake } from "lucide-react";
import { Container, Section, Grid, Card } from "@bradley-t-t/sunday-design-system";
import Reveal from "../Reveal";
import SectionIntro from "../SectionIntro";
import { SPONSOR_IMAGES } from "../../../content/campContent";

const SponsorsSection = () => (
  <Section space="xl" className="bg-ds-bg">
    <Container size="xl">
      <Reveal className="mb-16">
        <SectionIntro
          badge={<><Handshake className="h-3.5 w-3.5" /> Our Partners</>}
          title="Thank you to our sponsors."
        >
          We're grateful for the local businesses and families whose generosity
          keeps the camp free for kids who need it.
        </SectionIntro>
      </Reveal>

      <Grid cols={3} gap={6}>
        {SPONSOR_IMAGES.map((sponsorImage, index) => (
          <Reveal key={sponsorImage} variant="scale" delay={index + 1}>
            <Card variant="outline" padding="none" className="group relative overflow-hidden">
              <span aria-hidden="true" className="accent-edge absolute inset-x-0 top-0 z-10 h-1" />
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={sponsorImage}
                  alt={`Sponsor ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-500 ease-ds-out group-hover:scale-[1.04]"
                />
              </div>
            </Card>
          </Reveal>
        ))}
      </Grid>
    </Container>
  </Section>
);

export default SponsorsSection;
