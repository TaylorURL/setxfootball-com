/**
 * StaffPanel — staff admin view for managing camp registrations.
 *
 * Year-filterable view of all registrations with search, payment-status filter,
 * payment toggling, order grouping (multiple shirt orders from the same
 * parent/camper), summary KPIs, and CSV export. Chrome comes from the shared
 * DashboardShell; the body is composed from design-system primitives.
 *
 * @module pages/StaffPanel
 */
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  Search,
  Download,
  ChevronRight,
  ChevronDown,
  Shirt,
  Phone,
  Mail,
  Inbox,
} from "lucide-react";
import {
  Container,
  PageHeader,
  Card,
  Surface,
  Stat,
  Input,
  Select,
  Button,
  IconButton,
  Badge,
  Spinner,
  EmptyState,
  Separator,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Text,
  Eyebrow,
} from "@bradley-t-t/sunday-design-system";
import DashboardShell from "../../components/layout/DashboardShell";
import { useAuth } from "../../context/AuthContext";
import RegistrationService from "../../services/RegistrationService";
import { formatDate, formatCurrency, getCurrentYear } from "../../utils/helpers";

/** Normalizes a string for comparison: lowercase, trimmed, collapsed whitespace. */
const normalize = (str) => (str || "").toLowerCase().trim().replace(/\s+/g, " ");

/**
 * Checks if two kid names are similar enough to be the same person.
 * Matches if one contains the other or if any name part (>2 chars) overlaps.
 */
const namesMatch = (a, b) => {
  const na = normalize(a);
  const nb = normalize(b);
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;
  const partsA = na.split(" ");
  const partsB = nb.split(" ");
  return partsA.some((p) => p.length > 2 && partsB.includes(p));
};

/**
 * Groups registrations by parent_email + similar kid_name so multiple shirt
 * orders for the same camper appear as one combined row.
 */
const groupOrders = (registrations) => {
  const emailGroups = {};
  for (const reg of registrations) {
    const email = normalize(reg.parent_email);
    if (!emailGroups[email]) emailGroups[email] = [];
    emailGroups[email].push(reg);
  }

  const result = [];
  for (const [email, regs] of Object.entries(emailGroups)) {
    const subGroups = [];
    for (const reg of regs) {
      let placed = false;
      for (const sg of subGroups) {
        if (namesMatch(reg.kid_name, sg[0].kid_name)) {
          sg.push(reg);
          placed = true;
          break;
        }
      }
      if (!placed) subGroups.push([reg]);
    }

    for (const sg of subGroups) {
      const sorted = sg.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const totalShirts = sorted.reduce((s, r) => s + (r.shirt_quantity || 0), 0);
      const totalCost = sorted.reduce((s, r) => s + (r.total_cost || 0), 0);
      const allPaid = sorted.every((r) => r.payment_status === "paid");
      const anyPaid = sorted.some((r) => r.payment_status === "paid");

      result.push({
        key: `${email}|${normalize(sorted[0].kid_name)}`,
        orders: sorted,
        primary: sorted[0],
        hasMultiple: sorted.length > 1,
        combined: {
          totalShirts,
          totalCost,
          status: allPaid ? "paid" : anyPaid ? "partial" : "pending",
          sizes: sorted.map((r) => `${r.shirt_size} x${r.shirt_quantity}`),
        },
      });
    }
  }

  return result;
};

/**
 * Parses a shirt_size string that may contain recipient info.
 * Input: "Youth M (John - Camper), Adult L (Mom - Family)" or just "Youth M"
 * Returns array of { size, recipient, type } objects.
 */
const parseShirtDetails = (shirtSize) => {
  if (!shirtSize) return [];
  return shirtSize.split(",").map((part) => {
    const trimmed = part.trim();
    const match = trimmed.match(/^(.+?)\s*\((.+?)\s*-\s*(Camper|Family)\)$/i);
    if (match) {
      return { size: match[1].trim(), recipient: match[2].trim(), type: match[3] };
    }
    return { size: trimmed, recipient: null, type: null };
  });
};

const GROUP_STATUS = {
  paid: { tone: "positive", label: "All Paid" },
  partial: { tone: "accent", label: "Partial" },
  pending: { tone: "warning", label: "Pending" },
};

const PaymentToggle = ({ status, busy, onToggle }) => {
  const paid = status === "paid";
  return (
    <Button variant="ghost" size="xs" className="px-0" loading={busy} onClick={onToggle}>
      <Badge tone={paid ? "positive" : "warning"} variant="soft" dot>
        {paid ? "Paid" : "Pending"}
      </Badge>
    </Button>
  );
};

const RecipientLine = ({ detail }) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <Text size="xs" weight="medium" as="span">
      {detail.size}
    </Text>
    <span className="text-ds-text-faint">—</span>
    <Text size="xs" tone="muted" as="span">
      {detail.recipient}
    </Text>
    {detail.type && (
      <Badge tone={detail.type.toLowerCase() === "camper" ? "indigo" : "violet"} variant="soft" size="sm">
        {detail.type}
      </Badge>
    )}
  </div>
);

const OrderLine = ({ reg, primary, busy, onToggle }) => {
  const namesDiffer = reg.kid_name.trim().toLowerCase() !== primary.kid_name.trim().toLowerCase();
  const shirtDetails = parseShirtDetails(reg.shirt_size);
  const hasRecipients = shirtDetails.some((d) => d.recipient);
  return (
    <Card variant="outline" padding="sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <Text size="sm" tone="muted" as="span" className="inline-flex items-center gap-1.5">
            <Shirt className="h-3.5 w-3.5 text-ds-text-faint" />
            {hasRecipients ? shirtDetails.map((d) => d.size).join(", ") : reg.shirt_size} x{reg.shirt_quantity}
          </Text>
          <Text size="sm" weight="semibold" as="span">
            {formatCurrency(reg.total_cost)}
          </Text>
          <Text size="xs" tone="faint" as="span">
            {formatDate(reg.created_at)}
          </Text>
        </div>
        <PaymentToggle status={reg.payment_status} busy={busy} onToggle={onToggle} />
      </div>
      {hasRecipients && (
        <div className="mt-2 space-y-1 pl-[22px]">
          {shirtDetails.map((detail, index) => detail.recipient && <RecipientLine key={index} detail={detail} />)}
        </div>
      )}
      {namesDiffer && !hasRecipients && (
        <Text size="xs" tone="faint" className="mt-1.5 pl-[22px]">
          Registered as: <span className="font-medium text-ds-text-muted">{reg.kid_name}</span>
        </Text>
      )}
    </Card>
  );
};

const ExpandedDetail = ({ group, updatingPayment, onToggle }) => {
  const { primary, hasMultiple, orders } = group;
  return (
    <div className="space-y-4 bg-ds-surface-2 p-5">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <Eyebrow strong className="mb-1">
            Emergency Contact
          </Eyebrow>
          <Text size="sm" weight="medium">
            {primary.emergency_name}
          </Text>
          <Text size="xs" tone="muted">
            {primary.emergency_phone} · {primary.emergency_relation}
          </Text>
        </div>
        <div>
          <Eyebrow strong className="mb-1">
            CashApp
          </Eyebrow>
          {primary.cashapp_username ? (
            <Text size="sm" tone="positive">
              {primary.cashapp_username}
            </Text>
          ) : (
            <Text size="xs" tone="faint">
              Not provided
            </Text>
          )}
        </div>
        <div>
          <Eyebrow strong className="mb-1">
            Full Email
          </Eyebrow>
          <Text size="sm" tone="muted">
            {primary.parent_email}
          </Text>
        </div>
      </div>

      {hasMultiple && (
        <>
          <Separator />
          <div>
            <Eyebrow strong className="mb-3">
              Individual Orders ({orders.length})
            </Eyebrow>
            <div className="space-y-2">
              {orders.map((reg) => (
                <OrderLine
                  key={reg.id}
                  reg={reg}
                  primary={primary}
                  busy={updatingPayment === reg.id}
                  onToggle={() => onToggle(reg.id, reg.payment_status)}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const StaffPanel = () => {
  const { user, isStaff } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [updatingPayment, setUpdatingPayment] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!isStaff()) {
      navigate("/dashboard");
      return;
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isStaff, navigate]);

  useEffect(() => {
    if (selectedYear) loadRegistrations(selectedYear);
  }, [selectedYear]);

  const loadData = async () => {
    try {
      const { data: availableYears } = await RegistrationService.getAllYears();
      if (availableYears.length > 0) {
        setYears(availableYears);
        if (!availableYears.includes(selectedYear)) setSelectedYear(availableYears[0]);
      } else {
        setYears([getCurrentYear()]);
      }
    } catch (err) {
      console.error("Error loading years:", err);
      setYears([getCurrentYear()]);
    }
  };

  const loadRegistrations = async (year) => {
    setLoading(true);
    try {
      const { data } = await RegistrationService.getRegistrationsByYear(year);
      setRegistrations(data || []);
    } catch (err) {
      console.error("Error loading registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentStatus = async (id, currentStatus) => {
    setUpdatingPayment(id);
    try {
      const newStatus = currentStatus === "paid" ? "pending" : "paid";
      const { error } = await RegistrationService.updatePaymentStatus(id, newStatus);
      if (error) throw error;
      await loadRegistrations(selectedYear);
    } catch (err) {
      console.error("Error updating payment:", err);
    } finally {
      setUpdatingPayment(null);
    }
  };

  const toggleExpanded = (key) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.kid_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.parent_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPayment = paymentFilter === "all" || reg.payment_status === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const grouped = useMemo(() => groupOrders(filteredRegistrations), [filteredRegistrations]);

  const stats = {
    total: registrations.length,
    paid: registrations.filter((r) => r.payment_status === "paid").length,
    pending: registrations.filter((r) => r.payment_status === "pending").length,
    totalRevenue: registrations.reduce((sum, r) => sum + (r.total_cost || 0), 0),
    paidRevenue: registrations
      .filter((r) => r.payment_status === "paid")
      .reduce((sum, r) => sum + (r.total_cost || 0), 0),
  };

  /**
   * Sanitizes a single CSV cell value to prevent formula/CSV injection (CWE-1236).
   * - Wraps all values in double-quotes
   * - Escapes internal double-quotes as ""
   * - Prefixes formula-trigger characters (=, +, -, @, tab, CR) with a single quote
   */
  const sanitizeCsvCell = (value) => {
    const stringValue = value == null ? "" : String(value);
    const formulaTriggers = /^[=+\-@\t\r]/;
    const sanitized = formulaTriggers.test(stringValue) ? `'${stringValue}` : stringValue;
    return `"${sanitized.replace(/"/g, '""')}"`;
  };

  const exportToCSV = () => {
    const headers = [
      "Kid Name",
      "Age",
      "Nickname",
      "Shirt Size",
      "Quantity",
      "Total",
      "Parent Name",
      "Parent Phone",
      "Parent Email",
      "Emergency Name",
      "Emergency Phone",
      "Emergency Relation",
      "CashApp",
      "Payment Status",
      "Registered",
    ];
    const rows = filteredRegistrations.map((r) => [
      r.kid_name,
      r.age,
      r.nickname || "",
      r.shirt_size,
      r.shirt_quantity,
      r.total_cost,
      r.parent_name,
      r.parent_phone,
      r.parent_email,
      r.emergency_name,
      r.emergency_phone,
      r.emergency_relation,
      r.cashapp_username || "",
      r.payment_status,
      formatDate(r.created_at),
    ]);
    const csvContent = [headers, ...rows].map((row) => row.map(sanitizeCsvCell).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `setx-registrations-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const statCards = [
    { icon: <Users />, label: "Total", value: stats.total },
    { icon: <CheckCircle2 />, label: "Paid", value: stats.paid },
    { icon: <Clock />, label: "Pending", value: stats.pending },
    { icon: <DollarSign />, label: "Collected", value: formatCurrency(stats.paidRevenue) },
    { icon: <DollarSign />, label: "Expected", value: formatCurrency(stats.totalRevenue) },
  ];

  return (
    <DashboardShell active="staff">
      <Container size="xl" className="py-8">
        <PageHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Staff
            </span>
          }
          title="Staff Panel"
          description="Manage camp registrations by year"
          actions={
            <Select
              value={String(selectedYear)}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
              options={years.map((year) => ({ value: String(year), label: `${year} Season` }))}
            />
          }
        />

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((card) => (
            <Stat key={card.label} label={card.label} value={card.value} icon={card.icon} />
          ))}
        </div>

        <Surface className="mt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              className="flex-1"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              leading={<Search />}
            />
            <div className="flex items-center gap-3">
              <Select
                className="flex-1 sm:flex-none"
                value={paymentFilter}
                onValueChange={setPaymentFilter}
                options={[
                  { value: "all", label: "All Payments" },
                  { value: "paid", label: "Paid Only" },
                  { value: "pending", label: "Pending Only" },
                ]}
              />
              <Button variant="primary" onClick={exportToCSV}>
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </div>
        </Surface>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="xl" className="text-ds-accent-bright" />
          </div>
        ) : grouped.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              icon={<Inbox />}
              title="No registrations found"
              description={`No registrations match your search criteria for ${selectedYear}.`}
            />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="mt-6 hidden lg:block">
              <TableContainer>
                <Table className="table-fixed">
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell className="w-10" />
                      <TableHeaderCell>Camper</TableHeaderCell>
                      <TableHeaderCell className="w-[13%]">Parent</TableHeaderCell>
                      <TableHeaderCell className="w-[16%]">Contact</TableHeaderCell>
                      <TableHeaderCell className="w-[15%]">Shirts</TableHeaderCell>
                      <TableHeaderCell className="w-[9%]">Total</TableHeaderCell>
                      <TableHeaderCell className="w-[10%]">Status</TableHeaderCell>
                      <TableHeaderCell className="w-[11%]">Date</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {grouped.map((group) => {
                      const { primary, combined, hasMultiple, key } = group;
                      const isExpanded = expandedRows.has(key);
                      const groupStatus = GROUP_STATUS[combined.status] ?? GROUP_STATUS.pending;

                      return (
                        <ExpandableRows key={key} expanded={isExpanded}>
                          <TableRow interactive onClick={() => toggleExpanded(key)}>
                            <TableCell>
                              <IconButton
                                label={isExpanded ? "Collapse" : "Expand"}
                                variant="ghost"
                                size="sm"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleExpanded(key);
                                }}
                              >
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </IconButton>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Text size="sm" weight="semibold" as="span">
                                  {primary.kid_name}
                                </Text>
                                {hasMultiple && (
                                  <Badge tone="accent" variant="soft" size="sm">
                                    <Shirt className="h-3 w-3" /> {group.orders.length} orders
                                  </Badge>
                                )}
                              </div>
                              <Text size="xs" tone="faint">
                                Age {primary.age}
                                {primary.nickname && ` · "${primary.nickname}"`}
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Text size="sm" tone="muted" truncate>
                                {primary.parent_name}
                              </Text>
                            </TableCell>
                            <TableCell>
                              <Text size="xs" tone="muted" truncate>
                                {primary.parent_phone}
                              </Text>
                              <Text size="xs" tone="faint" truncate>
                                {primary.parent_email}
                              </Text>
                            </TableCell>
                            <TableCell>
                              {hasMultiple ? (
                                <>
                                  <Text size="sm" tone="muted">
                                    {combined.totalShirts} shirts
                                  </Text>
                                  <Text size="xs" tone="faint" truncate>
                                    {combined.sizes.join(", ")}
                                  </Text>
                                </>
                              ) : (
                                <>
                                  <Text size="sm" tone="muted">
                                    {primary.shirt_size}
                                  </Text>
                                  <Text size="xs" tone="faint">
                                    x{primary.shirt_quantity}
                                  </Text>
                                </>
                              )}
                            </TableCell>
                            <TableCell>
                              <Text size="sm" weight="semibold" as="span">
                                {formatCurrency(hasMultiple ? combined.totalCost : primary.total_cost)}
                              </Text>
                            </TableCell>
                            <TableCell onClick={(event) => event.stopPropagation()}>
                              {hasMultiple ? (
                                <Badge tone={groupStatus.tone} variant="soft">
                                  {groupStatus.label}
                                </Badge>
                              ) : (
                                <PaymentToggle
                                  status={primary.payment_status}
                                  busy={updatingPayment === primary.id}
                                  onToggle={() => togglePaymentStatus(primary.id, primary.payment_status)}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Text size="xs" tone="faint">
                                {formatDate(primary.created_at)}
                              </Text>
                            </TableCell>
                          </TableRow>
                          {isExpanded && (
                            <TableRow>
                              <TableCell colSpan={8} className="p-0">
                                <ExpandedDetail
                                  group={group}
                                  updatingPayment={updatingPayment}
                                  onToggle={togglePaymentStatus}
                                />
                              </TableCell>
                            </TableRow>
                          )}
                        </ExpandableRows>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Mobile cards */}
            <div className="mt-6 space-y-4 lg:hidden">
              {grouped.map((group) => {
                const { primary, combined, hasMultiple, key } = group;
                const isExpanded = expandedRows.has(key);
                const groupStatus = GROUP_STATUS[combined.status] ?? GROUP_STATUS.pending;

                return (
                  <Card key={key} variant="surface" padding="none" className="overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleExpanded(key)}
                      className="ds-press flex w-full items-center justify-between gap-3 border-b border-ds-border p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 shrink-0 text-ds-text-faint" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-ds-text-faint" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <Text size="sm" weight="semibold" as="span">
                              {primary.kid_name}
                            </Text>
                            {hasMultiple && (
                              <Badge tone="accent" variant="soft" size="sm">
                                <Shirt className="h-3 w-3" /> {group.orders.length}
                              </Badge>
                            )}
                          </div>
                          <Text size="xs" tone="faint">
                            Age {primary.age}
                          </Text>
                        </div>
                      </div>
                      {hasMultiple ? (
                        <Badge tone={groupStatus.tone} variant="soft">
                          {groupStatus.label}
                        </Badge>
                      ) : (
                        <span onClick={(event) => event.stopPropagation()}>
                          <PaymentToggle
                            status={primary.payment_status}
                            busy={updatingPayment === primary.id}
                            onToggle={() => togglePaymentStatus(primary.id, primary.payment_status)}
                          />
                        </span>
                      )}
                    </button>

                    <div className="space-y-4 p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Eyebrow strong className="mb-1">
                            Shirts
                          </Eyebrow>
                          {hasMultiple ? (
                            <>
                              <Text size="sm" weight="medium">
                                {combined.totalShirts} total
                              </Text>
                              <Text size="xs" tone="faint">
                                {combined.sizes.join(", ")}
                              </Text>
                            </>
                          ) : (
                            <Text size="sm" weight="medium">
                              {primary.shirt_size} (x{primary.shirt_quantity})
                            </Text>
                          )}
                        </div>
                        <div>
                          <Eyebrow strong className="mb-1">
                            Amount
                          </Eyebrow>
                          <Text size="sm" weight="semibold">
                            {formatCurrency(hasMultiple ? combined.totalCost : primary.total_cost)}
                          </Text>
                        </div>
                        <div>
                          <Eyebrow strong className="mb-1">
                            Parent
                          </Eyebrow>
                          <Text size="sm" weight="medium">
                            {primary.parent_name}
                          </Text>
                        </div>
                        <div>
                          <Eyebrow strong className="mb-1">
                            CashApp
                          </Eyebrow>
                          <Text size="sm" tone={primary.cashapp_username ? "positive" : "faint"}>
                            {primary.cashapp_username || "Not provided"}
                          </Text>
                        </div>
                      </div>

                      {isExpanded && (
                        <>
                          <Separator />
                          <div className="space-y-1.5">
                            <Text size="sm" tone="muted" className="flex items-center gap-2">
                              <Phone className="h-3.5 w-3.5 text-ds-text-faint" /> {primary.parent_phone}
                            </Text>
                            <Text size="sm" tone="muted" className="flex items-center gap-2">
                              <Mail className="h-3.5 w-3.5 text-ds-text-faint" />
                              <span className="truncate">{primary.parent_email}</span>
                            </Text>
                          </div>
                          <Separator />
                          <div>
                            <Eyebrow strong className="mb-1">
                              Emergency Contact
                            </Eyebrow>
                            <Text size="sm" weight="medium">
                              {primary.emergency_name} ({primary.emergency_relation})
                            </Text>
                            <Text size="xs" tone="muted">
                              {primary.emergency_phone}
                            </Text>
                          </div>

                          {hasMultiple && (
                            <>
                              <Separator />
                              <div>
                                <Eyebrow strong className="mb-2">
                                  Individual Orders
                                </Eyebrow>
                                <div className="space-y-2">
                                  {group.orders.map((reg) => (
                                    <OrderLine
                                      key={reg.id}
                                      reg={reg}
                                      primary={primary}
                                      busy={updatingPayment === reg.id}
                                      onToggle={() => togglePaymentStatus(reg.id, reg.payment_status)}
                                    />
                                  ))}
                                </div>
                              </div>
                            </>
                          )}

                          <Separator />
                          <Text size="xs" tone="faint">
                            Registered: {formatDate(primary.created_at)}
                          </Text>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </Container>
    </DashboardShell>
  );
};

/** Groups a primary row and its optional expanded detail row under one key. */
const ExpandableRows = ({ children }) => <>{children}</>;

export default StaffPanel;
