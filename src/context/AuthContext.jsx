/**
 * Session state for the whole app: who is signed in, the profile row that
 * carries their role, and whether either is known yet.
 *
 * Two things are worth knowing before calling into it. The mutating methods
 * throw on failure rather than returning the `{ data, error }` pair the service
 * layer uses, because a form has somewhere to show a caught error and a context
 * does not. And `user` and `userProfile` arrive separately: the role flags read
 * the profile, so they answer false during the window where a user is known but
 * their profile is still loading. Anything gating on a role must wait for
 * `loading` to clear rather than for `user` to appear.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import { hasStoredSession } from "../library/supabaseClient";

const AuthContext = createContext({});

/** @returns {{ user: object|null, userProfile: object|null, loading: boolean, signUp: Function, signIn: Function, signOut: Function, isStaff: Function, isAdmin: Function }} */
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Asking the auth server who this is means downloading the client to ask
      // with, and the client is the largest chunk the site has. A browser
      // holding nothing that could become a session has already answered the
      // question, and that is every visitor who came to read about the camp,
      // so the download is skipped rather than spent to be told nobody is
      // signed in. Anyone who might be still goes the long way round.
      if (!hasStoredSession()) {
        setLoading(false);
        return;
      }

      try {
        const { data: verified } = await AuthService.getVerifiedUser();
        setUser(verified ?? null);
        if (verified) {
          await loadUserProfile();
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // A missing or unreadable profile leaves the role flags false, which is the
  // safe answer: a user whose role cannot be established is not staff.
  const loadUserProfile = async () => {
    const { data: profile } = await AuthService.getCurrentProfile();
    setUserProfile(profile);
  };

  // Deliberately does not set the user. Sign-up sends a verification email, so
  // the account exists but no session does until the address is confirmed and
  // the parent signs in.
  const signUp = async (email, password, fullName) => {
    const { data, error } = await AuthService.signUp(email, password, fullName);
    if (error) throw error;
    return data;
  };

  const signIn = async (email, password) => {
    const { data, error } = await AuthService.signIn(email, password);
    if (error) throw error;
    setUser(data.user);
    if (data.user) {
      await loadUserProfile();
    }
    return data;
  };

  const signOut = async () => {
    const { error } = await AuthService.signOut();
    if (error) throw error;
    setUser(null);
    setUserProfile(null);
  };

  // Admins count as staff.
  const isStaff = () => {
    return userProfile?.role === "staff" || userProfile?.role === "admin";
  };

  const isAdmin = () => {
    return userProfile?.role === "admin";
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    isStaff,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
