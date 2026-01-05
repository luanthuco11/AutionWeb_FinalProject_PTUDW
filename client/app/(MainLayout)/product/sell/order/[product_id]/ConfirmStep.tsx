"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import OrderHook from "@/hooks/useOrder";
import React, { useState } from "react";
import { Order, Product } from "../../../../../../../shared/src/types";
import { formatCurrency } from "../../[product_slug]/components/Question";
import Image from "next/image";
import {
  CircleCheckBig,
  Truck,
  User,
  Mail,
  MapPin,
  ShieldAlert,
  Phone,
  CheckCircle2,
  Eye,
  X,
} from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import RejectOrderButton from "./RejectOrderButton";
import clsx from "clsx";

type ComponentProps = {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  order: Order;
  product: Product;
};

const ConfirmStep = ({ setActive, order, product }: ComponentProps) => {
  const [isPackaged, setIsPackaged] = useState<boolean>(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const { mutate: sellerConfirmOrder, isPending: isConfirmingOrder } =
    OrderHook.useSellerConfirmOrder();

  const handleConfirm = () => {
    if (!order.buyer?.id || !order.product_id) return;

    sellerConfirmOrder(
      {
        productId: order.product_id,
        buyerId: order.buyer.id,
      },
      {
        onSuccess: () => setActive(2),
      }
    );
  };

  if (isConfirmingOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-12 md:py-20 gap-4 md:gap-6">
        <div className="scale-75 md:scale-100">
          <LoadingSpinner />
        </div>
        <p className="text-teal-600 text-xs md:text-sm font-medium animate-pulse">
          Đang kết nối với đơn vị vận chuyển...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto flex flex-col gap-6 md:gap-8 py-4 md:py-8 px-2 md:px-0">
      {/* BƯỚC 1: XÁC NHẬN & ĐÓNG GÓI */}
      <div className="bg-white border border-slate-200 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
          <div className="flex items-center gap-2.5 md:gap-3">
            <div className="w-6 min-w-6 h-6 md:w-8 md:h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs md:text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-800 text-sm md:text-lg">
              Xác nhận & Đóng gói
            </h3>
          </div>

          <div className="flex justify-start sm:justify-end">
            {isPackaged ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-teal-50 text-teal-600 rounded-lg md:rounded-xl border border-teal-200 font-bold text-[10px] md:text-sm animate-in zoom-in duration-300">
                <CircleCheckBig className="w-4 h-4 md:w-5 md:h-5" />
                <span>Đã đóng gói hàng</span>
              </div>
            ) : (
              <div className="w-full sm:w-44 h-9 md:h-11">
                <PrimaryButton
                  backgroundColor={"#0d9488"}
                  hoverBackgroundColor={"#0f766e"}
                  onClick={() => setIsPackaged(true)}
                  text="Xác nhận đóng gói"
                />
              </div>
            )}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {[
            { icon: User, label: "Người nhận", value: order.buyer.name },
            {
              icon: Phone,
              label: "Số điện thoại",
              value: order.phone_number || "Chưa cung cấp",
            },
            { icon: Mail, label: "Email liên hệ", value: order.buyer.email },
            {
              icon: MapPin,
              label: "Địa chỉ giao hàng",
              value: order.shipping_address,
              isAddress: true,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="px-4 md:px-6 py-3 md:py-4 flex items-start gap-3 md:gap-4"
            >
              <item.icon
                className={clsx(
                  "w-4 h-4 md:w-5 md:h-5 text-slate-400 shrink-0",
                  !item.isAddress && "mt-0.5"
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] md:text-[11px] text-slate-400 font-bold uppercase mb-0.5 tracking-tight">
                  {item.label}
                </p>
                <p
                  className={clsx(
                    "text-sm md:text-base font-semibold text-slate-800 leading-snug",
                    !item.isAddress && "truncate"
                  )}
                >
                  {item.value}
                </p>
              </div>
            </div>
          ))}

          <div className="px-4 md:px-6 py-4 md:py-5 bg-teal-600 flex items-center justify-between text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />

            <div className="flex flex-col gap-2 md:gap-1.5 z-10">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-teal-100 opacity-90" />
                <span className="text-[10px] md:text-xs font-medium uppercase tracking-widest text-teal-50">
                  Đã nhận thanh toán
                </span>
              </div>
              <div className="text-center z-10 pl-2 shrink-0">
                <span className="text-xl md:text-2xl font-black tracking-tight leading-none">
                  {formatCurrency(order.price)}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsPreviewOpen(true)}
              className="group w-fit relative flex items-center gap-1.5 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-all border border-white/10"
            >
              <div className="w-6 h-6 md:w-8 md:h-8 relative rounded overflow-hidden border border-white/20">
                <Image
                  src={order.payment_invoice || ""}
                  alt="Receipt"
                  fill
                  className="object-cover"
                />
              </div>

              <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-tight">
                Biên lai
              </span>

              <Eye className="w-3 h-3 md:w-4 md:h-4 opacity-70 group-hover:opacity-100" />
            </button>
          </div>
        </div>
      </div>

      {/* BƯỚC 2: VẬN CHUYỂN */}
      <div
        className={clsx(
          "bg-white border rounded-xl md:rounded-2xl overflow-hidden shadow-sm transition-all duration-500",
          isPackaged
            ? "border-teal-200 opacity-100"
            : "border-slate-200 opacity-60 grayscale-[0.5]"
        )}
      >
        <div className="bg-slate-50 px-4 md:px-6 py-3 md:py-4 border-b border-slate-200 flex items-center gap-2.5 md:gap-3">
          <div
            className={clsx(
              "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-colors",
              isPackaged ? "bg-teal-600 text-white" : "bg-slate-300 text-white"
            )}
          >
            2
          </div>
          <h3 className="font-bold text-slate-800 text-sm md:text-lg">
            Giao hàng
          </h3>
        </div>

        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          <div
            className={clsx(
              "w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-3 md:mb-4 transition-all",
              isPackaged
                ? "bg-teal-50 text-teal-600 scale-105 md:scale-110 shadow-lg shadow-teal-100"
                : "bg-slate-100 text-slate-400"
            )}
          >
            <Truck
              className={clsx(
                "w-7 h-7 md:w-10 md:h-10",
                isPackaged ? "animate-bounce" : ""
              )}
            />
          </div>

          <h4 className="text-base md:text-xl font-bold text-slate-800 mb-1 md:mb-2">
            Sẵn sàng vận chuyển
          </h4>
          <p className="text-slate-500 text-[11px] md:text-sm max-w-[280px] md:max-w-sm mb-6 md:mb-8 leading-relaxed">
            Hệ thống sẽ tìm tài xế gần nhất đến lấy hàng và giao đến người mua.
          </p>

          <button
            onClick={handleConfirm}
            disabled={!isPackaged}
            className={clsx(
              "flex items-center gap-2 md:gap-3 px-8 md:px-12 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-lg transition-all shadow-md active:scale-95 w-full md:w-auto justify-center",
              !isPackaged
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-900/10"
            )}
          >
            <Truck className="w-4 h-4 md:w-6 md:h-6" />
            Tìm tài xế ngay
          </button>
        </div>
      </div>

      {/* FOOTER: HỦY ĐƠN */}
      <div className="p-4 md:p-5 bg-red-50 rounded-xl md:rounded-2xl border border-red-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 md:w-6 md:h-6 text-red-500 shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-xs md:text-sm font-bold text-red-800">
              Cần hủy đơn hàng này?
            </p>
            <p className="text-[10px] md:text-xs text-red-600 leading-tight">
              Nếu phát hiện thanh toán giả mạo hoặc người mua bất thường.
            </p>
          </div>
        </div>
        <div className="shrink-0 w-full md:w-auto h-9 md:h-10">
          <RejectOrderButton order={order} product={product} />
        </div>
      </div>

      {/* Modal View Ảnh Biên Lai */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200"
          onClick={() => setIsPreviewOpen(false)}
        >
          <button className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full">
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-2xl h-[80vh]">
            <Image
              src={order.payment_invoice || ""}
              alt="Biên lai phóng to"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmStep;
