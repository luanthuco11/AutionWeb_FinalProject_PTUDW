import React from "react";
import { Clock, CheckCircle2, User } from "lucide-react"; // Nếu bạn dùng lucide-react, nếu không có thể xóa icon
import { Order, Product } from "../../../../../../shared/src/types";
import Image from "next/image";

type ComponentProps = {
  product: Product;
  order: Order;
};

const OrderInfoCard = ({ product, order }: ComponentProps) => {
  const sellerRating = Math.ceil(
    (100.0 * product.seller.positive_points) /
      (product.seller.positive_points + product.seller.negative_points)
  );
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm w-full">
      {/* Thông tin Người bán */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          {product.seller.profile_img ? (
            <Image
              src={product.seller.profile_img}
              alt={`Ảnh đại diện của ${product.seller.name}`}
              width={200}
              height={200}
              className="w-14 h-14 object-cover object-center rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
              {/* Thay src bằng link ảnh thật hoặc dùng Icon làm placeholder */}
              <User className="w-8 h-8 text-slate-400" />
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h3 className="font-semibold text-slate-900 text-lg">
            {product.seller.name}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-blue-600">
              {`⭐ ${sellerRating ? `${sellerRating}%` : `Chưa có đánh giá`}`}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        {/* Đơn tạo lúc */}
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Đơn tạo lúc
            </p>
            <p className="text-sm text-slate-700 font-medium">
              {new Date(order.created_at).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Trạng thái đơn */}
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
              Đơn hoàn thành lúc
            </p>
            <p className="text-sm text-slate-700 font-medium">
              {order.status === "shipped"
                ? new Date(order.updated_at || "").toLocaleString("vi-VN")
                : "Chưa kết thúc"}
            </p>
            {/* <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 mt-1">
              
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderInfoCard;
