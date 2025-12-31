import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RegistrationService from '../../services/RegistrationService';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { getCurrentYear } from '../../utils/helpers';
import logo from '../../assets/logo.PNG';
import {
  FaUserShield,
  FaSignOutAlt,
  FaArrowLeft,
  FaChild,
  FaTshirt,
  FaPhone,
  FaEnvelope,
  FaDollarSign,
  FaCalendarAlt,
  FaSearch,
  FaCheckCircle,
  FaClock,
  FaFilter,
  FaDownload,
  FaUser,
  FaBars,
  FaTimes,
  FaHome
} from 'react-icons/fa';

const StaffPanel = () => {
  const { user, signOut, isStaff } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(getCurrentYear());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [updatingPayment, setUpdatingPayment] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (!isStaff()) {
      navigate('/dashboard');
      return;
    }

    loadData();
  }, [user, isStaff, navigate]);

  useEffect(() => {
    if (selectedYear) {
      loadRegistrations(selectedYear);
    }
  }, [selectedYear]);

  const loadData = async () => {
    try {
      const availableYears = await RegistrationService.getAllYears();
      if (availableYears.length > 0) {
        setYears(availableYears);
        if (!availableYears.includes(selectedYear)) {
          setSelectedYear(availableYears[0]);
        }
      } else {
        setYears([getCurrentYear()]);
      }
    } catch (err) {
      console.error('Error loading years:', err);
      setYears([getCurrentYear()]);
    }
  };

  const loadRegistrations = async (year) => {
    setLoading(true);
    try {
      const data = await RegistrationService.getRegistrationsByYear(year);
      setRegistrations(data || []);
    } catch (err) {
      console.error('Error loading registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const togglePaymentStatus = async (id, currentStatus) => {
    setUpdatingPayment(id);
    try {
      const newStatus = currentStatus === 'paid' ? 'pending' : 'paid';
      await RegistrationService.updatePaymentStatus(id, newStatus);
      await loadRegistrations(selectedYear);
    } catch (err) {
      console.error('Error updating payment:', err);
    } finally {
      setUpdatingPayment(null);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch =
      reg.kid_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.parent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.parent_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPayment =
      paymentFilter === 'all' ||
      reg.payment_status === paymentFilter;

    return matchesSearch && matchesPayment;
  });

  const stats = {
    total: registrations.length,
    paid: registrations.filter(r => r.payment_status === 'paid').length,
    pending: registrations.filter(r => r.payment_status === 'pending').length,
    totalRevenue: registrations.reduce((sum, r) => sum + (r.total_cost || 0), 0),
    paidRevenue: registrations.filter(r => r.payment_status === 'paid').reduce((sum, r) => sum + (r.total_cost || 0), 0)
  };

  const exportToCSV = () => {
    const headers = ['Kid Name', 'Age', 'Nickname', 'Shirt Size', 'Quantity', 'Total', 'Parent Name', 'Parent Phone', 'Parent Email', 'Emergency Name', 'Emergency Phone', 'Emergency Relation', 'CashApp', 'Payment Status', 'Registered'];

    const rows = filteredRegistrations.map(r => [
      r.kid_name,
      r.age,
      r.nickname || '',
      r.shirt_size,
      r.shirt_quantity,
      r.total_cost,
      r.parent_name,
      r.parent_phone,
      r.parent_email,
      r.emergency_name,
      r.emergency_phone,
      r.emergency_relation,
      r.cashapp_username || '',
      r.payment_status,
      formatDate(r.created_at)
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `setx-registrations-${selectedYear}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gradient-to-r from-primary-800 via-primary-900 to-primary-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="SETX Football Camp" className="h-10 w-10 object-contain" />
              <span className="ml-3 text-lg sm:text-xl font-bold text-white hidden sm:block">Staff Panel</span>
              <span className="ml-3 text-lg font-bold text-white sm:hidden">Staff</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-white/80 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <FaHome className="mr-2" />
                Home
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center text-white/80 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <FaUser className="mr-2" />
                Dashboard
              </Link>
              <span className="text-white/80 text-sm truncate max-w-[150px]">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="flex items-center text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
              >
                <FaSignOutAlt className="mr-2" />
                Sign Out
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
            >
              {mobileMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-primary-900/95 px-4 py-4 space-y-2">
            <p className="text-white/60 text-sm px-4 truncate">{user?.email}</p>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center w-full text-white/90 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10"
            >
              <FaHome className="mr-3" />
              Home
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center w-full text-white/90 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10"
            >
              <FaUser className="mr-3" />
              Dashboard
            </Link>
            <button
              onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
              className="flex items-center w-full text-white/90 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10"
            >
              <FaSignOutAlt className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-4 sm:mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors text-sm sm:text-base"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-4 sm:mb-8 flex flex-col gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <FaUserShield className="mr-2 sm:mr-3 text-primary-600" />
              Staff Panel
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Manage camp registrations by year</p>
          </div>

          <div className="flex items-center space-x-3">
            <FaCalendarAlt className="text-primary-600" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border-2 border-primary-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 font-bold text-primary-700"
            >
              {years.map(year => (
                <option key={year} value={year}>{year} Season</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <FaChild className="text-primary-600 h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</span>
            </div>
            <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">Total</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <FaCheckCircle className="text-green-500 h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-2xl sm:text-3xl font-bold text-green-600">{stats.paid}</span>
            </div>
            <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">Paid</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <FaClock className="text-yellow-500 h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending}</span>
            </div>
            <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">Pending</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <FaDollarSign className="text-green-600 h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-lg sm:text-2xl font-bold text-green-600">{formatCurrency(stats.paidRevenue)}</span>
            </div>
            <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">Collected</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <FaDollarSign className="text-primary-600 h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-lg sm:text-2xl font-bold text-primary-600">{formatCurrency(stats.totalRevenue)}</span>
            </div>
            <p className="text-gray-600 mt-1 sm:mt-2 text-xs sm:text-sm">Expected</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm sm:text-base"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex items-center space-x-2 flex-1">
                <FaFilter className="text-gray-400" />
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 text-sm sm:text-base"
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid Only</option>
                  <option value="pending">Pending Only</option>
                </select>
              </div>

              <button
                onClick={exportToCSV}
                className="flex items-center justify-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                <FaDownload className="mr-2" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
            <FaChild className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Registrations Found</h3>
            <p className="text-gray-600 text-sm sm:text-base">No registrations match your search criteria for {selectedYear}.</p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Camper</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Shirt</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Parent</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Emergency</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">CashApp</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRegistrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-900">{reg.kid_name}</div>
                        <div className="text-sm text-gray-500">Age: {reg.age}</div>
                        {reg.nickname && <div className="text-sm text-gray-400">"{reg.nickname}"</div>}
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-900">{reg.shirt_size}</div>
                        <div className="text-sm text-gray-500">Qty: {reg.shirt_quantity}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-900">{reg.parent_name}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <FaPhone className="mr-1 text-gray-400" />
                          {reg.parent_phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <FaEnvelope className="mr-1 text-gray-400" />
                          {reg.parent_email}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-900">{reg.emergency_name}</div>
                        <div className="text-sm text-gray-500">{reg.emergency_phone}</div>
                        <div className="text-xs text-gray-400">{reg.emergency_relation}</div>
                      </td>
                      <td className="px-4 py-4">
                        {reg.cashapp_username ? (
                          <span className="text-green-600 font-medium">{reg.cashapp_username}</span>
                        ) : (
                          <span className="text-gray-400">Not provided</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-bold text-gray-900">{formatCurrency(reg.total_cost)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => togglePaymentStatus(reg.id, reg.payment_status)}
                          disabled={updatingPayment === reg.id}
                          className={`px-3 py-1 rounded-full text-sm font-bold transition-colors ${
                            reg.payment_status === 'paid'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          }`}
                        >
                          {updatingPayment === reg.id ? (
                            <span className="animate-pulse">...</span>
                          ) : reg.payment_status === 'paid' ? (
                            <span className="flex items-center">
                              <FaCheckCircle className="mr-1" /> Paid
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <FaClock className="mr-1" /> Pending
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {formatDate(reg.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>

            <div className="lg:hidden space-y-4">
              {filteredRegistrations.map(reg => (
                <div key={reg.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 py-3 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white">{reg.kid_name}</h3>
                      <p className="text-primary-200 text-sm">Age: {reg.age}</p>
                    </div>
                    <button
                      onClick={() => togglePaymentStatus(reg.id, reg.payment_status)}
                      disabled={updatingPayment === reg.id}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        reg.payment_status === 'paid'
                          ? 'bg-green-400 text-green-900'
                          : 'bg-yellow-400 text-yellow-900'
                      }`}
                    >
                      {updatingPayment === reg.id ? '...' : reg.payment_status === 'paid' ? 'Paid' : 'Pending'}
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Shirt</p>
                        <p className="font-medium">{reg.shirt_size} (x{reg.shirt_quantity})</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Amount</p>
                        <p className="font-bold text-primary-600">{formatCurrency(reg.total_cost)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase">Parent</p>
                        <p className="font-medium">{reg.parent_name}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase">CashApp</p>
                        <p className={reg.cashapp_username ? 'text-green-600 font-medium' : 'text-gray-400'}>
                          {reg.cashapp_username || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="border-t pt-3 space-y-1 text-sm">
                      <div className="flex items-center text-gray-600">
                        <FaPhone className="mr-2 text-gray-400 w-4" />
                        {reg.parent_phone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaEnvelope className="mr-2 text-gray-400 w-4" />
                        <span className="truncate">{reg.parent_email}</span>
                      </div>
                    </div>
                    <div className="border-t pt-3 text-sm">
                      <p className="text-gray-500 text-xs uppercase mb-1">Emergency Contact</p>
                      <p className="font-medium">{reg.emergency_name} ({reg.emergency_relation})</p>
                      <p className="text-gray-600">{reg.emergency_phone}</p>
                    </div>
                    <div className="text-xs text-gray-400 pt-2 border-t">
                      Registered: {formatDate(reg.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffPanel;

