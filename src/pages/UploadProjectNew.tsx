import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Upload,
  FileText,
  Github,
  Info,
  X,
  CheckCircle,
  ImageIcon,
  AlertCircle,
  Sparkles,
  Shield,
  Clock,
  TrendingUp,
  Target,
  Zap,
  Video,
  Rocket,
  Award,
  ArrowRight,
  ArrowLeft,
  Eye,
  Plus,
} from "lucide-react"
import toast from "react-hot-toast"
import { apiClient } from "../utils/apiClient"
import { getApiUrl } from "../config/api"

const UploadProjectNew = () => {
  const navigate = useNavigate()

  // Helper function to validate URLs
  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = "dmfh4f4yg"
  const CLOUDINARY_UPLOAD_PRESET = "projectXchange"

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    customCategory: "",
    techStack: [] as string[],
    description: "",
    keyFeatures: "",
    githubUrl: "",
    thumbnailFile: null as File | null,
    screenshots: [] as File[],

    // Enhancement services toggle
    completeDocumentationEnabled: false,
    documentationFile: null as File | null,
    installationGuideText: "",
    systemRequirementsText: "",
    dependenciesText: "",

    // Optional links
    liveDemoUrl: "",
    youtubeUrl: "",

    // Pricing
    price: "",
    originalPrice: "",
    currency: "INR",
    deliveryTime: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [showGithubModal, setShowGithubModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([])
  const [showPreview, setShowPreview] = useState(true)
  const [techStackInput, setTechStackInput] = useState("")

  const categories = [
    { label: "Web Development", value: "web_development" },
    { label: "Mobile Development", value: "mobile_development" },
    { label: "Desktop Application", value: "desktop_application" },
    { label: "AI/Machine Learning", value: "ai_machine_learning" },
    { label: "Blockchain", value: "blockchain" },
    { label: "Game Development", value: "game_development" },
    { label: "Data Science", value: "data_science" },
    { label: "DevOps", value: "devops" },
    { label: "API/Backend", value: "api_backend" },
    { label: "Automation Scripts", value: "automation_scripts" },
    { label: "UI/UX Design", value: "ui_ux_design" },
    { label: "Other", value: "other" },
  ]

  // Upload file to Cloudinary
  const uploadToCloudinary = async (
    file: File,
    folder: string,
    resourceType: "image" | "raw" = "image",
  ): Promise<string> => {
    const formDataUpload = new FormData()
    formDataUpload.append("file", file)
    formDataUpload.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
    formDataUpload.append("folder", folder)

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        {
          method: "POST",
          body: formDataUpload,
        },
      )

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error("Cloudinary upload error:", error)
      throw error
    }
  }

  const steps = [
    { id: 1, title: "Basic Info", icon: Target, color: "from-blue-600 to-cyan-600", description: "Tell us about your project" },
    { id: 2, title: "Project Media", icon: Video, color: "from-purple-600 to-pink-600", description: "Show it off" },
    { id: 3, title: "Enhancements", icon: Zap, color: "from-orange-600 to-red-600", description: "Optional services" },
    { id: 4, title: "Publish & Price", icon: Rocket, color: "from-green-600 to-teal-600", description: "Set your price" },
  ]

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle numeric input (only allow numbers)
  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Allow empty string or valid numbers only
    if (value === "" || /^\d+$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }
  const handleTechStackKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTechStack()
    }
  }

  const addTechStack = () => {
    const trimmedInput = techStackInput.trim()
    if (trimmedInput && !formData.techStack.includes(trimmedInput)) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, trimmedInput],
      }))
      setTechStackInput("")
    }
  }

  const removeTechStack = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index),
    }))
  }

  // Handle thumbnail upload
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    setFormData((prev) => ({ ...prev, thumbnailFile: file }))

    const reader = new FileReader()
    reader.onload = (e) => {
      setThumbnailPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
    toast.success("Thumbnail selected!")
  }

  // Handle screenshots upload
  const handleScreenshotsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))

    if (formData.screenshots.length + imageFiles.length > 3) {
      toast.error("You can upload a maximum of 3 screenshots")
      return
    }

    setFormData((prev) => ({ ...prev, screenshots: [...prev.screenshots, ...imageFiles] }))

    imageFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setScreenshotPreviews((prev) => [...prev, e.target?.result as string])
      }
      reader.readAsDataURL(file)
    })

    toast.success(`${imageFiles.length} screenshot(s) added!`)
  }

  // Remove screenshot
  const removeScreenshot = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index),
    }))
    setScreenshotPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Handle documentation file upload
  const handleDocumentationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".pdf") && !file.name.endsWith(".md") && !file.name.endsWith(".txt")) {
      toast.error("Please upload a PDF, Markdown, or Text file")
      return
    }

    setFormData((prev) => ({ ...prev, documentationFile: file }))
    toast.success("Documentation file selected!")
  }

  // Validate current step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          toast.error("Project title is required")
          return false
        }
        if (!formData.category) {
          toast.error("Please select a category")
          return false
        }
        if (formData.category === "other" && !formData.customCategory.trim()) {
          toast.error("Please enter a custom category")
          return false
        }
        if (formData.techStack.length === 0) {
          toast.error("Please add at least one technology")
          return false
        }
        if (!formData.description.trim()) {
          toast.error("Short description is required")
          return false
        }
        if (formData.description.trim().length < 100) {
          toast.error("Short description must be at least 100 characters")
          return false
        }
        if (!formData.githubUrl.trim()) {
          toast.error("GitHub repository URL is required")
          return false
        }
        if (formData.githubUrl && !formData.githubUrl.includes("github.com")) {
          toast.error("Please enter a valid GitHub URL")
          return false
        }
        return true
      case 2:
        if (!formData.thumbnailFile) {
          toast.error("Thumbnail image is required")
          return false
        }
        // At least one of demo URL or YouTube URL is required
        if (!formData.liveDemoUrl.trim() && !formData.youtubeUrl.trim()) {
          toast.error("Please provide at least one: Live Demo URL or YouTube URL")
          return false
        }
        if (formData.liveDemoUrl && !isValidUrl(formData.liveDemoUrl)) {
          toast.error("Please enter a valid demo URL")
          return false
        }
        if (formData.youtubeUrl && !formData.youtubeUrl.includes("youtube.com") && !formData.youtubeUrl.includes("youtu.be")) {
          toast.error("Please enter a valid YouTube URL")
          return false
        }
        return true
      case 3:
        // Enhancement services are optional
        return true
      case 4:
        if (!formData.price) {
          toast.error("Sale price is required")
          return false
        }
        if (Number.parseFloat(formData.price) < 10) {
          toast.error("Price must be at least ₹10")
          return false
        }
        return true
      default:
        return true
    }
  }

  // Handle next step
  const handleNextStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4))
    }
  }

  // Handle previous step
  const handlePreviousStep = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  // Get completion percentage
  const getCompletionPercentage = () => {
    let completed = 0
    let total = 7

    if (formData.title.trim()) completed++
    if (formData.category) completed++
    if (formData.techStack.length > 0) completed++
    if (formData.description.trim()) completed++
    if (formData.githubUrl.trim()) completed++
    if (formData.thumbnailFile) completed++
    if (formData.price) completed++

    return Math.round((completed / total) * 100)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(1) || !validateStep(2) || !validateStep(4)) {
      toast.error("Please complete all required fields")
      return
    }

    if (isSubmitting) return

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        throw new Error("Authentication token not found. Please login again.")
      }

      // Prepare initial project data - only include non-empty values
      const systemReqs = formData.systemRequirementsText
        ? formData.systemRequirementsText.split("\n").filter((s) => s.trim())
        : []
      const deps = formData.dependenciesText
        ? formData.dependenciesText.split("\n").filter((d) => d.trim())
        : []
      const installSteps = formData.installationGuideText
        ? formData.installationGuideText.split("\n").filter((s) => s.trim())
        : []

      const initialProjectData: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category === "other" ? formData.customCategory : formData.category,
        difficulty_level: "intermediate",
        tech_stack: formData.techStack,
        github_url: formData.githubUrl,
        pricing: {
          sale_price: Number.parseFloat(formData.price),
          original_price: formData.originalPrice
            ? Number.parseFloat(formData.originalPrice)
            : Number.parseFloat(formData.price),
          currency: formData.currency || "INR",
        },
      }

      // Only add optional fields if they have values
      if (formData.keyFeatures && formData.keyFeatures.trim()) {
        initialProjectData.key_features = formData.keyFeatures.trim()
      }
      if (formData.liveDemoUrl && isValidUrl(formData.liveDemoUrl)) {
        initialProjectData.demo_url = formData.liveDemoUrl
      }
      if (formData.youtubeUrl && (formData.youtubeUrl.includes("youtube.com") || formData.youtubeUrl.includes("youtu.be"))) {
        initialProjectData.youtube_url = formData.youtubeUrl
      }
      if (formData.deliveryTime) {
        initialProjectData.delivery_time = Number.parseInt(formData.deliveryTime, 10)
      }
      if (systemReqs.length > 0 || deps.length > 0 || installSteps.length > 0) {
        initialProjectData.requirements = {}
        if (systemReqs.length > 0) initialProjectData.requirements.system_requirements = systemReqs
        if (deps.length > 0) initialProjectData.requirements.dependencies = deps
        if (installSteps.length > 0) initialProjectData.requirements.installation_steps = installSteps
      }

      // Create project
      const projectResponse = await apiClient(getApiUrl("/projects"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(initialProjectData),
      })

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json()
        console.error("Project creation error:", errorData)
        throw new Error(`Failed to create project: ${errorData.error || projectResponse.statusText}`)
      }

      const projectResult = await projectResponse.json()

      // Get project ID from response
      const backendProjectId =
        projectResult.project?.id ||
        projectResult.id ||
        projectResult._id ||
        projectResult.project_id ||
        projectResult.data?.id

      if (!backendProjectId) {
        throw new Error("Project ID not found in response")
      }

      const projectFolder = `projects/${backendProjectId}`

      let finalThumbnailUrl = ""
      let finalImageUrls: string[] = []
      let finalDocFileUrls: string[] = []

      // Upload thumbnail
      if (formData.thumbnailFile) {
        try {
          toast.loading("Uploading thumbnail...")
          finalThumbnailUrl = await uploadToCloudinary(formData.thumbnailFile, `${projectFolder}/thumbnail`, "image")
          toast.dismiss()
        } catch (error) {
          console.error("Thumbnail upload failed:", error)
          toast.error("Thumbnail upload failed")
        }
      }

      // Upload screenshots
      if (formData.screenshots.length > 0) {
        try {
          toast.loading("Uploading screenshots...")
          const imageUploadPromises = formData.screenshots.map((file) =>
            uploadToCloudinary(file, `${projectFolder}/images`, "image"),
          )
          finalImageUrls = await Promise.all(imageUploadPromises)
          toast.dismiss()
        } catch (error) {
          console.error("Screenshots upload failed:", error)
          toast.error("Screenshots upload failed")
        }
      }

      // Upload documentation file
      if (formData.documentationFile) {
        try {
          toast.loading("Uploading documentation...")
          const docUrl = await uploadToCloudinary(formData.documentationFile, `${projectFolder}/docs`, "raw")
          finalDocFileUrls.push(docUrl)
          toast.dismiss()
        } catch (error) {
          console.error("Documentation upload failed:", error)
          toast.error("Documentation upload failed")
        }
      }

      // Update project with file URLs
      // Update project with file URLs - only include non-empty values
      const updateData: any = {}

      if (finalThumbnailUrl) {
        updateData.thumbnail = finalThumbnailUrl
      }
      if (finalImageUrls.length > 0) {
        updateData.images = finalImageUrls
      }
      if (finalDocFileUrls.length > 0) {
        updateData.files = {
          documentation_files: finalDocFileUrls
        }
      }

      // Only update if there's something to update
      if (Object.keys(updateData).length > 0) {
        try {
          const updateResponse = await apiClient(getApiUrl(`/projects/${backendProjectId}`), {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          })

          if (!updateResponse.ok) {
            const errorData = await updateResponse.json()
            console.error("Failed to update project with files:", errorData)
          }
        } catch (updateError) {
          console.error("Error updating project with files:", updateError)
        }
      }

      toast.success("Project submitted for review!")

      // Reset form
      setFormData({
        title: "",
        category: "",
        customCategory: "",
        techStack: [],
        description: "",
        keyFeatures: "",
        githubUrl: "",
        thumbnailFile: null,
        screenshots: [],
        completeDocumentationEnabled: false,
        documentationFile: null,
        installationGuideText: "",
        systemRequirementsText: "",
        dependenciesText: "",
        liveDemoUrl: "",
        youtubeUrl: "",
        price: "",
        originalPrice: "",
        currency: "INR",
        deliveryTime: "",
      })
      setThumbnailPreview("")
      setScreenshotPreviews([])
      setTechStackInput("")
      setCurrentStep(1)

      // Navigate to dashboard
      navigate("/dashboard")
    } catch (error) {
      console.error("Error submitting project:", error)
      toast.error(error instanceof Error ? error.message : "Failed to submit project. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // GitHub Collaborator Guide Modal
  const GitHubModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideInUp">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4 sm:p-6 flex items-center justify-between z-10">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Github className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span className="break-words">How to add ProjXchange as a collaborator</span>
          </h3>
          <button
            onClick={() => setShowGithubModal(false)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                1
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Open your GitHub repository</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                2
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Click on the "Settings" tab</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                3
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Go to "Collaborators" in the left sidebar</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                4
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Click "Add people" button</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                5
              </div>
              <div className="min-w-0">
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-2">Enter GitHub username:</p>
                <code className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-lg font-mono text-xs sm:text-sm break-all">
                  projxchange-admin
                </code>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                6
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Click "Add collaborator"</p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                7
              </div>
              <div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">Wait for the collaborator to accept the invite</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <h4 className="font-semibold text-xs sm:text-sm md:text-base text-blue-900 dark:text-blue-300 mb-2 sm:mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              Important Notes
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-blue-800 dark:text-blue-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <span>Your repository can be Public or Private</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <span>Collaborator access is required for our team to review your project</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
                <span>You can remove access anytime after approval</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setShowGithubModal(false)}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )

  // Project Preview Component
  const ProjectPreview = () => {
    const hasContent = formData.title || formData.description || formData.techStack.length > 0 || thumbnailPreview

    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-700 transition-colors">
        <div className="relative">
          {thumbnailPreview ? (
            <img src={thumbnailPreview} alt="Preview" className="w-full h-40 sm:h-48 object-cover" />
          ) : (
            <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-teal-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400 dark:text-slate-400 mx-auto mb-2" />
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Thumbnail Preview</p>
              </div>
            </div>
          )}
          {formData.category && (
            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2.5 py-1 bg-blue-600 text-white rounded-full text-xs font-semibold shadow-lg">
                {formData.category === "other"
                  ? formData.customCategory || "Custom Category"
                  : categories.find((cat) => cat.value === formData.category)?.label || "Category"}
              </span>
            </div>
          )}
        </div>
        <div className="p-4 sm:p-5 md:p-6">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
            {formData.title || "Your Project Title"}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-3">
            {formData.description || "Your project description will appear here. Add a compelling summary to attract buyers."}
          </p>

          {/* Tech Stack */}
          {formData.techStack.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {formData.techStack.slice(0, 4).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium border border-blue-200 dark:border-blue-800"
                >
                  {tech}
                </span>
              ))}
              {formData.techStack.length > 4 && (
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md text-xs font-medium">
                  +{formData.techStack.length - 4} more
                </span>
              )}
            </div>
          ) : (
            <div className="mb-3 sm:mb-4">
              <p className="text-xs text-gray-400 dark:text-gray-500 italic">Add tech stack to see tags here</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
            <div className="flex flex-col gap-0.5">
              {formData.price ? (
                <>
                  <p className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                    ₹{formData.price}
                  </p>
                  {formData.originalPrice && Number.parseFloat(formData.originalPrice) > Number.parseFloat(formData.price) && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                      ₹{formData.originalPrice}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">Price not set</p>
              )}
            </div>
            <button
              type="button"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs sm:text-sm transition-colors shadow-md hover:shadow-lg"
            >
              Buy Now
            </button>
          </div>

          {!hasContent && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                Fill in the form to see your project preview
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-4 sm:py-6 md:py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-slideInDown">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs sm:text-sm font-bold mb-3 sm:mb-4 md:mb-6">
            <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Share Your Amazing Project
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 md:mb-4 px-2">
            Upload Your Project
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 sm:px-6">
            Share your work with the community and help fellow developers learn from your expertise
          </p>
        </div>

        {/* Helper Text */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-6 sm:mb-8 max-w-4xl mx-auto animate-slideInUp">
          <p className="text-blue-800 dark:text-blue-300 flex items-start gap-2 text-xs sm:text-sm md:text-base">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
            <span>
              Don't worry about perfection. Our team will review and polish your project before publishing.
            </span>
          </p>
        </div>

        {/* Step Progress */}
        <div className="mb-6 sm:mb-8 md:mb-12 animate-slideInUp">
          <div className="flex items-center justify-start sm:justify-center mb-4 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 min-w-max px-2 sm:px-0">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div
                    className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all duration-300 cursor-pointer whitespace-nowrap ${currentStep >= step.id
                      ? `bg-gradient-to-r ${step.color} text-white shadow-lg scale-105`
                      : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 shadow-md hover:shadow-lg"
                      }`}
                    onClick={() => {
                      if (step.id < currentStep || (step.id === currentStep + 1 && validateStep(currentStep))) {
                        setCurrentStep(step.id)
                      }
                    }}
                  >
                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <div className="text-center sm:text-left">
                      <span className="font-semibold hidden sm:inline">{step.title}</span>
                      <span className="font-semibold sm:hidden">{step.id}</span>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-4 sm:w-6 md:w-8 h-1 rounded-full transition-colors duration-300 flex-shrink-0 ${currentStep > step.id
                        ? "bg-gradient-to-r from-blue-600 to-teal-600"
                        : "bg-gray-200 dark:bg-gray-600"
                        }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="max-w-md mx-auto px-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-xs sm:text-sm font-bold text-blue-600">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
              <div
                className="bg-gradient-to-r from-blue-600 to-teal-600 h-2 sm:h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-slate-700/30 animate-slideInLeft transition-colors">
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 md:space-y-8">

                {/* STEP 1: BASIC PROJECT INFO */}
                {currentStep === 1 && (
                  <div className="animate-slideInUp">
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-800">
                      <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                        <Target className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Let's start with the basics. Tell us what you've created in just a few words.</span>
                      </p>
                    </div>

                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      Basic Project Info
                    </h2>

                    <div className="space-y-4 sm:space-y-5 md:space-y-6">

                      {/* Project Title */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Project Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="e.g., AI-Powered Task Manager"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                          required
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        {formData.category === "other" && (
                          <div className="mt-3">
                            <input
                              type="text"
                              name="customCategory"
                              value={formData.customCategory}
                              onChange={handleInputChange}
                              placeholder="Enter your custom category"
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                              required
                            />
                          </div>
                        )}
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Tech Stack <span className="text-red-500">*</span>
                        </label>

                        {/* Display added tech stack tags */}
                        {formData.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                            {formData.techStack.map((tech, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium"
                              >
                                {tech}
                                <button
                                  type="button"
                                  onClick={() => removeTechStack(index)}
                                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                                >
                                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Input field for adding new tech */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={techStackInput}
                            onChange={(e) => setTechStackInput(e.target.value)}
                            onKeyDown={handleTechStackKeyDown}
                            placeholder="e.g., React"
                            className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                          />
                          <button
                            type="button"
                            onClick={addTechStack}
                            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Add</span>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Press Enter or comma to add
                        </p>
                      </div>

                      {/* Short Description */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Short Description <span className="text-red-500">*</span>
                          <span className="text-gray-500 dark:text-gray-400 font-normal ml-2 text-xs">
                            ({formData.description.length}/100 characters minimum)
                          </span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          placeholder="A brief, compelling summary of your project (minimum 100 characters)"
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-colors ${formData.description.length > 0 && formData.description.length < 100
                            ? "border-red-300 dark:border-red-600"
                            : "border-gray-300 dark:border-slate-600"
                            }`}
                          required
                        />
                        {formData.description.length > 0 && formData.description.length < 100 && (
                          <p className="text-red-600 text-xs mt-2 flex items-center gap-2">
                            <AlertCircle className="w-3 h-3" />
                            Description must be at least 100 characters ({100 - formData.description.length} more needed)
                          </p>
                        )}
                      </div>

                      {/* Key Features */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Key Features <span className="text-gray-500 font-normal">(optional)</span>
                        </label>
                        <textarea
                          name="keyFeatures"
                          value={formData.keyFeatures}
                          onChange={handleInputChange}
                          rows={4}
                          placeholder="List the main features of your project (e.g., User authentication, Real-time updates, Responsive design)"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Highlight what makes your project special
                        </p>
                      </div>

                      {/* GitHub Repository URL */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                          GitHub Repository URL <span className="text-red-500">*</span>
                          <button
                            type="button"
                            onClick={() => setShowGithubModal(true)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                            title="How to add collaborator"
                          >
                            <Info className="w-4 h-4 text-blue-600" />
                          </button>
                        </label>
                        <input
                          type="url"
                          name="githubUrl"
                          value={formData.githubUrl}
                          onChange={handleInputChange}
                          placeholder="https://github.com/username/repo"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                          required
                        />
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Make sure collaborator access is enabled for faster approval.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: PROJECT MEDIA */}
                {currentStep === 2 && (
                  <div className="animate-slideInUp">
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:rounded-xl border border-purple-200 dark:border-purple-800">
                      <p className="text-xs sm:text-sm text-purple-800 dark:text-purple-300 flex items-start gap-2">
                        <Video className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Visual content helps buyers understand your project better. Add images to showcase your work.</span>
                      </p>
                    </div>

                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                      <Video className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                      Project Media
                    </h2>

                    <div className="space-y-4 sm:space-y-5 md:space-y-6">

                      {/* Thumbnail Image */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Thumbnail Image <span className="text-red-500">*</span>
                        </label>
                        {thumbnailPreview ? (
                          <div className="relative">
                            <img
                              src={thumbnailPreview}
                              alt="Thumbnail preview"
                              className="w-full h-40 sm:h-48 object-cover rounded-lg sm:rounded-xl border-2 border-gray-200 dark:border-slate-600"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setThumbnailPreview("")
                                setFormData((prev) => ({ ...prev, thumbnailFile: null }))
                              }}
                              className="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center hover:border-blue-400 transition-colors">
                            <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">Upload a thumbnail for your project</p>
                            <label className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
                              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              Choose Thumbnail
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Screenshots */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Screenshots <span className="text-gray-500 font-normal">(optional, max 3)</span>
                        </label>
                        <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                          <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          Projects with screenshots get 2× more views.
                        </p>

                        {screenshotPreviews.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4">
                            {screenshotPreviews.map((preview, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={preview}
                                  alt={`Screenshot ${index + 1}`}
                                  className="w-full h-24 sm:h-28 md:h-32 object-cover rounded-lg border-2 border-gray-200 dark:border-slate-600"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeScreenshot(index)}
                                  className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                >
                                  <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {formData.screenshots.length < 3 && (
                          <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                            <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 mx-auto mb-2 sm:mb-3" />
                            <label className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                              <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              Add Screenshots
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleScreenshotsUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Live Demo URL */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Live Demo URL <span className="text-orange-500 font-normal">(at least one required)</span>
                        </label>
                        <input
                          type="url"
                          name="liveDemoUrl"
                          value={formData.liveDemoUrl}
                          onChange={handleInputChange}
                          placeholder="https://your-demo.vercel.app"
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Provide either a live demo URL or YouTube video URL (or both)
                        </p>
                      </div>

                      {/* YouTube Demo Video URL */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          YouTube Demo Video URL <span className="text-orange-500 font-normal">(at least one required)</span>
                        </label>
                        <input
                          type="url"
                          name="youtubeUrl"
                          value={formData.youtubeUrl}
                          onChange={handleInputChange}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 dark:border-slate-600 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Provide either a YouTube video URL or live demo URL (or both)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: ENHANCEMENT SERVICES */}
                {currentStep === 3 && (
                  <div className="animate-slideInUp">
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg sm:rounded-xl border border-orange-200 dark:border-orange-800">
                      <p className="text-xs sm:text-sm text-orange-800 dark:text-orange-300 flex items-start gap-2">
                        <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Need help completing your project? Turn ON what you want our team to handle for you.</span>
                      </p>
                    </div>

                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                      Enhancement Services
                    </h2>

                    <div className="space-y-4 sm:space-y-5 md:space-y-6">

                      {/* Complete Documentation Package Toggle */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 border-2 border-blue-200 dark:border-blue-800">
                        <div className="flex items-start sm:items-center justify-between gap-3 mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 text-sm sm:text-base md:text-lg">
                              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                              <span className="break-words">Complete Documentation Package</span>
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                              Includes: Documentation, Installation Guide, System Requirements, Dependencies & Screenshots
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                completeDocumentationEnabled: !prev.completeDocumentationEnabled,
                              }))
                            }
                            className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-12 items-center rounded-full transition-colors flex-shrink-0 ${formData.completeDocumentationEnabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                              }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full bg-white transition-transform ${formData.completeDocumentationEnabled ? "translate-x-6 sm:translate-x-6" : "translate-x-1"
                                }`}
                            />
                          </button>
                        </div>

                        {formData.completeDocumentationEnabled ? (
                          <div className="space-y-4 bg-white dark:bg-slate-800 rounded-lg p-4">
                            {/* Documentation File Upload */}
                            <div>
                              <label className="block">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                  Documentation File <span className="text-gray-500 font-normal">(optional)</span>
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-400 mb-2 block">
                                  Upload now to avoid ₹150 complete documentation fee
                                </span>
                                <input
                                  type="file"
                                  accept=".pdf,.md,.txt"
                                  onChange={handleDocumentationUpload}
                                  className="block w-full text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300"
                                />
                              </label>
                              {formData.documentationFile && (
                                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2 mt-2">
                                  <CheckCircle className="w-4 h-4" />
                                  {formData.documentationFile.name}
                                </p>
                              )}
                            </div>

                            {/* Installation Guide */}
                            <div>
                              <label className="block">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                  Installation Guide <span className="text-gray-500 font-normal">(optional)</span>
                                </span>
                                <textarea
                                  name="installationGuideText"
                                  value={formData.installationGuideText}
                                  onChange={handleInputChange}
                                  rows={3}
                                  placeholder="1. Clone the repository&#10;2. Install dependencies&#10;3. Run the application"
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none text-sm"
                                />
                              </label>
                            </div>

                            {/* System Requirements */}
                            <div>
                              <label className="block">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                  System Requirements <span className="text-gray-500 font-normal">(optional)</span>
                                </span>
                                <textarea
                                  name="systemRequirementsText"
                                  value={formData.systemRequirementsText}
                                  onChange={handleInputChange}
                                  rows={3}
                                  placeholder="e.g., Windows 10/11, macOS 12+, Linux&#10;8GB RAM minimum&#10;Node.js 18+ required"
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none text-sm"
                                />
                              </label>
                            </div>

                            {/* Dependencies */}
                            <div>
                              <label className="block">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                                  Project Dependencies <span className="text-gray-500 font-normal">(optional)</span>
                                </span>
                                <textarea
                                  name="dependenciesText"
                                  value={formData.dependenciesText}
                                  onChange={handleInputChange}
                                  rows={3}
                                  placeholder="e.g., Node.js 18+, MongoDB 6.0+, Redis 7.0+&#10;npm or yarn package manager&#10;Git for version control"
                                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none text-sm"
                                />
                              </label>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                              <p className="text-xs text-green-800 dark:text-green-300 flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span>
                                  Providing these details helps faster approval and gives buyers complete information about your project.
                                </span>
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                              Our team will create complete documentation including:
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                              <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <span>Professional README/PDF documentation</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <span>Step-by-step installation guide</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <span>System requirements documentation</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <span>Dependencies list and setup instructions</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                                <span>Professional screenshots capture & optimization</span>
                              </li>
                            </ul>
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                              <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                Complete Package: ₹150 (charged after first sale)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Important Info */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>All charges apply only after your first sale.</strong> Provide documentation details now to avoid fees and speed up approval.
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: PUBLISH & PRICE */}
                {currentStep === 4 && (
                  <div className="animate-slideInUp">
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl border border-green-200 dark:border-green-800">
                      <p className="text-xs sm:text-sm text-green-800 dark:text-green-300 flex items-start gap-2">
                        <Rocket className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Final step! Set your pricing and get ready to launch.</span>
                      </p>
                    </div>

                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 md:mb-8 flex items-center gap-2 sm:gap-3">
                      <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      Publish & Price
                    </h2>

                    <div className="space-y-4 sm:space-y-6">
                      {/* Pricing Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            Sale Price (INR) <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">
                              ₹
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              name="price"
                              value={formData.price}
                              onChange={handleNumericInput}
                              placeholder="500"
                              className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-300 dark:border-slate-600 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            Original Price (INR) <span className="text-gray-500 font-normal">(optional)</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">
                              ₹
                            </span>
                            <input
                              type="text"
                              inputMode="numeric"
                              name="originalPrice"
                              value={formData.originalPrice}
                              onChange={handleNumericInput}
                              placeholder="800"
                              className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            Currency
                          </label>
                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                          >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            Delivery Time (days) <span className="text-gray-500 font-normal">(optional)</span>
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            name="deliveryTime"
                            value={formData.deliveryTime}
                            onChange={handleNumericInput}
                            placeholder="1"
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Discount Indicator */}
                      {formData.price &&
                        formData.originalPrice &&
                        Number.parseFloat(formData.originalPrice) > Number.parseFloat(formData.price) && (
                          <div className="p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg sm:rounded-xl border border-green-200 dark:border-green-800 animate-slideInUp">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-base font-semibold text-green-800 dark:text-green-300">
                                  Great! You're offering a{" "}
                                  {Math.round(
                                    (1 - Number.parseFloat(formData.price) / Number.parseFloat(formData.originalPrice)) * 100
                                  )}
                                  % discount
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-400">
                                  Customers will save ₹
                                  {(Number.parseFloat(formData.originalPrice) - Number.parseFloat(formData.price)).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Pricing Tips */}
                      <div className="p-3 sm:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl border border-blue-200 dark:border-blue-800">
                        <h4 className="font-bold text-xs sm:text-base text-blue-900 dark:text-blue-300 mb-2 sm:mb-3 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                          Pricing Tips
                        </h4>
                        <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-800 dark:text-blue-300">
                          <li>• Research similar projects to set competitive prices</li>
                          <li>• Consider the complexity and time invested in your project</li>
                          <li>• Higher original prices can make your discount more attractive</li>
                          <li>• Start with lower prices to build reviews and reputation</li>
                        </ul>
                      </div>

                      {/* Trust Messages */}
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                        <ul className="space-y-2 text-sm text-green-800 dark:text-green-300">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span>No upfront charges</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span>Admin review in 24–48 hours</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Shield className="w-4 h-4 flex-shrink-0" />
                            <span>Transparent commission & earnings</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" />
                            <span>Seller can update project anytime</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0 pt-4 sm:pt-6 border-t border-gray-200 dark:border-slate-700">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Previous
                    </button>
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="sm:ml-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="sm:ml-auto flex items-center justify-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:from-green-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          Submit for Review
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 sm:top-8 space-y-4 sm:space-y-6 animate-slideInRight">
              <div className="bg-white dark:bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Live Preview
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    {showPreview ? "Hide" : "Show"}
                  </button>
                </div>
                {showPreview && <ProjectPreview />}
              </div>

              {/* Tips Card */}
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Quick Tips
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>Use a clear, descriptive title</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>Add high-quality screenshots</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>Include all tech stack details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-green-600 flex-shrink-0" />
                    <span>Enable GitHub collaborator access</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub Modal */}
      {showGithubModal && <GitHubModal />}
    </div>
  )
}

export default UploadProjectNew
