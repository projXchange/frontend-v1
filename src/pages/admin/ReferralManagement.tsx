import React from 'react';
import { Users, TrendingUp, Shield } from 'lucide-react';
import ReferralStatsPanel from '../../components/admin/ReferralStatsPanel';
import SuspiciousReferralsPanel from '../../components/admin/SuspiciousReferralsPanel';
import ReferralConfirmationStats from '../../components/admin/ReferralConfirmationStats';

/**
 * ReferralManagement Admin Page
 * 
 * Displays comprehensive referral system management interface for admins.
 * Includes:
 * - System-wide referral statistics
 * - Referral confirmation metrics
 * - Suspicious referral detection and management
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7
 */
const ReferralManagement: React.FC = () => {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Referral Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Monitor and manage the referral system across the platform
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Total Referrals</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">—</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Qualified Referrals</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">—</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">Suspicious Referrals</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">—</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Referral Statistics Panel */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Referral Statistics
        </h2>
        <ReferralStatsPanel />
      </div>

      {/* Referral Confirmation Stats */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          Confirmation Metrics
        </h2>
        <ReferralConfirmationStats />
      </div>

      {/* Suspicious Referrals Panel */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
          Suspicious Referrals
        </h2>
        <SuspiciousReferralsPanel />
      </div>
    </div>
  );
};

export default ReferralManagement;
