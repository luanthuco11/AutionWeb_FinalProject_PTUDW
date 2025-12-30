"use client";

import Image from "next/image";
import {
  CreateRating,
  UserRating,
  WinningProduct,
} from "../../../shared/src/types";
import { formatCurrency } from "@/app/(MainLayout)/product/[product_slug]/components/Question";
import Link from "next/link";
import { User, Star, Clock, ChevronRight, Tag } from "lucide-react";
import OrderStatusBadge from "./OrderStatusBadge";
import { useState } from "react";
import RatingPopup from "../RatingPopUp";
import FeedbackBox from "../FeedbackBox";
import { useAuthStore } from "@/store/auth.store";
import { RatingHook } from "@/hooks/useRating";
import FeedbackPopup from "../FeedbackPopup";

const WinProduct = ({ product }: { product: WinningProduct }) => {
  const [openRatingModal, setOpenRatingModal] = useState<boolean>(false);
  const user = useAuthStore((s) => s.user);

  const { data: rating, isLoading: isLoadingRating } =
    RatingHook.useGetOneRating(user?.id || 0, product?.seller?.id) as {
      data: UserRating;
      isLoading: boolean;
    };

  const { mutate: createRating, isPending: isCreatingRating } =
    RatingHook.useCreateRating();

  const { mutate: updateRating, isPending: isUpdatingRating } =
    RatingHook.useUpdateRating();

  const sellerRating = Math.ceil(
    (100.0 * product.seller.positive_points) /
      (product.seller.positive_points + product.seller.negative_points)
  );

  const handleRatingSeller = (ratingPoint: number, message: string) => {
    if (!user || !product) return;
    const newRating: CreateRating = {
      ratee: { ...product.seller, profile_img: "" },
      rating: ratingPoint,
      comment: message,
    };

    if (!rating) createRating(newRating);
    else updateRating(newRating);
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-4 w-full transition-all hover:shadow-lg hover:border-teal-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Phần bên trái: Ảnh + Thông tin sản phẩm & Người bán */}
        <div className="flex items-start gap-4 flex-1">
          <div className="relative shrink-0">
            <Image
              src={product.main_image}
              alt={product.name}
              width={90}
              height={90}
              className="rounded-xl object-cover border border-slate-100 shadow-sm"
            />
            <div className="absolute -top-2 -left-2 bg-teal-500 text-white p-1.5 rounded-lg shadow-lg">
              <Tag className="w-3 h-3" />
            </div>
          </div>

          <div className="flex flex-col gap-1 justify-center">
            <Link
              href={`/product/order/${product.id}`}
              className="group/title flex items-center gap-1"
            >
              <h3 className="font-bold text-slate-800 text-[16px] line-clamp-1 group-hover/title:text-teal-600 transition-colors">
                {product.name}
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover/title:translate-x-1 transition-transform" />
            </Link>

            {/* Thông tin người bán */}
            <div className="flex items-baseline text-sm gap-0.5 text-slate-600">
              <div className="flex items-center gap-1.5 px-1.5 py-1 rounded-full">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium">
                  {product.seller.name || "Người bán"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span className="font-semibold text-xs">{sellerRating}%</span>
              </div>
            </div>

            {/* Trạng thái đơn hàng */}
            <div className="flex gap-2">
              <OrderStatusBadge status={product.status} />
              {product.status === "shipped" && (
                <button
                  onClick={() => {
                    setOpenRatingModal(true);
                  }}
                  className="group flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-200 shadow-sm active:scale-95"
                >
                  <div className="relative">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {/* Hiệu ứng lấp lánh nhỏ khi hover */}
                    <span className="absolute -top-1 -right-1 w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wide">
                    Đánh giá
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Phần bên phải: Giá cả & Thời gian */}
        <div className="flex flex-col items-end gap-3.5 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50">
          <div className="text-right">
            <p className="text-slate-400 text-[12px] font-medium uppercase tracking-wider">
              Giá đấu thắng
            </p>
            <p className="text-teal-600 font-black text-xl tracking-tight">
              {formatCurrency(product.current_price)}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <Clock className="w-3.5 h-3.5" />
            <div className="text-[12px] leading-none flex flex-row gap-2 items-baseline">
              {/* <span className="block font-medium text-slate-400 mb-0.5">
                Ngày thắng:
              </span> */}
              <span className="text-slate-700 font-semibold">
                {new Date(product.winning_date).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Trang trí góc khi hover */}
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-linear-to-br from-transparent to-teal-50/50 rounded-br-2xl -z-10 transition-opacity opacity-0 group-hover:opacity-100" />

      {openRatingModal && (
        <FeedbackPopup
          targetName={product.seller.name}
          rating={rating}
          onRating={handleRatingSeller}
          onClose={() => setOpenRatingModal(false)}
        />
      )}
    </div>
  );
};

export default WinProduct;
