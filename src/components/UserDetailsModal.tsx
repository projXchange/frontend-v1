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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-slideInUp transition-colors">
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">User Details</h2>
          <div className="flex items-center gap-2 sm:gap-4">
            {!editingUser && (
              <button
                onClick={() => setEditingUser(true)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold hover:from-blue-700 hover:to-teal-700 dark:hover:from-blue-600 dark:hover:to-teal-600 transition-all duration-200"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Edit User</span>
                <span className="sm:hidden">Edit</span>
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
              className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
        
        {user ? (
          <div className="space-y-4 sm:space-y-6">
            {/* User Header */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 transition-colors">
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-lg lg:text-xl">{user.full_name?.charAt(0) || 'U'}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 truncate">{user.full_name}</h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>

            {editingUser ? (
              /* Edit User Form */
              <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-slate-700 shadow-lg transition-colors">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <Edit className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  <span className="truncate">Edit User Details</span>
                </h3>
                
                <form onSubmit={handleUpdateUser} className="space-y-4 sm:space-y-6">
                  <div className="grid gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                        Verification Status *
                      </label>
                      <select
                        value={userEditData.verification_status}
                        onChange={(e) => setUserEditData(prev => ({ ...prev, verification_status: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 text-sm sm:text-base transition-colors"
                        required
                      >
                        <option value="">Select verification status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-slate-900 rounded-lg sm:rounded-xl transition-colors">
                      <input
                        type="checkbox"
                        id="emailVerified"
                        checked={userEditData.email_verified}
                        onChange={(e) => setUserEditData(prev => ({ ...prev, email_verified: e.target.checked }))}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400 border-gray-300 dark:border-slate-700 rounded focus:ring-blue-500 dark:focus:ring-blue-400"
                      />
                      <label htmlFor="emailVerified" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex-1">
                        Email Verified
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser(false);
                        setUserEditData({
                          verification_status: user.verification_status || '',
                          email_verified: user.email_verified || false
                        });
                      }}
                      className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updatingUser === user.id}
                      className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-teal-700 dark:hover:from-blue-600 dark:hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {updatingUser === user.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="hidden sm:inline">Updating...</span>
                          <span className="sm:hidden">...</span>
                        </div>
                      ) : (
                        <span>Update User</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* View User Details */
              <div className="grid gap-4 sm:gap-6">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">User ID</label>
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl text-gray-900 dark:text-gray-100 font-mono text-xs sm:text-sm break-all transition-colors">
                      {user.id}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">User Type</label>
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl">
                      <span className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${
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
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl">
                      <span className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${
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
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl">
                      <span className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                        user.email_verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.email_verified ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Created At</label>
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl text-gray-900 text-sm sm:text-base">
                      {new Date(user.created_at).toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Last Updated</label>
                    <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg sm:rounded-xl text-gray-900 text-sm sm:text-base">
                      {new Date(user.updated_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!editingUser && (
              <div className="flex gap-3 sm:gap-4 pt-4 sm:pt-6">
                <button
                  onClick={() => {
                    onClose();
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">Loading user details...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailsModal;