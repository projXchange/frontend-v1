import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Star,
  Calendar,
  Settings,
  ShoppingBag,
  Heart,
  Eye,
  Award,
  TrendingUp,
  Clock,
  BarChart3,
  Trophy,
  Activity,
  Search,
  Loader,
  Save,
  Edit3,
  Github,
  Globe,
  Linkedin,
  MapPin,
  Twitter,
  X,
  MessageSquare,
  Trash2,
  User,
  DollarSign,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useWishlist } from "../contexts/WishlistContext"
import { motion } from "framer-motion"
import type { ProfileForm, SocialLinks } from "../types/ProfileForm"
import type { Review, Project } from "../types/Project"
import type { Transaction } from "../types/Transaction"
import ReviewDetailsModal from "../components/ReviewDetailsModal"
import ProjectDetailsModal from "../components/ProjectDetailsModal"
import toast from "react-hot-toast"

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const { user } = useAuth()
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [loading, setLoading] = useState(false) // reviews loading
  const [reviews, setReviews] = useState<Review[]>([])
  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [purchasedProjects, setPurchasedProjects] = useState<Project[]>([])
  const [purchasedProjectsLoading, setPurchasedProjectsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [updatingReview, setUpdatingReview] = useState<string | null>(null)
  const [reviewFilterStatus, setReviewFilterStatus] = useState("all")

  // Project details modal state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectUpdateData, setProjectUpdateData] = useState<{ status: string; is_featured: boolean }>({
    status: "draft",
    is_featured: false,
  })
  const [projectEditData, setProjectEditData] = useState<Partial<Project>>({})
  const [updatingProjectStatus, setUpdatingProjectStatus] = useState(false)
  const [updatingProjectId, setUpdatingProjectId] = useState<string | null>(null)

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    id: "",
    rating: 0,
    total_sales: 0,
    total_purchases: 0,
    experience_level: "beginner",
    avatar: "",
    bio: "",
    location: "",
    website: "",
    social_links: { github: "", linkedin: "", twitter: "" },
    skills: [],
    status: "active",
    created_at: "",
  })

  const { wishlist } = useWishlist()

  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const filteredProjects = myProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }: any) => (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className={`text-sm font-semibold ${color}`}>{subtitle}</p>
        </div>
        <div
          className={`w-14 h-14 bg-gradient-to-br ${color.replace("text-", "from-").replace("-600", "-500")} to-${color.split("-")[1]}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 font-semibold">{trend}</span>
        </div>
      )}
    </div>
  )

  const fetchReviews = async () => {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("token")
    try {
      const res = await fetch("https://projxchange-backend-v1.vercel.app/reviews/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch reviews")

      const data = await res.json()
      setReviews(data.reviews || [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Could not load reviews.")
    } finally {
      setLoading(false)
    }
  }

  const fetchMyProjects = async () => {
    setProjectsLoading(true)
    setPurchasedProjectsLoading(true)

    try {
      const res = await fetch(`https://projxchange-backend-v1.vercel.app/projects/my`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch projects")

      const data = await res.json()

      // Defensive checks
      const uploaded = Array.isArray(data.uploaded) ? data.uploaded : []
      const purchased = Array.isArray(data.purchased) ? data.purchased : []

      setMyProjects(uploaded)
      setPurchasedProjects(purchased)

      // Log the fresh data directly instead of relying on state
      console.log("Uploaded projects:", uploaded)
      console.log("Purchased projects:", purchased)

    } catch (err) {
      console.error("Error fetching projects:", err)
      setMyProjects([])
      setPurchasedProjects([])
    } finally {
      setProjectsLoading(false)
      setPurchasedProjectsLoading(false)
    }
  }


  const fetchMyTransactions = async () => {
    setTransactionsLoading(true)
    try {
      const res = await fetch("https://projxchange-backend-v1.vercel.app/transactions/my", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch transactions")
      const data = await res.json()
      setTransactions(data.transactions || [])
    } catch (err) {
      console.error(err)
      setTransactions([])
    } finally {
      setTransactionsLoading(false)
    }
  }

  const fetchDashboardStats = async () => {
    setStatsLoading(true)
    try {
      const res = await fetch("https://projxchange-backend-v1.vercel.app/dashboard/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch dashboard stats")
      const data = await res.json()
      setDashboardStats(data.stats || null)
    } catch (err) {
      console.error(err)
      setDashboardStats(null)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await fetch(`https://projxchange-backend-v1.vercel.app/users/profile/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      if (!res.ok) throw new Error("Failed to fetch profile")
      const data = await res.json()
      if (data.profile) {
        const profile = data.profile
        const normalizedSocialLinks = Object.fromEntries(
          Object.entries(profile.social_links || {}).map(([k, v]) => [k, v ?? ""]),
        )
        setProfileForm({
          id: profile.id || "",
          rating: profile.rating ?? 0,
          total_sales: profile.total_sales ?? 0,
          total_purchases: profile.total_purchases ?? 0,
          experience_level: profile.experience_level || "beginner",
          avatar: profile.avatar || "",
          bio: profile.bio ?? "",
          location: profile.location ?? "",
          website: profile.website ?? "",
          social_links: normalizedSocialLinks as any,
          skills: profile.skills || [],
          status: profile.status || "active",
          created_at: profile.created_at || "",
        })
      }
    } catch (err: any) {
      setError(err.message || "Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }

  const openProjectDetails = (project: Project) => {
    setSelectedProject(project)
    setProjectUpdateData({ status: project.status, is_featured: project.is_featured })
    setProjectEditData({
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      difficulty_level: project.difficulty_level,
      delivery_time: project.delivery_time,
      tech_stack: project.tech_stack,
      key_features: project.key_features,
      pricing: project.pricing,
      requirements: project.requirements,
      github_url: project.github_url,
      demo_url: project.demo_url,
      youtube_url: project.youtube_url,
      thumbnail: project.thumbnail,
      images: project.images,
      author_id: project.author_id,
      created_at: project.created_at,
      updated_at: project.updated_at,
    })
    setIsProjectModalOpen(true)
  }
  const handleUpdateProject = async () => {
    if (!selectedProject) return
    setUpdatingProjectStatus(true)

    try {
      // Build payload matching API schema exactly
      const payload: any = {
        title: projectEditData?.title || selectedProject.title,
        description: projectEditData?.description || selectedProject.description,
        key_features: projectEditData?.key_features || selectedProject.key_features || "",
        category: projectEditData?.category || selectedProject.category || "web_development",
        difficulty_level: projectEditData?.difficulty_level || selectedProject.difficulty_level || "beginner",
        tech_stack: projectEditData?.tech_stack || selectedProject.tech_stack || [],
        delivery_time: projectEditData?.delivery_time ?? selectedProject.delivery_time ?? 0,
        status: "draft",
        thumbnail: projectEditData?.thumbnail || selectedProject.thumbnail || "",
        images: projectEditData?.images || selectedProject.images || [],
        pricing: {
          sale_price: projectEditData?.pricing?.sale_price ?? selectedProject.pricing?.sale_price ?? 0,
          original_price: projectEditData?.pricing?.original_price ?? selectedProject.pricing?.original_price ?? 0,
          currency: projectEditData?.pricing?.currency || selectedProject.pricing?.currency || "INR",
        },
        requirements: {
          system_requirements:
            projectEditData?.requirements?.system_requirements ||
            selectedProject.requirements?.system_requirements ||
            [],
          dependencies: projectEditData?.requirements?.dependencies || selectedProject.requirements?.dependencies || [],
          installation_steps:
            projectEditData?.requirements?.installation_steps || selectedProject.requirements?.installation_steps || [],
        },
      }

      // Add optional fields only if they have values
      if (projectEditData?.github_url || selectedProject.github_url) {
        payload.github_url = projectEditData?.github_url || selectedProject.github_url
      }
      if (projectEditData?.demo_url || selectedProject.demo_url) {
        payload.demo_url = projectEditData?.demo_url || selectedProject.demo_url
      }
      if (projectEditData?.youtube_url || selectedProject.youtube_url) {
        payload.youtube_url = projectEditData?.youtube_url || selectedProject.youtube_url
      }

      // Add files if they exist
      if (selectedProject.files || projectEditData?.files) {
        payload.files = {
          source_files: projectEditData?.files?.source_files || selectedProject.files?.source_files || [],
          documentation_files:
            projectEditData?.files?.documentation_files || selectedProject.files?.documentation_files || [],
        }
      }
      const res = await fetch(`https://projxchange-backend-v1.vercel.app/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => null)
        const errorText = errorData ? JSON.stringify(errorData) : await res.text()
        console.error("Backend Error:", errorText, "Status:", res.status)
        throw new Error(errorData?.detail || "Failed to update project")
      }

      const data = await res.json()
      const updated = data.project || data

      setMyProjects((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)))
      toast.success("Project updated successfully!")
      setIsProjectModalOpen(false)
      setSelectedProject(null)
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to update project. Please try again.")
    } finally {
      setUpdatingProjectStatus(false)
    }
  }

  const handleSendForApproval = async (project: Project) => {
    try {
      setUpdatingProjectId(project.id)
      const res = await fetch(`https://projxchange-backend-v1.vercel.app/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "pending" }),
      })
      if (!res.ok) throw new Error("Failed to send for approval")
      const data = await res.json()
      const updated = data.project || data
      setMyProjects((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)))

      toast.success("Project sent for approval.")
    } catch (err) {
      console.error(err)
      alert("Failed to send for approval.")
    } finally {
      setUpdatingProjectId(null)
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    setError("")
    try {
      const method = "PATCH"
      const url = `https://projxchange-backend-v1.vercel.app/users/profile/${profileForm.id || user?.id}`
      const payload = {
        rating: profileForm.rating,
        total_sales: profileForm.total_sales,
        total_purchases: profileForm.total_purchases,
        experience_level: profileForm.experience_level,
        avatar: avatarFile && avatarPreview ? avatarPreview : profileForm.avatar || "",
        bio: profileForm.bio ?? "",
        location: profileForm.location ?? "",
        website: profileForm.website ?? "",
        social_links: Object.fromEntries(Object.entries(profileForm.social_links || {}).map(([k, v]) => [k, v ?? ""])),
        skills: profileForm.skills || [],
      }
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed to save profile")
      const data = await res.json()
      setProfileForm({
        ...data.profile,
        social_links: {
          github: data.profile.social_links?.github || "",
          linkedin: data.profile.social_links?.linkedin || "",
          twitter: data.profile.social_links?.twitter || "",
        },
        skills: data.profile.skills || [],
      })
      setAvatarFile(null)
      setAvatarPreview("")
      setIsEditingProfile(false)
      toast.success("Profile updated successfully!")
    } catch (err: any) {
      setError(err.message || "Failed to save profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    fetchUserProfile() // reload to reset form
    setIsEditingProfile(false)
    setError("")
  }

  const handleInputChange = (field: keyof ProfileForm, value: any) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setProfileForm((prev) => ({
      ...prev,
      social_links: { ...prev.social_links, [platform]: value },
    }))
  }

  const handleAddSkill = () => {
    const trimmedSkill = newSkill.trim()
    if (!trimmedSkill || profileForm.skills.includes(trimmedSkill)) return
    setProfileForm((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmedSkill],
    }))
    setNewSkill("")
  }

  const handleRemoveSkill = (index: number) => {
    setProfileForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const handleAvatarClear = () => {
    setAvatarFile(null)
    setAvatarPreview("")
  }

  const handleUpdateReview = async (reviewId: string, updatedReview: { review_text: string; rating: number }) => {
    setUpdatingReview(reviewId)
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`https://projxchange-backend-v1.vercel.app/reviews/${reviewId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedReview),
      })

      if (!response.ok) {
        throw new Error("Failed to update review")
      }

      const data = await response.json()
      setReviews((prev) => prev.map((review) => (review.id === reviewId ? { ...review, ...data.review } : review)))
      toast.success("Review updated successfully!")
      setIsReviewModalOpen(false)
    } catch (error) {
      console.error("Error updating review:", error)
      alert("Failed to update review. Please try again.")
    } finally {
      setUpdatingReview(null)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    setUpdatingReview(reviewId)
    const token = localStorage.getItem("token")
    try {
      const response = await fetch(`https://projxchange-backend-v1.vercel.app/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId))
        toast.success("Review deleted successfully!")
        setIsReviewModalOpen(false)
      } else {
        throw new Error("Failed to delete review")
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      toast.error("Failed to delete review. Please try again.")
    } finally {
      setUpdatingReview(null)
    }
  }
  const openReviewModal = (review: Review) => {
    setSelectedReview(review)
    setIsReviewModalOpen(true)
  }

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.review_text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      reviewFilterStatus === "all" ||
      (reviewFilterStatus === "approved" && review.is_approved) ||
      (reviewFilterStatus === "pending" && !review.is_approved)
    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    // Load stats on mount
    fetchDashboardStats()
  }, [])

  useEffect(() => {
    if (activeTab === "overview" && !dashboardStats && !statsLoading) {
      fetchDashboardStats()
    }
    if (activeTab === "my-projects" && myProjects.length === 0 && !projectsLoading) {
      fetchMyProjects()
    }
    if (activeTab === "purchased-projects" && purchasedProjects.length === 0 && !purchasedProjectsLoading) {
      fetchMyProjects()
    }
    if (activeTab === "reviews" && reviews.length === 0 && !loading) {
      fetchReviews()
    }
    if (activeTab === "transactions" && transactions.length === 0 && !transactionsLoading) {
      fetchMyTransactions()
    }
    if (activeTab === "profile" && !isLoading) {
      fetchUserProfile()
    }
  }, [activeTab])

  if (!user) return <p>No profile data found</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-8 sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 animate-slideInLeft w-full sm:w-auto">
              <div className="relative flex-shrink-0">
                <img
                  src={
                    user?.avatar ||
                    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
                  }
                  alt={user.full_name}
                  className="w-16 sm:w-20 h-16 sm:h-20 rounded-full object-cover ring-4 ring-white/30"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold">
                  {profileForm.experience_level}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                  Welcome back, {user.full_name}!
                </h1>
                <p className="text-blue-100 text-sm sm:text-lg">{user.email}</p>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>
                      Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:-mt-16 relative z-10">
          <StatCard
            title="Projects Owned"
            value={dashboardStats?.user_performance?.projects_owned || 0}
            subtitle={`${dashboardStats?.monthly_activity?.new_projects_created || 0} new this month`}
            icon={ShoppingBag}
            color="text-blue-600"
          />
          <StatCard
            title="Total Purchases"
            value={dashboardStats?.user_performance?.total_purchases || 0}
            subtitle={`${dashboardStats?.monthly_activity?.new_projects_purchased || 0} this month`}
            icon={Award}
            color="text-green-600"
          />
          <StatCard
            title="Wishlist Items"
            value={dashboardStats?.user_performance?.wishlist_items || wishlist.length}
            subtitle="Ready to buy"
            icon={Heart}
            color="text-pink-600"
          />
          <StatCard
            title="Avg Rating"
            value={dashboardStats?.user_performance?.average_rating?.toFixed(1) || "0.0"}
            subtitle="Overall rating"
            icon={Star}
            color="text-yellow-600"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto sm:overflow-visible sm:overflow-y-hidden space-x-2 sm:space-x-8 px-4 sm:px-8 -mx-4 sm:mx-0">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "my-projects", label: "My Uploads", icon: ShoppingBag },
                { id: "purchased-projects", label: "My Purchases", icon: ShoppingBag },
                { id: "wishlist", label: "Wishlist", icon: Heart },
                { id: "reviews", label: "Reviews", icon: Trophy },
                { id: "transactions", label: "Payments", icon: Clock },
                { id: "profile", label: "Profile", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-3 py-3 sm:py-6 px-3 sm:px-2 border-b-2 font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                    ? "border-blue-500 text-blue-600 scale-105"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:scale-105"
                    }`}
                >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>


          <div className="p-4 sm:p-8">
            {activeTab === "overview" && (
              <motion.div
                className="animate-slideInUp"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Dashboard Overview</h2>

                <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
                  {/* Left section (main overview cards) */}
                  <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    {/* USER PERFORMANCE */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-lg">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-3">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        User Performance
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm">Projects Owned</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {dashboardStats?.user_performance?.projects_owned || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm">Purchases</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {dashboardStats?.user_performance?.total_purchases || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm">Wishlist</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {dashboardStats?.user_performance?.wishlist_items || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs sm:text-sm">Avg. Rating</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {dashboardStats?.user_performance?.average_rating || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MONTHLY ACTIVITY */}
                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 sm:p-8 border border-blue-100 shadow-lg">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-3">
                        <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        Monthly Activity
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center">
                        <div>
                          <p className="text-blue-700 text-xs sm:text-sm">New Projects</p>
                          <p className="text-xl sm:text-2xl font-bold text-blue-900">
                            {dashboardStats?.monthly_activity?.new_projects_created || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-700 text-xs sm:text-sm">Downloads</p>
                          <p className="text-xl sm:text-2xl font-bold text-blue-900">
                            {dashboardStats?.monthly_activity?.downloads_received || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-700 text-xs sm:text-sm">Purchases</p>
                          <p className="text-xl sm:text-2xl font-bold text-blue-900">
                            {dashboardStats?.monthly_activity?.new_projects_purchased || 0}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* REVENUE & FINANCIAL */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border border-green-100 shadow-lg">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-3">
                        <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        Revenue & Financial
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center">
                        <div>
                          <p className="text-green-700 text-xs sm:text-sm">Total Revenue</p>
                          <p className="text-xl sm:text-2xl font-bold text-green-900">
                            ₹{dashboardStats?.revenue_financial?.total_revenue_earned || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-700 text-xs sm:text-sm">Avg. Sale Price</p>
                          <p className="text-xl sm:text-2xl font-bold text-green-900">
                            ₹{dashboardStats?.revenue_financial?.average_sale_price || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-green-700 text-xs sm:text-sm">Revenue Trend</p>
                          <p className="text-xs sm:text-sm text-green-900">
                            {dashboardStats?.revenue_financial?.monthly_revenue_trend?.[0]?.month || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side (secondary cards) */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* PROJECT PERFORMANCE */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 sm:p-6 border border-purple-100 shadow-lg">
                      <h4 className="font-bold text-purple-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700" />
                        Project Performance
                      </h4>
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <p>
                          <span className="font-semibold">Best Project:</span>{" "}
                          {dashboardStats?.project_performance?.best_performing_project?.title || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Total Sales:</span>{" "}
                          {dashboardStats?.project_performance?.best_performing_project?.total_sales || 0}
                        </p>
                        <p>
                          <span className="font-semibold">Downloads:</span>{" "}
                          {dashboardStats?.project_performance?.best_performing_project?.total_downloads || 0}
                        </p>
                        <p>
                          <span className="font-semibold">Views:</span>{" "}
                          {dashboardStats?.project_performance?.best_performing_project?.total_views || 0}
                        </p>
                      </div>
                    </div>

                    {/* ENGAGEMENT METRICS */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 sm:p-6 border border-yellow-100 shadow-lg">
                      <h4 className="font-bold text-yellow-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                        Engagement Metrics
                      </h4>
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <p>
                          <span className="font-semibold">Total Views:</span>{" "}
                          {dashboardStats?.engagement_metrics?.total_project_views || 0}
                        </p>
                        <p>
                          <span className="font-semibold">Wishlist → Purchase %:</span>{" "}
                          {dashboardStats?.engagement_metrics?.wishlist_to_purchase_conversion || 0}%
                        </p>
                        <p>
                          <span className="font-semibold">Positive Reviews:</span>{" "}
                          {dashboardStats?.engagement_metrics?.positive_review_percentage || 0}%
                        </p>
                        <p>
                          <span className="font-semibold">Repeat Customers:</span>{" "}
                          {dashboardStats?.engagement_metrics?.repeat_customer_count || 0} (
                          {dashboardStats?.engagement_metrics?.repeat_customer_percentage || 0}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "my-projects" && (
              <div className="animate-slideInUp">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Projects</h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-auto pl-10 pr-3 sm:pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                  </div>
                </div>
                {projectsLoading ? (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading projects...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredProjects.map((project, index) => (
                            <tr
                              key={project.id}
                              className="hover:bg-gray-50 transition-colors animate-slideInUp"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <div className="font-semibold text-gray-900 text-xs sm:text-base">{project.title}</div>
                              </td>
                              <th className="hidden sm:table-cell px-6 py-4 text-sm text-gray-700 text-left font-normal">
                                {project.category}
                              </th>
                              <th className="hidden md:table-cell px-6 py-4 text-sm text-gray-700 font-semibold text-left">
                                ₹{project.pricing?.sale_price || 0}
                              </th>
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <span
                                  className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${project.status === "approved" ? "bg-green-100 text-green-800" : project.status === "pending_review" || project.status === "draft" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                                >
                                  {project.status}
                                </span>
                              </td>
                              <th className="hidden lg:table-cell px-6 py-4 text-sm text-gray-600 text-left font-normal">
                                {new Date(project.created_at).toLocaleDateString()}
                              </th>
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-2">
                                  <button
                                    onClick={() => openProjectDetails(project)}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-lg transition-colors text-xs sm:text-sm font-semibold whitespace-nowrap"
                                  >
                                    Update
                                  </button>

                                  <button
                                    onClick={() => handleSendForApproval(project)}
                                    disabled={updatingProjectId === project.id || project.status !== "draft"}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 text-yellow-700 hover:text-yellow-900 hover:bg-yellow-50 rounded-lg transition-colors text-xs sm:text-sm font-semibold disabled:opacity-50 whitespace-nowrap"
                                  >
                                    {updatingProjectId === project.id
                                      ? "Sending..."
                                      : project.status === "pending"
                                        ? "Sent for Approval"
                                        : "Send for Approval"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filteredProjects.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                                No projects found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'purchased-projects' && (
              <div className="animate-slideInUp">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">My Purchases</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search purchased projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                  </div>
                </div>

                {purchasedProjectsLoading ? (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading purchased projects...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Purchased On</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {purchasedProjects.map((project, index) => (
                            <tr key={project.id} className="hover:bg-gray-50 transition-colors animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-gray-900">{project.title}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700">{project.category}</td>
                              <td className="px-6 py-4 text-sm text-gray-700 font-semibold">₹{project.pricing?.sale_price || 0}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  project.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                  {project.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{new Date(project.created_at).toLocaleDateString()}</td>
                              <td className="px-6 py-4">
                                <Link
                                  to={`/project/${project.id}`}
                                  className="px-3 py-2 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors text-sm font-semibold inline-block"
                                >
                                  View
                                </Link>
                              </td>
                            </tr>
                          ))}
                          {purchasedProjects.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-600">No purchased projects found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}


            {activeTab === "wishlist" && (
              <div className="animate-slideInUp">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Wishlist</h2>
                  <div className="text-xs sm:text-sm text-gray-600">
                    <span className="font-semibold">{wishlist.length}</span> items saved
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {wishlist.length === 0 ? (
                    <div className="col-span-full text-center py-12 sm:py-16">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                      </div>
                      <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">No items in wishlist</h3>
                      <p className="text-xs sm:text-base text-gray-600 mb-6 sm:mb-8">
                        Start exploring projects and add them to your wishlist!
                      </p>
                      <Link
                        to="/projects"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-sm sm:text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                      >
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        Browse Projects
                      </Link>
                    </div>
                  ) : (
                    wishlist.map((item, index) => (
                      <div
                        key={item.id}
                        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 group animate-slideInUp"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="relative">
                          <img
                            src={`https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400`}
                            alt={item.project.title}
                            className="w-full h-32 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
                            <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                              {item.project.category}
                            </span>
                          </div>
                          <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
                            <button className="w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-current" />
                            </button>
                          </div>
                        </div>
                        <div className="p-4 sm:p-6">
                          <div className="flex items-center justify-between mb-2 sm:mb-3">
                            <div className="flex items-center">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-xs sm:text-sm font-semibold">4.8</span>
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600">
                              {item.project.purchase_count || 0} sales
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {item.project.title}
                          </h3>
                          <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                            <div className="flex items-center justify-between">
                              <span>Added:</span>
                              <span className="font-semibold">{new Date(item.added_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-0">
                            <div className="flex items-center gap-2">
                              <span className="text-lg sm:text-2xl font-bold text-gray-900">
                                ₹{item.project.pricing?.sale_price || 0}
                              </span>
                              {item.project.pricing &&
                                item.project.pricing.original_price > item.project.pricing.sale_price && (
                                  <span className="text-sm sm:text-lg text-gray-500 line-through">
                                    ₹{item.project.pricing.original_price}
                                  </span>
                                )}
                            </div>
                            {item.project.pricing &&
                              item.project.pricing.original_price > item.project.pricing.sale_price && (
                                <span className="text-xs sm:text-sm text-green-600 font-semibold">
                                  Save ₹{item.project.pricing.original_price - item.project.pricing.sale_price}
                                </span>
                              )}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <Link
                              to={`/project/${item.project.id}`}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-center text-sm sm:text-base"
                            >
                              View Details
                            </Link>
                            <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-200">
                              <Eye className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="animate-slideInUp">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                    My Reviews
                  </h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="text"
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-auto pl-10 pr-3 sm:pr-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <select
                      value={reviewFilterStatus}
                      onChange={(e) => setReviewFilterStatus(e.target.value)}
                      className="px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="all">All Reviews</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading reviews...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Review
                            </th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Project Name
                            </th>
                            <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Rating
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredReviews.map((review, index) => (
                            <tr
                              key={review.id}
                              className="hover:bg-gray-50 transition-colors animate-slideInUp"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <div className="max-w-xs">
                                  <p className="text-xs sm:text-sm text-gray-900 font-medium line-clamp-2">
                                    {review.review_text}
                                  </p>
                                </div>
                              </td>
                              <th className="hidden sm:table-cell px-6 py-4 text-sm text-gray-600 font-medium text-left">
                                {review.project.title}
                              </th>
                              <th className="hidden md:table-cell px-6 py-4 text-left font-normal">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                        }`}
                                    />
                                  ))}
                                  <span className="ml-2 text-xs sm:text-sm font-semibold text-gray-700">
                                    {review.rating}/5
                                  </span>
                                </div>
                              </th>
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <span
                                  className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${review.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                  {review.is_approved ? "Approved" : "Pending"}
                                </span>
                              </td>
                              <th className="hidden lg:table-cell px-6 py-4 text-sm text-gray-600 font-medium text-left">
                                {new Date(review.created_at).toLocaleDateString()}
                              </th>
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <div className="flex space-x-1 sm:space-x-2">
                                  <button
                                    onClick={() => openReviewModal(review)}
                                    className="p-1.5 sm:p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                                    title="View/Edit Review"
                                  >
                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteReview(review.id)}
                                    disabled={updatingReview === review.id}
                                    className="p-1.5 sm:p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                                    title="Delete Review"
                                  >
                                    {updatingReview === review.id ? (
                                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {filteredReviews.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-600">
                                {reviews.length === 0 ? "No reviews found." : "No reviews match your filters."}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="animate-slideInUp">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                    Transactions
                  </h2>
                </div>
                {transactionsLoading ? (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading transactions...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Txn ID
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Project
                            </th>
                            <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Method
                            </th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {transactions.map((txn, index) => (
                            <tr
                              key={txn.id}
                              className="hover:bg-gray-50 transition-colors animate-slideInUp"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-900">
                                {txn.transaction_id}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                                    {txn.project?.thumbnail ? (
                                      <img
                                        src={txn.project.thumbnail || "/placeholder.svg"}
                                        alt={txn.project.title}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                    )}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-gray-900 truncate">
                                      {txn.project?.title || "-"}
                                    </div>
                                    <div className="text-xs text-gray-500 hidden sm:block">{txn.project?.id}</div>
                                  </div>
                                </div>
                              </td>
                              <th className="hidden md:table-cell px-6 py-4 text-xs sm:text-sm text-gray-700 font-semibold text-left">
                                {txn.amount} {txn.currency}
                              </th>
                              <th className="hidden sm:table-cell px-6 py-4 text-xs sm:text-sm text-gray-700 text-left font-normal">
                                {txn.type}
                              </th>
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <span
                                  className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${txn.status === "success" || txn.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : txn.status === "pending"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                    }`}
                                >
                                  {txn.status}
                                </span>
                              </td>
                              <th className="hidden lg:table-cell px-6 py-4 text-xs sm:text-sm text-gray-700 text-left font-normal">
                                {txn.payment_method}
                              </th>
                              <th className="hidden sm:table-cell px-6 py-4 text-xs sm:text-sm text-gray-600 text-left font-normal">
                                {new Date(txn.processed_at || txn.created_at).toLocaleDateString()}
                              </th>
                            </tr>
                          ))}
                          {transactions.length === 0 && (
                            <tr>
                              <td colSpan={7} className="px-6 py-8 text-center text-gray-600">
                                No transactions found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "profile" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 sm:space-y-8"
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-sm sm:text-base text-gray-600">Loading profile...</span>
                  </div>
                )}

                {/* Profile Header */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-8">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Profile Settings</h2>
                      <p className="text-sm sm:text-base text-gray-600">
                        Manage your account information and preferences
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      {isEditingProfile ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={handleSaveProfile}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                          >
                            {isLoading ? (
                              <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            ) : (
                              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                            {isLoading ? "Saving..." : "Save Changes"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={isLoading}
                            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-500 text-white rounded-xl font-semibold hover:bg-gray-600 transition-all duration-200 text-sm"
                          >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                        >
                          <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          avatarPreview ||
                          profileForm.avatar ||
                          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150" ||
                          "/placeholder.svg"
                        }
                        alt="Profile"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover ring-4 ring-blue-100"
                      />
                      {isEditingProfile && (
                        <div className="mt-4 w-full">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files && e.target.files[0]
                              if (!file) return
                              setAvatarFile(file)
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setAvatarPreview(reader.result as string)
                              }
                              reader.readAsDataURL(file)
                            }}
                            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                          {(avatarPreview || profileForm.avatar) && (
                            <div className="flex items-center gap-3 mt-3">
                              <button
                                type="button"
                                onClick={handleAvatarClear}
                                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{user?.full_name}</h2>
                      <p className="text-gray-600 mb-4 text-sm">{user?.email}</p>
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                          <span className="font-semibold">
                            {profileForm.rating ? profileForm.rating.toFixed(1) : "0.0"}/5.0
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                          <span className="font-semibold">{profileForm.total_sales} sales</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                          <span>
                            Joined{" "}
                            {profileForm.created_at
                              ? new Date(profileForm.created_at).toLocaleDateString()
                              : "Recently"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Form */}
                  <div className="mt-8 space-y-6 sm:space-y-8">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                            Bio
                          </label>
                          <textarea
                            rows={4}
                            value={profileForm.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            disabled={!isEditingProfile}
                            placeholder="Tell us about yourself..."
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50"
                          />
                        </div>
                        <div className="space-y-4 sm:space-y-6">
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                              Location
                            </label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="text"
                                value={profileForm.location}
                                onChange={(e) => handleInputChange("location", e.target.value)}
                                disabled={!isEditingProfile}
                                placeholder="Your location"
                                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                              Website
                            </label>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="url"
                                value={profileForm.website}
                                onChange={(e) => handleInputChange("website", e.target.value)}
                                disabled={!isEditingProfile}
                                placeholder="https://yourwebsite.com"
                                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                        Professional Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                            Experience Level
                          </label>
                          <select
                            value={profileForm.experience_level}
                            onChange={(e) => handleInputChange("experience_level", e.target.value)}
                            disabled={!isEditingProfile}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                            <option value="expert">Expert</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                            Account Status
                          </label>
                          <select
                            value={profileForm.status}
                            onChange={(e) => handleInputChange("status", e.target.value)}
                            disabled={!isEditingProfile}
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Skills</h3>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {profileForm.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
                            >
                              {skill}
                              {isEditingProfile && (
                                <button
                                  onClick={() => handleRemoveSkill(index)}
                                  className="text-blue-500 hover:text-blue-700"
                                  type="button"
                                >
                                  <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                        {isEditingProfile && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Add a skill"
                              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  handleAddSkill()
                                }
                              }}
                            />
                            <button
                              onClick={handleAddSkill}
                              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
                              type="button"
                            >
                              Add
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Social Links</h3>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                          <Github className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 mt-2.5 sm:mt-0 flex-shrink-0" />
                          <input
                            type="url"
                            value={profileForm.social_links.github}
                            onChange={(e) => handleSocialLinkChange("github", e.target.value)}
                            disabled={!isEditingProfile}
                            placeholder="https://github.com/username"
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                          <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mt-2.5 sm:mt-0 flex-shrink-0" />
                          <input
                            type="url"
                            value={profileForm.social_links.linkedin}
                            onChange={(e) => handleSocialLinkChange("linkedin", e.target.value)}
                            disabled={!isEditingProfile}
                            placeholder="https://linkedin.com/in/username"
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                          <Twitter className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mt-2.5 sm:mt-0 flex-shrink-0" />
                          <input
                            type="url"
                            value={profileForm.social_links.twitter}
                            onChange={(e) => handleSocialLinkChange("twitter", e.target.value)}
                            disabled={!isEditingProfile}
                            placeholder="https://twitter.com/username"
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Account Statistics</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                        {profileForm.rating || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-blue-700 font-medium">Average Rating</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 sm:p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                        {profileForm.total_sales}
                      </div>
                      <div className="text-xs sm:text-sm text-green-700 font-medium">Total Sales</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 sm:p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                        {profileForm.total_purchases}
                      </div>
                      <div className="text-xs sm:text-sm text-purple-700 font-medium">Total Purchases</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 sm:p-6 text-center">
                      <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">
                        {profileForm.skills.length}
                      </div>
                      <div className="text-xs sm:text-sm text-orange-700 font-medium">Skills</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Review Details Modal */}
      {isReviewModalOpen && (
        <ReviewDetailsModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false)
            setSelectedReview(null)
          }}
          review={selectedReview}
          isAdmin={false}
          onUpdate={handleUpdateReview}
          isUpdating={updatingReview === selectedReview?.id}
        />
      )}

      {/* Project Details Modal */}
      {isProjectModalOpen && (
        <ProjectDetailsModal
          isOpen={isProjectModalOpen}
          onClose={() => {
            setIsProjectModalOpen(false)
            setSelectedProject(null)
          }}
          project={selectedProject}
          canEditAll={true}
          projectEditData={projectEditData}
          onEditDataChange={setProjectEditData}
          projectUpdateData={projectUpdateData}
          onUpdateDataChange={setProjectUpdateData}
          onUpdate={handleUpdateProject}
          onSendForApproval={() => selectedProject && handleSendForApproval(selectedProject)}
          updatingProjectStatus={updatingProjectStatus}
        />
      )}
    </div>
  )
}

export default StudentDashboard
