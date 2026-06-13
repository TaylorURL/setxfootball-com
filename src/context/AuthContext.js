/**
 * @module AuthContext
 * @description React context and provider for authentication state management.
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { Spinner } from "@bradley-t-t/sunday-design-system";
import AuthService from "../services/AuthService";

const AuthContext = createContext({});

/**
 * Hook to access the current auth context value.
 * @returns {{ user: object|null, userProfile: object|null, loading: boolean, signUp: Function, signIn: Function, signOut: Function, isStaff: Function, isAdmin: Function }}
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Provides authentication state and helpers to the component tree.
 * @param {{ children: React.ReactNode }} props
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: session } = await AuthService.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const loadUserProfile = async (userId) => {
    const { data: profile } = await AuthService.getUserProfile(userId);
    setUserProfile(profile);
  };

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
      await loadUserProfile(data.user.id);
    }
    return data;
  };

  const signOut = async () => {
    const { error } = await AuthService.signOut();
    if (error) throw error;
    setUser(null);
    setUserProfile(null);
  };

  /** @returns {boolean} Whether the current user has staff or admin role. */
  const isStaff = () => {
    return userProfile?.role === "staff" || userProfile?.role === "admin";
  };

  /** @returns {boolean} Whether the current user has admin role. */
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

  if (loading) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-ds-bg">
        <Spinner size="xl" className="text-ds-accent-bright" />
        <p className="text-[13px] text-ds-text-muted">Loading…</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
