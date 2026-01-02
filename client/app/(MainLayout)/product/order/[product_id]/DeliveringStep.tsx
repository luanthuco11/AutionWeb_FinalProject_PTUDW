"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Order } from "../../../../../../shared/src/types";
import {
  MapPinCheckInside,
  Truck,
  Phone,
  User,
  MapPin,
  CalendarDays,
} from "lucide-react";
import DeliveryGuy from "@/public/Delivery guy.json";
import OrderHook from "@/hooks/useOrder";
import LoadingSpinner from "@/components/LoadingSpinner";

type ComponentProps = {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  order: Order;
};

const DeliveryAnimation = () => {
  return (
    <div className="w-full flex justify-center py-2">
      <div className="w-full max-w-[450px] h-[300px] overflow-hidden flex items-center justify-center relative">
        <div className="absolute transform scale-140">
          <DotLottieReact
            data={DeliveryGuy}
            loop
            autoplay
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

const DeliveringStep = ({ setActive, order }: ComponentProps) => {
  const { mutate: buyerConfirmShipped, isPending: isConfirmingShipped } =
    OrderHook.useBuyerConfirmShipped();

  const beginDate = new Date(order.updated_at || order.created_at);
  const expectedDate = new Date(beginDate);
  expectedDate.setDate(beginDate.getDate() + 3);

  const handleConfirmShipped = () => {
    if (!order?.product_id) return;
    buyerConfirmShipped(
      { productId: Number(order.product_id) },
      { onSuccess: () => setActive(3) }
    );
  };

  if (isConfirmingShipped) {
    return (
      <div className="relative w-full h-[500px] flex flex-col items-center justify-center gap-4">
        <div className="w-full h-50">
          <LoadingSpinner />
        </div>
        <p className="text-slate-500 animate-pulse font-medium">
          Đang xác nhận...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 py-2">
      {/* Tiêu đề trạng thái */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-blue-600 tracking-tight flex items-center justify-center gap-3">
          <Truck className="w-8 h-8" />
          Đơn hàng đang giao đến bạn
        </h2>
        <p className="text-slate-500 font-medium">
          Luôn để ý điện thoại và email để shipper liên lạc bạn nhé
        </p>
      </div>

      <DeliveryAnimation />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Thông tin người nhận */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3 text-lg">
            <User className="w-5 h-5 text-blue-500" />
            Thông tin nhận hàng
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Họ và tên
                </span>
                <span className="font-semibold text-slate-700">
                  {order.buyer.name}
                </span>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Số liên hệ
                </span>
                <span className="font-semibold text-slate-700">
                  {order.phone_number}
                </span>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Địa chỉ
                </span>
                <span className="font-semibold text-slate-700">
                  {order.shipping_address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Lịch trình dự kiến */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3 text-lg">
            <CalendarDays className="w-5 h-5 text-blue-500" />
            Thời gian dự kiến
          </h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="relative pl-8 border-l-2 border-dashed border-slate-200 space-y-8">
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm" />
                <p className="text-[11px] font-bold text-slate-400 uppercase">
                  Ngày bắt đầu
                </p>
                <p className="font-bold text-slate-800 text-lg">
                  {beginDate.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />
                <p className="text-[11px] font-bold text-slate-400 uppercase">
                  Dự kiến nhận
                </p>
                <p className="font-bold text-emerald-600 text-lg">
                  {expectedDate.toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
              <p className="text-xs text-amber-700 font-medium leading-relaxed italic">
                Vui lòng chỉ xác nhận <b>Đã nhận hàng</b> khi bạn đã cầm sản
                phẩm trên tay và kiểm tra kỹ lưỡng.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nút hành động */}
      <div className="flex flex-col items-center gap-3 mt-4">
        <button
          onClick={handleConfirmShipped}
          className="group flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 shadow-lg shadow-blue-100"
        >
          <MapPinCheckInside className="w-6 h-6 group-hover:animate-bounce" />
          Xác nhận đã nhận hàng
        </button>
      </div>
    </div>
  );
};

export default DeliveringStep;
