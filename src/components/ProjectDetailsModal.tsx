import React from 'react';
import { X, Edit, Check } from 'lucide-react';
import { Project } from '../types/Project';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  canEditAll?: boolean;
  projectEditData?: Partial<Project>;
  onEditDataChange?: (data: Partial<Project>) => void;
  projectUpdateData: {
    status: string;
    is_featured: boolean;
  };
  onUpdateDataChange: (data: { status: string; is_featured: boolean }) => void;
  onUpdate: () => void;
  onSendForApproval?: () => void;
  updatingProjectStatus: boolean;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  project,
  canEditAll = false,
  projectEditData,
  onEditDataChange,
  projectUpdateData,
  onUpdateDataChange,
  onUpdate,
  onSendForApproval,
  updatingProjectStatus
}) => {
  if (!isOpen || !project) return null;

  const editData: Partial<Project> = projectEditData || project;
  const handleEditChange = (next: Partial<Project>) => {
    if (onEditDataChange) onEditDataChange(next);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 w-full max-w-sm sm:max-w-3xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-slideInUp">
        <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Project Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Project Header */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6">
            <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm sm:text-lg lg:text-xl">{project.title.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">{project.title}</h3>
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 lg:gap-3">
                  <span className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${project.status === 'approved' ? 'bg-green-100 text-green-800' :
                    project.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      project.status === 'suspended' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                    }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    {project.difficulty_level}
                  </span>
                  {project.is_featured && (
                    <span className="px-2 sm:px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Project Information Grid */}
          <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2">
            {/* Left Column - Project Details */}
            <div className="space-y-4 sm:space-y-6">
              {/* Editable Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Title</label>
                <input
                  type="text"
                  value={canEditAll ? (editData.title || '') : (project.title || '')}
                  onChange={(e) => handleEditChange({ ...editData, title: e.target.value })}
                  disabled={!canEditAll}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Project Description</label>
                <textarea
                  rows={6}
                  value={canEditAll ? (editData.description || '') : (project.description || '')}
                  onChange={(e) => handleEditChange({ ...editData, description: e.target.value })}
                  disabled={!canEditAll}
                  className="w-full px-3 sm:px-4 py-3 bg-white border border-gray-300 rounded-lg sm:rounded-xl text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Category</label>
                <input
                  type="text"
                  value={canEditAll ? (editData.category || '') : (project.category || '')}
                  onChange={(e) => handleEditChange({ ...editData, category: e.target.value })}
                  disabled={!canEditAll}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Technology Stack</label>
                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB"
                  value={canEditAll ? ((editData.tech_stack && editData.tech_stack.join(', ')) || '') : ((project.tech_stack && project.tech_stack.join(', ')) || '')}
                  onChange={(e) => handleEditChange({ ...editData, tech_stack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  disabled={!canEditAll}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Features</label>
                <input
                  type="text"
                  placeholder="Feature A, Feature B"
                  value={canEditAll ? (editData.key_features || '') : (project.key_features || '')}
                  onChange={(e) => handleEditChange({ ...editData, key_features: e.target.value })}
                  disabled={!canEditAll}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Right Column - Additional Info & Update Form */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Pricing Information</label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Sale Price</label>
                    <input
                      type="number"
                      value={canEditAll ? (editData.pricing?.sale_price ?? '') : (project.pricing?.sale_price ?? '')}
                      onChange={(e) => handleEditChange({
                        ...editData,
                        pricing: { ...editData.pricing, sale_price: Number(e.target.value) } as any,
                      })}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Original Price</label>
                    <input
                      type="number"
                      value={canEditAll ? (editData.pricing?.original_price ?? '') : (project.pricing?.original_price ?? '')}
                      onChange={(e) => handleEditChange({
                        ...editData,
                        pricing: { ...editData.pricing, original_price: Number(e.target.value) } as any,
                      })}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Currency</label>
                    <select
                      value={canEditAll ? (editData.pricing?.currency ?? 'INR') : (project.pricing?.currency ?? 'INR')}
                      onChange={(e) => handleEditChange({
                        ...editData,
                        pricing: { ...editData.pricing, currency: e.target.value as any } as any,
                      })}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-50"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Project Statistics</label>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <span className="text-gray-600 text-sm sm:text-base">Author ID:</span>
                    <span className="font-mono text-xs sm:text-sm font-bold text-gray-900 break-all">{project.author_id}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <span className="text-gray-600 text-sm sm:text-base">Created:</span>
                    <span className="font-bold text-gray-900 text-xs sm:text-sm">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <span className="text-gray-600 text-sm sm:text-base">Last Updated:</span>
                    <span className="font-bold text-gray-900 text-xs sm:text-sm">{new Date(project.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>


              {/* Update Project Status Form */}


              {!canEditAll && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-200">
                  <h4 className="font-bold text-yellow-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    Update Project Status
                  </h4>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-yellow-800 mb-2">
                        Project Status
                      </label>
                      <select
                        value={projectUpdateData.status}
                        onChange={(e) =>
                          onUpdateDataChange({ ...projectUpdateData, status: e.target.value })
                        }
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-yellow-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-sm sm:text-base"
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="suspended">Suspended</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-yellow-50/50 rounded-lg">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={projectUpdateData.is_featured}
                        onChange={(e) =>
                          onUpdateDataChange({
                            ...projectUpdateData,
                            is_featured: e.target.checked,
                          })
                        }
                        className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
                      />
                      <label
                        htmlFor="isFeatured"
                        className="text-sm font-semibold text-yellow-800 flex-1"
                      >
                        Mark as Featured Project
                      </label>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
            {/* Save Changes Button */}
            <button
              onClick={onUpdate}
              disabled={updatingProjectStatus}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingProjectStatus ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">Saving Changes...</span>
                  <span className="sm:hidden">Saving...</span>
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Save Changes</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;