/**
 * Where a parent lands after the registration form: what they owe, the CashApp
 * handle to send it to, and a field to record the username they paid from.
 *
 * The registration arrives through router state. Reaching this page directly,
 * with no state to read, is an ordinary case rather than an error, so it sends
 * the visitor to the home page rather than reporting a failure. Nothing here
 * marks a payment as received; only a staff member can do that.
 */
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Copy, Check, DollarSign } from "lucide-react";
import { Field, Input, Alert } from "@bradley-t-t/sunday-design-system";
import MarketingPage from "../../components/layout/MarketingPage";
import RegistrationService from "../../services/RegistrationService";
import { CASHAPP_USERNAME, SHIRT_PRICE } from "../../utils/constants";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import { actionClass } from "../../components/ui/actionClass";
import Skeleton, { LoadingRegion } from "../../components/ui/Skeleton";
import { CountUp, SplitText, AnimatedContent } from "../../components/reactbits";

const CLIPBOARD_FEEDBACK_DURATION_MS = 2000;

const SUMMARY_FIELDS = [
  { label: "Camper", key: "kid_name" },
  { label: "Age", key: "age" },
  { label: "Shirt Size", key: "shirt_size" },
  { label: "Quantity", key: "shirt_quantity", format: (value) => `${value} shirt(s)` },
  { label: "Parent", key: "parent_name" },
];

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 border-t border-ds-border py-3.5">
    <span className="body-copy text-[15px] text-ds-text-muted">{label}</span>
    <span className="text-right text-[15px] font-bold text-ds-text">{value}</span>
  </div>
);

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [cashappUsername, setCashappUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [copied, setCopied] = useState(false);
  const copyResetRef = useRef(null);

  // The copy confirmation is on a timer, and a visitor who leaves within its two
  // seconds takes the component with them. Holding the handle is what lets the
  // pending reset be cancelled rather than firing into an unmounted tree.
  useEffect(() => () => clearTimeout(copyResetRef.current), []);

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
    clearTimeout(copyResetRef.current);
    copyResetRef.current = setTimeout(() => setCopied(false), CLIPBOARD_FEEDBACK_DURATION_MS);
  };

  if (!registration) {
    return (
      <MarketingPage>
        <div className="py-16 sm:py-20">
          <LoadingRegion
            label="Loading your sign-up"
            className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10"
          >
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="mt-6 h-16 w-full sm:h-20" />
            <Skeleton className="mt-5 h-6 w-3/4" />
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="card-flat p-7">
                <Skeleton className="h-4 w-36" />
                {SUMMARY_FIELDS.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-center justify-between gap-4 border-t border-ds-border py-4"
                  >
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
              <div className="card-flat p-7">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-4 h-20 w-40 sm:h-24" />
                <Skeleton className="mt-3 h-4 w-48" />
              </div>
            </div>
          </LoadingRegion>
        </div>
      </MarketingPage>
    );
  }

  const totalAmount = registration.total_cost || registration.shirt_quantity * SHIRT_PRICE;

  return (
    <MarketingPage>
      <Seo {...PAGE_SEO.payment} />
      <div className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 lg:px-10">
          <Link
            to="/"
            className="label-caps inline-flex min-h-control items-center gap-2 text-ds-text-muted hover:text-ds-text"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to Home
          </Link>

          <div className="mt-6">
            <span className="inline-flex items-center gap-2 rounded-ds-sm border-rule border-ds-border-strong bg-ds-positive px-3.5 py-1.5 text-ds-on-accent">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span className="label-caps">You’re on the roster</span>
            </span>
            <h1 className="display mt-6 text-4xl text-ds-text sm:text-5xl lg:text-6xl">
              <SplitText text="Sign-up complete." splitType="words" delay={70} />
            </h1>
            <p className="body-copy mt-5 max-w-xl text-lg text-ds-text-muted">
              Thanks for signing up for SETX Football Camp. See you on the field.
            </p>
          </div>

          <AnimatedContent as="div" className="mt-10 space-y-6" distance={40} duration={0.7}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start">
              <section className="card p-7">
                <span className="label-caps text-ds-accent-bright">Sign-Up Summary</span>
                <div className="mt-4">
                  {SUMMARY_FIELDS.map(({ label, key, format }) => (
                    <SummaryRow
                      key={key}
                      label={label}
                      value={format ? format(registration[key]) : registration[key]}
                    />
                  ))}
                </div>
              </section>

              <section className="rounded-ds-lg border-rule border-ds-border-strong bg-ds-accent p-7 text-ds-on-accent shadow-hard">
                <span className="label-caps">Total Due</span>
                <CountUp
                  as="p"
                  to={totalAmount}
                  prefix="$"
                  duration={1.4}
                  className="numeral mt-3 text-[4.5rem] sm:text-[5.5rem]"
                />
                <p className="body-copy mt-2 text-sm">
                  ${SHIRT_PRICE} per shirt × {registration.shirt_quantity} shirt
                  {registration.shirt_quantity !== 1 ? "s" : ""}
                </p>

                <div
                  data-surface="paper"
                  className="mt-6 rounded-ds-md border-rule border-ds-border-strong bg-ds-bg-elevated p-5 text-ds-text"
                >
                  <span className="label-caps text-ds-text-muted">Send payment via CashApp to</span>
                  <div className="mt-3 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <span className="numeral text-4xl text-ds-text">${CASHAPP_USERNAME}</span>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      aria-label={copied ? "Copied to Clipboard" : "Copy CashApp Username"}
                      className={actionClass({ tone: "outline", size: "sm" })}
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <p className="body-copy mt-4 text-sm">
                  Include your child&apos;s name in the payment note.
                </p>
              </section>
            </div>

            <section className="card-flat p-7">
              <span className="label-caps text-ds-accent-bright">Your CashApp Info</span>
              <p className="body-copy mt-3 text-[15px] text-ds-text-muted">
                Add your CashApp username or email so we can match your payment to your sign-up.
              </p>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
                <Field
                  label="CashApp Username or Email"
                  className="flex-1"
                  error={saveError ?? undefined}
                >
                  <Input
                    value={cashappUsername}
                    onChange={(event) => setCashappUsername(event.target.value)}
                    placeholder="$username or email"
                    leading={<DollarSign />}
                    autoComplete="off"
                    aria-invalid={saveError ? true : undefined}
                    disabled={saved}
                  />
                </Field>
                <button
                  type="button"
                  onClick={handleSaveCashApp}
                  disabled={saved || !cashappUsername.trim() || saving}
                  aria-busy={saving}
                  className={actionClass({ tone: "navy" })}
                >
                  {saving ? "Saving…" : saved ? "Saved" : "Save"}
                </button>
              </div>

              <div role="status" aria-live="polite">
                {saved && (
                  <Alert tone="positive" className="mt-5">
                    CashApp info saved.
                  </Alert>
                )}
              </div>
            </section>

            <div className="text-center">
              <Link to="/auth" className={actionClass({ tone: "outline", size: "lg" })}>
                Create an Account to Track Sign-Ups
              </Link>
              <p className="body-copy mt-4 text-sm text-ds-text-faint">
                Use the same email to track your registration.
              </p>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </MarketingPage>
  );
};

export default PaymentPage;
