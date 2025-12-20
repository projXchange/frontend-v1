import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Upload,
  FileText,
  Video,
  IndianRupee,
  Tag,
  Award,
  Shield,
  CheckCircle,
  ImageIcon,
  X,
  Plus,
  AlertCircle,
  Sparkles,
  Eye,
  Send,
  Users,
  Clock,
  ArrowRight,
} from "lucide-react"
import toast from "react-hot-toast"
import { apiClient } from "../utils/apiClient"
import { getApiUrl } from "../config/api"

const UploadProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
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

  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewImage, setPreviewImage] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [currentStep, setCurrentStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [uploadedSourceFiles, setUploadedSourceFiles] = useState<string[]>([])
  const [uploadedDocFiles, setUploadedDocFiles] = useState<string[]>([])
  const [thumbnailUploading, setThumbnailUploading] = useState(false)
  const [imagesUploading, setImagesUploading] = useState(false)
  const [sourceFilesUploading, setSourceFilesUploading] = useState(false)
  const [docFilesUploading, setDocFilesUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null)

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  

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

  // Generic upload function for Cloudinary
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

  // 1. Thumbnail Upload (Single Image)
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

      // Store the actual file for later upload
      setThumbnailFile(file) // CHANGE THIS
      setFormData((prev) => ({ ...prev, thumbnailUrl: "TEMP_FILE" }))

      toast.success("Thumbnail selected! It will be uploaded when you submit the project.")
    } catch (error) {
      toast.error("Failed to process thumbnail.")
    } finally {
      setThumbnailUploading(false)
    }
  }

  // 2. Multiple Images Upload
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
      toast.error(
        `You can upload a maximum of 3 images. You already uploaded ${alreadyUploadedImages}, so you can select up to ${remainingSlots} more.`,
      )
      return
    }

    setImagesUploading(true)
    setUploadedFiles((prev) => [...prev, ...imageFiles])
    toast.success(`${imageFiles.length} image(s) selected! They will be uploaded when you submit the project.`)
    setImagesUploading(false)
  }

  // 3. Source Files Upload (ZIP, RAR, etc.)
  const handleSourceFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const maxSize = 10 * 1024 * 1024 // 10 MB
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
    toast.success(`${sourceFiles.length} source file(s) selected! They will be uploaded when you submit the project.`)
    setSourceFilesUploading(false)
  }

  // 4. Documentation Files Upload (PDF, MD, DOCX, etc.)
  const handleDocFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const maxSize = 10 * 1024 * 1024 // 10 MB in bytes

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
    toast.success(`${docFiles.length} documentation file(s) selected! They will be uploaded when you submit the project.`)
    setDocFilesUploading(false)
  }

  // Remove uploaded image
  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  // Remove file from uploadedFiles
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setUploadedFiles((prev) => [...prev, ...files])

      // If it's an image, set as preview
      const imageFile = files.find((file) => file.type.startsWith("image/"))
      if (imageFile) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setPreviewImage(e.target?.result as string)
        }
        reader.readAsDataURL(imageFile)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent multiple submissions
    if (isSubmitting) return

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key as keyof typeof formData] === "string") {
        validateField(key, formData[key as keyof typeof formData] as string)
      }
    })

    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true)
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          throw new Error("Authentication token not found. Please login again.")
        }

        // Step 1: Create project first to get project ID
        const initialProjectData = {
          title: formData.title,
          description: formData.description,
          key_features: formData.features.filter((f) => f.trim()).join(", "),
          category: formData.category,
          difficulty_level: formData.difficulty.toLowerCase(),
          tech_stack: formData.techStack.filter((tech) => tech.trim()),
          github_url: formData.githubUrl,
          demo_url: formData.liveDemo,
          youtube_url: formData.youtubeUrl,
          pricing: {
            sale_price: Number.parseFloat(formData.price),
            original_price: formData.originalPrice
              ? Number.parseFloat(formData.originalPrice)
              : Number.parseFloat(formData.price),
            currency: formData.currency || "INR",
          },
          delivery_time: formData.deliveryTime ? Number.parseInt(formData.deliveryTime, 10) : 0,
          thumbnail: "", // Will update after upload
          images: [], // Will update after upload
          files: {
            source_files: [],
            documentation_files: [],
          },
          requirements: {
            system_requirements: formData.systemRequirements.filter((s) => s.trim()),
            dependencies: formData.dependenciesArr.filter((d) => d.trim()),
            installation_steps: formData.installationSteps.filter((s) => s.trim()),
          },
        }

        console.log("Creating project...")

        const projectResponse = await apiClient(getApiUrl("/projects"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(initialProjectData),
        })

        console.log("Project response status:", projectResponse.status)

        if (!projectResponse.ok) {
          const errorData = await projectResponse.json()
          console.error("Project creation error:", errorData)
          throw new Error(`Failed to create project: ${errorData.error || projectResponse.statusText}`)
        }

        const projectResult = await projectResponse.json()
        console.log("Project creation response:", projectResult)

        // Get the project ID from backend response
        const backendProjectId =
          projectResult.project?.id ||
          projectResult.id ||
          projectResult._id ||
          projectResult.project_id ||
          projectResult.data?.id
        if (!backendProjectId) {
          throw new Error("Project ID not found in response")
        }

        console.log("Project created with ID:", backendProjectId)

        // Step 2: Upload all files to Cloudinary with project ID as folder
        const projectFolder = `projects/${backendProjectId}`

        let finalThumbnailUrl = ""
        let finalImageUrls: string[] = []
        let finalSourceFileUrls: string[] = []
        let finalDocFileUrls: string[] = []

        // 2.1 Upload Thumbnail
        if (thumbnailFile || (formData.thumbnailUrl && formData.thumbnailUrl !== "TEMP_FILE")) {
          try {
            console.log("Uploading thumbnail...")
            if (thumbnailFile) {
              finalThumbnailUrl = await uploadToCloudinary(thumbnailFile, `${projectFolder}/thumbnail`, "image")
            } else if (formData.thumbnailUrl && formData.thumbnailUrl !== "TEMP_FILE") {
              finalThumbnailUrl = formData.thumbnailUrl
            }
            console.log("Thumbnail uploaded:", finalThumbnailUrl)
          } catch (error) {
            console.error("Thumbnail upload failed:", error)
          }
        }

        // 2.2 Upload Multiple Images
        const imageFiles = uploadedFiles.filter((file) => file.type.startsWith("image/"))

        if (imageFiles.length > 0) {
          try {
            console.log(`Uploading ${imageFiles.length} images...`)
            const imageUploadPromises = imageFiles.map((file, index) =>
              uploadToCloudinary(file, `${projectFolder}/images`, "image"),
            )
            finalImageUrls = await Promise.all(imageUploadPromises)
            console.log(`${finalImageUrls.length} images uploaded`)
          } catch (error) {
            console.error("Images upload failed:", error)
          }
        }

        // 2.3 Upload Source Files
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
            console.log(`Uploading ${sourceFiles.length} source files...`)
            const sourceUploadPromises = sourceFiles.map((file) =>
              uploadToCloudinary(file, `${projectFolder}/source`, "raw"),
            )
            finalSourceFileUrls = await Promise.all(sourceUploadPromises)
            console.log(`${finalSourceFileUrls.length} source files uploaded`)
          } catch (error) {
            console.error("Source files upload failed:", error)
          }
        }

        // 2.4 Upload Documentation Files
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
            console.log(`Uploading ${docFiles.length} documentation files...`)
            const docUploadPromises = docFiles.map((file) => uploadToCloudinary(file, `${projectFolder}/docs`, "raw"))
            finalDocFileUrls = await Promise.all(docUploadPromises)
            console.log(`${finalDocFileUrls.length} documentation files uploaded`)
          } catch (error) {
            console.error("Documentation files upload failed:", error)
          }
        }

        // Step 3: Update project with all Cloudinary URLs
        console.log("Updating project with file URLs...")

        const updateData = {
          thumbnail: finalThumbnailUrl,
          images: finalImageUrls,
          files: {
            source_files: finalSourceFileUrls,
            documentation_files: finalDocFileUrls,
          },
        }

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
            console.log("Project updated with all files successfully")
          } else {
            const errorData = await updateResponse.json()
            console.error("Failed to update project with files:", errorData)
          }
        } catch (updateError) {
          console.error("Error updating project with files:", updateError)
        }

        // Store project ID and show success modal
        setCreatedProjectId(backendProjectId)
        setShowSuccessModal(true)

        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
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
        setUploadedImages([])
        setUploadedSourceFiles([])
        setUploadedDocFiles([])
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
            {categories.find((cat) => cat.value === formData.category)?.label || "Category"}
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
    { id: 1, title: "Basic Info", icon: FileText },
    { id: 2, title: "Details", icon: Tag },
    { id: 3, title: "Media & Files", icon: Upload },
    { id: 4, title: "Pricing", icon: IndianRupee },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-4 sm:py-6 md:py-8 lg:py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-slideInDown">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6">
            <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            Share Your Amazing Project
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-3 sm:mb-4 md:mb-6 text-balance">
            Upload Your Project
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 dark:text-gray-400 max-w-3xl mx-auto px-2 sm:px-4">
            Share your work with the community and help fellow developers learn from your expertise
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 sm:mb-10 md:mb-12 animate-slideInUp">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                  <div
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${currentStep >= step.id
                      ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20 dark:border-slate-700/30 animate-slideInLeft transition-colors">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="animate-slideInUp">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-4 sm:mb-8 flex items-center gap-3">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      Basic Information
                    </h2>

                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter an engaging project title"
                          className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 transition-all duration-200 ${errors.title ? "border-red-300 bg-red-50" : "border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500"
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
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
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
                          {errors.category && (
                            <p className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-2 animate-shake">
                              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              {errors.category}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
                            Difficulty Level
                          </label>
                          <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                          >
                            {difficulties.map((difficulty) => (
                              <option key={difficulty} value={difficulty}>
                                {difficulty}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Requirements: System Requirements */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-4">
                          System Requirements
                        </label>
                        <div className="space-y-2 sm:space-y-3">
                          {formData.systemRequirements.map((req, index) => (
                            <div
                              key={index}
                              className="flex gap-2 sm:gap-3 animate-slideInUp"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <input
                                type="text"
                                value={req}
                                onChange={(e) => handleArrayChange(index, e.target.value, "systemRequirements")}
                                placeholder="e.g., Windows 10, 8GB RAM"
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
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
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-blue-600 border border-blue-300 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors font-semibold text-sm sm:text-base"
                          >
                            <Plus className="w-4 h-4" />
                            Add Requirement
                          </button>
                        </div>
                      </div>

                      {/* Requirements: Dependencies */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-4">
                          Dependencies
                        </label>
                        <div className="space-y-2 sm:space-y-3">
                          {formData.dependenciesArr.map((dep, index) => (
                            <div
                              key={index}
                              className="flex gap-2 sm:gap-3 animate-slideInUp"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <input
                                type="text"
                                value={dep}
                                onChange={(e) => handleArrayChange(index, e.target.value, "dependenciesArr")}
                                placeholder="e.g., Node 18, MongoDB, Redis"
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
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
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-blue-600 border border-blue-300 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors font-semibold text-sm sm:text-base"
                          >
                            <Plus className="w-4 h-4" />
                            Add Dependency
                          </button>
                        </div>
                      </div>

                      {/* Requirements: Installation Steps */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-4">
                          Installation Steps
                        </label>
                        <div className="space-y-2 sm:space-y-3">
                          {formData.installationSteps.map((step, index) => (
                            <div
                              key={index}
                              className="flex gap-2 sm:gap-3 animate-slideInUp"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <input
                                type="text"
                                value={step}
                                onChange={(e) => handleArrayChange(index, e.target.value, "installationSteps")}
                                placeholder="e.g., Clone repo, Install deps, Run app"
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
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
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-blue-600 border border-blue-300 rounded-lg sm:rounded-xl hover:bg-blue-50 transition-colors font-semibold text-sm sm:text-base"
                          >
                            <Plus className="w-4 h-4" />
                            Add Step
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
                          Project Description *
                          <span className="text-gray-500 dark:text-gray-400 font-normal ml-2 text-xs sm:text-sm">
                            ({formData.description.length}/500 characters)
                          </span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          rows={5}
                          maxLength={500}
                          placeholder="Describe your project, what it does, what makes it special, and what others can learn from it..."
                          className={`w-full px-3 sm:px-4 py-3 sm:py-4 border rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 transition-all duration-200 resize-none ${errors.description ? "border-red-300 bg-red-50" : "border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500"
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

                {/* Step 2: Features & Tech Stack */}
                {currentStep === 2 && (
                  <div className="animate-slideInUp">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-4 sm:mb-8 flex items-center gap-3">
                      <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      Project Details
                    </h2>

                    <div className="space-y-6 sm:space-y-8">
                      {/* Features */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-4">
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
                                placeholder="Enter a key feature"
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
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

                      {/* Tech Stack */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-4">
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
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
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

                      {/* URLs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
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
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
                            Live Demo URL
                          </label>
                          <input
                            type="url"
                            name="liveDemo"
                            value={formData.liveDemo}
                            onChange={handleInputChange}
                            placeholder="https://your-demo.vercel.app"
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Media & Files */}
                {currentStep === 3 && (
                  <div className="animate-slideInUp">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-4 sm:mb-8 flex items-center gap-3">
                      <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      Media & Files
                    </h2>

                    <div className="space-y-6 sm:space-y-8">
                      {/* 1. Thumbnail Upload */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
                          Project Thumbnail * (Single Image)
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
                              <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 dark:text-gray-400 mb-3 sm:mb-4">
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

                      {/* 2. Multiple Images Upload */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
                          Project Screenshots (Multiple Images)
                        </label>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-8 text-center hover:border-blue-400 transition-colors">
                            <ImageIcon className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 dark:text-gray-400 mb-3 sm:mb-4">
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

                          {/* Display Selected Images */}
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
                                          <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 dark:text-gray-100 truncate">
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

                      {/* 3. Source Files Upload */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
                          Source Files (ZIP, RAR, etc.)
                        </label>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-8 text-center hover:border-purple-400 transition-colors">
                            <FileText className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                            <p className="text-xs sm:text-base text-red-600 mb-2 sm:mb-4">a maximum size of 10 MB.</p>
                            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 dark:text-gray-400 mb-3 sm:mb-4">
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

                          {/* Display Selected Source Files */}
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
                                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 dark:text-gray-100 truncate">
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

                      {/* 4. Documentation Files Upload */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
                          Documentation Files (PDF, MD, DOCX, etc.)
                        </label>
                        <div className="space-y-3 sm:space-y-4">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-8 text-center hover:border-green-400 transition-colors">
                            <FileText className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                            <p className="text-xs sm:text-base text-red-600 mb-2 sm:mb-4">a maximum size of 10 MB.</p>
                            <p className="text-xs sm:text-base text-gray-600 dark:text-gray-300 dark:text-gray-400 mb-3 sm:mb-4">
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

                          {/* Display Selected Documentation Files */}
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
                                            <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 dark:text-gray-100 truncate">
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

                      {/* YouTube URL */}
                      <div>
                        <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
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

                {/* Step 4: Pricing */}
                {currentStep === 4 && (
                  <div className="animate-slideInUp">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-4 sm:mb-8 flex items-center gap-3">
                      <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      Pricing Strategy
                    </h2>

                    <div className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
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
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
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
                              className="w-full pl-7 sm:pl-8 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 dark:text-gray-300 mb-2 sm:mb-3">
                            Currency
                          </label>
                          <select
                            name="currency"
                            value={formData.currency}
                            onChange={handleInputChange}
                            className="w-full px-3 sm:px-4 py-3 sm:py-4 border border-gray-300 dark:border-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                          >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                            Expected Timeline (days)
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

                {/* Navigation Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-200">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-xs sm:text-base text-gray-700 dark:text-gray-300 dark:text-gray-300 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 dark:bg-slate-800 transition-colors"
                    >
                      Previous
                    </button>
                  )}

                  <div className="ml-auto flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
                    {currentStep < 4 ? (
                      <button
                        type="button"
                        onClick={() => {
                          // Validate required fields before moving to next step
                          let hasErrors = false;
                          const newErrors: Record<string, string> = {};

                          if (currentStep === 1) {
                            // Step 1: Basic Information validation
                            if (!formData.title.trim()) {
                              newErrors.title = "Project title is required";
                              hasErrors = true;
                            }
                            if (!formData.description.trim()) {
                              newErrors.description = "Description is required";
                              hasErrors = true;
                            } else if (formData.description.length < 100) {
                              newErrors.description = "Description must be at least 100 characters";
                              hasErrors = true;
                            }
                            if (!formData.category) {
                              newErrors.category = "Please select a category";
                              hasErrors = true;
                            }
                          } else if (currentStep === 2) {
                            // Step 2: Details validation
                            const validFeatures = formData.features.filter(f => f.trim());
                            const validTechStack = formData.techStack.filter(t => t.trim());

                            if (validFeatures.length === 0) {
                              newErrors.features = "Please add at least one feature";
                              hasErrors = true;
                            }
                            if (validTechStack.length === 0) {
                              newErrors.techStack = "Please add at least one technology";
                              hasErrors = true;
                            }
                          } else if (currentStep === 3) {
                            // Step 3: Media & Files validation
                            if (!formData.thumbnailUrl && !thumbnailFile) {
                              newErrors.thumbnail = "Please upload a thumbnail image";
                              hasErrors = true;
                            }
                          }

                          if (hasErrors) {
                            setErrors(newErrors);
                          } else {
                            setErrors({});
                            setCurrentStep((prev) => prev + 1);
                          }
                        }}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        Next Step
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
                          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg sm:rounded-xl font-semibold text-xs sm:text-base hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                              Submit Project
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

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {/* Preview Card */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-white/30 dark:border-slate-700/30 animate-slideInRight">
              <h3 className="text-base sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Live Preview
              </h3>
              <ProjectPreview />
            </div>

            {/* Benefits */}
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
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-300 dark:text-gray-300 font-medium">Earn money from your work</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-300 dark:text-gray-300 font-medium">Help other developers learn</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-500 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Award className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-300 dark:text-gray-300 font-medium">Build your reputation</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="text-xs sm:text-base text-gray-700 dark:text-gray-300 dark:text-gray-300 font-medium">Secure platform & payments</span>
                </div>
              </div>
            </div>

            {/* Guidelines */}
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

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-4 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Project Preview</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              <ProjectPreview />
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <SuccessModal
            projectId={createdProjectId}
            onClose={() => {
              setShowSuccessModal(false)
              setCreatedProjectId(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

// Success Modal Component
const SuccessModal = ({ projectId, onClose }: { projectId: string | null; onClose: () => void }) => {
  const navigate = useNavigate()

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-slideInUp">
        {/* Success Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 text-center mb-4">
          Project Submitted Successfully!
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 dark:text-gray-400 text-center mb-6 text-sm sm:text-base">
          Your project has been created and saved as a <span className="font-semibold text-yellow-600">draft</span>.
        </p>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Next Steps:
          </h3>
          <ol className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 flex-shrink-0">1.</span>
              <span>Go to <span className="font-semibold">My Uploads</span> in your dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 flex-shrink-0">2.</span>
              <span>Review your project details</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 flex-shrink-0">3.</span>
              <span>Click <span className="font-semibold">"Send for Approval"</span> when ready</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-blue-600 flex-shrink-0">4.</span>
              <span>Our team will review within 24-48 hours</span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
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
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:bg-slate-800 transition-colors"
          >
            Upload Another
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadProject
