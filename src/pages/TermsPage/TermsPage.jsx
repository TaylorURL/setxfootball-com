// Paper register, same as the Privacy page — long-form legal copy is unpleasant
// on the dark surface.
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Prose } from "@bradley-t-t/sunday-design-system";
import MarketingPage from "../../components/layout/MarketingPage";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import { ShinyText, FadeContent } from "../../components/reactbits";

const TermsPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.terms} />
    <section data-surface="light" className="bg-ds-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10">
        <Link
          to="/"
          className="mono-tag-sm inline-flex items-center gap-2 text-ds-text-muted transition-colors hover:text-ds-text"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Home
        </Link>

        <header className="mt-10 border-b border-ds-border pb-10">
          <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
            <span aria-hidden="true" className="accent-tick is-on w-10" />
            <ShinyText text="Legal · Terms" speed={5} />
          </span>
          <h1 className="editorial-display editorial-display-tight mt-5 text-5xl text-ds-text sm:text-6xl lg:text-7xl">
            Terms of<br />
            <span className="text-ds-accent-bright">Service.</span>
          </h1>
          <p className="mono-tag-sm mt-5 text-ds-text-faint">
            Last updated · March 2026
          </p>
        </header>

        <FadeContent as="article" className="mt-12" blur>
          <Prose>
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using the SETX Youth Football Camp website and registering for our camp, you agree
                to be bound by these Terms of Service. If you do not agree to these terms, please do not use our
                services.
              </p>
            </section>

            <section>
              <h2>2. Camp Registration</h2>
              <p>
                Registration is available for children ages 5-12. Parents/guardians must complete the registration
                form with accurate information. All registrations are subject to availability and may be refused at
                our discretion.
              </p>
            </section>

            <section>
              <h2>3. Payment</h2>
              <p>
                Camp shirts are priced at $5 each. Payment is expected via CashApp. Registration does not guarantee a
                spot until payment is confirmed. We reserve the right to modify pricing for future camp sessions.
              </p>
            </section>

            <section>
              <h2>4. Assumption of Risk</h2>
              <p>
                Football is a physical sport that carries inherent risks of injury. By registering your child, you
                acknowledge and accept these risks. SETX Youth Football Camp, its organizers, coaches, volunteers,
                and sponsors are not liable for any injuries that may occur during camp activities.
              </p>
            </section>

            <section>
              <h2>5. Code of Conduct</h2>
              <p>
                All campers are expected to demonstrate good sportsmanship, respect for coaches and fellow campers,
                and follow all safety rules. We reserve the right to dismiss any camper whose behavior is disruptive
                or unsafe, without refund.
              </p>
            </section>

            <section>
              <h2>6. Data Usage and Consent</h2>
              <p>
                By using this website and submitting any information through our registration forms, you grant SETX
                Youth Football Camp and its respective affiliates, partners, and successors a non-exclusive,
                perpetual, irrevocable, royalty-free, worldwide license to collect, store, use, process, analyze,
                transfer, and otherwise handle any and all data and information submitted for any lawful purpose.
              </p>
              <p>
                This includes, without limitation, the right to use such data for camp operations, marketing,
                analytics, product development, research, business intelligence, and any other commercial or
                non-commercial purpose. Data may be aggregated, anonymized, or used in derivative works.
              </p>
            </section>

            <section>
              <h2>7. Photography and Media</h2>
              <p>
                By registering for camp, you consent to the photographing and/or recording of your child during camp
                activities. These images may be used for promotional purposes, social media, and future marketing
                materials.
              </p>
            </section>

            <section>
              <h2>8. Medical Authorization</h2>
              <p>
                In the event of a medical emergency, camp staff are authorized to seek emergency medical treatment for
                your child. Parents/guardians are responsible for informing camp staff of any medical conditions,
                allergies, or medications.
              </p>
            </section>

            <section>
              <h2>9. Limitation of Liability</h2>
              <p>
                SETX Youth Football Camp, its organizers, coaches, volunteers, and sponsors shall not be held liable
                for any direct, indirect, incidental, or consequential damages arising from participation in camp
                activities or use of this website.
              </p>
            </section>

            <section>
              <h2>10. Modifications</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of our website and services
                constitutes acceptance of any modifications. It is your responsibility to review these terms
                periodically.
              </p>
            </section>

            <section>
              <h2>11. Contact</h2>
              <p>
                For questions regarding these terms, please contact us at{" "}
                <a href="mailto:hanksclayton81@gmail.com">hanksclayton81@gmail.com</a> or call 936-641-0681.
              </p>
            </section>
          </Prose>
        </FadeContent>
      </div>
    </section>
  </MarketingPage>
);

export default TermsPage;
