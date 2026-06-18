/**
 * Dashboard — authenticated user view for managing camp registrations.
 *
 * Lists every registration tied to the signed-in user's email and supports
 * inline editing within the edit window plus deletion. Chrome (sidebar, nav,
 * sign-out, theme) comes from the shared DashboardShell; the body is composed
 * from design-system primitives.
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
} from "lucide-react";
import {
  Container,
  PageHeader,
  Card,
  Grid,
  Field,
  Input,
  Select,
  Button,
  Badge,
  Alert,
  Spinner,
  EmptyState,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Heading,
  Text,
  Eyebrow,
} from "@bradley-t-t/sunday-design-system";
import DashboardShell from "../../components/layout/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import RegistrationService from "../../services/RegistrationService";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { SHIRT_SIZES, SHIRT_PRICE, EMERGENCY_RELATIONS } from "../../utils/constants";

const InfoGroup = ({ icon: Icon, title, children }) => (
  <div className="space-y-2.5">
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-ds-accent-bright" />
      <Eyebrow strong>{title}</Eyebrow>
    </div>
    {children}
  </div>
);

const ReadRow = ({ label, value }) => (
  <Text size="sm" tone="muted">
    <span className="text-ds-text-faint">{label}:</span>{" "}
    <span className="text-ds-text">{value}</span>
  </Text>
);

const QUANTITY_OPTIONS = [1, 2, 3, 4, 5].map((num) => ({ value: String(num), label: `${num} shirt(s)` }));
const SIZE_OPTIONS = SHIRT_SIZES.map((size) => ({ value: size, label: size }));
const RELATION_OPTIONS = EMERGENCY_RELATIONS.map((relation) => ({ value: relation, label: relation }));

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
      <div className="flex min-h-[100dvh] items-center justify-center bg-ds-bg">
        <Spinner size="xl" className="text-ds-accent-bright" />
      </div>
    );
  }

  return (
    <DashboardShell active="dashboard">
      <Container size="xl" className="py-8">
        <PageHeader title="My Dashboard" description="View and manage your camp registrations" />

        {error && (
          <Alert tone="danger" className="mt-6" onDismiss={() => setError("")}>
            {error}
          </Alert>
        )}

        {registrations.length === 0 ? (
          <div className="mt-8">
            <EmptyDashboard />
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            {registrations.map((reg) => {
              const canEdit = RegistrationService.canEdit(reg);
              const daysRemaining = RegistrationService.getDaysRemaining(reg);
              const isEditing = editingId === reg.id;

              return (
                <Card key={reg.id} variant="surface" padding="none" className="overflow-hidden">
                  <div className="flex flex-col gap-3 border-b border-ds-border p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-ds-md bg-ds-accent-soft text-ds-accent-bright">
                        <Trophy className="h-4 w-4" />
                      </span>
                      <div>
                        <Heading level={3}>{isEditing ? editForm.kid_name : reg.kid_name}</Heading>
                        <Text size="xs" tone="faint">
                          Registered {formatDate(reg.created_at)}
                        </Text>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={reg.payment_status === "paid" ? "positive" : "warning"} variant="soft">
                        {reg.payment_status === "paid" ? "Paid" : "Pending"}
                      </Badge>
                      {isEditing ? (
                        <>
                          <Button variant="primary" size="sm" loading={saving} onClick={() => saveEdit(reg.id)}>
                            <Save className="h-3.5 w-3.5" /> Save
                          </Button>
                          <Button variant="secondary" size="sm" onClick={cancelEditing}>
                            <X className="h-3.5 w-3.5" /> Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          {canEdit && (
                            <Button variant="secondary" size="sm" onClick={() => startEditing(reg)}>
                              <Pencil className="h-3.5 w-3.5" /> Edit
                            </Button>
                          )}
                          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(reg)}>
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pt-4">
                    {canEdit ? (
                      <Alert tone="warning" icon={<Clock className="h-4 w-4" />}>
                        Edit available for {daysRemaining} more day{daysRemaining !== 1 ? "s" : ""}
                      </Alert>
                    ) : (
                      <Alert tone="neutral">Edit window expired. Contact us for changes.</Alert>
                    )}
                  </div>

                  <div className="p-5">
                    <Grid cols={3} gap={6}>
                      <InfoGroup icon={Trophy} title="Camper Info">
                        {isEditing ? (
                          <div className="space-y-2.5">
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

                      <InfoGroup icon={Shirt} title="Shirt Details">
                        {isEditing ? (
                          <div className="space-y-2.5">
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
                          <div className="space-y-2.5">
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
                          <div className="space-y-2.5">
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
                          <Text size="sm" tone="positive" className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5" /> {reg.cashapp_username}
                          </Text>
                        ) : (
                          <Badge tone="warning" variant="soft">
                            Not provided
                          </Badge>
                        )}
                      </InfoGroup>

                      <InfoGroup icon={Clock} title="Registration Info">
                        <ReadRow label="Camp Year" value={reg.camp_year} />
                        <ReadRow label="Registered" value={formatDate(reg.created_at)} />
                      </InfoGroup>
                    </Grid>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Container>

      <Dialog open={Boolean(confirmDelete)} onOpenChange={(open) => !open && setConfirmDelete(null)}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Delete Registration?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the registration for{" "}
              <span className="font-semibold text-ds-text">{confirmDelete?.kid_name}</span>? This action cannot be
              undone. If you've already paid, contact us for a refund.
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
  <EmptyState
    icon={<Inbox />}
    title="No registrations yet"
    description="You haven't registered any campers yet."
    action={
      <Button asChild variant="primary">
        <Link to="/#register">Register Now</Link>
      </Button>
    }
  />
);

export default Dashboard;
