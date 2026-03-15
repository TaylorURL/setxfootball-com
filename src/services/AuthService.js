/**
 * @module AuthService
 * @description Handles all authentication and user profile operations via Supabase.
 */
import { supabase } from "../library/supabaseClient";

const AuthService = {
  /**
   * Registers a new user with email, password, and full name.
   * @param {string} email
   * @param {string} password
   * @param {string} fullName
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
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

  /**
   * Signs in a user with email and password.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data: data ?? null, error: error ?? null };
  },

  /**
   * Signs out the current user.
   * @returns {Promise<{data: null, error: Error|null}>}
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { data: null, error: error ?? null };
  },

  /**
   * Returns the currently authenticated user, or null.
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { data: user ?? null, error: error ?? null };
  },

  /**
   * Returns the current auth session, or null.
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { data: session ?? null, error: error ?? null };
  },

  /**
   * Fetches a user profile by user ID.
   * @param {string} userId
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    return { data: data ?? null, error: error ?? null };
  },

  /**
   * Updates (upserts) a user's role in their profile.
   * @param {string} userId
   * @param {string} role
   * @returns {Promise<{data: object|null, error: Error|null}>}
   */
  async updateUserRole(userId, role) {
    const { data, error } = await supabase.from("user_profiles").upsert({
      user_id: userId,
      role: role,
      updated_at: new Date().toISOString(),
    });

    return { data: data ?? null, error: error ?? null };
  },

  /**
   * Checks whether a user has staff or admin privileges.
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async isStaff(userId) {
    const { data: profile } = await this.getUserProfile(userId);
    return profile?.role === "staff" || profile?.role === "admin";
  },

  /**
   * Subscribes to auth state changes.
   * @param {Function} callback
   * @returns {{ data: { subscription: object } }}
   */
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default AuthService;
