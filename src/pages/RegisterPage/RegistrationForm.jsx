/**
 * RegistrationForm — the camp registration form on the public sign-up page.
 *
 * Owns the multi-shirt registration form state, validates it, submits through
 * RegistrationService, and routes to the payment page on success. Editorial
 * register: hairline-bordered sections, hanging mono step numerals, sharp
 * corners, technical microcopy. Functional behavior is unchanged.
 */
import { useState } from "react";
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
  Button,
  IconButton,
  Alert,
} from "@bradley-t-t/sunday-design-system";
import RegistrationService from "../../services/RegistrationService";
import { SHIRT_SIZES, SHIRT_PRICE, EMERGENCY_RELATIONS } from "../../utils/constants";
import { encodeShirtOrders } from "../../utils/shirtOrders";

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
  <header className="mb-8 flex items-end justify-between gap-4 border-b border-ds-border pb-5">
    <div className="flex items-end gap-5">
      <span className="editorial-display mono-num text-5xl leading-none text-ds-accent-bright sm:text-6xl">
        {String(step).padStart(2, "0")}
      </span>
      <div className="pb-1">
        <span className="mono-tag-sm text-ds-text-faint">Step {step}</span>
        <h3 className="editorial-display mt-2 flex items-center gap-2.5 text-2xl text-ds-text sm:text-3xl">
          <Icon className="h-4 w-4 text-ds-text-muted" />
          {title}
        </h3>
      </div>
    </div>
    {aside && <div className="pb-2">{aside}</div>}
  </header>
);

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(buildFormReset);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

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

  const updateShirt = (id, field, value) =>
    setFormData((prev) => ({
      ...prev,
      shirts: prev.shirts.map((shirt) =>
        shirt.id === id ? { ...shirt, [field]: value } : shirt,
      ),
    }));

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.shirts.some((shirt) => !shirt.size)) {
      setSubmitResult({ success: false, message: "Please select a size for every shirt." });
      return;
    }

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
      navigate("/payment", { state: { registration } });
    } catch (error) {
      setSubmitResult({
        success: false,
        message: "Registration failed. Please try again or contact us directly.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative border border-ds-border bg-ds-surface">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 z-10 h-px bg-ds-accent" />

      {submitResult && (
        <div className="p-7 pb-0">
          <Alert tone={submitResult.success ? "positive" : "danger"}>{submitResult.message}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-14 p-7 md:p-10 lg:p-12">
        <fieldset>
          <StepHeader step={1} icon={Trophy} title="Camper" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" required>
              <Input
                name="kidName"
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
                min="5"
                max="12"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="5–12"
                required
              />
            </Field>
            <Field label="Nickname" help="Optional — what should we call them on the field?" className="sm:col-span-2">
              <Input
                name="nickname"
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
            aside={<span className="mono-tag text-ds-accent-bright">${SHIRT_PRICE} each</span>}
          />
          <div className="space-y-3">
            {formData.shirts.map((shirt, index) => (
              <div key={shirt.id} className="relative border border-ds-border bg-ds-bg p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="mono-tag inline-flex items-center gap-3 text-ds-text">
                    <span className="mono-num text-ds-accent-bright">
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                    Shirt {index + 1}
                  </span>
                  {formData.shirts.length > 1 && (
                    <IconButton
                      label={`Remove shirt ${index + 1}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => removeShirt(shirt.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Size">
                    <Select
                      value={shirt.size}
                      onValueChange={(value) => updateShirt(shirt.id, "size", value)}
                      placeholder="Select size"
                      options={SHIRT_SIZES.map((size) => ({ value: size, label: size }))}
                    />
                  </Field>
                  <Field label="For">
                    <SegmentedControl
                      className="w-full"
                      value={shirt.type}
                      onValueChange={(value) => updateShirt(shirt.id, "type", value)}
                      options={SHIRT_TYPES}
                    />
                  </Field>
                  <Field label="Recipient name" className="sm:col-span-2">
                    <Input
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
          </div>
          <button
            type="button"
            onClick={addShirt}
            className="mono-tag mt-3 flex w-full items-center justify-center gap-2 border border-dashed border-ds-border-strong bg-ds-bg py-4 text-ds-text-muted transition-colors duration-200 hover:border-ds-accent hover:text-ds-accent-bright"
          >
            <Plus className="h-4 w-4" /> Add another shirt
          </button>
        </fieldset>

        <fieldset>
          <StepHeader step={3} icon={Users} title="Parent / Guardian" />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full Name" required>
              <Input
                name="parentName"
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
                value={formData.parentPhone}
                onChange={handleInputChange}
                placeholder="(555) 555-5555"
                leading={<Phone />}
                required
              />
            </Field>
            <Field label="Email" required className="sm:col-span-2">
              <Input
                name="parentEmail"
                type="email"
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
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                placeholder="(555) 555-5555"
                leading={<Phone />}
                required
              />
            </Field>
            <Field label="Relationship" required className="sm:col-span-2">
              <Select
                value={formData.emergencyRelation}
                onValueChange={(value) => setField("emergencyRelation", value)}
                placeholder="Select relationship"
                options={EMERGENCY_RELATIONS.map((relation) => ({ value: relation, label: relation }))}
              />
            </Field>
          </div>
        </fieldset>

        <fieldset>
          <StepHeader
            step={5}
            icon={DollarSign}
            title="Payment Info"
            aside={<span className="mono-tag-sm text-ds-text-faint">Optional</span>}
          />
          <Field
            label="CashApp username or email"
            help="Helps us match your payment. You can also add it after registering."
          >
            <Input
              name="cashappUsername"
              value={formData.cashappUsername}
              onChange={handleInputChange}
              placeholder="$username or email"
            />
          </Field>
        </fieldset>

        {/* Editorial total */}
        <div className="relative overflow-hidden border border-ds-accent bg-ds-accent-softer">
          <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-ds-accent" />
          <div className="flex flex-col items-start justify-between gap-5 px-7 py-7 sm:flex-row sm:items-end">
            <div>
              <span className="mono-tag text-ds-accent-bright">Total Due</span>
              <p className="editorial-body mt-3 text-sm text-ds-text-muted">
                {formData.shirts.length} shirt{formData.shirts.length !== 1 ? "s" : ""} × ${SHIRT_PRICE} each
              </p>
            </div>
            <span className="editorial-display mono-num text-6xl text-ds-accent-bright sm:text-7xl">
              ${totalCost}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mono-tag flex w-full items-center justify-center gap-2 border border-ds-accent bg-ds-accent px-6 py-5 text-white transition-colors duration-200 hover:bg-ds-accent-bright hover:border-ds-accent-bright disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ClipboardList className="h-4 w-4" />
          {submitting ? "Submitting…" : "Complete Sign-Up"}
        </button>
        <p className="mono-tag-sm text-center text-ds-text-faint">
          Payment is collected after sign-up — no payment needed now
        </p>

        {/* Hidden DS button for keyboard a11y / form lifecycle parity */}
        <Button type="submit" variant="primary" className="sr-only" loading={submitting}>
          Submit
        </Button>
      </form>
    </div>
  );
};

export default RegistrationForm;
