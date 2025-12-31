import { supabase } from '../library/supabaseClient';

const AuthService = {
  async signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'user'
        }
      }
    });

    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) return null;
      return data;
    } catch (error) {
      return null;
    }
  },

  async updateUserRole(userId, role) {
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        role: role,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    return data;
  },

  async isStaff(userId) {
    const profile = await this.getUserProfile(userId);
    return profile?.role === 'staff' || profile?.role === 'admin';
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

export default AuthService;

