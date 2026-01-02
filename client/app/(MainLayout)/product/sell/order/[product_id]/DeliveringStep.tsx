"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Order } from "../../../../../../../shared/src/types";
import { Truck, Phone, User, MapPin, CalendarDays, Info } from "lucide-react";
import DeliveryGuy from "@/public/Delivery guy.json";

type ComponentProps = {
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

const DeliveringStep = ({ order }: ComponentProps) => {
  const beginDate = new Date(order.updated_at || order.created_at);
  const expectedDate = new Date(beginDate);
  expectedDate.setDate(beginDate.getDate() + 3);

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 py-2">
      {/* Tiêu đề trạng thái - Chuyển sang Teal để đồng bộ Seller theme */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-teal-600 tracking-tight flex items-center justify-center gap-3">
          <Truck className="w-8 h-8" />
          Đơn hàng đang vận chuyển
        </h2>
        <p className="text-slate-500 font-medium">
          Tài xế đã lấy hàng thành công và đang trên đường đến người mua
        </p>
      </div>

      <DeliveryAnimation />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Thông tin người nhận - Đồng bộ style Buyer */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3 text-lg">
            <User className="w-5 h-5 text-teal-500" />
            Thông tin người nhận
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  Tên khách hàng
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
                  Số điện thoại
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
                  Địa chỉ giao hàng
                </span>
                <span className="font-semibold text-slate-700 leading-snug">
                  {order.shipping_address}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Lịch trình dự kiến */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 border-b border-slate-50 pb-3 text-lg">
            <CalendarDays className="w-5 h-5 text-teal-500" />
            Tiến độ vận chuyển
          </h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div className="relative pl-8 border-l-2 border-dashed border-slate-200 space-y-8">
              <div className="relative">
                <div className="absolute -left-[41px] top-0 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm" />
                <p className="text-[11px] font-bold text-slate-400 uppercase">
                  Bàn giao đơn vị vận chuyển
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
                  Thời gian khách nhận dự kiến
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

            <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 flex gap-3">
              <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <p className="text-xs text-teal-800 leading-relaxed font-medium italic">
                Tiền thanh toán sẽ được hệ thống tạm giữ cho đến khi người mua
                xác nhận <b>Đã nhận hàng.</b>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer gợi ý */}
      <div className="text-center pt-4">
        <p className="text-slate-400 text-sm italic">
          Đang chờ khách hàng xác nhận nhận hàng thành công...
        </p>
      </div>
    </div>
  );
};

export default DeliveringStep;
