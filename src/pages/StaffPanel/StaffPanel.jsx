/**
 * StaffPanel — staff admin view for managing camp registrations.
 *
 * Editorial register: large display title with mono eyebrow; filterable stat
 * strip, a hairline-bordered controls bar, and the desktop table / mobile card
 * lists below. Year-filterable, search, payment-status filter, payment
 * toggling, order grouping, summary KPIs, CSV export — all unchanged.
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
  Input,
  Select,
  Spinner,
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

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="left-rule-accent border border-ds-border bg-ds-surface px-5 py-5 pl-7">
    <Icon className="h-3.5 w-3.5 text-ds-accent-bright" />
    <p className="editorial-display mono-num mt-3 text-3xl text-ds-text sm:text-4xl">
      {value}
    </p>
    <p className="mono-tag-sm mt-2 text-ds-text-muted">{label}</p>
  </div>
);

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
    { icon: Users, label: "Total", value: stats.total },
    { icon: CheckCircle2, label: "Paid", value: stats.paid },
    { icon: Clock, label: "Pending", value: stats.pending },
    { icon: DollarSign, label: "Collected", value: formatCurrency(stats.paidRevenue) },
    { icon: DollarSign, label: "Expected", value: formatCurrency(stats.totalRevenue) },
  ];

  return (
    <DashboardShell active="staff">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14 lg:px-10">
        <header className="flex flex-col gap-6 border-b border-ds-border pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="mono-tag inline-flex items-center gap-3 text-ds-accent-bright">
              <ShieldCheck className="h-3.5 w-3.5" /> Staff Console
            </span>
            <h1 className="editorial-display editorial-display-tight mt-5 text-4xl text-ds-text sm:text-5xl lg:text-6xl">
              Staff Panel.
            </h1>
            <p className="editorial-body mt-4 max-w-2xl text-lg text-ds-text-muted">
              Manage camp sign-ups, payments, and shirt orders by season.
            </p>
          </div>
          <Select
            value={String(selectedYear)}
            onValueChange={(value) => setSelectedYear(parseInt(value, 10))}
            triggerClassName="w-44"
            options={years.map((year) => ({ value: String(year), label: `${year} Season` }))}
          />
        </header>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((card) => (
            <StatCard
              key={card.label}
              icon={card.icon}
              label={card.label}
              value={card.value}
            />
          ))}
        </div>

        <div className="mt-8 border border-ds-border bg-ds-surface p-5">
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
              <button
                type="button"
                onClick={exportToCSV}
                className="mono-tag inline-flex items-center gap-2 border border-ds-accent bg-ds-accent px-4 py-3 text-white transition-colors duration-200 hover:bg-ds-accent-bright hover:border-ds-accent-bright"
              >
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner size="xl" className="text-ds-accent-bright" />
          </div>
        ) : grouped.length === 0 ? (
          <div className="mt-8 border border-dashed border-ds-border-strong bg-ds-surface p-12 text-center">
            <Inbox className="mx-auto h-7 w-7 text-ds-text-faint" />
            <h2 className="editorial-display mt-5 text-2xl text-ds-text">No sign-ups found</h2>
            <p className="editorial-body mx-auto mt-3 max-w-md text-ds-text-muted">
              Nothing matches your filters for {selectedYear}.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 hidden lg:block">
              <StaffRegistrationsTable
                groups={grouped}
                expandedRows={expandedRows}
                onToggleExpand={toggleExpanded}
                updatingPayment={updatingPayment}
                onTogglePayment={togglePayment}
              />
            </div>
            <div className="mt-8 lg:hidden">
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
      </div>
    </DashboardShell>
  );
};

export default StaffPanel;
