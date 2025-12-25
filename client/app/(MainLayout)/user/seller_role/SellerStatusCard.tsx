import React from 'react';
import StatusBadge from './StatusBadge';

type StatusType = 'approved' | 'pending' | 'rejected' | 'expired' | 'none';

interface SellerStatusCardProps {
    status: StatusType;
    expiryDate?: Date;
    onAction: () => void;
    isLoading: boolean;
}

const SellerStatusCard: React.FC<SellerStatusCardProps> = ({
    status,
    expiryDate,
    onAction,
    isLoading
}) => {
    const renderContent = () => {
        switch (status) {
            case 'approved':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <StatusBadge status="approved" />
                        </div>
                        {expiryDate && (
                            <p className="text-gray-700">
                                Hạn hết: <span className="font-semibold">{new Date(expiryDate).toLocaleDateString('vi-VN')}</span>
                            </p>
                        )}
                    </div>
                );

            case 'expired':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <StatusBadge status="expired" />
                        </div>
                        {expiryDate && (
                            <p className="text-gray-700">
                                Đã hết hạn từ ngày: <span className="font-semibold">{new Date(expiryDate).toLocaleDateString('vi-VN')}</span>
                            </p>
                        )}
                        <button
                            onClick={onAction}
                            disabled={isLoading}
                            className="mt-2 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Đang gửi yêu cầu...' : 'Gia hạn quyền Seller'}
                        </button>
                    </div>
                );

            case 'pending':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <StatusBadge status="pending" />
                        </div>
                        <p className="text-gray-600">
                            Yêu cầu của bạn đang được xem xét bởi quản trị viên.
                        </p>
                    </div>
                );

            case 'rejected':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <StatusBadge status="rejected" />
                        </div>
                        <p className="text-gray-600">
                            Yêu cầu của bạn đã bị từ chối bởi quản trị viên.
                        </p>
                        <button
                            onClick={onAction}
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <span>+</span>
                            {isLoading ? 'Đang gửi yêu cầu...' : 'Đăng ký lại'}
                        </button>
                    </div>
                );

            case 'none':
            default:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <StatusBadge status="none" />
                        </div>
                        <p className="text-gray-600 mb-4">
                            Bạn chưa có quyền Seller. Đăng ký ngay để bắt đầu bán hàng trên nền tảng.
                        </p>
                        <button
                            onClick={onAction}
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <span>+</span>
                            {isLoading ? 'Đang gửi yêu cầu...' : 'Đăng ký Seller'}
                        </button>
                    </div>
                );
        }
    };

    return renderContent();
};

export default SellerStatusCard;