"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import PrimaryButton from "@/components/PrimaryButton";
import {
  CircleCheckBig,
  NotebookPen,
  CreditCard,
  MapPin,
  AlertCircle,
  Phone,
} from "lucide-react";
import OrderHook from "@/hooks/useOrder";
import { Order, OrderPayment } from "../../../../../../shared/src/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatCurrency } from "../../[product_slug]/components/Question";
import clsx from "clsx";

type ComponentProps = {
  setActive?: React.Dispatch<React.SetStateAction<number>>;
  order: Order;
};

const PaymentStep = ({ setActive, order }: ComponentProps) => {
  const [address, setAddress] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isPaid, setIsPaid] = useState<boolean>(false);

  const { mutate: buyerPayOrder, isPending: isPayingOrder } =
    OrderHook.useBuyerPayOrder();

  useEffect(() => {
    setAddress(order?.buyer.address || "");
  }, [order]);

  const handlePayment = () => setIsPaid(true);

  const handleConfirmation = () => {
    const payment: OrderPayment = {
      product_id: order.product_id,
      is_paid: true,
      address: address,
      phone_number: phoneNumber,
    };

    buyerPayOrder(
      { productId: Number(order.product_id), payment: payment },
      { onSuccess: setActive && (() => setActive(1)) }
    );
  };

  if (isPayingOrder) {
    return (
      <div className="relative flex flex-col items-center justify-center h-120 gap-4">
        <div className="w-full h-50">
          <LoadingSpinner />
        </div>
        <p className="text-slate-500 animate-pulse">Đang xử lý thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 py-4">
      {/* Bước 1: Thanh toán chuyển khoản */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="font-bold text-slate-800 text-lg">
            Thanh toán chuyển khoản
          </h3>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="shrink-0 group">
            <div className="relative p-2 bg-white border-2 border-dashed border-slate-200 rounded-2xl group-hover:border-blue-400 transition-colors">
              <Image
                src="/seller-QR.jpg"
                alt="QR thanh toán"
                width={180}
                height={180}
                className="rounded-xl"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                <span className="text-xs font-bold text-blue-600">
                  Quét mã để trả tiền
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                  Số tài khoản
                </p>
                <p className="font-mono text-lg text-slate-800 select-all font-bold">
                  1027329108
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                  Chủ tài khoản
                </p>
                <p className="text-slate-800 font-bold">{order.seller.name}</p>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex justify-between items-center">
              <span className="text-red-700 font-medium">
                Số tiền cần thanh toán:
              </span>
              <span className="text-2xl font-black text-red-600">
                {formatCurrency(order.price)}
              </span>
            </div>

            <div className="flex justify-center">
              {isPaid ? (
                <div className="flex items-center justify-center gap-2 px-6 py-2.5 bg-green-50 text-green-600 rounded-full border border-green-200 font-bold animate-in fade-in zoom-in duration-300">
                  <CircleCheckBig className="w-5 h-5" />
                  <span>Đã thực hiện thanh toán</span>
                </div>
              ) : (
                <div className="w-full sm:w-48">
                  <PrimaryButton
                    backgroundColor={"#2563eb"}
                    hoverBackgroundColor={"#1d4ed8"}
                    onClick={handlePayment}
                    text={"Tôi đã chuyển khoản"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bước 2: Thông tin nhận hàng */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="font-bold text-slate-800 text-lg">
            Thông tin nhận hàng
          </h3>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Người nhận
              </label>
              <div className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 flex items-center gap-2">
                <span className="font-medium">{order.buyer.name}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Email liên hệ
              </label>
              <div className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600">
                <span className="font-medium">{order.buyer.email}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Địa chỉ giao hàng
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Số nhà, tên đường, phường/xã..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                Số điện thoại liên lạc
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ví dụ: 0912345678"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 space-y-1">
              <p className="font-bold">Lưu ý quan trọng:</p>
              <p>
                • Kiểm tra kỹ thông tin địa chỉ. Sau khi xác nhận bạn sẽ không
                thể tự chỉnh sửa.
              </p>
              <p>
                • Sử dụng phần <b>"Trao đổi đơn hàng"</b> để chat trực tiếp với
                người bán khi cần.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nút xác nhận cuối cùng */}
      <div className="flex flex-col items-center py-4">
        <button
          onClick={handleConfirmation}
          disabled={!isPaid || !address || !phoneNumber}
          className={clsx(
            "flex gap-3 items-center px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95",
            !isPaid || !address || !phoneNumber
              ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-200"
          )}
        >
          <NotebookPen className="w-6 h-6" />
          Xác nhận hoàn tất
        </button>
        <p className="mt-3 text-sm text-slate-400">
          Vui lòng hoàn thành 2 bước trên để nút xác nhận khả dụng
        </p>
      </div>
    </div>
  );
};

export default PaymentStep;
