import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  FieldPermissions, 
  PermissionState, 
  PermissionError, 
  PermissionErrorType,
  TrackableField 
} from '../types/Project';
import { getApiUrl } from '../config/api';
import { apiClient } from '../utils/apiClient';
import { useAuth } from './AuthContext';

interface PermissionContextType {
  permissions: FieldPermissions | null;
  loading: boolean;
  error: string | null;
  canEditField: (fieldName: string) => boolean;
  getFieldUploader: (fieldName: string) => string | null;
  fetchPermissions: (projectId: string) => Promise<void>;
  clearPermissions: () => void;
  isFieldTrackable: (fieldName: string) => boolean;
  isAdmin: boolean;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PermissionState>({
    permissions: null,
    loading: false,
    error: null,
  });
  
  const { isAdmin } = useAuth();

  // List of trackable fields
  const trackableFields: TrackableField[] = [
    'title',
    'description',
    'key_features',
    'category',
    'difficulty_level',
    'tech_stack',
    'github_url',
    'demo_url',
    'youtube_url',
    'pricing',
    'delivery_time',
    'thumbnail',
    'images',
    'files',
    'requirements',
  ];

  /**
   * Check if a field is trackable for permissions
   */
  const isFieldTrackable = useCallback((fieldName: string): boolean => {
    return trackableFields.includes(fieldName as TrackableField);
  }, []);

  /**
   * Check if a field can be edited by the current user
   * Admins can edit all fields regardless of ownership
   */
  const canEditField = useCallback((fieldName: string): boolean => {
    // Admins can edit all fields
    if (isAdmin) {
      return true;
    }
    
    // If permissions haven't been loaded yet, default to true (will be restricted by backend)
    if (!state.permissions) {
      return true;
    }

    // If field is not trackable, allow editing
    if (!isFieldTrackable(fieldName)) {
      return true;
    }

    // Check if field has permission data
    const fieldPermission = state.permissions[fieldName];
    if (!fieldPermission) {
      // If no permission data exists for this field, default to true
      return true;
    }

    return fieldPermission.canEdit;
  }, [state.permissions, isFieldTrackable, isAdmin]);

  /**
   * Get the uploader ID for a specific field
   */
  const getFieldUploader = useCallback((fieldName: string): string | null => {
    if (!state.permissions || !isFieldTrackable(fieldName)) {
      return null;
    }

    const fieldPermission = state.permissions[fieldName];
    return fieldPermission?.uploadedBy || null;
  }, [state.permissions, isFieldTrackable]);

  /**
   * Fetch field permissions for a project
   */
  const fetchPermissions = useCallback(async (projectId: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient(
        getApiUrl(`/projects/${projectId}/permissions`),
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('token') 
              ? { Authorization: `Bearer ${localStorage.getItem('token')}` } 
              : {}),
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch permissions');
      }

      const data = await response.json();
      
      setState({
        permissions: data.field_permissions || null,
        loading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState({
        permissions: null,
        loading: false,
        error: errorMessage,
      });

      console.error('Error fetching permissions:', error);
    }
  }, []);

  /**
   * Clear permissions from state
   */
  const clearPermissions = useCallback(() => {
    setState({
      permissions: null,
      loading: false,
      error: null,
    });
  }, []);

  const value: PermissionContextType = {
    permissions: state.permissions,
    loading: state.loading,
    error: state.error,
    canEditField,
    getFieldUploader,
    fetchPermissions,
    clearPermissions,
    isFieldTrackable,
    isAdmin,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

/**
 * Hook to use permission context
 */
export const usePermissions = (): PermissionContextType => {
  const context = useContext(PermissionContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionProvider');
  }
  return context;
};
