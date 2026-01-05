import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Star,
  Calendar,
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
  Wallet,
  Settings,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { apiClient } from "../utils/apiClient"
import { getApiUrl } from "../config/api"
import { useWishlist } from "../contexts/WishlistContext"
import { motion } from "framer-motion"
import type { Review, Project } from "../types/Project"
import type { Transaction } from "../types/Transaction"
import ReviewDetailsModal from "../components/ReviewDetailsModal"
import toast from "react-hot-toast"
import LoadingNumber from "../components/LoadingNumber"
import ProjectDetailsModalNew from "../components/ProjectDetailsModalNew"
import ReferralDashboard from "../components/ReferralDashboard"
import ReferralHistory from "../components/ReferralHistory"

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [referralSubTab, setReferralSubTab] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false) // reviews loading
  const [reviews, setReviews] = useState<Review[]>([])
  const [myProjects, setMyProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [purchasedProjects, setPurchasedProjects] = useState<Project[]>([])
  const [purchasedProjectsLoading, setPurchasedProjectsLoading] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsLoading, setTransactionsLoading] = useState(false)
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

  const { wishlist } = useWishlist()

  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const filteredProjects = myProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, isLoading }: any) => (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 dark:border-slate-700/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400 font-medium mb-1">{title}</p>
          <LoadingNumber
            value={value}
            isLoading={isLoading}
            className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
          />
          <p className={`text-sm font-semibold ${color}`}>{subtitle}</p>
        </div>
        <div
          className={`w-14 h-14 bg-gradient-to-br ${color.replace("text-", "from-").replace("-600", "-500")} to-${color.split("-")[1]}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      {trend && !isLoading && (
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
      const res = await apiClient(getApiUrl("/reviews/my"), {
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
      const res = await apiClient(getApiUrl(`/projects/my`), {
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
      const res = await apiClient(getApiUrl("/transactions/my"), {
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
      const res = await apiClient(getApiUrl("/dashboard/stats"), {
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
      const res = await apiClient(getApiUrl(`/projects/${selectedProject.id}`), {
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
      const res = await apiClient(getApiUrl(`/projects/${project.id}`), {
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
      toast.error("Failed to send for approval.")
    } finally {
      setUpdatingProjectId(null)
    }
  }


  const handleUpdateReview = async (reviewId: string, updatedReview: { review_text: string; rating: number }) => {
    setUpdatingReview(reviewId)
    const token = localStorage.getItem("token")
    try {
      const response = await apiClient(getApiUrl(`/reviews/${reviewId}`), {
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
      toast.error("Failed to update review. Please try again.")
    } finally {
      setUpdatingReview(null)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    setUpdatingReview(reviewId)
    const token = localStorage.getItem("token")
    try {
      const response = await apiClient(getApiUrl(`/reviews/${reviewId}`), {
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
    // Fetch dashboard stats on mount to get profile data
    if (!dashboardStats && !statsLoading) {
      fetchDashboardStats()
    }
    
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
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors">
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
                    dashboardStats?.profile?.avatar ||
                    user?.avatar ||
                    "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80"
                  }
                  alt={dashboardStats?.profile?.full_name || user?.full_name || "User"}
                  className="w-16 sm:w-20 h-16 sm:h-20 rounded-full object-cover ring-4 ring-white/30"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-bold capitalize">
                  {dashboardStats?.profile?.experience_level || "Beginner"}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                  Welcome back, {dashboardStats?.profile?.full_name || user?.full_name || "User"}!
                </h1>
                <p className="text-blue-100 text-sm sm:text-lg">{dashboardStats?.profile?.email || user?.email}</p>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-4 mt-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>
                      Member since{" "}
                      {dashboardStats?.profile?.created_at
                        ? new Date(dashboardStats.profile.created_at).toLocaleDateString()
                        : user?.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "Recently"}
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
            isLoading={statsLoading}
          />
          <StatCard
            title="Total Purchases"
            value={dashboardStats?.user_performance?.total_purchases || 0}
            subtitle={`${dashboardStats?.monthly_activity?.new_projects_purchased || 0} this month`}
            icon={Award}
            color="text-green-600"
            isLoading={statsLoading}
          />
          <StatCard
            title="Wishlist Items"
            value={dashboardStats?.user_performance?.wishlist_items || wishlist.length}
            subtitle="Ready to buy"
            icon={Heart}
            color="text-pink-600"
            isLoading={statsLoading}
          />
          <StatCard
            title="Avg Rating"
            value={dashboardStats?.user_performance?.average_rating?.toFixed(1) || "0.0"}
            subtitle="Overall rating"
            icon={Star}
            color="text-yellow-600"
            isLoading={statsLoading}
          />
        </div>

        {/* Tabs */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 dark:border-slate-700/30 mb-8 transition-colors">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto sm:overflow-visible sm:overflow-y-hidden space-x-2 sm:space-x-8 px-4 sm:px-8 -mx-4 sm:mx-0">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "my-projects", label: "My Uploads", icon: ShoppingBag },
                { id: "purchased-projects", label: "My Purchases", icon: ShoppingBag },
                { id: "referrals", label: "Referrals", icon: Award },
                { id: "payouts", label: "Payouts", icon: Wallet },
                { id: "reviews", label: "Reviews", icon: Trophy },
                { id: "transactions", label: "Payments", icon: Clock },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 sm:gap-3 py-3 sm:py-6 px-3 sm:px-2 border-b-2 font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-300 ${activeTab === tab.id
                    ? "border-blue-500 text-blue-600 scale-105"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 dark:text-gray-300 hover:scale-105"
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
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">Dashboard Overview</h2>

                <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
                  {/* Left section (main overview cards) */}
                  <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                    {/* USER PERFORMANCE */}
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-900 dark:to-slate-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-lg">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                        <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                        User Performance
                      </h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Projects Owned</p>
                          <LoadingNumber
                            value={dashboardStats?.user_performance?.projects_owned || 0}
                            isLoading={statsLoading}
                            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Purchases</p>
                          <LoadingNumber
                            value={dashboardStats?.user_performance?.total_purchases || 0}
                            isLoading={statsLoading}
                            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Wishlist</p>
                          <LoadingNumber
                            value={dashboardStats?.user_performance?.wishlist_items || 0}
                            isLoading={statsLoading}
                            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100"
                          />
                        </div>
                        <div>
                          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Avg. Rating</p>
                          <LoadingNumber
                            value={dashboardStats?.user_performance?.average_rating || 0}
                            isLoading={statsLoading}
                            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* MONTHLY ACTIVITY */}
                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl p-6 sm:p-8 border border-blue-100 dark:border-slate-700 shadow-lg">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                        <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                        Monthly Activity
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center">
                        <div>
                          <p className="text-blue-700 text-xs sm:text-sm">New Projects</p>
                          <LoadingNumber
                            value={dashboardStats?.monthly_activity?.new_projects_created || 0}
                            isLoading={statsLoading}
                            className="text-xl sm:text-2xl font-bold text-blue-900"
                          />
                        </div>
                        <div>
                          <p className="text-blue-700 text-xs sm:text-sm">Downloads</p>
                          <LoadingNumber
                            value={dashboardStats?.monthly_activity?.downloads_received || 0}
                            isLoading={statsLoading}
                            className="text-xl sm:text-2xl font-bold text-blue-900"
                          />
                        </div>
                        <div>
                          <p className="text-blue-700 text-xs sm:text-sm">Purchases</p>
                          <LoadingNumber
                            value={dashboardStats?.monthly_activity?.new_projects_purchased || 0}
                            isLoading={statsLoading}
                            className="text-xl sm:text-2xl font-bold text-blue-900"
                          />
                        </div>
                      </div>
                    </div>

                    {/* REVENUE & FINANCIAL */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 sm:p-8 border border-green-100 dark:border-slate-700 shadow-lg">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
                        <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                        Revenue & Financial
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-center">
                        <div>
                          <p className="text-green-700 text-xs sm:text-sm">Total Revenue</p>
                          <LoadingNumber
                            value={`₹${dashboardStats?.revenue_financial?.total_revenue_earned || 0}`}
                            isLoading={statsLoading}
                            className="text-xl sm:text-2xl font-bold text-green-900"
                          />
                        </div>
                        <div>
                          <p className="text-green-700 text-xs sm:text-sm">Avg. Sale Price</p>
                          <LoadingNumber
                            value={`₹${dashboardStats?.revenue_financial?.average_sale_price || 0}`}
                            isLoading={statsLoading}
                            className="text-xl sm:text-2xl font-bold text-green-900"
                          />
                        </div>
                        <div>
                          <p className="text-green-700 text-xs sm:text-sm">Revenue Trend</p>
                          <LoadingNumber
                            value={dashboardStats?.revenue_financial?.monthly_revenue_trend?.[0]?.month || "N/A"}
                            isLoading={statsLoading}
                            className="text-xs sm:text-sm text-green-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right side (secondary cards) */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* PROJECT PERFORMANCE */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 sm:p-6 border border-purple-100 dark:border-slate-700 shadow-lg">
                      <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-700 dark:text-purple-400" />
                        Project Performance
                      </h4>
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <p>
                          <span className="font-semibold">Best Project:</span>{" "}
                          <LoadingNumber
                            value={dashboardStats?.project_performance?.best_performing_project?.title || "N/A"}
                            isLoading={statsLoading}
                            className="inline"
                          />
                        </p>
                        <p>
                          <span className="font-semibold">Total Sales:</span>{" "}
                          <LoadingNumber
                            value={dashboardStats?.project_performance?.best_performing_project?.total_sales || 0}
                            isLoading={statsLoading}
                            className="inline"
                          />
                        </p>
                        <p>
                          <span className="font-semibold">Downloads:</span>{" "}
                          <LoadingNumber
                            value={dashboardStats?.project_performance?.best_performing_project?.total_downloads || 0}
                            isLoading={statsLoading}
                            className="inline"
                          />
                        </p>
                        <p>
                          <span className="font-semibold">Views:</span>{" "}
                          <LoadingNumber
                            value={dashboardStats?.project_performance?.best_performing_project?.total_views || 0}
                            isLoading={statsLoading}
                            className="inline"
                          />
                        </p>
                      </div>
                    </div>

                    {/* ENGAGEMENT METRICS */}
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 sm:p-6 border border-yellow-100 dark:border-slate-700 shadow-lg">
                      <h4 className="font-bold text-yellow-900 dark:text-yellow-300 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 dark:text-yellow-400" />
                        Engagement Metrics
                      </h4>
                      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                        <p>
                          <span className="font-semibold">Total Views:</span>{" "}
                          <LoadingNumber
                            value={dashboardStats?.engagement_metrics?.total_project_views || 0}
                            isLoading={statsLoading}
                            className="inline"
                          />
                        </p>
                        <p>
                          <span className="font-semibold">Wishlist → Purchase %:</span>{" "}
                          <LoadingNumber
                            value={`${dashboardStats?.engagement_metrics?.wishlist_to_purchase_conversion || 0}%`}
                            isLoading={statsLoading}
                            className="inline"
                          />
                        </p>
                        <p>
                          <span className="font-semibold">Positive Reviews:</span>{" "}
                          <LoadingNumber
                            value={`${dashboardStats?.engagement_metrics?.positive_review_percentage || 0}%`}
                            isLoading={statsLoading}
                            className="inline"
                          />
                        </p>
                        <p>
                          <span className="font-semibold">Repeat Customers:</span>{" "}
                          <LoadingNumber
                            value={`${dashboardStats?.engagement_metrics?.repeat_customer_count || 0} (${dashboardStats?.engagement_metrics?.repeat_customer_percentage || 0}%)`}
                            isLoading={statsLoading}
                            className="inline"
                          />
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
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">My Projects</h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-auto pl-10 pr-3 sm:pr-4 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="all" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">All Status</option>
                      <option value="completed" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Completed</option>
                      <option value="in-progress" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">In Progress</option>
                    </select>
                  </div>
                </div>
                {projectsLoading ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading projects...</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Title
                            </th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Created
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                          {filteredProjects.map((project, index) => (
                            <tr
                              key={project.id}
                              className="hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 transition-colors animate-slideInUp"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <div className="font-semibold text-gray-900 dark:text-white text-xs sm:text-base">{project.title}</div>
                              </td>
                              <th className="hidden sm:table-cell px-6 py-4 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-300 text-left font-normal">
                                {project.category}
                              </th>
                              <th className="hidden md:table-cell px-6 py-4 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-300 font-semibold text-left">
                                ₹{project.pricing?.sale_price || 0}
                              </th>
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <span
                                  className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${project.status === "approved" ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : project.status === "pending_review" || project.status === "draft" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400" : "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-300"}`}
                                >
                                  {project.status}
                                </span>
                              </td>
                              <th className="hidden lg:table-cell px-6 py-4 text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400 text-left font-normal">
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
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
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
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Purchases</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search purchased projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="all" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">All Status</option>
                      <option value="completed" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Completed</option>
                      <option value="in-progress" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">In Progress</option>
                    </select>
                  </div>
                </div>

                {purchasedProjectsLoading ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading purchased projects...</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">Purchased On</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                          {purchasedProjects.map((project, index) => (
                            <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 transition-colors animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-gray-900 dark:text-gray-100">{project.title}</div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{project.category}</td>
                              <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 dark:text-gray-300 font-semibold">₹{project.pricing?.sale_price || 0}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${project.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' :
                                  project.status === 'in-progress' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400' :
                                    'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-300'
                                  }`}>
                                  {project.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{new Date(project.created_at).toLocaleDateString()}</td>
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
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">No purchased projects found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "referrals" && (
              <div className="animate-slideInUp">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Award className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                    Referral System
                  </h2>
                </div>

                {/* Sub-tabs for Referrals */}
                <div className="mb-6">
                  <div className="flex gap-2 border-b border-gray-200 dark:border-slate-700">
                    <button
                      onClick={() => setReferralSubTab("dashboard")}
                      className={`px-4 py-2 font-semibold text-sm transition-all duration-200 border-b-2 ${
                        referralSubTab === "dashboard"
                          ? "border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setReferralSubTab("history")}
                      className={`px-4 py-2 font-semibold text-sm transition-all duration-200 border-b-2 ${
                        referralSubTab === "history"
                          ? "border-blue-500 text-blue-600 dark:text-blue-400"
                          : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      History
                    </button>
                  </div>
                </div>

                {/* Render sub-tab content */}
                {referralSubTab === "dashboard" && <ReferralDashboard />}
                {referralSubTab === "history" && <ReferralHistory />}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="animate-slideInUp">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
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
                        className="w-full sm:w-auto pl-10 pr-3 sm:pr-4 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                      />
                    </div>
                    <select
                      value={reviewFilterStatus}
                      onChange={(e) => setReviewFilterStatus(e.target.value)}
                      className="px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100"
                    >
                      <option value="all" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">All Reviews</option>
                      <option value="approved" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Approved</option>
                      <option value="pending" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Pending</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reviews...</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Review
                            </th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Project Name
                            </th>
                            <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Rating
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                          {filteredReviews.map((review, index) => (
                            <tr
                              key={review.id}
                              className="hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 transition-colors animate-slideInUp"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <div className="max-w-xs">
                                  <p className="text-xs sm:text-sm text-gray-900 dark:text-white font-medium line-clamp-2">
                                    {review.review_text}
                                  </p>
                                </div>
                              </td>
                              <th className="hidden sm:table-cell px-6 py-4 text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400 font-medium text-left">
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
                                  <span className="ml-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
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
                              <th className="hidden lg:table-cell px-6 py-4 text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400 font-medium text-left">
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
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
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
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                    Transactions
                  </h2>
                </div>
                {transactionsLoading ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading transactions...</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs sm:text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Txn ID
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Project
                            </th>
                            <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="hidden lg:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Method
                            </th>
                            <th className="hidden sm:table-cell px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 dark:text-gray-400 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                          {transactions.map((txn, index) => (
                            <tr
                              key={txn.id}
                              className="hover:bg-gray-50 dark:hover:bg-slate-700 dark:bg-slate-900 transition-colors animate-slideInUp"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {txn.transaction_id}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-slate-800 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
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
                                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                                      {txn.project?.title || "-"}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{txn.project?.id}</div>
                                  </div>
                                </div>
                              </td>
                              <th className="hidden md:table-cell px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 dark:text-gray-300 font-semibold text-left">
                                {txn.amount} {txn.currency}
                              </th>
                              <th className="hidden sm:table-cell px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 dark:text-gray-300 text-left font-normal">
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
                              <th className="hidden lg:table-cell px-6 py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 dark:text-gray-300 text-left font-normal">
                                {txn.payment_method}
                              </th>
                              <th className="hidden sm:table-cell px-6 py-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400 text-left font-normal">
                                {new Date(txn.processed_at || txn.created_at).toLocaleDateString()}
                              </th>
                            </tr>
                          ))}
                          {transactions.length === 0 && (
                            <tr>
                              <td colSpan={7} className="px-6 py-8 text-center text-gray-600 dark:text-gray-400">
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

            {activeTab === "payouts" && (
              <div className="animate-slideInUp">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <Wallet className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                    Payout Management
                  </h2>
                </div>

                <div className="grid gap-6 sm:gap-8">
                  {/* Quick Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link
                      to="/payouts/balance"
                      className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <DollarSign className="w-8 h-8" />
                        <TrendingUp className="w-5 h-5 opacity-70" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Balance & Earnings</h3>
                      <p className="text-sm text-blue-100">View your available balance and request payouts</p>
                    </Link>

                    <Link
                      to="/payouts/methods"
                      className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Wallet className="w-8 h-8" />
                        <Settings className="w-5 h-5 opacity-70" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Payment Methods</h3>
                      <p className="text-sm text-purple-100">Manage your UPI and bank account details</p>
                    </Link>

                    <Link
                      to="/payouts/history"
                      className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Clock className="w-8 h-8" />
                        <Activity className="w-5 h-5 opacity-70" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Payout History</h3>
                      <p className="text-sm text-teal-100">Track all your payout requests and status</p>
                    </Link>
                  </div>

                  {/* Info Card */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Getting Started with Payouts</h3>
                        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">1.</span>
                            <span>Add your payment method (UPI or Bank Account)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">2.</span>
                            <span>Check your available balance from project sales</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">3.</span>
                            <span>Request a payout when you reach the minimum amount (₹100)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">4.</span>
                            <span>Verify your payout via email link</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">5.</span>
                            <span>Track your payout status in the history section</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
        <ProjectDetailsModalNew
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
