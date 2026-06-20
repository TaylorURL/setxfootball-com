/**
 * RegisterPage — the camp sign-up surface. Wraps the multi-shirt registration
 * form in the public chrome with an editorial section header. The form owns all
 * submission and shirt-order logic; this page is presentation only.
 */
import MarketingPage from "../../components/layout/MarketingPage";
import Reveal from "../../components/marketing/Reveal";
import SectionIntro from "../../components/marketing/SectionIntro";
import RegistrationForm from "./RegistrationForm";
import { SHIRT_PRICE } from "../../utils/constants";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";

const RegisterPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.register} />
    <section className="relative overflow-hidden bg-ds-bg py-20 sm:py-24 lg:py-28">
      <div aria-hidden="true" className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-ds-accent-soft blur-[160px]" />
      <div aria-hidden="true" className="absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-primary-500/20 blur-[160px]" />
      <div aria-hidden="true" className="field-grid absolute inset-0 opacity-20" />
      <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <SectionIntro
            eyebrow={`Sign Up · $${SHIRT_PRICE} per shirt`}
            index="01"
            title={<>Sign your<br />camper up.</>}
          >
            Fill out the form, choose your shirts, and you're on the roster.
            Payment is collected after — no payment needed now.
          </SectionIntro>
        </Reveal>
        <Reveal delay={2} className="mt-14">
          <RegistrationForm />
        </Reveal>
      </div>
    </section>
  </MarketingPage>
);

export default RegisterPage;
