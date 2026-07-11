/**
 * RegisterPage — the camp sign-up surface. Wraps the multi-shirt registration
 * form in the public chrome with an editorial section header. The form owns
 * all submission and shirt-order logic; this page is presentation only.
 *
 * Rendered on the paper register so the form reads as a clean editorial
 * surface — easier on the eyes for the longest interaction on the site.
 */
import MarketingPage from "../../components/layout/MarketingPage";
import Reveal from "../../components/marketing/Reveal";
import SectionIntro from "../../components/marketing/SectionIntro";
import RegistrationForm from "./RegistrationForm";
import { SHIRT_PRICE } from "../../utils/constants";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import { Squares, ShinyText, SplitText } from "../../components/reactbits";

const RegisterPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.register} />
    <section
      data-surface="light"
      className="relative overflow-hidden bg-ds-bg py-20 sm:py-24 lg:py-28"
    >
      <div aria-hidden="true" className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-ds-accent-soft blur-[160px]" />
      <div aria-hidden="true" className="absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-ds-surface-2 blur-[160px] opacity-60" />
      {/* React Bits — a slow Squares grid gives the sign-up surface quiet motion. */}
      <Squares className="absolute inset-0 opacity-60" size={56} speed={0.2} lineColor="var(--ds-border)" />
      <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <SectionIntro
            eyebrow={<ShinyText text={`Sign Up · $${SHIRT_PRICE} per shirt`} speed={4} />}
            title={<SplitText text="Sign your camper up." splitType="words" delay={60} />}
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
