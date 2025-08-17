import React, { useState, useEffect } from 'react';
import { X, Edit, CheckCircle } from 'lucide-react';
import { User } from '../types/User';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdateUserStatus: (userId: string, verificationStatus: string, emailVerified: boolean) => Promise<void>;
  updatingUser: string | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUserStatus,
  updatingUser
}) => {
  const [editingUser, setEditingUser] = useState(false);
  const [userEditData, setUserEditData] = useState({
    verification_status: '',
    email_verified: false
  });

  // Initialize user edit data when selected user changes
  useEffect(() => {
    if (user) {
      setUserEditData({
        verification_status: user.verification_status || '',
        email_verified: user.email_verified || false
      });
    }
  }, [user]);

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await onUpdateUserStatus(user.id, userEditData.verification_status, userEditData.email_verified);
      setEditingUser(false);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideInUp">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">User Details</h2>
          <div className="flex items-center gap-4">
            {!editingUser && (
              <button
                onClick={() => setEditingUser(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
              >
                <Edit className="w-4 h-4" />
                Edit User
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                setEditingUser(false);
                setUserEditData({
                  verification_status: '',
                  email_verified: false
                });
              }}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {user ? (
          <div className="space-y-6">
            {/* User Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">{user.full_name?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{user.full_name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>

            {editingUser ? (
              /* Edit User Form */
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Edit className="w-6 h-6 text-blue-600" />
                  Edit User Details
                </h3>
                
                <form onSubmit={handleUpdateUser} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Verification Status *
                      </label>
                      <select
                        value={userEditData.verification_status}
                        onChange={(e) => setUserEditData(prev => ({ ...prev, verification_status: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        required
                      >
                        <option value="">Select verification status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="emailVerified"
                        checked={userEditData.email_verified}
                        onChange={(e) => setUserEditData(prev => ({ ...prev, email_verified: e.target.checked }))}
                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="emailVerified" className="text-sm font-semibold text-gray-700">
                        Email Verified
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(false);
                        setUserEditData({
                          verification_status: user.verification_status || '',
                          email_verified: user.email_verified || false
                        });
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updatingUser === user.id}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingUser === user.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </div>
                      ) : (
                        'Update User'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* View User Details */
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-mono text-sm">
                      {user.id}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">User Type</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                        user.user_type === 'admin' ? 'bg-red-100 text-red-800' :
                        user.user_type === 'manager' ? 'bg-purple-100 text-purple-800' :
                        user.user_type === 'seller' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.user_type}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Status</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                        user.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                        user.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.verification_status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Verified</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                        user.email_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.email_verified ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Account Status</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl">
                      <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                        user.status === 'suspended' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {user.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Created At</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                      {new Date(user.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                      {new Date(user.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!editingUser && (
              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user details...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsModal;