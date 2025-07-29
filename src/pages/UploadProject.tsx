import React, { useState } from 'react';
import { Upload, FileText, Video, DollarSign, Tag, User, Award, Shield, CheckCircle } from 'lucide-react';

const UploadProject = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    originalPrice: '',
    youtubeUrl: '',
    features: [''],
    techStack: ['']
  });

  const [dragActive, setDragActive] = useState(false);

  const categories = ['React', 'Java', 'Python', 'PHP', 'Node.js', 'Mobile', 'Full Stack'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      // Handle file upload
      console.log('File uploaded:', e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Project submitted for review! You will receive notification once it\'s approved.');
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      originalPrice: '',
      youtubeUrl: '',
      features: [''],
      techStack: ['']
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full text-sm font-bold mb-6">
            <Award className="w-4 h-4 mr-2" />
            Become a Top Seller
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sell Your Project
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Share your academic project with fellow students and start earning money today
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Earn Money</h3>
            <p className="text-gray-600">Set your own prices and earn from every sale</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Secure Platform</h3>
            <p className="text-gray-600">Safe payments and buyer protection guaranteed</p>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 text-center">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Build Reputation</h3>
            <p className="text-gray-600">Get reviews and build your seller profile</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                Basic Information
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="Enter your project title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Project Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  placeholder="Describe your project, what it does, and what makes it special..."
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Tag className="w-6 h-6 text-blue-600" />
                Project Features
              </h2>
              <div className="space-y-4">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'features')}
                      className="flex-1 px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="Enter a key feature"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'features')}
                        className="px-6 py-4 text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('features')}
                  className="px-6 py-3 text-blue-600 border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors font-semibold"
                >
                  + Add Feature
                </button>
              </div>
            </div>

            {/* Tech Stack */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <User className="w-6 h-6 text-blue-600" />
                Technology Stack
              </h2>
              <div className="space-y-4">
                {formData.techStack.map((tech, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={tech}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'techStack')}
                      className="flex-1 px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="e.g., React, Node.js, MongoDB"
                    />
                    {formData.techStack.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'techStack')}
                        className="px-6 py-4 text-red-600 border border-red-300 rounded-xl hover:bg-red-50 transition-colors font-semibold"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('techStack')}
                  className="px-6 py-3 text-blue-600 border border-blue-300 rounded-xl hover:bg-blue-50 transition-colors font-semibold"
                >
                  + Add Technology
                </button>
              </div>
            </div>

            {/* Media & Files */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Video className="w-6 h-6 text-blue-600" />
                Media & Files
              </h2>
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    YouTube Demo Video URL
                  </label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Project Files (ZIP) *
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                      dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                    <p className="text-xl font-bold text-gray-900 mb-3">
                      Drop your ZIP file here, or click to browse
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Maximum file size: 50MB
                    </p>
                    <button
                      type="button"
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
                    >
                      Choose File
                    </button>
                    <input
                      type="file"
                      accept=".zip,.rar"
                      required
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          console.log('File selected:', e.target.files[0]);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
                Pricing Strategy
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Sale Price (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="100"
                      className="w-full pl-8 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="25"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Original Price (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">$</span>
                    <input
                      type="number"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      required
                      min="1"
                      max="200"
                      className="w-full pl-8 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      placeholder="40"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-700 font-semibold">
                  💡 Tip: Show a higher original price to highlight the value and savings for buyers
                </p>
              </div>
            </div>

            {/* Terms */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Terms & Conditions</h3>
              <div className="space-y-4 text-sm text-gray-700">
                <label className="flex items-start gap-4">
                  <input type="checkbox" required className="mt-1 w-4 h-4" />
                  <span>I confirm that this is my original work and I have the right to sell it</span>
                </label>
                <label className="flex items-start gap-4">
                  <input type="checkbox" required className="mt-1 w-4 h-4" />
                  <span>I understand that my project will be reviewed by administrators before being published</span>
                </label>
                <label className="flex items-start gap-4">
                  <input type="checkbox" required className="mt-1 w-4 h-4" />
                  <span>I agree to provide support and answer questions about my project</span>
                </label>
                <label className="flex items-start gap-4">
                  <input type="checkbox" required className="mt-1 w-4 h-4" />
                  <span>I agree to the StudyStack Terms of Service and Privacy Policy</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                Submit for Review
              </button>
              <p className="text-sm text-gray-600 mt-6">
                Your project will be reviewed within 24-48 hours. You'll receive an email notification once it's approved.
              </p>
              
              {/* Success indicators */}
              <div className="flex items-center justify-center gap-8 mt-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Fast approval</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Global reach</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadProject;