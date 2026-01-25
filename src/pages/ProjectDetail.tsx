import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Star, Download, Lock, ShoppingCart, Heart, Share2, Eye, Calendar, Award, Clock, Shield, CheckCircle, MessageSquare, Send, Github, ExternalLink, Edit2, Save, X, Linkedin, Twitter } from 'lucide-react'
import { useAuth } from "../contexts/AuthContext"
import { useWishlist } from "../contexts/WishlistContext"
import { useCart } from "../contexts/CartContext"
import { useReferralContext } from "../contexts/ReferralContext"
import { useFeatureFlags } from "../contexts/FeatureFlagContext"
import { useCredits } from "../hooks/useCredits"
import { useProjectViewTracking } from "../hooks/useProjectViewTracking"
import type { Project, Review } from "../types/Project"
import toast from "react-hot-toast"
import type { User } from "../types/User"
import { DownloadFilesModal } from "../components/DownloadFilesModal"
import { UnlockOptionsModal } from "../components/UnlockOptionsModal"
import CreditDownloadButton from "../components/CreditDownloadButton"
import ReferralCTA from "../components/ReferralCTA"
import { apiClient } from "../utils/apiClient"
import { getApiUrl } from "../config/api"
import { DEMO_PROJECTS } from "../constants/demoProjects"
import { getUserCredits } from "../services/referralService"

interface UserStatus {
  has_purchased: boolean
  in_wishlist: boolean
  in_cart: boolean
}

const ProjectDetail = () => {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("description")
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([])
  const [pendingReviews, setPendingReviews] = useState<Review[]>([])
  const [reviewText, setReviewText] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const { isAuthenticated, user, openAuthModal } = useAuth()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCart, removeFromCart, isInCart } = useCart()
  const [formRating, setFormRating] = useState(0)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [editReviewText, setEditReviewText] = useState("")
  const [editReviewRating, setEditReviewRating] = useState(0)
  const [updatingReview, setUpdatingReview] = useState(false)
  const [actionLoading, setActionLoading] = useState<boolean>(false)
  const [relatedProjects, setRelatedProjects] = useState<Project[] | null>(null)
  const [authorDetails, setAuthorDetails] = useState<{
    authorId: string;
    avatar: string | null;
    full_name: string;
    email: string;
    total_projects: number;
    rating: number;
    total_sales: number;
    social_links?: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  } | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false)

  const navigate = useNavigate();
  const { refreshCredits } = useReferralContext();

  // Feature flags and credit system
  const { showPaymentUI, showCreditUI } = useFeatureFlags();
  const { availableCredits, loading: creditsLoading } = useCredits();

  // Debug: Log the values to understand what's happening
  useEffect(() => {
    console.log('🔍 Button Logic Debug:', {
      isAuthenticated,
      isDemo: project?.isDemo,
      availableCredits,
      creditsLoading,
      showPaymentUI,
      showCreditUI,
      isPurchased: Boolean(
        project?.isPurchased ||
        userStatus?.has_purchased ||
        (Array.isArray((project as any)?.buyers) && user?.id ? (project as any).buyers.includes(user.id) : false),
      )
    });
  }, [isAuthenticated, project, availableCredits, creditsLoading, showPaymentUI, showCreditUI, userStatus, user]);

  // Track project view time for referral confirmation
  useProjectViewTracking(id || '');

  useEffect(() => {
    if (project && user) {
      checkIsPurchased()
    }
  }, [project, user])

  useEffect(() => {
    if (activeTab === "reviews" && id) {
      fetchReviews()
    }
  }, [activeTab, id])

  // Calculate isPurchased status
  const isPurchased = Boolean(
    project?.isPurchased ||
    userStatus?.has_purchased ||
    (Array.isArray((project as any)?.buyers) && user?.id ? (project as any).buyers.includes(user.id) : false),
  )

  // Debug logging for purchase status
  useEffect(() => {
    if (project) {
      console.log('💳 Purchase Status Check:', {
        projectId: id,
        isPurchased,
        'project.isPurchased': project?.isPurchased,
        'userStatus.has_purchased': userStatus?.has_purchased,
        'buyers check': Array.isArray((project as any)?.buyers) && user?.id ? (project as any).buyers.includes(user.id) : false,
        userId: user?.id,
        availableCredits
      });
    }
  }, [isPurchased, project, userStatus, user, id, availableCredits])

  const fetchProjectData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Check if this is a demo project first
      const demoProject = DEMO_PROJECTS.find(p => p.id === id);
      if (demoProject) {
        // Handle demo project - use local data
        setProject(demoProject);
        setUserStatus({ has_purchased: false, in_wishlist: false, in_cart: false });
        setAuthorDetails(demoProject.author_details || null);
        // Set empty related projects for demo
        setRelatedProjects([]);
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        accept: "application/json"
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await apiClient(getApiUrl(`/projects/${id}`), {
        method: "GET",
        headers,
      })

      if (!res.ok) {
        console.error("Project API response not ok:", res.status, res.statusText)
        throw new Error(`Failed to fetch project data: ${res.status}`)
      }

      const data = await res.json()
      console.log('📦 Fetched project data:', {
        projectId: id,
        isPurchased: data.project?.isPurchased,
        userStatus: data.user_status
      });
      setProject(data.project || null);
      setUserStatus(data.user_status || { has_purchased: false, in_wishlist: false, in_cart: false });
      setAuthorDetails(data.author_details || null);
      setRelatedProjects(Array.isArray(data.related_projects) ? data.related_projects : []);
    } catch (err) {

      console.error("Error fetching project data:", err)
      setError("Could not load project details. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id, fetchProjectData]);

  const fetchReviews = async () => {
    if (!id) return;

    // Demo projects don't have backend reviews
    const isDemoProject = DEMO_PROJECTS.some(p => p.id === id);
    if (isDemoProject) {
      setApprovedReviews([]);
      setPendingReviews([]);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        accept: "application/json"
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await apiClient(getApiUrl(`/projects/${id}/reviews`), {
        method: "GET",
        headers,
      })
      if (response.ok) {
        const data = await response.json()

        // Separate approved and pending reviews
        const allReviews = data.reviews || []
        const approved = allReviews.filter((review: Review) => review.is_approved)
        const pending = allReviews.filter((review: Review) => !review.is_approved)

        setApprovedReviews(approved)
        setPendingReviews(pending)
      } else {
        console.error("Reviews API response not ok:", response.status, response.statusText)
        setApprovedReviews([])
        setPendingReviews([])
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
      setApprovedReviews([])
      setPendingReviews([])
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !project || formRating === 0) return;

    // Prevent reviews on demo projects
    if (project.isDemo) {
      toast.error("Reviews are not available for demo projects");
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await apiClient(getApiUrl(`/reviews`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          project_id: id,
          rating: formRating,
          review_text: reviewText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setReviewText("");
        setFormRating(0);
        toast.success("✅ Review submitted successfully!");
        await fetchReviews();
      } else {
        // handle both possible formats: {message: "..."} or {error: "..."}
        toast.error(data.error || data.message || "❌ Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("⚠️ An unexpected error occurred. Please try again later.");
    } finally {
      setSubmittingReview(false);
    }
  };


  // Helper function to check if user can edit a review
  const canEditReview = (review: Review) => {
    return isAuthenticated && user && user.id === review.user.id && localStorage.getItem("token")
  }

  const checkIsPurchased = () => {
    const currentUserId = user?.id || '';
    if (!project || !currentUserId) return;

    try { // ADD TRY-CATCH
      const buyers = Array.isArray((project as any)?.buyers) ? (project as any).buyers : [];
      const hasBought = buyers.includes(currentUserId);

      if (hasBought) {
        setUserStatus(prev => ({
          has_purchased: true,
          in_wishlist: prev?.in_wishlist || false,
          in_cart: prev?.in_cart || false,
        }));
      }
    } catch (err) {
      console.error('Error checking purchase status:', err);
    }
  };

  // Helper function to check if current user has already submitted a review
  const getUserReview = () => {
    if (!isAuthenticated || !user) return null
    const allReviews = [...approvedReviews, ...pendingReviews]
    return allReviews.find((review) => review.user.id === user.id) || null
  }

  // Check if user has already reviewed
  const userReview = getUserReview()
  const hasUserReviewed = !!userReview

  const handleEditReview = (review: Review) => {
    // Double-check permissions before allowing edit
    if (!canEditReview(review)) {
      toast.error("You can only edit your own reviews.")
      return
    }

    setEditingReviewId(review.id)
    setEditReviewText(review.review_text)
    setEditReviewRating(review.rating)
  }

  const handleCancelEdit = () => {
    setEditingReviewId(null)
    setEditReviewText("")
    setEditReviewRating(0)
  }

  const handleUpdateReview = async () => {
    if (!editReviewText.trim() || editReviewRating === 0) return

    // Check if user is authenticated and token is available
    if (!isAuthenticated || !user) {
      toast.error("Please log in to edit your review.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found. Please log in again.")
      return
    }

    setUpdatingReview(true)
    try {
      const response = await apiClient(getApiUrl(`/reviews/${editingReviewId}`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: editReviewRating,
          review_text: editReviewText,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update review")
      }

      const data = await response.json()

      // Update the reviews in state
      setApprovedReviews((prev) =>
        prev.map((review) =>
          review.id === editingReviewId
            ? { ...review, ...data.review, rating: editReviewRating, review_text: editReviewText }
            : review,
        ),
      )
      setPendingReviews((prev) =>
        prev.map((review) =>
          review.id === editingReviewId
            ? { ...review, ...data.review, rating: editReviewRating, review_text: editReviewText }
            : review,
        ),
      )

      toast.success("Review updated successfully!")
      handleCancelEdit()
      // Refresh reviews to update the user review display
      await fetchReviews()
    } catch (error) {
      console.error("Error updating review:", error)
      toast.error("Failed to update review. Please try again.")
    } finally {
      setUpdatingReview(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in to delete your review.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      toast.error("Authentication token not found. Please log in again.")
      return
    }

    const confirmDelete = window.confirm("Are you sure you want to delete your review? This action cannot be undone.")
    if (!confirmDelete) return

    try {
      const response = await apiClient(getApiUrl(`/reviews/${reviewId}`), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete review")
      }

      // Remove the review from state
      setApprovedReviews((prev) => prev.filter((review) => review.id !== reviewId))
      setPendingReviews((prev) => prev.filter((review) => review.id !== reviewId))

      toast.success("Review deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete review. Please try again.")
    }
  }

  const handleDownloadFile = async (fileUrl: string, fileName: string) => {
    if (!isAuthenticated || !isPurchased) {
      toast.error("Please purchase this project to download files");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      // Check user credits before initiating download
      const creditData = await getUserCredits();

      if (creditData.download_credits <= 0 && !isPurchased) {
        // Show unlock options modal if insufficient credits
        setIsUnlockModalOpen(true);
        return;
      }

      toast.loading("Preparing download...", { id: "download" });

      // Use backend proxy endpoint for authenticated downloads
      const response = await apiClient(getApiUrl(`/projects/${id}/download`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ file_url: fileUrl }),
      });

      if (!response.ok) {
        // Handle 402 Payment Required error
        if (response.status === 402) {
          toast.dismiss("download");
          setIsUnlockModalOpen(true);
          return;
        }

        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("File downloaded successfully!", { id: "download" });

      // Refresh credit balance after successful download
      await refreshCredits();
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(error.message || "Failed to download file. Please try again.", { id: "download" });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-3 sm:px-4 transition-colors">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 dark:text-gray-400 text-base sm:text-lg">Loading project details...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-3 sm:px-4 transition-colors">
        <div className="text-center max-w-md">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-xl sm:text-2xl">!</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-2">Project Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 dark:text-gray-400 mb-4 text-center text-sm sm:text-base">
            {error || "The project you are looking for does not exist."}
          </p>
          <Link
            to="/projects"
            className="inline-block bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  const wishlistStatus = project ? userStatus?.in_wishlist || isInWishlist(project.id) : false
  const cartStatus = project ? userStatus?.in_cart || isInCart(project.id) : false

  const handleToggleWishlist = async () => {
    if (!project) return;

    // Prevent wishlist actions on demo projects
    if (project.isDemo) {
      toast.error("🎁 Demo projects are for preview only. Browse our full catalog to add projects to your wishlist!");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to manage wishlist.")
      return
    }
    try {
      if (wishlistStatus) {
        await removeFromWishlist(project.id)
        setUserStatus((prev) => (prev ? { ...prev, in_wishlist: false } : prev))
      } else {
        await addToWishlist(project)
        setUserStatus((prev) => (prev ? { ...prev, in_wishlist: true } : prev))
      }
    } catch (e) {
      console.error("Wishlist toggle failed", e)
    }
  }

  const handleUnlockContent = () => {
    if (!project) return;

    // Prevent unlock actions on demo projects
    if (project.isDemo) {
      toast.error("🎁 Demo projects are for preview only. Explore our full catalog to purchase real projects!");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to purchase and unlock this content")
      return
    }

    // If authenticated, proceed with adding to cart
    handleToggleCart()
  }

  const handleToggleCart = async () => {
    if (!project) return;

    // Prevent cart actions on demo projects
    if (project.isDemo) {
      toast.error("🎁 Demo projects are for preview only. Explore our full catalog to purchase real projects!");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to manage your cart")
      return
    }
    if (actionLoading) return

    setActionLoading(true)
    try {
      if (cartStatus) {
        await removeFromCart(project.id)
        setUserStatus((prev) => (prev ? { ...prev, in_cart: false } : prev))
      } else {
        const addedSuccessfully = await addToCart(project) // should return true/false
        if (addedSuccessfully) {
          setUserStatus((prev) => (prev ? { ...prev, in_cart: true } : prev))
        }
      }
    } catch (error: any) {
      console.error("Cart toggle failed:", error)
      toast.error(error?.message || "Something went wrong while updating cart")
    } finally {
      setActionLoading(false)
    }
  }

  const handleShare = async () => {
    const currentUrl = window.location.href
    try {
      await navigator.clipboard.writeText(currentUrl)
      toast.success("Link copied to clipboard!")
    } catch (error) {
      console.error("Failed to copy:", error)
      toast.error("Failed to copy link")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-3 sm:py-6 lg:py-8 animate-fadeIn transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Breadcrumb - improved mobile padding */}
        <div className="mb-3 sm:mb-6 animate-slideInDown">
          <nav className="flex flex-wrap text-xs sm:text-sm text-gray-500 dark:text-gray-400 gap-1">
            <Link to="/" className="hover:text-blue-600 transition-colors duration-200 whitespace-nowrap">
              Home
            </Link>
            <span className="mx-1">/</span>
            <Link to="/projects" className="hover:text-blue-600 transition-colors duration-200 whitespace-nowrap">
              Projects
            </Link>
            <span className="mx-1">/</span>
            <span className="text-gray-900 dark:text-gray-100 dark:text-gray-100 font-medium truncate">{project.title}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-1 lg:order-1">
            {/* Project Header */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl mb-4 sm:mb-6 lg:mb-10 border border-white/30 dark:border-slate-700/30 animate-slideInLeft transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold shadow-sm animate-slideInUp">
                    {project.category}
                  </span>
                  {project.is_featured && (
                    <span
                      className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-full text-xs sm:text-sm font-bold flex items-center shadow-sm animate-slideInUp"
                      style={{ animationDelay: "100ms" }}
                    >
                      <Award className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  )}
                  <span
                    className="px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs sm:text-sm font-bold shadow-sm animate-slideInUp"
                    style={{ animationDelay: "150ms" }}
                  >
                    {project.difficulty_level}
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-4 justify-start">
                  <button
                    onClick={handleToggleWishlist}
                    disabled={project.isDemo}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 transition-all duration-200 rounded-xl animate-slideInUp text-xs sm:text-sm ${project.isDemo
                      ? "text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-60"
                      : "text-gray-600 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 hover:scale-105"
                      }`}
                    style={{ animationDelay: "200ms" }}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${wishlistStatus && !project.isDemo ? "text-red-500 fill-current" : ""}`} />
                    <span className="font-medium sm:inline">{wishlistStatus ? "Wishlisted" : "Wishlist"}</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-gray-600 dark:text-gray-300 dark:text-gray-400 hover:text-blue-500 transition-all duration-200 rounded-xl hover:bg-blue-50 hover:scale-105 animate-slideInUp text-xs sm:text-sm"
                    style={{ animationDelay: "300ms" }}
                  >
                    <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium sm:inline">Share</span>
                  </button>
                </div>
              </div>
              <h1
                className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 mb-3 sm:mb-6 animate-slideInUp leading-tight"
                style={{ animationDelay: "400ms" }}
              >
                {project.title}
              </h1>
              <div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400 mb-4 sm:mb-8 animate-slideInUp"
                style={{ animationDelay: "500ms" }}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current flex-shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-sm sm:text-base block">{project.rating?.average_rating?.toFixed(1) || "0.0"}</span>
                    <span className="font-medium text-xs">
                      ({project.rating?.total_ratings || 0} {(project.rating?.total_ratings || 0) === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-medium">{project.view_count || 0} Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-medium text-xs sm:text-sm">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-medium">{project.purchase_count} Sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="font-medium">{project.download_count || 0} Downloads</span>
                </div>
              </div>

              {/* Status badges */}
              <div className="col-span-full flex flex-wrap gap-2 mb-4 sm:mb-6">
                {isPurchased && (
                  <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Purchased
                  </span>
                )}
                {cartStatus && !isPurchased && (
                  <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    In Cart
                  </span>
                )}
                {wishlistStatus && (
                  <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                    In Wishlist
                  </span>
                )}
              </div>

              {/* Demo Video - improved aspect ratio handling for mobile */}
              {isPurchased && project?.youtube_url ? (
                <div
                  className="aspect-video bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-8 shadow-2xl animate-slideInUp hover:shadow-3xl transition-shadow duration-300"
                  style={{ animationDelay: "600ms" }}
                >
                  <iframe
                    src={
                      project.youtube_url.includes("watch?v=")
                        ? project.youtube_url.replace("watch?v=", "embed/")
                        : project.youtube_url.includes("youtu.be")
                          ? project.youtube_url.replace("https://youtu.be/", "https://www.youtube.com/embed/")
                          : project.youtube_url
                    }
                    title="Project Demo"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : isPurchased && !project?.youtube_url && project.thumbnail ? (
                // Show thumbnail for purchased projects without YouTube video
                <div
                  className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-8 shadow-2xl animate-slideInUp hover:shadow-3xl transition-all duration-300 group"
                  style={{ animationDelay: "600ms" }}
                >
                  <img
                    src={project.thumbnail || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ) : !isPurchased && project.thumbnail ? (
                <div
                  className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden mb-4 sm:mb-8 shadow-2xl animate-slideInUp relative group cursor-pointer"
                  style={{ animationDelay: "600ms" }}
                  onClick={handleUnlockContent}
                >
                  {/* Project Thumbnail - Always visible */}
                  <img
                    src={project.thumbnail || "/placeholder.svg"}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay - Shows on hover/touch */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Lock Indicator - Always visible in corner */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30">
                      <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>

                  {/* Content - Shows on hover/touch */}
                  <div className="absolute inset-0 flex items-center justify-center text-center z-10 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 dark:bg-slate-800/40 backdrop-blur-md rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-white/30 dark:border-slate-600/30 animate-pulse">
                        <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white mb-2">Check out Free Live Demo</h4>
                      <p className="text-xs sm:text-sm text-white/90 mb-4">Purchase this project to access all related resources</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnlockContent();
                        }}
                        disabled={actionLoading}
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50"
                      >
                        <ShoppingCart className="w-4 h-4 inline mr-2" />
                        Purchase to Unlock
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* External Links - improved responsive button layout */}
              <div
                className="flex flex-col items-stretch gap-2 sm:gap-3 mb-4 sm:mb-8 animate-slideInUp"
                style={{ animationDelay: "650ms" }}
              >
                {/* Demo URL - Always visible to all users - FIRST */}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-sm font-medium shadow-md"
                  >
                    <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                    <span>Live Demo</span>
                  </a>
                )}

                {/* GitHub URL - Always show, locked for non-purchasers */}
                {isPurchased && project.github_url ? (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200 text-xs sm:text-sm font-medium shadow-md"
                  >
                    <Github className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                    <span>GitHub Code</span>
                  </a>
                ) : !isPurchased ? (
                  <button
                    onClick={handleUnlockContent}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 text-gray-600 dark:text-gray-300 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 relative overflow-hidden text-xs sm:text-sm font-medium hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all"
                  >
                    <Lock className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                    <span>GitHub Code</span>
                  </button>
                ) : null}

                {/* YouTube URL - Always show, locked for non-purchasers */}
                {isPurchased && project.youtube_url ? (
                  <a
                    href={project.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 text-xs sm:text-sm font-medium shadow-md"
                  >
                    <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                    <span>Watch Tutorial</span>
                  </a>
                ) : !isPurchased ? (
                  <button
                    onClick={handleUnlockContent}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 text-gray-600 dark:text-gray-300 rounded-xl border-2 border-dashed border-gray-300 dark:border-slate-600 relative overflow-hidden text-xs sm:text-sm font-medium hover:from-gray-200 hover:to-gray-300 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all"
                  >
                    <Lock className="w-4 sm:w-5 h-4 sm:h-5 flex-shrink-0" />
                    <span>Video Tutorial</span>
                  </button>
                ) : null}
              </div>

              {/* Tabs - improved responsive tab navigation */}
              <div
                className="border-b border-gray-200 dark:border-slate-700 mb-4 sm:mb-2 animate-slideInUp overflow-x-auto"
                style={{
                  animationDelay: "700ms",
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <style>{`
                  .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                <nav className="flex gap-4 sm:gap-6 lg:gap-8 hide-scrollbar">
                  {["description", "features", "instructions", "screenshots", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 sm:py-3 lg:py-4 px-1 sm:px-3 border-b-2 font-semibold text-sm transition-all duration-200 whitespace-nowrap ${activeTab === tab
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {tab === "reviews" && (approvedReviews.length + pendingReviews.length > 0) && (
                        <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                          {approvedReviews.length + pendingReviews.length}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>



              {/* Tab Content - improved responsive padding and layouts */}
              <div className="min-h-[250px] sm:min-h-[350px] animate-slideInUp" style={{ animationDelay: "800ms" }}>
                {activeTab === "description" && (
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 animate-slideInUp text-gray-900 dark:text-white">About This Project</h3>
                    <p
                      className="text-gray-700 dark:text-gray-300 dark:text-gray-300 leading-relaxed mb-4 sm:mb-8 text-sm sm:text-base animate-slideInUp"
                      style={{ animationDelay: "100ms" }}
                    >
                      {project.description}
                    </p>
                    <h4
                      className="text-base sm:text-xl font-bold mb-2 sm:mb-4 animate-slideInUp text-gray-900 dark:text-white"
                      style={{ animationDelay: "200ms" }}
                    >
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {Array.isArray(project.tech_stack) && project.tech_stack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-100 to-teal-100 dark:from-blue-900/30 dark:to-teal-900/30 text-blue-800 dark:text-blue-300 rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 animate-slideInUp"
                          style={{ animationDelay: `${300 + index * 80}ms` }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project?.tech_stack && project.tech_stack.length > 0 && (
                      <>
                        <h4
                          className="text-base sm:text-xl font-bold mb-2 sm:mb-4 mt-4 sm:mt-8 animate-slideInUp text-gray-900 dark:text-white"
                          style={{ animationDelay: "400ms" }}
                        >
                          Tags
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stack.map((tag, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 dark:text-gray-300 rounded-lg text-xs sm:text-sm animate-slideInUp"
                              style={{ animationDelay: `${500 + index * 50}ms` }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === "features" && (
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 animate-slideInUp text-gray-900 dark:text-white">Key Features</h3>
                    {project?.key_features && project.key_features.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                        {project.key_features &&
                          project.key_features.split(",").map((feature: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 sm:gap-4 p-2 sm:p-4 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl border border-blue-100 dark:border-slate-700 hover:shadow-md hover:scale-105 transition-all duration-200 animate-slideInUp"
                              style={{ animationDelay: `${100 + index * 80}ms` }}
                            >
                              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-pulse flex-shrink-0" />
                              <span className="text-gray-800 dark:text-gray-200 font-medium text-xs sm:text-base">{feature.trim()}</span>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-base">Features information not available.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "instructions" && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-6 gap-2">
                      <h3 className="text-lg sm:text-2xl font-bold animate-slideInUp text-gray-900 dark:text-white">Setup Instructions</h3>
                      {!isPurchased && (
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 sm:px-4 py-2 rounded-xl animate-slideInUp text-xs sm:text-sm border border-orange-200 dark:border-orange-800">
                          <Lock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                          <span className="font-semibold">Purchase to unlock full details</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 sm:space-y-6 animate-slideInUp" style={{ animationDelay: "100ms" }}>
                      {/* System Requirements - Always visible to everyone */}
                      {project?.requirements?.system_requirements &&
                        project.requirements.system_requirements.length > 0 && (
                          <div>
                            <h4 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-gray-200 dark:text-gray-200 flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              System Requirements
                              <span className="text-xs text-green-600 font-normal">(Public)</span>
                            </h4>
                            <ul className="space-y-2">
                              {project.requirements.system_requirements.map((req, index) => (
                                <li
                                  key={index}
                                  className="flex items-start gap-2 text-gray-700 dark:text-gray-300 dark:text-gray-300 text-xs sm:text-base"
                                >
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Dependencies - Only for purchasers */}
                      {isPurchased ? (
                        project?.requirements?.dependencies && project.requirements.dependencies.length > 0 && (
                          <div>
                            <h4 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-gray-200">
                              Dependencies
                            </h4>
                            <ul className="space-y-2">
                              {project.requirements.dependencies.map((dep, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 dark:text-gray-300 text-xs sm:text-base">
                                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300">{dep}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      ) : (
                        <div
                          onClick={handleUnlockContent}
                          className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 sm:p-6 border-2 border-dashed border-gray-300 dark:border-slate-600 relative overflow-hidden cursor-pointer hover:from-gray-100 hover:to-gray-200 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:border-gray-400 dark:hover:border-slate-500 transition-all"
                        >
                          <div className="absolute top-2 right-2">
                            <Lock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                          </div>
                          <h4 className="text-sm sm:text-lg font-semibold mb-3 text-gray-400 dark:text-gray-500 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Dependencies
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
                            <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse" />
                          </div>
                        </div>
                      )}

                      {/* Installation Steps - Only for purchasers */}
                      {isPurchased ? (
                        project?.requirements?.installation_steps &&
                        project.requirements.installation_steps.length > 0 && (
                          <div>
                            <h4 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-gray-200">
                              Installation Steps
                            </h4>
                            <ol className="space-y-2 sm:space-y-3">
                              {project.requirements.installation_steps.map((step, index) => (
                                <li key={index} className="flex gap-2 sm:gap-3">
                                  <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                                    {index + 1}
                                  </span>
                                  <span className="text-gray-700 dark:text-gray-300 dark:text-gray-300 text-xs sm:text-base">{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )
                      ) : (
                        <div
                          onClick={handleUnlockContent}
                          className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 sm:p-6 border-2 border-dashed border-gray-300 dark:border-slate-600 relative overflow-hidden cursor-pointer hover:from-gray-100 hover:to-gray-200 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:border-gray-400 dark:hover:border-slate-500 transition-all"
                        >
                          <div className="absolute top-2 right-2">
                            <Lock className="w-5 h-5 text-gray-400" />
                          </div>
                          <h4 className="text-sm sm:text-lg font-semibold mb-3 text-gray-400 dark:text-gray-500">Installation Steps</h4>
                          <div className="flex gap-3">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 font-bold flex-shrink-0">
                              1
                            </div>
                            <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
                          </div>
                        </div>
                      )}

                      {/* Source Files - Only for purchasers */}
                      {isPurchased ? (
                        project?.files?.source_files && project.files.source_files.length > 0 && (
                          <div>
                            <h4 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-gray-200 dark:text-gray-200 flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Source Files
                            </h4>
                            <div className="space-y-2">
                              {project.files.source_files.map((file, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleDownloadFile(file, `source-code-${index + 1}.zip`)}
                                  className="w-full flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md hover:scale-102 transition-all text-xs sm:text-sm"
                                >
                                  <Download className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">Download Source Code {index + 1}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      ) : (
                        <div
                          onClick={handleUnlockContent}
                          className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 sm:p-6 border-2 border-dashed border-gray-300 dark:border-slate-600 relative overflow-hidden cursor-pointer hover:from-gray-100 hover:to-gray-200 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:border-gray-400 dark:hover:border-slate-500 transition-all"
                        >
                          <div className="absolute top-2 right-2">
                            <Lock className="w-5 h-5 text-gray-400" />
                          </div>
                          <h4 className="text-sm sm:text-lg font-semibold mb-3 text-gray-400 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Source Files
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
                            <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse" />
                          </div>
                        </div>
                      )}

                      {/* Documentation Files - Only for purchasers */}
                      {isPurchased ? (
                        project?.files?.documentation_files && project.files.documentation_files.length > 0 && (
                          <div>
                            <h4 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 dark:text-gray-200 dark:text-gray-200 flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Documentation Files
                            </h4>
                            <div className="space-y-2">
                              {project.files.documentation_files.map((file, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleDownloadFile(file, `documentation-${index + 1}.pdf`)}
                                  className="w-full flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg border border-blue-200 dark:border-blue-700 hover:shadow-md hover:scale-102 transition-all text-xs sm:text-sm"
                                >
                                  <Download className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300 font-medium">Download Documentation {index + 1}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      ) : (
                        <div
                          onClick={handleUnlockContent}
                          className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 rounded-xl p-4 sm:p-6 border-2 border-dashed border-gray-300 dark:border-slate-600 relative overflow-hidden cursor-pointer hover:from-gray-100 hover:to-gray-200 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:border-gray-400 dark:hover:border-slate-500 transition-all"
                        >
                          <div className="absolute top-2 right-2">
                            <Lock className="w-5 h-5 text-gray-400" />
                          </div>
                          <h4 className="text-sm sm:text-lg font-semibold mb-3 text-gray-400 flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Documentation Files
                          </h4>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
                            <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse" />
                          </div>
                        </div>
                      )}


                    </div>
                  </div>
                )}

                {activeTab === "screenshots" && (
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6 animate-slideInUp text-gray-900 dark:text-white">
                      Project Screenshots
                    </h3>
                    {project?.images && project.images.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                        {/* Display all images including thumbnail */}
                        {project.images.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-video bg-gray-100 dark:bg-slate-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slideInUp"
                            style={{ animationDelay: `${100 + index * 100}ms` }}
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Screenshot ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 sm:py-8">
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-base">Screenshots not available.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-6 gap-2">
                      <h3 className="text-lg sm:text-2xl font-bold animate-slideInUp text-gray-900 dark:text-white">Reviews</h3>
                      <div className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 dark:text-gray-500">
                        <span className="font-semibold">{approvedReviews.length + pendingReviews.length}</span> total
                        {pendingReviews.length > 0 && (
                          <span className="ml-2 text-xs sm:text-sm text-orange-600">
                            ({pendingReviews.length} pending)
                          </span>
                        )}
                        {hasUserReviewed && (
                          <span className="ml-2 text-xs sm:text-sm text-blue-600">(You reviewed)</span>
                        )}
                      </div>
                    </div>

                    {/* Review Form - improved responsive form layout */}
                    {isAuthenticated && (
                      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-teal-900/20 rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-8 border border-blue-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-slideInUp">
                        {hasUserReviewed ? (
                          <div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">Your Review</h4>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">Manage your review for this project</p>
                              </div>
                            </div>
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/50 dark:border-slate-700/50 shadow-lg transition-colors">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 sm:w-6 sm:h-6 transition-all duration-200 ${i < (userReview?.rating || 0) ? "text-yellow-400 fill-current drop-shadow-sm" : "text-gray-300"}`}
                                      />
                                    ))}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                    <span
                                      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${userReview?.is_approved ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}
                                    >
                                      {userReview?.is_approved ? "✓ Approved" : "⏳ Pending"}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-500">
                                      {userReview ? new Date(userReview.created_at).toLocaleDateString() : ""}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                  <button
                                    onClick={() => handleEditReview(userReview!)}
                                    disabled={editingReviewId === userReview?.id || updatingReview}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-xs sm:text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                  >
                                    <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    {editingReviewId === userReview?.id ? "Editing" : "Edit"}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteReview(userReview!.id)}
                                    disabled={editingReviewId === userReview?.id || updatingReview}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 text-xs sm:text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                  >
                                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                              {editingReviewId === userReview?.id ? (
                                <div className="space-y-4 sm:space-y-6">
                                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 sm:p-4 border border-blue-100 dark:border-slate-600">
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">
                                      ⭐ Your Rating
                                    </label>
                                    <div className="flex gap-1 mb-2 sm:mb-4">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          type="button"
                                          key={star}
                                          onClick={() => setEditReviewRating(star)}
                                          className="focus:outline-none transform hover:scale-110 transition-all duration-200"
                                        >
                                          <Star
                                            className={`w-6 h-6 sm:w-8 sm:h-8 transition-all duration-200 ${star <= editReviewRating ? "text-yellow-400 fill-yellow-400 drop-shadow-md" : "text-gray-300 hover:text-yellow-300"}`}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                      {editReviewRating === 0 && "Click a star to rate"}
                                      {editReviewRating === 1 && "⭐ Poor"}
                                      {editReviewRating === 2 && "⭐⭐ Fair"}
                                      {editReviewRating === 3 && "⭐⭐⭐ Good"}
                                      {editReviewRating === 4 && "⭐⭐⭐⭐ Very Good"}
                                      {editReviewRating === 5 && "⭐⭐⭐⭐⭐ Excellent"}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 dark:text-gray-200 mb-2 sm:mb-3">
                                      💬 Your Feedback
                                    </label>
                                    <textarea
                                      value={editReviewText}
                                      onChange={(e) => setEditReviewText(e.target.value)}
                                      placeholder="Share your experience..."
                                      rows={4}
                                      className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-xs sm:text-base transition-all duration-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                      required
                                    />
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                      {editReviewText.length}/500 characters
                                    </div>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <button
                                      onClick={handleUpdateReview}
                                      disabled={updatingReview || !editReviewText.trim() || editReviewRating === 0}
                                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                    >
                                      {updatingReview ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      ) : (
                                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                                      )}
                                      {updatingReview ? "Updating" : "Save"}
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      disabled={updatingReview}
                                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                    >
                                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 sm:p-4 border border-gray-100 dark:border-slate-600">
                                  <p className="text-gray-700 dark:text-gray-300 text-xs sm:text-base leading-relaxed">
                                    {userReview?.review_text}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">Write a Review</h4>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 dark:text-gray-500">Share your experience</p>
                              </div>
                            </div>
                            <form onSubmit={handleSubmitReview} className="space-y-4 sm:space-y-6">
                              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 sm:p-6 border border-yellow-200 dark:border-slate-600">
                                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-4">
                                  ⭐ Rate this Project
                                </label>
                                <div className="flex gap-1 mb-2 sm:mb-4">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      type="button"
                                      key={star}
                                      onClick={() => setFormRating(star)}
                                      className="focus:outline-none transform hover:scale-110 transition-all duration-200"
                                    >
                                      <Star
                                        className={`w-7 h-7 sm:w-10 sm:h-10 transition-all duration-200 ${star <= formRating ? "text-yellow-400 fill-yellow-400 drop-shadow-md" : "text-gray-300 hover:text-yellow-300"}`}
                                      />
                                    </button>
                                  ))}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 dark:text-gray-400 font-medium">
                                  {formRating === 0 && "Click a star to rate"}
                                  {formRating === 1 && "⭐ Poor - Not recommended"}
                                  {formRating === 2 && "⭐⭐ Fair - Below expectations"}
                                  {formRating === 3 && "⭐⭐⭐ Good - Meets expectations"}
                                  {formRating === 4 && "⭐⭐⭐⭐ Very Good"}
                                  {formRating === 5 && "⭐⭐⭐⭐⭐ Excellent"}
                                </div>
                              </div>

                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 sm:p-6 border border-blue-200 dark:border-slate-600">
                                <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-4">
                                  💬 Share Your Experience
                                </label>
                                <textarea
                                  value={reviewText}
                                  onChange={(e) => setReviewText(e.target.value)}
                                  placeholder="Tell others about your experience..."
                                  rows={5}
                                  className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-xs sm:text-base transition-all duration-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                  required
                                />
                                <div className="flex justify-between items-center mt-2">
                                  <div className="text-xs text-gray-500">{reviewText.length}/500 characters</div>
                                  <div className="text-xs text-gray-500">
                                    {reviewText.length > 50 ? "✓ Good" : "Add more details"}
                                  </div>
                                </div>
                              </div>

                              <button
                                type="submit"
                                disabled={submittingReview || !reviewText.trim() || formRating === 0}
                                className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                              >
                                {submittingReview ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                )}
                                {submittingReview ? "Submitting" : "Submit Review"}
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    )}



                    {/* Reviews List - improved responsive review cards */}
                    <div className="space-y-3 sm:space-y-6">
                      {[...pendingReviews, ...approvedReviews].filter((review) => !user || review.user.id !== user.id)
                        .length === 0 ? (
                        <div className="text-center py-6 sm:py-12">
                          <MessageSquare className="w-10 h-10 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                          <h4 className="text-sm sm:text-lg font-semibold text-gray-600 dark:text-gray-300 dark:text-gray-400 mb-2">No reviews yet</h4>
                          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-base">Be the first to review!</p>
                        </div>
                      ) : (
                        [...pendingReviews, ...approvedReviews]
                          .filter((review) => !user || review.user.id !== user.id)
                          .map((review, index) => (
                            <div
                              key={review.id}
                              className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl border transition-all duration-300 ${review.is_approved ? "border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800" : "border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-700"} animate-slideInUp`}
                              style={{ animationDelay: `${index * 100}ms` }}
                            >
                              <div className="flex flex-col sm:flex-row items-start justify-between mb-4 sm:mb-6 gap-3">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-10 h-10 sm:w-12 sm:h-12 ${review.is_approved ? "bg-gradient-to-br from-blue-500 to-teal-500" : "bg-gradient-to-br from-orange-500 to-red-500"} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg text-xs sm:text-sm`}
                                  >
                                    <span className="text-white font-bold">{review.user.full_name.charAt(0)}</span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100 text-sm sm:text-lg truncate">
                                      {review.user.full_name}
                                    </h5>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">
                                      {new Date(review.created_at).toLocaleDateString()}
                                    </p>
                                    <div className="flex flex-wrap gap-1 sm:gap-2">
                                      <span
                                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${review.is_verified_purchase ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400"}`}
                                      >
                                        {review.is_verified_purchase ? "✓ Verified Buyer" : "✗ Not Verified Buyer"}
                                      </span>
                                      <span
                                        className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${review.is_approved ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"}`}
                                      >
                                        {review.is_approved ? "✓ Verified Review" : "⏳ Yet to Verify"}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {canEditReview(review) && (
                                    <button
                                      onClick={() => handleEditReview(review)}
                                      disabled={editingReviewId === review.id || updatingReview}
                                      className="p-1 sm:p-2 text-gray-400 hover:text-blue-500 transition-all duration-200 hover:bg-blue-50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 text-xs sm:text-sm"
                                      title="Edit review"
                                    >
                                      <Edit2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                  )}
                                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 sm:px-3 py-1 sm:py-2 rounded-xl border border-yellow-200 dark:border-yellow-800">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 sm:w-4 sm:h-4 ${i < review.rating ? "text-yellow-400 fill-current drop-shadow-sm" : "text-gray-300 dark:text-gray-600"}`}
                                      />
                                    ))}
                                    <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                                      {review.rating}/5
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {editingReviewId === review.id ? (
                                <div className="space-y-4 sm:space-y-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-6 border border-blue-200">
                                  <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 dark:text-gray-200 mb-2 sm:mb-3">
                                      ⭐ Update Your Rating
                                    </label>
                                    <div className="flex gap-1 mb-2 sm:mb-4">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          type="button"
                                          key={star}
                                          onClick={() => setEditReviewRating(star)}
                                          className="focus:outline-none transform hover:scale-110 transition-all duration-200"
                                        >
                                          <Star
                                            className={`w-6 h-6 sm:w-8 sm:h-8 transition-all duration-200 ${star <= editReviewRating ? "text-yellow-400 fill-yellow-400 drop-shadow-md" : "text-gray-300 hover:text-yellow-300"}`}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 dark:text-gray-200 mb-2 sm:mb-3">
                                      💬 Update Feedback
                                    </label>
                                    <textarea
                                      value={editReviewText}
                                      onChange={(e) => setEditReviewText(e.target.value)}
                                      placeholder="Share your detailed experience..."
                                      rows={4}
                                      className="w-full px-2 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-xs sm:text-base transition-all duration-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                      required
                                    />
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                    <button
                                      onClick={handleUpdateReview}
                                      disabled={updatingReview || !editReviewText.trim() || editReviewRating === 0}
                                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                    >
                                      {updatingReview ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      ) : (
                                        <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                                      )}
                                      {updatingReview ? "Updating" : "Save"}
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      disabled={updatingReview}
                                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                    >
                                      <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-xl p-3 sm:p-4 border border-gray-100 dark:border-slate-600">
                                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-xs sm:text-base">
                                    {review.review_text}
                                  </p>
                                </div>
                              )}
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - improved responsive sidebar with better mobile layout */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-2">
            {/* Purchase Card */}
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/30 dark:border-slate-700/30 animate-slideInRight transition-colors">
              {/* Pricing - Hide when in referral-only mode */}
              {showPaymentUI && (
                <div className="text-center mb-4 sm:mb-8">
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4 animate-slideInUp">
                    {project.isDemo ? (
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        FREE
                      </div>
                    ) : (
                      <>
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
                          ₹{project.pricing?.sale_price || 0}
                        </div>
                        {project.pricing?.original_price &&
                          project.pricing.original_price > (project.pricing?.sale_price || 0) && (
                            <div className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 line-through">
                              ₹{project.pricing.original_price}
                            </div>
                          )}
                      </>
                    )}
                  </div>
                  {!project.isDemo && project.discount_percentage && project.discount_percentage > 0 && (
                    <div className="text-xs sm:text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full inline-block animate-pulse">
                      Save {project.discount_percentage}%
                    </div>
                  )}
                </div>
              )}

              {/* Stats */}
              <div
                className="space-y-2 sm:space-y-3 mb-4 sm:mb-8 animate-slideInUp text-xs sm:text-sm"
                style={{ animationDelay: "200ms" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-300 dark:text-gray-400 flex items-center gap-1 sm:gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> Expected Timeline
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{project.delivery_time} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-500">Total Sales</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{project.purchase_count || 0}</span>
                </div>
              </div>

              {/* Buy / Wishlist / Cart Buttons */}
              {!isPurchased ? (
                <div className="flex flex-col space-y-2 sm:space-y-3 mb-4 sm:mb-8">
                  {/* Priority 1: Credit download if authenticated user has credits */}
                  {isAuthenticated && !project.isDemo && availableCredits > 0 ? (
                    <CreditDownloadButton
                      projectId={project.id}
                      onSuccess={async () => {
                        // Refresh project data to update purchase status
                        await fetchProjectData();
                        // Also refresh credits
                        await refreshCredits();
                      }}
                    />
                  ) : isAuthenticated && !project.isDemo && availableCredits === 0 && showCreditUI ? (
                    /* Priority 2: Show payment options FIRST, then referral CTA when out of credits */
                    <>
                      {/* Buy Now / Checkout Button */}
                      <button
                        onClick={async () => {
                          if (!isAuthenticated) {
                            openAuthModal(true);
                            return;
                          }

                          if (cartStatus) {
                            navigate("/cart")
                          } else {
                            // If not in cart, add to cart then open cart
                            const added = await addToCart(project);
                            if (added) {
                              navigate("/cart")
                            }
                          }
                        }}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 sm:py-3 lg:py-4 rounded-xl font-bold text-xs sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slideInUp disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ animationDelay: "300ms" }}
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {loading
                            ? "Processing..."
                            : cartStatus
                              ? "Checkout"
                              : `Buy Now (₹${project.pricing?.sale_price || 0})`}
                        </span>
                      </button>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => {
                          if (!isAuthenticated) {
                            openAuthModal(true);
                            return;
                          }
                          handleToggleWishlist();
                        }}
                        disabled={project.isDemo}
                        className={`w-full flex items-center justify-center gap-2 sm:gap-3 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 animate-slideInUp text-xs sm:text-base ${project.isDemo
                          ? "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 hover:scale-105"
                          }`}
                        style={{ animationDelay: "350ms" }}
                      >
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="line-clamp-1">{wishlistStatus ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                      </button>

                      {/* Add/Remove Cart Button */}
                      <button
                        onClick={() => {
                          if (project.isDemo) {
                            toast.error("🎁 Demo projects are for preview only. Explore our full catalog to purchase!");
                            return;
                          }
                          if (!isAuthenticated) {
                            openAuthModal(true);
                            return;
                          }
                          if (cartStatus) removeFromCart(project.id);
                          else addToCart(project);
                        }}
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 sm:gap-3 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 animate-slideInUp text-xs sm:text-base ${project.isDemo
                          ? "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          }`}
                        style={{ animationDelay: "380ms" }}
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="line-clamp-1">{cartStatus ? "Remove from Cart" : "Add to Cart"}</span>
                      </button>

                      {/* Divider with "OR" text */}
                      <div className="relative flex items-center justify-center my-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300 dark:border-slate-600"></div>
                        </div>
                        <div className="relative px-4 bg-white dark:bg-slate-900 text-sm text-gray-500 dark:text-gray-400 font-semibold">
                          OR
                        </div>
                      </div>

                      {/* Referral CTA at the bottom */}
                      <ReferralCTA />
                    </>
                  ) : (
                    /* Priority 3: Always show payment UI for unauthenticated users or when payment is enabled */
                    <>
                      {/* Buy Now / Checkout Button */}
                      <button
                        onClick={async () => {
                          if (!isAuthenticated) {
                            openAuthModal(true);
                            return;
                          }

                          if (cartStatus) {
                            navigate("/cart")
                          } else {
                            // If not in cart, add to cart then open cart
                            const added = await addToCart(project);
                            if (added) {
                              navigate("/cart")
                            }
                          }
                        }}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2 sm:py-3 lg:py-4 rounded-xl font-bold text-xs sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slideInUp disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ animationDelay: "300ms" }}
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                        <span className="line-clamp-1">
                          {project.isDemo
                            ? "View Demo (Free)"
                            : isAuthenticated
                              ? loading
                                ? "Processing..."
                                : cartStatus
                                  ? "Checkout"
                                  : `Buy (₹${project.pricing?.sale_price || 0})`
                              : "Login to Buy"}
                        </span>
                      </button>

                      {/* Wishlist Button */}
                      <button
                        onClick={() => {
                          if (!isAuthenticated) {
                            openAuthModal(true);
                            return;
                          }
                          handleToggleWishlist();
                        }}
                        disabled={project.isDemo}
                        className={`w-full flex items-center justify-center gap-2 sm:gap-3 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 animate-slideInUp text-xs sm:text-base ${project.isDemo
                          ? "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 hover:scale-105"
                          }`}
                        style={{ animationDelay: "350ms" }}
                      >
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="line-clamp-1">{wishlistStatus ? "Remove from Wishlist" : "Add to Wishlist"}</span>
                      </button>

                      {/* Add/Remove Cart Button */}
                      <button
                        onClick={() => {
                          if (project.isDemo) {
                            toast.error("🎁 Demo projects are for preview only. Explore our full catalog to purchase!");
                            return;
                          }
                          if (!isAuthenticated) {
                            openAuthModal(true);
                            return;
                          }
                          if (cartStatus) removeFromCart(project.id);
                          else addToCart(project);
                        }}
                        disabled={loading}
                        className={`w-full flex items-center justify-center gap-2 sm:gap-3 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-200 animate-slideInUp text-xs sm:text-base ${project.isDemo
                          ? "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          }`}
                        style={{ animationDelay: "380ms" }}
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span className="line-clamp-1">{cartStatus ? "Remove from Cart" : "Add to Cart"}</span>
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-8">
                  <div className="text-center text-green-600 font-bold text-xs sm:text-base mb-2 sm:mb-4 bg-green-100 py-2 sm:py-3 rounded-xl animate-slideInUp">
                    ✅ Purchased
                  </div>
                  <button
                    onClick={() => setIsDownloadModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 sm:py-3 lg:py-4 rounded-xl font-bold text-xs sm:text-base lg:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slideInUp">
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                    Download Files
                  </button>
                </div>
              )}


              {/* Features */}
              <div
                className="space-y-1 sm:space-y-2 text-center text-xs text-gray-600 dark:text-gray-300 dark:text-gray-400 animate-slideInUp"
                style={{ animationDelay: "400ms" }}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span>Access with all features</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span>Source code included</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                  <span>Documentation provided</span>
                </div>

              </div>
            </div>

            {/* Tutorial Request - Coming Soon */}
            <div
              className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-purple-200/50 dark:border-purple-700/30 animate-slideInRight transition-colors overflow-hidden relative"
              style={{ animationDelay: "350ms" }}
            >
              {/* Decorative background gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl -z-0"></div>

              <div className="relative z-10">
                {/* Coming Soon Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    COMING SOON
                  </span>
                </div>

                {/* Icon and Title */}
                <div className="flex items-start gap-3 sm:gap-4 mb-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                    <svg
                      className="w-6 h-6 sm:w-7 sm:h-7 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-1.5">
                      Want to Learn This?
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      Soon you'll be able to request personalized lessons and tutorials for this project!
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2 mb-4 sm:mb-5">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Step-by-step video tutorials</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                    <span>Q&A sessions with author</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Live code walkthroughs</span>
                  </div>
                </div>


              </div>
            </div>

            {/* Author Details */}
            <div
              className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/30 dark:border-slate-700/30 animate-slideInRight transition-colors"
              style={{ animationDelay: "450ms" }}
            >
              <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">About the Author</h3>

              {/* Author Info */}
              <div className="text-center mb-6">
                {/* Avatar */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg overflow-hidden">
                  {authorDetails?.avatar ? (
                    <img
                      src={authorDetails.avatar || "/placeholder.svg"}
                      alt={authorDetails.full_name || "Author"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-xl sm:text-2xl lg:text-3xl">
                      {authorDetails?.full_name?.charAt(0)?.toUpperCase() || "A"}
                    </span>
                  )}
                </div>

                {/* Name */}
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {authorDetails?.full_name || "Author"}
                </h4>

                {/* Stats Row */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
                  {/* Projects */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Projects</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                      {authorDetails?.total_projects || 0}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-10 w-px bg-gray-300 dark:bg-gray-600"></div>

                  {/* Rating */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                      <span>Rating</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                      {authorDetails?.rating ? authorDetails.rating.toFixed(1) : "0.0"}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-10 w-px bg-gray-300 dark:bg-gray-600"></div>

                  {/* Sales */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 mb-1">
                      <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Sales</span>
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                      {authorDetails?.total_sales || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Link - Priority: LinkedIn > GitHub > Twitter */}
              {authorDetails?.social_links && (
                (() => {
                  const { linkedin, github, twitter } = authorDetails.social_links;
                  const socialLink = linkedin || github || twitter;
                  const SocialIcon = linkedin ? Linkedin : github ? Github : Twitter;
                  const platform = linkedin ? 'LinkedIn' : github ? 'GitHub' : 'Twitter';

                  if (!socialLink) return null;

                  // Check if user is authenticated
                  if (!isAuthenticated) {
                    return (
                      <button
                        onClick={() => openAuthModal(true)}
                        className="w-full flex items-center justify-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                      >
                        <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-xs sm:text-sm font-semibold">Login to Connect</span>
                      </button>
                    );
                  }

                  // Show social link for authenticated users
                  return (
                    <a
                      href={socialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white rounded-xl transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
                      title={`Connect on ${platform}`}
                    >
                      <SocialIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-semibold">Connect on {platform}</span>
                    </a>
                  );
                })()
              )}
            </div>
          </div>
        </div>

        {/* Related Projects - improved responsive grid and card layout */}
        {!project.isDemo && relatedProjects && relatedProjects.length > 0 && (
          <div
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/30 dark:border-slate-700/30 animate-slideInRight transition-colors"
            style={{ animationDelay: "400ms" }}
          >
            <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-6 text-gray-900 dark:text-white">Related Projects</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {relatedProjects.map((relatedProject, idx) => (
                <Link
                  key={relatedProject.id}
                  to={`/project/${relatedProject.id}`}
                  className="group p-3 sm:p-4 bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-300 animate-slideInUp flex flex-col"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative mb-2 sm:mb-3 overflow-hidden rounded-xl">
                    <img
                      src={relatedProject.thumbnail || "/placeholder.svg"}
                      alt={relatedProject.title}
                      className="w-full h-24 sm:h-32 lg:h-36 object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-white/90 dark:bg-slate-800/90 text-blue-600 dark:text-blue-400 text-xs font-medium px-2 py-1 rounded-md shadow">
                      {relatedProject.category || "General"}
                    </span>
                  </div>

                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 dark:text-gray-100 text-xs sm:text-sm lg:text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {relatedProject.title}
                  </h4>

                  <p className="text-xs text-gray-600 dark:text-gray-300 dark:text-gray-400 mb-2 line-clamp-2">
                    {relatedProject.description || "A creative and well-built project."}
                  </p>

                  <div className="flex items-center justify-between text-xs sm:text-sm mt-auto mb-2">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 dark:text-gray-500">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current flex-shrink-0" />
                      <span>{relatedProject.rating?.average_rating?.toFixed(1) || "0.0"}</span>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">₹{relatedProject.pricing?.sale_price || 0}</span>
                      {relatedProject.pricing?.original_price && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 line-through hidden sm:inline">
                          ₹{relatedProject.pricing.original_price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-xs text-blue-600 font-medium group-hover:underline">View Details →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <DownloadFilesModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        sourceFiles={project?.files?.source_files || []}
        documentationFiles={project?.files?.documentation_files || []}
        onDownload={handleDownloadFile}
      />

      <UnlockOptionsModal
        isOpen={isUnlockModalOpen}
        onClose={() => setIsUnlockModalOpen(false)}
        projectId={id || ''}
      />

      {/* Animations */}
      <style>{`
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInUp { animation: slideInUp 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes slideInDown {
          0% { opacity: 0; transform: translateY(-40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInDown { animation: slideInDown 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInLeft { animation: slideInLeft 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out both; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default ProjectDetail
