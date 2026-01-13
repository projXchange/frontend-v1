import React from 'react';
import { Gift, Calendar, Users, CheckCircle } from 'lucide-react';

/**
 * HowToEarnCredits Component
 * 
 * Displays an informational card explaining how users can earn credits during
 * the referral-only access mode. Covers signup bonus, monthly drip, and referral credits.
 * 
 * Requirements: 15.3
 */
const HowToEarnCredits: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        How to Earn Credits
      </h2>
      
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        During our launch period, you can earn credits to download projects through the following methods:
      </p>

      <div className="space-y-6">
        {/* Signup Bonus */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Signup Bonus
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get <span className="font-bold text-green-600 dark:text-green-400">1 credit</span> immediately when you create your account.
            </p>
          </div>
        </div>

        {/* Monthly Drip */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Monthly Credits
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Receive <span className="font-bold text-blue-600 dark:text-blue-400">1 credit per month</span> for your first 3 months after signup.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Maximum: 3 monthly credits
            </p>
          </div>
        </div>

        {/* Referral Credits */}
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Referral Credits
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Earn <span className="font-bold text-purple-600 dark:text-purple-400">1 credit</span> for each friend who signs up using your referral link and gets confirmed.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Maximum: 6 referral credits
            </p>
          </div>
        </div>

        {/* Referral Confirmation Criteria */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
          <div className="flex items-start space-x-3 mb-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <h4 className="text-base font-semibold text-gray-900 dark:text-white">
              How Referrals Get Confirmed
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Your referred friend needs to complete <span className="font-semibold">one</span> of the following actions:
          </p>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-green-600 dark:text-green-400 mr-2">•</span>
              <span>Download 1 project</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 dark:text-green-400 mr-2">•</span>
              <span>Add 1 project to their wishlist</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 dark:text-green-400 mr-2">•</span>
              <span>View 2 different projects for at least 60 seconds each</span>
            </li>
          </ul>
        </div>

        {/* Total Credits Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">Total Credits Available:</span> You can earn up to 9 credits in total 
            (1 signup + 3 monthly + 6 referral - 1 used = 9 available).
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowToEarnCredits;
