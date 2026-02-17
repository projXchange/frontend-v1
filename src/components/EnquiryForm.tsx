import React, { useState } from 'react';
import { Send, Loader2, Plus, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import toast from 'react-hot-toast';
import { createEnquiry } from '../services/enquiries.service';

interface EnquiryFormData {
  projectTitle: string;
  projectDescription: string;
  budgetRange: string;
  timeline: string;
  techPreferences: string[];
  additionalRequirements: string;
}

interface EnquiryFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface FormErrors {
  projectTitle?: string;
  projectDescription?: string;
}

const BUDGET_RANGES = [
  { value: '', label: 'Select budget range' },
  { value: 'under-2500', label: 'Less than ₹2,500' },
  { value: '2500-5000', label: '₹2,500 - ₹5,000' },
  { value: '5000-10000', label: '₹5,000 - ₹10,000' },
  { value: '10000-15000', label: '₹10,000 - ₹15,000' },
  { value: '15000-20000', label: '₹15,000 - ₹20,000' },
  { value: '20000-30000', label: '₹20,000 - ₹30,000' },
  { value: 'above-30000', label: 'Above ₹30,000' },
  { value: 'not-sure', label: "I'm not sure yet" },
];

const TIMELINE_OPTIONS = [
  { value: '', label: 'Select timeline' },
  { value: '7-days', label: '7 Days' },
  { value: '15-days', label: '15 Days' },
  { value: '30-days', label: '30 Days' },
  { value: '45-days', label: '45 Days' },
  { value: '60-days', label: '60 Days' },
  { value: '90-days', label: '90 Days' },
  { value: 'flexible', label: 'Flexible' },
];

const EnquiryForm: React.FC<EnquiryFormProps> = ({ onSuccess, onError }) => {
  const { isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState<EnquiryFormData>({
    projectTitle: '',
    projectDescription: '',
    budgetRange: '',
    timeline: '',
    techPreferences: [],
    additionalRequirements: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [techInput, setTechInput] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<EnquiryFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form fields
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'projectTitle':
        if (!value.trim()) {
          return 'Project title is required';
        }
        if (value.trim().length < 3) {
          return 'Project title must be at least 3 characters';
        }
        return undefined;
      case 'projectDescription':
        if (!value.trim()) {
          return 'Project description is required';
        }
        if (value.trim().length < 10) {
          return 'Project description must be at least 10 characters';
        }
        return undefined;
      default:
        return undefined;
    }
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Handle blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
    setFocusedField(null);
  };

  // Handle tech preferences
  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && techInput.trim()) {
      e.preventDefault();
      const trimmedInput = techInput.trim().replace(/,$/g, ''); // Remove trailing comma
      if (trimmedInput && !formData.techPreferences.includes(trimmedInput)) {
        setFormData((prev) => ({
          ...prev,
          techPreferences: [...prev.techPreferences, trimmedInput],
        }));
      }
      setTechInput('');
    }
  };

  const addTechStack = () => {
    const trimmedInput = techInput.trim().replace(/,$/g, ''); // Remove trailing comma
    if (trimmedInput && !formData.techPreferences.includes(trimmedInput)) {
      setFormData((prev) => ({
        ...prev,
        techPreferences: [...prev.techPreferences, trimmedInput],
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      techPreferences: prev.techPreferences.filter((_, i) => i !== index),
    }));
  };

  // Check if form is valid
  const isFormValid = (): boolean => {
    const titleError = validateField('projectTitle', formData.projectTitle);
    const descError = validateField('projectDescription', formData.projectDescription);
    return !titleError && !descError;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!isFormValid()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      // Store form data and show auth modal
      setPendingFormData(formData);
      setIsAuthModalOpen(true);
      return;
    }

    // Submit the enquiry
    await submitEnquiry(formData);
  };

  // Submit enquiry to API
  const submitEnquiry = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    
    try {
      // Transform form data to API format (snake_case)
      const enquiryData = {
        project_title: data.projectTitle,
        project_description: data.projectDescription,
        budget_range: data.budgetRange || undefined,
        timeline: data.timeline || undefined,
        tech_preferences: data.techPreferences.length > 0 ? data.techPreferences : undefined,
        additional_requirements: data.additionalRequirements || undefined,
      };

      await createEnquiry(enquiryData);
      
      toast.success('Enquiry submitted successfully! We\'ll get back to you soon.');
      
      // Clear form
      setFormData({
        projectTitle: '',
        projectDescription: '',
        budgetRange: '',
        timeline: '',
        techPreferences: [],
        additionalRequirements: '',
      });
      setTouched({});
      
      // Call success callback
      onSuccess?.();
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to submit enquiry. Please try again.';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    
    // If there's pending form data, submit it
    if (pendingFormData) {
      submitEnquiry(pendingFormData);
      setPendingFormData(null);
    }
  };

  // Handle auth modal close
  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    setPendingFormData(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 px-6 sm:px-8 py-6 sm:py-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Submit Your Project Enquiry
          </h2>
          <p className="text-blue-100 dark:text-blue-200 text-sm sm:text-base">
            Tell us about your project and we'll get back to you soon
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-6 sm:py-8 space-y-6">
          {/* Project Title */}
          <div className="animate-slideIn">
            <label
              htmlFor="projectTitle"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="projectTitle"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={() => setFocusedField('projectTitle')}
              placeholder="e.g., E-commerce Website Development"
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 transition-all duration-300 ${
                focusedField === 'projectTitle'
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400 scale-[1.01]'
                  : errors.projectTitle && touched.projectTitle
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-gray-300 dark:border-slate-600'
              }`}
            />
            {errors.projectTitle && touched.projectTitle && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
                {errors.projectTitle}
              </p>
            )}
          </div>

          {/* Project Description */}
          <div className="animate-slideIn animation-delay-100">
            <label
              htmlFor="projectDescription"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Project Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="projectDescription"
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              onFocus={() => setFocusedField('projectDescription')}
              placeholder="Describe your project requirements, goals, and any specific features you need..."
              rows={5}
              maxLength={500}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 transition-all duration-300 resize-none ${
                focusedField === 'projectDescription'
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400 scale-[1.01]'
                  : errors.projectDescription && touched.projectDescription
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-gray-300 dark:border-slate-600'
              }`}
            />
            {errors.projectDescription && touched.projectDescription && (
              <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
                {errors.projectDescription}
              </p>
            )}
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
              {formData.projectDescription.length}/500 characters (minimum 10 required)
            </p>
          </div>

          {/* Budget Range and Timeline - Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 animate-slideIn animation-delay-200">
            {/* Budget Range */}
            <div>
              <label
                htmlFor="budgetRange"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Budget Range <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <select
                id="budgetRange"
                name="budgetRange"
                value={formData.budgetRange}
                onChange={handleChange}
                onFocus={() => setFocusedField('budgetRange')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 transition-all duration-300 ${
                  focusedField === 'budgetRange'
                    ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400 scale-[1.01]'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
              >
                {BUDGET_RANGES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Timeline */}
            <div>
              <label
                htmlFor="timeline"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Timeline <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                onFocus={() => setFocusedField('timeline')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 transition-all duration-300 ${
                  focusedField === 'timeline'
                    ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400 scale-[1.01]'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
              >
                {TIMELINE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tech Preferences */}
          <div className="animate-slideIn animation-delay-300">
            <label
              htmlFor="techPreferences"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Tech Preferences <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            
            {/* Display added tech stack tags */}
            {formData.techPreferences.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.techPreferences.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium animate-fadeIn"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(index)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input field for adding new tech */}
            <div className="flex gap-2">
              <input
                type="text"
                id="techPreferences"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                onFocus={() => setFocusedField('techPreferences')}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g., React, Node.js, Python"
                className={`flex-1 px-4 py-3 border rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 transition-all duration-300 ${
                  focusedField === 'techPreferences'
                    ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400 scale-[1.01]'
                    : 'border-gray-300 dark:border-slate-600'
                }`}
              />
              <button
                type="button"
                onClick={addTechStack}
                className="px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Press Enter or comma to add
            </p>
          </div>

          {/* Additional Requirements */}
          <div className="animate-slideIn animation-delay-400">
            <label
              htmlFor="additionalRequirements"
              className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2"
            >
              Additional Requirements <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <textarea
              id="additionalRequirements"
              name="additionalRequirements"
              value={formData.additionalRequirements}
              onChange={handleChange}
              onFocus={() => setFocusedField('additionalRequirements')}
              onBlur={() => setFocusedField(null)}
              placeholder="Any other details, constraints, or requirements we should know about..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-xl bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 transition-all duration-300 resize-none ${
                focusedField === 'additionalRequirements'
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400 scale-[1.01]'
                  : 'border-gray-300 dark:border-slate-600'
              }`}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 animate-slideIn animation-delay-500">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                isFormValid() && !isSubmitting
                  ? 'bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 hover:from-blue-700 hover:to-teal-700 dark:hover:from-blue-600 dark:hover:to-teal-600 hover:scale-105 hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-slate-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Enquiry
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleAuthModalClose}
        onSuccess={handleAuthSuccess}
        initialMode="login"
      />
    </div>
  );
};

export default EnquiryForm;
