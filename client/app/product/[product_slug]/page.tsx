"use client";
import BreadCrump from "@/components/Breadcrump";
import FunctionalButton from "@/components/FunctionalButton";
import {
  CalendarOutlineIcon,
  LoveIcon,
  UserOutlineIcon,
} from "@/components/icons";
import { ImageCarousel } from "@/components/ImageCarousel";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Product } from "../../../../shared/src/types";

import ProductHook from "@/hooks/useProduct";
import { useParams } from "next/navigation";
import { Question, formatCurrency, formatDate } from "./components/Question";
import { BidHistory } from "./components/BidHistory";
import { RelatedProducts } from "./components/RelatedProducts";

function isLessThreeDays(dateA: Date, dateB: Date): boolean {
  const diffMs = Math.abs(dateA.getTime() - dateB.getTime()); // hiệu số milliseconds
  const threeDaysMs = 3 * 24 * 60 * 60 * 1000; // 3 ngày đổi sang ms

  return diffMs < threeDaysMs;
}
function diffToHMS(A: Date, B: Date) {
  let diff = Math.abs(B.getTime() - A.getTime()) / 1000; // tính ra giây

  const hours = Math.floor(diff / 3600);
  diff %= 3600;

  const minutes = Math.floor(diff / 60);
  const seconds = Math.floor(diff % 60);

  return `${hours} giờ ${minutes} phút ${seconds} giây`;
}
interface Time {
  endTime?: Date | null;
}

function EndTime({ endTime }: Time) {
  const now = new Date();
  const localString = endTime?.toLocaleString("vi-VN", {
    hour12: false,
  });

  return (
    <div className="pb-6 border-b  mb-6 border-slate-200 ">
      <p className="text-sm text-slate-600 mb-2 font-light">
        Thời gian còn lại
      </p>
      {endTime && endTime.getTime() <= now.getTime() ? (
        <p className="text-xl font-bold text-teal-600">Đã kết thúc</p>
      ) : (
        <p className="text-xl font-bold text-red-500">
          {endTime && isLessThreeDays(now, endTime) ? (
            <>{diffToHMS(now, endTime)}</>
          ) : (
            <>{localString}</>
          )}
        </p>
      )}
    </div>
  );
}

export default function ProductPage() {
  const { product_slug } = useParams();
  const [product, setProduct] = useState<Product>();
  const { data: data, isLoading: isLoadingProduct } =
    ProductHook.useGetProductById(21);

  const handleLike = () => {
    console.log("Đã nhấn like");
  };
  const handleBuyNow = () => {
    console.log("Đã nhấn mua ngay");
  };
  const handleBid = () => {
    console.log("Đã nhấn bid ");
  };
  useEffect(() => {
    if (data) {
      setProduct(data.data.product);
    }
  }, [data]);

  return (
    <div className="bg-[#F8FAFC] w-full">
      <div className="mb-4">
        <BreadCrump
          category_name=""
          category_slug={product?.slug || ""}
          product_name={product?.name || ""}
        />
      </div>
      {product && (
        <div className="flex flex-col md:flex-row gap-12 mb-12 ">
          <div className="p-8 md:p-0 md:w-1/2 ">
            <ImageCarousel />
          </div>
          <div className="bg-white border  border-gray-200 rounded-lg p-4 sm:p-8 w-full">
            <div className="pb-6 border-b mb-6  border-slate-200">
              <h1 className="text-2xl font-bold mb-4 text-slate-900">
                {product.name}
              </h1>
              <p className="text-sm font-light mb-2 text-slate-600">
                Giá hiện tại
              </p>
              <p className="text-4xl font-bold text-teal-600 mb-2">
                {product.current_price && formatCurrency(product.current_price)}
              </p>
              <p className="text-sm text-slate-600 font-light">
                {" "}
                {product.bid_count} Lượt đấu giá
              </p>
            </div>
            <div className="pb-6 border-b mb-6 border-slate-200 grid grid-cols-2">
              <div>
                <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                  <CalendarOutlineIcon />
                  Thời điểm đăng
                </p>
                <p className="ml-4 text-[16px] font-semibold text-slate-900">
                  {formatDate(product.created_at)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                  <UserOutlineIcon />
                  Người ra giá cao nhất
                </p>
                {product.top_bidder ? (
                  product.top_bidder.name
                ) : (
                  <p className=" ml-4 text-[16px] font-semibold text-slate-900">
                    Chưa có
                  </p>
                )}
              </div>
            </div>

            <div className="pb-6 border-b  mb-6 border-slate-200">
              <div>
                <p className="text-sm font-medium  text-slate-600 mb-3">
                  Người bán
                </p>
              </div>
              <div className="flex flex-row gap-4">
                <div className="rounded-[6px] overflow-hidden">
                  <Image
                    src={product.seller.profile_img || ""}
                    width={50}
                    height={50}
                    alt="..."
                  />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">
                    {product.seller.name}
                  </p>
                  <p className="text-xs text-slate-600">⭐ {"4.5"}</p>
                </div>
              </div>
            </div>

            <EndTime endTime={new Date(product.end_time || "")} />
            <div className="pb-6 border-b  mb-6 border-slate-200 ">
              <p className="text-sm text-slate-600 mb-2 font-light">
                Giá đấu tiếp theo
              </p>
              <p className="text-3xl font-bold text-teal-600">
                {formatCurrency(
                  (product.current_price || 0) + (product.price_increment || 0)
                )}
              </p>
            </div>
            <div className="pb-6 border-b  mb-6 border-slate-200 gap-4 flex flex-col">
              <div>
                <PrimaryButton text="Đặt lệnh đấu giá" onClick={handleBid} />
              </div>
              <div>
                <SecondaryButton
                  text={
                    "Mua ngay " + formatCurrency(product.buy_now_price || 0)
                  }
                  onClick={handleBuyNow}
                />
              </div>
            </div>
            <div>
              <div
                onClick={handleLike}
                className="flex-1 flex items-center justify-center gap-2 py-2 border border-slate-300 rounded-lg hover:bg-slate-100  hover:cursor-pointer"
              >
                <LoveIcon />
                {/* <LoveFullIcon /> */}
                <span className="text-sm font-medium">Yêu thích</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg p-3 sm:p-6 mb-8 border border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900 mb-4">
          Thông tin chi tiết sản phẩm
        </h3>
        <p>{product?.description}</p>
      </div>
      {product && <Question productId={product.id} />}
      {product && <BidHistory productId={product.id} />}
      {
        //  product && <RelatedProducts categoryId={product.category_id} />
      }
    </div>
  );
}
