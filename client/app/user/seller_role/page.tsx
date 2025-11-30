"use client"

import React from 'react';
import UpgradeRequestHook from '@/hooks/useUpgrade';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/LoadingSpinner';
import SellerStatusCard from './SellerStatusCard';
import AlertMessage from './AlertMessage';

const SellerRolePage: React.FC = () => {
  // --- Custome Hook
  const id = Number(useAuth().user?.id);
  const { data: requestData, isLoading } = UpgradeRequestHook.useGetRequestStatus(id);
  const { mutate: createRequest, isPending: isUpgradePending, isSuccess, isError } = UpgradeRequestHook.useCreateSellerRequest();
  
  // --- Filter data ---
  const request = Array.isArray(requestData) ? requestData[0] : requestData;
  const expirateDate = new Date();
  // --- Handler ---
  const handleRequestSeller = () => {
    createRequest();
  };

  // --- Exception ---
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Quyền Seller hoạt động
          </h1>

          <SellerStatusCard
            status={request ? request.status : 'none'}
            expiryDate={expirateDate}
            onAction={handleRequestSeller}
            isLoading={isUpgradePending}
          />

          {isSuccess && (
            <AlertMessage 
              type="success"
              message="Yêu cầu của bạn đã được gửi thành công! Vui lòng chờ quản trị viên phê duyệt."
            />
          )}

          {isError && (
            <AlertMessage 
              type="error"
              message="Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại sau."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerRolePage;