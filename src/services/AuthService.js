// Every method resolves to `{ data, error }` and never throws — Supabase errors
// come back in `error`, so callers branch rather than try/catch.
import { supabase } from "../library/supabaseClient";

const AuthService = {
  async signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "user",
        },
      },
    });

    return { data: data ?? null, error: error ?? null };
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data: data ?? null, error: error ?? null };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { data: null, error: error ?? null };
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { data: user ?? null, error: error ?? null };
  },

  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { data: session ?? null, error: error ?? null };
  },

  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    return { data: data ?? null, error: error ?? null };
  },

  async updateUserRole(userId, role) {
    const { data, error } = await supabase.from("user_profiles").upsert({
      user_id: userId,
      role: role,
      updated_at: new Date().toISOString(),
    });

    return { data: data ?? null, error: error ?? null };
  },

  async isStaff(userId) {
    const { data: profile } = await this.getUserProfile(userId);
    return profile?.role === "staff" || profile?.role === "admin";
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default AuthService;
