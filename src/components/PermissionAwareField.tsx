import React, { ReactNode } from 'react';
import FieldOwnershipIndicator from './FieldOwnershipIndicator';
import { usePermissions } from '../contexts/PermissionContext';

interface PermissionAwareFieldProps {
  fieldName: string;
  children: ReactNode;
  label?: string;
  required?: boolean;
  className?: string;
  showIndicator?: boolean;
}

/**
 * Wrapper component for form fields that handles permission-based styling and indicators
 * Automatically applies disabled state and visual indicators based on field permissions
 */
const PermissionAwareField: React.FC<PermissionAwareFieldProps> = ({
  fieldName,
  children,
  label,
  required = false,
  className = '',
  showIndicator = true,
}) => {
  const { canEditField, getFieldUploader, isFieldTrackable } = usePermissions();

  const canEdit = canEditField(fieldName);
  const uploadedBy = getFieldUploader(fieldName);
  const isTrackable = isFieldTrackable(fieldName);

  // Clone children and add disabled prop if field cannot be edited
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        disabled: !canEdit,
        className: `${child.props.className || ''} ${!canEdit ? 'cursor-not-allowed opacity-70' : ''
          }`.trim(),
      });
    }
    return child;
  });

  return (
    <div className={`field-container ${className}`}>
      {label && (
        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className={`relative ${!canEdit ? 'field-non-editable' : 'field-editable'}`}>
        {enhancedChildren}
      </div>

      {!canEdit && isTrackable && showIndicator && (
        <FieldOwnershipIndicator
          fieldName={fieldName}
          uploadedBy={uploadedBy}
        />
      )}
    </div>
  );
};

export default PermissionAwareField;
