/**
 * The sign-up form: camper, shirt orders, parent, emergency contact, payment.
 *
 * No account is required. The form writes the registration and forwards to the
 * payment page with the new row in router state.
 *
 * Shirt rows are the one part the browser cannot validate on its own: a size is
 * chosen through the design system's Select rather than a required `select`
 * element, so an unsized shirt is caught on submit, reported next to the field
 * it belongs to, and given focus.
 */
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Shirt,
  Users,
  ShieldCheck,
  DollarSign,
  Phone,
  Mail,
  Plus,
  Trash2,
  ClipboardList,
} from "lucide-react";
import {
  Field,
  Input,
  Select,
  SegmentedControl,
  IconButton,
  Alert,
} from "@bradley-t-t/sunday-design-system";
import RegistrationService from "../../services/RegistrationService";
import { SHIRT_SIZES, SHIRT_PRICE, EMERGENCY_RELATIONS } from "../../utils/constants";
import { encodeShirtOrders } from "../../utils/shirtOrders";
import { actionClass } from "../../components/ui/actionClass";

const SHIRT_TYPES = [
  { value: "camper", label: "Camper" },
  { value: "family", label: "Family" },
];

const buildFormReset = () => ({
  kidName: "",
  age: "",
  nickname: "",
  shirts: [{ size: "", recipient: "", type: "camper", id: 1 }],
  parentName: "",
  parentPhone: "",
  parentEmail: "",
  emergencyName: "",
  emergencyPhone: "",
  emergencyRelation: "",
  cashappUsername: "",
});

const StepHeader = ({ step, icon: Icon, title, aside }) => (
  <header className="mb-6 flex items-center justify-between gap-4">
    <div className="flex items-center gap-4">
      <span
        aria-hidden="true"
        className="numeral inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-ds-md border-rule border-ds-border-strong bg-ds-accent text-3xl text-ds-on-accent shadow-hard-sm"
      >
        {step}
      </span>
      <h2 className="display flex items-center gap-3 text-2xl text-ds-text sm:text-3xl">
        <span className="sr-only">Step {step}: </span>
        {title}
        <Icon className="h-5 w-5 text-ds-text-faint" aria-hidden="true" />
      </h2>
    </div>
    {aside && <div>{aside}</div>}
  </header>
);

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(buildFormReset);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [missingSizes, setMissingSizes] = useState([]);
  const shirtRefs = useRef({});

  const totalCost = formData.shirts.length * SHIRT_PRICE;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const setField = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  const addShirt = () =>
    setFormData((prev) => ({
      ...prev,
      shirts: [...prev.shirts, { size: "", recipient: "", type: "camper", id: Date.now() }],
    }));

  const removeShirt = (id) =>
    setFormData((prev) =>
      prev.shirts.length <= 1
        ? prev
        : { ...prev, shirts: prev.shirts.filter((shirt) => shirt.id !== id) },
    );

  const updateShirt = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      shirts: prev.shirts.map((shirt) => (shirt.id === id ? { ...shirt, [field]: value } : shirt)),
    }));
    if (field === "size" && value) {
      setMissingSizes((prev) => prev.filter((shirtId) => shirtId !== id));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const unsized = formData.shirts.filter((shirt) => !shirt.size).map((shirt) => shirt.id);
    if (unsized.length > 0) {
      setMissingSizes(unsized);
      setSubmitResult({
        success: false,
        message: `Choose a size for shirt ${unsized.length > 1 ? "numbers" : "number"} ${formData.shirts
          .map((shirt, index) => (unsized.includes(shirt.id) ? index + 1 : null))
          .filter(Boolean)
          .join(", ")} before signing up.`,
      });
      // Scrolling to the field is not the same as landing on it: without the
      // focus move a keyboard is still parked on the submit button.
      const firstUnsized = shirtRefs.current[unsized[0]];
      if (firstUnsized) {
        firstUnsized.scrollIntoView({ behavior: "smooth", block: "center" });
        firstUnsized
          .querySelector(
            "[data-size-field] button, [data-size-field] select, [data-size-field] input",
          )
          ?.focus({ preventScroll: true });
      }
      return;
    }

    setMissingSizes([]);
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const { data: registration, error } = await RegistrationService.createRegistration({
        ...formData,
        shirtSize: encodeShirtOrders(formData.shirts, formData.kidName),
        shirtQuantity: formData.shirts.length,
      });
      if (error) throw error;

      setFormData(buildFormReset());
      setMissingSizes([]);
      navigate("/payment", { state: { registration } });
    } catch {
      setSubmitResult({
        success: false,
        message: "Registration failed. Please try again or contact us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card relative">
      {/* A live region, so the outcome is announced rather than only painted. */}
      <div role="status" aria-live="polite" className={submitResult ? "p-7 pb-0" : undefined}>
        {submitResult && (
          <Alert tone={submitResult.success ? "positive" : "danger"}>{submitResult.message}</Alert>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-12 p-6 sm:p-8 lg:p-10">
        <fieldset>
          <StepHeader step={1} icon={Trophy} title="Camper" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" required>
              <Input
                name="kidName"
                autoComplete="off"
                value={formData.kidName}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </Field>
            <Field label="Age" required>
              <Input
                name="age"
                type="number"
                autoComplete="off"
                min="5"
                max="12"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="5 to 12"
                required
              />
            </Field>
            <Field
              label="Nickname"
              help="Optional: what should we call them on the field?"
              className="sm:col-span-2"
            >
              <Input
                name="nickname"
                autoComplete="off"
                value={formData.nickname}
                onChange={handleInputChange}
                placeholder="Nickname"
              />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <StepHeader
            step={2}
            icon={Shirt}
            title="Shirts"
            aside={<span className="label-caps text-ds-accent-bright">${SHIRT_PRICE} each</span>}
          />
          <div className="space-y-3">
            {formData.shirts.map((shirt, index) => (
              <div
                key={shirt.id}
                ref={(node) => {
                  shirtRefs.current[shirt.id] = node;
                }}
                className="relative rounded-ds-md border-rule border-ds-border-strong bg-ds-bg p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-[15px] font-bold text-ds-text">Shirt {index + 1}</span>
                  {formData.shirts.length > 1 && (
                    <IconButton
                      label={`Remove Shirt ${index + 1}`}
                      variant="ghost"
                      size="sm"
                      className="control"
                      onClick={() => removeShirt(shirt.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div data-size-field>
                    <Field
                      label="Size"
                      required
                      error={missingSizes.includes(shirt.id) ? "Pick a shirt size." : undefined}
                    >
                      <Select
                        value={shirt.size}
                        onValueChange={(value) => updateShirt(shirt.id, "size", value)}
                        placeholder="Select size"
                        aria-invalid={missingSizes.includes(shirt.id) || undefined}
                        options={SHIRT_SIZES.map((size) => ({ value: size, label: size }))}
                      />
                    </Field>
                  </div>
                  <div
                    role="group"
                    aria-label={`Who Shirt ${index + 1} Is For`}
                    className="flex flex-col gap-2"
                  >
                    <span className="label-caps inline-flex items-center gap-1 text-ds-text">
                      For
                    </span>
                    <SegmentedControl
                      className="w-full"
                      value={shirt.type}
                      onValueChange={(value) => updateShirt(shirt.id, "type", value)}
                      options={SHIRT_TYPES}
                    />
                  </div>
                  <Field label="Recipient Name" className="sm:col-span-2">
                    <Input
                      autoComplete="off"
                      value={shirt.recipient}
                      onChange={(event) => updateShirt(shirt.id, "recipient", event.target.value)}
                      placeholder={
                        shirt.type === "camper"
                          ? `Camper name (default: ${formData.kidName || "registered kid"})`
                          : "Family member name"
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addShirt}
              className={actionClass({ tone: "dashed", size: "lg", block: true })}
            >
              <Plus className="h-4 w-4" aria-hidden="true" /> Add Another Shirt
            </button>
          </div>
        </fieldset>

        <fieldset>
          <StepHeader step={3} icon={Users} title="Parent / Guardian" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" required>
              <Input
                name="parentName"
                autoComplete="name"
                value={formData.parentName}
                onChange={handleInputChange}
                placeholder="Parent / guardian name"
                required
              />
            </Field>
            <Field label="Phone" required>
              <Input
                name="parentPhone"
                type="tel"
                autoComplete="tel"
                value={formData.parentPhone}
                onChange={handleInputChange}
                leading={<Phone />}
                required
              />
            </Field>
            <Field label="Email" required className="sm:col-span-2">
              <Input
                name="parentEmail"
                type="email"
                autoComplete="email"
                value={formData.parentEmail}
                onChange={handleInputChange}
                placeholder="email@example.com"
                leading={<Mail />}
                required
              />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <StepHeader step={4} icon={ShieldCheck} title="Emergency Contact" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" required>
              <Input
                name="emergencyName"
                autoComplete="off"
                value={formData.emergencyName}
                onChange={handleInputChange}
                placeholder="Emergency contact name"
                required
              />
            </Field>
            <Field label="Phone" required>
              <Input
                name="emergencyPhone"
                type="tel"
                autoComplete="off"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                leading={<Phone />}
                required
              />
            </Field>
            <Field label="Relationship" required className="sm:col-span-2">
              <Select
                value={formData.emergencyRelation}
                onValueChange={(value) => setField("emergencyRelation", value)}
                placeholder="Select relationship"
                options={EMERGENCY_RELATIONS.map((relation) => ({
                  value: relation,
                  label: relation,
                }))}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <StepHeader
            step={5}
            icon={DollarSign}
            title="Payment Info"
            aside={<span className="label-caps text-ds-text-faint">Optional</span>}
          />
          <Field
            label="CashApp Username or Email"
            help="Helps us match your payment. You can also add it after registering."
          >
            <Input
              name="cashappUsername"
              autoComplete="off"
              value={formData.cashappUsername}
              onChange={handleInputChange}
              placeholder="$username or email"
            />
          </Field>
        </fieldset>

        <div className="rounded-ds-lg border-rule border-ds-border-strong bg-ds-gold text-ds-on-gold shadow-hard">
          <div className="flex flex-col items-start justify-between gap-4 px-7 py-6 sm:flex-row sm:items-end">
            <div>
              <span className="label-caps">Total Due</span>
              <p className="body-copy mt-2 text-sm">
                {formData.shirts.length} shirt{formData.shirts.length !== 1 ? "s" : ""} × $
                {SHIRT_PRICE} each, paid by CashApp after sign-up
              </p>
            </div>
            <span className="numeral text-5xl sm:text-6xl">${totalCost}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className={actionClass({ size: "lg", block: true })}
        >
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
          {submitting ? "Submitting…" : "Complete Sign-Up"}
        </button>
        <p className="body-copy text-center text-sm text-ds-text-faint">
          You pay for the shirts after sign-up, so there is nothing to pay now.
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;
