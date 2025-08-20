import React from 'react';
import { X, Edit, Check } from 'lucide-react';
import { Project } from '../types/Project';

interface ProjectDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  projectUpdateData: {
    status: string;
    is_featured: boolean;
  };
  onUpdateDataChange: (data: { status: string; is_featured: boolean }) => void;
  onUpdate: () => void;
  updatingProjectStatus: boolean;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  isOpen,
  onClose,
  project,
  projectUpdateData,
  onUpdateDataChange,
  onUpdate,
  updatingProjectStatus
}) => {
  if (!isOpen || !project) return null;

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
                  <span className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                    project.status === 'approved' ? 'bg-green-100 text-green-800' :
                    project.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'published' ? 'bg-blue-100 text-blue-800' :
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
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Project Description</label>
                <div className="px-3 sm:px-4 py-3 bg-gray-50 rounded-lg sm:rounded-xl text-gray-900 min-h-[80px] sm:min-h-[100px] text-sm sm:text-base">
                  {project.description || 'No description available'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Category</label>
                <div className="px-3 sm:px-4 py-3 bg-gray-50 rounded-lg sm:rounded-xl">
                  <span className="px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                    {project.category}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Technology Stack</label>
                <div className="px-3 sm:px-4 py-3 bg-gray-50 rounded-lg sm:rounded-xl">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {project.tech_stack && project.tech_stack.length > 0 ? (
                      project.tech_stack.map((tech, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No tech stack specified</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Key Features</label>
                <div className="px-3 sm:px-4 py-3 bg-gray-50 rounded-lg sm:rounded-xl">
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {project.key_features ? (
                      project.key_features.split(', ').map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
                          {feature.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-sm">No features specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info & Update Form */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Pricing Information</label>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <span className="text-gray-600 text-sm sm:text-base">Sale Price:</span>
                    <span className="font-bold text-gray-900 text-sm sm:text-base">₹{project.pricing.sale_price}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <span className="text-gray-600 text-sm sm:text-base">Original Price:</span>
                    <span className="font-bold text-gray-900 text-sm sm:text-base">₹{project.pricing.original_price}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
                    <span className="text-gray-600 text-sm sm:text-base">Currency:</span>
                    <span className="font-bold text-gray-900 text-sm sm:text-base">{project.pricing.currency}</span>
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
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-yellow-200">
                <h4 className="font-bold text-yellow-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                  Update Project Status
                </h4>
                
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-yellow-800 mb-2">Project Status</label>
                    <select
                      value={projectUpdateData.status}
                      onChange={(e) => onUpdateDataChange({ ...projectUpdateData, status: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-yellow-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white text-sm sm:text-base"
                    >
                      <option value="draft">Draft</option>
                      <option value="pending_review">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="published">Published</option>
                      <option value="suspended">Suspended</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-yellow-50/50 rounded-lg">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={projectUpdateData.is_featured}
                      onChange={(e) => onUpdateDataChange({ ...projectUpdateData, is_featured: e.target.checked })}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-semibold text-yellow-800 flex-1">
                      Mark as Featured Project
                    </label>
                  </div>

                  <button
                    onClick={onUpdate}
                    disabled={updatingProjectStatus}
                    className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingProjectStatus ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Updating Project...</span>
                        <span className="sm:hidden">Updating...</span>
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Update Project</span>
                        <span className="sm:hidden">Update</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full sm:flex-1 bg-gray-600 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-700 transition-all duration-200"
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