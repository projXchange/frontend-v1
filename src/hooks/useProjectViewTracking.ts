import { useEffect, useRef } from 'react';
import { creditService } from '../services/creditService';

/**
 * Custom hook for tracking project view duration
 * Automatically tracks views that exceed 60 seconds for referral confirmation
 * 
 * Requirements: 13.1, 13.2, 13.3
 * 
 * @param projectId - The ID of the project being viewed
 */
export const useProjectViewTracking = (projectId: string) => {
  const startTimeRef = useRef<number>(Date.now());
  const hasTrackedRef = useRef<boolean>(false);

  useEffect(() => {
    // Reset tracking state on mount or when projectId changes
    startTimeRef.current = Date.now();
    hasTrackedRef.current = false;

    /**
     * Track the project view if duration >= 60 seconds
     * Silently fails to avoid disrupting user experience
     */
    const trackView = async () => {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);

      // Only track if >= 60 seconds and not already tracked
      if (duration >= 60 && !hasTrackedRef.current) {
        hasTrackedRef.current = true;
        try {
          await creditService.trackProjectView(projectId, duration);
        } catch (error) {
          // Silent failure - log but don't show error to user
          console.error('Failed to track project view:', error);
        }
      }
    };

    // Set timer to track after 60 seconds
    const timer = setTimeout(trackView, 60000);

    // Cleanup: track on unmount if >= 60 seconds
    return () => {
      clearTimeout(timer);
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      if (duration >= 60 && !hasTrackedRef.current) {
        // Call trackView without awaiting to avoid blocking unmount
        trackView();
      }
    };
  }, [projectId]);
};
