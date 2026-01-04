import React, { useState, useEffect } from 'react';
import { X, Save, Send, Calendar, User, DollarSign, Package, Code, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { Project } from '../types/Project';

interface ProjectDetailsModalNewProps {
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

const ProjectDetailsModalNew: React.FC<ProjectDetailsModalNewProps> = ({
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
  const [activeSection, setActiveSection] = useState<'info' | 'pricing' | 'technical' | 'media' | 'status'>('info');

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

  // Determine if student can edit (draft, pending, or approved projects)
  const isStudent = canEditAll;
  const canStudentEdit = isStudent && (project.status === 'draft' || project.status === 'pending' || project.status === 'approved');
  const effectiveCanEdit = isStudent ? canStudentEdit : canEditAll;

  const sections = [
    { id: 'info', label: 'Basic Info', icon: Package },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'technical', label: 'Technical', icon: Code },
    { id: 'media', label: 'Media', icon: ImageIcon },
    ...(!isStudent ? [{ id: 'status' as const, label: 'Status', icon: CheckCircle }] : [])
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-7xl shadow-2xl flex flex-col lg:flex-row max-h-[95vh] overflow-hidden border border-gray-200/20 dark:border-slate-700/50 animate-in zoom-in-95 duration-300">
        
        {/* Sidebar Navigation */}
        <div className="lg:w-64 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 flex-shrink-0 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10">
            {/* Project Header */}
            <div className="mb-8">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 shadow-lg ring-2 ring-white/30">
                <span className="text-white font-bold text-2xl drop-shadow-lg">{project.title?.charAt(0) || 'P'}</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1 line-clamp-2">{project.title}</h3>
              <p className="text-white/70 text-xs font-mono">ID: {project.id?.slice(0, 8)}...</p>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'bg-white text-blue-600 shadow-lg scale-105'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                    <span className="font-semibold text-sm">{section.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Status Badge */}
            <div className="mt-8 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <p className="text-white/70 text-xs mb-2">Current Status</p>
              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-bold ${
                project.status === 'approved' ? 'bg-green-500 text-white' :
                project.status === 'pending' ? 'bg-yellow-500 text-white' :
                project.status === 'suspended' ? 'bg-red-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {project.status?.toUpperCase()}
              </span>
              {isStudent && !canStudentEdit && project.status !== 'approved' && (
                <p className="text-white/60 text-xs mt-2">
                  Contact admin to make changes
                </p>
              )}
              {isStudent && canStudentEdit && project.status === 'approved' && (
                <p className="text-white/90 text-xs mt-2 font-semibold">
                  ✅ You can edit
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-gray-50 to-white dark:from-slate-800 dark:to-slate-900">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Project Details</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {sections.find(s => s.id === activeSection)?.label}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:rotate-90 duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 dark:bg-slate-900/50">
            <div className="max-w-4xl mx-auto">
              
              {/* Status notification for students */}
              {isStudent && project.status === 'approved' && canStudentEdit && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl">
                  <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>
                      <strong>✅ Project Approved - You Can Edit:</strong> Your project is live and approved. You can edit your fields below. Any changes will be submitted for re-approval.
                    </span>
                  </p>
                </div>
              )}
              
              {/* Read-only warning for non-editable statuses */}
              {isStudent && !canStudentEdit && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>
                      <strong>Read-only mode:</strong> Your project is {project.status}. Contact admin to request changes.
                    </span>
                  </p>
                </div>
              )}
              
              {/* Basic Info Section */}
              {activeSection === 'info' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                      {/* Title */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Project Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={currentData.title || ''}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          disabled={!effectiveCanEdit}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
                          placeholder="Enter project title"
                        />
                      </div>

                      {/* Description */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={5}
                          value={currentData.description || ''}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          disabled={!effectiveCanEdit}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 resize-none transition-all"
                          placeholder="Describe your project in detail..."
                        />
                      </div>

                      {/* Key Features */}
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Key Features
                        </label>
                        <textarea
                          rows={4}
                          value={currentData.key_features || ''}
                          onChange={(e) => handleInputChange('key_features', e.target.value)}
                          disabled={!effectiveCanEdit}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 resize-none transition-all"
                          placeholder="List the main features of your project..."
                        />
                      </div>

                      {/* Category and Difficulty */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Category <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={currentData.category || 'web_development'}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            disabled={!effectiveCanEdit}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
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

                        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Difficulty Level <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={currentData.difficulty_level || 'beginner'}
                            onChange={(e) => handleInputChange('difficulty_level', e.target.value)}
                            disabled={!effectiveCanEdit}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                          </select>
                        </div>
                      </div>

                      {/* Delivery Time and Author */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Delivery Time (days)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={currentData.delivery_time || 0}
                            onChange={(e) => handleInputChange('delivery_time', Number(e.target.value))}
                            disabled={!effectiveCanEdit}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
                          />
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Author ID
                          </label>
                          <input
                            type="text"
                            value={project.author_id || ''}
                            disabled
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-gray-400 font-mono"
                          />
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Created Date</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {new Date(project.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Last Updated</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {new Date(project.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                </div>
              )}

              {/* Pricing Section */}
              {activeSection === 'pricing' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  {/* Currency Selection */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Currency
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleNestedChange('pricing', 'currency', 'INR')}
                        disabled={!effectiveCanEdit}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          currentData.pricing?.currency === 'INR'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-slate-600 hover:border-green-500'
                        } disabled:opacity-50`}
                      >
                        🇮🇳 INR (₹)
                      </button>
                      <button
                        onClick={() => handleNestedChange('pricing', 'currency', 'USD')}
                        disabled={!effectiveCanEdit}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          currentData.pricing?.currency === 'USD'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-slate-600 hover:border-green-500'
                        } disabled:opacity-50`}
                      >
                        🇺🇸 USD ($)
                      </button>
                    </div>
                  </div>

                  {/* Price Inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Original Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg font-bold">
                          {currentData.pricing?.currency === 'USD' ? '$' : '₹'}
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={currentData.pricing?.original_price || 0}
                          onChange={(e) => handleNestedChange('pricing', 'original_price', Number(e.target.value))}
                          disabled={!effectiveCanEdit}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 text-lg font-semibold focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
                        />
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Sale Price <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-lg font-bold">
                          {currentData.pricing?.currency === 'USD' ? '$' : '₹'}
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={currentData.pricing?.sale_price || 0}
                          onChange={(e) => handleNestedChange('pricing', 'sale_price', Number(e.target.value))}
                          disabled={!effectiveCanEdit}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 text-lg font-semibold focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Discount Display */}
                  {currentData.pricing?.original_price && currentData.pricing?.sale_price && currentData.pricing.original_price > currentData.pricing.sale_price && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-300 dark:border-green-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Discount Amount</p>
                          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                            {currentData.pricing.currency === 'USD' ? '$' : '₹'}
                            {(currentData.pricing.original_price - currentData.pricing.sale_price).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Discount Percentage</p>
                          <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                            {Math.round(((currentData.pricing.original_price - currentData.pricing.sale_price) / currentData.pricing.original_price) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Technical Section */}
              {activeSection === 'technical' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  {/* Tech Stack */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Technology Stack
                    </label>
                    <input
                      type="text"
                      placeholder="React, Node.js, MongoDB, TypeScript (comma separated)"
                      value={currentData.tech_stack?.join(', ') || ''}
                      onChange={(e) => handleArrayChange('tech_stack', e.target.value)}
                      disabled={!effectiveCanEdit}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
                    />
                    {currentData.tech_stack && currentData.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {currentData.tech_stack.map((tech, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs font-semibold shadow-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* System Requirements */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      System Requirements
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400">(Public)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Windows 10+, 8GB RAM, 2GB Storage (comma separated)"
                      value={currentData.requirements?.system_requirements?.join(', ') || ''}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        handleNestedChange('requirements', 'system_requirements', arr);
                      }}
                      disabled={!effectiveCanEdit}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
                    />
                  </div>

                  {/* Dependencies */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Dependencies
                      {!canEditAll && <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">(Sensitive)</span>}
                    </label>
                    <input
                      type="text"
                      placeholder="Node.js 18+, npm 9+, PostgreSQL 14+ (comma separated)"
                      value={currentData.requirements?.dependencies?.join(', ') || ''}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        handleNestedChange('requirements', 'dependencies', arr);
                      }}
                      disabled={!effectiveCanEdit}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
                    />
                  </div>

                  {/* Installation Steps */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Installation Steps
                      {!canEditAll && <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">(Sensitive)</span>}
                    </label>
                    <textarea
                      rows={4}
                      placeholder="1. Clone repository, 2. Run npm install, 3. Configure .env (comma separated)"
                      value={currentData.requirements?.installation_steps?.join(', ') || ''}
                      onChange={(e) => {
                        const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        handleNestedChange('requirements', 'installation_steps', arr);
                      }}
                      disabled={!effectiveCanEdit}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 resize-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Media Section */}
              {activeSection === 'media' && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  {/* GitHub Repository */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      GitHub Repository
                      {!canEditAll && <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">(Sensitive)</span>}
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/project"
                      value={currentData.github_url || ''}
                      onChange={(e) => handleInputChange('github_url', e.target.value)}
                      disabled={!effectiveCanEdit}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
                    />
                  </div>

                  {/* Live Demo URL */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Live Demo URL
                      <span className="ml-2 text-xs text-green-600 dark:text-green-400">(Public)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://demo.yourproject.com"
                      value={currentData.demo_url || ''}
                      onChange={(e) => handleInputChange('demo_url', e.target.value)}
                      disabled={!effectiveCanEdit}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
                    />
                  </div>

                  {/* YouTube Video */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      YouTube Video
                      {!canEditAll && <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">(Sensitive)</span>}
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={currentData.youtube_url || ''}
                      onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                      disabled={!effectiveCanEdit}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
                    />
                  </div>

                  {/* Thumbnail */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Project Thumbnail
                    </label>
                    <input
                      type="text"
                      placeholder="https://example.com/thumbnail.jpg"
                      value={currentData.thumbnail || ''}
                      onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                      disabled={!effectiveCanEdit}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 transition-all"
                    />
                    {currentData.thumbnail && (
                      <div className="mt-4">
                        <img
                          src={currentData.thumbnail}
                          alt="Thumbnail preview"
                          className="w-full max-w-2xl h-64 object-cover rounded-xl border-2 border-gray-200 dark:border-slate-700 shadow-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Invalid+Image';
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Gallery */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Image Gallery (comma separated URLs)
                    </label>
                    <textarea
                      rows={3}
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      value={currentData.images?.join(', ') || ''}
                      onChange={(e) => handleArrayChange('images', e.target.value)}
                      disabled={!effectiveCanEdit}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 resize-none transition-all"
                    />
                    {currentData.images && currentData.images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {currentData.images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={img}
                              alt={`Gallery ${idx + 1}`}
                              className="w-full h-32 object-cover rounded-xl border-2 border-gray-200 dark:border-slate-700 shadow-sm group-hover:shadow-lg transition-shadow"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid';
                              }}
                            />
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-lg font-bold">
                              #{idx + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status Section */}
              {activeSection === 'status' && !canEditAll && (
                <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                  {/* Project Status */}
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Project Status
                    </label>
                    <select
                      value={projectUpdateData.status}
                      onChange={(e) => onUpdateDataChange({ ...projectUpdateData, status: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 transition-all text-lg font-semibold"
                    >
                      <option value="draft">📝 Draft</option>
                      <option value="pending">⏳ Pending Review</option>
                      <option value="approved">✅ Approved</option>
                      <option value="suspended">🚫 Suspended</option>
                      <option value="archived">📦 Archived</option>
                    </select>
                  </div>

                  {/* Featured Toggle */}
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-5 border-2 border-yellow-300 dark:border-yellow-700">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={projectUpdateData.is_featured}
                        onChange={(e) => onUpdateDataChange({ ...projectUpdateData, is_featured: e.target.checked })}
                        className="w-6 h-6 text-yellow-600 rounded-lg focus:ring-yellow-500 focus:ring-2 cursor-pointer mt-0.5"
                      />
                      <div className="flex-1">
                        <span className="text-base font-bold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors block">
                          ⭐ Mark as Featured Project
                        </span>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Featured projects get priority placement and increased visibility
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Send for Approval */}
                  {project.status === 'draft' && onSendForApproval && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        This project is currently in draft status. Send it for approval to make it available for purchase.
                      </p>
                      <button
                        onClick={onSendForApproval}
                        disabled={updatingProjectStatus}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 duration-300"
                      >
                        <Send className="w-5 h-5" />
                        <span>Send for Approval</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-all hover:scale-105 active:scale-95 duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onUpdate}
              disabled={updatingProjectStatus}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 duration-300"
            >
              {updatingProjectStatus ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModalNew;
