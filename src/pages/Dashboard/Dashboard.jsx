/**
 * Dashboard — authenticated user view for managing camp registrations.
 *
 * Editorial register: large display title with mono eyebrow; each registration
 * renders as a hairline-bordered "season card" with a hanging mono index and
 * sharp-edge field cells. Inline editing and deletion within the edit window
 * are preserved end-to-end.
 *
 * @module pages/Dashboard
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
  Spinner,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from "@bradley-t-t/sunday-design-system";
import DashboardShell from "../../components/layout/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import RegistrationService from "../../services/RegistrationService";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { SHIRT_SIZES, SHIRT_PRICE, EMERGENCY_RELATIONS } from "../../utils/constants";

const QUANTITY_OPTIONS = [1, 2, 3, 4, 5].map((num) => ({ value: String(num), label: `${num} shirt(s)` }));
const SIZE_OPTIONS = SHIRT_SIZES.map((size) => ({ value: size, label: size }));
const RELATION_OPTIONS = EMERGENCY_RELATIONS.map((relation) => ({ value: relation, label: relation }));

const InfoGroup = ({ icon: Icon, title, children }) => (
  <div className="left-rule-accent pl-4">
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-ds-accent-bright" />
      <span className="mono-tag-sm text-ds-text-faint">{title}</span>
    </div>
    <div className="mt-3 space-y-1.5">{children}</div>
  </div>
);

const ReadRow = ({ label, value }) => (
  <p className="text-sm text-ds-text-muted">
    <span className="text-ds-text-faint">{label}: </span>
    <span className="text-ds-text">{value}</span>
  </p>
);

const StatusPill = ({ paid }) => (
  <span
    className={`mono-tag-sm inline-flex items-center gap-2 border px-3 py-1.5 ${
      paid
        ? "border-ds-positive/40 bg-ds-positive-soft text-ds-positive"
        : "border-ds-warning/40 bg-ds-warning-soft text-ds-warning"
    }`}
  >
    <span className={`h-1.5 w-1.5 rounded-full ${paid ? "bg-ds-positive" : "bg-ds-warning"}`} />
    {paid ? "Paid" : "Pending"}
  </span>
);

const ActionButton = ({ onClick, tone = "secondary", icon: Icon, children, loading }) => {
  const tones = {
    secondary: "border-ds-border-strong bg-ds-surface text-ds-text-muted hover:text-ds-text hover:border-ds-text-muted",
    primary: "border-ds-accent bg-ds-accent text-white hover:bg-ds-accent-bright hover:border-ds-accent-bright",
    danger: "border-ds-danger/40 bg-ds-danger-soft text-ds-danger hover:bg-ds-danger/20",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`mono-tag-sm inline-flex items-center gap-2 border px-3 py-2 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${tones[tone]}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {loading ? "…" : children}
    </button>
  );
};

const RegistrationCardHeader = ({ index, reg, isEditing, editForm, canEdit, saving, onSave, onCancel, onEdit, onDelete }) => (
  <div className="relative flex flex-col gap-5 border-b border-ds-border bg-ds-surface-2 p-6 sm:flex-row sm:items-end sm:justify-between">
    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-ds-accent" />
    <div className="flex items-end gap-5">
      <span className="editorial-display mono-num text-5xl leading-none text-ds-accent-bright sm:text-6xl">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="pb-1">
        <span className="mono-tag-sm text-ds-text-faint">Camper</span>
        <h3 className="editorial-display mt-2 text-2xl text-ds-text sm:text-3xl">
          {isEditing ? editForm.kid_name : reg.kid_name}
        </h3>
        <span className="mono-tag-sm mt-2 inline-block text-ds-text-faint">
          Signed up {formatDate(reg.created_at)}
        </span>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <StatusPill paid={reg.payment_status === "paid"} />
      {isEditing ? (
        <>
          <ActionButton tone="primary" icon={Save} onClick={onSave} loading={saving}>
            Save
          </ActionButton>
          <ActionButton icon={X} onClick={onCancel}>
            Cancel
          </ActionButton>
        </>
      ) : (
        <>
          {canEdit && (
            <ActionButton icon={Pencil} onClick={onEdit}>
              Edit
            </ActionButton>
          )}
          <ActionButton tone="danger" icon={Trash2} onClick={onDelete}>
            Delete
          </ActionButton>
        </>
      )}
    </div>
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
      const { error: updateError } = await RegistrationService.updateRegistration(id, updates, user.id);
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
      const { error: deleteError } = await RegistrationService.deleteRegistration(id, user.id);
      if (deleteError) throw deleteError;
      setConfirmDelete(null);
      await loadRegistrations();
    } catch {
      setError("Failed to delete registration");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell active="dashboard">
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="xl" className="text-ds-accent-bright" />
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell active="dashboard">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <header className="border-b border-ds-border pb-8">
          <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
            <Trophy className="h-3.5 w-3.5" /> My Roster
          </span>
          <h1 className="editorial-display editorial-display-tight mt-5 text-4xl text-ds-text sm:text-5xl lg:text-6xl">
            My Dashboard.
          </h1>
          <p className="editorial-body mt-4 max-w-2xl text-lg text-ds-text-muted">
            View and manage your camp sign-ups.
          </p>
        </header>

        {error && (
          <Alert tone="danger" className="mt-6" onDismiss={() => setError("")}>
            {error}
          </Alert>
        )}

        {registrations.length === 0 ? (
          <EmptyDashboard />
        ) : (
          <div className="mt-10 space-y-8">
            {registrations.map((reg, index) => {
              const canEdit = RegistrationService.canEdit(reg);
              const daysRemaining = RegistrationService.getDaysRemaining(reg);
              const isEditing = editingId === reg.id;

              return (
                <article key={reg.id} className="border border-ds-border bg-ds-surface">
                  <RegistrationCardHeader
                    index={index}
                    reg={reg}
                    isEditing={isEditing}
                    editForm={editForm}
                    canEdit={canEdit}
                    saving={saving}
                    onSave={() => saveEdit(reg.id)}
                    onCancel={cancelEditing}
                    onEdit={() => startEditing(reg)}
                    onDelete={() => setConfirmDelete(reg)}
                  />

                  <div className="px-6 pt-5">
                    {canEdit ? (
                      <Alert tone="warning" icon={<Clock className="h-4 w-4" />}>
                        Edit window: {daysRemaining} more day{daysRemaining !== 1 ? "s" : ""}
                      </Alert>
                    ) : (
                      <Alert tone="neutral">Edit window expired. Contact us for changes.</Alert>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-x-10 gap-y-8 p-6 md:grid-cols-2 lg:grid-cols-3">
                    <InfoGroup icon={Trophy} title="Camper">
                      {isEditing ? (
                        <div className="space-y-3">
                          <Field label="Name">
                            <Input name="kid_name" value={editForm.kid_name} onChange={handleEditChange} />
                          </Field>
                          <Field label="Age">
                            <Input
                              name="age"
                              type="number"
                              min="5"
                              max="12"
                              value={editForm.age}
                              onChange={handleEditChange}
                            />
                          </Field>
                          <Field label="Nickname">
                            <Input
                              name="nickname"
                              value={editForm.nickname}
                              onChange={handleEditChange}
                              placeholder="Optional"
                            />
                          </Field>
                        </div>
                      ) : (
                        <>
                          <ReadRow label="Age" value={reg.age} />
                          {reg.nickname && <ReadRow label="Nickname" value={reg.nickname} />}
                        </>
                      )}
                    </InfoGroup>

                    <InfoGroup icon={Shirt} title="Shirt Order">
                      {isEditing ? (
                        <div className="space-y-3">
                          <Field label="Size">
                            <Select
                              value={editForm.shirt_size}
                              onValueChange={(value) => setEditField("shirt_size", value)}
                              options={SIZE_OPTIONS}
                            />
                          </Field>
                          <Field label="Quantity">
                            <Select
                              value={String(editForm.shirt_quantity)}
                              onValueChange={(value) => setEditField("shirt_quantity", value)}
                              options={QUANTITY_OPTIONS}
                            />
                          </Field>
                        </div>
                      ) : (
                        <>
                          <ReadRow label="Size" value={reg.shirt_size} />
                          <ReadRow label="Quantity" value={reg.shirt_quantity} />
                          <ReadRow label="Total" value={formatCurrency(reg.total_cost)} />
                        </>
                      )}
                    </InfoGroup>

                    <InfoGroup icon={Users} title="Parent / Guardian">
                      {isEditing ? (
                        <div className="space-y-3">
                          <Field label="Name">
                            <Input name="parent_name" value={editForm.parent_name} onChange={handleEditChange} />
                          </Field>
                          <Field label="Phone">
                            <Input
                              name="parent_phone"
                              type="tel"
                              value={editForm.parent_phone}
                              onChange={handleEditChange}
                            />
                          </Field>
                        </div>
                      ) : (
                        <>
                          <ReadRow label="Name" value={reg.parent_name} />
                          <ReadRow label="Phone" value={reg.parent_phone} />
                          <ReadRow label="Email" value={reg.parent_email} />
                        </>
                      )}
                    </InfoGroup>

                    <InfoGroup icon={ShieldCheck} title="Emergency Contact">
                      {isEditing ? (
                        <div className="space-y-3">
                          <Field label="Name">
                            <Input
                              name="emergency_name"
                              value={editForm.emergency_name}
                              onChange={handleEditChange}
                            />
                          </Field>
                          <Field label="Phone">
                            <Input
                              name="emergency_phone"
                              type="tel"
                              value={editForm.emergency_phone}
                              onChange={handleEditChange}
                            />
                          </Field>
                          <Field label="Relationship">
                            <Select
                              value={editForm.emergency_relation}
                              onValueChange={(value) => setEditField("emergency_relation", value)}
                              options={RELATION_OPTIONS}
                            />
                          </Field>
                        </div>
                      ) : (
                        <>
                          <ReadRow label="Name" value={reg.emergency_name} />
                          <ReadRow label="Phone" value={reg.emergency_phone} />
                          <ReadRow label="Relation" value={reg.emergency_relation} />
                        </>
                      )}
                    </InfoGroup>

                    <InfoGroup icon={DollarSign} title="CashApp Info">
                      {isEditing ? (
                        <Field label="CashApp username / email">
                          <Input
                            name="cashapp_username"
                            value={editForm.cashapp_username}
                            onChange={handleEditChange}
                            placeholder="$username or email"
                          />
                        </Field>
                      ) : reg.cashapp_username ? (
                        <p className="inline-flex items-center gap-1.5 text-sm text-ds-positive">
                          <CheckCircle2 className="h-3.5 w-3.5" /> {reg.cashapp_username}
                        </p>
                      ) : (
                        <span className="mono-tag-sm inline-flex items-center gap-2 border border-ds-warning/40 bg-ds-warning-soft px-2.5 py-1 text-ds-warning">
                          Not provided
                        </span>
                      )}
                    </InfoGroup>

                    <InfoGroup icon={Clock} title="Season Info">
                      <ReadRow label="Season" value={reg.camp_year} />
                      <ReadRow label="Signed up" value={formatDate(reg.created_at)} />
                    </InfoGroup>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={Boolean(confirmDelete)} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete sign-up?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the sign-up for{" "}
              <span className="font-semibold text-ds-text">{confirmDelete?.kid_name}</span>?
              This can't be undone. If you've already paid, contact us for a
              refund.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" loading={deleting} onClick={() => handleDelete(confirmDelete.id)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
};

const EmptyDashboard = () => (
  <div className="mt-12 border border-dashed border-ds-border-strong bg-ds-surface p-12 text-center">
    <Inbox className="mx-auto h-7 w-7 text-ds-text-faint" />
    <h2 className="editorial-display mt-5 text-3xl text-ds-text">No sign-ups yet</h2>
    <p className="editorial-body mx-auto mt-3 max-w-md text-ds-text-muted">
      You haven't signed up any campers yet — head back to the home page and grab a roster spot.
    </p>
    <Link
      to="/register"
      className="mono-tag mt-7 inline-flex items-center gap-2 border border-ds-accent bg-ds-accent px-5 py-3 text-white transition-colors duration-200 hover:bg-ds-accent-bright hover:border-ds-accent-bright"
    >
      Sign Up Now <ArrowRight className="h-3.5 w-3.5" />
    </Link>
  </div>
);

export default Dashboard;
