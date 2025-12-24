"use client";

import React from "react";
import { useState, useEffect } from "react";
import BidHook from "@/hooks/useBid";
import {
  BidLog,
  BlacklistPayload,
  User,
} from "../../../../../../../shared/src/types";
import { formatCurrency, formatDate } from "./Question";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import SecondaryButton from "@/components/SecondaryButton";
import { UserMinus } from "lucide-react";
import { ConfirmPopup } from "@/components/ConfirmPopup";
import ProductHook from "@/hooks/useProduct";

interface ProductId {
  productId: number;
}
export const BidHistory = ({ productId }: ProductId) => {
  const [blacklistConfirm, setBlacklistConfirm] = useState<boolean>(false);
  const [blacklistUser, setBlacklistUser] = useState<Pick<User, "id" | "name">>(
    { id: -1, name: "" }
  );

  const { data: bidLogs, isLoading: isLoadingBigLogs } = BidHook.useBidLogs(
    productId
  ) as { data: BidLog[]; isLoading: boolean };

  const { mutate: createBlacklist, isPending: isCreatingBlacklist } =
    BidHook.useCreateBlacklist();

  const { user } = useAuth();

  const handleBlacklist = () => {
    setBlacklistConfirm(false);
    if (!blacklistUser || blacklistUser.id == -1) return;

    const blacklistPayload: BlacklistPayload = {
      product_id: productId,
      buyer_id: blacklistUser.id,
    };
    createBlacklist(blacklistPayload);
  };

  return (
    <div className="relative bg-white rounded-lg p-6 mb-8 border border-slate-200">
      {isLoadingBigLogs && <LoadingSpinner />}

      <div className="flex flex-row justify-between items-center mb-4">
        <h3 className="text-2xl w-fit font-bold text-slate-900">
          Lịch sử đấu giá
        </h3>
      </div>

      <table className="w-full">
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
            <th className="text-right py-3 pl-5 text-sm font-semibold text-gray-600">
              Từ chối
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
                  {new Date(String(his.created_at)).toLocaleString("vi-VN")}
                </td>
                <td className="py-3 px-1 sm:px-3 truncate max-w-[90px] text-[12px] sm:text-sm font-medium text-gray-700">
                  {user?.id === his.user.id
                    ? `${his.user.name} (Bạn)`
                    : `${his.user.name}`}
                </td>
                <td className="py-3 px-1 sm:px-3 truncate text-[12px] sm:text-sm font-bold text-blue-600 text-right">
                  {formatCurrency(his.price)}
                </td>
                <td className="py-3 px-1 sm:px-3 truncate text-[12px] sm:text-sm font-bold text-red-400 text-right">
                  <div className="w-full flex justify-end items-center">
                    <UserMinus
                      onClick={() => {
                        setBlacklistConfirm(true);
                        setBlacklistUser(his.user);
                      }}
                      className="hover:text-red-600 cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {blacklistConfirm && (
        <ConfirmPopup
          isOpen={true}
          onClose={() => {
            setBlacklistConfirm(false);
          }}
          selected={{
            id: blacklistUser.id,
            content: `từ chối lượt ra giá của ${blacklistUser.name} và chặn mọi thao tác của người dùng này trong sản phẩm`,
          }}
          onConfirm={handleBlacklist}
        />
      )}
    </div>
  );
};
