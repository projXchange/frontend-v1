import React, { useState, useEffect } from 'react';
import { X, Edit, Save, Send, Calendar, User } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'basic' | 'technical' | 'media'>('basic');

  useEffect(() => {
    if (project && canEditAll && onEditDataChange && !projectEditData) {
      onEditDataChange(project);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const currentData = canEditAll && projectEditData ? projectEditData : project;

  const handleInputChange = (field: string, value: any) => {
    if (canEditAll && onEditDataChange && projectEditData) {
      onEditDataChange({
        ...projectEditData,
        [field]: value
      });
    }
  };

  const handleNestedChange = (parent: string, field: string, value: any) => {
    if (canEditAll && onEditDataChange && projectEditData) {
      onEditDataChange({
        ...projectEditData,
        [parent]: {
          ...(projectEditData[parent as keyof typeof projectEditData] as any),
          [field]: value
        }
      });
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
    handleInputChange(field, arrayValue);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-5xl my-4 shadow-2xl flex flex-col max-h-[96vh]">
        {/* Compact Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base sm:text-lg">{project.title?.charAt(0) || 'P'}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 truncate">Project Details</h2>
              <p className="text-xs text-gray-600 font-mono truncate">ID: {project.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-lg transition-all flex-shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compact Status Bar */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            {/* Status Badges */}
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${project.status === "approved"
                ? "bg-green-100 text-green-700"
                : project.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : project.status === "suspended"
                    ? "bg-red-100 text-red-700"
                    : project.status === "draft"
                      ? "bg-gray-100 text-gray-700"
                      : "bg-blue-100 text-blue-700"
                }`}
            >
              {project.status?.toUpperCase()}
            </span>

            {project.difficulty_level && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                {project.difficulty_level?.toUpperCase()}
              </span>
            )}

            {project.is_featured && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                ⭐ FEATURED
              </span>
            )}

            {/* Dates - Hidden on mobile */}
            <div className="hidden sm:flex items-center gap-3 ml-auto text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Tabs */}
        <div className="flex gap-1 px-2 sm:px-3 pt-2 border-b border-gray-200 overflow-x-auto flex-shrink-0">
          {(['basic', 'technical', 'media'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 font-medium text-xs sm:text-sm rounded-t-lg transition-colors whitespace-nowrap ${activeTab === tab
                ? 'bg-white text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {tab === 'basic' && '📋 Basic'}
              {tab === 'technical' && '⚙️ Technical'}
              {tab === 'media' && '🎨 Media'}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5">
          {activeTab === 'basic' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {/* Title */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Project Title *</label>
                <input
                  type="text"
                  value={currentData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!canEditAll}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
                <textarea
                  rows={4}
                  value={currentData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!canEditAll}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 resize-none"
                />
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Key Features</label>
                <textarea
                  rows={3}
                  value={currentData.key_features || ''}
                  onChange={(e) => handleInputChange('key_features', e.target.value)}
                  disabled={!canEditAll}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>

              {/* Category and Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                  <select
                    value={currentData.category || 'web_development'}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    disabled={!canEditAll}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 bg-white"
                  >
                    <option value="web_development">Web Development</option>
                    <option value="mobile_development">Mobile Development</option>
                    <option value="desktop_application">Desktop Application</option>
                    <option value="machine_learning">Machine Learning</option>
                    <option value="data_science">Data Science</option>
                    <option value="game_development">Game Development</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Difficulty *</label>
                  <select
                    value={currentData.difficulty_level || 'beginner'}
                    onChange={(e) => handleInputChange('difficulty_level', e.target.value)}
                    disabled={!canEditAll}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              {/* Delivery Time and Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Delivery Time (days)</label>
                  <input
                    type="number"
                    min="0"
                    value={currentData.delivery_time || 0}
                    onChange={(e) => handleInputChange('delivery_time', Number(e.target.value))}
                    disabled={!canEditAll}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Author ID
                  </label>
                  <input
                    type="text"
                    value={project.author_id || ''}
                    disabled
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-500 font-mono"
                  />
                </div>
              </div>

              {/* Compact Pricing Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4 border border-green-200">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  💰 Pricing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sale Price *</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        {currentData.pricing?.currency === 'USD' ? '$' : '₹'}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={currentData.pricing?.sale_price || 0}
                        onChange={(e) => handleNestedChange('pricing', 'sale_price', Number(e.target.value))}
                        disabled={!canEditAll}
                        className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Original Price *</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        {currentData.pricing?.currency === 'USD' ? '$' : '₹'}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={currentData.pricing?.original_price || 0}
                        onChange={(e) => handleNestedChange('pricing', 'original_price', Number(e.target.value))}
                        disabled={!canEditAll}
                        className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Currency</label>
                    <select
                      value={currentData.pricing?.currency || 'INR'}
                      onChange={(e) => handleNestedChange('pricing', 'currency', e.target.value)}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 bg-white"
                    >
                      <option value="INR">🇮🇳 INR (₹)</option>
                      <option value="USD">🇺🇸 USD ($)</option>
                    </select>
                  </div>
                </div>
                {currentData.pricing?.original_price && currentData.pricing?.sale_price && (
                  <div className="mt-2 p-2 bg-white/70 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="font-semibold">Discount:</span>{' '}
                      <span className="text-green-600 font-bold">
                        {Math.round(((currentData.pricing.original_price - currentData.pricing.sale_price) / currentData.pricing.original_price) * 100)}% OFF
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Status Update Section */}
              {!canEditAll && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-3 sm:p-4 border border-yellow-200">
                  <h4 className="text-sm sm:text-base font-bold text-yellow-900 mb-3 flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Update Status
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-yellow-800 mb-1.5">Project Status</label>
                      <select
                        value={projectUpdateData.status}
                        onChange={(e) => onUpdateDataChange({ ...projectUpdateData, status: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white"
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="suspended">Suspended</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 p-2.5 bg-white/70 rounded-lg cursor-pointer hover:bg-white">
                      <input
                        type="checkbox"
                        checked={projectUpdateData.is_featured}
                        onChange={(e) => onUpdateDataChange({ ...projectUpdateData, is_featured: e.target.checked })}
                        className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-yellow-800">Mark as Featured ⭐</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {/* Tech Stack */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">Technology Stack</label>
                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB (comma separated)"
                  value={currentData.tech_stack?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('tech_stack', e.target.value)}
                  disabled={!canEditAll}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
                {currentData.tech_stack && currentData.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {currentData.tech_stack.map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Requirements Section */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 sm:p-4 border border-purple-200">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  📋 Requirements
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      System Requirements
                      <span className="ml-2 text-xs text-green-600">(Public - Visible to all)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Windows 10, 8GB RAM (comma separated)"
                      value={currentData.requirements?.system_requirements?.join(', ') || ''}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        handleNestedChange('requirements', 'system_requirements', arr);
                      }}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Dependencies
                      {!canEditAll && <span className="ml-2 text-xs text-orange-600">(Sensitive - Hidden from non-purchasers)</span>}
                    </label>
                    <input
                      type="text"
                      placeholder="Node.js 16+, npm 8+ (comma separated)"
                      value={currentData.requirements?.dependencies?.join(', ') || ''}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        handleNestedChange('requirements', 'dependencies', arr);
                      }}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Installation Steps
                      {!canEditAll && <span className="ml-2 text-xs text-orange-600">(Sensitive - Hidden from non-purchasers)</span>}
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Step 1: npm install, Step 2: configure .env (comma separated)"
                      value={currentData.requirements?.installation_steps?.join(', ') || ''}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        handleNestedChange('requirements', 'installation_steps', arr);
                      }}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:bg-gray-50 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {/* URLs Section */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-3 sm:p-4 border border-cyan-200">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  🔗 Project Links
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      GitHub Repository
                      {!canEditAll && <span className="ml-2 text-xs text-orange-600">(Sensitive - Hidden from non-purchasers)</span>}
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/project"
                      value={currentData.github_url || ''}
                      onChange={(e) => handleInputChange('github_url', e.target.value)}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Live Demo
                      <span className="ml-2 text-xs text-green-600">(Public - Visible to all)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://project-demo.com"
                      value={currentData.demo_url || ''}
                      onChange={(e) => handleInputChange('demo_url', e.target.value)}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      YouTube Video
                      {!canEditAll && <span className="ml-2 text-xs text-orange-600">(Sensitive - Hidden from non-purchasers)</span>}
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={currentData.youtube_url || ''}
                      onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">🖼️ Project Thumbnail</label>
                <input
                  type="text"
                  placeholder="https://example.com/thumbnail.jpg"
                  value={currentData.thumbnail || ''}
                  onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                  disabled={!canEditAll}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
                {currentData.thumbnail && (
                  <div className="mt-3">
                    <img
                      src={currentData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full max-w-lg h-40 sm:h-48 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5">📷 Gallery</label>
                <textarea
                  rows={2}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  value={currentData.images?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('images', e.target.value)}
                  disabled={!canEditAll}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 resize-none"
                />
                {currentData.images && currentData.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {currentData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-24 sm:h-28 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid';
                          }}
                        />
                        <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                          {idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Compact Footer */}
        <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 flex-shrink-0">
          <div className="text-xs text-gray-600 text-center sm:text-left">
            <span className="font-semibold">Updated:</span> {new Date(project.updated_at).toLocaleDateString()}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {onSendForApproval && project.status === 'draft' && (
              <button
                onClick={onSendForApproval}
                disabled={updatingProjectStatus}
                className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send for Approval</span>
              </button>
            )}
            <button
              onClick={onUpdate}
              disabled={updatingProjectStatus}
              className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:from-blue-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updatingProjectStatus ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-700 transition-all"
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