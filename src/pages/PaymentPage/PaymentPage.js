import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import RegistrationService from '../../services/RegistrationService';
import { formatCurrency } from '../../utils/helpers';
import { CASHAPP_USERNAME, SHIRT_PRICE } from '../../utils/constants';
import logo from '../../assets/logo.PNG';
import {
  FaCheckCircle,
  FaDollarSign,
  FaArrowLeft,
  FaCopy,
  FaChild,
  FaTshirt,
  FaUser
} from 'react-icons/fa';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [cashappUsername, setCashappUsername] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const regData = location.state?.registration;
    if (!regData) {
      navigate('/');
      return;
    }
    setRegistration(regData);
    setCashappUsername(regData.cashapp_username || '');
  }, [location.state, navigate]);

  const handleSaveCashApp = async () => {
    if (!cashappUsername.trim() || !registration) return;

    setSaving(true);
    try {
      await RegistrationService.updateCashAppUsername(registration.id, cashappUsername);
      setSaved(true);
    } catch (err) {
      console.error('Error saving CashApp:', err);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CASHAPP_USERNAME);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!registration) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const totalAmount = registration.total_cost || (registration.shirt_quantity * SHIRT_PRICE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 py-12 px-4">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-accent-400 to-primary-500"></div>

      <div className="absolute top-10 right-20 w-72 h-72 bg-accent-400 rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-10 left-20 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-5"></div>

      <div className="max-w-2xl mx-auto relative">
        <Link
          to="/"
          className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaCheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Registration Complete!</h1>
            <p className="text-green-100">Thank you for registering for SETX Football Camp</p>
          </div>

          <div className="p-8">
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaChild className="mr-2 text-primary-600" />
                Registration Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Camper Name:</span>
                  <span className="font-bold text-gray-900">{registration.kid_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-bold text-gray-900">{registration.age}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <FaTshirt className="mr-1" /> Shirt Size:
                  </span>
                  <span className="font-bold text-gray-900">{registration.shirt_size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-bold text-gray-900">{registration.shirt_quantity} shirt(s)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center">
                    <FaUser className="mr-1" /> Parent:
                  </span>
                  <span className="font-bold text-gray-900">{registration.parent_name}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-2xl p-6 mb-8 border-2 border-accent-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaDollarSign className="mr-2 text-accent-600" />
                Payment Required
              </h2>

              <div className="text-center mb-6">
                <p className="text-gray-600 mb-2">Total Amount Due</p>
                <p className="text-5xl font-black text-accent-600">{formatCurrency(totalAmount)}</p>
                <p className="text-gray-500 mt-2">${SHIRT_PRICE} per shirt × {registration.shirt_quantity} shirt(s)</p>
              </div>

              <div className="bg-white rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2 text-center">Send payment via CashApp to:</p>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-3xl font-black text-green-600">${CASHAPP_USERNAME}</span>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                  >
                    <FaCopy className="mr-1" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 text-center">
                Please include your child's name in the payment note
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Your CashApp Info</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Provide your CashApp username or email so we can verify your payment:
              </p>

              <div className="flex space-x-3">
                <input
                  type="text"
                  value={cashappUsername}
                  onChange={(e) => setCashappUsername(e.target.value)}
                  placeholder="$username or email"
                  disabled={saved}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:bg-gray-100 disabled:text-gray-500"
                />
                <button
                  onClick={handleSaveCashApp}
                  disabled={saving || saved || !cashappUsername.trim()}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    saved 
                      ? 'bg-green-500 text-white' 
                      : 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
                  }`}
                >
                  {saving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
                </button>
              </div>

              {saved && (
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <FaCheckCircle className="mr-1" />
                  CashApp info saved successfully!
                </p>
              )}
            </div>

            <div className="text-center">
              <Link
                to="/auth"
                className="inline-block bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-bold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl"
              >
                Create Account to View Dashboard
              </Link>
              <p className="text-gray-500 text-sm mt-3">
                Create an account using the same email to track your registration
              </p>
            </div>
          </div>

          <div className="bg-gray-50 px-8 py-6 border-t">
            <div className="flex items-center justify-center">
              <img src={logo} alt="SETX Football Camp" className="h-12 w-12 object-contain" />
              <div className="ml-3">
                <p className="font-bold text-gray-900">SETX Football Camp</p>
                <p className="text-sm text-gray-500">See you at camp!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

