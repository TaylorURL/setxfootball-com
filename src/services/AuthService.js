// Supabase access for authentication and the profile row that carries a user's
// role.
//
// Every method resolves to `{ data, error }` and never throws: Supabase errors
// come back in `error`, so callers branch rather than try/catch. The two
// exceptions are marked where they sit.
import { getSupabase } from "../library/supabaseClient";

const AuthService = {
  async signUp(email, password, fullName) {
    const supabase = await getSupabase();
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
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data: data ?? null, error: error ?? null };
  },

  async signOut() {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signOut();
    return { data: null, error: error ?? null };
  },

  async getCurrentUser() {
    const supabase = await getSupabase();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { data: user ?? null, error: error ?? null };
  },

  // Asks the auth server who this is rather than reading the stored session.
  // The stored copy is whatever the browser holds, so a role decided from it is
  // a role decided from user input.
  async getVerifiedUser() {
    const supabase = await getSupabase();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { data: user ?? null, error: error ?? null };
  },

  // The row is chosen by the session the database reads, not by an id the
  // browser sends: `current_profile` resolves `auth.uid()` server-side, so a
  // caller cannot ask for somebody else's profile by passing their id. An
  // account with no profile row yet resolves to null rather than an error.
  async getCurrentProfile() {
    const supabase = await getSupabase();
    const { data, error } = await supabase.rpc("current_profile");
    const profile = Array.isArray(data) ? (data[0] ?? null) : (data ?? null);
    return { data: profile, error: error ?? null };
  },

  // The update policy on `user_profiles` admits staff and nobody else, so a
  // call from an ordinary account comes back with an error and changes nothing.
  async updateUserRole(profileId, role) {
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("user_profiles")
      .update({ role: role, updated_at: new Date().toISOString() })
      .eq("id", profileId);

    return { data: data ?? null, error: error ?? null };
  },

  // Departs from the module's `{ data, error }` shape and answers a plain
  // boolean, because the question has no useful failure mode: a profile that
  // cannot be read is not staff.
  async isStaff() {
    const { data: profile } = await this.getCurrentProfile();
    return profile?.role === "staff" || profile?.role === "admin";
  },

  // Returns Supabase's own `{ data: { subscription } }` handle unchanged. The
  // caller owns it and must unsubscribe, or the callback outlives the component
  // that registered it.
  async onAuthStateChange(callback) {
    const supabase = await getSupabase();
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default AuthService;
