/**
 * JoinCallout — the closing call-to-action band shared by the public pages.
 * Drives to the sign-up route with the season framing and the shirt price.
 */
import { Link } from "react-router-dom";
import { ArrowRight, Shirt } from "lucide-react";
import { Container, Section, Button, Text } from "@bradley-t-t/sunday-design-system";
import Reveal from "../Reveal";
import { SHIRT_PRICE } from "../../../utils/constants";
import { REGISTER_PATH } from "../../nav/navLinks";

const JoinCallout = () => (
  <Section space="xl" className="relative overflow-hidden border-t border-ds-border bg-ds-bg-elevated">
    <div aria-hidden="true" className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-ds-accent-soft blur-[120px]" />
    <div aria-hidden="true" className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-primary-500/10 blur-[120px]" />
    <Container size="md" className="relative text-center">
      <Reveal>
        <span className="mb-5 inline-flex items-center gap-2 rounded-ds-full bg-ds-accent-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ds-accent-bright">
          <Shirt className="h-3.5 w-3.5" /> Sign Up · ${SHIRT_PRICE} per shirt
        </span>
        <h2 className="heading-stencil heading-stencil-tight text-[2.25rem] text-ds-text sm:text-5xl lg:text-[3.5rem]">
          Ready to get your camper on the roster?
        </h2>
        <Text tone="muted" size="lg" className="mx-auto mt-4 max-w-2xl">
          Fill out the form, choose your shirts, and you're set. Payment is
          collected after — no payment needed now.
        </Text>
        <Button
          asChild
          variant="primary"
          size="lg"
          className="mt-8 font-bold uppercase tracking-[0.06em]"
        >
          <Link to={REGISTER_PATH}>
            Sign Up Your Camper <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </Reveal>
    </Container>
  </Section>
);

export default JoinCallout;
