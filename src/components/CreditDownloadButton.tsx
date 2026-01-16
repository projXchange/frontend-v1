import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useCredits } from '../hooks/useCredits';
import toast from 'react-hot-toast';
import ButtonSpinner from './ButtonSpinner';

interface CreditDownloadButtonProps {
  projectId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * CreditDownloadButton Component
 * 
 * Displays a button for downloading projects using credits.
 * Only visible when user has available credits.
 * Handles the complete download flow including credit deduction and file download.
 * 
 * Requirements: 6.1, 6.2, 6.4, 6.5, 20.1
 * 
 * @param projectId - The ID of the project to download
 * @param className - Optional additional CSS classes
 * @param size - Button size variant (sm, md, lg)
 */
const CreditDownloadButton: React.FC<CreditDownloadButtonProps> = ({ 
  projectId, 
  className = '',
  size = 'md'
}) => {
  const { availableCredits, downloadWithCredit } = useCredits();
  const [isDownloading, setIsDownloading] = useState(false);

  // Size variants - Enhanced for mobile touch targets
  const sizeClasses = {
    sm: 'px-3 py-2 text-xs min-h-[36px]',
    md: 'px-4 py-2.5 text-sm min-h-[44px]',
    lg: 'px-6 py-3.5 text-base min-h-[48px]',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  /**
   * Handles the credit download process
   * Requirements: 6.4, 6.5, 20.1
   */
  const handleDownload = async () => {
    // Check if user has credits (Requirements: 6.1)
    if (availableCredits <= 0) {
      toast.error('No credits available. Invite friends to earn more credits!');
      return;
    }

    setIsDownloading(true);
    
    try {
      // Call downloadWithCredit which returns the download URL (Requirements: 6.4)
      const downloadUrl = await downloadWithCredit(projectId);
      
      // Initiate file download (Requirements: 6.5)
      if (downloadUrl) {
        // Fetch the file as a blob to avoid 401 errors from direct navigation
        toast.loading('Preparing your download...', { id: 'download-prep' });
        
        const response = await fetch(downloadUrl);
        
        if (!response.ok) {
          throw new Error(`Download failed with status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Extract filename from URL or use default
        const urlParts = downloadUrl.split('/');
        const filename = urlParts[urlParts.length - 1].split('?')[0] || 'project-download.zip';
        
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
        
        toast.success(`Download complete! ${availableCredits - 1} credit(s) remaining.`, { id: 'download-prep' });
      }
    } catch (error) {
      // Error handling (Requirements: 20.1)
      console.error('Credit download error:', error);
      toast.dismiss('download-prep');
      // Only show error if downloadWithCredit didn't already show one
      if (error instanceof Error && !error.message.includes('credit')) {
        toast.error('Failed to download file. Please try again.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  // Don't render button if no credits available (Requirements: 6.2)
  if (availableCredits <= 0) {
    return null;
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center gap-2
        bg-gradient-to-r from-green-600 to-emerald-600
        hover:from-green-700 hover:to-emerald-700
        active:from-green-800 active:to-emerald-800
        text-white font-medium rounded-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-md hover:shadow-lg active:shadow-sm
        touch-manipulation
        ${className}
      `}
      data-testid="credit-download-button"
    >
      {isDownloading ? (
        <>
          <ButtonSpinner />
          <span className="whitespace-nowrap">Downloading...</span>
        </>
      ) : (
        <>
          <Download className={iconSizes[size]} />
          <span className="whitespace-nowrap">Use 1 credit to download</span>
        </>
      )}
    </button>
  );
};

export default CreditDownloadButton;
