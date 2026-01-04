import React from 'react';
import { Shield, Info } from 'lucide-react';

interface AdminOverrideBadgeProps {
  className?: string;
}

/**
 * Badge to indicate admin override mode
 * Shows that admin can edit all fields regardless of ownership
 */
const AdminOverrideBadge: React.FC<AdminOverrideBadgeProps> = ({ className = '' }) => {
  return (
    <div 
      className={`px-6 py-4 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800 ${className}`}
      role="status"
      aria-label="Admin override mode active"
    >
      <div className="flex items-start gap-3">
        <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm text-purple-800 dark:text-purple-300 font-semibold mb-1">
            Admin Override Mode
          </p>
          <p className="text-xs text-purple-700 dark:text-purple-400">
            You can edit all fields regardless of ownership. Changes will not affect field ownership and will not trigger re-approval.
          </p>
        </div>
        <div className="group relative">
          <Info className="w-4 h-4 text-purple-600 dark:text-purple-400 cursor-help" aria-hidden="true" />
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10 w-72">
            <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg">
              <p className="font-semibold mb-1">Admin Privileges</p>
              <ul className="text-gray-300 dark:text-gray-400 space-y-1 list-disc list-inside">
                <li>Edit any field, even if uploaded by others</li>
                <li>Changes don't modify field ownership</li>
                <li>No re-approval required for admin edits</li>
                <li>All actions are logged for audit purposes</li>
              </ul>
              <div className="absolute top-full right-4 -mt-1">
                <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverrideBadge;
