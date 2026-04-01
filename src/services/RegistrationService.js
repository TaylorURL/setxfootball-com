/**
 * @module RegistrationService
 * @description Handles camp registration CRUD operations and business logic.
 */
import { supabase } from "../library/supabaseClient";
import { SHIRT_PRICE, EDIT_WINDOW_DAYS } from "../utils/constants";

const RegistrationService = {
  /**
   * Creates a new camp registration.
   * @param {object} registrationData - Form data for the registration.
   * @param {string|null} [userId=null] - Optional authenticated user ID.
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
  async createRegistration(registrationData, userId = null) {
    const currentYear = new Date().getFullYear();
    const totalCost = registrationData.shirtQuantity * SHIRT_PRICE;

    const { data, error } = await supabase
      .from("camp_registrations")
      .insert([
        {
          user_id: userId,
          kid_name: registrationData.kidName,
          age: parseInt(registrationData.age, 10),
          nickname: registrationData.nickname || null,
          shirt_size: registrationData.shirtSize,
          shirt_quantity: parseInt(registrationData.shirtQuantity, 10),
          total_cost: totalCost,
          parent_name: registrationData.parentName,
          parent_phone: registrationData.parentPhone,
          parent_email: registrationData.parentEmail,
          emergency_name: registrationData.emergencyName,
          emergency_phone: registrationData.emergencyPhone,
          emergency_relation: registrationData.emergencyRelation,
          cashapp_username: registrationData.cashappUsername || null,
          payment_status: "pending",
          camp_year: currentYear,
        },
      ])
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
      .from("camp_registrations")
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
      .from("camp_registrations")
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
      .from("camp_registrations")
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
      .from("camp_registrations")
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
      .from("camp_registrations")
      .select("camp_year")
      .order("camp_year", { ascending: false });

    if (error) {
      return { data: [new Date().getFullYear()], error };
    }

    const uniqueYears = [...new Set(data.map((r) => r.camp_year))];
    return {
      data: uniqueYears.length > 0 ? uniqueYears : [new Date().getFullYear()],
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
      .from("camp_registrations")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
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
    return this.updateRegistration(id, { cashapp_username: cashappUsername }, userId);
  },

  /**
   * Updates the payment status on a registration. Staff-only; no user scoping applied.
   * @param {string} id
   * @param {string} status
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
  async updatePaymentStatus(id, status) {
    const { data, error } = await supabase
      .from("camp_registrations")
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
    if (!registration?.created_at) return false;

    const createdAt = new Date(registration.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= EDIT_WINDOW_DAYS;
  },

  /**
   * Returns the number of days remaining in the edit window for a registration.
   * @param {object} registration
   * @returns {number}
   */
  getDaysRemaining(registration) {
    if (!registration?.created_at) return 0;

    const createdAt = new Date(registration.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, EDIT_WINDOW_DAYS - diffDays);
  },

  /**
   * Deletes a registration by ID, scoped to the owning user to prevent IDOR.
   * @param {string} id
   * @param {string} userId - The authenticated user's ID; the delete is a no-op if it doesn't match.
   * @returns {Promise<{error: Error|null}>}
   */
  async deleteRegistration(id, userId) {
    const { error } = await supabase
      .from("camp_registrations")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
    return { error: error ?? null };
  },

  /**
   * Returns the per-shirt price.
   * @returns {number}
   */
  getShirtPrice() {
    return SHIRT_PRICE;
  },
};

export default RegistrationService;
