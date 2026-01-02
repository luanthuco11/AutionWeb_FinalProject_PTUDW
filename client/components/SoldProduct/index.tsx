"use client";

import Image from "next/image";
import {
  CreateRating,
  UserRating,
  FullSoldProduct,
} from "../../../shared/src/types";
import { formatCurrency } from "@/app/(MainLayout)/product/[product_slug]/components/Question";
import Link from "next/link";
import { User, Star, Clock, ChevronRight, Tag } from "lucide-react";
import OrderStatusBadge from "../WinProduct/OrderStatusBadge";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { RatingHook } from "@/hooks/useRating";
import FeedbackPopup from "../FeedbackPopup";

interface SoldProps {
  product: FullSoldProduct;
}

const SoldProduct = ({ product }: SoldProps) => {
  const [openRatingModal, setOpenRatingModal] = useState<boolean>(false);
  const user = useAuthStore((s) => s.user);

  const { data: rating } = RatingHook.useGetOneRating(
    user?.id || 0,
    product?.buyer?.id || 0
  ) as { data: UserRating };

  const { mutate: createRating } = RatingHook.useCreateRating();
  const { mutate: updateRating } = RatingHook.useUpdateRating();

  const buyerRating = product.buyer
    ? Math.ceil(
        (100.0 * product.buyer.positive_points) /
          (product.buyer.positive_points +
            (product.buyer.negative_points || 0) || 1)
      )
    : 0;

  const handleRatingBuyer = (ratingPoint: number, message: string) => {
    if (!user || !product.buyer) return;

    const newRating: CreateRating = {
      ratee: { ...product.buyer, profile_img: "" },
      rating: ratingPoint,
      comment: message,
    };

    if (!rating) createRating(newRating);
    else updateRating(newRating);
  };

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-4 w-full transition-all hover:shadow-lg hover:border-teal-200 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
          <div className="relative shrink-0">
            <div className="relative w-[72px] h-[72px] md:w-[90px] md:h-[90px]">
              <Image
                src={product.main_image}
                alt={product.name}
                fill
                className="rounded-xl object-cover border border-slate-100 shadow-sm"
              />
            </div>
            <div className="absolute -top-1.5 -left-1.5 bg-indigo-500 text-white p-1 rounded-lg shadow-lg z-10">
              <Tag className="w-3 h-3" />
            </div>
          </div>

          <div className="flex flex-col gap-1 justify-center flex-1 min-w-0">
            <Link
              href={`/product/sell/order/${product.id}`}
              className="group/title flex items-center gap-1"
            >
              <h3 className="font-bold text-slate-800 text-[15px] md:text-[16px] line-clamp-1 group-hover/title:text-teal-600 transition-colors">
                {product.name}
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover/title:translate-x-0.5 transition-transform" />
            </Link>

            <div className="flex items-center text-[12px] md:text-sm gap-2 text-slate-500">
              <span className="flex items-center gap-1 font-medium truncate max-w-[120px]">
                <User className="w-3 h-3 text-slate-400" />
                {product.buyer?.name || "N/A"}
              </span>
              {product.buyer && (
                <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-500" />
                  {buyerRating}%
                </span>
              )}
            </div>

            <div className="flex gap-2 items-center mt-0.5">
              {product.status !== "available" && (
                <OrderStatusBadge status={product.status} />
              )}
              {product.status === "shipped" && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenRatingModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-200 text-emerald-600 rounded-full hover:bg-emerald-600 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wide shadow-sm"
                >
                  <Star className="w-3 h-3 fill-current" />
                  Đánh giá
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 sm:pl-6 shrink-0 border-t sm:border-t-0 border-slate-50">
          <div className="text-left sm:text-right">
            <p className="hidden sm:block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
              Giá chốt phiên
            </p>
            <p className="text-teal-600 font-black text-[18px] md:text-xl tracking-tight leading-none">
              {formatCurrency(product.current_price)}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 sm:mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[12px] font-semibold text-slate-600">
              {product.end_time
                ? new Date(product.end_time).toLocaleDateString("vi-VN")
                : "---"}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-teal-50/40 rounded-br-2xl -z-10 transition-opacity opacity-0 group-hover:opacity-100" />

      {openRatingModal && (
        <FeedbackPopup
          targetName={product.buyer?.name || "Người mua"}
          rating={rating}
          onRating={handleRatingBuyer}
          onClose={() => setOpenRatingModal(false)}
        />
      )}
    </div>
  );
};

export default SoldProduct;
