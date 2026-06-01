/**
 * PrivacyPage - Privacy Policy page for SETX Football Camp.
 * @module pages/PrivacyPage
 */
import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaShieldAlt } from "react-icons/fa";
import logo from "../../assets/logo.PNG";

const PrivacyPage = () => (
  <div className="min-h-screen bg-slate-50">
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link to="/" className="flex items-center group">
            <img
              src={logo}
              alt=""
              className="h-9 w-9 object-contain group-hover:scale-105"
              style={{
                transition: "transform 220ms cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            />
            <div className="ml-3">
              <span className="block text-base font-bold text-slate-900 tracking-tight">
                SETX Football
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Youth Camp
              </span>
            </div>
          </Link>
        </div>
      </div>
    </nav>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <Link
        to="/"
        className="inline-flex items-center text-slate-500 hover:text-slate-900 text-sm font-medium mb-8"
        style={{ transition: "color 180ms ease" }}
      >
        <FaArrowLeft className="mr-2 h-3 w-3" /> Back to Home
      </Link>

      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-[0_30px_60px_-30px_rgba(0,12,26,0.18)] p-6 sm:p-10 animate-fade-in-up">
        <div className="flex items-center mb-8 pb-8 border-b border-slate-100">
          <div className="bg-primary-500/10 ring-4 ring-primary-500/10 p-3.5 rounded-2xl mr-4">
            <FaShieldAlt className="text-primary-600 h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-[-0.02em]">
              Privacy Policy
            </h1>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 mt-1.5">
              Last updated · March 2026
            </p>
          </div>
        </div>

        <div className="prose prose-slate prose-sm max-w-none space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you register for SETX Youth Football Camp, we collect
              personal information including but not limited to: your child's
              name, age, shirt size preferences, parent/guardian name, phone
              number, email address, emergency contact information, and CashApp
              payment details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              2. How We Use Your Information
            </h2>
            <p>We use the information collected to:</p>
            <ul className="list-disc ml-6 space-y-1 mt-2">
              <li>Process and manage camp registrations</li>
              <li>Communicate with parents/guardians about camp details</li>
              <li>
                Ensure the safety of all campers through emergency contact
                information
              </li>
              <li>Process and verify payments</li>
              <li>Improve our camp programs and services</li>
              <li>
                Send updates about future camp events and related activities
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              3. Data Sharing and Disclosure
            </h2>
            <p>
              We do not sell your personal information to third parties. We may
              share information with camp staff, coaches, and volunteers as
              necessary for camp operations and child safety. We may also
              disclose information if required by law or to protect the safety
              of campers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              4. Data Usage Rights
            </h2>
            <p>
              By registering for SETX Youth Football Camp, you acknowledge and
              agree that SETX Youth Football Camp and its organizers may
              collect, store, use, and process any and all data submitted
              through this platform for any lawful purpose, including but not
              limited to analytics, marketing, service improvement, and
              business operations. This includes the right to aggregate,
              anonymize, and derive insights from your data without
              limitation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              5. Data Security
            </h2>
            <p>
              We implement reasonable security measures to protect your personal
              information. However, no method of transmission over the Internet
              or electronic storage is 100% secure. We cannot guarantee absolute
              security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              6. Children's Privacy
            </h2>
            <p>
              Our services are directed at parents/guardians registering their
              children for camp. We collect children's information (name, age,
              shirt size) only as provided by parents/guardians for camp
              registration purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              7. Cookies and Tracking
            </h2>
            <p>
              Our website may use cookies and similar tracking technologies to
              enhance your experience. You may disable cookies in your browser
              settings, though some features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              8. Changes to This Policy
            </h2>
            <p>
              We reserve the right to update this privacy policy at any time.
              Changes will be posted on this page with an updated revision date.
              Continued use of our services after changes constitutes acceptance
              of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              9. Contact Us
            </h2>
            <p>
              If you have questions about this privacy policy, please contact us
              at{" "}
              <a
                href="mailto:hanksclayton81@gmail.com"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                hanksclayton81@gmail.com
              </a>{" "}
              or call 936-641-0681.
            </p>
          </section>
        </div>
      </div>
    </div>
  </div>
);

export default PrivacyPage;
