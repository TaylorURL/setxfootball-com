/**
 * PaymentPage - Post-registration payment instructions page.
 *
 * Shown after a successful registration submission. Displays a registration
 * summary, CashApp payment details, and allows the user to save their
 * CashApp username for payment verification. Expects registration data
 * to be passed via React Router location state.
 *
 * @module pages/PaymentPage
 * @returns {React.ReactElement} The rendered payment instructions page
 */
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import RegistrationService from "../../services/RegistrationService";
import { formatCurrency } from "../../utils/helpers";
import { CASHAPP_USERNAME, SHIRT_PRICE } from "../../utils/constants";
import logo from "../../assets/logo.PNG";
import {
  FaCheckCircle,
  FaDollarSign,
  FaArrowLeft,
  FaCopy,
  FaChild,
  FaTshirt,
  FaUser,
} from "react-icons/fa";

const CLIPBOARD_FEEDBACK_DURATION_MS = 2000;

/** Reusable label/value row for the registration summary card */
const SummaryRow = ({ label, value, icon }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center">
      {icon && <span className="mr-1.5 text-slate-400">{icon}</span>}
      {label}
    </span>
    <span className="text-sm font-semibold text-slate-900 truncate ml-4">
      {value}
    </span>
  </div>
);

/** Section header with icon badge and uppercase title */
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide flex items-center">
      {icon && (
        <span className="bg-primary-500/10 p-2 rounded-lg mr-3">{icon}</span>
      )}
      {title}
    </h2>
    {subtitle && <p className="text-slate-400 mt-1.5 text-xs">{subtitle}</p>}
  </div>
);

const SUMMARY_FIELDS = [
  { label: "Camper Name", key: "kid_name" },
  { label: "Age", key: "age" },
  { label: "Shirt Size", key: "shirt_size", icon: <FaTshirt /> },
  {
    label: "Quantity",
    key: "shirt_quantity",
    format: (value) => `${value} shirt(s)`,
  },
  { label: "Parent", key: "parent_name", icon: <FaUser /> },
];

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [cashappUsername, setCashappUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const regData = location.state?.registration;
    if (!regData) {
      navigate("/");
      return;
    }
    setRegistration(regData);
    setCashappUsername(regData.cashapp_username || "");
  }, [location.state, navigate]);

  /** Saves the user's CashApp username to the registration record for payment verification */
  const handleSaveCashApp = async () => {
    if (!cashappUsername.trim() || !registration) return;

    setSaving(true);
    try {
      const { error } = await RegistrationService.updateCashAppUsername(
        registration.id,
        cashappUsername,
        registration.user_id,
      );
      if (error) throw error;
      setSaved(true);
    } catch {
      // NOTE: silent catch — user sees the button revert to unsaved state
    } finally {
      setSaving(false);
    }
  };

  /** Copies the camp's CashApp username to the clipboard and shows a brief confirmation */
  const copyToClipboard = () => {
    navigator.clipboard.writeText(CASHAPP_USERNAME);
    setCopied(true);
    setTimeout(() => setCopied(false), CLIPBOARD_FEEDBACK_DURATION_MS);
  };

  if (!registration) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600/30 border-t-primary-600" />
      </div>
    );
  }

  const totalAmount =
    registration.total_cost || registration.shirt_quantity * SHIRT_PRICE;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 py-6 sm:py-12 px-4">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-primary-500" />

      <div className="absolute top-10 right-20 w-72 h-72 bg-accent-400 rounded-full filter blur-3xl opacity-10 hidden sm:block" />
      <div className="absolute bottom-10 left-20 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-5 hidden sm:block" />

      <div className="max-w-2xl mx-auto relative animate-fade-in">
        <Link
          to="/"
          className="inline-flex items-center text-white/70 hover:text-white mb-4 sm:mb-8 transition-all duration-200 text-sm font-medium"
        >
          <FaArrowLeft className="mr-2 text-xs" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Success banner */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 sm:p-8 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FaCheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">
              Registration Complete!
            </h1>
            <p className="text-emerald-100 text-sm">
              Thank you for registering for SETX Football Camp
            </p>
          </div>

          <div className="p-5 sm:p-8">
            {/* Registration summary */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6 mb-6">
              <SectionHeader
                icon={<FaChild className="text-primary-600 text-sm" />}
                title="Registration Summary"
              />
              <div className="space-y-3">
                {SUMMARY_FIELDS.map(({ label, key, icon, format }, index) => (
                  <React.Fragment key={key}>
                    {index > 0 && <div className="border-t border-slate-100" />}
                    <SummaryRow
                      label={label}
                      value={
                        format ? format(registration[key]) : registration[key]
                      }
                      icon={icon}
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Payment section */}
            <div className="rounded-2xl border border-accent-200 bg-gradient-to-br from-accent-50/50 to-accent-50 shadow-sm p-4 sm:p-6 mb-6">
              <SectionHeader
                icon={<FaDollarSign className="text-accent-600 text-sm" />}
                title="Payment Required"
              />

              <div className="text-center mb-5">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  Total Amount Due
                </p>
                <p className="text-4xl sm:text-5xl font-black text-accent-600 tracking-tight">
                  {formatCurrency(totalAmount)}
                </p>
                <p className="text-slate-400 mt-2 text-xs">
                  ${SHIRT_PRICE} per shirt x {registration.shirt_quantity}{" "}
                  shirt(s)
                </p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-4 mb-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2.5 text-center">
                  Send payment via CashApp to
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                    ${CASHAPP_USERNAME}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    aria-label={
                      copied ? "Copied to clipboard" : "Copy CashApp username"
                    }
                    className="flex items-center bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold text-slate-700 hover:scale-[1.01]"
                  >
                    <FaCopy className="mr-1.5 text-slate-400" />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center">
                Please include your child's name in the payment note
              </p>
            </div>

            {/* CashApp info section */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-6 mb-6">
              <SectionHeader
                title="Your CashApp Info"
                subtitle="Provide your CashApp username or email so we can verify your payment"
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <label className="sr-only" htmlFor="cashapp-username">
                  CashApp username or email
                </label>
                <input
                  id="cashapp-username"
                  type="text"
                  value={cashappUsername}
                  onChange={(e) => setCashappUsername(e.target.value)}
                  placeholder="$username or email"
                  disabled={saved}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/10 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400 transition-all duration-200"
                />
                <button
                  onClick={handleSaveCashApp}
                  disabled={saving || saved || !cashappUsername.trim()}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.01] ${
                    saved
                      ? "bg-emerald-500 text-white"
                      : "bg-primary-600 text-white hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                  }`}
                >
                  {saving ? "Saving..." : saved ? "Saved!" : "Save"}
                </button>
              </div>

              {saved && (
                <p className="text-emerald-600 text-xs mt-3 flex items-center font-medium">
                  <FaCheckCircle className="mr-1.5" />
                  CashApp info saved successfully!
                </p>
              )}
            </div>

            {/* CTA */}
            <div className="text-center pt-2">
              <Link
                to="/auth"
                className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.01]"
              >
                Create Account to View Dashboard
              </Link>
              <p className="text-slate-400 text-xs mt-3">
                Create an account using the same email to track your
                registration
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-5 sm:px-8 py-4 sm:py-5 border-t border-slate-100">
            <div className="flex items-center justify-center">
              <img
                src={logo}
                alt="SETX Football Camp"
                className="h-10 w-10 sm:h-11 sm:w-11 object-contain"
              />
              <div className="ml-3">
                <p className="font-semibold text-slate-900 text-sm">
                  SETX Football Camp
                </p>
                <p className="text-xs text-slate-400">See you at camp!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
