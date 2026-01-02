"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import React from "react";
import { Order } from "../../../../../../shared/src/types";
import { formatCurrency } from "../../[product_slug]/components/Question";
import {
  User,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Phone,
  ShieldCheck,
} from "lucide-react";

type ComponentProps = {
  order: Order;
};

const WaitingConfirmStep = ({ order }: ComponentProps) => {
  return (
    <div className="max-w-[500px] mx-auto py-8 space-y-8">
      {/* Header trạng thái */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-2">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Đang chờ xác nhận
        </h2>
        <p className="text-slate-500 text-sm">
          Thông tin của bạn đã được gửi đi, vui lòng chờ người bán kiểm tra.
        </p>
      </div>

      {/* Card Thông tin - Bố cục danh sách dễ đọc */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">
            Thông tin nhận hàng
          </h3>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase">
              Đã thanh toán
            </span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Item: Họ tên */}
          <div className="px-6 py-4 flex items-center gap-4">
            <User className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="flex-1">
              <p className="text-[11px] text-slate-400 font-bold uppercase mb-0.5">
                Người nhận
              </p>
              <p className="font-semibold text-slate-800">{order.buyer.name}</p>
            </div>
          </div>

          {/* Item: Số điện thoại - MỚI THÊM */}
          <div className="px-6 py-4 flex items-center gap-4">
            <Phone className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="flex-1">
              <p className="text-[11px] text-slate-400 font-bold uppercase mb-0.5">
                Số điện thoại
              </p>
              <p className="font-semibold text-slate-800">
                {order.phone_number || "Chưa cung cấp"}
              </p>
            </div>
          </div>

          {/* Item: Email */}
          <div className="px-6 py-4 flex items-center gap-4">
            <Mail className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="flex-1">
              <p className="text-[11px] text-slate-400 font-bold uppercase mb-0.5">
                Email liên hệ
              </p>
              <p className="font-semibold text-slate-800">
                {order.buyer.email}
              </p>
            </div>
          </div>

          {/* Item: Địa chỉ */}
          <div className="px-6 py-4 flex items-center gap-4">
            <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
            <div className="flex-1">
              <p className="text-[11px] text-slate-400 font-bold uppercase mb-0.5">
                Địa chỉ giao hàng
              </p>
              <p className="font-semibold text-slate-800">
                {order.shipping_address}
              </p>
            </div>
          </div>
        </div>

        {/* Banner tổng tiền cuối Card */}
        <div className="p-5 bg-blue-500 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-white" />
            <span className="text-xs font-medium uppercase tracking-widest">
              Tổng thanh toán
            </span>
          </div>
          <span className="text-xl font-bold text-white">
            {formatCurrency(order.price)}
          </span>
        </div>
      </div>

      {/* Loading Area - Đã bọc thẻ div có chiều cao cố định */}
      <div className="flex flex-col items-center gap-6 pt-5">
        <div className="relative w-full h-20 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">
          Hệ thống sẽ cập nhật ngay khi người bán xác nhận...
        </p>
      </div>
    </div>
  );
};

export default WaitingConfirmStep;
