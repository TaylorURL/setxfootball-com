// Presentation only: RegistrationForm owns submission and shirt-order logic.
// The form takes the wide column; the running total and the notes on what
// happens next sit beside it and stay put while the form scrolls.
import MarketingPage from "../../components/layout/MarketingPage";
import Reveal from "../../components/marketing/Reveal";
import SectionIntro from "../../components/marketing/SectionIntro";
import RegistrationForm from "./RegistrationForm";
import { Link } from "react-router-dom";
import { SHIRT_PRICE, CASHAPP_USERNAME, EDIT_WINDOW_DAYS } from "../../utils/constants";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import Breadcrumbs from "../../components/seo/Breadcrumbs";
import { SplitText } from "../../components/reactbits";

const RegisterPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.register} />
    <Breadcrumbs label="Sign Up" to="/register" />
    <section className="relative bg-ds-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-[1160px] px-6 sm:px-10 lg:px-16">
        <Reveal>
          <SectionIntro
            as="h1"
            eyebrow={`Sign Up · $${SHIRT_PRICE} per shirt`}
            title={<SplitText text="Sign your camper up." splitType="words" delay={60} />}
          >
            Fill out the form, choose your shirts, and you&apos;re on the roster. You pay for the
            shirts after, by CashApp, so nothing is due now.
          </SectionIntro>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          <Reveal delay={2}>
            <RegistrationForm />
          </Reveal>

          <Reveal
            delay={3}
            className="space-y-6 lg:sticky lg:top-[calc(var(--header-height)+24px)]"
          >
            <div className="card-flat p-7">
              <h2 className="heading text-[22px] text-ds-text">After you sign up</h2>
              <p className="body-copy mt-3 text-[15px] text-ds-text-muted">
                The form puts your camper on the roster straight away. Payment comes after: $
                {SHIRT_PRICE} for each shirt you ordered, sent by CashApp to{" "}
                <span className="font-bold text-ds-text">${CASHAPP_USERNAME}</span>, and nothing
                else is due at any point. The camp itself is free.
              </p>
              <p className="body-copy mt-3 text-[15px] text-ds-text-muted">
                One entry covers one camper, so a family with more than one child fills the form out
                once per kid and picks a shirt size for each. Sign-ups can be changed for{" "}
                {EDIT_WINDOW_DAYS} days from the dashboard, and after that a call to the camp will
                do it.
              </p>
              <p className="body-copy mt-3 text-[15px] text-ds-text-muted">
                Campers are ages 5 to 12 and there are no tryouts. Every camper who shows up plays,
                takes home a shirt, and eats from the same sideline.{" "}
                <Link className="font-bold text-ds-accent-bright hover:underline" to="/about">
                  More about the camp and its coaches
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  </MarketingPage>
);

export default RegisterPage;
