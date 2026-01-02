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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl w-full max-w-5xl my-4 shadow-2xl shadow-blue-500/10 dark:shadow-blue-500/20 flex flex-col max-h-[96vh] transition-all duration-300 border border-gray-200/50 dark:border-slate-700/50 animate-in zoom-in-95 duration-300">
        {/* Enhanced Header with Gradient */}
        <div className="relative flex items-center justify-between p-4 sm:p-5 border-b border-gray-200/50 dark:border-slate-700/50 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex-shrink-0 overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-xl rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-white/30 transform hover:scale-105 transition-transform duration-300">
              <span className="text-white font-bold text-lg sm:text-2xl drop-shadow-lg">{project.title?.charAt(0) || 'P'}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate drop-shadow-md">Project Details</h2>
              <p className="text-xs sm:text-sm text-white/80 font-mono truncate mt-0.5">ID: {project.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative p-2 sm:p-2.5 text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all flex-shrink-0 ml-2 hover:rotate-90 duration-300 ring-1 ring-white/20 hover:ring-white/40"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Enhanced Status Bar with Glass Effect */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 bg-gradient-to-r from-gray-50/80 via-white/50 to-gray-50/80 dark:from-slate-800/80 dark:via-slate-800/50 dark:to-slate-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-slate-700/50 flex-shrink-0 transition-all">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs sm:text-sm">
            {/* Enhanced Status Badges */}
            <span
              className={`px-3 py-1.5 text-xs font-bold rounded-full shadow-sm ring-1 transition-all hover:scale-105 ${project.status === "approved"
                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white ring-green-500/20"
                : project.status === "pending"
                  ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white ring-yellow-500/20"
                  : project.status === "suspended"
                    ? "bg-gradient-to-r from-red-500 to-pink-500 text-white ring-red-500/20"
                    : project.status === "draft"
                      ? "bg-gradient-to-r from-gray-400 to-slate-400 text-white ring-gray-500/20"
                      : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white ring-blue-500/20"
                }`}
            >
              {project.status?.toUpperCase()}
            </span>

            {project.difficulty_level && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full text-xs font-bold shadow-sm ring-1 ring-blue-500/20 transition-all hover:scale-105">
                {project.difficulty_level?.toUpperCase()}
              </span>
            )}

            {project.is_featured && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 text-white rounded-full text-xs font-bold shadow-sm ring-1 ring-amber-500/20 transition-all hover:scale-105 animate-pulse">
                ⭐ FEATURED
              </span>
            )}

            {/* Enhanced Dates */}
            <div className="hidden sm:flex items-center gap-3 ml-auto text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm rounded-lg ring-1 ring-gray-200/50 dark:ring-slate-600/50">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs with Smooth Transitions */}
        <div className="flex gap-1 sm:gap-2 px-3 sm:px-4 pt-3 border-b border-gray-200/50 dark:border-slate-700/50 overflow-x-auto flex-shrink-0 bg-gradient-to-b from-gray-50/50 to-transparent dark:from-slate-800/50">
          {(['basic', 'technical', 'media'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 sm:px-5 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm rounded-t-xl transition-all duration-300 whitespace-nowrap ${activeTab === tab
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/10 scale-105 -mb-px'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:scale-102'
                }`}
            >
              {activeTab === tab && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"></div>
              )}
              {tab === 'basic' && '📋 Basic Info'}
              {tab === 'technical' && '⚙️ Technical'}
              {tab === 'media' && '🎨 Media & Links'}
            </button>
          ))}
        </div>

        {/* Scrollable Content with Smooth Animations */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 bg-gradient-to-b from-transparent via-gray-50/30 to-transparent dark:via-slate-800/30">
          {activeTab === 'basic' && (
            <div className="space-y-5 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Title */}
              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                  Project Title *
                </label>
                <input
                  type="text"
                  value={currentData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!canEditAll}
                  className="w-full px-4 py-3 text-sm sm:text-base border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600"
                />
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                  Description *
                </label>
                <textarea
                  rows={4}
                  value={currentData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!canEditAll}
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 resize-none transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600"
                />
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Key Features</label>
                <textarea
                  rows={3}
                  value={currentData.key_features || ''}
                  onChange={(e) => handleInputChange('key_features', e.target.value)}
                  disabled={!canEditAll}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 transition-colors"
                />
              </div>

              {/* Category and Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category *</label>
                  <select
                    value={currentData.category || 'web_development'}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    disabled={!canEditAll}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 dark:disabled:bg-slate-900 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
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
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Difficulty *</label>
                  <select
                    value={currentData.difficulty_level || 'beginner'}
                    onChange={(e) => handleInputChange('difficulty_level', e.target.value)}
                    disabled={!canEditAll}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 dark:disabled:bg-slate-900 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
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
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Delivery Time (days)</label>
                  <input
                    type="number"
                    min="0"
                    value={currentData.delivery_time || 0}
                    onChange={(e) => handleInputChange('delivery_time', Number(e.target.value))}
                    disabled={!canEditAll}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Author ID
                  </label>
                  <input
                    type="text"
                    value={project.author_id || ''}
                    disabled
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 font-mono"
                  />
                </div>
              </div>

              {/* Enhanced Pricing Section with Glass Effect */}
              <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 rounded-2xl p-4 sm:p-5 border-2 border-green-200/50 dark:border-green-700/50 shadow-lg shadow-green-500/5 transition-all hover:shadow-xl hover:shadow-green-500/10 hover:scale-[1.01] duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"></div>
                <h3 className="relative text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Pricing Details</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Sale Price *</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                        {currentData.pricing?.currency === 'USD' ? '$' : '₹'}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={currentData.pricing?.sale_price || 0}
                        onChange={(e) => handleNestedChange('pricing', 'sale_price', Number(e.target.value))}
                        disabled={!canEditAll}
                        className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Original Price *</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                        {currentData.pricing?.currency === 'USD' ? '$' : '₹'}
                      </span>
                      <input
                        type="number"
                        min="0"
                        value={currentData.pricing?.original_price || 0}
                        onChange={(e) => handleNestedChange('pricing', 'original_price', Number(e.target.value))}
                        disabled={!canEditAll}
                        className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Currency</label>
                    <select
                      value={currentData.pricing?.currency || 'INR'}
                      onChange={(e) => handleNestedChange('pricing', 'currency', e.target.value)}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-50 dark:disabled:bg-slate-900 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="INR">🇮🇳 INR (₹)</option>
                      <option value="USD">🇺🇸 USD ($)</option>
                    </select>
                  </div>
                </div>
                {currentData.pricing?.original_price && currentData.pricing?.sale_price && (
                  <div className="mt-2 p-2 bg-white/70 dark:bg-slate-800/70 rounded-lg">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Discount:</span>{' '}
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        {Math.round(((currentData.pricing.original_price - currentData.pricing.sale_price) / currentData.pricing.original_price) * 100)}% OFF
                      </span>
                    </p>
                  </div>
                )}
              </div>

              {/* Status Update Section */}
              {!canEditAll && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-3 sm:p-4 border border-yellow-200 dark:border-yellow-800 transition-colors">
                  <h4 className="text-sm sm:text-base font-bold text-yellow-900 dark:text-yellow-200 mb-3 flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Update Status
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-yellow-800 dark:text-yellow-300 mb-1.5">Project Status</label>
                      <select
                        value={projectUpdateData.status}
                        onChange={(e) => onUpdateDataChange({ ...projectUpdateData, status: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-yellow-300 dark:border-yellow-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="draft">Draft</option>
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="suspended">Suspended</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 p-2.5 bg-white/70 dark:bg-slate-800/70 rounded-lg cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-colors">
                      <input
                        type="checkbox"
                        checked={projectUpdateData.is_featured}
                        onChange={(e) => onUpdateDataChange({ ...projectUpdateData, is_featured: e.target.checked })}
                        className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-yellow-800 dark:text-yellow-300">Mark as Featured ⭐</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-5 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Tech Stack */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Technology Stack</label>
                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB (comma separated)"
                  value={currentData.tech_stack?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('tech_stack', e.target.value)}
                  disabled={!canEditAll}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 transition-colors"
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
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-3 sm:p-4 border border-purple-200 dark:border-purple-800 transition-colors">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  📋 Requirements
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
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
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 resize-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-5 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* URLs Section */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-3 sm:p-4 border border-cyan-200 dark:border-cyan-800 transition-colors">
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  🔗 Project Links
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      GitHub Repository
                      {!canEditAll && <span className="ml-2 text-xs text-orange-600">(Sensitive - Hidden from non-purchasers)</span>}
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/project"
                      value={currentData.github_url || ''}
                      onChange={(e) => handleInputChange('github_url', e.target.value)}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      Live Demo
                      <span className="ml-2 text-xs text-green-600">(Public - Visible to all)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://project-demo.com"
                      value={currentData.demo_url || ''}
                      onChange={(e) => handleInputChange('demo_url', e.target.value)}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                      YouTube Video
                      {!canEditAll && <span className="ml-2 text-xs text-orange-600">(Sensitive - Hidden from non-purchasers)</span>}
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={currentData.youtube_url || ''}
                      onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                      disabled={!canEditAll}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">🖼️ Project Thumbnail</label>
                <input
                  type="text"
                  placeholder="https://example.com/thumbnail.jpg"
                  value={currentData.thumbnail || ''}
                  onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                  disabled={!canEditAll}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 transition-colors"
                />
                {currentData.thumbnail && (
                  <div className="mt-3">
                    <img
                      src={currentData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full max-w-lg h-40 sm:h-48 object-cover rounded-lg border border-gray-200 dark:border-slate-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">📷 Gallery</label>
                <textarea
                  rows={2}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  value={currentData.images?.join(', ') || ''}
                  onChange={(e) => handleArrayChange('images', e.target.value)}
                  disabled={!canEditAll}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-50 dark:disabled:bg-slate-800 resize-none transition-colors"
                />
                {currentData.images && currentData.images.length > 0 && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                    {currentData.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Gallery ${idx + 1}`}
                          className="w-full h-24 sm:h-28 object-cover rounded-lg border border-gray-200 dark:border-slate-700"
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

        {/* Enhanced Footer with Gradient */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-200/50 dark:border-slate-700/50 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0 backdrop-blur-sm transition-all">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center sm:text-left">
            <div className="px-3 py-1.5 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm rounded-lg ring-1 ring-gray-200/50 dark:ring-slate-600/50 font-medium">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Updated:</span> {new Date(project.updated_at).toLocaleDateString()}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            {onSendForApproval && project.status === 'draft' && (
              <button
                onClick={onSendForApproval}
                disabled={updatingProjectStatus}
                className="group flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95 duration-300"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Send for Approval</span>
              </button>
            )}
            <button
              onClick={onUpdate}
              disabled={updatingProjectStatus}
              className="group flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white rounded-xl text-xs sm:text-sm font-bold hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 active:scale-95 duration-300"
            >
              {updatingProjectStatus ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-gray-600 dark:bg-slate-700 text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-gray-700 dark:hover:bg-slate-600 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95 duration-300 ring-1 ring-gray-500/20"
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