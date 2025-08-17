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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideInUp">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Project Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-8">
          {/* Project Header */}
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">{project.title.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                    project.status === 'approved' ? 'bg-green-100 text-green-800' :
                    project.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'published' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'suspended' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                    {project.difficulty_level}
                  </span>
                  {project.is_featured && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Project Information Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Project Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Project Description</label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 min-h-[100px]">
                  {project.description || 'No description available'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                    {project.category}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Technology Stack</label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack && project.tech_stack.length > 0 ? (
                      project.tech_stack.map((tech, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No tech stack specified</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Key Features</label>
                <div className="px-4 py-3 bg-gray-50 rounded-xl">
                  <div className="flex flex-wrap gap-2">
                    {project.key_features ? (
                      project.key_features.split(', ').map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
                          {feature.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No features specified</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info & Update Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Pricing Information</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Sale Price:</span>
                    <span className="font-bold text-gray-900">₹{project.pricing.sale_price}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Original Price:</span>
                    <span className="font-bold text-gray-900">₹{project.pricing.original_price}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-bold text-gray-900">{project.pricing.currency}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Project Statistics</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Author ID:</span>
                    <span className="font-mono text-sm font-bold text-gray-900">{project.author_id}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-bold text-gray-900">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-bold text-gray-900">{new Date(project.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Update Project Status Form */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                <h4 className="font-bold text-yellow-900 mb-4 flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Update Project Status
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-yellow-800 mb-2">Project Status</label>
                    <select
                      value={projectUpdateData.status}
                      onChange={(e) => onUpdateDataChange({ ...projectUpdateData, status: e.target.value })}
                      className="w-full px-4 py-3 border border-yellow-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="pending_review">Pending Review</option>
                      <option value="approved">Approved</option>
                      <option value="published">Published</option>
                      <option value="suspended">Suspended</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={projectUpdateData.is_featured}
                      onChange={(e) => onUpdateDataChange({ ...projectUpdateData, is_featured: e.target.checked })}
                      className="w-5 h-5 text-yellow-600 border-yellow-300 rounded focus:ring-yellow-500"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-semibold text-yellow-800">
                      Mark as Featured Project
                    </label>
                  </div>

                  <button
                    onClick={onUpdate}
                    disabled={updatingProjectStatus}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-semibold hover:from-yellow-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingProjectStatus ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating Project...
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4" />
                        Update Project
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200"
            >
              Close
            </button>
            <button
              onClick={onUpdate}
              disabled={updatingProjectStatus}
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingProjectStatus ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Update Project
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
