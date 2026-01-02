import { 
  Clock, 
  CheckCircle2, 
  Loader2, 
  CheckCheck, 
  XCircle, 
  Ban, 
  AlertCircle 
} from 'lucide-react';
import type { PayoutStatus } from '../types/Payout';

interface PayoutStatusBadgeProps {
  status: PayoutStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function PayoutStatusBadge({ 
  status, 
  size = 'md' 
}: PayoutStatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const statusConfig: Record<PayoutStatus, {
    label: string;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    ariaLabel: string;
  }> = {
    pending_verification: {
      label: 'Pending Verification',
      icon: <Clock className={iconSizes[size]} />,
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-700 dark:text-yellow-400',
      ariaLabel: 'Payout status: Pending verification'
    },
    verified: {
      label: 'Verified',
      icon: <CheckCircle2 className={iconSizes[size]} />,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-400',
      ariaLabel: 'Payout status: Verified'
    },
    processing: {
      label: 'Processing',
      icon: <Loader2 className={`${iconSizes[size]} animate-spin`} />,
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      textColor: 'text-indigo-700 dark:text-indigo-400',
      ariaLabel: 'Payout status: Processing'
    },
    completed: {
      label: 'Completed',
      icon: <CheckCheck className={iconSizes[size]} />,
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-400',
      ariaLabel: 'Payout status: Completed'
    },
    failed: {
      label: 'Failed',
      icon: <XCircle className={iconSizes[size]} />,
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-700 dark:text-red-400',
      ariaLabel: 'Payout status: Failed'
    },
    cancelled: {
      label: 'Cancelled',
      icon: <Ban className={iconSizes[size]} />,
      bgColor: 'bg-gray-100 dark:bg-gray-900/30',
      textColor: 'text-gray-700 dark:text-gray-400',
      ariaLabel: 'Payout status: Cancelled'
    },
    expired: {
      label: 'Expired',
      icon: <AlertCircle className={iconSizes[size]} />,
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-700 dark:text-orange-400',
      ariaLabel: 'Payout status: Expired'
    }
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeClasses[size]} ${config.bgColor} ${config.textColor}`}
      aria-label={config.ariaLabel}
      role="status"
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
