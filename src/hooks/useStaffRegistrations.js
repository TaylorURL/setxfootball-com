/**
 * @module useStaffRegistrations
 * @description Owns all data orchestration behind the StaffPanel: the year
 * picker, per-year registration loading, search/payment filtering, payment
 * toggling, the grouped view model, and summary stats. The panel component
 * is left to render; this hook holds the state and the wiring.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import RegistrationService from "../services/RegistrationService";
import { getCurrentYear } from "../utils/helpers";
import { groupOrders } from "../utils/registrationGrouping";
import { PAYMENT_STATUSES } from "../utils/constants";

const matchesSearch = (registration, term) => {
  const needle = term.toLowerCase();
  return (
    registration.kid_name.toLowerCase().includes(needle) ||
    registration.parent_name.toLowerCase().includes(needle) ||
    registration.parent_email.toLowerCase().includes(needle)
  );
};

const buildStats = (registrations) => {
  const paid = registrations.filter((r) => r.payment_status === PAYMENT_STATUSES.PAID);
  const sumCost = (rows) => rows.reduce((sum, r) => sum + (r.total_cost || 0), 0);
  return {
    total: registrations.length,
    paid: paid.length,
    pending: registrations.filter((r) => r.payment_status === PAYMENT_STATUSES.PENDING).length,
    totalRevenue: sumCost(registrations),
    paidRevenue: sumCost(paid),
  };
};

export const useStaffRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [updatingPayment, setUpdatingPayment] = useState(null);

  const loadRegistrations = useCallback(async (year) => {
    setLoading(true);
    try {
      const { data } = await RegistrationService.getRegistrationsByYear(year);
      setRegistrations(data || []);
    } catch (error) {
      console.error("Error loading registrations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await RegistrationService.getAllYears();
        if (!active) return;
        const available = data?.length ? data : [getCurrentYear()];
        setYears(available);
        setSelectedYear((current) => (available.includes(current) ? current : available[0]));
      } catch (error) {
        console.error("Error loading years:", error);
        if (active) setYears([getCurrentYear()]);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (selectedYear) loadRegistrations(selectedYear);
  }, [selectedYear, loadRegistrations]);

  const togglePayment = useCallback(
    async (id, currentStatus) => {
      setUpdatingPayment(id);
      try {
        const nextStatus =
          currentStatus === PAYMENT_STATUSES.PAID ? PAYMENT_STATUSES.PENDING : PAYMENT_STATUSES.PAID;
        const { error } = await RegistrationService.updatePaymentStatus(id, nextStatus);
        if (error) throw error;
        await loadRegistrations(selectedYear);
      } catch (error) {
        console.error("Error updating payment:", error);
      } finally {
        setUpdatingPayment(null);
      }
    },
    [loadRegistrations, selectedYear],
  );

  const filtered = useMemo(
    () =>
      registrations.filter(
        (registration) =>
          matchesSearch(registration, searchTerm) &&
          (paymentFilter === "all" || registration.payment_status === paymentFilter),
      ),
    [registrations, searchTerm, paymentFilter],
  );

  const grouped = useMemo(() => groupOrders(filtered), [filtered]);
  const stats = useMemo(() => buildStats(registrations), [registrations]);

  return {
    registrations,
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
  };
};
