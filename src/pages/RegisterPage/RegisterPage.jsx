/**
 * RegisterPage — the camp sign-up surface. Wraps the multi-shirt registration
 * form in the public chrome with a varsity section header. The form owns all
 * submission and shirt-order logic; this page is presentation only.
 */
import { Shirt } from "lucide-react";
import { Container, Section } from "@bradley-t-t/sunday-design-system";
import MarketingPage from "../../components/layout/MarketingPage";
import Reveal from "../../components/marketing/Reveal";
import SectionIntro from "../../components/marketing/SectionIntro";
import RegistrationForm from "./RegistrationForm";
import { SHIRT_PRICE } from "../../utils/constants";

const RegisterPage = () => (
  <MarketingPage>
    <Section space="xl" className="relative overflow-hidden bg-ds-bg">
      <div aria-hidden="true" className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-ds-accent-soft blur-[120px]" />
      <div aria-hidden="true" className="absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-primary-500/10 blur-[120px]" />
      <Container size="md" className="relative">
        <Reveal className="mb-12">
          <SectionIntro
            badge={<><Shirt className="h-3.5 w-3.5" /> Sign Up · ${SHIRT_PRICE} per shirt</>}
            title="Sign your camper up."
          >
            Fill out the form, choose your shirts, and you're on the roster.
            Payment is collected after — no payment needed now.
          </SectionIntro>
        </Reveal>
        <Reveal delay={2}>
          <RegistrationForm />
        </Reveal>
      </Container>
    </Section>
  </MarketingPage>
);

export default RegisterPage;
