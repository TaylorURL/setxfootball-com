// Supabase access for camp registrations.
//
// Every method resolves to `{ data, error }` and never throws. Rows are stored
// snake_case; `buildRegistrationRow` is the only place the camelCase form shape
// is translated.
import { getSupabase } from "../library/supabaseClient";
import { SHIRT_PRICE, EDIT_WINDOW_DAYS, PAYMENT_STATUSES } from "../utils/constants";
import { getDaysSince, getCurrentYear } from "../utils/helpers";

const REGISTRATIONS_TABLE = "camp_registrations";

// The boundary between the form's shape and the table's. Everything downstream
// of here is a database row, and nothing upstream needs to know the column
// names. `total_cost` and `camp_year` are derived here rather than accepted
// from the caller so a client cannot set its own price or backdate a sign-up.
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
  // The row id is minted here rather than read back from the insert. The select
  // policy identifies a family by its session, and a parent filing without an
  // account has none, so the returning clause on their insert would come back
  // empty and the payment page would have no registration to show.
  async createRegistration(registrationData, userId = null) {
    const supabase = await getSupabase();
    const row = { id: crypto.randomUUID(), ...buildRegistrationRow(registrationData, userId) };
    const { error } = await supabase.from(REGISTRATIONS_TABLE).insert([row]);

    return { data: error ? null : row, error: error ?? null };
  },

  async getRegistrationById(id) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("*")
      .eq("id", id)
      .single();

    return { data: data ?? null, error: error ?? null };
  },

  async getRegistrationsByEmail(email) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("*")
      .eq("parent_email", email)
      .order("created_at", { ascending: false });

    return { data: data ?? [], error: error ?? null };
  },

  async getRegistrationsByYear(year) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select("*")
      .eq("camp_year", year)
      .order("created_at", { ascending: false });

    return { data: data ?? [], error: error ?? null };
  },

  // Falls back to the current year rather than an empty list, so a failed read
  // still leaves the staff panel with a year to filter by.
  async getAllYears() {
    const supabase = await getSupabase();
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

  // Names the row and nothing else. Which rows this account may touch is the
  // update policy's answer, and a predicate repeated here would only be a
  // second copy of it that the browser is free to drop.
  async updateRegistration(id, updates) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    return { data: data ?? null, error: error ?? null };
  },

  async updateCashAppUsername(id, cashappUsername) {
    return this.updateRegistration(id, { cashapp_username: cashappUsername });
  },

  // Deliberately not constrained by user id: verifying payment is a staff
  // action against someone else's row, and the staff policy is what authorises
  // it. This is the one write that crosses owners.
  async updatePaymentStatus(id, status) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .update({ payment_status: status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    return { data: data ?? null, error: error ?? null };
  },

  // The edit window runs from creation, not from the camp date, so a parent who
  // signs up early still gets the same number of days to correct a shirt size.
  canEdit(registration) {
    const daysSinceCreation = getDaysSince(registration?.created_at);
    return daysSinceCreation !== null && daysSinceCreation <= EDIT_WINDOW_DAYS;
  },

  getDaysRemaining(registration) {
    const daysSinceCreation = getDaysSince(registration?.created_at);
    if (daysSinceCreation === null) return 0;
    return Math.max(0, EDIT_WINDOW_DAYS - daysSinceCreation);
  },

  async deleteRegistration(id) {
    const supabase = await getSupabase();
    const { error } = await supabase.from(REGISTRATIONS_TABLE).delete().eq("id", id);
    return { error: error ?? null };
  },
};

export default RegistrationService;
