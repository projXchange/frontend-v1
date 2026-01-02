import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Target, Video, DollarSign } from 'lucide-react';
import { Project } from '../types/Project';
import toast from 'react-hot-toast';

interface StudentEditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onUpdate: (updatedData: Partial<Project>) => Promise<void>;
  updating: boolean;
}

const StudentEditProjectModal: React.FC<StudentEditProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdate,
  updating
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'pricing'>('basic');
  const [techStackInput, setTechStackInput] = useState('');
  
  // Form state - only fields from UploadProjectNew
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    techStack: [] as string[],
    description: '',
    githubUrl: '',
    liveDemoUrl: '',
    youtubeUrl: '',
    price: '',
    originalPrice: '',
    currency: 'INR',
    deliveryTime: '',
  });

  // Image URLs (not files, since we're editing)
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        category: project.category || '',
        techStack: project.tech_stack || [],
        description: project.description || '',
        githubUrl: project.github_url || '',
        liveDemoUrl: project.demo_url || '',
        youtubeUrl: project.youtube_url || '',
        price: project.pricing?.sale_price?.toString() || '',
        originalPrice: project.pricing?.original_price?.toString() || '',
        currency: project.pricing?.currency || 'INR',
        deliveryTime: project.delivery_time?.toString() || '',
      });
      setThumbnailUrl(project.thumbnail || '');
      setImageUrls(project.images || []);
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const categories = [
    { label: "Web Development", value: "web" },
    { label: "Backend Development", value: "backend" },
    { label: "Android Development", value: "android" },
    { label: "Java Projects", value: "java" },
    { label: "AI/ML Projects", value: "ai_ml" },
    { label: "Other", value: "other" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === "" || /^\d+$/.test(value)) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addTechStack = () => {
    const trimmed = techStackInput.trim();
    if (trimmed && !formData.techStack.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, trimmed]
      }));
      setTechStackInput('');
    }
  };

  const removeTechStack = (index: number) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Project title is required');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    if (formData.techStack.length === 0) {
      toast.error('Add at least one technology');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.price) {
      toast.error('Price is required');
      return;
    }

    // Prepare update data - only fields students can edit
    const updateData: Partial<Project> = {
      title: formData.title,
      category: formData.category,
      tech_stack: formData.techStack,
      description: formData.description,
      github_url: formData.githubUrl,
      demo_url: formData.liveDemoUrl,
      youtube_url: formData.youtubeUrl,
      thumbnail: thumbnailUrl,
      images: imageUrls,
      pricing: {
        sale_price: Number.parseFloat(formData.price),
        original_price: formData.originalPrice 
          ? Number.parseFloat(formData.originalPrice)
          : Number.parseFloat(formData.price),
        currency: formData.currency as 'INR' | 'USD',
      },
      delivery_time: formData.deliveryTime ? Number.parseInt(formData.deliveryTime, 10) : 0,
    };

    await onUpdate(updateData);
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Target },
    { id: 'media', label: 'Media', icon: Video },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
  ];

  const canEdit = project.status === 'draft' || project.status === 'pending';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden border border-gray-200/20 dark:border-slate-700/50">
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-slate-700/50 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg ring-2 ring-white/30">
              <span className="text-white font-bold text-2xl">{project.title?.charAt(0) || 'P'}</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Project</h2>
              <p className="text-sm text-white/80">{project.title}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="relative z-10 p-2.5 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!canEdit && (
          <div className="px-6 py-4 bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              <strong>Read-only:</strong> Your project is {project.status}. Contact admin to request changes.
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4 border-b border-gray-200/50 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-800/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-semibold text-sm rounded-t-xl transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-5">
            
            {/* Basic Info Tab */}
            {activeTab === 'basic' && (
              <>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50"
                    placeholder="Enter project title"
                  />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tech Stack <span className="text-red-500">*</span>
                  </label>
                  {formData.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.techStack.map((tech, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-sm font-medium">
                          {tech}
                          {canEdit && (
                            <button type="button" onClick={() => removeTechStack(idx)} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                  {canEdit && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={techStackInput}
                        onChange={(e) => setTechStackInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            addTechStack();
                          }
                        }}
                        placeholder="e.g., React"
                        className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                      <button
                        type="button"
                        onClick={addTechStack}
                        className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50 resize-none"
                    placeholder="Brief project description"
                  />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    GitHub URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50"
                    placeholder="https://github.com/username/repo"
                  />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Delivery Time (days)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    name="deliveryTime"
                    value={formData.deliveryTime}
                    onChange={handleNumericInput}
                    disabled={!canEdit}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50"
                    placeholder="1"
                  />
                </div>
              </>
            )}

            {/* Media Tab */}
            {activeTab === 'media' && (
              <>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    disabled={!canEdit}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                  {thumbnailUrl && (
                    <img src={thumbnailUrl} alt="Thumbnail" className="mt-3 w-full h-48 object-cover rounded-xl" />
                  )}
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    name="liveDemoUrl"
                    value={formData.liveDemoUrl}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50"
                    placeholder="https://demo.yourproject.com"
                  />
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    YouTube URL
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
              </>
            )}

            {/* Pricing Tab */}
            {activeTab === 'pricing' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Sale Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="price"
                        value={formData.price}
                        onChange={handleNumericInput}
                        disabled={!canEdit}
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50"
                        placeholder="500"
                      />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Original Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        name="originalPrice"
                        value={formData.originalPrice}
                        onChange={handleNumericInput}
                        disabled={!canEdit}
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50"
                        placeholder="800"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-slate-700">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 disabled:bg-gray-50 dark:disabled:bg-slate-800/50"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>

                {formData.price && formData.originalPrice && Number.parseFloat(formData.originalPrice) > Number.parseFloat(formData.price) && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-5 border-2 border-green-300 dark:border-green-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Discount</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {Math.round(((Number.parseFloat(formData.originalPrice) - Number.parseFloat(formData.price)) / Number.parseFloat(formData.originalPrice)) * 100)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Savings</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ₹{(Number.parseFloat(formData.originalPrice) - Number.parseFloat(formData.price)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-all"
          >
            Cancel
          </button>
          {canEdit && (
            <button
              onClick={handleSubmit}
              disabled={updating}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {updating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentEditProjectModal;
