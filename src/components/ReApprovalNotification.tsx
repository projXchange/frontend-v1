import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface ReApprovalNotificationProps {
  status: 'pending' | 'approved' | 'draft';
  showReApprovalInfo?: boolean;
  className?: string;
}

/**
 * Component to display re-approval status and information
 * Shows different messages based on project status
 */
const ReApprovalNotification: React.FC<ReApprovalNotificationProps> = ({
  status,
  showReApprovalInfo = false,
  className = '',
}) => {
  if (status === 'approved' && !showReApprovalInfo) {
    return null;
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          textColor: 'text-yellow-800 dark:text-yellow-300',
          title: 'Pending Admin Approval',
          message: 'Your project changes are currently under review. You\'ll be notified once the admin approves your updates.',
        };
      case 'approved':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          iconColor: 'text-green-600 dark:text-green-400',
          textColor: 'text-green-800 dark:text-green-300',
          title: '✅ Project Approved - You Can Edit',
          message: 'Your project is approved and live. You can edit your fields below. Any changes will be submitted for re-approval to maintain quality.',
        };
      case 'draft':
        return {
          icon: AlertCircle,
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          iconColor: 'text-blue-600 dark:text-blue-400',
          textColor: 'text-blue-800 dark:text-blue-300',
          title: 'Draft Project',
          message: 'Complete your project details and submit for approval when ready.',
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div 
      className={`px-6 py-4 ${config.bgColor} border-b ${config.borderColor} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} aria-hidden="true" />
        <div className="flex-1">
          <p className={`text-sm ${config.textColor} font-semibold mb-1`}>
            {config.title}
          </p>
          <p className={`text-xs ${config.textColor} opacity-90`}>
            {config.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReApprovalNotification;
