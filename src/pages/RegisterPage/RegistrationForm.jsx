/**
 * RegistrationForm — the camp registration card on the landing page.
 *
 * Owns the multi-shirt registration form state, validates it, submits through
 * RegistrationService, and routes to the payment page on success. Built from
 * design-system form primitives; step headers carry a jersey-style number
 * patch to read like a roster sign-up sheet.
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
  Ticket,
} from "lucide-react";
import {
  Card,
  Field,
  Input,
  Select,
  SegmentedControl,
  Button,
  IconButton,
  Alert,
  Separator,
  Eyebrow,
  Text,
} from "@bradley-t-t/sunday-design-system";
import VarsityNumber from "../../components/brand/VarsityNumber";
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
  <div className="mb-5 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <VarsityNumber size="sm">{String(step).padStart(2, "0")}</VarsityNumber>
      <div>
        <Eyebrow strong className="text-ds-accent-bright">
          Step {step}
        </Eyebrow>
        <h3 className="heading-stencil mt-0.5 flex items-center gap-2 text-2xl text-ds-text">
          <Icon className="h-4 w-4 text-ds-text-muted" />
          {title}
        </h3>
      </div>
    </div>
    {aside}
  </div>
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
    <Card variant="elevated" padding="none" className="relative overflow-hidden">
      <span aria-hidden="true" className="accent-edge absolute inset-x-0 top-0 z-10 h-1.5" />

      {submitResult && (
        <div className="p-6 pb-0">
          <Alert tone={submitResult.success ? "positive" : "danger"}>{submitResult.message}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-9 p-6 md:p-9">
        <fieldset>
          <StepHeader step={1} icon={Trophy} title="Camper" />
          <div className="grid gap-4 sm:grid-cols-2">
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
            aside={<Eyebrow className="text-ds-accent-bright">${SHIRT_PRICE} each</Eyebrow>}
          />
          <div className="space-y-3">
            {formData.shirts.map((shirt, index) => (
              <Card key={shirt.id} variant="surface" padding="md" className="relative">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="heading-stencil ds-tabular inline-flex h-6 w-6 items-center justify-center rounded-ds-sm bg-ds-accent-soft text-sm text-ds-accent-bright">
                      {index + 1}
                    </span>
                    <Eyebrow strong>Shirt {index + 1}</Eyebrow>
                  </div>
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
              </Card>
            ))}
          </div>
          <button
            type="button"
            onClick={addShirt}
            className="ds-press mt-3 flex w-full items-center justify-center gap-2 rounded-ds-lg border border-dashed border-ds-border-strong py-3 text-sm font-bold uppercase tracking-[0.06em] text-ds-text-muted transition-colors duration-150 ease-ds-out hover:border-ds-accent hover:text-ds-accent-bright"
          >
            <Plus className="h-4 w-4" /> Add another shirt
          </button>
        </fieldset>

        <fieldset>
          <StepHeader step={3} icon={Users} title="Parent / Guardian" />
          <div className="grid gap-4 sm:grid-cols-2">
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
          <div className="grid gap-4 sm:grid-cols-2">
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
            aside={<Eyebrow>Optional</Eyebrow>}
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

        <Separator />

        {/* Ticket-style total */}
        <div className="relative overflow-hidden rounded-ds-xl border border-ds-accent-soft bg-ds-accent-softer p-5 sm:p-6">
          <span aria-hidden="true" className="accent-edge absolute inset-y-0 left-0 w-1.5" />
          <div className="flex flex-col items-start justify-between gap-4 pl-3 sm:flex-row sm:items-center">
            <div>
              <div className="mb-1.5 inline-flex items-center gap-2">
                <Ticket className="h-3.5 w-3.5 text-ds-accent-bright" />
                <Eyebrow strong className="text-ds-accent-bright">
                  Total Due
                </Eyebrow>
              </div>
              <Text size="sm" tone="muted">
                {formData.shirts.length} shirt{formData.shirts.length !== 1 ? "s" : ""} × ${SHIRT_PRICE} each
              </Text>
            </div>
            <span className="heading-stencil ds-tabular text-5xl tracking-tight text-ds-accent-bright sm:text-6xl">
              ${totalCost}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          loading={submitting}
          className="font-bold uppercase tracking-[0.08em]"
        >
          <ClipboardList className="h-4 w-4" /> Complete Sign-Up
        </Button>
        <Text size="xs" tone="faint" className="text-center uppercase tracking-[0.12em]">
          Payment is collected after sign-up — no payment needed now
        </Text>
      </form>
    </Card>
  );
};

export default RegistrationForm;
