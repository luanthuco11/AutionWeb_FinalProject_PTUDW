"use client";

import React from "react";
import { useState, useEffect } from "react";
import BidHook from "@/hooks/useBid";
import { BidLog } from "../../../../../../../shared/src/types";
import { formatCurrency, formatDate } from "./Question";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

interface ProductId {
  productId: number;
}
export const BidHistory = ({ productId }: ProductId) => {
  const { data: bidLogs, isLoading: isLoadingBigLogs } = BidHook.useBidLogs(
    productId
  ) as { data: BidLog[]; isLoading: boolean };
  const { user } = useAuth();
  return (
    <div className="relative bg-white rounded-lg p-6 mb-8 border border-slate-200">
      {isLoadingBigLogs && <LoadingSpinner />}
      <h3 className="text-2xl font-bold text-slate-900 mb-4">
        Lịch sử đấu giá
      </h3>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left py-3 text-sm font-semibold text-gray-600">
              Thời gian
            </th>
            <th className="text-left py-3 text-sm font-semibold text-gray-600">
              Người đấu giá
            </th>
            <th className="text-left py-3 pl-5 text-sm font-semibold text-gray-600">
              Giá
            </th>
          </tr>
        </thead>
        <tbody>
          {bidLogs &&
            bidLogs.map((his, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-1 sm:px-3 truncate text-[12px] sm:text-sm text-gray-700">
                  {formatDate(his.created_at)}
                </td>
                <td className="py-3 px-1 sm:px-3 truncate max-w-[90px] text-[12px] sm:text-sm font-medium text-gray-700">
                  {user?.id === his.user.id
                    ? `${his.user.name} (Bạn)`
                    : `${his.user.name}`}
                </td>
                <td className="py-3 px-1 sm:px-3 truncate text-[12px] sm:text-sm font-bold text-blue-600 text-right">
                  {formatCurrency(his.price)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
