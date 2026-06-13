/**
 * PaymentPage — post-registration payment instructions.
 *
 * Shown after a successful registration submit. Surfaces a registration
 * summary, CashApp payment details, and a field to save the payer's CashApp
 * handle. Built from design-system primitives.
 */
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Copy, Check, DollarSign } from "lucide-react";
import {
  Container,
  Card,
  Field,
  Input,
  Button,
  Alert,
  Separator,
  Spinner,
  Heading,
  Text,
  Eyebrow,
} from "@bradley-t-t/sunday-design-system";
import RegistrationService from "../../services/RegistrationService";
import { formatCurrency } from "../../utils/helpers";
import { CASHAPP_USERNAME, SHIRT_PRICE } from "../../utils/constants";

const CLIPBOARD_FEEDBACK_DURATION_MS = 2000;

const SUMMARY_FIELDS = [
  { label: "Camper Name", key: "kid_name" },
  { label: "Age", key: "age" },
  { label: "Shirt Size", key: "shirt_size" },
  { label: "Quantity", key: "shirt_quantity", format: (value) => `${value} shirt(s)` },
  { label: "Parent", key: "parent_name" },
];

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 py-2.5">
    <Eyebrow>{label}</Eyebrow>
    <Text size="sm" weight="semibold" truncate className="text-right">
      {value}
    </Text>
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
      <div className="flex min-h-[100dvh] items-center justify-center bg-ds-bg">
        <Spinner size="xl" className="text-ds-accent-bright" />
      </div>
    );
  }

  const totalAmount = registration.total_cost || registration.shirt_quantity * SHIRT_PRICE;

  return (
    <div className="min-h-[100dvh] bg-ds-bg py-10 sm:py-14">
      <Container size="sm">
        <Button asChild variant="ghost" size="sm" className="mb-6 px-0">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </Button>

        <div className="space-y-6">
          <Card variant="elevated" padding="lg" className="text-center">
            <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-ds-full bg-ds-positive-soft text-ds-positive">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <Heading level="display">Registration complete</Heading>
            <Text tone="muted" className="mt-2">
              Thank you for registering for SETX Football Camp
            </Text>
          </Card>

          <Card variant="surface" padding="lg">
            <Eyebrow strong className="mb-1">
              Registration Summary
            </Eyebrow>
            <div className="mt-2 divide-y divide-ds-border">
              {SUMMARY_FIELDS.map(({ label, key, format }) => (
                <SummaryRow
                  key={key}
                  label={label}
                  value={format ? format(registration[key]) : registration[key]}
                />
              ))}
            </div>
          </Card>

          <Card variant="accent" padding="lg" className="text-center">
            <Eyebrow strong className="text-ds-accent-bright">
              Total Amount Due
            </Eyebrow>
            <p className="ds-tabular mt-2 text-5xl font-black tracking-tight text-ds-accent-bright sm:text-6xl">
              {formatCurrency(totalAmount)}
            </p>
            <Text size="sm" tone="muted" className="mt-3">
              ${SHIRT_PRICE} per shirt × {registration.shirt_quantity} shirt(s)
            </Text>

            <div className="mt-5 rounded-ds-lg border border-ds-border-strong bg-ds-bg-elevated p-5">
              <Eyebrow className="mb-3">Send payment via CashApp to</Eyebrow>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <span className="text-2xl font-black tracking-tight text-ds-positive sm:text-3xl">
                  ${CASHAPP_USERNAME}
                </span>
                <Button
                  variant={copied ? "primary" : "secondary"}
                  size="sm"
                  onClick={copyToClipboard}
                  aria-label={copied ? "Copied to clipboard" : "Copy CashApp username"}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
            <Text size="xs" tone="muted" className="mt-3">
              Please include your child's name in the payment note
            </Text>
          </Card>

          <Card variant="surface" padding="lg">
            <Eyebrow strong className="mb-1">
              Your CashApp Info
            </Eyebrow>
            <Text size="sm" tone="muted" className="mb-4">
              Provide your CashApp username or email so we can verify your payment
            </Text>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Field label="CashApp username or email" className="flex-1">
                <Input
                  value={cashappUsername}
                  onChange={(event) => setCashappUsername(event.target.value)}
                  placeholder="$username or email"
                  leading={<DollarSign />}
                  disabled={saved}
                />
              </Field>
              <Button
                variant={saved ? "primary" : "primary"}
                size="lg"
                className="sm:mt-[1.625rem]"
                loading={saving}
                disabled={saved || !cashappUsername.trim()}
                onClick={handleSaveCashApp}
              >
                {saved ? "Saved!" : "Save"}
              </Button>
            </div>

            {saved && (
              <Alert tone="positive" className="mt-4">
                CashApp info saved successfully
              </Alert>
            )}
            {saveError && (
              <Alert tone="danger" className="mt-4">
                {saveError}
              </Alert>
            )}
          </Card>

          <div className="text-center">
            <Button asChild variant="secondary" size="lg">
              <Link to="/auth">Create Account to View Dashboard</Link>
            </Button>
            <Text size="xs" tone="faint" className="mt-3">
              Use the same email to track your registration
            </Text>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PaymentPage;
