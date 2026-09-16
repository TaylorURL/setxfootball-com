// Long-form legal copy, at reading measure, in one ruled panel.
import MarketingPage from "../../components/layout/MarketingPage";
import LegalPage from "../../components/layout/LegalPage";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import Breadcrumbs from "../../components/seo/Breadcrumbs";
import { CAMP_PHONE, CAMP_EMAIL } from "../../utils/constants";

const PrivacyPage = () => (
  <MarketingPage>
    <Seo {...PAGE_SEO.privacy} />
    <Breadcrumbs label="Privacy Policy" to="/privacy" />
    <LegalPage eyebrow="Legal · Privacy" title="Privacy Policy." updated="March 2026">
      <section>
        <h2>1. Information We Collect</h2>
        <p>
          When you register for SETX Youth Football Camp, we collect personal information including
          but not limited to: your child’s name, age, shirt size preferences, parent/guardian name,
          phone number, email address, emergency contact information, and CashApp payment details.
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
          We do not sell your personal information to third parties. We may share information with
          camp staff, coaches, and volunteers as necessary for camp operations and child safety. We
          may also disclose information if required by law or to protect the safety of campers.
        </p>
      </section>

      <section>
        <h2>4. Data Usage Rights</h2>
        <p>
          By registering for SETX Youth Football Camp, you acknowledge and agree that SETX Youth
          Football Camp and its organizers may collect, store, use, and process any and all data
          submitted through this platform for any lawful purpose, including but not limited to
          analytics, marketing, service improvement, and business operations. This includes the
          right to aggregate, anonymize, and derive insights from your data without limitation.
        </p>
      </section>

      <section>
        <h2>5. Data Security</h2>
        <p>
          We implement reasonable security measures to protect your personal information. However,
          no method of transmission over the Internet or electronic storage is 100% secure. We
          cannot guarantee absolute security of your data.
        </p>
      </section>

      <section>
        <h2>6. Children’s Privacy</h2>
        <p>
          Our services are directed at parents/guardians registering their children for camp. We
          collect children’s information (name, age, shirt size) only as provided by
          parents/guardians for camp registration purposes.
        </p>
      </section>

      <section>
        <h2>7. Cookies and Tracking</h2>
        <p>
          Our website may use cookies and similar tracking technologies to enhance your experience.
          You may disable cookies in your browser settings, though some parts of the site may not
          function properly.
        </p>
      </section>

      <section>
        <h2>8. Changes to This Policy</h2>
        <p>
          We reserve the right to update this privacy policy at any time. Changes will be posted on
          this page with an updated revision date. Continued use of our services after changes
          constitutes acceptance of the updated policy.
        </p>
      </section>

      <section>
        <h2>9. Contact Us</h2>
        <p>
          If you have questions about this privacy policy, please contact us at{" "}
          <a href={`mailto:${CAMP_EMAIL}`}>{CAMP_EMAIL}</a> or call{" "}
          <a href={`tel:${CAMP_PHONE}`}>{CAMP_PHONE}</a>.
        </p>
      </section>
    </LegalPage>
  </MarketingPage>
);

export default PrivacyPage;
