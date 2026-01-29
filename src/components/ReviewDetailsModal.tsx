import React, { useState } from 'react';
import { X, Star, User, Calendar, MessageSquare, Check, AlertCircle, Trash2, Edit3, Save } from 'lucide-react';
import { Review } from '../types/Project';
import toast from 'react-hot-toast';

interface ReviewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: Review | null;
  isAdmin?: boolean;
  onApprove?: (reviewId: string) => void;
  onReject?: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  onUpdate?: (reviewId: string, updatedReview: { review_text: string; rating: number }) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

const ReviewDetailsModal: React.FC<ReviewDetailsModalProps> = ({
  isOpen,
  onClose,
  review,
  isAdmin = false,
  onApprove,
  onReject,
  onDelete,
  onUpdate,
  isUpdating = false,
  isDeleting = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [editedRating, setEditedRating] = useState(0);

  React.useEffect(() => {
    if (review) {
      setEditedText(review.review_text);
      setEditedRating(review.rating);
    }
  }, [review]);

  if (!isOpen || !review) return null;

  const handleSave = () => {
    if (onUpdate && editedText.trim() && editedRating > 0) {
      onUpdate(review.id, {
        review_text: editedText.trim(),
        rating: editedRating
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedText(review.review_text);
    setEditedRating(review.rating);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      onDelete(review.id);
    }
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 cursor-pointer transition-colors ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } ${interactive ? 'hover:text-yellow-400' : ''}`}
            onClick={() => interactive && onRatingChange && onRatingChange(i + 1)}
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-300 transform scale-100 scrollbar-hide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Review Details</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">ID: {review.id.slice(0, 8)}...</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-all hover:rotate-90 duration-300"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          {/* User Information */}
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-4 border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-lg">
                  {review.user?.full_name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {review.user?.full_name || 'Unknown User'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{review.user?.email || 'No email'}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800 transition-colors">
            <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2 text-sm">Project Information</h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-blue-900 dark:text-blue-200 text-sm truncate">
                  {review.project?.title || 'Project'}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 truncate">ID: {review.project_id.slice(0, 12)}...</p>
              </div>
            </div>
          </div>

          {/* Rating & Status Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rating */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-100 dark:border-yellow-800 transition-colors">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2 text-sm">Rating</h4>
              {isEditing ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {renderStars(editedRating, true, setEditedRating)}
                  </div>
                  <span className="text-xs text-yellow-700 dark:text-yellow-300">({editedRating}/5)</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {renderStars(review.rating)}
                  <span className="text-lg font-bold text-yellow-900 dark:text-yellow-200">
                    {review.rating}/5
                  </span>
                </div>
              )}
            </div>

            {/* Status */}
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-4 border border-gray-100 dark:border-slate-700 transition-colors">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 text-sm">Status</h4>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                  review.is_approved 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' 
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                }`}>
                  {review.is_approved ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {review.is_approved ? 'Approved' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Review Text */}
          <div className="bg-gradient-to-br from-gray-50 to-white dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-4 border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Review Text</h4>
              {!isAdmin && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-all hover:scale-105"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-colors text-sm"
                  placeholder="Write your review..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    disabled={isUpdating || !editedText.trim() || editedRating === 0}
                    className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 text-sm font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    {isUpdating ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-500 dark:bg-slate-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-slate-700 transition-all hover:scale-105 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{review.review_text}</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-4 sm:p-6 border-t border-gray-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm transition-colors">
          <div className="flex items-center gap-2">
            {isAdmin && (
              <>
                {!review.is_approved && onApprove && (
                  <button
                    onClick={() => onApprove(review.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all hover:scale-105 text-sm font-semibold"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                )}
                {review.is_approved && onReject && (
                  <button
                    onClick={() => onReject(review.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all hover:scale-105 text-sm font-semibold"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 text-sm font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 dark:bg-slate-600 text-white rounded-lg hover:bg-gray-600 dark:hover:bg-slate-700 transition-all hover:scale-105 text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailsModal;
