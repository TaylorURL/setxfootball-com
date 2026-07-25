// Every method resolves to `{ data, error }` and never throws. Rows are stored
// snake_case; `buildRegistrationRow` is the only place the camelCase form shape
// is translated.
import { supabase } from "../library/supabaseClient";
import {
  SHIRT_PRICE,
  EDIT_WINDOW_DAYS,
  PAYMENT_STATUSES,
} from "../utils/constants";
import { getDaysSince, getCurrentYear } from "../utils/helpers";

const REGISTRATIONS_TABLE = "camp_registrations";

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
  async createRegistration(registrationData, userId = null) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert([buildRegistrationRow(registrationData, userId)])
      .select()
      .single();

    return { data: data ?? null, error: error ?? null };
  },

  async getRegistrationById(id) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    return { data: data ?? null, error: error ?? null };
  },

  async getUserRegistrations(userId) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    return { data: data ?? [], error: error ?? null };
  },

  async getRegistrationsByEmail(email) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("*")
      .eq("parent_email", email)
      .order("created_at", { ascending: false });

    return { data: data ?? [], error: error ?? null };
  },

  async getRegistrationsByYear(year) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("*")
      .eq("camp_year", year)
      .order("created_at", { ascending: false });

    return { data: data ?? [], error: error ?? null };
  },

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

  async updateCashAppUsername(id, cashappUsername, userId) {
    return this.updateRegistration(
      id,
      { cashapp_username: cashappUsername },
      userId,
    );
  },

  async updatePaymentStatus(id, status) {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .update({ payment_status: status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    return { data: data ?? null, error: error ?? null };
  },

  canEdit(registration) {
    const daysSinceCreation = getDaysSince(registration?.created_at);
    return daysSinceCreation !== null && daysSinceCreation <= EDIT_WINDOW_DAYS;
  },

  getDaysRemaining(registration) {
    const daysSinceCreation = getDaysSince(registration?.created_at);
    if (daysSinceCreation === null) return 0;
    return Math.max(0, EDIT_WINDOW_DAYS - daysSinceCreation);
  },

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
