"use client";

import React from "react";
import { Order } from "../../../../../../shared/src/types";
import {
  XCircle,
  Calendar,
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
  History,
} from "lucide-react";
import Link from "next/link";

const CancelledCard = ({ order }: { order: Order }) => {
  return (
    <div className="w-full py-16 px-4 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-md w-full bg-white border border-red-100 rounded-[2.5rem] p-10 shadow-2xl shadow-red-100/40 relative overflow-hidden">
        {/* Decor Layer */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50/50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-50 rounded-full -ml-12 -mb-12 blur-2xl"></div>

        <div className="relative flex flex-col items-center text-center">
          {/* Main Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-red-500 rounded-4xl flex items-center justify-center shadow-lg shadow-red-200 rotate-3 transition-transform hover:rotate-0 duration-500">
              <XCircle className="h-12 w-12 text-white" strokeWidth={1.5} />
            </div>
          </div>

          {/* Content */}
          <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">
            Đơn hàng đã hủy
          </h2>

          <div className="flex items-center gap-2 text-slate-400 text-sm mb-8 font-medium">
            <Calendar size={14} />
            <span>
              {new Date(order.updated_at!).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Reason Box - Cải tiến layout */}
          <div className="w-full bg-slate-50/80 backdrop-blur-sm border border-slate-100 rounded-[1.5rem] p-5 mb-8 text-left transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1.5 h-4 bg-red-400 rounded-full"></div>
              <p className="text-[11px] font-bold text-slate-400 uppercase">
                Lý do từ hệ thống
              </p>
            </div>
            <p className="text-slate-700 font-semibold leading-relaxed">
              {"Người mua không thanh toán"}
            </p>
          </div>

          {/* Action Buttons - Giúp Buyer thoát khỏi trang lỗi */}
          <div className="w-full grid grid-cols-1 gap-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
              <ShoppingBag size={18} />
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-8 text-slate-400 text-xs font-medium italic">
        Mọi thắc mắc liên hệ về email của người bán: <b>{order.seller.email}</b>
      </p>
    </div>
  );
};

export default CancelledCard;
