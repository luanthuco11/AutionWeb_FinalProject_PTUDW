"use client";

import Image from "next/image";
import { BiddingProduct } from "../../../shared/src/types";
import Link from "next/link";
import { formatCurrency } from "@/app/(MainLayout)/product/[product_slug]/components/Question";
import { defaultImage } from "@/app/const";
import {
  ChevronRight,
  Gavel,
  TrendingUp,
  User,
  Star,
  Clock,
  Crown,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { getTimeDifference } from "@/utils";

const BidProduct = ({ product }: { product: BiddingProduct }) => {
  const user = useAuthStore((s) => s.user);

  const formatLeaderName = (name: string, id: number) => {
    if (!name) return "---";
    if (user?.id === id)
      return <span className="text-emerald-600 font-extrabold">Bạn</span>;

    if (name.length <= 2) return name;
    return `${name[0]}*****${name[name.length - 1]}`;
  };

  const sellerRating = Math.ceil(
    (100.0 * product.seller.positive_points) /
      (product.seller.positive_points + (product.seller.negative_points || 0) ||
        1)
  );

  return (
    <Link href={`/product/${product.slug}`} className="block group">
      <div className="relative bg-white border border-slate-200 rounded-2xl p-4 w-full transition-all hover:shadow-lg hover:border-teal-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
            <div className="relative shrink-0">
              <div className="relative w-[72px] h-[72px] md:w-[90px] md:h-[90px]">
                <Image
                  src={product.main_image || defaultImage}
                  alt={product.name}
                  fill
                  className="rounded-xl object-cover border border-slate-100 shadow-sm"
                />
              </div>
              <div className="absolute -top-1.5 -left-1.5 bg-slate-800 text-white p-1 rounded-lg shadow-lg z-10">
                <Gavel className="w-3 h-3" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 justify-center flex-1 min-w-0">
              <div className="group/title flex items-center gap-1">
                <h3 className="font-bold text-slate-800 text-[16px] md:text-[17px] line-clamp-1 group-hover:text-teal-600 transition-colors">
                  {product.name}
                </h3>
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </div>

              <div className="flex items-center text-[13px] md:text-sm gap-2 text-slate-500">
                <span className="flex items-center gap-1 font-medium truncate max-w-[130px]">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {product.seller.name}
                </span>
                <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  {sellerRating}%
                </span>
              </div>

              {/* Phần được điều chỉnh chữ to hơn */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[12px] md:text-[13px] text-slate-500 font-semibold">
                    Dẫn đầu:
                  </span>
                  <span className="text-[12px] md:text-[13px] text-slate-900 font-bold">
                    {product.top_bidder
                      ? formatLeaderName(
                          product.top_bidder.name,
                          product.top_bidder.id
                        )
                      : "Trống"}
                  </span>
                </div>
                <div className="text-[12px] md:text-[13px] text-slate-500 font-medium">
                  Của bạn:{" "}
                  <span className="font-bold text-slate-800 bg-teal-50 px-1.5 py-0.5 rounded text-[13px]">
                    {formatCurrency(product.user_price)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-3 sm:pt-0 sm:pl-6 shrink-0 border-t sm:border-t-0 border-slate-50">
            <div className="text-left sm:text-right">
              <p className="hidden sm:block text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-0.5">
                Giá hiện tại
              </p>
              <div className="flex items-center gap-1 sm:justify-end">
                <TrendingUp className="w-3.5 h-3.5 text-teal-500 sm:hidden" />
                <p className="text-teal-600 font-bold text-[20px] md:text-2xl leading-none">
                  {formatCurrency(product.current_price)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 sm:mt-1">
              <Clock className="w-4 h-4 text-rose-400" />
              <span className="text-[13px] font-bold text-slate-700">
                {product.end_time
                  ? getTimeDifference(new Date(), new Date(product.end_time))
                  : "--/--/----"}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-transparent to-slate-50/50 rounded-br-2xl -z-10 transition-opacity opacity-0 group-hover:opacity-100" />
      </div>
    </Link>
  );
};

export default BidProduct;
