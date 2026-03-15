/**
 * @module App
 * @description Root component. Wraps the app in AuthProvider and defines
 * client-side routes: Home (/), Auth (/auth), Dashboard (/dashboard),
 * Staff panel (/staff), and Payment (/payment).
 */
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import HomePage from "../pages/HomePage/HomePage";
import AuthPage from "../pages/AuthPage/AuthPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import StaffPanel from "../pages/StaffPanel/StaffPanel";
import PaymentPage from "../pages/PaymentPage/PaymentPage";
import PrivacyPage from "../pages/PrivacyPage/PrivacyPage";
import TermsPage from "../pages/TermsPage/TermsPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/staff" element={<StaffPanel />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
