/**
 * @module RegistrationService
 * @description Handles camp registration CRUD operations and business logic.
 */
import { supabase } from "../library/supabaseClient";
import {
  SHIRT_PRICE,
  EDIT_WINDOW_DAYS,
  PAYMENT_STATUSES,
} from "../utils/constants";
import { getDaysSince, getCurrentYear } from "../utils/helpers";

const REGISTRATIONS_TABLE = "camp_registrations";

/**
 * Maps camelCase form data to snake_case database columns.
 * @param {object} formData - Registration form data.
 * @param {string|null} userId - Optional authenticated user ID.
 * @returns {object} Database-ready row.
 */
const buildRegistrationRow = (formData, userId) => ({
  user_id: userId,
  kid_name: formData.kidName,
  age: parseInt(formData.age, 10),
  nickname: formData.nickname || null,
  shirt_size: formData.shirtSize,
  shirt_quantity: parseInt(formData.shirtQuantity, 10),
  total_cost: formData.shirtQuantity * SHIRT_PRICE,
  parent_name: formData.parentName,
  parent_phone: formData.parentPhone,
  parent_email: formData.parentEmail,
  emergency_name: formData.emergencyName,
  emergency_phone: formData.emergencyPhone,
  emergency_relation: formData.emergencyRelation,
  cashapp_username: formData.cashappUsername || null,
  payment_status: PAYMENT_STATUSES.PENDING,
  camp_year: getCurrentYear(),
});

const RegistrationService = {
  /**
   * Creates a new camp registration.
   * @param {object} registrationData - Form data for the registration.
   * @param {string|null} [userId=null] - Optional authenticated user ID.
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
  async createRegistration(registrationData, userId = null) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert([buildRegistrationRow(registrationData, userId)])
      .select()
      .single();

    return { data: data ?? null, error: error ?? null };
  },

  /**
   * Fetches a single registration by its ID.
   * @param {string} id
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
  async getRegistrationById(id) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    return { data: data ?? null, error: error ?? null };
  },

  /**
   * Fetches all registrations for a given user.
   * @param {string} userId
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getUserRegistrations(userId) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return { data: data ?? [], error: error ?? null };
  },

  /**
   * Fetches all registrations matching a parent email address.
   * @param {string} email
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getRegistrationsByEmail(email) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("*")
      .eq("parent_email", email)
      .order("created_at", { ascending: false });

    return { data: data ?? [], error: error ?? null };
  },

  /**
   * Fetches all registrations for a given camp year.
   * @param {number} year
   * @returns {Promise<{data: Array, error: Error|null}>}
   */
  async getRegistrationsByYear(year) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("*")
      .eq("camp_year", year)
      .order("created_at", { ascending: false });

    return { data: data ?? [], error: error ?? null };
  },

  /**
   * Returns a list of all distinct camp years, falling back to the current year.
   * @returns {Promise<{data: number[], error: Error|null}>}
   */
  async getAllYears() {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("camp_year")
      .order("camp_year", { ascending: false });

    const fallback = [getCurrentYear()];

    if (error) return { data: fallback, error };

    const uniqueYears = [...new Set(data.map((row) => row.camp_year))];
    return {
      data: uniqueYears.length > 0 ? uniqueYears : fallback,
      error: null,
    };
  },

  /**
   * Updates a registration by ID, scoped to the owning user to prevent IDOR.
   * @param {string} id
   * @param {object} updates
   * @param {string} userId - The authenticated user's ID; the update is a no-op if it doesn't match.
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
  async updateRegistration(id, updates, userId) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    return { data: data ?? null, error: error ?? null };
  },

  /**
   * Updates the CashApp username on a registration.
   * @param {string} id
   * @param {string} cashappUsername
   * @param {string} userId - The authenticated user's ID.
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
  async updateCashAppUsername(id, cashappUsername, userId) {
    return this.updateRegistration(
      id,
      { cashapp_username: cashappUsername },
      userId,
    );
  },

  /**
   * Updates the payment status on a registration. Staff-only; no user scoping applied.
   * @param {string} id
   * @param {string} status
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
  async updatePaymentStatus(id, status) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .update({ payment_status: status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    return { data: data ?? null, error: error ?? null };
  },

  /**
   * Checks whether a registration is still within the editable window.
   * @param {object} registration
   * @returns {boolean}
   */
  canEdit(registration) {
    const daysSinceCreation = getDaysSince(registration?.created_at);
    return daysSinceCreation !== null && daysSinceCreation <= EDIT_WINDOW_DAYS;
  },

  /**
   * Returns the number of days remaining in the edit window for a registration.
   * @param {object} registration
   * @returns {number}
   */
  getDaysRemaining(registration) {
    const daysSinceCreation = getDaysSince(registration?.created_at);
    if (daysSinceCreation === null) return 0;
    return Math.max(0, EDIT_WINDOW_DAYS - daysSinceCreation);
  },

  /**
   * Deletes a registration by ID, scoped to the owning user to prevent IDOR.
   * @param {string} id
   * @param {string} userId - The authenticated user's ID; the delete is a no-op if it doesn't match.
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteRegistration(id, userId) {
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    return { error: error ?? null };
  },
};

export default RegistrationService;
