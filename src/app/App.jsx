/**
 * @module App
 * @description Root component. Wraps the app in AuthProvider and defines the
 * client-side routes. The public site is split across its own pages — Home (/),
 * About (/about), Gallery (/gallery), Sponsors (/sponsors), Register
 * (/register) — alongside Auth, the authenticated Dashboard and StaffPanel,
 * Payment, and the legal pages.
 */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import HomePage from "../pages/HomePage/HomePage";
import AboutPage from "../pages/AboutPage/AboutPage";
import GalleryPage from "../pages/GalleryPage/GalleryPage";
import SponsorsPage from "../pages/SponsorsPage/SponsorsPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import AuthPage from "../pages/AuthPage/AuthPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import StaffPanel from "../pages/StaffPanel/StaffPanel";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import PrivacyPage from "../pages/PrivacyPage/PrivacyPage";
import TermsPage from "../pages/TermsPage/TermsPage";
import ScrollToTop from "../components/ScrollToTop";
import ProtectedRoute from "../components/routing/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/sponsors" element={<SponsorsPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute requireStaff>
                <StaffPanel />
              </ProtectedRoute>
            }
          />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
