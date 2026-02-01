/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../types/User';

// Extend the Window interface to include mixpanel
declare global {
    interface Window {
        mixpanel: any;
    }
}

/**
 * Mixpanel Analytics Service
 * Provides a centralized interface for tracking events and user identification
 */
class MixpanelService {
    private isInitialized(): boolean {
        return typeof window !== 'undefined' && window.mixpanel !== undefined;
    }

    /**
     * Identify a user in Mixpanel
     * @param userId - Unique user identifier
     * @param userProperties - Additional user properties to set
     */
    identify(userId: string, userProperties?: Record<string, any>): void {
        if (!this.isInitialized()) {
            console.warn('Mixpanel not initialized');
            return;
        }

        try {
            window.mixpanel.identify(userId);

            if (userProperties) {
                window.mixpanel.people.set(userProperties);
            }
        } catch (error) {
            console.error('Mixpanel identify error:', error);
        }
    }

    /**
     * Identify user from User object
     * @param user - User object from AuthContext
     */
    identifyUser(user: User): void {
        if (!user) return;

        this.identify(user.id, {
            $email: user.email,
            $name: user.full_name,
            user_type: user.user_type,
            email_verified: user.email_verified,
            created_at: user.created_at,
        });
    }

    /**
     * Track an event
     * @param eventName - Name of the event
     * @param properties - Event properties
     */
    track(eventName: string, properties?: Record<string, any>): void {
        if (!this.isInitialized()) {
            console.warn('Mixpanel not initialized');
            return;
        }

        try {
            window.mixpanel.track(eventName, properties);
        } catch (error) {
            console.error('Mixpanel track error:', error);
        }
    }

    /**
     * Track a page view
     * @param pageName - Name of the page
     * @param properties - Additional properties
     */
    trackPageView(pageName: string, properties?: Record<string, any>): void {
        this.track('Page Viewed', {
            page_name: pageName,
            ...properties,
        });
    }

    /**
     * Reset Mixpanel (call on logout)
     */
    reset(): void {
        if (!this.isInitialized()) {
            console.warn('Mixpanel not initialized');
            return;
        }

        try {
            window.mixpanel.reset();
        } catch (error) {
            console.error('Mixpanel reset error:', error);
        }
    }

    /**
     * Set user properties
     * @param properties - Properties to set
     */
    setUserProperties(properties: Record<string, any>): void {
        if (!this.isInitialized()) {
            console.warn('Mixpanel not initialized');
            return;
        }

        try {
            window.mixpanel.people.set(properties);
        } catch (error) {
            console.error('Mixpanel set user properties error:', error);
        }
    }

    /**
     * Increment a user property
     * @param property - Property name
     * @param value - Value to increment by (default: 1)
     */
    incrementUserProperty(property: string, value: number = 1): void {
        if (!this.isInitialized()) {
            console.warn('Mixpanel not initialized');
            return;
        }

        try {
            window.mixpanel.people.increment(property, value);
        } catch (error) {
            console.error('Mixpanel increment error:', error);
        }
    }

    // Authentication Events
    trackLogin(user: User): void {
        try {
            this.identifyUser(user);
            this.track('Login', {
                user_type: user.user_type,
                email_verified: user.email_verified,
            });
        } catch (error) {
            console.error('Mixpanel trackLogin error:', error);
        }
    }

    trackSignup(userType: string, hasReferralCode: boolean): void {
        try {
            this.track('Signup', {
                user_type: userType,
                has_referral_code: hasReferralCode,
            });
        } catch (error) {
            console.error('Mixpanel trackSignup error:', error);
        }
    }

    trackLogout(): void {
        try {
            this.track('Logout');
            this.reset();
        } catch (error) {
            console.error('Mixpanel trackLogout error:', error);
        }
    }

    trackEmailVerification(success: boolean): void {
        try {
            this.track('Email Verification', {
                success,
            });
        } catch (error) {
            console.error('Mixpanel trackEmailVerification error:', error);
        }
    }

    // Project Events
    trackProjectView(projectId: string, projectTitle: string, price: number, category?: string): void {
        try {
            this.track('Project Viewed', {
                project_id: projectId,
                project_title: projectTitle,
                price,
                category,
            });
        } catch (error) {
            console.error('Mixpanel trackProjectView error:', error);
        }
    }

    trackAddToCart(projectId: string, projectTitle: string, price: number): void {
        try {
            this.track('Added to Cart', {
                project_id: projectId,
                project_title: projectTitle,
                price,
            });
        } catch (error) {
            console.error('Mixpanel trackAddToCart error:', error);
        }
    }

    trackAddToWishlist(projectId: string, projectTitle: string, price: number): void {
        try {
            this.track('Added to Wishlist', {
                project_id: projectId,
                project_title: projectTitle,
                price,
            });
        } catch (error) {
            console.error('Mixpanel trackAddToWishlist error:', error);
        }
    }

    // Purchase Events
    trackPurchaseInitiated(orderId: string, amount: number, projectIds: string[]): void {
        try {
            this.track('Purchase Initiated', {
                order_id: orderId,
                amount,
                project_count: projectIds.length,
                project_ids: projectIds,
            });
        } catch (error) {
            console.error('Mixpanel trackPurchaseInitiated error:', error);
        }
    }

    trackPurchaseSuccess(orderId: string, amount: number, paymentId: string, projectIds: string[]): void {
        try {
            this.track('Purchase Success', {
                order_id: orderId,
                amount,
                payment_id: paymentId,
                project_count: projectIds.length,
                project_ids: projectIds,
            });

            // Track revenue
            if (this.isInitialized()) {
                window.mixpanel.people.track_charge(amount);
            }
        } catch (error) {
            console.error('Mixpanel trackPurchaseSuccess error:', error);
        }
    }

    trackPurchaseFailed(orderId: string, amount: number, error: string): void {
        try {
            this.track('Purchase Failed', {
                order_id: orderId,
                amount,
                error,
            });
        } catch (err) {
            console.error('Mixpanel trackPurchaseFailed error:', err);
        }
    }

    // Download Events
    trackDownloadCompleted(projectId: string, projectTitle: string, method: 'credit' | 'purchase'): void {
        try {
            this.track('Download Completed', {
                project_id: projectId,
                project_title: projectTitle,
                download_method: method,
            });

            this.incrementUserProperty('total_downloads');
        } catch (error) {
            console.error('Mixpanel trackDownloadCompleted error:', error);
        }
    }

    trackDownloadFailed(projectId: string, error: string): void {
        try {
            this.track('Download Failed', {
                project_id: projectId,
                error,
            });
        } catch (err) {
            console.error('Mixpanel trackDownloadFailed error:', err);
        }
    }

    // Referral Events
    trackReferralCodeCopied(referralCode: string): void {
        try {
            this.track('Referral Code Copied', {
                referral_code: referralCode,
            });
        } catch (error) {
            console.error('Mixpanel trackReferralCodeCopied error:', error);
        }
    }

    trackReferralLinkShared(referralCode: string, method?: string): void {
        try {
            this.track('Referral Link Shared', {
                referral_code: referralCode,
                share_method: method,
            });
        } catch (error) {
            console.error('Mixpanel trackReferralLinkShared error:', error);
        }
    }

    // Project Upload Events
    trackProjectUploadStarted(): void {
        try {
            this.track('Project Upload Started');
        } catch (error) {
            console.error('Mixpanel trackProjectUploadStarted error:', error);
        }
    }

    trackProjectUploadCompleted(projectId: string, title: string, price: number, category: string): void {
        try {
            this.track('Project Upload Completed', {
                project_id: projectId,
                title,
                price,
                category,
            });

            this.incrementUserProperty('total_uploads');
        } catch (error) {
            console.error('Mixpanel trackProjectUploadCompleted error:', error);
        }
    }

    trackProjectUploadFailed(error: string): void {
        try {
            this.track('Project Upload Failed', {
                error,
            });
        } catch (err) {
            console.error('Mixpanel trackProjectUploadFailed error:', err);
        }
    }

    // Credit Events
    trackCreditsEarned(amount: number, source: string): void {
        try {
            this.track('Credits Earned', {
                amount,
                source,
            });
        } catch (error) {
            console.error('Mixpanel trackCreditsEarned error:', error);
        }
    }

    trackCreditsSpent(amount: number, purpose: string): void {
        try {
            this.track('Credits Spent', {
                amount,
                purpose,
            });
        } catch (error) {
            console.error('Mixpanel trackCreditsSpent error:', error);
        }
    }
}

// Export singleton instance
export const mixpanel = new MixpanelService();
