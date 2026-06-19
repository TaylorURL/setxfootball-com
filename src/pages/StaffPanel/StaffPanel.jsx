/**
 * StaffPanel — staff admin view for managing camp registrations.
 *
 * Year-filterable view of all registrations with search, payment-status filter,
 * payment toggling, order grouping (multiple shirt orders from the same
 * parent/camper), summary KPIs, and CSV export. Data orchestration lives in
 * useStaffRegistrations; grouping/CSV logic lives in utils; chrome comes from
 * the shared DashboardShell. The header carries the stadium-stencil title and
 * the season selector.
 *
 * @module pages/StaffPanel
 */
import { useState } from "react";
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Clock,
  DollarSign,
  Search,
  Download,
  Inbox,
} from "lucide-react";
import {
  Container,
  PageHeader,
  Surface,
  Stat,
  Input,
  Select,
  Button,
  Spinner,
  EmptyState,
} from "@bradley-t-t/sunday-design-system";
import DashboardShell from "../../components/layout/DashboardShell";
import { useStaffRegistrations } from "../../hooks/useStaffRegistrations";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { toCsv, downloadTextFile } from "../../utils/csv";
import StaffRegistrationsTable from "./StaffRegistrationsTable";
import StaffRegistrationCards from "./StaffRegistrationCards";

const CSV_HEADERS = [
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

const toCsvRow = (registration) => [
  registration.kid_name,
  registration.age,
  registration.nickname || "",
  registration.shirt_size,
  registration.shirt_quantity,
  registration.total_cost,
  registration.parent_name,
  registration.parent_phone,
  registration.parent_email,
  registration.emergency_name,
  registration.emergency_phone,
  registration.emergency_relation,
  registration.cashapp_username || "",
  registration.payment_status,
  formatDate(registration.created_at),
];

const PAYMENT_FILTER_OPTIONS = [
  { value: "all", label: "All Payments" },
  { value: "paid", label: "Paid Only" },
  { value: "pending", label: "Pending Only" },
];

const StaffPanel = () => {
  const {
    filtered,
    grouped,
    stats,
    years,
    selectedYear,
    setSelectedYear,
    loading,
    searchTerm,
    setSearchTerm,
    paymentFilter,
    setPaymentFilter,
    updatingPayment,
    togglePayment,
  } = useStaffRegistrations();
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleExpanded = (key) =>
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const exportToCSV = () => {
    const csv = toCsv([CSV_HEADERS, ...filtered.map(toCsvRow)]);
    downloadTextFile(`setx-registrations-${selectedYear}.csv`, csv);
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
            <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.16em]">
              <ShieldCheck className="h-3.5 w-3.5" /> Staff Console
            </span>
          }
          title="Staff Panel"
          description="Manage camp sign-ups, payments, and shirt orders by season."
          actions={
            <Select
              value={String(selectedYear)}
              onValueChange={(value) => setSelectedYear(parseInt(value, 10))}
              triggerClassName="w-44"
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
            <div className="sm:flex-1">
              <Input
                placeholder="Search by name or email…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                leading={<Search />}
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 sm:flex-none">
                <Select
                  value={paymentFilter}
                  onValueChange={setPaymentFilter}
                  triggerClassName="w-full sm:w-44"
                  options={PAYMENT_FILTER_OPTIONS}
                />
              </div>
              <Button variant="primary" className="font-bold uppercase tracking-[0.06em]" onClick={exportToCSV}>
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
              title="No sign-ups found"
              description={`Nothing matches your filters for ${selectedYear}.`}
            />
          </div>
        ) : (
          <>
            <div className="mt-6 hidden lg:block">
              <StaffRegistrationsTable
                groups={grouped}
                expandedRows={expandedRows}
                onToggleExpand={toggleExpanded}
                updatingPayment={updatingPayment}
                onTogglePayment={togglePayment}
              />
            </div>
            <div className="mt-6 lg:hidden">
              <StaffRegistrationCards
                groups={grouped}
                expandedRows={expandedRows}
                onToggleExpand={toggleExpanded}
                updatingPayment={updatingPayment}
                onTogglePayment={togglePayment}
              />
            </div>
          </>
        )}
      </Container>
    </DashboardShell>
  );
};

export default StaffPanel;
