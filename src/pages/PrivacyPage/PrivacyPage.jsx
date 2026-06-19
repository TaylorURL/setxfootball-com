/**
 * PrivacyPage — Privacy Policy for SETX Football Camp.
 * @module pages/PrivacyPage
 */
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import {
  Container,
  Section,
  Card,
  Button,
  Prose,
  Eyebrow,
} from "@bradley-t-t/sunday-design-system";
import MarketingPage from "../../components/layout/MarketingPage";

const PrivacyPage = () => (
  <MarketingPage>
    <Section space="lg">
      <Container size="md">
        <Button asChild variant="ghost" size="sm" className="mb-6 px-0">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <Card variant="elevated" padding="lg" className="relative overflow-hidden">
          <span aria-hidden="true" className="accent-edge absolute inset-x-0 top-0 h-1.5" />
          <div className="mb-8 flex items-center gap-4 border-b border-ds-border pb-8">
            <span className="brand-chip-shadow inline-flex h-14 w-14 items-center justify-center rounded-ds-lg bg-ds-accent text-white ring-1 ring-white/15">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <Eyebrow strong className="text-ds-accent-bright">
                Legal
              </Eyebrow>
              <h1 className="heading-stencil heading-stencil-tight mt-1 text-4xl text-ds-text sm:text-5xl">
                Privacy Policy
              </h1>
              <Eyebrow className="mt-1.5">Last updated · March 2026</Eyebrow>
            </div>
          </div>

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
        </Card>
      </Container>
    </Section>
  </MarketingPage>
);

export default PrivacyPage;
