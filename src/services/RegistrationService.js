import { supabase } from '../library/supabaseClient';

const SHIRT_PRICE = 5;
const EDIT_WINDOW_DAYS = 3;

const RegistrationService = {
  async createRegistration(registrationData, userId = null) {
    const currentYear = new Date().getFullYear();
    const totalCost = registrationData.shirtQuantity * SHIRT_PRICE;

    const { data, error } = await supabase
      .from('camp_registrations')
      .insert([{
        user_id: userId,
        kid_name: registrationData.kidName,
        age: parseInt(registrationData.age),
        nickname: registrationData.nickname || null,
        shirt_size: registrationData.shirtSize,
        shirt_quantity: parseInt(registrationData.shirtQuantity),
        total_cost: totalCost,
        parent_name: registrationData.parentName,
        parent_phone: registrationData.parentPhone,
        parent_email: registrationData.parentEmail,
        emergency_name: registrationData.emergencyName,
        emergency_phone: registrationData.emergencyPhone,
        emergency_relation: registrationData.emergencyRelation,
        cashapp_username: registrationData.cashappUsername || null,
        payment_status: 'pending',
        camp_year: currentYear
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRegistrationById(id) {
    const { data, error } = await supabase
      .from('camp_registrations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserRegistrations(userId) {
    const { data, error } = await supabase
      .from('camp_registrations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getRegistrationsByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('camp_registrations')
        .select('*')
        .eq('parent_email', email)
        .order('created_at', { ascending: false });

      if (error) return [];
      return data || [];
    } catch (error) {
      return [];
    }
  },

  async getRegistrationsByYear(year) {
    try {
      const { data, error } = await supabase
        .from('camp_registrations')
        .select('*')
        .eq('camp_year', year)
        .order('created_at', { ascending: false });

      if (error) return [];
      return data || [];
    } catch (error) {
      return [];
    }
  },

  async getAllYears() {
    try {
      const { data, error } = await supabase
        .from('camp_registrations')
        .select('camp_year')
        .order('camp_year', { ascending: false });

      if (error) return [new Date().getFullYear()];
      const uniqueYears = [...new Set(data.map(r => r.camp_year))];
      return uniqueYears.length > 0 ? uniqueYears : [new Date().getFullYear()];
    } catch (error) {
      return [new Date().getFullYear()];
    }
  },

  async updateRegistration(id, updates) {
    const { data, error } = await supabase
      .from('camp_registrations')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCashAppUsername(id, cashappUsername) {
    return this.updateRegistration(id, { cashapp_username: cashappUsername });
  },

  async updatePaymentStatus(id, status) {
    return this.updateRegistration(id, { payment_status: status });
  },

  canEdit(registration) {
    if (!registration?.created_at) return false;

    const createdAt = new Date(registration.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= EDIT_WINDOW_DAYS;
  },

  getDaysRemaining(registration) {
    if (!registration?.created_at) return 0;

    const createdAt = new Date(registration.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return Math.max(0, EDIT_WINDOW_DAYS - diffDays);
  },

  getShirtPrice() {
    return SHIRT_PRICE;
  }
};

export default RegistrationService;

