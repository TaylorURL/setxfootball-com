/**
 * StaffPanel - Admin panel for staff to manage camp registrations.
 *
 * Provides a year-filterable view of all registrations with search, payment
 * status filtering, payment toggling, order grouping (multiple shirt orders
 * from the same parent/kid), summary statistics, and CSV export.
 * Restricted to users with staff privileges.
 *
 * @module pages/StaffPanel
 * @returns {React.ReactElement} The rendered staff panel page
 */
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RegistrationService from "../../services/RegistrationService";
import {
  formatDate,
  formatCurrency,
  getCurrentYear,
} from "../../utils/helpers";
import logo from "../../assets/logo.PNG";
import {
  FaUserShield,
  FaSignOutAlt,
  FaArrowLeft,
  FaChild,
  FaPhone,
  FaEnvelope,
  FaDollarSign,
  FaCalendarAlt,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaFilter,
  FaDownload,
  FaUser,
  FaBars,
  FaTimes,
  FaHome,
  FaChevronDown,
  FaChevronRight,
  FaTshirt,
} from "react-icons/fa";

/** Normalizes a string for comparison: lowercase, trimmed, collapsed whitespace. */
const normalize = (str) =>
  (str || "").toLowerCase().trim().replace(/\s+/g, " ");

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
      const sorted = sg.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
      const totalShirts = sorted.reduce(
        (s, r) => s + (r.shirt_quantity || 0),
        0,
      );
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
  // Match patterns like "Youth M (Name - Type)" or just "Youth M"
  return shirtSize.split(",").map((part) => {
    const trimmed = part.trim();
    const match = trimmed.match(/^(.+?)\s*\((.+?)\s*-\s*(Camper|Family)\)$/i);
    if (match) {
      return {
        size: match[1].trim(),
        recipient: match[2].trim(),
        type: match[3],
      };
    }
    return { size: trimmed, recipient: null, type: null };
  });
};

/** Shared classes for styled select dropdowns */
const selectClass =
  "appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 outline-none cursor-pointer bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat";

const StaffPanel = () => {
  const { user, signOut, isStaff } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [updatingPayment, setUpdatingPayment] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        if (!availableYears.includes(selectedYear)) {
          setSelectedYear(availableYears[0]);
        }
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const togglePaymentStatus = async (id, currentStatus) => {
    setUpdatingPayment(id);
    try {
      const newStatus = currentStatus === "paid" ? "pending" : "paid";
      const { error } = await RegistrationService.updatePaymentStatus(
        id,
        newStatus,
      );
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
    const matchesPayment =
      paymentFilter === "all" || reg.payment_status === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  const grouped = useMemo(
    () => groupOrders(filteredRegistrations),
    [filteredRegistrations],
  );

  const stats = {
    total: registrations.length,
    paid: registrations.filter((r) => r.payment_status === "paid").length,
    pending: registrations.filter((r) => r.payment_status === "pending").length,
    totalRevenue: registrations.reduce(
      (sum, r) => sum + (r.total_cost || 0),
      0,
    ),
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
    const sanitized = formulaTriggers.test(stringValue)
      ? `'${stringValue}`
      : stringValue;
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
    const csvContent = [headers, ...rows]
      .map((row) => row.map(sanitizeCsvCell).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `setx-registrations-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="SETX Football Camp"
                className="h-9 w-9 object-contain"
              />
              <span className="ml-3 text-lg font-semibold text-slate-900 hidden sm:block">
                Staff Panel
              </span>
              <span className="ml-3 text-lg font-semibold text-slate-900 sm:hidden">
                Staff
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className="flex items-center text-slate-500 hover:text-slate-900 transition-all duration-200 px-3 py-2 rounded-xl hover:bg-slate-100 text-sm font-medium"
              >
                <FaHome className="mr-2 h-3.5 w-3.5" /> Home
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center text-slate-500 hover:text-slate-900 transition-all duration-200 px-3 py-2 rounded-xl hover:bg-slate-100 text-sm font-medium"
              >
                <FaUser className="mr-2 h-3.5 w-3.5" /> Dashboard
              </Link>
              <div className="w-px h-6 bg-slate-200 mx-3"></div>
              <span className="text-slate-400 text-sm truncate max-w-[160px]">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all duration-200 text-sm font-medium ml-4"
              >
                <FaSignOutAlt className="mr-2 h-3.5 w-3.5" /> Sign Out
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-500 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
            >
              {mobileMenuOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="bg-white border-t border-slate-100 px-4 py-3 space-y-1">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wide px-3 py-2 truncate">
              {user?.email}
            </p>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center w-full text-slate-700 hover:text-slate-900 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm font-medium"
            >
              <FaHome className="mr-3 h-4 w-4 text-slate-400" /> Home
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center w-full text-slate-700 hover:text-slate-900 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm font-medium"
            >
              <FaUser className="mr-3 h-4 w-4 text-slate-400" /> Dashboard
            </Link>
            <div className="border-t border-slate-100 my-1"></div>
            <button
              onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}
              className="flex items-center w-full text-slate-700 hover:text-slate-900 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm font-medium"
            >
              <FaSignOutAlt className="mr-3 h-4 w-4 text-slate-400" /> Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-slate-400 hover:text-slate-600 transition-all duration-200 text-sm font-medium"
          >
            <FaArrowLeft className="mr-2 h-3 w-3" /> Back to Dashboard
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center">
              <div className="bg-blue-50 p-2.5 rounded-xl mr-3">
                <FaUserShield className="text-blue-600 h-5 w-5" />
              </div>
              Staff Panel
            </h1>
            <p className="text-sm text-slate-500 mt-2 ml-[52px]">
              Manage camp registrations by year
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-slate-400 h-3.5 w-3.5" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className={selectClass}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year} Season
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {[
            {
              icon: FaChild,
              color: "blue",
              value: stats.total,
              label: "Total",
            },
            {
              icon: FaCheckCircle,
              color: "green",
              value: stats.paid,
              label: "Paid",
            },
            {
              icon: FaClock,
              color: "amber",
              value: stats.pending,
              label: "Pending",
            },
            {
              icon: FaDollarSign,
              color: "green",
              value: formatCurrency(stats.paidRevenue),
              label: "Collected",
            },
            {
              icon: FaDollarSign,
              color: "purple",
              value: formatCurrency(stats.totalRevenue),
              label: "Expected",
            },
          ].map(({ icon: Icon, color, value, label }) => {
            const colorMap = {
              blue: { bg: "bg-blue-50", text: "text-blue-600" },
              green: { bg: "bg-green-50", text: "text-green-600" },
              amber: { bg: "bg-amber-50", text: "text-amber-600" },
              purple: { bg: "bg-purple-50", text: "text-purple-600" },
            };
            const cl = colorMap[color] || colorMap.blue;
            return (
            <div
              key={label}
              className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${cl.bg} p-2.5 rounded-xl`}>
                  <Icon className={`${cl.text} h-4 w-4`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900">{value}</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">
                {label}
              </p>
            </div>
            );
          })}
        </div>

        {/* Search/filter bar */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4 mb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-3.5 w-3.5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl py-2.5 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2 flex-1 sm:flex-none">
                <FaFilter className="text-slate-400 h-3.5 w-3.5 flex-shrink-0" />
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className={`flex-1 sm:flex-none ${selectClass}`}
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>

              <button
                onClick={exportToCSV}
                className="flex items-center justify-center bg-slate-900 text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-all duration-200 text-sm font-semibold whitespace-nowrap"
              >
                <FaDownload className="mr-2 h-3.5 w-3.5" /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-slate-600"></div>
          </div>
        ) : grouped.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center">
            <div className="bg-slate-100 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaChild className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              No Registrations Found
            </h3>
            <p className="text-sm text-slate-500">
              No registrations match your search criteria for {selectedYear}.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="w-8 px-3 py-3"></th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Camper
                    </th>
                    <th className="w-[13%] px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Parent
                    </th>
                    <th className="w-[15%] px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="w-[14%] px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Shirts
                    </th>
                    <th className="w-[9%] px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="w-[9%] px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="w-[11%] px-3 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {grouped.map((group) => {
                    const { primary, combined, hasMultiple, key } = group;
                    const isExpanded = expandedRows.has(key);

                    return (
                      <React.Fragment key={key}>
                        <tr
                          className={`hover:bg-slate-50/80 transition-colors duration-150 ${hasMultiple ? "bg-blue-50/20" : ""}`}
                        >
                          <td className="px-3 py-3">
                            <button
                              onClick={() => toggleExpanded(key)}
                              className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                            >
                              {isExpanded ? (
                                <FaChevronDown className="h-3 w-3" />
                              ) : (
                                <FaChevronRight className="h-3 w-3" />
                              )}
                            </button>
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-semibold text-slate-900 text-sm flex items-center">
                              {primary.kid_name}
                              {hasMultiple && (
                                <span className="ml-2 inline-flex items-center bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                  <FaTshirt className="mr-0.5 h-2 w-2" />
                                  {group.orders.length} orders
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              Age {primary.age}
                              {primary.nickname && ` · "${primary.nickname}"`}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="text-sm font-medium text-slate-700 truncate">
                              {primary.parent_name}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <div className="text-xs text-slate-500 truncate">
                              {primary.parent_phone}
                            </div>
                            <div className="text-xs text-slate-400 truncate mt-0.5">
                              {primary.parent_email}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            {hasMultiple ? (
                              <div>
                                <div className="text-sm font-medium text-slate-700">
                                  {combined.totalShirts} shirts
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">
                                  {combined.sizes.join(", ")}
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="text-sm text-slate-700">
                                  {primary.shirt_size}
                                </div>
                                <div className="text-xs text-slate-400">
                                  x{primary.shirt_quantity}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-sm font-bold text-slate-900">
                              {formatCurrency(
                                hasMultiple
                                  ? combined.totalCost
                                  : primary.total_cost,
                              )}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            {hasMultiple ? (
                              <span
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                  combined.status === "paid"
                                    ? "bg-green-50 text-green-600"
                                    : combined.status === "partial"
                                      ? "bg-blue-50 text-blue-600"
                                      : "bg-amber-50 text-amber-600"
                                }`}
                              >
                                {combined.status === "paid"
                                  ? "All Paid"
                                  : combined.status === "partial"
                                    ? "Partial"
                                    : "Pending"}
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  togglePaymentStatus(
                                    primary.id,
                                    primary.payment_status,
                                  )
                                }
                                disabled={updatingPayment === primary.id}
                                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 ${
                                  primary.payment_status === "paid"
                                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                                    : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                }`}
                              >
                                {updatingPayment === primary.id ? (
                                  <span className="animate-pulse">...</span>
                                ) : primary.payment_status === "paid" ? (
                                  <span className="flex items-center">
                                    <FaCheckCircle className="mr-1 h-2.5 w-2.5" />{" "}
                                    Paid
                                  </span>
                                ) : (
                                  <span className="flex items-center">
                                    <FaClock className="mr-1 h-2.5 w-2.5" />{" "}
                                    Pending
                                  </span>
                                )}
                              </button>
                            )}
                          </td>
                          <td className="px-3 py-3 text-xs text-slate-400">
                            {formatDate(primary.created_at)}
                          </td>
                        </tr>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={8} className="px-0 py-0">
                              <div className="bg-slate-50 border-y border-slate-100 px-6 py-4">
                                {/* Contact details */}
                                <div className="grid grid-cols-3 gap-6 mb-4">
                                  <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                      Emergency Contact
                                    </p>
                                    <p className="text-sm font-medium text-slate-700">
                                      {primary.emergency_name}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                      {primary.emergency_phone} ·{" "}
                                      {primary.emergency_relation}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                      CashApp
                                    </p>
                                    {primary.cashapp_username ? (
                                      <p className="text-sm text-green-600 font-medium">
                                        {primary.cashapp_username}
                                      </p>
                                    ) : (
                                      <p className="text-xs text-slate-400">
                                        Not provided
                                      </p>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                      Full Email
                                    </p>
                                    <p className="text-sm text-slate-600">
                                      {primary.parent_email}
                                    </p>
                                  </div>
                                </div>

                                {/* Individual order rows */}
                                {hasMultiple && (
                                  <div className="mt-3 pt-3 border-t border-slate-200">
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                      Individual Orders ({group.orders.length})
                                    </p>
                                    <div className="space-y-2">
                                      {group.orders.map((reg) => {
                                        const namesDiffer =
                                          reg.kid_name.trim().toLowerCase() !==
                                          primary.kid_name.trim().toLowerCase();
                                        const shirtDetails = parseShirtDetails(
                                          reg.shirt_size,
                                        );
                                        return (
                                          <div
                                            key={reg.id}
                                            className="bg-white border border-slate-200 rounded-xl p-3"
                                          >
                                            <div className="flex items-center justify-between">
                                              <div className="flex items-center space-x-4 text-sm flex-wrap gap-y-1">
                                                <span className="flex items-center text-slate-600">
                                                  <FaTshirt className="mr-1.5 h-3 w-3 text-slate-400" />
                                                  {shirtDetails.length > 0 &&
                                                  shirtDetails[0].recipient
                                                    ? shirtDetails
                                                        .map((d) => d.size)
                                                        .join(", ")
                                                    : reg.shirt_size}{" "}
                                                  x{reg.shirt_quantity}
                                                </span>
                                                <span className="font-semibold text-slate-900">
                                                  {formatCurrency(
                                                    reg.total_cost,
                                                  )}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                  {formatDate(reg.created_at)}
                                                </span>
                                              </div>
                                              <button
                                                onClick={() =>
                                                  togglePaymentStatus(
                                                    reg.id,
                                                    reg.payment_status,
                                                  )
                                                }
                                                disabled={
                                                  updatingPayment === reg.id
                                                }
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200 flex-shrink-0 ${
                                                  reg.payment_status === "paid"
                                                    ? "bg-green-50 text-green-600 hover:bg-green-100"
                                                    : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                                }`}
                                              >
                                                {updatingPayment === reg.id
                                                  ? "..."
                                                  : reg.payment_status ===
                                                      "paid"
                                                    ? "Paid"
                                                    : "Pending"}
                                              </button>
                                            </div>
                                            {/* Shirt recipient details */}
                                            {shirtDetails.some(
                                              (d) => d.recipient,
                                            ) && (
                                              <div className="mt-2 ml-[22px] space-y-1">
                                                {shirtDetails.map(
                                                  (d, i) =>
                                                    d.recipient && (
                                                      <div
                                                        key={i}
                                                        className="flex items-center text-xs text-slate-500"
                                                      >
                                                        <span className="text-slate-700 font-medium">
                                                          {d.size}
                                                        </span>
                                                        <span className="mx-1.5 text-slate-300">
                                                          —
                                                        </span>
                                                        <span>
                                                          {d.recipient}
                                                        </span>
                                                        {d.type && (
                                                          <span
                                                            className={`ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                                              d.type.toLowerCase() ===
                                                              "camper"
                                                                ? "bg-blue-50 text-blue-600"
                                                                : "bg-purple-50 text-purple-600"
                                                            }`}
                                                          >
                                                            {d.type}
                                                          </span>
                                                        )}
                                                      </div>
                                                    ),
                                                )}
                                              </div>
                                            )}
                                            {namesDiffer &&
                                              !shirtDetails.some(
                                                (d) => d.recipient,
                                              ) && (
                                                <p className="text-xs text-slate-400 mt-1.5 ml-[22px]">
                                                  Registered as:{" "}
                                                  <span className="font-medium text-slate-500">
                                                    {reg.kid_name}
                                                  </span>
                                                </p>
                                              )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-4">
              {grouped.map((group) => {
                const { primary, combined, hasMultiple, key } = group;
                const isExpanded = expandedRows.has(key);

                return (
                  <div
                    key={key}
                    className={`rounded-xl border bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${hasMultiple ? "border-blue-200" : "border-slate-200"}`}
                  >
                    <div
                      className="px-4 py-3 border-b border-slate-100 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpanded(key)}
                    >
                      <div className="flex items-center">
                        {isExpanded ? (
                          <FaChevronDown className="h-3 w-3 text-slate-400 mr-3" />
                        ) : (
                          <FaChevronRight className="h-3 w-3 text-slate-400 mr-3" />
                        )}
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm flex items-center">
                            {primary.kid_name}
                            {hasMultiple && (
                              <span className="ml-2 inline-flex items-center bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                <FaTshirt className="mr-0.5 h-2 w-2" />{" "}
                                {group.orders.length}
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Age: {primary.age}
                          </p>
                        </div>
                      </div>
                      {hasMultiple ? (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            combined.status === "paid"
                              ? "bg-green-50 text-green-600"
                              : combined.status === "partial"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {combined.status === "paid"
                            ? "All Paid"
                            : combined.status === "partial"
                              ? "Partial"
                              : "Pending"}
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePaymentStatus(
                              primary.id,
                              primary.payment_status,
                            );
                          }}
                          disabled={updatingPayment === primary.id}
                          className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                            primary.payment_status === "paid"
                              ? "bg-green-50 text-green-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {updatingPayment === primary.id
                            ? "..."
                            : primary.payment_status === "paid"
                              ? "Paid"
                              : "Pending"}
                        </button>
                      )}
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                            Shirts
                          </p>
                          {hasMultiple ? (
                            <>
                              <p className="font-medium text-slate-700">
                                {combined.totalShirts} total
                              </p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {combined.sizes.join(", ")}
                              </p>
                            </>
                          ) : (
                            <p className="font-medium text-slate-700">
                              {primary.shirt_size} (x{primary.shirt_quantity})
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                            Amount
                          </p>
                          <p className="font-bold text-slate-900">
                            {formatCurrency(
                              hasMultiple
                                ? combined.totalCost
                                : primary.total_cost,
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                            Parent
                          </p>
                          <p className="font-medium text-slate-700">
                            {primary.parent_name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                            CashApp
                          </p>
                          <p
                            className={
                              primary.cashapp_username
                                ? "text-green-600 font-medium"
                                : "text-slate-400"
                            }
                          >
                            {primary.cashapp_username || "Not provided"}
                          </p>
                        </div>
                      </div>

                      {isExpanded && (
                        <>
                          <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm">
                            <div className="flex items-center text-slate-500">
                              <FaPhone className="mr-2 text-slate-300 w-3.5 h-3.5" />
                              {primary.parent_phone}
                            </div>
                            <div className="flex items-center text-slate-500">
                              <FaEnvelope className="mr-2 text-slate-300 w-3.5 h-3.5" />
                              <span className="truncate">
                                {primary.parent_email}
                              </span>
                            </div>
                          </div>
                          <div className="border-t border-slate-100 pt-3 text-sm">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                              Emergency Contact
                            </p>
                            <p className="font-medium text-slate-700">
                              {primary.emergency_name} (
                              {primary.emergency_relation})
                            </p>
                            <p className="text-slate-500 text-xs mt-0.5">
                              {primary.emergency_phone}
                            </p>
                          </div>

                          {hasMultiple && (
                            <div className="border-t border-blue-100 pt-3">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                Individual Orders
                              </p>
                              <div className="space-y-2">
                                {group.orders.map((reg) => {
                                  const namesDiffer =
                                    reg.kid_name.trim().toLowerCase() !==
                                    primary.kid_name.trim().toLowerCase();
                                  const shirtDetails = parseShirtDetails(
                                    reg.shirt_size,
                                  );
                                  return (
                                    <div
                                      key={reg.id}
                                      className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <FaTshirt className="h-3 w-3 text-slate-400" />
                                          <span>
                                            {shirtDetails.length > 0 &&
                                            shirtDetails[0].recipient
                                              ? shirtDetails
                                                  .map((d) => d.size)
                                                  .join(", ")
                                              : reg.shirt_size}{" "}
                                            x{reg.shirt_quantity}
                                          </span>
                                          <span className="font-semibold">
                                            {formatCurrency(reg.total_cost)}
                                          </span>
                                        </div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            togglePaymentStatus(
                                              reg.id,
                                              reg.payment_status,
                                            );
                                          }}
                                          disabled={updatingPayment === reg.id}
                                          className={`rounded-full px-2 py-0.5 font-semibold ${
                                            reg.payment_status === "paid"
                                              ? "text-green-600"
                                              : "text-amber-600"
                                          }`}
                                        >
                                          {updatingPayment === reg.id
                                            ? "..."
                                            : reg.payment_status === "paid"
                                              ? "Paid"
                                              : "Pending"}
                                        </button>
                                      </div>
                                      {shirtDetails.some(
                                        (d) => d.recipient,
                                      ) && (
                                        <div className="mt-1.5 space-y-0.5">
                                          {shirtDetails.map(
                                            (d, i) =>
                                              d.recipient && (
                                                <div
                                                  key={i}
                                                  className="flex items-center text-[10px] text-slate-500"
                                                >
                                                  <span className="font-medium text-slate-600">
                                                    {d.size}
                                                  </span>
                                                  <span className="mx-1 text-slate-300">
                                                    —
                                                  </span>
                                                  <span>{d.recipient}</span>
                                                  {d.type && (
                                                    <span
                                                      className={`ml-1 rounded-full px-1.5 py-0.5 font-semibold ${
                                                        d.type.toLowerCase() ===
                                                        "camper"
                                                          ? "bg-blue-50 text-blue-600"
                                                          : "bg-purple-50 text-purple-600"
                                                      }`}
                                                    >
                                                      {d.type}
                                                    </span>
                                                  )}
                                                </div>
                                              ),
                                          )}
                                        </div>
                                      )}
                                      {namesDiffer &&
                                        !shirtDetails.some(
                                          (d) => d.recipient,
                                        ) && (
                                          <p className="text-[10px] text-slate-400 mt-1">
                                            Registered as:{" "}
                                            <span className="font-medium text-slate-500">
                                              {reg.kid_name}
                                            </span>
                                          </p>
                                        )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="text-xs text-slate-400 pt-3 border-t border-slate-100">
                            Registered: {formatDate(primary.created_at)}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffPanel;
