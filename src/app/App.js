import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import HomePage from "../pages/HomePage/HomePage";
import AuthPage from "../pages/AuthPage/AuthPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import StaffPanel from "../pages/StaffPanel/StaffPanel";
import PaymentPage from "../pages/PaymentPage/PaymentPage";

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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
