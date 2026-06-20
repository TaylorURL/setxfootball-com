/**
 * PrivacyPage — Privacy Policy for SETX Football Camp.
 *
 * Editorial article layout: large left-aligned title, a mono "Legal" eyebrow,
 * and prose rendered inside a hairline article frame.
 * @module pages/PrivacyPage
 */
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Prose } from "@bradley-t-t/sunday-design-system";
import MarketingPage from "../../components/layout/MarketingPage";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";

const PrivacyPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.privacy} />
    <section className="bg-ds-bg py-16 sm:py-20 lg:py-24">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-8 lg:px-10">
        <Link
          to="/"
          className="mono-tag-sm inline-flex items-center gap-2 text-ds-text-muted hover:text-ds-text"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Home
        </Link>

        <header className="mt-10 border-b border-ds-border pb-10">
          <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
            <span aria-hidden="true" className="inline-block h-px w-10 bg-ds-accent" />
            Legal · Privacy
          </span>
          <h1 className="editorial-display editorial-display-tight mt-5 text-5xl text-ds-text sm:text-6xl lg:text-7xl">
            Privacy<br />
            <span className="text-ds-accent-bright">Policy.</span>
          </h1>
          <p className="mono-tag-sm mt-5 text-ds-text-faint">
            Last updated · March 2026
          </p>
        </header>

        <article className="prose prose-invert mt-12">
          <Prose>
            <section>
              <h2>1. Information We Collect</h2>
              <p>
                When you register for SETX Youth Football Camp, we collect personal information including but not
                limited to: your child's name, age, shirt size preferences, parent/guardian name, phone number,
                email address, emergency contact information, and CashApp payment details.
              </p>
            </section>

            <section>
              <h2>2. How We Use Your Information</h2>
              <p>We use the information collected to:</p>
              <ul>
                <li>Process and manage camp registrations</li>
                <li>Communicate with parents/guardians about camp details</li>
                <li>Ensure the safety of all campers through emergency contact information</li>
                <li>Process and verify payments</li>
                <li>Improve our camp programs and services</li>
                <li>Send updates about future camp events and related activities</li>
              </ul>
            </section>

            <section>
              <h2>3. Data Sharing and Disclosure</h2>
              <p>
                We do not sell your personal information to third parties. We may share information with camp staff,
                coaches, and volunteers as necessary for camp operations and child safety. We may also disclose
                information if required by law or to protect the safety of campers.
              </p>
            </section>

            <section>
              <h2>4. Data Usage Rights</h2>
              <p>
                By registering for SETX Youth Football Camp, you acknowledge and agree that SETX Youth Football Camp
                and its organizers may collect, store, use, and process any and all data submitted through this
                platform for any lawful purpose, including but not limited to analytics, marketing, service
                improvement, and business operations. This includes the right to aggregate, anonymize, and derive
                insights from your data without limitation.
              </p>
            </section>

            <section>
              <h2>5. Data Security</h2>
              <p>
                We implement reasonable security measures to protect your personal information. However, no method of
                transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute
                security of your data.
              </p>
            </section>

            <section>
              <h2>6. Children's Privacy</h2>
              <p>
                Our services are directed at parents/guardians registering their children for camp. We collect
                children's information (name, age, shirt size) only as provided by parents/guardians for camp
                registration purposes.
              </p>
            </section>

            <section>
              <h2>7. Cookies and Tracking</h2>
              <p>
                Our website may use cookies and similar tracking technologies to enhance your experience. You may
                disable cookies in your browser settings, though some features may not function properly.
              </p>
            </section>

            <section>
              <h2>8. Changes to This Policy</h2>
              <p>
                We reserve the right to update this privacy policy at any time. Changes will be posted on this page
                with an updated revision date. Continued use of our services after changes constitutes acceptance of
                the updated policy.
              </p>
            </section>

            <section>
              <h2>9. Contact Us</h2>
              <p>
                If you have questions about this privacy policy, please contact us at{" "}
                <a href="mailto:hanksclayton81@gmail.com">hanksclayton81@gmail.com</a> or call 936-641-0681.
              </p>
            </section>
          </Prose>
        </article>
      </div>
    </section>
  </MarketingPage>
);

export default PrivacyPage;
