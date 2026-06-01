/**
 * PaymentPage - Post-registration payment instructions page.
 *
 * Shown after a successful registration submission. Displays a registration
 * summary, CashApp payment details, and allows the user to save their
 * CashApp username for payment verification.
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

const SECTION_TRANSITION =
  "background-color 180ms ease, border-color 180ms ease, box-shadow 220ms cubic-bezier(0.23, 1, 0.32, 1)";

const BUTTON_TRANSITION =
  "background-color 200ms ease, transform 140ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 280ms cubic-bezier(0.23, 1, 0.32, 1)";

const SummaryRow = ({ label, value, icon }) => (
  <div className="flex justify-between items-center py-2.5">
    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.14em] flex items-center">
      {icon && <span className="mr-2 text-slate-400">{icon}</span>}
      {label}
    </span>
    <span className="text-sm font-bold text-slate-900 truncate ml-4">
      {value}
    </span>
  </div>
);

const SectionHeader = ({ icon, title, subtitle, iconBg = "bg-primary-500/10" }) => (
  <div className="mb-4">
    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-[0.14em] flex items-center">
      {icon && (
        <span className={`${iconBg} p-2 rounded-lg mr-3`}>{icon}</span>
      )}
      {title}
    </h2>
    {subtitle && <p className="text-slate-500 mt-2 text-xs">{subtitle}</p>}
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
  const [saveError, setSaveError] = useState(null);
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

  const handleSaveCashApp = async () => {
    if (!cashappUsername.trim() || !registration) return;

    setSaving(true);
    setSaveError(null);
    try {
      const { error } = await RegistrationService.updateCashAppUsername(
        registration.id,
        cashappUsername,
        registration.user_id,
      );
      if (error) throw error;
      setSaved(true);
    } catch {
      setSaveError("Failed to save CashApp info. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
    <div className="relative min-h-screen bg-slate-950 py-8 sm:py-14 px-4 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-400/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 right-10 h-[28rem] w-[28rem] bg-accent-500/15 rounded-full blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-32 left-10 h-[24rem] w-[24rem] bg-primary-400/15 rounded-full blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative max-w-2xl mx-auto animate-fade-in-up">
        <Link
          to="/"
          className="inline-flex items-center text-white/70 hover:text-white mb-6 sm:mb-8 text-sm font-medium"
          style={{ transition: "color 180ms ease" }}
        >
          <FaArrowLeft className="mr-2 text-xs" />
          Back to Home
        </Link>

        <div className="rounded-3xl bg-white shadow-[0_30px_60px_-30px_rgba(0,12,26,0.6)] ring-1 ring-white/10 overflow-hidden">
          <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-600 p-7 sm:p-10 text-center">
            <div
              aria-hidden="true"
              className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
            />
            <div className="relative inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl ring-1 ring-white/20 mb-4">
              <FaCheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-[-0.02em] mb-2">
              Registration complete
            </h1>
            <p className="text-emerald-50/90 text-sm">
              Thank you for registering for SETX Football Camp
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-6 bg-slate-50/40">
            <div
              className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
              style={{ transition: SECTION_TRANSITION }}
            >
              <SectionHeader
                icon={<FaChild className="text-primary-600 text-xs" />}
                title="Registration Summary"
              />
              <div className="divide-y divide-slate-100">
                {SUMMARY_FIELDS.map(({ label, key, icon, format }) => (
                  <SummaryRow
                    key={key}
                    label={label}
                    value={
                      format ? format(registration[key]) : registration[key]
                    }
                    icon={icon}
                  />
                ))}
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-accent-200/60 bg-gradient-to-br from-accent-50/60 to-white p-5 sm:p-6 shadow-sm">
              <div
                aria-hidden="true"
                className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-400/60 to-transparent"
              />
              <SectionHeader
                icon={<FaDollarSign className="text-accent-600 text-xs" />}
                title="Payment Required"
                iconBg="bg-accent-500/10"
              />

              <div className="text-center mb-5">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.18em] mb-2">
                  Total Amount Due
                </p>
                <p className="text-5xl sm:text-6xl font-black text-accent-600 tracking-[-0.04em] leading-none">
                  {formatCurrency(totalAmount)}
                </p>
                <p className="text-slate-500 mt-3 text-xs">
                  ${SHIRT_PRICE} per shirt × {registration.shirt_quantity}{" "}
                  shirt(s)
                </p>
              </div>

              <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5 mb-3">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.14em] mb-3 text-center">
                  Send payment via CashApp to
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
                    ${CASHAPP_USERNAME}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    aria-label={
                      copied ? "Copied to clipboard" : "Copy CashApp username"
                    }
                    className={`btn-primary inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold ${
                      copied
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                    style={{ transition: BUTTON_TRANSITION }}
                  >
                    <FaCopy className={copied ? "text-white" : "text-slate-400"} />
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-500 text-center">
                Please include your child's name in the payment note
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
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
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary-500 focus:bg-white disabled:bg-slate-100 disabled:text-slate-400"
                  style={{
                    transition:
                      "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
                  }}
                />
                <button
                  onClick={handleSaveCashApp}
                  disabled={saving || saved || !cashappUsername.trim()}
                  className={`btn-primary inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold text-sm ${
                    saved
                      ? "bg-emerald-500 text-white"
                      : "bg-primary-600 hover:bg-primary-700 text-white disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                  }`}
                  style={{ transition: BUTTON_TRANSITION }}
                >
                  {saving ? "Saving…" : saved ? "Saved!" : "Save"}
                </button>
              </div>

              {saved && (
                <p className="text-emerald-600 text-xs mt-3 flex items-center gap-1.5 font-semibold">
                  <FaCheckCircle />
                  CashApp info saved successfully
                </p>
              )}

              {saveError && (
                <p className="text-red-600 text-xs mt-3 font-semibold">
                  {saveError}
                </p>
              )}
            </div>

            <div className="text-center pt-2">
              <Link
                to="/auth"
                className="btn-primary inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-[0_18px_40px_-12px_rgba(0,40,104,0.4)]"
                style={{ transition: BUTTON_TRANSITION }}
              >
                Create Account to View Dashboard
              </Link>
              <p className="text-slate-500 text-xs mt-3">
                Use the same email to track your registration
              </p>
            </div>
          </div>

          <div className="bg-slate-950 px-6 sm:px-8 py-5 flex items-center justify-center">
            <img
              src={logo}
              alt=""
              className="h-10 w-10 object-contain"
            />
            <div className="ml-3">
              <p className="font-bold text-white text-sm">SETX Football Camp</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-[0.14em] mt-0.5">
                See you at camp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
