import React from 'react';

type StatusType = 'approved' | 'expired' | 'pending' | 'rejected' | 'none';

interface StatusBadgeProps {
  status: StatusType;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      label: 'Đang hoạt động'
    },
    expired: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      label: 'Đã hết hạn'
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      label: 'Đang chờ chấp nhận'
    },
    rejected: {
      bg: 'bg-red-300',
      text: 'text-white-800',
      label: 'Bị từ chối quyền'
    },
    none: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: 'Chưa có quyền'
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`px-3 py-1 ${config.bg} ${config.text} text-sm font-medium rounded-full`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;