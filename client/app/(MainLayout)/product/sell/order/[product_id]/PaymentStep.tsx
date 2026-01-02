"use client";

import Image from "next/image";
import React from "react";
import { Order, Product } from "../../../../../../../shared/src/types";
import { formatCurrency } from "../../[product_slug]/components/Question";
import { CreditCard, Clock, AlertTriangle, Info, Banknote } from "lucide-react";
import RejectOrderButton from "./RejectOrderButton";

type ComponentProps = {
  order: Order;
  product: Product;
};

const PaymentStep = ({ order, product }: ComponentProps) => {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 py-2">
      {/* Phần 1: Thông tin thanh toán đang hiển thị cho khách */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center">
              <Banknote size={18} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">
              Thông tin thanh toán của bạn
            </h3>
          </div>
          <span className="hidden sm:block px-3 py-1 bg-teal-100 text-teal-700 text-xs font-bold rounded-full uppercase">
            Đang hiển thị cho người mua
          </span>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-8">
          {/* QR Code Section */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-inner">
              <Image
                src="/seller-QR.jpg"
                alt="QR thanh toán"
                width={160}
                height={160}
                className="rounded-lg"
              />
            </div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">
              Mã QR nhận tiền của bạn
            </p>
          </div>

          {/* Bank Details Section */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                  Số tài khoản nhận
                </p>
                <p className="font-mono text-xl text-slate-800 font-bold">
                  1027329108
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-1">
                  Chủ tài khoản
                </p>
                <p className="text-slate-800 font-bold text-lg leading-tight">
                  {product.seller.name}
                </p>
              </div>
            </div>

            <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl flex justify-between items-center">
              <div className="flex items-center gap-2 text-teal-700 font-medium">
                <CreditCard size={18} />
                <span>Giá trị đơn hàng:</span>
              </div>
              <span className="text-2xl font-black text-teal-600">
                {formatCurrency(order.price)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Phần 2: Trạng thái chờ & Hướng dẫn xử lý */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600 shrink-0">
              <Clock size={24} className="animate-pulse" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-slate-800 mb-1">
                Đang chờ người mua xác nhận
              </h4>
              <p className="text-slate-500 font-medium">
                Hệ thống sẽ tự động chuyển sang bước <b>"Chuẩn bị hàng"</b> sau
                khi người mua hoàn tất thanh toán và cung cấp địa chỉ nhận hàng.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="text-sm text-slate-600 leading-relaxed">
                Vui lòng kiểm tra mục <b>"Trao đổi đơn hàng"</b> thường xuyên để
                giải đáp thắc mắc của khách khách hàng.
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="text-sm text-red-800 space-y-1">
                <p className="font-bold">Chính sách hủy đơn:</p>
                <p>
                  Nếu người mua không thanh toán hoặc có dấu hiệu không minh
                  bạch, bạn có quyền <b>Từ chối đơn hàng</b>. Người mua đó sẽ bị
                  hạn chế thao tác với sản phẩm này.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center pt-4 border-t border-slate-100">
            <RejectOrderButton order={order} product={product} />
            <p className="mt-3 text-[13px] text-slate-400">
              Chỉ từ chối đơn hàng khi thực sự cần thiết để giữ uy tín của shop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
