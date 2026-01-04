import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface PermissionHelpTooltipProps {
  className?: string;
}

/**
 * Help tooltip component that explains the permission system
 * Provides detailed information about field-level editing
 */
const PermissionHelpTooltip: React.FC<PermissionHelpTooltipProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        aria-label="Help about field permissions"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          {/* Tooltip content */}
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-slate-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  Field-Level Permissions
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded transition-colors"
                  aria-label="Close help"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    📝 What is this?
                  </p>
                  <p className="text-xs">
                    Each field in your project has an owner - the person who originally uploaded that information. Only the owner can edit their fields.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    ✏️ What can you edit?
                  </p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Fields you originally uploaded</li>
                    <li>Fields marked with no lock icon</li>
                    <li>Your own project information</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    🔒 What can't you edit?
                  </p>
                  <ul className="text-xs space-y-1 list-disc list-inside">
                    <li>Fields uploaded by admin team</li>
                    <li>Fields uploaded by other users</li>
                    <li>Fields with a lock icon</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    🔄 Re-approval Process
                  </p>
                  <p className="text-xs">
                    When you edit any field, your project will be sent for admin re-approval. This ensures quality and accuracy of all projects.
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    💡 Need to change locked fields?
                  </p>
                  <p className="text-xs">
                    Contact an admin if you need to modify fields you don't have access to. They can make changes or grant you permission.
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                    Tip: Hover over the lock icon on any field to see who uploaded it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PermissionHelpTooltip;
