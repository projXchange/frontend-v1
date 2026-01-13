import React from 'react';
import { CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import type { ReferralStatus } from '../types/Referral';

interface ReferralStatusBadgeProps {
  status: ReferralStatus;
}

const ReferralStatusBadge: React.FC<ReferralStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pending',
          icon: Clock,
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
        };
      case 'CONFIRMED':
        return {
          label: 'Confirmed',
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800',
        };
      case 'REVIEW':
        return {
          label: 'Under Review',
          icon: AlertTriangle,
          className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
        };
      case 'BLOCKED':
        return {
          label: 'Blocked',
          icon: XCircle,
          className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800',
        };
      default:
        return {
          label: 'Unknown',
          icon: AlertTriangle,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}
      role="status"
      aria-label={`Referral status: ${config.label}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      {config.label}
    </span>
  );
};

export default ReferralStatusBadge;
