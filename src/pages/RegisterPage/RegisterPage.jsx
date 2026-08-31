// Presentation only: RegistrationForm owns submission and shirt-order logic.
// Paper register, because this is the longest interaction on the site.
import MarketingPage from "../../components/layout/MarketingPage";
import Reveal from "../../components/marketing/Reveal";
import SectionIntro from "../../components/marketing/SectionIntro";
import RegistrationForm from "./RegistrationForm";
import { Link } from "react-router-dom";
import { SHIRT_PRICE, CASHAPP_USERNAME, EDIT_WINDOW_DAYS } from "../../utils/constants";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import Breadcrumbs from "../../components/seo/Breadcrumbs";
import { Squares, SplitText } from "../../components/reactbits";

const RegisterPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.register} />
    <Breadcrumbs label="Sign Up" to="/register" />
    <section
      data-surface="light"
      className="relative overflow-hidden bg-ds-bg py-20 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-ds-accent-soft blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="absolute -left-20 bottom-10 h-80 w-80 rounded-full bg-ds-surface-2 blur-[160px] opacity-60"
      />
      <Squares
        className="absolute inset-0 opacity-60"
        size={56}
        speed={0.2}
        lineColor="var(--ds-border)"
      />
      <div className="relative mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10">
        <Reveal>
          <SectionIntro
            as="h1"
            eyebrow={`Sign Up · $${SHIRT_PRICE} per shirt`}
            title={<SplitText text="Sign your camper up." splitType="words" delay={60} />}
          >
            Fill out the form, choose your shirts, and you’re on the roster. Payment is collected
            after, so nothing is due now.
          </SectionIntro>
        </Reveal>
        <Reveal delay={2} className="mt-14">
          <RegistrationForm />
        </Reveal>

        <Reveal delay={3} className="mt-16 border-t border-ds-border pt-12">
          <h2 className="editorial-display text-2xl text-ds-text sm:text-3xl">After you sign up</h2>
          <p className="editorial-body mt-4 text-[15px] leading-relaxed text-ds-text-muted">
            The form puts your camper on the roster straight away. Payment comes after: $
            {SHIRT_PRICE} for each shirt you ordered, sent by CashApp to{" "}
            <span className="mono-num text-ds-text">${CASHAPP_USERNAME}</span>, and nothing else is
            due at any point. The camp itself is free.
          </p>
          <p className="editorial-body mt-4 text-[15px] leading-relaxed text-ds-text-muted">
            One entry covers one camper, so a family with more than one child fills the form out
            once per kid and picks a shirt size for each. Sign-ups can be changed for{" "}
            {EDIT_WINDOW_DAYS} days from the dashboard, and after that a call to the camp will do
            it.
          </p>
          <p className="editorial-body mt-4 text-[15px] leading-relaxed text-ds-text-muted">
            Campers are ages 5 to 12 and there are no tryouts. Every camper who shows up plays,
            takes home a shirt, and eats from the same sideline, whether the shirt was ordered in
            advance or not.{" "}
            <Link className="text-ds-accent-bright hover:underline" to="/about">
              More about the camp and its coaches
            </Link>
            .
          </p>
        </Reveal>
      </div>
    </section>
  </MarketingPage>
);

export default RegisterPage;
