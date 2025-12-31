import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RegistrationService from '../../services/RegistrationService';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { SHIRT_SIZES, EMERGENCY_RELATIONS } from '../../utils/constants';
import logo from '../../assets/logo.PNG';
import {
  FaUser,
  FaChild,
  FaTshirt,
  FaPhone,
  FaEnvelope,
  FaEdit,
  FaSave,
  FaTimes,
  FaSignOutAlt,
  FaArrowLeft,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserShield,
  FaBars,
  FaHome
} from 'react-icons/fa';

const Dashboard = () => {
  const { user, signOut, isStaff } = useAuth();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadRegistrations();
  }, [user, navigate]);

  const loadRegistrations = async () => {
    try {
      const data = await RegistrationService.getRegistrationsByEmail(user.email);
      setRegistrations(data || []);
    } catch (err) {
      setError('Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const startEditing = (registration) => {
    setEditingId(registration.id);
    setEditForm({
      kid_name: registration.kid_name,
      age: registration.age,
      nickname: registration.nickname || '',
      shirt_size: registration.shirt_size,
      shirt_quantity: registration.shirt_quantity,
      parent_name: registration.parent_name,
      parent_phone: registration.parent_phone,
      emergency_name: registration.emergency_name,
      emergency_phone: registration.emergency_phone,
      emergency_relation: registration.emergency_relation,
      cashapp_username: registration.cashapp_username || ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const updates = {
        kid_name: editForm.kid_name,
        age: parseInt(editForm.age),
        nickname: editForm.nickname || null,
        shirt_size: editForm.shirt_size,
        shirt_quantity: parseInt(editForm.shirt_quantity),
        total_cost: parseInt(editForm.shirt_quantity) * RegistrationService.getShirtPrice(),
        parent_name: editForm.parent_name,
        parent_phone: editForm.parent_phone,
        emergency_name: editForm.emergency_name,
        emergency_phone: editForm.emergency_phone,
        emergency_relation: editForm.emergency_relation,
        cashapp_username: editForm.cashapp_username || null
      };
      await RegistrationService.updateRegistration(id, updates);
      await loadRegistrations();
      setEditingId(null);
      setEditForm({});
    } catch (err) {
      setError('Failed to update registration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-primary-700 via-primary-800 to-primary-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="SETX Football Camp" className="h-10 w-10 object-contain" />
              <span className="ml-3 text-lg sm:text-xl font-bold text-white hidden sm:block">SETX Football Camp</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-white/80 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
              >
                <FaHome className="mr-2" />
                Home
              </Link>
              {isStaff() && (
                <Link
                  to="/staff"
                  className="flex items-center text-white/80 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  <FaUserShield className="mr-2" />
                  Staff Panel
                </Link>
              )}
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
          <div className="bg-primary-800/95 px-4 py-4 space-y-2">
            <p className="text-white/60 text-sm px-4 truncate">{user?.email}</p>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center w-full text-white/90 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10"
            >
              <FaHome className="mr-3" />
              Home
            </Link>
            {isStaff() && (
              <Link
                to="/staff"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center w-full text-white/90 hover:text-white px-4 py-3 rounded-lg hover:bg-white/10"
              >
                <FaUserShield className="mr-3" />
                Staff Panel
              </Link>
            )}
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
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors text-sm sm:text-base"
          >
            <FaArrowLeft className="mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">View and manage your camp registrations</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {registrations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <FaChild className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Registrations Yet</h3>
            <p className="text-gray-600 mb-6">You haven't registered any campers yet.</p>
            <Link
              to="/#register"
              className="inline-flex items-center bg-accent-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-accent-600 transition-colors"
            >
              Register Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {registrations.map(reg => {
              const canEdit = RegistrationService.canEdit(reg);
              const daysRemaining = RegistrationService.getDaysRemaining(reg);
              const isEditing = editingId === reg.id;

              return (
                <div key={reg.id} className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                      <div className="flex items-center">
                        <FaChild className="text-white mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                        <h3 className="text-lg sm:text-xl font-bold text-white truncate">
                          {isEditing ? editForm.kid_name : reg.kid_name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${
                          reg.payment_status === 'paid' 
                            ? 'bg-green-400 text-green-900' 
                            : 'bg-yellow-400 text-yellow-900'
                        }`}>
                          {reg.payment_status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                        {canEdit && !isEditing && (
                        <button
                          onClick={() => startEditing(reg)}
                          className="flex items-center bg-white/20 hover:bg-white/30 text-white px-2 sm:px-3 py-1 rounded-lg transition-colors text-sm"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </button>
                      )}
                      {isEditing && (
                        <>
                          <button
                            onClick={() => saveEdit(reg.id)}
                            disabled={saving}
                            className="flex items-center bg-green-500 hover:bg-green-600 text-white px-2 sm:px-3 py-1 rounded-lg transition-colors text-sm"
                          >
                            <FaSave className="mr-1" />
                            {saving ? '...' : 'Save'}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="flex items-center bg-white/20 hover:bg-white/30 text-white px-2 sm:px-3 py-1 rounded-lg transition-colors text-sm"
                          >
                            <FaTimes className="mr-1" />
                            Cancel
                          </button>
                        </>
                      )}
                      </div>
                    </div>
                  </div>

                  {canEdit && (
                    <div className="bg-yellow-50 border-b border-yellow-200 px-4 sm:px-6 py-2 sm:py-3 flex items-center">
                      <FaClock className="text-yellow-600 mr-2 flex-shrink-0" />
                      <span className="text-yellow-800 text-xs sm:text-sm">
                        Edit available for {daysRemaining} more day{daysRemaining !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}

                  {!canEdit && (
                    <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-2 sm:py-3 flex items-center">
                      <FaExclamationTriangle className="text-gray-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 text-xs sm:text-sm">
                        Edit window expired. Contact us for changes.
                      </span>
                    </div>
                  )}

                  <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="font-bold text-gray-900 flex items-center text-sm sm:text-base">
                          <FaChild className="mr-2 text-primary-600" />
                          Camper Info
                        </h4>

                        {isEditing ? (
                          <div className="space-y-2 sm:space-y-3">
                            <input
                              type="text"
                              name="kid_name"
                              value={editForm.kid_name}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                              placeholder="Name"
                            />
                            <input
                              type="number"
                              name="age"
                              value={editForm.age}
                              onChange={handleEditChange}
                              min="5"
                              max="12"
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                              placeholder="Age"
                            />
                            <input
                              type="text"
                              name="nickname"
                              value={editForm.nickname}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                              placeholder="Nickname (optional)"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2 text-gray-600">
                            <p><span className="font-medium">Age:</span> {reg.age}</p>
                            {reg.nickname && <p><span className="font-medium">Nickname:</span> {reg.nickname}</p>}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 flex items-center">
                          <FaTshirt className="mr-2 text-primary-600" />
                          Shirt Details
                        </h4>

                        {isEditing ? (
                          <div className="space-y-3">
                            <select
                              name="shirt_size"
                              value={editForm.shirt_size}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                              {SHIRT_SIZES.map(size => (
                                <option key={size} value={size}>{size}</option>
                              ))}
                            </select>
                            <select
                              name="shirt_quantity"
                              value={editForm.shirt_quantity}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                            >
                              {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num} shirt(s)</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="space-y-2 text-gray-600">
                            <p><span className="font-medium">Size:</span> {reg.shirt_size}</p>
                            <p><span className="font-medium">Quantity:</span> {reg.shirt_quantity}</p>
                            <p><span className="font-medium">Total:</span> {formatCurrency(reg.total_cost)}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 flex items-center">
                          <FaUser className="mr-2 text-primary-600" />
                          Parent/Guardian
                        </h4>

                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              name="parent_name"
                              value={editForm.parent_name}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                              placeholder="Parent Name"
                            />
                            <input
                              type="tel"
                              name="parent_phone"
                              value={editForm.parent_phone}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                              placeholder="Phone"
                            />
                          </div>
                        ) : (
                          <div className="space-y-2 text-gray-600">
                            <p><span className="font-medium">Name:</span> {reg.parent_name}</p>
                            <p><span className="font-medium">Phone:</span> {reg.parent_phone}</p>
                            <p><span className="font-medium">Email:</span> {reg.parent_email}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 flex items-center">
                          <FaPhone className="mr-2 text-accent-500" />
                          Emergency Contact
                        </h4>

                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              name="emergency_name"
                              value={editForm.emergency_name}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent-500"
                              placeholder="Emergency Contact Name"
                            />
                            <input
                              type="tel"
                              name="emergency_phone"
                              value={editForm.emergency_phone}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent-500"
                              placeholder="Phone"
                            />
                            <select
                              name="emergency_relation"
                              value={editForm.emergency_relation}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent-500"
                            >
                              {EMERGENCY_RELATIONS.map(rel => (
                                <option key={rel} value={rel}>{rel}</option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <div className="space-y-2 text-gray-600">
                            <p><span className="font-medium">Name:</span> {reg.emergency_name}</p>
                            <p><span className="font-medium">Phone:</span> {reg.emergency_phone}</p>
                            <p><span className="font-medium">Relation:</span> {reg.emergency_relation}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900 flex items-center">
                          <FaEnvelope className="mr-2 text-green-600" />
                          CashApp Info
                        </h4>

                        {isEditing ? (
                          <input
                            type="text"
                            name="cashapp_username"
                            value={editForm.cashapp_username}
                            onChange={handleEditChange}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                            placeholder="CashApp Username/Email"
                          />
                        ) : (
                          <div className="text-gray-600">
                            {reg.cashapp_username ? (
                              <p className="flex items-center">
                                <FaCheckCircle className="text-green-500 mr-2" />
                                {reg.cashapp_username}
                              </p>
                            ) : (
                              <p className="text-yellow-600">Not provided</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-bold text-gray-900">Registration Info</h4>
                        <div className="space-y-2 text-gray-600">
                          <p><span className="font-medium">Camp Year:</span> {reg.camp_year}</p>
                          <p><span className="font-medium">Registered:</span> {formatDate(reg.created_at)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

