import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/AuthService';

const AuthContext = createContext({});

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
        const session = await AuthService.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const loadUserProfile = async (userId) => {
    try {
      const profile = await AuthService.getUserProfile(userId);
      setUserProfile(profile);
    } catch (error) {
      setUserProfile(null);
    }
  };

  const signUp = async (email, password, fullName) => {
    const data = await AuthService.signUp(email, password, fullName);
    return data;
  };

  const signIn = async (email, password) => {
    const data = await AuthService.signIn(email, password);
    setUser(data.user);
    if (data.user) {
      await loadUserProfile(data.user.id);
    }
    return data;
  };

  const signOut = async () => {
    await AuthService.signOut();
    setUser(null);
    setUserProfile(null);
  };

  const isStaff = () => {
    return userProfile?.role === 'staff' || userProfile?.role === 'admin';
  };

  const isAdmin = () => {
    return userProfile?.role === 'admin';
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signOut,
    isStaff,
    isAdmin
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

