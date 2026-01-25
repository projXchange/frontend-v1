import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Upload,
  FileText,
  Video,
  IndianRupee,
  Award,
  Shield,
  CheckCircle,
  ImageIcon,
  X,
  Plus,
  AlertCircle,
  Sparkles,
  Eye,
  Users,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Target,
  Rocket,
} from "lucide-react"
import toast from "react-hot-toast"
import { apiClient } from "../utils/apiClient"
import { getApiUrl } from "../config/api"

const UploadProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    customCategory: "",
    price: "",
    originalPrice: "",
    youtubeUrl: "",
    githubUrl: "",
    liveDemo: "",
    difficulty: "Beginner",
    features: [""],
    techStack: [""],
    currency: "INR",
    deliveryTime: "",
    thumbnailUrl: "",
    systemRequirements: [""],
    dependenciesArr: [""],
    installationSteps: [""],
    averageRating: "",
    totalRatings: "",
    rating5: "",
    rating4: "",
    rating3: "",
    rating2: "",
    rating1: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewImage, setPreviewImage] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const [imagesUploading, setImagesUploading] = useState(false)
  const [sourceFilesUploading, setSourceFilesUploading] = useState(false)
  const [docFilesUploading, setDocFilesUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const CLOUDINARY_CLOUD_NAME = "dmfh4f4yg"
  const CLOUDINARY_UPLOAD_PRESET = "projectXchange"

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
  const difficulties = ["Beginner", "Intermediate", "Advanced"]

  // Auto-save to localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem("projectDraft")
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft)
        setFormData(parsed)
        toast.success("Draft restored!")
      } catch {
        console.error("Failed to restore draft")
      }
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.title || formData.description) {
        localStorage.setItem("projectDraft", JSON.stringify(formData))
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [formData])

  const uploadToCloudinary = async (
    file: File,
    folder: string,
    resourceType: "image" | "raw" = "image",
  ): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)
    formData.append("folder", folder)

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`, {
        method: "POST",
        body: formData,
      })

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

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    setThumbnailUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      setThumbnailFile(file)
      setFormData((prev) => ({ ...prev, thumbnailUrl: "TEMP_FILE" }))

      toast.success("Thumbnail selected!")
    } catch {
      toast.error("Failed to process thumbnail.")
    } finally {
      setThumbnailUploading(false)
    }
  }

  const handleMultipleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
    if (imageFiles.length === 0) {
      toast.error("Please upload image files only")
      return
    }

    const alreadyUploadedImages = uploadedFiles.filter((f) => f.type.startsWith("image/")).length
    const remainingSlots = 3 - alreadyUploadedImages

    if (imageFiles.length > remainingSlots) {
      toast.error(`You can upload a maximum of 3 images. You already uploaded ${alreadyUploadedImages}, so you can select up to ${remainingSlots} more.`)
      return
    }

    setImagesUploading(true)
    setUploadedFiles((prev) => [...prev, ...imageFiles])
    toast.success(`${imageFiles.length} image(s) selected!`)
    setImagesUploading(false)
  }

  const handleSourceFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const maxSize = 10 * 1024 * 1024
    const sourceFiles = Array.from(files).filter(
      (file) =>
        (file.name.endsWith(".zip") ||
          file.name.endsWith(".rar") ||
          file.name.endsWith(".7z") ||
          file.name.endsWith(".tar") ||
          file.name.endsWith(".gz")) &&
        file.size <= maxSize,
    )

    if (sourceFiles.length === 0) {
      toast.error("Please upload valid source files (.zip, .rar, .7z, .tar, .gz) with a maximum size of 10 MB.")
      return
    }

    setSourceFilesUploading(true)
    setUploadedFiles((prev) => [...prev, ...sourceFiles])
    toast.success(`${sourceFiles.length} source file(s) selected!`)
    setSourceFilesUploading(false)
  }

  const handleDocFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const maxSize = 10 * 1024 * 1024

    const docFiles = Array.from(files).filter(
      (file) =>
        (file.name.endsWith(".pdf") ||
          file.name.endsWith(".md") ||
          file.name.endsWith(".txt") ||
          file.name.endsWith(".docx") ||
          file.name.endsWith(".doc")) &&
        file.size <= maxSize,
    )

    if (docFiles.length === 0) {
      toast.error("Please upload valid documentation files (.pdf, .md, .txt, .docx, .doc) with a maximum size of 10 MB.")
      return
    }

    setDocFilesUploading(true)
    setUploadedFiles((prev) => [...prev, ...docFiles])
    toast.success(`${docFiles.length} documentation file(s) selected!`)
    setDocFilesUploading(false)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "title":
        if (!value.trim()) {
          newErrors.title = "Project title is required"
        } else if (value.length < 5) {
          newErrors.title = "Title must be at least 5 characters"
        } else {
          delete newErrors.title
        }
        break
      case "description":
        if (!value.trim()) {
          newErrors.description = "Description is required"
        } else if (value.length < 100) {
          newErrors.description = "Description must be at least 100 characters"
        } else {
          delete newErrors.description
        }
        break
      case "price":
        if (!value) {
          newErrors.price = "Price is required"
        } else if (Number.parseFloat(value) < 1) {
          newErrors.price = "Price must be at least $1"
        } else {
          delete newErrors.price
        }
        break
      case "youtubeUrl":
        if (value && !value.includes("youtube.com") && !value.includes("youtu.be")) {
          newErrors.youtubeUrl = "Please enter a valid YouTube URL"
        } else {
          delete newErrors.youtubeUrl
        }
        break
      case "githubUrl":
        if (value && !value.includes("github.com")) {
          newErrors.githubUrl = "Please enter a valid GitHub URL"
        } else {
          delete newErrors.githubUrl
        }
        break
    }

    setErrors(newErrors)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    validateField(name, value)
  }

  const handleArrayChange = (
    index: number,
    value: string,
    field: "features" | "techStack" | "systemRequirements" | "dependenciesArr" | "installationSteps",
  ) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }))
  }

  const addArrayItem = (
    field: "features" | "techStack" | "systemRequirements" | "dependenciesArr" | "installationSteps",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }))
  }

  const removeArrayItem = (
    index: number,
    field: "features" | "techStack" | "systemRequirements" | "dependenciesArr" | "installationSteps",
  ) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData((prev) => ({
      ...prev,
      [field]: newArray,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return

    Object.keys(formData).forEach((key) => {
      if (typeof formData[key as keyof typeof formData] === "string") {
        validateField(key, formData[key as keyof typeof formData] as string)
      }
    })

    // Validate that at least one of demo URL or YouTube URL is provided
    if (!formData.liveDemo?.trim() && !formData.youtubeUrl?.trim()) {
      toast.error('Please provide at least one: Live Demo URL or YouTube URL');
      return;
    }

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true)
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        // Prepare initial project data - only include non-empty values
        const features = formData.features.filter((f) => f.trim())
        const techStack = formData.techStack.filter((tech) => tech.trim())
        const systemReqs = formData.systemRequirements.filter((s) => s.trim())
        const deps = formData.dependenciesArr.filter((d) => d.trim())
        const installSteps = formData.installationSteps.filter((s) => s.trim())

        const initialProjectData: Record<string, unknown> = {
          title: formData.title,
          description: formData.description,
          category: formData.category === "other" ? formData.customCategory : formData.category,
          difficulty_level: formData.difficulty.toLowerCase(),
          tech_stack: techStack,
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
        if (features.length > 0) {
          initialProjectData.key_features = features.join(", ")
        }
        if (formData.liveDemo && formData.liveDemo.trim()) {
          initialProjectData.demo_url = formData.liveDemo
        }
        if (formData.youtubeUrl && formData.youtubeUrl.trim()) {
          initialProjectData.youtube_url = formData.youtubeUrl
        }
        if (formData.deliveryTime) {
          initialProjectData.delivery_time = Number.parseInt(formData.deliveryTime, 10)
        }
        if (systemReqs.length > 0 || deps.length > 0 || installSteps.length > 0) {
          const requirements: Record<string, string[]> = {}
          if (systemReqs.length > 0) requirements.system_requirements = systemReqs
          if (deps.length > 0) requirements.dependencies = deps
          if (installSteps.length > 0) requirements.installation_steps = installSteps
          initialProjectData.requirements = requirements
        }

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
        let finalSourceFileUrls: string[] = []
        let finalDocFileUrls: string[] = []

        if (thumbnailFile || (formData.thumbnailUrl && formData.thumbnailUrl !== "TEMP_FILE")) {
          try {
            if (thumbnailFile) {
              finalThumbnailUrl = await uploadToCloudinary(thumbnailFile, `${projectFolder}/thumbnail`, "image")
            } else if (formData.thumbnailUrl && formData.thumbnailUrl !== "TEMP_FILE") {
              finalThumbnailUrl = formData.thumbnailUrl
            }
          } catch (error) {
            console.error("Thumbnail upload failed:", error)
          }
        }

        const imageFiles = uploadedFiles.filter((file) => file.type.startsWith("image/"))

        if (imageFiles.length > 0) {
          try {
            const imageUploadPromises = imageFiles.map((file) =>
              uploadToCloudinary(file, `${projectFolder}/images`, "image"),
            )
            finalImageUrls = await Promise.all(imageUploadPromises)
          } catch (error) {
            console.error("Images upload failed:", error)
          }
        }

        const sourceFiles = uploadedFiles.filter(
          (file) =>
            file.name.endsWith(".zip") ||
            file.name.endsWith(".rar") ||
            file.name.endsWith(".7z") ||
            file.name.endsWith(".tar") ||
            file.name.endsWith(".gz"),
        )

        if (sourceFiles.length > 0) {
          try {
            const sourceUploadPromises = sourceFiles.map((file) =>
              uploadToCloudinary(file, `${projectFolder}/source`, "raw"),
            )
            finalSourceFileUrls = await Promise.all(sourceUploadPromises)
          } catch (error) {
            console.error("Source files upload failed:", error)
          }
        }

        const docFiles = uploadedFiles.filter(
          (file) =>
            file.name.endsWith(".pdf") ||
            file.name.endsWith(".md") ||
            file.name.endsWith(".txt") ||
            file.name.endsWith(".docx") ||
            file.name.endsWith(".doc"),
        )

        if (docFiles.length > 0) {
          try {
            const docUploadPromises = docFiles.map((file) => uploadToCloudinary(file, `${projectFolder}/docs`, "raw"))
            finalDocFileUrls = await Promise.all(docUploadPromises)
          } catch (error) {
            console.error("Documentation files upload failed:", error)
          }
        }

        // Update project with file URLs - only include non-empty values
        const updateData: Record<string, unknown> = {}

        if (finalThumbnailUrl) {
          updateData.thumbnail = finalThumbnailUrl
        }
        if (finalImageUrls.length > 0) {
          updateData.images = finalImageUrls
        }
        if (finalSourceFileUrls.length > 0 || finalDocFileUrls.length > 0) {
          const files: Record<string, string[]> = {}
          if (finalSourceFileUrls.length > 0) files.source_files = finalSourceFileUrls
          if (finalDocFileUrls.length > 0) files.documentation_files = finalDocFileUrls
          updateData.files = files
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

            if (updateResponse.ok) {
              // Project updated successfully
            } else {
              const errorData = await updateResponse.json()
              console.error("Failed to update project with files:", errorData)
            }
          } catch (updateError) {
            console.error("Error updating project with files:", updateError)
          }
        }

        setShowSuccessModal(true)
        localStorage.removeItem("projectDraft")

        setFormData({
          title: "",
          description: "",
          category: "",
          customCategory: "",
          price: "",
          originalPrice: "",
          youtubeUrl: "",
          githubUrl: "",
          liveDemo: "",
          difficulty: "Beginner",
          features: [""],
          techStack: [""],
          currency: "INR",
          deliveryTime: "",
          thumbnailUrl: "",
          systemRequirements: [""],
          dependenciesArr: [""],
          installationSteps: [""],
          averageRating: "",
          totalRatings: "",
          rating5: "",
          rating4: "",
          rating3: "",
          rating2: "",
          rating1: "",
        })
        setUploadedFiles([])
        setThumbnailFile(null)
        setPreviewImage("")
        setCurrentStep(1)
      } catch (error) {
        console.error("Error submitting project:", error)
        toast.error("Failed to submit project. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const getCompletionPercentage = () => {
    let completed = 0
    const total = 8

    if (formData.title.trim()) completed++
    if (formData.category) completed++
    if (formData.description.length >= 100) completed++
    if (formData.features.some(f => f.trim())) completed++
    if (formData.techStack.some(t => t.trim())) completed++
    if (thumbnailFile || formData.thumbnailUrl) completed++
    if (formData.price) completed++
    if (formData.deliveryTime) completed++

    return Math.round((completed / total) * 100)
  }

  const ProjectPreview = () => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-slate-700 transition-colors">
      <div className="relative">
        {previewImage ? (
          <img src={previewImage || "/placeholder.svg"} alt="Preview" className="w-full h-48 object-cover" />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-teal-100 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
            <ImageIcon className="w-12 h-12 text-blue-400 dark:text-slate-400" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-full text-sm font-semibold">
            {formData.category === "other"
              ? formData.customCategory || "Custom Category"
              : categories.find((cat) => cat.value === formData.category)?.label || "Category"}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${formData.difficulty === "Beginner"
              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
              : formData.difficulty === "Intermediate"
                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200"
                : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200"
              }`}
          >
            {formData.difficulty}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{formData.title || "Your Project Title"}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {formData.description || "Your project description will appear here..."}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.techStack
            .filter((tech) => tech.trim())
            .slice(0, 3)
            .map((tech, index) => (
              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg text-xs font-medium">
                {tech}
              </span>
            ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">₹{formData.price || "0"}</span>
            {formData.originalPrice && (
              <span className="text-lg text-gray-500 dark:text-gray-400 line-through">₹{formData.originalPrice}</span>
            )}
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors">View Details</button>
        </div>
      </div>
    </div>
  )

  const steps = [
    { id: 1, title: "What did you build?", icon: Target, color: "from-blue-600 to-cyan-600" },
    { id: 2, title: "How does it work?", icon: Zap, color: "from-purple-600 to-pink-600" },
    { id: 3, title: "Show it off", icon: Video, color: "from-orange-600 to-red-600" },
    { id: 4, title: "Publish & Price", icon: Rocket, color: "from-green-600 to-teal-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-4 sm:py-6 md:py-8 lg:py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-slideInDown">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6">
            <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Share Your Amazing Project
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 md:mb-6 text-balance">
            Upload Your Project
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-2 sm:px-4">
            Share your work with the community and help fellow developers learn from your expertise
          </p>
        </div>

        <div className="mb-8 sm:mb-10 md:mb-12 animate-slideInUp">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${currentStep >= step.id
                      ? `bg-gradient-to-r ${step.color} text-white shadow-lg`
                      : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 shadow-md"
                      }`}
                  >
                    <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-semibold hidden sm:inline">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-3 sm:w-6 md:w-8 h-1 rounded-full transition-colors duration-300 ${currentStep > step.id ? "bg-gradient-to-r from-blue-600 to-teal-600" : "bg-gray-200 dark:bg-gray-600"
                        }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-sm font-bold text-blue-600">{getCompletionPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-blue-600 to-teal-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-slate-700/30 animate-slideInLeft transition-colors">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

                {currentStep === 1 && (
                  <div className="animate-slideInUp">
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        Let's start with the basics. Tell us what you've created in just a few words.
                      </p>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-8 flex items-center gap-3">
                      <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      What did you build?
                    </h2>

                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="e.g., AI-Powered Task Manager"
                          className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 transition-all duration-200 ${errors.title ? "border-red-300 bg-red-50" : "border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500"
                            }`}
                        />
                        {errors.title && (
                          <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-2 animate-shake">
                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            {errors.title}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            Category *
                          </label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors ${errors.category ? "border-red-300 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-slate-700"
                              }`}
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category.value} value={category.value}>
                                {category.label}
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
                                className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                              />
                            </div>
                          )}
                          {errors.category && (
                            <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-2 animate-shake">
                              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              {errors.category}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            Difficulty Level
                          </label>
                          <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                          >
                            {difficulties.map((difficulty) => (
                              <option key={difficulty} value={difficulty}>
                                {difficulty}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Short Description *
                          <span className="text-gray-500 dark:text-gray-400 font-normal ml-2 text-xs sm:text-sm">
                            ({formData.description.length}/150 characters, minimum 100)
                          </span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={3}
                          maxLength={150}
                          placeholder="A brief, compelling summary of your project (minimum 100 characters)..."
                          className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 transition-all duration-200 resize-none ${errors.description ? "border-red-300 bg-red-50" : "border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500"
                            }`}
                        />
                        {errors.description && (
                          <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-2 animate-shake">
                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            {errors.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="animate-slideInUp">
                    <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-purple-800 dark:text-purple-300">
                        <Zap className="w-4 h-4 inline mr-2" />
                        Help others understand the technical details and capabilities of your project.
                      </p>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-8 flex items-center gap-3">
                      <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                      How does it work?
                    </h2>

                    <div className="space-y-6 sm:space-y-8">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-4">
                          Key Features
                        </label>
                        <div className="space-y-2 sm:space-y-3">
                          {formData.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex gap-2 sm:gap-3 animate-slideInUp"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleArrayChange(index, e.target.value, "features")}
                                placeholder="e.g., Real-time collaboration"
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                              />
                              {formData.features.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem(index, "features")}
                                  className="px-3 sm:px-4 py-2 sm:py-3 text-red-600 border border-red-300 rounded-lg sm:rounded-xl hover:bg-red-50 transition-colors font-semibold flex-shrink-0"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addArrayItem("features")}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-blue-600 border border-blue-300 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors font-semibold text-sm sm:text-base"
                          >
                            <Plus className="w-4 h-4" />
                            Add Feature
                          </button>
                        </div>
                        {errors.features && (
                          <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-2 animate-shake">
                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            {errors.features}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-4">
                          Technology Stack
                        </label>
                        <div className="space-y-2 sm:space-y-3">
                          {formData.techStack.map((tech, index) => (
                            <div
                              key={index}
                              className="flex gap-2 sm:gap-3 animate-slideInUp"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <input
                                type="text"
                                value={tech}
                                onChange={(e) => handleArrayChange(index, e.target.value, "techStack")}
                                placeholder="e.g., React, Node.js, MongoDB"
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                              />
                              {formData.techStack.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem(index, "techStack")}
                                  className="px-3 sm:px-4 py-2 sm:py-3 text-red-600 border border-red-300 rounded-lg sm:rounded-xl hover:bg-red-50 transition-colors font-semibold flex-shrink-0"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addArrayItem("techStack")}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-blue-600 border border-blue-300 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors font-semibold text-sm sm:text-base"
                          >
                            <Plus className="w-4 h-4" />
                            Add Technology
                          </button>
                        </div>
                        {errors.techStack && (
                          <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-2 animate-shake">
                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            {errors.techStack}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            GitHub Repository URL
                          </label>
                          <input
                            type="url"
                            name="githubUrl"
                            value={formData.githubUrl}
                            onChange={handleInputChange}
                            placeholder="https://github.com/username/repo"
                            className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 ${errors.githubUrl ? "border-red-300 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500"
                              }`}
                          />
                          {errors.githubUrl && (
                            <p className="text-red-600 text-xs sm:text-sm mt-2">{errors.githubUrl}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            Live Demo URL
                          </label>
                          <input
                            type="url"
                            name="liveDemo"
                            value={formData.liveDemo}
                            onChange={handleInputChange}
                            placeholder="https://your-demo.vercel.app"
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                        <button
                          type="button"
                          onClick={() => setShowAdvanced(!showAdvanced)}
                          className="flex items-center justify-between w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Advanced Setup (Optional)
                          </span>
                          {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>

                        {showAdvanced && (
                          <div className="mt-4 space-y-6 animate-slideInUp">
                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-4">
                                System Requirements
                              </label>
                              <div className="space-y-2 sm:space-y-3">
                                {formData.systemRequirements.map((req, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-2 sm:gap-3"
                                  >
                                    <input
                                      type="text"
                                      value={req}
                                      onChange={(e) => handleArrayChange(index, e.target.value, "systemRequirements")}
                                      placeholder="e.g., Windows 10, 8GB RAM"
                                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                    />
                                    {formData.systemRequirements.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, "systemRequirements")}
                                        className="px-3 sm:px-4 py-2 sm:py-3 text-red-600 border border-red-300 rounded-lg sm:rounded-xl hover:bg-red-50 transition-colors font-semibold flex-shrink-0"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addArrayItem("systemRequirements")}
                                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-semibold text-sm sm:text-base"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Requirement
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-4">
                                Dependencies
                              </label>
                              <div className="space-y-2 sm:space-y-3">
                                {formData.dependenciesArr.map((dep, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-2 sm:gap-3"
                                  >
                                    <input
                                      type="text"
                                      value={dep}
                                      onChange={(e) => handleArrayChange(index, e.target.value, "dependenciesArr")}
                                      placeholder="e.g., Node 18, MongoDB, Redis"
                                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                    />
                                    {formData.dependenciesArr.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, "dependenciesArr")}
                                        className="px-3 sm:px-4 py-2 sm:py-3 text-red-600 border border-red-300 rounded-lg sm:rounded-xl hover:bg-red-50 transition-colors font-semibold flex-shrink-0"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addArrayItem("dependenciesArr")}
                                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-semibold text-sm sm:text-base"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Dependency
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 sm:mb-4">
                                Installation Steps
                              </label>
                              <div className="space-y-2 sm:space-y-3">
                                {formData.installationSteps.map((step, index) => (
                                  <div
                                    key={index}
                                    className="flex gap-2 sm:gap-3"
                                  >
                                    <input
                                      type="text"
                                      value={step}
                                      onChange={(e) => handleArrayChange(index, e.target.value, "installationSteps")}
                                      placeholder="e.g., Clone repo, Install deps, Run app"
                                      className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                                    />
                                    {formData.installationSteps.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem(index, "installationSteps")}
                                        className="px-3 sm:px-4 py-2 sm:py-3 text-red-600 border border-red-300 rounded-lg sm:rounded-xl hover:bg-red-50 transition-colors font-semibold flex-shrink-0"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => addArrayItem("installationSteps")}
                                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-semibold text-sm sm:text-base"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add Step
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="animate-slideInUp">
                    <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                      <p className="text-sm text-orange-800 dark:text-orange-300">
                        <Video className="w-4 h-4 inline mr-2" />
                        Nothing is published until you confirm. Add visuals to showcase your work.
                      </p>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-8 flex items-center gap-3">
                      <Video className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                      Show it off
                    </h2>

                    <div className="space-y-6 sm:space-y-8">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Project Thumbnail *
                        </label>
                        <div className="space-y-3 sm:space-y-4">
                          {previewImage ? (
                            <div className="relative">
                              <img
                                src={previewImage || "/placeholder.svg"}
                                alt="Thumbnail preview"
                                className="w-full h-32 sm:h-48 object-cover rounded-lg sm:rounded-xl border-2 border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setPreviewImage("")
                                  setThumbnailFile(null)
                                  setFormData((prev) => ({ ...prev, thumbnailUrl: "" }))
                                }}
                                className="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                              >
                                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-8 text-center hover:border-blue-400 transition-colors">
                              <ImageIcon className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                              <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                                Upload a thumbnail for your project
                              </p>
                              <label className="inline-flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 cursor-pointer text-xs sm:text-base">
                                {thumbnailUploading ? (
                                  <>
                                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Choose Thumbnail
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleThumbnailUpload}
                                  disabled={thumbnailUploading}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          )}
                        </div>
                        {errors.thumbnail && (
                          <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-2 animate-shake">
                            <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            {errors.thumbnail}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Project Screenshots (up to 3)
                        </label>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-8 text-center hover:border-blue-400 transition-colors">
                            <ImageIcon className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                              Upload multiple screenshots of your project
                            </p>
                            <label className="inline-flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 cursor-pointer text-xs sm:text-base">
                              {imagesUploading ? (
                                <>
                                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                                  Choose Images
                                </>
                              )}
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleMultipleImagesUpload}
                                disabled={imagesUploading}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {uploadedFiles.filter((f) => f.type.startsWith("image/")).length > 0 && (
                            <div className="space-y-2 sm:space-y-3">
                              <h4 className="font-semibold text-xs sm:text-base text-gray-900 dark:text-gray-100">
                                Selected Images ({uploadedFiles.filter((f) => f.type.startsWith("image/")).length}):
                              </h4>
                              <div className="space-y-1.5 sm:space-y-2">
                                {uploadedFiles
                                  .map((file, index) => ({ file, index }))
                                  .filter(({ file }) => file.type.startsWith("image/"))
                                  .map(({ file, index }) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 dark:bg-slate-800 rounded-lg sm:rounded-xl"
                                    >
                                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                          <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                        </div>
                                        <div className="min-w-0">
                                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {file.name}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                          </p>
                                        </div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                                      >
                                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                      </button>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Source Files (ZIP, RAR, etc.)
                        </label>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-8 text-center hover:border-purple-400 transition-colors">
                            <FileText className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                            <p className="text-xs sm:text-base text-red-600 mb-2 sm:mb-4">Maximum size: 10 MB</p>
                            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                              Upload source code archives (.zip, .rar, .7z, .tar, .gz)
                            </p>
                            <label className="inline-flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 cursor-pointer text-xs sm:text-base">
                              {sourceFilesUploading ? (
                                <>
                                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                                  Choose Source Files
                                </>
                              )}
                              <input
                                type="file"
                                multiple
                                accept=".zip,.rar,.7z,.tar,.gz"
                                onChange={handleSourceFilesUpload}
                                disabled={sourceFilesUploading}
                                className="hidden"
                              />
                            </label>
                          </div>

                          {uploadedFiles.filter(
                            (f) =>
                              f.name.endsWith(".zip") ||
                              f.name.endsWith(".rar") ||
                              f.name.endsWith(".7z") ||
                              f.name.endsWith(".tar") ||
                              f.name.endsWith(".gz"),
                          ).length > 0 && (
                              <div className="space-y-2 sm:space-y-3">
                                <h4 className="font-semibold text-xs sm:text-base text-gray-900 dark:text-gray-100">
                                  Selected Source Files (
                                  {
                                    uploadedFiles.filter(
                                      (f) =>
                                        f.name.endsWith(".zip") ||
                                        f.name.endsWith(".rar") ||
                                        f.name.endsWith(".7z") ||
                                        f.name.endsWith(".tar") ||
                                        f.name.endsWith(".gz"),
                                    ).length
                                  }
                                  ):
                                </h4>
                                <div className="space-y-1.5 sm:space-y-2">
                                  {uploadedFiles
                                    .map((file, index) => ({ file, index }))
                                    .filter(
                                      ({ file }) =>
                                        file.name.endsWith(".zip") ||
                                        file.name.endsWith(".rar") ||
                                        file.name.endsWith(".7z") ||
                                        file.name.endsWith(".tar") ||
                                        file.name.endsWith(".gz"),
                                    )
                                    .map(({ file, index }) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-2 sm:p-3 bg-purple-50 rounded-lg sm:rounded-xl"
                                      >
                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
                                          </div>
                                          <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                              {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeFile(index)}
                                          className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                                        >
                                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          Documentation Files (PDF, MD, DOCX, etc.)
                        </label>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-8 text-center hover:border-green-400 transition-colors">
                            <FileText className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                            <p className="text-xs sm:text-base text-red-600 mb-2 sm:mb-4">Maximum size: 10 MB</p>
                            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4">
                              Upload documentation files (.pdf, .md, .txt, .docx, .doc)
                            </p>
                            <label className="inline-flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 cursor-pointer text-xs sm:text-base">
                              {docFilesUploading ? (
                                <>
                                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
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

                          {uploadedFiles.filter(
                            (f) =>
                              f.name.endsWith(".pdf") ||
                              f.name.endsWith(".md") ||
                              f.name.endsWith(".txt") ||
                              f.name.endsWith(".docx") ||
                              f.name.endsWith(".doc"),
                          ).length > 0 && (
                              <div className="space-y-2 sm:space-y-3">
                                <h4 className="font-semibold text-xs sm:text-base text-gray-900 dark:text-gray-100">
                                  Selected Documentation Files (
                                  {
                                    uploadedFiles.filter(
                                      (f) =>
                                        f.name.endsWith(".pdf") ||
                                        f.name.endsWith(".md") ||
                                        f.name.endsWith(".txt") ||
                                        f.name.endsWith(".docx") ||
                                        f.name.endsWith(".doc"),
                                    ).length
                                  }
                                  ):
                                </h4>
                                <div className="space-y-1.5 sm:space-y-2">
                                  {uploadedFiles
                                    .map((file, index) => ({ file, index }))
                                    .filter(
                                      ({ file }) =>
                                        file.name.endsWith(".pdf") ||
                                        file.name.endsWith(".md") ||
                                        file.name.endsWith(".txt") ||
                                        file.name.endsWith(".docx") ||
                                        file.name.endsWith(".doc"),
                                    )
                                    .map(({ file, index }) => (
                                      <div
                                        key={index}
                                        className="flex items-center justify-between p-2 sm:p-3 bg-green-50 rounded-lg sm:rounded-xl"
                                      >
                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                            <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                          </div>
                                          <div className="min-w-0">
                                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                              {file.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => removeFile(index)}
                                          className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0 ml-2"
                                        >
                                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                        </button>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                          YouTube Demo Video URL (Optional)
                        </label>
                        <input
                          type="url"
                          name="youtubeUrl"
                          value={formData.youtubeUrl}
                          onChange={handleInputChange}
                          placeholder="https://youtube.com/watch?v=..."
                          className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 ${errors.youtubeUrl ? "border-red-300 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500"
                            }`}
                        />
                        {errors.youtubeUrl && (
                          <p className="text-red-600 text-xs sm:text-sm mt-2">{errors.youtubeUrl}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="animate-slideInUp">
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-800 dark:text-green-300">
                        <Rocket className="w-4 h-4 inline mr-2" />
                        Final step! Set your pricing and get ready to launch.
                      </p>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-8 flex items-center gap-3">
                      <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                      Publish & Price
                    </h2>

                    <div className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            Sale Price (INR) *
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">
                              ₹
                            </span>
                            <input
                              type="number"
                              name="price"
                              value={formData.price}
                              onChange={handleInputChange}
                              min="10"
                              max="10000"
                              placeholder="500"
                              className={`w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 ${errors.price ? "border-red-300 bg-red-50 dark:bg-red-900/20" : "border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500"
                                }`}
                            />
                          </div>
                          {errors.price && (
                            <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-2">
                              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              {errors.price}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            Original Price (INR)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">
                              ₹
                            </span>
                            <input
                              type="number"
                              name="originalPrice"
                              value={formData.originalPrice}
                              onChange={handleInputChange}
                              min="10"
                              max="20000"
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
                            Delivery Time (days)
                          </label>
                          <input
                            type="number"
                            name="deliveryTime"
                            value={formData.deliveryTime}
                            onChange={handleInputChange}
                            min="0"
                            max="365"
                            placeholder="1"
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                          />
                        </div>
                      </div>

                      {formData.price &&
                        formData.originalPrice &&
                        Number.parseFloat(formData.originalPrice) > Number.parseFloat(formData.price) && (
                          <div className="p-3 sm:p-4 bg-green-50 rounded-lg sm:rounded-xl border border-green-200 animate-slideInUp">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-base font-semibold text-green-800">
                                  Great! You're offering a{" "}
                                  {Math.round(
                                    (1 -
                                      Number.parseFloat(formData.price) / Number.parseFloat(formData.originalPrice)) *
                                    100,
                                  )}
                                  % discount
                                </p>
                                <p className="text-xs text-green-700">
                                  Customers will save ₹
                                  {(
                                    Number.parseFloat(formData.originalPrice) - Number.parseFloat(formData.price)
                                  ).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

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
                    </div>
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-200">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-xs sm:text-base text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 dark:bg-slate-800 transition-colors"
                    >
                      Previous
                    </button>
                  )}

                  <div className="ml-auto flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => {
                          let hasErrors = false
                          const newErrors: Record<string, string> = {}

                          if (currentStep === 1) {
                            if (!formData.title.trim()) {
                              newErrors.title = "Project title is required"
                              hasErrors = true
                            }
                            if (!formData.description.trim()) {
                              newErrors.description = "Description is required"
                              hasErrors = true
                            } else if (formData.description.length < 100) {
                              newErrors.description = "Description must be at least 100 characters"
                              hasErrors = true
                            }
                            if (!formData.category) {
                              newErrors.category = "Please select a category"
                              hasErrors = true
                            }
                          } else if (currentStep === 2) {
                            const validFeatures = formData.features.filter(f => f.trim())
                            const validTechStack = formData.techStack.filter(t => t.trim())

                            if (validFeatures.length === 0) {
                              newErrors.features = "Please add at least one feature"
                              hasErrors = true
                            }
                            if (validTechStack.length === 0) {
                              newErrors.techStack = "Please add at least one technology"
                              hasErrors = true
                            }
                          } else if (currentStep === 3) {
                            if (!formData.thumbnailUrl && !thumbnailFile) {
                              newErrors.thumbnail = "Please upload a thumbnail image"
                              hasErrors = true
                            }
                          }

                          if (hasErrors) {
                            setErrors(newErrors)
                            toast.error("Please fill in all required fields")
                          } else {
                            setErrors({})
                            setCurrentStep((prev) => prev + 1)
                          }
                        }}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        Continue to {steps[currentStep].title}
                      </button>
                    ) : (
                      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => setShowPreview(!showPreview)}
                          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border border-blue-600 text-blue-600 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          Preview
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base hover:from-green-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
                              Publish Project 🚀
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-white/30 dark:border-slate-700/30 animate-slideInRight">
              <h3 className="text-base sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Live Preview
              </h3>
              <ProjectPreview />
            </div>

            <div
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-white/30 dark:border-slate-700/30 animate-slideInRight"
              style={{ animationDelay: "200ms" }}
            >
              <h3 className="text-base sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">Why Upload Your Project?</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center">
                    <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-300 font-medium">Earn money from your work</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-300 font-medium">Help other developers learn</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-300 font-medium">Build your reputation</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-300 font-medium">Secure platform & payments</span>
                </div>
              </div>
            </div>

            <div
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-white/30 dark:border-slate-700/30 animate-slideInRight"
              style={{ animationDelay: "400ms" }}
            >
              <h3 className="text-base sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">Submission Guidelines</h3>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Ensure your project is original and functional</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Include clear documentation and setup instructions</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Use high-quality screenshots and demo videos</span>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Projects are reviewed within 24-48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showPreview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Project Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              <ProjectPreview />
            </div>
          </div>
        )}

        {showSuccessModal && (
          <SuccessModal
            onClose={() => {
              setShowSuccessModal(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

const SuccessModal = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-slideInUp">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
          Project Submitted Successfully!
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6 text-sm sm:text-base">
          Your project has been created and saved as a <span className="font-semibold text-yellow-600 dark:text-yellow-400">draft</span>.
        </p>

        {/* Next Steps */}
        <div className="bg-blue-50 dark:bg-slate-800 rounded-xl p-4 mb-6 border border-blue-100 dark:border-slate-700">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Next Steps:
          </h3>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">1.</span>
              <span>Go to <span className="font-semibold">My Uploads</span> in your dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">2.</span>
              <span>Review your project details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">3.</span>
              <span>Click <span className="font-semibold">"Send for Approval"</span> when ready</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex-shrink-0">4.</span>
              <span>Our team will review within 24-48 hours</span>
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-800 transition-colors"
          >
            Upload Another
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadProject
