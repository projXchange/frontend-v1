import { apiClient } from '../utils/apiClient';
import { API_CONFIG, getApiUrl } from '../config/api';
import type {
  FieldPermissions,
  FieldPermissionResponse,
  ProjectUpdateResponse,
  Project,
  PermissionError,
} from '../types/Project';
import { PermissionErrorType } from '../types/Project';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Create headers with authentication token
 */
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Handle API response and throw errors if needed
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: 'An unexpected error occurred',
    }));
    throw error;
  }
  return response.json();
}

/**
 * Create a permission error object
 */
function createPermissionError(
  type: PermissionErrorType,
  message: string,
  fieldName?: string,
  uploadedBy?: string
): PermissionError {
  return {
    type,
    message,
    fieldName,
    uploadedBy,
  };
}

// ============================================================================
// Field Permissions API
// ============================================================================

/**
 * Get field permissions for a specific project
 * @param projectId - The ID of the project
 * @returns Field permissions data
 */
export async function getProjectPermissions(
  projectId: string
): Promise<FieldPermissions> {
  try {
    const response = await apiClient(
      getApiUrl(API_CONFIG.ENDPOINTS.PROJECT_PERMISSIONS(projectId)),
      {
        method: 'GET',
        headers: getAuthHeaders(),
      }
    );

    const data = await handleResponse<FieldPermissionResponse>(response);
    return data.field_permissions;
  } catch (error: any) {
    console.error('Error fetching project permissions:', error);
    throw createPermissionError(
      PermissionErrorType.NETWORK_ERROR,
      error.error || error.message || 'Failed to fetch permissions'
    );
  }
}

/**
 * Update project fields with permission filtering
 * @param projectId - The ID of the project
 * @param updates - Partial project data to update
 * @returns Updated project data
 */
export async function updateProjectFields(
  projectId: string,
  updates: Partial<Project>
): Promise<ProjectUpdateResponse> {
  try {
    const response = await apiClient(
      getApiUrl(API_CONFIG.ENDPOINTS.UPDATE_PROJECT_FIELDS(projectId)),
      {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      }
    );

    const data = await handleResponse<ProjectUpdateResponse>(response);
    return data;
  } catch (error: any) {
    console.error('Error updating project fields:', error);
    
    // Check if it's a permission error
    if (error.type === 'PERMISSION_DENIED' || error.error?.includes('permission')) {
      throw createPermissionError(
        PermissionErrorType.PERMISSION_DENIED,
        error.error || error.message || 'You do not have permission to edit this field',
        error.fieldName,
        error.uploadedBy
      );
    }
    
    throw createPermissionError(
      PermissionErrorType.NETWORK_ERROR,
      error.error || error.message || 'Failed to update project'
    );
  }
}

/**
 * Filter project updates to only include editable fields
 * @param updates - Partial project data
 * @param permissions - Field permissions
 * @returns Filtered updates containing only editable fields
 */
export function filterEditableFields(
  updates: Partial<Project>,
  permissions: FieldPermissions | null
): Partial<Project> {
  // If no permissions data, return all updates (backend will validate)
  if (!permissions) {
    return updates;
  }

  const filtered: Partial<Project> = {};

  Object.keys(updates).forEach((key) => {
    const fieldPermission = permissions[key];
    
    // If field has no permission data or is editable, include it
    if (!fieldPermission || fieldPermission.canEdit) {
      (filtered as any)[key] = (updates as any)[key];
    }
  });

  return filtered;
}

/**
 * Check if a specific field can be edited
 * @param fieldName - Name of the field
 * @param permissions - Field permissions
 * @returns True if field can be edited
 */
export function canEditField(
  fieldName: string,
  permissions: FieldPermissions | null
): boolean {
  if (!permissions) {
    return true; // Default to true if no permissions loaded
  }

  const fieldPermission = permissions[fieldName];
  return !fieldPermission || fieldPermission.canEdit;
}

/**
 * Get uploader information for a field
 * @param fieldName - Name of the field
 * @param permissions - Field permissions
 * @returns Uploader ID or null
 */
export function getFieldUploader(
  fieldName: string,
  permissions: FieldPermissions | null
): string | null {
  if (!permissions) {
    return null;
  }

  const fieldPermission = permissions[fieldName];
  return fieldPermission?.uploadedBy || null;
}
