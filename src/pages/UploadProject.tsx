import React, { useState } from 'react';
import { Project } from '../types/Project';
import { Upload, FileText, Video, IndianRupee, Tag, Award, Shield, CheckCircle, Image, X, Plus, AlertCircle, Sparkles, Eye, Send, Users } from 'lucide-react';

const UploadProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    difficulty: 'Beginner',
    features: [''],
    techStack: ['']
  });

  const [dragActive, setDragActive] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [documentationFiles, setDocumentationFiles] = useState<File[]>([]);
  const [archiveFiles, setArchiveFiles] = useState<File[]>([]);
  const [assetFiles, setAssetFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedSourceFiles, setUploadedSourceFiles] = useState<string[]>([]);
  const [uploadedDocFiles, setUploadedDocFiles] = useState<string[]>([]);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [imagesUploading, setImagesUploading] = useState(false);
  const [sourceFilesUploading, setSourceFilesUploading] = useState(false);
  const [docFilesUploading, setDocFilesUploading] = useState(false);

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = 'dmfh4f4yg'; // Replace with your cloud name
  const CLOUDINARY_UPLOAD_PRESET = 'projectXchange'; //

  const categories = [
    { label: 'Web Development', value: 'web_development' },
    { label: 'Mobile Development', value: 'mobile_development' },
    { label: 'Desktop Application', value: 'desktop_application' },
    { label: 'AI/Machine Learning', value: 'ai_machine_learning' },
    { label: 'Blockchain', value: 'blockchain' },
    { label: 'Game Development', value: 'game_development' },
    { label: 'Data Science', value: 'data_science' },
    { label: 'DevOps', value: 'devops' },
    { label: 'API/Backend', value: 'api_backend' },
    { label: 'Automation Scripts', value: 'automation_scripts' },
    { label: 'UI/UX Design', value: 'ui_ux_design' },
    { label: 'Other', value: 'other' }
  ];
  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];


  // Generic upload function for Cloudinary
  const uploadToCloudinary = async (file: File, folder: string, resourceType: 'image' | 'raw' = 'image'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  // 1. Thumbnail Upload (Single Image)
  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setThumbnailUploading(true);
    try {
      // Store temporarily, will upload with project ID later
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Store file for later upload
      setFormData(prev => ({ ...prev, thumbnailUrl: 'TEMP_FILE' }));

      // You can also store the file in state if needed
      alert('Thumbnail selected! It will be uploaded when you submit the project.');
    } catch (error) {
      alert('Failed to process thumbnail.');
    } finally {
      setThumbnailUploading(false);
    }
  };

  // 2. Multiple Images Upload
  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
  
    const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('Please upload image files only');
      return;
    }
  
    const alreadyUploadedImages = uploadedFiles.filter(f => f.type.startsWith('image/')).length;
    const remainingSlots = 3 - alreadyUploadedImages;
  
    if (imageFiles.length > remainingSlots) {
      alert(`You can upload a maximum of 3 images. You already uploaded ${alreadyUploadedImages}, so you can select up to ${remainingSlots} more.`);
      return;
    }
  
    setImagesUploading(true);
    setUploadedFiles(prev => [...prev, ...imageFiles]);
    alert(`${imageFiles.length} image(s) selected! They will be uploaded when you submit the project.`);
    setImagesUploading(false);
  };
  

  // 3. Source Files Upload (ZIP, RAR, etc.)
  const handleSourceFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
  
    const maxSize = 10 * 1024 * 1024; // 10 MB
    const sourceFiles = Array.from(files).filter(file =>
      (file.name.endsWith('.zip') ||
        file.name.endsWith('.rar') ||
        file.name.endsWith('.7z') ||
        file.name.endsWith('.tar') ||
        file.name.endsWith('.gz')) &&
      file.size <= maxSize
    );
  
    if (sourceFiles.length === 0) {
      alert('Please upload valid source files (.zip, .rar, .7z, .tar, .gz) with a maximum size of 10 MB.');
      return;
    }
  
    setSourceFilesUploading(true);
    setUploadedFiles(prev => [...prev, ...sourceFiles]);
    alert(`${sourceFiles.length} source file(s) selected! They will be uploaded when you submit the project.`);
    setSourceFilesUploading(false);
  };
  

  // 4. Documentation Files Upload (PDF, MD, DOCX, etc.)
  const handleDocFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const maxSize = 10 * 1024 * 1024; // 10 MB in bytes

    const docFiles = Array.from(files).filter(file =>
      (file.name.endsWith('.pdf') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.docx') ||
        file.name.endsWith('.doc')) &&
      file.size <= maxSize
    );
  
    if (docFiles.length === 0) {
      alert('Please upload valid documentation files (.pdf, .md, .txt, .docx, .doc) with a maximum size of 10 MB.');
      return;
    }

    setDocFilesUploading(true);
    setUploadedFiles(prev => [...prev, ...docFiles]);
    alert(`${docFiles.length} documentation file(s) selected! They will be uploaded when you submit the project.`);
    setDocFilesUploading(false);
  };

  // Remove uploaded image
  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  // Remove file from uploadedFiles
  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Project title is required';
        } else if (value.length < 5) {
          newErrors.title = 'Title must be at least 5 characters';
        } else {
          delete newErrors.title;
        }
        break;
      case 'description':
        if (!value.trim()) {
          newErrors.description = 'Description is required';
        } else if (value.length < 50) {
          newErrors.description = 'Description must be at least 50 characters';
        } else {
          delete newErrors.description;
        }
        break;
      case 'price':
        if (!value) {
          newErrors.price = 'Price is required';
        } else if (parseFloat(value) < 1) {
          newErrors.price = 'Price must be at least $1';
        } else {
          delete newErrors.price;
        }
        break;
      // githubUrl, youtubeUrl, liveDemo are admin-only now; no validation here
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const handleArrayChange = (index: number, value: string, field: 'features' | 'techStack') => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field: 'features' | 'techStack') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index: number, field: 'features' | 'techStack') => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      categorizeAndStoreFiles(files);

      // If it's an image, set as preview
      const img = files.find(file => file.type.startsWith('image/'));
      if (img) {
        const reader = new FileReader();
        reader.onload = (loadEvent) => {
          setPreviewImage(loadEvent.target?.result as string);
        };
        reader.readAsDataURL(img);
      }
    }
  };

  const getAllFiles = (): File[] => [...imageFiles, ...documentationFiles, ...archiveFiles, ...assetFiles];

  const removeFile = (index: number) => {
    const all = getAllFiles();
    const file = all[index];
    if (!file) return;
    if (file.type.startsWith('image/')) {
      setImageFiles(prev => prev.filter(f => f !== file));
      return;
    }
    if (file.name.endsWith('.pdf') || file.name.endsWith('.md')) {
      setDocumentationFiles(prev => prev.filter(f => f !== file));
      return;
    }
    if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) {
      setArchiveFiles(prev => prev.filter(f => f !== file));
      return;
    }
    setAssetFiles(prev => prev.filter(f => f !== file));
  };

  const categorizeAndStoreFiles = (files: File[]) => {
    if (!files || files.length === 0) return;
    const imgs: File[] = [];
    const docs: File[] = [];
    const archives: File[] = [];
    const assets: File[] = [];
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        imgs.push(file);
      } else if (file.name.endsWith('.pdf') || file.name.endsWith('.md')) {
        docs.push(file);
      } else if (file.name.endsWith('.zip') || file.name.endsWith('.rar')) {
        archives.push(file);
      } else {
        assets.push(file);
      }
    });
    if (imgs.length) setImageFiles(prev => [...prev, ...imgs]);
    if (docs.length) setDocumentationFiles(prev => [...prev, ...docs]);
    if (archives.length) setArchiveFiles(prev => [...prev, ...archives]);
    if (assets.length) setAssetFiles(prev => [...prev, ...assets]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (typeof formData[key as keyof typeof formData] === 'string') {
        validateField(key, formData[key as keyof typeof formData] as string);
      }
    });

    if (Object.keys(errors).length === 0) {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found. Please login again.');
        }

        // Single API call with all project data
        const allFiles = getAllFiles();

        const projectData: Partial<Project> = {
          title: formData.title,
          description: formData.description,
          key_features: formData.features.filter(f => f.trim()).join(', '),
          category: formData.category,
          difficulty_level: formData.difficulty.toLowerCase(),
          tech_stack: formData.techStack.filter(tech => tech.trim()),
          // github_url, demo_url will be set by admin
          status: "pending_review",
          documentation: formData.description,
          pricing: {
            sale_price: parseFloat(formData.price),
            original_price: formData.originalPrice ? parseFloat(formData.originalPrice) : parseFloat(formData.price),
            currency: "INR"
          },
          delivery_time: 1,
          // Consolidated dump fields
          thumbnail: previewImage || (imageFiles.length > 0 ? imageFiles[0].name : ""),
          images: imageFiles.map(file => file.name),
          // demo_video will be set by admin
          features: formData.features.filter(f => f.trim()),
          tags: formData.techStack.filter(tech => tech.trim()),
          files: {
            source_files: archiveFiles.map(file => file.name),
            documentation_files: documentationFiles.map(file => file.name),
            assets: assetFiles.map(file => file.name),
            size_mb: allFiles.reduce((total, file) => total + (file.size / 1024 / 1024), 0)
          },
          requirements: {
            system_requirements: ["Windows 10 or higher", "Node.js 16+", "Modern web browser"],
            dependencies: formData.techStack.filter(tech => tech.trim()),
            installation_steps: ["Clone the repository", "Install dependencies", "Run the application"]
          },
          stats: {
            total_downloads: 0,
            total_views: 0,
            total_likes: 0,
            completion_rate: 0
          },
          rating: {
            average_rating: 0,
            total_ratings: 0,
            rating_distribution: {
              "5": 0,
              "4": 0,
              "3": 0,
              "2": 0,
              "1": 0
            }
          }
        };

        console.log('Sending project data:', projectData);
        
        const response = await fetch('https://projxchange-backend-v1.vercel.app/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(initialProjectData)
        });

        console.log('Project response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Project creation error:', errorData);
          throw new Error(`Failed to create project: ${errorData.error || response.statusText}`);
        }

        const result = await response.json();
        console.log('Project creation response:', result);

        alert('Project submitted successfully! You will receive notification once it\'s approved.');
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          category: '',
          price: '',
          originalPrice: '',
          difficulty: 'Beginner',
          features: [''],
          techStack: ['']
        });
        setImageFiles([]);
        setDocumentationFiles([]);
        setArchiveFiles([]);
        setAssetFiles([]);
        setPreviewImage('');
        setCurrentStep(1);

      } catch (error) {
        console.error('Error submitting project:', error);
        alert('Failed to submit project. Please try again.');
      }
    }
  };

  const ProjectPreview = () => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <div className="relative">
        {previewImage ? (
          <img src={previewImage} alt="Preview" className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
            <Image className="w-12 h-12 text-blue-400" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            {categories.find(cat => cat.value === formData.category)?.label || 'Category'}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${formData.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
            formData.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
            {formData.difficulty}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {formData.title || 'Your Project Title'}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {formData.description || 'Your project description will appear here...'}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.techStack.filter(tech => tech.trim()).slice(0, 3).map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{formData.price || '0'}
            </span>
            {formData.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                ₹{formData.originalPrice}
              </span>
            )}
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  const steps = [
    { id: 1, title: 'Basic Info', icon: FileText },
    { id: 2, title: 'Details', icon: Tag },
    { id: 3, title: 'Media & Files', icon: Upload },
    { id: 4, title: 'Pricing', icon: IndianRupee }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slideInDown">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full text-sm font-bold mb-6">
            <Award className="w-4 h-4 mr-2" />
            Share Your Amazing Project
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Upload Your Project
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share your work with the community and help fellow developers learn from your expertise
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12 animate-slideInUp">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${currentStep >= step.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 shadow-md'
                    }`}>
                    <step.icon className="w-5 h-5" />
                    <span className="font-semibold text-sm">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 rounded-full transition-colors duration-300 ${currentStep > step.id ? 'bg-gradient-to-r from-blue-600 to-teal-600' : 'bg-gray-200'
                      }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 animate-slideInLeft">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="animate-slideInUp">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                      Basic Information
                    </h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter an engaging project title"
                          className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 ${errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                        />
                        {errors.title && (
                          <p className="text-red-600 text-sm mt-2 flex items-center gap-2 animate-shake">
                            <AlertCircle className="w-4 h-4" />
                            {errors.title}
                          </p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            Category *
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            <option value="">Select a category</option>
                            {categories.map(category => (
                              <option key={category.value} value={category.value}>{category.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            Difficulty Level
                          </label>
                          <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleInputChange}
                            className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          >
                            {difficulties.map(difficulty => (
                              <option key={difficulty} value={difficulty}>{difficulty}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Project Description *
                          <span className="text-gray-500 font-normal ml-2">
                            ({formData.description.length}/500 characters)
                          </span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={6}
                          maxLength={500}
                          placeholder="Describe your project, what it does, what makes it special, and what others can learn from it..."
                          className={`w-full px-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-200 resize-none ${errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                        />
                        {errors.description && (
                          <p className="text-red-600 text-sm mt-2 flex items-center gap-2 animate-shake">
                            <AlertCircle className="w-4 h-4" />
                            {errors.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Features & Tech Stack */}
                {currentStep === 2 && (
                  <div className="animate-slideInUp">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                      <Tag className="w-6 h-6 text-blue-600" />
                      Project Details
                    </h2>

                    <div className="space-y-8">
                      {/* Features */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4">
                          Key Features
                        </label>
                        <div className="space-y-3">
                          {formData.features.map((feature, index) => (
                            <div key={index} className="flex gap-3 animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'features')}
                                placeholder="Enter a key feature"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              />
                              {formData.features.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem(index, 'features')}
                                  className="px-4 py-3 text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors font-semibold"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addArrayItem('features')}
                            className="flex items-center gap-2 px-4 py-3 text-blue-600 border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors font-semibold"
                          >
                            <Plus className="w-4 h-4" />
                            Add Feature
                          </button>
                        </div>
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4">
                          Technology Stack
                        </label>
                        <div className="space-y-3">
                          {formData.techStack.map((tech, index) => (
                            <div key={index} className="flex gap-3 animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                              <input
                                type="text"
                                value={tech}
                                onChange={(e) => handleArrayChange(index, e.target.value, 'techStack')}
                                placeholder="e.g., React, Node.js, MongoDB"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              />
                              {formData.techStack.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem(index, 'techStack')}
                                  className="px-4 py-3 text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors font-semibold"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addArrayItem('techStack')}
                            className="flex items-center gap-2 px-4 py-3 text-blue-600 border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors font-semibold"
                          >
                            <Plus className="w-4 h-4" />
                            Add Technology
                          </button>
                        </div>
                      </div>

                      {/* Admin will set URLs; hide from uploader */}
                    </div>
                  </div>
                )}

                {/* Step 3: Media & Files */}
                {currentStep === 3 && (
                  <div className="animate-slideInUp">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                      <Video className="w-6 h-6 text-blue-600" />
                      Media & Files
                    </h2>

                    <div className="space-y-8">
                      {/* Admin will set video URL; hide from uploader */}

                      {/* 2. Multiple Images Upload */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Project Screenshots (Multiple Images)
                        </label>
                        <div
                          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                            }`}
                          onDragEnter={handleDrag}
                          onDragLeave={handleDrag}
                          onDragOver={handleDrag}
                          onDrop={handleDrop}
                        >
                          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                          <p className="text-xl font-bold text-gray-900 mb-3">
                            Drop your files here, or click to browse
                          </p>
                          <p className="text-sm text-gray-600 mb-4">
                            Upload project files, screenshots, or documentation
                          </p>
                          <button
                            type="button"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
                          >
                            Choose Files
                          </button>
                          <input
                            type="file"
                            multiple
                            accept=".zip,.rar,.jpg,.jpeg,.png,.gif,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files) {
                                const files = Array.from(e.target.files);
                                categorizeAndStoreFiles(files);
                              }
                            }}
                          />
                        </div>
                      </div>

                        {/* Uploaded Files */}
                        {getAllFiles().length > 0 && (
                          <div className="mt-6 space-y-3">
                            <h4 className="font-semibold text-gray-900">Uploaded Files:</h4>
                            {getAllFiles().map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">{file.name}</span>
                                  <span className="text-xs text-gray-500">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* 4. Documentation Files Upload */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Documentation Files (PDF, MD, DOCX, etc.)
                        </label>
                        <div className="space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-red-600 mb-4">a maximum size of 10 MB.</p>
                            <p className="text-gray-600 mb-4">Upload documentation files (.pdf, .md, .txt, .docx, .doc)</p>
                            <label className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 cursor-pointer">
                              {docFilesUploading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4" />
                                  Choose Documentation
                                </>
                              )}
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.md,.txt,.docx,.doc"
                                onChange={handleDocFilesUpload}
                                disabled={docFilesUploading}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {/* Display Selected Documentation Files */}
                          {uploadedFiles.filter(f =>
                            f.name.endsWith('.pdf') || f.name.endsWith('.md') ||
                            f.name.endsWith('.txt') || f.name.endsWith('.docx') || f.name.endsWith('.doc')
                          ).length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-semibold text-gray-900">
                                  Selected Documentation Files ({uploadedFiles.filter(f =>
                                    f.name.endsWith('.pdf') || f.name.endsWith('.md') ||
                                    f.name.endsWith('.txt') || f.name.endsWith('.docx') || f.name.endsWith('.doc')
                                  ).length}):
                                </h4>
                                <div className="space-y-2">
                                  {uploadedFiles
                                    .map((file, index) => ({ file, index }))
                                    .filter(({ file }) =>
                                      file.name.endsWith('.pdf') || file.name.endsWith('.md') ||
                                      file.name.endsWith('.txt') || file.name.endsWith('.docx') || file.name.endsWith('.doc')
                                    )
                                    .map(({ file, index }) => (
                                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-green-600" />
                                          </div>
                                          <span className="text-sm font-medium text-gray-900">{file.name}</span>
                                          <span className="text-xs text-gray-500">
                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                          </span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeFile(index)}
                                          className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                        >
                                          <X className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* YouTube URL */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          YouTube Demo Video URL (Optional)
                        </label>
                        <input
                          type="url"
                          name="youtubeUrl"
                          value={formData.youtubeUrl}
                          onChange={handleInputChange}
                          placeholder="https://youtube.com/watch?v=..."
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${errors.youtubeUrl ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                        />
                        {errors.youtubeUrl && (
                          <p className="text-red-600 text-sm mt-2">{errors.youtubeUrl}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Pricing */}
                {currentStep === 4 && (
                  <div className="animate-slideInUp">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                      <IndianRupee className="w-6 h-6 text-blue-600" />
                      Pricing Strategy
                    </h2>

                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            Sale Price (INR) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
                            <input
                              type="number"
                              name="price"
                              value={formData.price}
                              onChange={handleInputChange}
                              min="10"
                              max="10000"
                              placeholder="500"
                              className={`w-full pl-8 pr-4 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                            />
                          </div>
                          {errors.price && (
                            <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              {errors.price}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            Original Price (INR)
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
                            <input
                              type="number"
                              name="originalPrice"
                              value={formData.originalPrice}
                              onChange={handleInputChange}
                              min="10"
                              max="20000"
                              placeholder="800"
                              className="w-full pl-8 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      {formData.price &&
                        formData.originalPrice &&
                        parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
                          <div className="p-4 bg-green-50 rounded-xl border border-green-200 animate-slideInUp">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-green-800 font-semibold">
                                  Great! You're offering a{' '}
                                  {Math.round(
                                    (1 -
                                      parseFloat(formData.price) /
                                      parseFloat(formData.originalPrice)) *
                                    100
                                  )}
                                  % discount
                                </p>
                                <p className="text-green-700 text-sm">
                                  Customers will save ₹
                                  {(parseFloat(formData.originalPrice) -
                                    parseFloat(formData.price)).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                      <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                        <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Pricing Tips
                        </h4>
                        <ul className="space-y-2 text-sm text-blue-800">
                          <li>• Research similar projects to set competitive prices</li>
                          <li>• Consider the complexity and time invested in your project</li>
                          <li>• Higher original prices can make your discount more attractive</li>
                          <li>• Start with lower prices to build reviews and reputation</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}


                {/* Navigation Buttons */}
                <div className="flex justify-between pt-8 border-t border-gray-200">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Previous
                    </button>
                  )}

                  <div className="ml-auto flex gap-4">
                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(prev => prev + 1)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        Next Step
                      </button>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setShowPreview(!showPreview)}
                          className="flex items-center gap-2 px-6 py-3 border border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                        >
                          <Send className="w-4 h-4" />
                          Submit Project
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Preview Card */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30 animate-slideInRight">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Live Preview
              </h3>
              <ProjectPreview />
            </div>

            {/* Benefits */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30 animate-slideInRight" style={{ animationDelay: '200ms' }}>
              <h3 className="text-xl font-bold mb-6">Why Upload Your Project?</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <IndianRupee className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Earn money from your work</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Help other developers learn</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Build your reputation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Secure platform & payments</span>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/30 animate-slideInRight" style={{ animationDelay: '400ms' }}>
              <h3 className="text-xl font-bold mb-6">Submission Guidelines</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ensure your project is original and functional</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Include clear documentation and setup instructions</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use high-quality screenshots and demo videos</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Projects are reviewed within 24-48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Project Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ProjectPreview />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProject;