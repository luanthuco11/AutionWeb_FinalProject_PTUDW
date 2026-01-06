"use client";

import React from "react";
import { useState, useEffect } from "react";
import BidHook from "@/hooks/useBid";
import { BidLog } from "../../../../../../shared/src/types";
import { formatCurrency, formatDate } from "./Question";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import SecondaryButton from "@/components/SecondaryButton/index";

interface ProductId {
  productId: number;
}
export const BidHistory = ({ productId }: ProductId) => {
  const { user } = useAuth();
  const { data: bidLogs, isLoading: isLoadingBigLogs } = BidHook.useBidLogs(
    productId,
    user ? true : false
  ) as { data: BidLog[]; isLoading: boolean };
  console.log('bid', bidLogs);
  return (
    <div className="relative bg-white rounded-xl shadow-sm overflow-hidden  mb-8 border border-slate-200">
      {isLoadingBigLogs && <LoadingSpinner />}
      <div className="p-4 md:p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800">
          Lịch sử đấu giá
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Thông tin 10 đấu giá gần nhất
        </p>
      </div>

      <div className="px-4 md:p-6 lg:p-4">
        <table className="w-full ">
          <thead>
            <tr>
              <th className="text-left py-3 text-sm font-semibold text-gray-600">
                Thời gian
              </th>
              <th className="text-left py-3 text-sm font-semibold text-gray-600">
                Người đấu giá
              </th>
              <th className="text-right py-3 pl-5 text-sm font-semibold text-gray-600">
                Giá đấu
              </th>
            </tr>
          </thead>
          <tbody className="">
            {bidLogs &&
              bidLogs.map((his, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition"
                >
                  <td className="py-3 truncate text-[12px] sm:text-sm text-gray-700">
                    {new Date(String(his.created_at)).toLocaleString("vi-VN")}
                  </td>
                  <td className="py-3 truncate max-w-[90px] text-[12px] sm:text-sm font-medium text-gray-700">
                    {user?.id === his.user.id ? (
                      <span className="font-bold text-blue-500">Bạn</span>
                    ) : (
                      `${his.user.name[0]}*****${
                        his.user.name[his.user.name.length - 1]
                      }`
                    )}
                  </td>
                  <td className="py-3 truncate text-[12px] sm:text-sm font-bold text-blue-600 text-right">
                    {formatCurrency(his.price)}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
