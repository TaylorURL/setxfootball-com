/**
 * Dashboard - Authenticated user dashboard for viewing and editing camp registrations.
 *
 * Displays all registrations associated with the current user's email.
 * Supports inline editing of registration details within a time-limited edit window.
 * Redirects unauthenticated users to the auth page.
 *
 * @module pages/Dashboard
 * @returns {React.ReactElement} The rendered dashboard page
 */
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RegistrationService from "../../services/RegistrationService";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { SHIRT_SIZES, EMERGENCY_RELATIONS } from "../../utils/constants";
import logo from "../../assets/logo.PNG";
import {
  FaUser,
  FaChild,
  FaTshirt,
  FaPhone,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt,
  FaArrowLeft,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserShield,
  FaBars,
  FaHome,
  FaTrash,
} from "react-icons/fa";

const Dashboard = () => {
  const { user, signOut, isStaff } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    loadRegistrations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  /** Fetches all registrations for the current user's email from the database */
  const loadRegistrations = async () => {
    try {
      const { data } = await RegistrationService.getRegistrationsByEmail(
        user.email,
      );
      setRegistrations(data || []);
    } catch (err) {
      setError("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  /** Signs out the current user and redirects to the home page */
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  /**
   * Enters edit mode for a registration, populating the edit form with current values.
   * @param {Object} registration - The registration record to edit
   */
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

  /** Exits edit mode and clears the edit form state */
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  /**
   * Updates a field in the edit form state.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement>} e - The input change event
   */
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Persists the edited registration data to the database and refreshes the list.
   * @param {string} id - The registration ID to update
   */
  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const updates = {
        kid_name: editForm.kid_name,
        age: parseInt(editForm.age),
        nickname: editForm.nickname || null,
        shirt_size: editForm.shirt_size,
        shirt_quantity: parseInt(editForm.shirt_quantity),
        total_cost:
          parseInt(editForm.shirt_quantity) *
          RegistrationService.getShirtPrice(),
        parent_name: editForm.parent_name,
        parent_phone: editForm.parent_phone,
        emergency_name: editForm.emergency_name,
        emergency_phone: editForm.emergency_phone,
        emergency_relation: editForm.emergency_relation,
        cashapp_username: editForm.cashapp_username || null,
      };
      const { error } = await RegistrationService.updateRegistration(
        id,
        updates,
      );
      if (error) throw error;
      await loadRegistrations();
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError("Failed to update registration");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Deletes a registration after user confirmation.
   * @param {string} id - The registration ID to delete
   */
  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const { error } = await RegistrationService.deleteRegistration(id);
      if (error) throw error;
      setConfirmDelete(null);
      await loadRegistrations();
    } catch (err) {
      setError("Failed to delete registration");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-slate-600"></div>
      </div>
    );
  }

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
                SETX Football Camp
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className="flex items-center text-slate-500 hover:text-slate-900 transition-all duration-200 px-3 py-2 rounded-xl hover:bg-slate-100 text-sm font-medium"
              >
                <FaHome className="mr-2 h-3.5 w-3.5" />
                Home
              </Link>
              {isStaff() && (
                <Link
                  to="/staff"
                  className="flex items-center text-slate-500 hover:text-slate-900 transition-all duration-200 px-3 py-2 rounded-xl hover:bg-slate-100 text-sm font-medium"
                >
                  <FaUserShield className="mr-2 h-3.5 w-3.5" />
                  Staff Panel
                </Link>
              )}
              <div className="w-px h-6 bg-slate-200 mx-3"></div>
              <span className="text-slate-400 text-sm truncate max-w-[160px]">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all duration-200 text-sm font-medium ml-4"
              >
                <FaSignOutAlt className="mr-2 h-3.5 w-3.5" />
                Sign Out
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

        {/* Mobile menu drawer */}
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
              <FaHome className="mr-3 h-4 w-4 text-slate-400" />
              Home
            </Link>
            {isStaff() && (
              <Link
                to="/staff"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center w-full text-slate-700 hover:text-slate-900 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm font-medium"
              >
                <FaUserShield className="mr-3 h-4 w-4 text-slate-400" />
                Staff Panel
              </Link>
            )}
            <div className="border-t border-slate-100 my-1"></div>
            <button
              onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}
              className="flex items-center w-full text-slate-700 hover:text-slate-900 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all duration-200 text-sm font-medium"
            >
              <FaSignOutAlt className="mr-3 h-4 w-4 text-slate-400" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-slate-400 hover:text-slate-600 transition-all duration-200 text-sm font-medium"
          >
            <FaArrowLeft className="mr-2 h-3 w-3" />
            Back to Home
          </Link>
        </div>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            My Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            View and manage your camp registrations
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* Empty state */}
        {registrations.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-12 text-center">
            <div className="bg-slate-100 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaChild className="h-7 w-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              No Registrations Yet
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              You haven't registered any campers yet.
            </p>
            <Link
              to="/#register"
              className="inline-flex items-center bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all duration-200"
            >
              Register Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {registrations.map((reg) => {
              const canEdit = RegistrationService.canEdit(reg);
              const daysRemaining = RegistrationService.getDaysRemaining(reg);
              const isEditing = editingId === reg.id;

              return (
                <div
                  key={reg.id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Card header */}
                  <div className="px-5 sm:px-6 py-4 border-b border-slate-100">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                      <div className="flex items-center">
                        <div className="bg-blue-50 p-2 rounded-xl mr-3">
                          <FaChild className="text-blue-600 h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">
                            {isEditing ? editForm.kid_name : reg.kid_name}
                          </h3>
                          <span className="text-xs font-medium text-slate-400">
                            Registered {formatDate(reg.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            reg.payment_status === "paid"
                              ? "bg-green-50 text-green-600"
                              : "bg-amber-50 text-amber-600"
                          }`}
                        >
                          {reg.payment_status === "paid" ? "Paid" : "Pending"}
                        </span>
                        {canEdit && !isEditing && (
                          <>
                            <button
                              onClick={() => startEditing(reg)}
                              className="flex items-center text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-semibold"
                            >
                              <FaEdit className="mr-1.5 h-3 w-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => setConfirmDelete(reg)}
                              className="flex items-center text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-semibold"
                            >
                              <FaTrash className="mr-1.5 h-3 w-3" />
                              Delete
                            </button>
                          </>
                        )}
                        {!canEdit && !isEditing && (
                          <button
                            onClick={() => setConfirmDelete(reg)}
                            className="flex items-center text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-semibold"
                          >
                            <FaTrash className="mr-1.5 h-3 w-3" />
                            Delete
                          </button>
                        )}
                        {isEditing && (
                          <>
                            <button
                              onClick={() => saveEdit(reg.id)}
                              disabled={saving}
                              className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-semibold"
                            >
                              <FaSave className="mr-1.5 h-3 w-3" />
                              {saving ? "Saving..." : "Save"}
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="flex items-center text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-semibold"
                            >
                              <FaTimes className="mr-1.5 h-3 w-3" />
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Edit window indicator */}
                  {canEdit && (
                    <div className="bg-amber-50 border-b border-amber-100 px-5 sm:px-6 py-2.5 flex items-center">
                      <FaClock className="text-amber-500 mr-2 flex-shrink-0 h-3.5 w-3.5" />
                      <span className="text-amber-700 text-xs font-medium">
                        Edit available for {daysRemaining} more day
                        {daysRemaining !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}

                  {!canEdit && (
                    <div className="bg-slate-50 border-b border-slate-100 px-5 sm:px-6 py-2.5 flex items-center">
                      <FaExclamationTriangle className="text-slate-400 mr-2 flex-shrink-0 h-3.5 w-3.5" />
                      <span className="text-slate-500 text-xs font-medium">
                        Edit window expired. Contact us for changes.
                      </span>
                    </div>
                  )}

                  {/* Card body */}
                  <div className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Camper Info */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center">
                          <FaChild className="mr-2 text-blue-500 h-3 w-3" />
                          Camper Info
                        </h4>

                        {isEditing ? (
                          <div className="space-y-2.5">
                            <input
                              type="text"
                              name="kid_name"
                              value={editForm.kid_name}
                              onChange={handleEditChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 outline-none"
                              placeholder="Name"
                            />
                            <input
                              type="number"
                              name="age"
                              value={editForm.age}
                              onChange={handleEditChange}
                              min="5"
                              max="12"
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 outline-none"
                              placeholder="Age"
                            />
                            <input
                              type="text"
                              name="nickname"
                              value={editForm.nickname}
                              onChange={handleEditChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 outline-none"
                              placeholder="Nickname (optional)"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-sm">
                            <p className="text-slate-700">
                              <span className="text-slate-400 font-medium">
                                Age:
                              </span>{" "}
                              {reg.age}
                            </p>
                            {reg.nickname && (
                              <p className="text-slate-700">
                                <span className="text-slate-400 font-medium">
                                  Nickname:
                                </span>{" "}
                                {reg.nickname}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Shirt Details */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center">
                          <FaTshirt className="mr-2 text-purple-500 h-3 w-3" />
                          Shirt Details
                        </h4>

                        {isEditing ? (
                          <div className="space-y-2.5">
                            <select
                              name="shirt_size"
                              value={editForm.shirt_size}
                              onChange={handleEditChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 outline-none"
                            >
                              {SHIRT_SIZES.map((size) => (
                                <option key={size} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                            <select
                              name="shirt_quantity"
                              value={editForm.shirt_quantity}
                              onChange={handleEditChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 outline-none"
                            >
                              {[1, 2, 3, 4, 5].map((num) => (
                                <option key={num} value={num}>
                                  {num} shirt(s)
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-sm">
                            <p className="text-slate-700">
                              <span className="text-slate-400 font-medium">
                                Size:
                              </span>{" "}
                              {reg.shirt_size}
                            </p>
                            <p className="text-slate-700">
                              <span className="text-slate-400 font-medium">
                                Quantity:
                              </span>{" "}
                              {reg.shirt_quantity}
                            </p>
                            <p className="text-slate-900 font-semibold">
                              <span className="text-slate-400 font-medium">
                                Total:
                              </span>{" "}
                              {formatCurrency(reg.total_cost)}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Parent/Guardian */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center">
                          <FaUser className="mr-2 text-indigo-500 h-3 w-3" />
                          Parent/Guardian
                        </h4>

                        {isEditing ? (
                          <div className="space-y-2.5">
                            <input
                              type="text"
                              name="parent_name"
                              value={editForm.parent_name}
                              onChange={handleEditChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 outline-none"
                              placeholder="Parent Name"
                            />
                            <input
                              type="tel"
                              name="parent_phone"
                              value={editForm.parent_phone}
                              onChange={handleEditChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 outline-none"
                              placeholder="Phone"
                            />
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-sm">
                            <p className="text-slate-700">
                              <span className="text-slate-400 font-medium">
                                Name:
                              </span>{" "}
                              {reg.parent_name}
                            </p>
                            <p className="text-slate-700">
                              <span className="text-slate-400 font-medium">
                                Phone:
                              </span>{" "}
                              {reg.parent_phone}
                            </p>
                            <p className="text-slate-700">
                              <span className="text-slate-400 font-medium">
                                Email:
                              </span>{" "}
                              {reg.parent_email}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Emergency Contact */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center">
                          <FaPhone className="mr-2 text-red-500 h-3 w-3" />
                          Emergency Contact
                        </h4>

                        {isEditing ? (
                          <div className="space-y-2.5">
                            <input
                              type="text"
                              name="emergency_name"
                              value={editForm.emergency_name}
                              onChange={handleEditChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all duration-200 outline-none"
                              placeholder="Emergency Contact Name"
                            />
                            <input
                              type="tel"
                              name="emergency_phone"
                              value={editForm.emergency_phone}
                              onChange={handleEditChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all duration-200 outline-none"
                              placeholder="Phone"
                            />
                            <select
                              name="emergency_relation"
                              value={editForm.emergency_relation}
                              onChange={handleEditChange}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all duration-200 outline-none"
                            >
                              {EMERGENCY_RELATIONS.map((rel) => (
                                <option key={rel} value={rel}>
                                  {rel}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-sm">
                            <p className="text-slate-700">
                              <span className="text-slate-400 font-medium">
                                Name:
                              </span>{" "}
                              {reg.emergency_name}
                            </p>
                            <p className="text-slate-700">
                              <span className="text-slate-400 font-medium">
                                Phone:
                              </span>{" "}
                              {reg.emergency_phone}
                            </p>
                            <p className="text-slate-700">
                              <span className="text-slate-400 font-medium">
                                Relation:
                              </span>{" "}
                              {reg.emergency_relation}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* CashApp Info */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center">
                          <FaEnvelope className="mr-2 text-green-500 h-3 w-3" />
                          CashApp Info
                        </h4>

                        {isEditing ? (
                          <input
                            type="text"
                            name="cashapp_username"
                            value={editForm.cashapp_username}
                            onChange={handleEditChange}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all duration-200 outline-none"
                            placeholder="CashApp Username/Email"
                          />
                        ) : (
                          <div className="text-sm">
                            {reg.cashapp_username ? (
                              <p className="flex items-center text-green-600 font-medium">
                                <FaCheckCircle className="mr-2 h-3 w-3" />
                                {reg.cashapp_username}
                              </p>
                            ) : (
                              <span className="rounded-full px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-600">
                                Not provided
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Registration Info */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Registration Info
                        </h4>
                        <div className="space-y-1.5 text-sm">
                          <p className="text-slate-700">
                            <span className="text-slate-400 font-medium">
                              Camp Year:
                            </span>{" "}
                            {reg.camp_year}
                          </p>
                          <p className="text-slate-700">
                            <span className="text-slate-400 font-medium">
                              Registered:
                            </span>{" "}
                            {formatDate(reg.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-fade-in">
            <div className="flex items-center mb-4">
              <div className="bg-red-50 p-2.5 rounded-xl mr-3">
                <FaTrash className="text-red-500 h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Delete Registration?
              </h3>
            </div>
            <p className="text-sm text-slate-600 mb-2">
              Are you sure you want to delete the registration for{" "}
              <span className="font-semibold">{confirmDelete.kid_name}</span>?
            </p>
            <p className="text-xs text-slate-400 mb-5">
              This action cannot be undone. If you've already paid, contact us
              for a refund.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete.id)}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-all duration-200 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
