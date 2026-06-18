/**
 * RegistrationForm — the camp registration card on the landing page.
 *
 * Owns the multi-shirt registration form state, validates it, submits through
 * RegistrationService, and routes to the payment page on success. Built entirely
 * from design-system form primitives.
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
  Heading,
  Text,
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

const SectionHeading = ({ step, icon: Icon, title, aside }) => (
  <div className="mb-5 flex items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-ds-md bg-ds-accent-soft text-ds-accent-bright">
        <Icon className="h-4 w-4" />
        <span className="absolute -right-1.5 -top-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-ds-accent text-[10px] font-bold text-ds-on-accent">
          {step}
        </span>
      </span>
      <Heading level={3}>{title}</Heading>
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
    <Card variant="elevated" padding="none" className="overflow-hidden">
      {submitResult && (
        <div className="p-6 pb-0">
          <Alert tone={submitResult.success ? "positive" : "danger"}>{submitResult.message}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 p-6 md:p-8">
        <fieldset>
          <SectionHeading step={1} icon={Trophy} title="Camper Information" />
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
            <Field label="Nickname" help="Optional — what should we call them?" className="sm:col-span-2">
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
          <SectionHeading
            icon={Shirt}
            title="Shirts"
            aside={<Eyebrow>${SHIRT_PRICE} each</Eyebrow>}
          />
          <div className="space-y-3">
            {formData.shirts.map((shirt, index) => (
              <Card key={shirt.id} variant="surface" padding="md">
                <div className="mb-3 flex items-center justify-between">
                  <Eyebrow strong>Shirt {index + 1}</Eyebrow>
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
          <Button variant="link" size="sm" className="mt-3 px-0" onClick={addShirt}>
            <Plus className="h-3.5 w-3.5" /> Add another shirt
          </Button>
        </fieldset>

        <fieldset>
          <SectionHeading icon={Users} title="Parent / Guardian" />
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
          <SectionHeading icon={ShieldCheck} title="Emergency Contact" />
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
          <SectionHeading
            icon={DollarSign}
            title="Payment Info"
            aside={<Eyebrow>Optional</Eyebrow>}
          />
          <Field label="CashApp username or email" help="Helps us verify your payment. You can also add this later.">
            <Input
              name="cashappUsername"
              value={formData.cashappUsername}
              onChange={handleInputChange}
              placeholder="$username or email"
            />
          </Field>
        </fieldset>

        <Separator />

        <div className="flex flex-col items-center justify-between gap-4 rounded-ds-lg bg-ds-surface-2 p-5 sm:flex-row">
          <div>
            <Eyebrow strong>Total Due</Eyebrow>
            <Text size="sm" tone="muted" className="mt-1">
              {formData.shirts.length} shirt{formData.shirts.length !== 1 ? "s" : ""} × ${SHIRT_PRICE}
            </Text>
          </div>
          <span className="ds-tabular text-4xl font-bold tracking-tight text-ds-text">${totalCost}</span>
        </div>

        <Button type="submit" variant="primary" size="lg" block loading={submitting}>
          <ClipboardList className="h-4 w-4" /> Complete Registration
        </Button>
      </form>
    </Card>
  );
};

export default RegistrationForm;
