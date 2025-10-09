import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Download, Lock, ShoppingCart, Heart, Share2, Eye, Calendar, Award, Clock, Shield, CheckCircle, MessageSquare, Send, Github, ExternalLink, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { Project, Review } from '../types/Project';
import type { Transaction } from '../types/Transaction';
import toast from 'react-hot-toast';

interface UserStatus {
  has_purchased: boolean;
  in_wishlist: boolean;
  in_cart: boolean;
}

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [averageRating, setAverageRating] = useState(0);
  const [formRating, setFormRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editReviewText, setEditReviewText] = useState('');
  const [editReviewRating, setEditReviewRating] = useState(0);
  const [updatingReview, setUpdatingReview] = useState(false);



  // Fetch project data on component mount
  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  useEffect(() => {
    checkIsPurchased();
  }, [project, user]);

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews();
    }
  }, [activeTab]);

  const fetchProjectData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://projxchange-backend-v1.vercel.app/projects/${id}`, {
        method: 'GET',
      });

      if (!res.ok) {
        console.error('Project API response not ok:', res.status, res.statusText);
        throw new Error(`Failed to fetch project data: ${res.status}`);
      }

      const data = await res.json();
      setProject(data.project);
      setUserStatus(data.user_status);
    } catch (err) {
      console.error('Error fetching project data:', err);
      setError('Could not load project details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };


  const fetchReviews = async () => {
    try {
      const response = await fetch(`https://projxchange-backend-v1.vercel.app/projects/${id}/reviews`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();


        // Separate approved and pending reviews
        const allReviews = data.reviews || [];
        const approved = allReviews.filter((review: Review) => review.is_approved);
        const pending = allReviews.filter((review: Review) => !review.is_approved);

        setApprovedReviews(approved);
        setPendingReviews(pending);
        setAverageRating(data.stats.average_rating);

      } else {
        console.error('Reviews API response not ok:', response.status, response.statusText);
        setApprovedReviews([]);
        setPendingReviews([]);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setApprovedReviews([]);
      setPendingReviews([]);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim() || !project || formRating === 0) return; // must select rating

    setSubmittingReview(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://projxchange-backend-v1.vercel.app/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: id,
          rating: formRating, // <-- now dynamic
          review_text: reviewText,
        }),
      });

      if (response.ok) {
        setReviewText('');
        setFormRating(0); // reset stars
        toast.success('Review submitted successfully!');

        // Refresh reviews from backend after successful submission
        await fetchReviews();
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Helper function to check if user can edit a review
  const canEditReview = (review: Review) => {
    return isAuthenticated && user && user.id === review.user.id && localStorage.getItem('token');
  };

  const checkIsPurchased = () => {
    const currentUserId = user?.id || '';
    if (!project || !currentUserId) return;
    const hasBought = Array.isArray((project as any)?.buyers) && (project as any).buyers.includes(currentUserId);
    if (hasBought) {
      setUserStatus(prev => ({ ...(prev || { has_purchased: false, in_wishlist: false, in_cart: false }), has_purchased: true }));
      console.log('User has purchased the project');
    }

  };

  // Helper function to check if current user has already submitted a review
  const getUserReview = () => {
    if (!isAuthenticated || !user) return null;
    const allReviews = [...approvedReviews, ...pendingReviews];
    return allReviews.find(review => review.user.id === user.id) || null;
  };

  // Check if user has already reviewed
  const userReview = getUserReview();
  const hasUserReviewed = !!userReview;

  const handleEditReview = (review: Review) => {
    // Double-check permissions before allowing edit
    if (!canEditReview(review)) {
      toast.error('You can only edit your own reviews.');
      return;
    }

    setEditingReviewId(review.id);
    setEditReviewText(review.review_text);
    setEditReviewRating(review.rating);

  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditReviewText('');
    setEditReviewRating(0);
  };

  const handleUpdateReview = async () => {
    if (!editReviewText.trim() || editReviewRating === 0) return;

    // Check if user is authenticated and token is available
    if (!isAuthenticated || !user) {
      alert('Please log in to edit your review.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      return;
    }

    setUpdatingReview(true);
    try {
      const response = await fetch(`https://projxchange-backend-v1.vercel.app/reviews/${editingReviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: editReviewRating,
          review_text: editReviewText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      const data = await response.json();

      // Update the reviews in state
      setApprovedReviews(prev => prev.map(review =>
        review.id === editingReviewId ? { ...review, ...data.review, rating: editReviewRating, review_text: editReviewText } : review
      ));
      setPendingReviews(prev => prev.map(review =>
        review.id === editingReviewId ? { ...review, ...data.review, rating: editReviewRating, review_text: editReviewText } : review
      ));

      toast.success('Review updated successfully!');
      handleCancelEdit();
      // Refresh reviews to update the user review display
      await fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review. Please try again.');
    } finally {
      setUpdatingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!isAuthenticated || !user) {
      alert('Please log in to delete your review.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete your review? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://projxchange-backend-v1.vercel.app/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      // Remove the review from state
      setApprovedReviews(prev => prev.filter(review => review.id !== reviewId));
      setPendingReviews(prev => prev.filter(review => review.id !== reviewId));

      toast.success('Review deleted successfully!');
    } catch (error) {
      alert('Failed to delete review. Please try again.');
    }
  };


  const handlePurchase = async () => {
    if (!isAuthenticated || !project || !id) return;
    try {
      setIsPurchasing(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to continue.');
        return;
      }

      // Step 1: Purchase project
      const purchaseRes = await fetch(`https://projxchange-backend-v1.vercel.app/projects/${id}/purchase`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!purchaseRes.ok) {
        const errText = await purchaseRes.text();
        throw new Error(errText || 'Purchase failed');
      }

      // Step 2: Record transaction (DB-aligned schema)
      const currentUserId = user?.id;
      if (!currentUserId) {
        alert('Please log in to continue.');
        return;
      }
      const nowIso = new Date().toISOString();
      const amountStr = String(project.pricing?.sale_price ?? '0');
      const commission = '0';
      const authorAmount = amountStr; // adjust if commission applies

      const transactionBody: Partial<Transaction> = {
        transaction_id: (crypto && 'randomUUID' in crypto) ? crypto.randomUUID() : `${Date.now()}`,
        user_id: currentUserId,
        project_id: project.id,
        author_id: project.author_id,
        type: 'purchase',
        status: 'success',
        amount: amountStr,
        currency: project.pricing?.currency || 'INR',
        payment_method: 'manual',
        payment_gateway_response: 'N/A',
        commission_amount: commission,
        author_amount: authorAmount,
        metadata: JSON.stringify({ projectTitle: project.title }),
        processed_at: nowIso,
        created_at: nowIso,
        updated_at: nowIso,
      };

      const txnRes = await fetch('https://projxchange-backend-v1.vercel.app/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transactionBody)
      });

      if (!txnRes.ok) {
        const errText = await txnRes.text();
        throw new Error(errText || 'Failed to record transaction');
      }

      // Refresh user status/UI
      setUserStatus(prev => ({
        has_purchased: true,
        in_wishlist: prev?.in_wishlist || false,
        in_cart: prev?.in_cart || false
      }));

      alert('Purchase successful! You now have access to the project.');
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Failed to complete purchase. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const relatedProjects = [
    {
      id: 2,
      title: 'React Task Manager',
      price: 22,
      originalPrice: 35,
      rating: 4.6,
      thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      price: 35,
      originalPrice: 55,
      rating: 4.7,
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading project details...</p>
        </div>
      </div>
    );
  }


  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-4 text-center">{error || 'The project you are looking for does not exist.'}</p>
          <Link to="/projects" className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const isPurchased = Boolean(
    userStatus?.has_purchased ||
    (Array.isArray((project as any)?.buyers) && user?.id ? (project as any).buyers.includes(user.id) : false)
  );
  const wishlistStatus = project ? (userStatus?.in_wishlist || isInWishlist(project.id)) : false;
  const cartStatus = project ? (userStatus?.in_cart || isInCart(project.id)) : false;

  const handleToggleWishlist = async () => {
    if (!isAuthenticated || !project) {
      alert('Please login to manage wishlist.');
      return;
    }
    try {
      if (wishlistStatus) {
        await removeFromWishlist(project.id);
        setUserStatus(prev => prev ? { ...prev, in_wishlist: false } : prev);
      } else {
        await addToWishlist(project);
        setUserStatus(prev => prev ? { ...prev, in_wishlist: true } : prev);
      }
    } catch (e) {
      console.error('Wishlist toggle failed', e);
    }
  };

  const handleToggleCart = async () => {
    if (!isAuthenticated || !project) {
      alert('Please login to manage cart.');
      return;
    }
    try {
      if (cartStatus) {
        await removeFromCart(project.id);
        setUserStatus(prev => prev ? { ...prev, in_cart: false } : prev);
      } else {
        await addToCart(project);
        setUserStatus(prev => prev ? { ...prev, in_cart: true } : prev);
      }
    } catch (e) {
      console.error('Cart toggle failed', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-4 sm:py-6 lg:py-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6 animate-slideInDown">
          <nav className="flex text-xs sm:text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/projects" className="hover:text-blue-600 transition-colors duration-200">Projects</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate">{project.title}</span>
          </nav>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-1 lg:order-1">
            {/* Project Header */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl mb-6 lg:mb-10 border border-white/30 animate-slideInLeft">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full text-xs sm:text-sm font-bold shadow-sm animate-slideInUp">
                    {project.category}
                  </span>
                  {project.is_featured && (
                    <span className="px-3 sm:px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-full text-xs sm:text-sm font-bold flex items-center shadow-sm animate-slideInUp" style={{ animationDelay: '100ms' }}>
                      <Award className="w-3 h-3 mr-1" />
                      Featured
                    </span>
                  )}
                  <span className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs sm:text-sm font-bold shadow-sm animate-slideInUp" style={{ animationDelay: '150ms' }}>
                    {project.difficulty_level}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 justify-start sm:justify-end">
                  <button onClick={handleToggleWishlist} className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-red-500 transition-all duration-200 rounded-xl hover:bg-red-50 hover:scale-105 animate-slideInUp text-xs sm:text-sm" style={{ animationDelay: '200ms' }}>
                    <Heart className={`w-4 sm:w-5 h-4 sm:h-5 ${wishlistStatus ? 'text-red-500 fill-current' : ''}`} />
                    <span className="font-medium hidden sm:inline">{wishlistStatus ? 'Wishlisted' : 'Wishlist'}</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-blue-500 transition-all duration-200 rounded-xl hover:bg-blue-50 hover:scale-105 animate-slideInUp text-xs sm:text-sm" style={{ animationDelay: '300ms' }}>
                    <Share2 className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span className="font-medium hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 animate-slideInUp leading-tight" style={{ animationDelay: '400ms' }}>{project.title}</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 animate-slideInUp" style={{ animationDelay: '500ms' }}>
                <div className="flex items-center gap-2">
                  <Star className="w-4 sm:w-5 h-4 sm:h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-base sm:text-lg">{averageRating || '0.0'}</span>
                  <span className="font-medium">({(approvedReviews.length + pendingReviews.length) || 0})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="font-medium">{project?.stats?.total_views || project.view_count || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="font-medium">{project.purchase_count} sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="font-medium">{project?.stats?.total_downloads || project.download_count || 0}</span>
                </div>
                {/* Status badges */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-5 flex flex-wrap gap-2 mt-1">
                  {isPurchased && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Purchased</span>
                  )}
                  {cartStatus && !isPurchased && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">In Cart</span>
                  )}
                  {wishlistStatus && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">In Wishlist</span>
                  )}
                </div>
                {/* Status badges */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-5 flex flex-wrap gap-2 mt-1">
                  {isPurchased && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Purchased</span>
                  )}
                  {cartStatus && !isPurchased && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">In Cart</span>
                  )}
                  {wishlistStatus && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">In Wishlist</span>
                  )}
                </div>
              </div>

              {/* Demo Video */}
              {project?.demo_url && (
                <div
                  className="aspect-video bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden mb-6 sm:mb-8 shadow-2xl animate-slideInUp hover:shadow-3xl transition-shadow duration-300"
                  style={{ animationDelay: '600ms' }}
                >
                  <iframe
                    src={
                      project.demo_url.includes("watch?v=")
                        ? project.demo_url.replace("watch?v=", "embed/")
                        : project.demo_url.includes("youtu.be")
                          ? project.demo_url.replace("https://youtu.be/", "https://www.youtube.com/embed/")
                          : project.demo_url
                    }
                    title="Project Demo"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* External Links */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 animate-slideInUp" style={{ animationDelay: '650ms' }}>
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors duration-200 text-sm w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <Github className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span>View Source</span>
                  </a>
                )}
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm w-full sm:w-auto justify-center sm:justify-start"
                  >
                    <ExternalLink className="w-4 sm:w-5 h-4 sm:h-5" />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6 sm:mb-2 animate-slideInUp overflow-x-auto" style={{ animationDelay: '700ms' }}>
                <nav className="flex space-x-4 sm:space-x-8 min-w-max">
                  {['description', 'features', 'instructions', 'screenshots', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-3 sm:py-4 px-2 border-b-2 font-semibold text-xs sm:text-sm transition-colors animate-fadeInUp whitespace-nowrap ${activeTab === tab
                        ? 'border-blue-500 text-blue-600 scale-105'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:scale-105'
                        }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {tab === 'reviews' && (approvedReviews.length + pendingReviews.length) > 0 && (
                        <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                          {approvedReviews.length + pendingReviews.length}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px] sm:min-h-[400px] animate-slideInUp" style={{ animationDelay: '800ms' }}>
                {activeTab === 'description' && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 animate-slideInUp">About This Project</h3>
                    <p className="text-gray-700 leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg animate-slideInUp" style={{ animationDelay: '100ms' }}>{project.description}</p>
                    <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 animate-slideInUp" style={{ animationDelay: '200ms' }}>Tech Stack</h4>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {project.tech_stack.map((tech, index) => (
                        <span key={index} className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-800 rounded-xl text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 animate-slideInUp" style={{ animationDelay: `${300 + index * 80}ms` }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                    {project?.tags && project.tags.length > 0 && (
                      <>
                        <h4 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 mt-6 sm:mt-8 animate-slideInUp" style={{ animationDelay: '400ms' }}>Tags</h4>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {project.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs sm:text-sm animate-slideInUp" style={{ animationDelay: `${500 + index * 50}ms` }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'features' && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 animate-slideInUp">Key Features</h3>
                    {project?.features && project.features.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                        {project.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-100 hover:shadow-md hover:scale-105 transition-all duration-200 animate-slideInUp" style={{ animationDelay: `${100 + index * 80}ms` }}>
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-pulse flex-shrink-0" />
                            <span className="text-gray-800 font-medium text-sm sm:text-base">{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500">Features information not available.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'instructions' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                      <h3 className="text-xl sm:text-2xl font-bold animate-slideInUp">Setup Instructions</h3>
                      {!isPurchased && (
                        <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-3 sm:px-4 py-2 rounded-xl animate-slideInUp text-sm">
                          <Lock className="w-4 sm:w-5 h-4 sm:h-5" />
                          <span className="font-medium">Purchase to unlock</span>
                        </div>
                      )}
                    </div>
                    <div className={`${!isPurchased ? 'filter blur-sm' : ''} animate-slideInUp transition-all duration-300`} style={{ animationDelay: '100ms' }}>
                      {isPurchased ? (
                        <div className="space-y-4 sm:space-y-6">
                          {/* System Requirements */}
                          {project?.requirements?.system_requirements && project.requirements.system_requirements.length > 0 && (
                            <div>
                              <h4 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">System Requirements</h4>
                              <ul className="space-y-2">
                                {project.requirements.system_requirements.map((req, index) => (
                                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Dependencies */}
                          {project?.requirements?.dependencies && project.requirements.dependencies.length > 0 && (
                            <div>
                              <h4 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">Dependencies</h4>
                              <ul className="space-y-2">
                                {project.requirements.dependencies.map((dep, index) => (
                                  <li key={index} className="flex items-start gap-2 text-gray-700 text-sm sm:text-base">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-gray-700">{dep}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Installation Steps */}
                          {project?.requirements?.installation_steps && project.requirements.installation_steps.length > 0 && (
                            <div>
                              <h4 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">Installation Steps</h4>
                              <ol className="space-y-3">
                                {project.requirements.installation_steps.map((step, index) => (
                                  <li key={index} className="flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold">
                                      {index + 1}
                                    </span>
                                    <span className="text-gray-700 text-sm sm:text-base">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Documentation */}
                          {project.documentation && (
                            <div>
                              <h4 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">Documentation</h4>
                              <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 font-mono text-xs sm:text-sm shadow-2xl overflow-x-auto">
                                <pre className="whitespace-pre-wrap text-green-400">
                                  {project.documentation}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8 sm:py-12">
                          <Lock className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
                          <h4 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">Instructions Locked</h4>
                          <p className="text-gray-500 text-sm sm:text-base">Purchase this project to unlock detailed setup instructions and documentation.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'screenshots' && (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 animate-slideInUp">Project Screenshots</h3>
                    {project?.images && project.images.length > 0 ? (
                      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                        {project.images.map((image, index) => (
                          <div key={index} className="aspect-video bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slideInUp" style={{ animationDelay: `${100 + index * 100}ms` }}>
                            <img
                              src={image}
                              alt={`Screenshot ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 text-sm sm:text-base">Screenshots not available.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                      <h3 className="text-xl sm:text-2xl font-bold animate-slideInUp">Reviews</h3>
                      <div className="text-base sm:text-lg text-gray-600">
                        <span className="font-semibold">{approvedReviews.length + pendingReviews.length}</span> total
                        {pendingReviews.length > 0 && (
                          <span className="ml-2 text-sm text-orange-600">
                            ({pendingReviews.length} pending)
                          </span>
                        )}
                        {hasUserReviewed && (
                          <span className="ml-2 text-sm text-blue-600">
                            (You have reviewed)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Form - Show different content based on whether user has reviewed */}
                    {isAuthenticated && (
                      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-teal-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 animate-slideInUp">
                        {hasUserReviewed ? (
                          // User has already reviewed - show edit/delete options
                          <div>
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg sm:text-xl font-bold text-gray-900">Your Review</h4>
                                <p className="text-sm text-gray-600">Manage your review for this project</p>
                              </div>
                            </div>
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50 shadow-lg">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-6 h-6 transition-all duration-200 ${i < (userReview?.rating || 0) ? 'text-yellow-400 fill-current drop-shadow-sm' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${userReview?.is_approved ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                      {userReview?.is_approved ? '✓ Approved' : '⏳ Approval Pending'}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      {userReview ? new Date(userReview.created_at).toLocaleDateString() : ''}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditReview(userReview!)}
                                    disabled={editingReviewId === userReview?.id || updatingReview}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                    {editingReviewId === userReview?.id ? 'Editing...' : 'Edit'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteReview(userReview!.id)}
                                    disabled={editingReviewId === userReview?.id || updatingReview}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                  >
                                    <X className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              </div>
                              {/* Review Content - either display or edit form */}
                              {(() => {
                                return editingReviewId === userReview?.id;
                              })() ? (
                                <div className="space-y-6">
                                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 border border-blue-100">
                                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                                      ⭐ Your Rating
                                    </label>
                                    <div className="flex gap-1 mb-4">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          type="button"
                                          key={star}
                                          onClick={() => setEditReviewRating(star)}
                                          className="focus:outline-none transform hover:scale-110 transition-all duration-200"
                                        >
                                          <Star
                                            className={`w-8 h-8 transition-all duration-200 ${star <= editReviewRating ? "text-yellow-400 fill-yellow-400 drop-shadow-md" : "text-gray-300 hover:text-yellow-300"
                                              }`}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {editReviewRating === 0 && "Click a star to rate"}
                                      {editReviewRating === 1 && "⭐ Poor"}
                                      {editReviewRating === 2 && "⭐⭐ Fair"}
                                      {editReviewRating === 3 && "⭐⭐⭐ Good"}
                                      {editReviewRating === 4 && "⭐⭐⭐⭐ Very Good"}
                                      {editReviewRating === 5 && "⭐⭐⭐⭐⭐ Excellent"}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                                      💬 Your Feedback
                                    </label>
                                    <textarea
                                      value={editReviewText}
                                      onChange={(e) => setEditReviewText(e.target.value)}
                                      placeholder="Share your detailed experience with this project..."
                                      rows={5}
                                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm sm:text-base transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                      required
                                    />
                                    <div className="text-xs text-gray-500 mt-2">
                                      {editReviewText.length}/500 characters
                                    </div>
                                  </div>
                                  <div className="flex gap-3">
                                    <button
                                      onClick={handleUpdateReview}
                                      disabled={updatingReview || !editReviewText.trim() || editReviewRating === 0}
                                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                    >
                                      {updatingReview ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      ) : (
                                        <Save className="w-5 h-5" />
                                      )}
                                      {updatingReview ? 'Updating...' : 'Save Changes'}
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      disabled={updatingReview}
                                      className="flex items-center gap-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                    >
                                      <X className="w-5 h-5" />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
                                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{userReview?.review_text}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          // User hasn't reviewed yet - show review form
                          <div>
                            <div className="flex items-center gap-3 mb-6">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                <Star className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="text-lg sm:text-xl font-bold text-gray-900">Write a Review</h4>
                                <p className="text-sm text-gray-600">Share your experience with this project</p>
                              </div>
                            </div>
                            <form onSubmit={handleSubmitReview} className="space-y-6">
                              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                                <label className="block text-sm font-semibold text-gray-800 mb-4">
                                  ⭐ Rate this Project
                                </label>
                                <div className="flex gap-1 mb-4">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      type="button"
                                      key={star}
                                      onClick={() => setFormRating(star)}
                                      className="focus:outline-none transform hover:scale-110 transition-all duration-200"
                                    >
                                      <Star
                                        className={`w-10 h-10 transition-all duration-200 ${star <= formRating ? "text-yellow-400 fill-yellow-400 drop-shadow-md" : "text-gray-300 hover:text-yellow-300"
                                          }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                  {formRating === 0 && "Click a star to rate this project"}
                                  {formRating === 1 && "⭐ Poor - Not recommended"}
                                  {formRating === 2 && "⭐⭐ Fair - Below expectations"}
                                  {formRating === 3 && "⭐⭐⭐ Good - Meets expectations"}
                                  {formRating === 4 && "⭐⭐⭐⭐ Very Good - Exceeds expectations"}
                                  {formRating === 5 && "⭐⭐⭐⭐⭐ Excellent - Outstanding quality"}
                                </div>
                              </div>

                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                <label className="block text-sm font-semibold text-gray-800 mb-4">
                                  💬 Share Your Experience
                                </label>
                                <textarea
                                  value={reviewText}
                                  onChange={(e) => setReviewText(e.target.value)}
                                  placeholder="Tell others about your experience with this project. What did you like? What could be improved? Your detailed feedback helps other users make informed decisions..."
                                  rows={6}
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm sm:text-base transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                  required
                                />
                                <div className="flex justify-between items-center mt-2">
                                  <div className="text-xs text-gray-500">
                                    {reviewText.length}/500 characters
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {reviewText.length > 50 ? "✓ Detailed review" : "Add more details"}
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                  type="submit"
                                  disabled={submittingReview || !reviewText.trim() || formRating === 0}
                                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                >
                                  {submittingReview ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Send className="w-5 h-5" />
                                  )}
                                  {submittingReview ? 'Submitting Review...' : 'Submit Review'}
                                </button>
                                <div className="text-xs text-gray-500 flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  Your review will be moderated before being published
                                </div>
                              </div>
                            </form>
                          </div>
                        )}
                      </div>
                    )}


                    {/* Reviews List */}
                    <div className="space-y-4 sm:space-y-6">
                      {([...pendingReviews, ...approvedReviews].filter(review => !user || review.user.id !== user.id).length === 0) ? (
                        <div className="text-center py-8 sm:py-12">
                          <MessageSquare className="w-12 sm:w-16 h-12 sm:h-16 text-gray-300 mx-auto mb-4" />
                          <h4 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No reviews yet</h4>
                          <p className="text-gray-500 text-sm sm:text-base">Be the first to review this project!</p>
                        </div>
                      ) : (
                        // Single combined list: pending first, then approved (excluding current user's review)
                        [...pendingReviews, ...approvedReviews]
                          .filter(review => !user || review.user.id !== user.id) // Filter out current user's review
                          .map((review, index) => (
                            <div key={review.id} className={`bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-xl border transition-all duration-300 ${review.is_approved ? 'border-gray-200 hover:border-blue-200' : 'border-orange-200 bg-orange-50/50 hover:border-orange-300'} animate-slideInUp`} style={{ animationDelay: `${index * 100}ms` }}>
                              <div className="flex items-start justify-between mb-6 gap-4">
                                <div className="flex items-center gap-4">
                                  <div className={`w-12 sm:w-14 h-12 sm:h-14 ${review.is_approved ? 'bg-gradient-to-br from-blue-500 to-teal-500' : 'bg-gradient-to-br from-orange-500 to-red-500'} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                    <span className="text-white font-bold text-lg sm:text-xl">
                                      {review.user.full_name.charAt(0)}
                                    </span>
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="font-bold text-gray-900 text-base sm:text-lg truncate">{review.user.full_name}</h5>
                                    <p className="text-sm text-gray-500 mb-2">
                                      {new Date(review.created_at).toLocaleDateString()}
                                    </p>
                                    {/* Status Badges */}
                                    <div className="flex flex-wrap gap-2">
                                      {/* Is Purchase tag (always shown) */}
                                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${review.is_verified_purchase ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                        {review.is_verified_purchase ? '✓ Verified Purchase' : '✗ Not Verified'}
                                      </span>
                                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${review.is_approved ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                                        {review.is_approved ? '✓ Approved' : '⏳ Pending Approval'}
                                      </span>
                                      {canEditReview(review) && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                                          ✏️ Your Review
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 flex-shrink-0">
                                  {/* Edit button - only show for current user's reviews */}
                                  {canEditReview(review) && (
                                    <button
                                      onClick={() => handleEditReview(review)}
                                      disabled={editingReviewId === review.id || updatingReview}
                                      className="p-2 text-gray-400 hover:text-blue-500 transition-all duration-200 hover:bg-blue-50 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110"
                                      title="Edit review"
                                    >
                                      <Edit2 className="w-5 h-5" />
                                    </button>
                                  )}
                                  <div className="flex items-center gap-1 bg-yellow-50 px-3 py-2 rounded-xl border border-yellow-200">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current drop-shadow-sm' : 'text-gray-300'}`}
                                      />
                                    ))}
                                    <span className="ml-2 text-sm font-semibold text-gray-700">{review.rating}/5</span>
                                  </div>
                                </div>
                              </div>

                              {/* Review Content - either display or edit form */}
                              {editingReviewId === review.id ? (
                                <div className="space-y-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                                      ⭐ Update Your Rating
                                    </label>
                                    <div className="flex gap-1 mb-4">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          type="button"
                                          key={star}
                                          onClick={() => setEditReviewRating(star)}
                                          className="focus:outline-none transform hover:scale-110 transition-all duration-200"
                                        >
                                          <Star
                                            className={`w-8 h-8 transition-all duration-200 ${star <= editReviewRating ? "text-yellow-400 fill-yellow-400 drop-shadow-md" : "text-gray-300 hover:text-yellow-300"}`}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-3">
                                      💬 Update Your Feedback
                                    </label>
                                    <textarea
                                      value={editReviewText}
                                      onChange={(e) => setEditReviewText(e.target.value)}
                                      placeholder="Share your detailed experience with this project..."
                                      rows={5}
                                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm sm:text-base transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                      required
                                    />
                                  </div>
                                  <div className="flex gap-3">
                                    <button
                                      onClick={handleUpdateReview}
                                      disabled={updatingReview || !editReviewText.trim() || editReviewRating === 0}
                                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                    >
                                      {updatingReview ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      ) : (
                                        <Save className="w-5 h-5" />
                                      )}
                                      {updatingReview ? 'Updating...' : 'Save Changes'}
                                    </button>
                                    <button
                                      onClick={handleCancelEdit}
                                      disabled={updatingReview}
                                      className="flex items-center gap-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:scale-100"
                                    >
                                      <X className="w-5 h-5" />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
                                  <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{review.review_text}</p>
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

          {/* Sidebar */}
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-2">
            {/* Purchase Card */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl lg:sticky lg:top-8 border border-white/30 animate-slideInRight">
              <div className="text-center mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 animate-slideInUp">
                  <div className="text-3xl sm:text-4xl font-bold text-gray-900">₹{project.pricing?.sale_price || 0}</div>
                  {project.pricing?.original_price && project.pricing.original_price > (project.pricing?.sale_price || 0) && (
                    <div className="text-xl sm:text-2xl text-gray-500 line-through">₹{project.pricing.original_price}</div>
                  )}
                </div>
                {project.discount_percentage && project.discount_percentage > 0 && (
                  <div className="text-xs sm:text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full inline-block animate-pulse">
                    Save {project.discount_percentage}%
                  </div>
                )}
              </div>
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 animate-slideInUp" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                    Delivery Time
                  </span>
                  <span className="font-semibold text-gray-900">{project.delivery_time} days</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Files Size</span>
                  <span className="font-semibold text-gray-900">{project?.files?.size_mb || 0} MB</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Total Sales</span>
                  <span className="font-semibold text-gray-900">{project.purchase_count}</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-green-600">{project?.stats?.completion_rate || 0}%</span>
                </div>
              </div>

              {!isPurchased ? (
                <div className="space-y-3 sm:space-y-4">
                  <button
                    onClick={handlePurchase}
                    disabled={!isAuthenticated || isPurchasing}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4 shadow-lg hover:shadow-xl transform hover:scale-105 animate-slideInUp disabled:opacity-50 disabled:cursor-not-allowed" style={{ animationDelay: '300ms' }}
                  >
                    <ShoppingCart className="w-5 sm:w-6 h-5 sm:h-6" />
                    {isAuthenticated ? (isPurchasing ? 'Processing...' : `Buy Now (₹${project.pricing?.sale_price || 0})`) : 'Login to Buy'}
                  </button>
                  <button onClick={handleToggleWishlist} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 hover:scale-105 transition-all duration-200 animate-slideInUp text-sm sm:text-base" style={{ animationDelay: '350ms' }}>
                    <Heart className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
                    {wishlistStatus ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  </button>
                  <button onClick={handleToggleCart} disabled={!isAuthenticated} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 hover:scale-105 transition-all duration-200 animate-slideInUp text-sm sm:text-base" style={{ animationDelay: '380ms' }}>
                    <ShoppingCart className="w-4 sm:w-5 h-4 sm:h-5 inline mr-2" />
                    {cartStatus ? 'Remove from Cart' : 'Add to Cart'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="text-center text-green-600 font-bold text-base sm:text-lg mb-3 sm:mb-4 bg-green-100 py-3 rounded-xl animate-slideInUp">
                    ✅ Project Purchased
                  </div>
                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 shadow-lg hover:shadow-xl hover:scale-105 animate-slideInUp">
                    <Download className="w-5 sm:w-6 h-5 sm:h-6" />
                    Download Files
                  </button>
                </div>
              )}

              <div className="space-y-2 sm:space-y-3 text-center text-xs sm:text-sm text-gray-600 animate-slideInUp" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
                  <span>Source code included</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
                  <span>Documentation provided</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-3 sm:w-4 h-3 sm:h-4 text-green-500" />
                  <span>Money-back guarantee</span>
                </div>
              </div>
            </div>

            {/* Related Projects */}
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/30 animate-slideInRight" style={{ animationDelay: '400ms' }}>
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Related Projects</h3>
              <div className="space-y-4 sm:space-y-6">
                {relatedProjects.map((relatedProject, idx) => (
                  <Link
                    key={relatedProject.id}
                    to={`/project/${relatedProject.id}`}
                    className="flex gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 group animate-slideInUp"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <img
                      src={relatedProject.thumbnail}
                      alt={relatedProject.title}
                      className="w-16 sm:w-20 h-12 sm:h-16 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">{relatedProject.title}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 font-medium">{relatedProject.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="font-bold text-gray-900 text-sm">${relatedProject.price}</span>
                          <span className="text-xs text-gray-500 line-through">${relatedProject.originalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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
  );
};

export default ProjectDetail;