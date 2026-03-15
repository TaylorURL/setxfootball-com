/**
 * TermsPage - Terms of Service page for SETX Football Camp.
 * @module pages/TermsPage
 */
import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaFileContract } from "react-icons/fa";
import logo from "../../assets/logo.PNG";

const TermsPage = () => (
  <div className="min-h-screen bg-slate-50">
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="SETX Football Camp"
              className="h-9 w-9 object-contain"
            />
            <span className="ml-3 text-lg font-semibold text-slate-900">
              SETX Football
            </span>
          </Link>
        </div>
      </div>
    </nav>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        to="/"
        className="inline-flex items-center text-slate-400 hover:text-slate-600 transition-all text-sm font-medium mb-8"
      >
        <FaArrowLeft className="mr-2 h-3 w-3" /> Back to Home
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6 sm:p-10">
        <div className="flex items-center mb-8">
          <div className="bg-primary-500/10 p-3 rounded-xl mr-4">
            <FaFileContract className="text-primary-600 h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Last updated: March 2026
            </p>
          </div>
        </div>

        <div className="prose prose-slate prose-sm max-w-none space-y-6 text-slate-600 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the SETX Youth Football Camp website and
              registering for our camp, you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use our
              services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              2. Camp Registration
            </h2>
            <p>
              Registration is available for children ages 5-12.
              Parents/guardians must complete the registration form with
              accurate information. All registrations are subject to
              availability and may be refused at our discretion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              3. Payment
            </h2>
            <p>
              Camp shirts are priced at $5 each. Payment is expected via
              CashApp. Registration does not guarantee a spot until payment is
              confirmed. We reserve the right to modify pricing for future camp
              sessions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              4. Assumption of Risk
            </h2>
            <p>
              Football is a physical sport that carries inherent risks of
              injury. By registering your child, you acknowledge and accept
              these risks. SETX Youth Football Camp, its organizers, coaches,
              volunteers, and sponsors are not liable for any injuries that may
              occur during camp activities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              5. Code of Conduct
            </h2>
            <p>
              All campers are expected to demonstrate good sportsmanship,
              respect for coaches and fellow campers, and follow all safety
              rules. We reserve the right to dismiss any camper whose behavior
              is disruptive or unsafe, without refund.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              6. Data Usage and Consent
            </h2>
            <p>
              By using this website and submitting any information through our
              registration forms, you grant SETX Youth Football Camp, TaylorURL,
              and their respective affiliates, partners, and successors a
              non-exclusive, perpetual, irrevocable, royalty-free, worldwide
              license to collect, store, use, process, analyze, transfer, and
              otherwise handle any and all data and information submitted for
              any lawful purpose.
            </p>
            <p>
              This includes, without limitation, the right to use such data for
              camp operations, marketing, analytics, product development,
              research, business intelligence, and any other commercial or
              non-commercial purpose. Data may be aggregated, anonymized, or
              used in derivative works.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              7. Photography and Media
            </h2>
            <p>
              By registering for camp, you consent to the photographing and/or
              recording of your child during camp activities. These images may
              be used for promotional purposes, social media, and future
              marketing materials.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              8. Medical Authorization
            </h2>
            <p>
              In the event of a medical emergency, camp staff are authorized to
              seek emergency medical treatment for your child. Parents/guardians
              are responsible for informing camp staff of any medical
              conditions, allergies, or medications.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              9. Limitation of Liability
            </h2>
            <p>
              SETX Youth Football Camp, its organizers, coaches, volunteers, and
              sponsors shall not be held liable for any direct, indirect,
              incidental, or consequential damages arising from participation in
              camp activities or use of this website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              10. Modifications
            </h2>
            <p>
              We reserve the right to modify these terms at any time. Continued
              use of our website and services constitutes acceptance of any
              modifications. It is your responsibility to review these terms
              periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">
              11. Contact
            </h2>
            <p>
              For questions regarding these terms, please contact us at{" "}
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

export default TermsPage;
