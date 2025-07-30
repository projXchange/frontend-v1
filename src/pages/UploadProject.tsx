import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image, FileText, DollarSign, Tag, Globe, Eye, Star, Award } from 'lucide-react';

const UploadProject = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    price: '',
    tags: [] as string[],
    youtubeLink: '',
    githubLink: '',
    liveDemo: '',
    projectFile: null as File | null,
    thumbnail: null as File | null,
    features: [''],
    requirements: ['']
  });
  const [newTag, setNewTag] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [previewMode, setPreviewMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Web Development',
    'Java Projects',
    'AI & ML',
    'Mobile Apps',
    'Database',
    'Game Development',
    'Cybersecurity',
    'Full Stack'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Title is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.level) newErrors.level = 'Level is required';
      if (!formData.price) newErrors.price = 'Price is required';
      if (formData.tags.length === 0) newErrors.tags = 'At least one tag is required';
    }
    
    if (step === 2) {
      if (!formData.projectFile) newErrors.projectFile = 'Project file is required';
      if (!formData.thumbnail) newErrors.thumbnail = 'Thumbnail is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 8) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setFormData({ ...formData, thumbnail: file });
      } else {
        setFormData({ ...formData, projectFile: file });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'projectFile' | 'thumbnail') => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
      
      setFormData({
        ...formData,
        [type]: file
      });
    }
  };

  const handleArrayFieldChange = (field: 'features' | 'requirements', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayField = (field: 'features' | 'requirements') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    });
  };

  const removeArrayField = (field: 'features' | 'requirements', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      setCurrentStep(4);
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const StepIndicator = ({ step, currentStep, title }: { step: number, currentStep: number, title: string }) => (
    <div className="flex items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
        step <= currentStep 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' 
          : 'bg-gray-200 text-gray-600'
      }`}>
        {step <= currentStep ? <CheckCircle className="w-5 h-5" /> : step}
      </div>
      <div className="ml-3 hidden sm:block">
        <div className={`text-sm font-medium ${step <= currentStep ? 'text-blue-600' : 'text-gray-500'}`}>
          Step {step}
        </div>
        <div className={`text-xs ${step <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
          {title}
        </div>
      </div>
      {step < 4 && (
        <div className={`flex-1 h-0.5 mx-4 ${
          step < currentStep ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gray-200'
        }`} />
      )}
    </div>
  );

  const ProjectPreview = () => (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Project Preview</h3>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>{previewMode ? 'Hide' : 'Show'} Preview</span>
        </button>
      </div>
      
      {previewMode && (
        <div className="space-y-4">
          {formData.thumbnail && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={URL.createObjectURL(formData.thumbnail)}
                alt="Project thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">{formData.title || 'Project Title'}</h4>
            <p className="text-gray-600 mb-4">{formData.description || 'Project description will appear here...'}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {formData.price ? `₹${formData.price}` : 'Price'}
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">New Project</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 animate-slideInUp">
            Share Your <span className="gradient-text">Amazing Project</span>
          </h1>
          <p className="text-xl text-gray-600 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
            Help fellow students learn while earning money from your expertise
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-12 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center w-full max-w-4xl">
            <StepIndicator step={1} currentStep={currentStep} title="Project Info" />
            <StepIndicator step={2} currentStep={currentStep} title="Upload Files" />
            <StepIndicator step={3} currentStep={currentStep} title="Review" />
            <StepIndicator step={4} currentStep={currentStep} title="Complete" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Project Information</h2>
                  </div>
                  
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Project Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                        errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="e.g., Complete E-commerce Website with React & Node.js"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description *</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 resize-none ${
                        errors.description ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="Describe your project, its features, and what students will learn..."
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                      <p className="text-gray-400 text-sm ml-auto">{formData.description.length}/500</p>
                    </div>
                  </div>

                  {/* Category and Level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                          errors.category ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                      {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty Level *</label>
                      <select
                        value={formData.level}
                        onChange={(e) => setFormData({...formData, level: e.target.value})}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                          errors.level ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                      >
                        <option value="">Select difficulty level</option>
                        {levels.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>
                      {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹) *</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                          errors.price ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                        }`}
                        placeholder="2499"
                      />
                    </div>
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    <p className="text-gray-500 text-sm mt-1">Recommended: ₹1,000 - ₹5,000 for student projects</p>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Tags * (Max 8)</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1 border border-blue-200"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => handleTagRemove(tag)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                          className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                          placeholder="Add tags like React, Java, etc."
                          disabled={formData.tags.length >= 8}
                        />
                      </div>
                      <button
                        onClick={handleTagAdd}
                        disabled={formData.tags.length >= 8}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                    {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                  </div>

                  {/* Links */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">GitHub Repository</label>
                      <input
                        type="url"
                        value={formData.githubLink}
                        onChange={(e) => setFormData({...formData, githubLink: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                        placeholder="https://github.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Live Demo</label>
                      <input
                        type="url"
                        value={formData.liveDemo}
                        onChange={(e) => setFormData({...formData, liveDemo: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                        placeholder="https://demo.example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">YouTube Tutorial</label>
                      <input
                        type="url"
                        value={formData.youtubeLink}
                        onChange={(e) => setFormData({...formData, youtubeLink: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300"
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleNextStep}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                  >
                    Next: Upload Files
                  </button>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Upload Files</h2>
                  </div>
                  
                  {/* Project File Upload */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Project ZIP File *</label>
                    <div
                      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                        dragActive 
                          ? 'border-blue-500 bg-blue-50' 
                          : errors.projectFile 
                            ? 'border-red-300 bg-red-50' 
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        {formData.projectFile ? formData.projectFile.name : 'Drop your project ZIP file here'}
                      </p>
                      <p className="text-gray-500 mb-4">or click to browse</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".zip,.rar,.7z"
                        onChange={(e) => handleFileUpload(e, 'projectFile')}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                      >
                        Choose File
                      </button>
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-4">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Uploading... {uploadProgress}%</p>
                        </div>
                      )}
                    </div>
                    {errors.projectFile && <p className="text-red-500 text-sm mt-1">{errors.projectFile}</p>}
                  </div>

                  {/* Thumbnail Upload */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Project Thumbnail *</label>
                    <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      errors.thumbnail ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}>
                      {formData.thumbnail ? (
                        <div className="space-y-4">
                          <img
                            src={URL.createObjectURL(formData.thumbnail)}
                            alt="Thumbnail preview"
                            className="w-32 h-32 object-cover rounded-xl mx-auto"
                          />
                          <p className="text-sm text-gray-600">{formData.thumbnail.name}</p>
                          <button
                            onClick={() => setFormData({...formData, thumbnail: null})}
                            className="text-red-600 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <>
                          <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-lg font-semibold text-gray-700 mb-2">Upload project thumbnail</p>
                          <p className="text-gray-500 mb-4">PNG, JPG up to 5MB</p>
                          <input
                            ref={thumbnailInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'thumbnail')}
                            className="hidden"
                          />
                          <button
                            onClick={() => thumbnailInputRef.current?.click()}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                          >
                            Choose Image
                          </button>
                        </>
                      )}
                    </div>
                    {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                    >
                      Next: Review
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Review & Submit</h2>
                  </div>
                  
                  {/* Project Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Project Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Title</label>
                        <p className="text-gray-900 font-semibold">{formData.title}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Category</label>
                        <p className="text-gray-900 font-semibold">{formData.category}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Level</label>
                        <p className="text-gray-900 font-semibold">{formData.level}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Price</label>
                        <p className="text-gray-900 font-semibold">₹{formData.price}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-600">Description</label>
                      <p className="text-gray-900">{formData.description}</p>
                    </div>
                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-600">Tags</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.tags.map(tag => (
                          <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Files Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Uploaded Files</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-900">Project ZIP: {formData.projectFile?.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-gray-900">Thumbnail: {formData.thumbnail?.name}</span>
                      </div>
                      {formData.youtubeLink && (
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-gray-900">YouTube Tutorial: Added</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Important Notice */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-6 h-6 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Review Process</h4>
                        <ul className="text-sm text-gray-700 space-y-1">
                          <li>• Your project will be reviewed by our team within 1-2 business days</li>
                          <li>• We check for code quality, completeness, and educational value</li>
                          <li>• You'll receive an email notification about the review status</li>
                          <li>• Once approved, your project will be live on the platform</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
                    >
                      Submit for Review
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Award className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Project Submitted Successfully!</h2>
                  <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Congratulations! Your project has been submitted for review. Our team will review it within 1-2 business days 
                    and you'll receive an email notification about the status.
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-200">
                    <h3 className="font-bold text-gray-900 mb-6 text-xl">What happens next?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Quality Review</h4>
                          <p className="text-gray-600 text-sm">Our team reviews your project for quality, completeness, and educational value</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Email Notification</h4>
                          <p className="text-gray-600 text-sm">You'll receive an email notification about the review status within 1-2 days</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Go Live</h4>
                          <p className="text-gray-600 text-sm">Once approved, your project goes live and you can start earning!</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setFormData({
                          title: '', description: '', category: '', level: '', price: '',
                          tags: [], youtubeLink: '', githubLink: '', liveDemo: '',
                          projectFile: null, thumbnail: null, features: [''], requirements: ['']
                        });
                      }}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                    >
                      Upload Another Project
                    </button>
                    <button className="bg-gray-200 text-gray-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all duration-300">
                      Go to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Preview */}
            {currentStep < 4 && <ProjectPreview />}
            
            {/* Tips */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" />
                Success Tips
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Clear Title</h4>
                    <p className="text-gray-600 text-xs">Use descriptive titles that explain what your project does</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Quality Code</h4>
                    <p className="text-gray-600 text-xs">Include well-commented, clean code with documentation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Good Thumbnail</h4>
                    <p className="text-gray-600 text-xs">Use attractive screenshots or mockups as thumbnails</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Relevant Tags</h4>
                    <p className="text-gray-600 text-xs">Add accurate tags to help students find your project</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Guide */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                Pricing Guide
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Beginner Projects</span>
                  <span className="font-semibold text-gray-900">₹500 - ₹1,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Intermediate Projects</span>
                  <span className="font-semibold text-gray-900">₹1,500 - ₹3,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Advanced Projects</span>
                  <span className="font-semibold text-gray-900">₹3,000 - ₹5,000+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProject;