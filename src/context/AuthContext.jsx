import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";

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
