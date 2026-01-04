import React from 'react';
import { Lock, Info } from 'lucide-react';

interface FieldOwnershipIndicatorProps {
  fieldName: string;
  uploadedBy: string | null;
  className?: string;
}

/**
 * Component to display ownership information for non-editable fields
 * Shows a lock icon and information about who uploaded the field
 */
const FieldOwnershipIndicator: React.FC<FieldOwnershipIndicatorProps> = ({
  fieldName,
  uploadedBy,
  className = '',
}) => {
  /**
   * Get a user-friendly label for the uploader
   */
  const getUploaderLabel = (userId: string | null): string => {
    if (!userId) return 'System';
    
    // Check if it's an admin user (you can adjust this logic based on your user ID patterns)
    if (userId.includes('admin') || userId.startsWith('adm_')) {
      return 'Admin Team';
    }
    
    return 'Another User';
  };

  const uploaderLabel = getUploaderLabel(uploadedBy);
  const fieldLabel = fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div 
      className={`flex items-center gap-2 mt-1.5 text-xs text-gray-600 dark:text-gray-400 ${className}`}
      role="status"
      aria-label={`This ${fieldLabel} was uploaded by ${uploaderLabel} and cannot be edited`}
    >
      <Lock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
      <span className="flex-1">
        This field was uploaded by <span className="font-semibold">{uploaderLabel}</span> and cannot be edited
      </span>
      <div className="group relative">
        <Info className="w-3.5 h-3.5 flex-shrink-0 cursor-help" aria-hidden="true" />
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block z-10 w-64">
          <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg p-3 shadow-lg">
            <p className="font-semibold mb-1">Field Ownership</p>
            <p className="text-gray-300 dark:text-gray-400">
              Only the user who uploaded this field can edit it. Contact an admin if you need to make changes.
            </p>
            <div className="absolute top-full right-4 -mt-1">
              <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldOwnershipIndicator;
