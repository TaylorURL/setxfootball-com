/**
 * A parent's own sign-ups: what they registered, what they owe, and whether the
 * camp has marked it paid.
 *
 * Registrations are found by the signed-in address rather than by user id, so a
 * parent who registered without an account still sees their sign-up once they
 * create one with the same email. Editing is open for `EDIT_WINDOW_DAYS` after
 * a sign-up is created; `RegistrationService.canEdit` decides that, so this page
 * shows or hides the controls and does not measure the window itself.
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Trophy,
  Shirt,
  Users,
  ShieldCheck,
  DollarSign,
  Clock,
  CheckCircle2,
  Pencil,
  Trash2,
  Save,
  X,
  Inbox,
  ArrowRight,
} from "lucide-react";
import {
  Field,
  Input,
  Select,
  Alert,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@bradley-t-t/sunday-design-system";
import DashboardShell from "../../components/layout/DashboardShell";
import Seo from "../../components/seo/Seo";
import { PAGE_SEO } from "../../components/seo/seoContent";
import { useAuth } from "../../context/AuthContext";
import RegistrationService from "../../services/RegistrationService";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { SHIRT_SIZES, SHIRT_PRICE, EMERGENCY_RELATIONS } from "../../utils/constants";
import { actionClass } from "../../components/ui/actionClass";
import Skeleton, { LoadingRegion } from "../../components/ui/Skeleton";
import { SplitText, SpotlightCard } from "../../components/reactbits";

const QUANTITY_OPTIONS = [1, 2, 3, 4, 5].map((num) => ({
  value: String(num),
  label: `${num} shirt(s)`,
}));
const SIZE_OPTIONS = SHIRT_SIZES.map((size) => ({ value: size, label: size }));
const RELATION_OPTIONS = EMERGENCY_RELATIONS.map((relation) => ({
  value: relation,
  label: relation,
}));

// A card whose values have not arrived. The shape is the same either way, which
// is the point: the reader is looking at the card that is about to fill in
// rather than at a stand-in for one.
const AWAITED = {};

const InfoGroup = ({ icon: Icon, title, children }) => (
  <div className="rounded-ds-md border-rule border-ds-border-strong bg-ds-bg p-4">
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-ds-accent-bright" aria-hidden="true" />
      <span className="label-caps text-ds-accent-bright">{title}</span>
    </div>
    <div className="mt-3 space-y-2">{children}</div>
  </div>
);

/**
 * One row of the card. The label is known before the request answers, so only
 * the value waits, inside the same line box, so nothing moves when it lands.
 */
const ReadRow = ({ label, value, loading, width = "w-24" }) => (
  <p className="text-sm text-ds-text-muted">
    <span className="text-ds-text-faint">{label}: </span>
    {loading ? (
      <Skeleton as="span" className={`inline-block h-[0.7em] align-middle ${width}`} />
    ) : (
      <span className="text-ds-text">{value}</span>
    )}
  </p>
);

const StatusPill = ({ paid, loading }) =>
  loading ? (
    <Skeleton className="h-[30px] w-[92px]" />
  ) : (
    <span
      className={`label-caps inline-flex items-center gap-2 rounded-ds-sm border-rule border-ds-border-strong px-3 py-1.5 ${
        paid ? "bg-ds-positive text-ds-on-accent" : "bg-ds-gold text-ds-on-gold"
      }`}
    >
      {paid ? "Paid" : "Pending"}
    </span>
  );

const CardHeader = ({
  reg,
  loading,
  isEditing,
  editForm,
  canEdit,
  saving,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}) => (
  <div className="relative flex flex-col gap-5 rounded-t-[20px] border-b-rule border-ds-border-strong bg-ds-bg-recessed p-6 sm:flex-row sm:items-end sm:justify-between">
    <div className="pb-1">
      <span className="label-caps text-ds-text-muted">Camper</span>
      <h3 className="display mt-2 text-2xl text-ds-text sm:text-3xl">
        {loading ? (
          <Skeleton as="span" className="inline-block h-[0.7em] w-48 align-middle" />
        ) : isEditing ? (
          editForm.kid_name
        ) : (
          reg.kid_name
        )}
      </h3>
      <span className="body-copy mt-2 inline-block text-sm text-ds-text-faint">
        Signed up{" "}
        {loading ? (
          <Skeleton as="span" className="inline-block h-[0.7em] w-28 align-middle" />
        ) : (
          formatDate(reg.created_at)
        )}
      </span>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill paid={reg.payment_status === "paid"} loading={loading} />
      {loading ? (
        <>
          <Skeleton className="h-control w-[86px]" />
          <Skeleton className="h-control w-[104px]" />
        </>
      ) : isEditing ? (
        <>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            aria-busy={saving}
            className={actionClass({ size: "sm" })}
          >
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={actionClass({ tone: "outline", size: "sm" })}
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" /> Cancel
          </button>
        </>
      ) : (
        <>
          {canEdit && (
            <button
              type="button"
              onClick={onEdit}
              className={actionClass({ tone: "outline", size: "sm" })}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className={actionClass({ tone: "danger", size: "sm" })}
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
          </button>
        </>
      )}
    </div>
  </div>
);

/**
 * The registration card in every state it has: waiting, read, and being edited.
 * One component rather than three, so the waiting card is the read card with its
 * values not in yet.
 *
 * @param {object} props
 * @param {object} props.reg - The registration, or `AWAITED` while it loads.
 * @param {boolean} [props.loading=false] - Render the card with its values pending.
 */
const RegistrationCard = ({
  reg,
  loading = false,
  isEditing,
  editForm,
  saving,
  onSave,
  onCancel,
  onEdit,
  onDelete,
  onEditChange,
  onEditField,
}) => {
  const canEdit = !loading && RegistrationService.canEdit(reg);
  const daysRemaining = loading ? 0 : RegistrationService.getDaysRemaining(reg);

  return (
    <SpotlightCard as="article" className="card overflow-hidden" size={420}>
      <CardHeader
        reg={reg}
        loading={loading}
        isEditing={isEditing}
        editForm={editForm}
        canEdit={canEdit}
        saving={saving}
        onSave={onSave}
        onCancel={onCancel}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      {/* One alert shape across all three states, icon included, so the block
          below it does not move once the window is known. */}
      <div className="px-6 pt-5">
        <Alert
          tone={loading || canEdit ? "warning" : "neutral"}
          icon={<Clock className="h-4 w-4" aria-hidden="true" />}
        >
          {loading ? (
            <Skeleton as="span" className="inline-block h-[0.7em] w-56 align-middle" />
          ) : canEdit ? (
            `Edit window: ${daysRemaining} more day${daysRemaining !== 1 ? "s" : ""}`
          ) : (
            "Edit window expired. Contact us for changes."
          )}
        </Alert>
      </div>

      <div className="grid grid-cols-1 gap-x-10 gap-y-8 p-6 md:grid-cols-2 lg:grid-cols-3">
        <InfoGroup icon={Trophy} title="Camper">
          {isEditing ? (
            <div className="space-y-3">
              <Field label="Name">
                <Input
                  name="kid_name"
                  autoComplete="off"
                  value={editForm.kid_name}
                  onChange={onEditChange}
                />
              </Field>
              <Field label="Age">
                <Input
                  name="age"
                  type="number"
                  autoComplete="off"
                  min="5"
                  max="12"
                  value={editForm.age}
                  onChange={onEditChange}
                />
              </Field>
              <Field label="Nickname">
                <Input
                  name="nickname"
                  autoComplete="off"
                  value={editForm.nickname}
                  onChange={onEditChange}
                  placeholder="Optional"
                />
              </Field>
            </div>
          ) : (
            <>
              <ReadRow label="Age" value={reg.age} loading={loading} width="w-8" />
              <ReadRow
                label="Nickname"
                value={reg.nickname || "None"}
                loading={loading}
                width="w-20"
              />
            </>
          )}
        </InfoGroup>

        <InfoGroup icon={Shirt} title="Shirt Order">
          {isEditing ? (
            <div className="space-y-3">
              <Field label="Size">
                <Select
                  value={editForm.shirt_size}
                  onValueChange={(value) => onEditField("shirt_size", value)}
                  options={SIZE_OPTIONS}
                />
              </Field>
              <Field label="Quantity">
                <Select
                  value={String(editForm.shirt_quantity)}
                  onValueChange={(value) => onEditField("shirt_quantity", value)}
                  options={QUANTITY_OPTIONS}
                />
              </Field>
            </div>
          ) : (
            <>
              <ReadRow label="Size" value={reg.shirt_size} loading={loading} width="w-20" />
              <ReadRow label="Quantity" value={reg.shirt_quantity} loading={loading} width="w-6" />
              <ReadRow
                label="Total"
                value={formatCurrency(reg.total_cost || 0)}
                loading={loading}
                width="w-12"
              />
            </>
          )}
        </InfoGroup>

        <InfoGroup icon={Users} title="Parent / Guardian">
          {isEditing ? (
            <div className="space-y-3">
              <Field label="Name">
                <Input
                  name="parent_name"
                  autoComplete="name"
                  value={editForm.parent_name}
                  onChange={onEditChange}
                />
              </Field>
              <Field label="Phone">
                <Input
                  name="parent_phone"
                  type="tel"
                  autoComplete="tel"
                  value={editForm.parent_phone}
                  onChange={onEditChange}
                />
              </Field>
            </div>
          ) : (
            <>
              <ReadRow label="Name" value={reg.parent_name} loading={loading} width="w-28" />
              <ReadRow label="Phone" value={reg.parent_phone} loading={loading} width="w-24" />
              <ReadRow label="Email" value={reg.parent_email} loading={loading} width="w-32" />
            </>
          )}
        </InfoGroup>

        <InfoGroup icon={ShieldCheck} title="Emergency Contact">
          {isEditing ? (
            <div className="space-y-3">
              <Field label="Name">
                <Input
                  name="emergency_name"
                  autoComplete="off"
                  value={editForm.emergency_name}
                  onChange={onEditChange}
                />
              </Field>
              <Field label="Phone">
                <Input
                  name="emergency_phone"
                  type="tel"
                  autoComplete="off"
                  value={editForm.emergency_phone}
                  onChange={onEditChange}
                />
              </Field>
              <Field label="Relationship">
                <Select
                  value={editForm.emergency_relation}
                  onValueChange={(value) => onEditField("emergency_relation", value)}
                  options={RELATION_OPTIONS}
                />
              </Field>
            </div>
          ) : (
            <>
              <ReadRow label="Name" value={reg.emergency_name} loading={loading} width="w-28" />
              <ReadRow label="Phone" value={reg.emergency_phone} loading={loading} width="w-24" />
              <ReadRow
                label="Relation"
                value={reg.emergency_relation}
                loading={loading}
                width="w-20"
              />
            </>
          )}
        </InfoGroup>

        <InfoGroup icon={DollarSign} title="CashApp Info">
          {isEditing ? (
            <Field label="CashApp Username or Email">
              <Input
                name="cashapp_username"
                value={editForm.cashapp_username}
                onChange={onEditChange}
                placeholder="$username or email"
                autoComplete="off"
              />
            </Field>
          ) : loading ? (
            <p className="text-sm text-ds-text-muted">
              <Skeleton as="span" className="inline-block h-[0.7em] w-28 align-middle" />
            </p>
          ) : reg.cashapp_username ? (
            <p className="inline-flex items-center gap-2 text-sm text-ds-positive">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> {reg.cashapp_username}
            </p>
          ) : (
            <p className="text-sm text-ds-text-faint">Not provided</p>
          )}
        </InfoGroup>

        <InfoGroup icon={Clock} title="Season Info">
          <ReadRow label="Season" value={reg.camp_year} loading={loading} width="w-10" />
          <ReadRow
            label="Signed Up"
            value={loading ? "" : formatDate(reg.created_at)}
            loading={loading}
            width="w-28"
          />
        </InfoGroup>
      </div>
    </SpotlightCard>
  );
};

const DashboardHeader = () => (
  <header>
    <span className="eyebrow">
      <Trophy className="h-3.5 w-3.5" aria-hidden="true" /> My Roster
    </span>
    <h1 className="display mt-6 text-4xl text-ds-text sm:text-5xl lg:text-6xl">
      <SplitText text="My Dashboard." splitType="chars" delay={35} />
    </h1>
    <p className="body-copy mt-4 max-w-measure text-lg text-ds-text-muted">
      View and manage your camp sign-ups.
    </p>
  </header>
);

const EmptyDashboard = () => (
  <div className="mt-10 rounded-ds-lg border-rule border-dashed border-ds-border-strong bg-ds-bg-elevated p-12 text-center">
    <Inbox className="mx-auto h-7 w-7 text-ds-text-faint" aria-hidden="true" />
    <h2 className="display mt-5 text-3xl text-ds-text">Nothing on your roster</h2>
    <p className="body-copy mx-auto mt-3 max-w-md text-ds-text-muted">
      Sign a camper up and they are on the roster straight away. Shirt orders and payment status
      show here once they are.
    </p>
    <Link to="/register" className={actionClass({ className: "mt-7" })}>
      Sign Up Now <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
    </Link>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadRegistrations();
    // loadRegistrations is redeclared every render, so listing it as a dep would
    // refetch on every render. This load is meant to happen once, at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRegistrations = async () => {
    try {
      const { data } = await RegistrationService.getRegistrationsByEmail(user.email);
      setRegistrations(data || []);
    } catch {
      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (registration) => {
    setEditingId(registration.id);
    setEditForm({
      kid_name: registration.kid_name,
      age: registration.age,
      nickname: registration.nickname || "",
      shirt_size: registration.shirt_size,
      shirt_quantity: registration.shirt_quantity,
      parent_name: registration.parent_name,
      parent_phone: registration.parent_phone,
      emergency_name: registration.emergency_name,
      emergency_phone: registration.emergency_phone,
      emergency_relation: registration.emergency_relation,
      cashapp_username: registration.cashapp_username || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const setEditField = (name, value) => setEditForm((prev) => ({ ...prev, [name]: value }));

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const updates = {
        kid_name: editForm.kid_name,
        age: parseInt(editForm.age),
        nickname: editForm.nickname || null,
        shirt_size: editForm.shirt_size,
        shirt_quantity: parseInt(editForm.shirt_quantity),
        total_cost: parseInt(editForm.shirt_quantity) * SHIRT_PRICE,
        parent_name: editForm.parent_name,
        parent_phone: editForm.parent_phone,
        emergency_name: editForm.emergency_name,
        emergency_phone: editForm.emergency_phone,
        emergency_relation: editForm.emergency_relation,
        cashapp_username: editForm.cashapp_username || null,
      };
      const { error: updateError } = await RegistrationService.updateRegistration(id, updates);
      if (updateError) throw updateError;
      await loadRegistrations();
      cancelEditing();
    } catch {
      setError("Failed to update registration");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const { error: deleteError } = await RegistrationService.deleteRegistration(id);
      if (deleteError) throw deleteError;
      setConfirmDelete(null);
      await loadRegistrations();
    } catch {
      setError("Failed to delete registration");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <DashboardShell active="dashboard">
      <Seo {...PAGE_SEO.dashboard} />
      <div className="mx-auto w-full max-w-[1160px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <DashboardHeader />

        <div role="status" aria-live="polite">
          {error && (
            <Alert tone="danger" className="mt-6" onDismiss={() => setError("")}>
              {error}
            </Alert>
          )}
        </div>

        {loading ? (
          <LoadingRegion label="Loading your sign-ups" className="mt-10">
            <RegistrationCard reg={AWAITED} loading />
          </LoadingRegion>
        ) : registrations.length === 0 ? (
          <EmptyDashboard />
        ) : (
          <div className="animate-fade-in-up mt-10 space-y-8">
            {registrations.map((reg) => (
              <RegistrationCard
                key={reg.id}
                reg={reg}
                isEditing={editingId === reg.id}
                editForm={editForm}
                saving={saving}
                onSave={() => saveEdit(reg.id)}
                onCancel={cancelEditing}
                onEdit={() => startEditing(reg)}
                onDelete={() => setConfirmDelete(reg)}
                onEditChange={handleEditChange}
                onEditField={setEditField}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={Boolean(confirmDelete)}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
      >
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete sign-up?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the sign-up for{" "}
              <span className="font-semibold text-ds-text">{confirmDelete?.kid_name}</span>? This
              can’t be undone. If you’ve already paid, contact us for a refund.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" className="control" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              className="control"
              loading={deleting}
              onClick={() => handleDelete(confirmDelete.id)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
};

export default Dashboard;
