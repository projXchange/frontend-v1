import { useEffect, useState } from "react"
import {
  Plus,
  Trash2,
  Eye,
  Check,
  X,
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Star,
  Activity,
  Target,
  Search,
  Bell,
  Settings,
  MessageSquare,
  Wallet,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import type { User, UsersApiResponse } from "../types/User"
import type { Project, ProjectResponse, Review } from "../types/Project"
import UserDetailsModal from "../components/UserDetailsModal"
import { useNavigate } from "react-router-dom"
import type { Transaction, TransactionsApiResponse } from "../types/Transaction"
import toast from "react-hot-toast"
import TransactionDetailsModal from "../components/TransactionDetailsModal"
import ReviewDetailsModal from "../components/ReviewDetailsModal"
import LoadingNumber from "../components/LoadingNumber"
import { apiClient } from "../utils/apiClient"
import { getApiUrl } from "../config/api"
import ProjectDetailsModalNew from "../components/ProjectDetailsModalNew"
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [updatingProject, setUpdatingProject] = useState<string | null>(null)
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [fetchingUserDetails, setFetchingUserDetails] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
  const navigate = useNavigate()
  const [projectUpdateData, setProjectUpdateData] = useState({
    status: "",
    is_featured: false,
  })
  const [updatingProjectStatus, setUpdatingProjectStatus] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]) // new state
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewSearchTerm, setReviewSearchTerm] = useState("")
  const [reviewFilterStatus, setReviewFilterStatus] = useState("all")
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [updatingTransaction, setUpdatingTransaction] = useState<string | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [selectedReview, setSelectedReview] = useState<Review | null>(null)
  const [updatingReview, setUpdatingReview] = useState<string | null>(null)
  const [deletingReview, setDeletingReview] = useState<string | null>(null)
  const [adminDashboardStats, setAdminDashboardStats] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const fetchAdminDashboardStats = async () => {
    setStatsLoading(true)
    const token = localStorage.getItem("token")
    try {
      const res = await apiClient(getApiUrl("/admin/dashboard/stats"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch admin dashboard stats")
      const data = await res.json()
      setAdminDashboardStats(data)
    } catch (err) {
      console.error(err)
      setAdminDashboardStats(null)
    } finally {
      setStatsLoading(false)
    }
  }

  const fetchAllStats = async () => {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("token")

    try {
      // Fetch in parallel for efficiency
      const [usersRes, projectsRes, transactionsRes, pendingProjectsRes] = await Promise.all([
        apiClient(getApiUrl("/admin/users"), {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }),
        apiClient(getApiUrl("/projects"), {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }),
        apiClient(getApiUrl("/admin/transactions/recent"), {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }),
        apiClient(getApiUrl("/projects?status=pending"), {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        }),
      ])

      if (!usersRes.ok || !projectsRes.ok || !transactionsRes.ok || !pendingProjectsRes.ok) {
        throw new Error("Failed to fetch one or more resources")
      }

      // Parse JSON in parallel
      const [usersData, projectsData, transactionsData, pendingProjectsData] = await Promise.all([
        usersRes.json(),
        projectsRes.json(),
        transactionsRes.json(),
        pendingProjectsRes.json(),
      ])

      setUsers(usersData.users)
      setProjects(projectsData.data || [])
      setTransactions(transactionsData.transactions)
      setPendingProjects(pendingProjectsData.data || []) // ✅ store pending projects
    } catch (err) {
      console.error(err)
      setError("Could not load dashboard stats. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const salesData = adminDashboardStats?.stats?.monthly_performance || [
    { month: "Jan", revenue: 1200, projects_created: 15, new_users: 45 },
    { month: "Feb", revenue: 1800, projects_created: 22, new_users: 67 },
    { month: "Mar", revenue: 2200, projects_created: 28, new_users: 89 },
    { month: "Apr", revenue: 1900, projects_created: 24, new_users: 102 },
    { month: "May", revenue: 2540, projects_created: 32, new_users: 134 },
    { month: "Jun", revenue: 2800, projects_created: 35, new_users: 156 },
  ]

  const recentActivity = (adminDashboardStats?.stats?.recent_activity && adminDashboardStats.stats.recent_activity.length > 0)
    ? adminDashboardStats.stats.recent_activity.map((activity: any) => ({
      id: activity.id,
      action: activity.type === "project_submitted" ? "New project submitted" :
        activity.type === "project_approved" ? "Project approved" :
          activity.type === "user_registered" ? "New user registered" :
            activity.type === "payment_processed" ? "Payment processed" : "Activity",
      user: activity.user_name || "Unknown User",
      time: new Date(activity.timestamp).toLocaleString(),
      type: activity.type?.includes("project") ? "project" :
        activity.type?.includes("user") ? "user" :
          activity.type?.includes("payment") ? "payment" : "other",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100",
      status: activity.status || "completed",
    }))
    : [
      {
        id: "1",
        action: "New project submitted",
        user: "John Doe",
        time: "2 hours ago",
        type: "project",
        avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100",
        status: "pending",
      },
      {
        id: "2",
        action: "Project approved",
        user: "Sarah Wilson",
        time: "5 hours ago",
        type: "approval",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
        status: "approved",
      },
      {
        id: "3",
        action: "New user registered",
        user: "Mike Johnson",
        time: "1 day ago",
        type: "user",
        avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100",
        status: "active",
      },
      {
        id: "4",
        action: "Payment processed",
        user: "Emma Davis",
        time: "2 days ago",
        type: "payment",
        avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100",
        status: "completed",
      },
      {
        id: "5",
        action: "Project rejected",
        user: "Alex Brown",
        time: "3 days ago",
        type: "rejection",
        avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100",
        status: "rejected",
      },
    ]

  const stats = {
    totalProjects: adminDashboardStats?.stats?.platform_overview?.total_projects || projects.length,
    pendingApproval: adminDashboardStats?.stats?.platform_overview?.pending_approval_count || pendingProjects.length,
    totalSales: adminDashboardStats?.stats?.platform_overview?.total_sales || transactions.length,
    totalUsers: adminDashboardStats?.stats?.platform_overview?.total_users || users.length,
    monthlyGrowth: adminDashboardStats?.stats?.platform_overview?.revenue_growth_percentage || 24,
    avgRating: 4.8, // placeholder for now
    activeUsers: adminDashboardStats?.stats?.platform_overview?.active_users_24h || users.filter((u) => u.verification_status === "active").length,
    revenue: adminDashboardStats?.stats?.platform_overview?.monthly_revenue ? parseFloat(adminDashboardStats.stats.platform_overview.monthly_revenue) : transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0),
    conversionRate: adminDashboardStats?.stats?.business_metrics?.conversion_rate || 3.2,
  }

  const fetchUsers = async () => {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("token")
    try {
      const res = await apiClient(getApiUrl("/admin/users"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch users")

      const data: UsersApiResponse = await res.json()
      setUsers(data.users)
    } catch (err) {
      console.error(err)
      setError("Could not load users. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchProjects = async () => {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("token")
    try {
      const res = await apiClient(getApiUrl("/projects"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch projects")

      const data: ProjectResponse = await res.json()
      setProjects(data.data || [])
    } catch (err) {
      console.error(err)
      setError("Could not load projects. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingProjects = async () => {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("token")
    try {
      const res = await apiClient(getApiUrl("/projects?status=pending"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch pending projects")

      const data: ProjectResponse = await res.json()
      setPendingProjects(data.data || [])
    } catch (err) {
      console.error(err)
      setError("Could not load pending projects. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // API function to update project status
  const updateProjectStatus = async (projectId: string, status: string, isFeatured: boolean) => {
    setUpdatingProject(projectId)
    const token = localStorage.getItem("token")
    try {
      const response = await apiClient(getApiUrl(`/admin/projects/${projectId}/status`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: status,
          is_featured: isFeatured,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update project status")
      }

      // Update the project in the local state
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === projectId ? { ...project, status, is_featured: isFeatured } : project,
        ),
      )

      toast.success(
        `Project ${status === "approved" ? "approved" : status === "suspended" ? "suspended" : "updated"} successfully!`,
      )
    } catch (error) {
      console.error("Error updating project status:", error)
      toast.error("Failed to update project status. Please try again.")
    } finally {
      setUpdatingProject(null)
    }
  }

  // API function to update user status
  const updateUserStatus = async (userId: string, verificationStatus: string, emailVerified: boolean) => {
    setUpdatingUser(userId)
    const token = localStorage.getItem("token")
    try {
      const response = await apiClient(getApiUrl(`/admin/users/${userId}/status`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          verification_status: verificationStatus,
          email_verified: emailVerified,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || "Failed to update user status")
      }

      // Update the user in the local state
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? { ...user, verification_status: verificationStatus } : user)),
      )
      toast.success(`User status updated successfully!`)
      setIsUserModalOpen(false)
    } catch (error) {
      console.error("Error updating user status:", error)
      toast.error(`Failed to update user status: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setUpdatingUser(null)
    }
  }

  // API function to delete user
  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    const token = localStorage.getItem("token")
    try {
      const response = await apiClient(getApiUrl(`/admin/users/${userId}`), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      // Remove the user from the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId))

      toast.success("User deleted successfully!")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast.error("Failed to delete user. Please try again.")
    }
  }

  // API function to fetch user details
  const fetchUserDetails = async (userId: string) => {
    setFetchingUserDetails(userId)
    const token = localStorage.getItem("token")
    try {
      const response = await apiClient(getApiUrl(`/admin/users/${userId}`), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user details")
      }

      const data = await response.json()
      setSelectedUser(data.user)
      setIsUserModalOpen(true)
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast.error("Failed to fetch user details. Please try again.")
    } finally {
      setFetchingUserDetails(null)
    }
  }

  const openProjectModal = (project: Project) => {
    setSelectedProject(project)
    setProjectUpdateData({
      status: project.status,
      is_featured: project.is_featured,
    })
    setIsProjectModalOpen(true)
  }

  const fetchTransactions = async () => {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("token")
    try {
      const res = await apiClient(getApiUrl("/admin/transactions/recent"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch transactions")

      const data: TransactionsApiResponse = await res.json()
      setTransactions(data.transactions)
    } catch (err) {
      console.error(err)
      setError("Could not load transactions. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateTransactionStatus = async (
    transactionId: string,
    status: string,
    paymentGatewayResponse?: string,
    metadata?: string,
  ) => {
    setUpdatingTransaction(transactionId)
    const token = localStorage.getItem("token")
    try {
      const requestBody: {
        status: string
        payment_gateway_response?: string
        metadata?: string
      } = { status }
      if (paymentGatewayResponse) requestBody.payment_gateway_response = paymentGatewayResponse
      if (metadata) requestBody.metadata = metadata

      const response = await apiClient(
        getApiUrl(`/admin/transactions/${transactionId}/status`),
        {
          method: "PATCH", // or PATCH depending on your API
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Replace with your auth token
          },
          body: JSON.stringify(requestBody),
        },
      )

      if (!response.ok) {
        throw new Error("Failed to update transaction status")
      }

      const updatedTransaction = await response.json()

      // Update the transaction in your transactions array
      setTransactions((prev) => prev.map((tx) => (tx.id === transactionId ? { ...tx, ...updatedTransaction } : tx)))

      // Update the selected transaction if it's the one being updated
      if (selectedTransaction?.id === transactionId) {
        setSelectedTransaction((prev) => (prev ? { ...prev, ...updatedTransaction } : null))
      }

      // Show success message
      toast.success("Transaction updated successfully")
    } catch (error) {
      console.error("Error updating transaction:", error)
      toast.error("Failed to update transaction status")
    } finally {
      setUpdatingTransaction(null)
    }
  }

  const fetchReviews = async () => {
    setLoading(true)
    setError("")
    const token = localStorage.getItem("token")
    try {
      const res = await apiClient(getApiUrl("/admin/reviews"), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Failed to fetch reviews")

      const data = await res.json()
      setReviews(data.reviews || [])
    } catch (err) {
      console.error(err)
      setError("Could not load reviews. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleReviewAction = async (reviewIds: string[], isApproved: boolean) => {
    setUpdatingReview(reviewIds[0])
    const token = localStorage.getItem("token")

    try {
      const response = await apiClient(getApiUrl(`/admin/reviews/approve`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          review_ids: reviewIds,
          is_approved: isApproved,
        }),
      })

      if (response.ok) {
        setReviews((prev) =>
          prev.map((review) => (reviewIds.includes(review.id) ? { ...review, is_approved: isApproved } : review)),
        )

        toast.success(`Review${reviewIds.length > 1 ? "s" : ""} ${isApproved ? "approved" : "rejected"} successfully!`)

        setIsReviewModalOpen(false)
      } else {
        throw new Error(`Failed to ${isApproved ? "approve" : "reject"} review(s)`)
      }
    } catch (error) {
      console.error(`Error ${isApproved ? "approving" : "rejecting"} reviews:`, error)
      toast.error(`Failed to ${isApproved ? "approve" : "reject"} review(s). Please try again.`)
    } finally {
      setUpdatingReview(null)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    setDeletingReview(reviewId)
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
      setDeletingReview(null)
    }
  }

  const openReviewModal = (review: Review) => {
    setSelectedReview(review)
    setIsReviewModalOpen(true)
  }

  const handleProjectStatusUpdate = async () => {
    if (!selectedProject) return

    setUpdatingProjectStatus(true)
    const token = localStorage.getItem("token")

    // Check if token exists
    if (!token) {
      toast.error("Authentication token not found. Please login again.")
      setUpdatingProjectStatus(false)
      return
    }
    // Check if project ID is valid
    if (!selectedProject.id || selectedProject.id.trim() === "") {
      toast.error("Invalid project ID")
      setUpdatingProjectStatus(false)
      return
    }

    try {
      const requestBody = {
        status: projectUpdateData.status,
        is_featured: projectUpdateData.is_featured,
      }

      const response = await apiClient(
        getApiUrl(`/admin/projects/${selectedProject.id}/status`),
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Error response:", errorText)
        throw new Error(`Failed to update project status: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      // Update the project in the local state
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.id === selectedProject.id
            ? { ...project, status: data.project.status, is_featured: data.project.is_featured }
            : project,
        ),
      )

      toast.success("Project status updated successfully!")
      setIsProjectModalOpen(false)
      setSelectedProject(null)

      // Refresh the projects list
      if (activeTab === "approval") {
        fetchPendingProjects()
      } else if (activeTab === "projects") {
        fetchProjects()
      }
    } catch (error) {
      console.error("Error updating project status:", error)
      toast.error("Failed to update project status. Please try again.")
    } finally {
      setUpdatingProjectStatus(false)
    }
  }

  const handleReject = (id: string) => {
    updateProjectStatus(id, "suspended", false)
  }

  const handleDelete = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project and its dump? This action cannot be undone.")) {
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("You are not authorized. Please log in again.")
      return
    }

    try {
      const projectResponse = await apiClient(getApiUrl(`/projects/${projectId}`), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!projectResponse.ok) {
        throw new Error("Failed to delete project")
      }

      // Update state if needed
      setProjects?.((prev: Project[]) => prev.filter((p) => p.id !== projectId))

      toast.success("Project and its dump deleted successfully!")
    } catch (error) {
      console.error("Error deleting project:", error)
      toast.error("Failed to delete project. Please try again.")
    }
  }

  const handleToggleFeatured = (id: string, currentFeatured: boolean) => {
    const project = projects.find((p) => p.id === id)
    if (project) {
      updateProjectStatus(id, project.status, !currentFeatured)
    }
  }

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    trend,
    onClick,
    isLoading
  }: {
    title: string
    value: string | number
    subtitle: string
    icon: React.ElementType
    color: string
    trend?: string
    onClick?: () => void
    isLoading?: boolean
  }) => (
    <div
      className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mb-1">{title}</p>
          <LoadingNumber
            value={value}
            isLoading={isLoading}
            className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1"
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
  // fetchAllStats will load everything once when dashboard mounts
  useEffect(() => {
    fetchAdminDashboardStats()
    fetchAllStats()
  }, [])

  // tab-specific fetching (only when you want fresh detail view)
  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers()
    } else if (activeTab === "projects") {
      fetchProjects()
    } else if (activeTab === "approval") {
      fetchPendingProjects()
    } else if (activeTab === "transactions") {
      fetchTransactions()
    } else if (activeTab === "reviews") {
      fetchReviews()
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4">
            <div className="animate-slideInLeft w-full sm:w-auto">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-3">Admin Dashboard</h1>
              <p className="text-blue-100 text-sm sm:text-lg mb-4">
                Welcome back, {adminDashboardStats?.profile?.full_name || user?.full_name}! Manage your platform with ease.
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-300" />
                  <span className="text-xs sm:text-sm">
                    System Status: {adminDashboardStats?.stats?.platform_overview?.system_status === "healthy" ? "Healthy" : "Healthy"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-300" />
                  <span className="text-xs sm:text-sm">
                    <LoadingNumber
                      value={`${stats.activeUsers} Active Users`}
                      isLoading={statsLoading || loading}
                      className="inline"
                    />
                  </span>
                </div>
              </div>
            </div>
            <div className="text-left sm:text-right w-full sm:w-auto animate-slideInRight">
              <LoadingNumber
                value={`₹${stats.revenue.toLocaleString()}`}
                isLoading={statsLoading || loading}
                className="text-2xl sm:text-3xl font-bold"
              />
              <div className="text-blue-200 text-xs sm:text-sm">Monthly Revenue</div>
              {!statsLoading && !loading && (
                <div className="text-xs sm:text-sm text-green-300 font-semibold mt-1">+{stats.monthlyGrowth}% growth</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:-mt-16 relative z-10">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            subtitle="+12% this month"
            icon={ShoppingBag}
            color="text-blue-600"
            trend="+5 new projects"
            onClick={() => setActiveTab("projects")}
            isLoading={statsLoading || loading}
          />
          <StatCard
            title="Pending Approval"
            value={stats.pendingApproval}
            subtitle="Needs attention"
            icon={AlertCircle}
            color="text-orange-600"
            onClick={() => setActiveTab("approval")}
            isLoading={statsLoading || loading}
          />
          <StatCard
            title="Total Sales"
            value={`${stats.totalSales}`}
            subtitle="+18% this month"
            icon={DollarSign}
            color="text-green-600"
            trend="+450 today"
            onClick={() => setActiveTab("transactions")}
            isLoading={statsLoading || loading}
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            subtitle="+24% this month"
            icon={Users}
            color="text-purple-600"
            trend="+12 new users"
            onClick={() => setActiveTab("users")}
            isLoading={statsLoading || loading}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 shadow-xl border border-white/30 mb-8 animate-slideInUp">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100">Quick Actions</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => navigate("/upload")}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base whitespace-nowrap">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </button>
              <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 sm:px-4 py-2 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm sm:text-base whitespace-nowrap">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 overflow-hidden">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-8 min-w-max sm:min-w-0">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "analytics", label: "Analytics", icon: TrendingUp },
                { id: "projects", label: "Projects", icon: ShoppingBag },
                { id: "users", label: "Users", icon: Users },
                { id: "approval", label: "Pending", icon: AlertCircle },
                { id: "transactions", label: "Transactions", icon: DollarSign },
                { id: "reviews", label: "Reviews", icon: MessageSquare },
                { id: "payouts", label: "Payouts", icon: Wallet },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 sm:gap-3 py-4 sm:py-6 px-2 border-b-2 font-semibold text-xs sm:text-sm transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                    ? "border-blue-500 text-blue-600 scale-105"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-300 hover:scale-105"
                    }`}
                >
                  <tab.icon className="w-4 sm:w-5 h-4 sm:h-5" />
                  {tab.label}
                  {tab.id === "approval" && stats.pendingApproval > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse ml-1">
                      {stats.pendingApproval}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-8">
            {activeTab === "overview" && (
              <div className="animate-slideInUp">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">Platform Overview</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-lg transition-colors">
                      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 flex items-center gap-3 text-gray-900 dark:text-gray-100">
                        <Activity className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600 dark:text-blue-400" />
                        Recent Activity
                      </h3>
                      <div className="space-y-3 sm:space-y-4">
                        {recentActivity.map((activity: any, index: number) => (
                          <div
                            key={activity.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all duration-300 animate-slideInUp"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                              <img
                                src={activity.avatar || "/placeholder.svg"}
                                alt={activity.user}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-blue-100 flex-shrink-0"
                              />
                              <div
                                className={`w-3 h-3 rounded-full flex-shrink-0 ${activity.type === "project"
                                  ? "bg-blue-500"
                                  : activity.type === "approval"
                                    ? "bg-green-500"
                                    : activity.type === "user"
                                      ? "bg-purple-500"
                                      : activity.type === "payment"
                                        ? "bg-yellow-500"
                                        : "bg-red-500"
                                  }`}
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm sm:text-base truncate block">
                                  {activity.action}
                                </span>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">by {activity.user}</div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium block">
                                {activity.time}
                              </span>
                              <div
                                className={`text-xs px-2 py-1 rounded-full mt-1 ${activity.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : activity.status === "approved"
                                    ? "bg-green-100 text-green-700"
                                    : activity.status === "completed"
                                      ? "bg-blue-100 text-blue-700"
                                      : activity.status === "active"
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-red-100 text-red-700"
                                  }`}
                              >
                                {activity.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-2xl p-4 sm:p-6 border border-blue-100 dark:border-blue-800 transition-colors">
                      <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                        <Target className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 dark:text-blue-400" />
                        Today's Metrics
                      </h4>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">New Signups</span>
                          <span className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {adminDashboardStats?.stats?.daily_metrics?.new_signups || 12}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">Projects Sold</span>
                          <span className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
                            {adminDashboardStats?.stats?.daily_metrics?.projects_sold || 8}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700 dark:text-blue-300 text-sm sm:text-base">Revenue</span>
                          <span className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-100">
                            ₹{adminDashboardStats?.stats?.daily_metrics?.revenue || 450}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 sm:p-6 border border-purple-100 dark:border-purple-800 transition-colors">
                      <h4 className="font-bold text-purple-900 dark:text-purple-200 mb-3 sm:mb-4 text-sm sm:text-base">Platform Health</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span className="text-purple-700 dark:text-purple-300">Server Uptime</span>
                            <span className="font-semibold text-purple-900 dark:text-purple-100">
                              {adminDashboardStats?.stats?.platform_health?.server_uptime || 99.9}%
                            </span>
                          </div>
                          <div className="w-full bg-purple-200 dark:bg-purple-900/40 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 h-2 rounded-full"
                              style={{ width: `${adminDashboardStats?.stats?.platform_health?.server_uptime || 99.9}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span className="text-purple-700 dark:text-purple-300">User Satisfaction</span>
                            <span className="font-semibold text-purple-900 dark:text-purple-100">
                              {adminDashboardStats?.stats?.platform_health?.user_satisfaction || stats.avgRating}/5.0
                            </span>
                          </div>
                          <div className="w-full bg-purple-200 dark:bg-purple-900/40 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 h-2 rounded-full"
                              style={{ width: `${((adminDashboardStats?.stats?.platform_health?.user_satisfaction || stats.avgRating) / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="animate-slideInUp">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 flex items-center gap-3">
                  <BarChart3 className="w-6 sm:w-7 h-6 sm:h-7 text-blue-600" />
                  Analytics & Reports
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
                  {/* Sales Chart */}
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-lg transition-colors">
                    <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">Monthly Performance</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {salesData.map((data: any, index: number) => (
                        <div key={index} className="animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-2">
                            <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base min-w-[80px]">
                              {data.month}
                            </span>
                            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                              <span className="text-green-600 dark:text-green-400 font-bold whitespace-nowrap">
                                ₹{data.revenue?.toLocaleString() || data.revenue}
                              </span>
                              <span className="text-blue-600 dark:text-blue-400 whitespace-nowrap">
                                {data.projects_created} projects
                              </span>
                              <span className="text-purple-600 dark:text-purple-400 whitespace-nowrap">
                                {data.new_users} users
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 sm:h-3 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-teal-500 dark:from-blue-400 dark:to-teal-400 h-2 sm:h-3 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min((data.revenue / 10000) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Categories */}
                  <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 sm:p-8 border border-gray-100 dark:border-slate-700 shadow-lg transition-colors">
                    <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">Popular Categories</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {(adminDashboardStats?.stats?.popular_categories || [
                        { category: "React", project_count: 15, total_revenue: 1250 },
                        { category: "Java", project_count: 12, total_revenue: 980 },
                        { category: "Python", project_count: 10, total_revenue: 850 },
                        { category: "PHP", project_count: 8, total_revenue: 640 },
                      ]).map((category: any, index: number) => {
                        const colors = [
                          "from-blue-500 to-blue-600",
                          "from-orange-500 to-red-600",
                          "from-green-500 to-emerald-600",
                          "from-purple-500 to-indigo-600",
                        ]
                        return (
                          <div
                            key={index}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md hover:scale-105 transition-all duration-300 animate-slideInUp"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors[index % colors.length]} flex-shrink-0`} />
                              <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">{category.category}</span>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="font-bold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                {category.project_count} projects
                              </div>
                              <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-semibold">₹{category.total_revenue}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base">Conversion Rate</h4>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {adminDashboardStats?.stats?.business_metrics?.conversion_rate || stats.conversionRate}%
                    </div>
                    <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-semibold">
                      ↑ {adminDashboardStats?.stats?.business_metrics?.conversion_rate_change || 0.3}% from last month
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base">Avg Order Value</h4>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                      ₹{adminDashboardStats?.stats?.business_metrics?.avg_order_value || 34.50}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-semibold">
                      ↑ ₹{adminDashboardStats?.stats?.business_metrics?.avg_order_value_change || 2.10} from last month
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base">User Retention</h4>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {adminDashboardStats?.stats?.business_metrics?.user_retention || 78}%
                    </div>
                    <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-semibold">
                      ↑ {adminDashboardStats?.stats?.business_metrics?.user_retention_change || 5}% from last month
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 text-sm sm:text-base">Active Sellers</h4>
                    <div className="text-2xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                      {adminDashboardStats?.stats?.business_metrics?.active_sellers || 24}
                    </div>
                    <div className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-semibold">
                      ↑ {adminDashboardStats?.stats?.business_metrics?.active_sellers_change || 3} new this month
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "projects" && (
              <div className="animate-slideInUp">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100">Manage Projects</h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 text-sm"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 text-sm"
                    >
                      <option value="all" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">All Status</option>
                      <option value="approved" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Approved</option>
                      <option value="pending" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Pending Review</option>
                      <option value="suspended" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Suspended</option>
                      <option value="archived" className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100">Archived</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base">Loading projects...</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 transition-colors">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Project
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                              Author ID
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                              Category
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                              Sales
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                          {projects
                            .filter((p) => filterStatus === "all" || p.status === filterStatus)
                            .filter(
                              (p) => searchTerm === "" || p.title.toLowerCase().includes(searchTerm.toLowerCase()),
                            )
                            .map((project, index) => (
                              <tr
                                key={project.id}
                                className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors animate-slideInUp text-xs sm:text-sm"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <span className="text-white font-bold text-sm sm:text-lg">
                                        {project.title.charAt(0)}
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{project.title}</div>
                                      <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                                        {project.is_featured && (
                                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                                            Featured
                                          </span>
                                        )}
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                          {project.difficulty_level}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium hidden sm:table-cell truncate">
                                  {project.author_name ? `${project.author_name} (${project.author_id})` : project.author_id}
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                                  <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                                    {project.category}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                    <span className="text-gray-900 dark:text-gray-100 font-bold">₹{project.pricing?.sale_price}</span>
                                    <span className="text-gray-500 dark:text-gray-400 line-through text-xs">
                                      ₹{project.pricing?.original_price}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 font-bold text-gray-900 dark:text-gray-100 hidden lg:table-cell">
                                  {project.purchase_count}
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                  <span
                                    className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${project.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : project.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : project.status === "suspended"
                                          ? "bg-red-100 text-red-800"
                                          : project.status === "archived"
                                            ? "bg-gray-100 text-gray-800 dark:text-gray-200 dark:text-gray-200"
                                            : "bg-gray-100 text-gray-800 dark:text-gray-200 dark:text-gray-200"
                                      }`}
                                  >
                                    {project.status.replace("_", " ")}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                  <div className="flex space-x-1 sm:space-x-2">
                                    <button
                                      onClick={() => openProjectModal(project)}
                                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleToggleFeatured(project.id, project.is_featured)}
                                      disabled={updatingProject === project.id}
                                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${project.is_featured
                                        ? "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50"
                                        : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:bg-slate-800"
                                        }`}
                                    >
                                      <Star className={`w-4 h-4 ${project.is_featured ? "fill-current" : ""}`} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(project.id)}
                                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div className="animate-slideInUp">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100">User Management</h2>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <select className="px-4 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 text-sm">
                      <option>All Users</option>
                      <option>Students</option>
                      <option>Admins</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {loading ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base">Loading users...</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 transition-colors">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              User
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                              Role
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                              Joined
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                          {users.map((user, index) => (
                            <tr
                              key={user.id}
                              className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors animate-slideInUp text-xs sm:text-sm"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <div className="flex items-center gap-2 sm:gap-4">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-sm sm:text-lg">
                                      {user.full_name.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{user.full_name}</div>
                                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate">{user.email}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400">
                                      Last: {new Date(user.updated_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                                <span
                                  className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${user.user_type === "admin"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-blue-100 text-blue-800"
                                    }`}
                                >
                                  {user.user_type}
                                </span>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium hidden md:table-cell">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <span
                                  className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${user.verification_status === "verified"
                                    ? "bg-green-100 text-green-800"
                                    : user.verification_status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                  {user.verification_status}
                                </span>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <div className="flex space-x-1 sm:space-x-2">
                                  <button
                                    onClick={() => fetchUserDetails(user.id)}
                                    disabled={fetchingUserDetails === user.id}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                                  >
                                    {fetchingUserDetails === user.id ? (
                                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>

                                  <button
                                    onClick={() => deleteUser(user.id)}
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {users.length === 0 && (
                            <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-gray-600 dark:text-gray-300 dark:text-gray-400">
                                No users found
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

            {activeTab === "approval" && (
              <div className="animate-slideInUp">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 flex-wrap">
                  <AlertCircle className="w-6 sm:w-7 h-6 sm:h-7 text-orange-600" />
                  Pending Approval
                  <span className="bg-orange-500 text-white text-xs sm:text-sm px-3 py-1 rounded-full animate-pulse">
                    {pendingProjects.length}
                  </span>
                </h2>

                {loading ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base">Loading pending projects...</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700 transition-colors">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 transition-colors">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Project
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                              Author ID
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                              Category
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                              Submitted
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                          {pendingProjects.map((project, index) => (
                            <tr
                              key={project.id}
                              className="hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors animate-slideInUp text-xs sm:text-sm"
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-sm sm:text-lg">
                                      {project.title.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{project.title}</div>
                                    <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                                        Pending
                                      </span>
                                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                                        {project.difficulty_level}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium hidden sm:table-cell truncate">
                                {project.author_id}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                                <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                                  {project.category}
                                </span>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                                  <span className="text-gray-900 dark:text-gray-100 font-bold">₹{project.pricing?.sale_price}</span>
                                  <span className="text-gray-500 dark:text-gray-400 line-through text-xs">
                                    ₹{project.pricing?.original_price}
                                  </span>
                                </div>
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium hidden lg:table-cell">
                                {new Date(project.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-3 sm:px-6 py-3 sm:py-4">
                                <div className="flex space-x-1 sm:space-x-2">
                                  <button
                                    onClick={() => openProjectModal(project)}
                                    className="p-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => handleReject(project.id)}
                                    disabled={updatingProject === project.id}
                                    className="p-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 hover:scale-110"
                                  >
                                    {updatingProject === project.id ? (
                                      <div className="w-4 h-4 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <X className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {pendingProjects.length === 0 && (
                            <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-600 dark:text-gray-300 dark:text-gray-400">
                                No pending projects found
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
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
                  <DollarSign className="w-6 sm:w-7 h-6 sm:h-7 text-green-600" />
                  Transaction History
                </h2>

                {loading ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 text-sm sm:text-base">Loading transactions...</div>
                ) : error ? (
                  <div className="text-center text-red-500 text-sm sm:text-base">{error}</div>
                ) : transactions.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400 text-base sm:text-lg mb-4">No transactions found</div>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-x-auto">
                    <table className="min-w-full text-left text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                      <thead className="bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 font-semibold transition-colors">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 sm:py-4">Transaction ID</th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">Project</th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">Buyer</th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4">Amount</th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">Status</th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">Date</th>
                          <th className="px-3 sm:px-6 py-3 sm:py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-t text-xs sm:text-sm">
                            <td className="px-3 sm:px-6 py-3 sm:py-4 font-mono text-xs sm:text-sm truncate">
                              {tx.transaction_id}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <img
                                  src={tx.project?.thumbnail || "/placeholder.svg"}
                                  alt={tx.project?.title || "Project"}
                                  className="w-8 h-8 rounded hidden sm:block"
                                />
                                <span className="truncate">{tx.project?.title || "N/A"}</span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                              <div className="truncate">User ID: {tx.user_id}</div>
                              <div className="text-xs text-gray-400 truncate">Type: {tx.type}</div>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold whitespace-nowrap">
                              {tx.amount} {tx.currency}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${tx.status === "success"
                                  ? "bg-green-100 text-green-600"
                                  : tx.status === "pending"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-red-100 text-red-600"
                                  }`}
                              >
                                {tx.status}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-3 sm:px-6 py-3 sm:py-4">
                              <button
                                onClick={() => {
                                  setSelectedTransaction(tx)
                                  setIsTransactionModalOpen(true)
                                }}
                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="View transaction details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="animate-slideInUp">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 sm:gap-3">
                    <MessageSquare className="w-6 sm:w-7 h-6 sm:h-7 text-blue-600" />
                    Manage Reviews
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search reviews..."
                        value={reviewSearchTerm}
                        onChange={(e) => setReviewSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 text-sm"
                      />
                    </div>
                    <select
                      value={reviewFilterStatus}
                      onChange={(e) => setReviewFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 dark:border-slate-600 placeholder-gray-400 dark:placeholder-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 dark:text-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 text-sm"
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
                    <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base">Loading reviews...</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 transition-colors">
                          <tr>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Review
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                              Project Name
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden sm:table-cell">
                              Student
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Rating
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                              Status
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                              Date
                            </th>
                            <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                          {reviews
                            .filter(
                              (review) =>
                                reviewFilterStatus === "all" ||
                                (reviewFilterStatus === "approved" && review.is_approved) ||
                                (reviewFilterStatus === "pending" && !review.is_approved),
                            )
                            .filter(
                              (review) =>
                                reviewSearchTerm === "" ||
                                review.review_text.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
                                review.user.full_name.toLowerCase().includes(reviewSearchTerm.toLowerCase()),
                            )
                            .map((review, index) => (
                              <tr
                                key={review.id}
                                className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors animate-slideInUp text-xs sm:text-sm"
                                style={{ animationDelay: `${index * 100}ms` }}
                              >
                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                  <p className="text-xs sm:text-sm text-gray-900 dark:text-gray-100 font-medium line-clamp-2">
                                    {review.review_text}
                                  </p>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium hidden md:table-cell truncate">
                                  {review.project.title}
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-white font-bold text-xs sm:text-sm">
                                        {review.user.full_name.charAt(0)}
                                      </span>
                                    </div>
                                    <div className="min-w-0 hidden sm:block">
                                      <div className="font-semibold text-gray-900 dark:text-gray-100 text-xs sm:text-sm truncate">
                                        {review.user.full_name}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{review.user.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                          }`}
                                      />
                                    ))}
                                  </div>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                                  <span
                                    className={`px-2 sm:px-3 py-1 inline-flex text-xs font-bold rounded-full ${review.is_approved
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                      }`}
                                  >
                                    {review.is_approved ? "Approved" : "Pending"}
                                  </span>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-600 dark:text-gray-300 font-medium hidden md:table-cell text-xs">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4">
                                  <div className="flex space-x-1 sm:space-x-2">
                                    <button
                                      onClick={() => openReviewModal(review)}
                                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                                      title="View Review Details"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    {!review.is_approved ? (
                                      <button
                                        onClick={() => handleReviewAction([review.id], true)}
                                        disabled={updatingReview === review.id}
                                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                                        title="Approve Review"
                                      >
                                        {updatingReview === review.id ? (
                                          <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <Check className="w-4 h-4" />
                                        )}
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleReviewAction([review.id], false)}
                                        disabled={updatingReview === review.id}
                                        className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                                        title="Reject Review"
                                      >
                                        {updatingReview === review.id ? (
                                          <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <X className="w-4 h-4" />
                                        )}
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteReview(review.id)}
                                      disabled={deletingReview === review.id}
                                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
                                      title="Delete Review"
                                    >
                                      {deletingReview === review.id ? (
                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {reviews.length === 0 && (
                            <tr>
                              <td colSpan={7} className="px-6 py-8 text-center text-gray-600 dark:text-gray-300 dark:text-gray-400">
                                No reviews found
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

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8 text-center">
                  <div className="max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Wallet className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Full Payout Management Dashboard
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                      Access the complete payout management system with detailed statistics,
                      payout operations, and administrative controls.
                    </p>
                    <button
                      onClick={() => navigate("/admin/payouts")}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Wallet className="w-5 h-5" />
                      Open Payout Dashboard
                      <TrendingUp className="w-5 h-5" />
                    </button>

                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
                      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                          <BarChart3 className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">Statistics</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          View payout volume, success rates, and trends
                        </p>
                      </div>

                      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                          <Settings className="w-5 h-5 text-purple-600" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">Operations</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Retry failed payouts and manage requests
                        </p>
                      </div>

                      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-md">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-teal-600" />
                          <h4 className="font-semibold text-gray-900 dark:text-white">User Payouts</h4>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Filter and manage payouts by user
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isUserModalOpen && (
        <UserDetailsModal
          isOpen={isUserModalOpen}
          user={selectedUser}
          onClose={() => {
            setIsUserModalOpen(false)
            setSelectedUser(null)
          }}
          onUpdateUserStatus={updateUserStatus}
          updatingUser={updatingUser}
        />
      )}
      {isProjectModalOpen && (
        <ProjectDetailsModalNew
          isOpen={isProjectModalOpen}
          onClose={() => {
            setIsProjectModalOpen(false)
            setSelectedProject(null)
          }}
          project={selectedProject}
          canEditAll={false}
          projectUpdateData={projectUpdateData}
          onUpdateDataChange={setProjectUpdateData}
          onUpdate={handleProjectStatusUpdate}
          updatingProjectStatus={updatingProjectStatus}
        />
      )}
      {/* Transaction Details Modal */}

      {isTransactionModalOpen && (
        <TransactionDetailsModal
          isOpen={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
          transaction={selectedTransaction}
          onUpdateTransactionStatus={handleUpdateTransactionStatus}
          updatingTransaction={updatingTransaction}
        />
      )}

      {isReviewModalOpen && selectedReview && (
        <ReviewDetailsModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false)
            setSelectedReview(null)
          }}
          review={selectedReview}
          isAdmin={true}
          // ✅ call handleReviewAction with array + true/false
          onApprove={() => handleReviewAction([selectedReview.id], true)}
          onReject={() => handleReviewAction([selectedReview.id], false)}
          onDelete={handleDeleteReview}
          isUpdating={updatingReview === selectedReview.id}
          isDeleting={deletingReview === selectedReview.id}
        />
      )}
    </div>
  )
}

export default AdminDashboard
