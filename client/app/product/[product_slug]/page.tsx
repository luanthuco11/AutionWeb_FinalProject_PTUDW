"use client";
import BreadCrump from "@/components/Breadcrump";

import {
  CalendarOutlineIcon,
  LoveFullIcon,
  LoveIcon,
  UserOutlineIcon,
} from "@/components/icons";
import { ImageCarousel } from "@/components/ImageCarousel";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import Image from "next/image";
import { useState, useEffect } from "react";
import ProductHook from "@/hooks/useProduct";
import { useParams } from "next/navigation";
import { Question, formatCurrency, formatDate } from "./components/Question";
import { BidHistory } from "./components/BidHistory";
import { RelatedProducts } from "./components/RelatedProducts";
import { useAuth } from "@/hooks/useAuth";

import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateBidLog,
  Product,
  ProductPreview,
} from "../../../../shared/src/types";
import BidHook from "@/hooks/useBid";
import FavoriteHook from "@/hooks/useFavorite";
import LoadingSpinner from "@/components/LoadingSpinner";

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
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>();
  const [setFavorites, setSetFavorites] = useState<Set<number>>();

  const { data: product, isLoading: isLoadingProduct } =
    ProductHook.useGetProductBySlug(product_slug as string);
  const { data: favorite_products, isLoading: isLoadingFavoriteProducts } =
    FavoriteHook.useAllFavorite();

  const { mutate: createBid, isPending: isCreatingBid } =
    BidHook.useCreateBid();

  const { mutate: addFavorite, isPending: isAddFavorite } =
    FavoriteHook.useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoveFavorite } =
    FavoriteHook.useRemoveFavorite();

  useEffect(() => {
    if (favorite_products && product) {
      const newSetFavorites: Set<number> = new Set(
        favorite_products.map((p: Product) => p.id)
      );

      setSetFavorites(newSetFavorites);
      if (newSetFavorites.has(product.id)) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
  }, [favorite_products, product]);

  const [isBid, setIsBid] = useState(false);

  const handleOnclickBid = () => {
    setIsBid(true);
  };
  const handleOnclickCancleBid = () => {
    setIsBid(false);
  };
  if (favorite_products) console.log(favorite_products);

  const handleBid: SubmitHandler<{ price: number }> = (data) => {
    const bid: CreateBidLog = {
      user_id: parseInt(user?.id as string),
      price: data.price,
      product_id: product.id,
    };
    createBid(bid);
    reset({
      price: "",
    });
    reset();
    setIsBid(false);
  };

  const handleLike = () => {
    if (product) {
      if (isFavorite) {
        setIsFavorite(false);
        removeFavorite({ productId: product.id });
      } else {
        setIsFavorite(true);
        addFavorite({ productId: product.id });
      }
    }
  };
  const handleBuyNow = () => {
    console.log("Đã nhấn mua ngay");
  };
  console.log(product);
  const schemaBid = z.object({
    price: z
      .string()
      .nonempty("Giá tiền không được để trống")
      .refine((val) => !isNaN(Number(val)), "Giá tiền phải là số")
      .transform((val) => Number(val)),
  });

  const {
    register: registerBid,
    handleSubmit: handleSubmitBid,
    formState: formStateBid,
    reset,
    watch,
  } = useForm<{ price: string }, any, { price: number }>({
    resolver: zodResolver(schemaBid),
    defaultValues: {
      price: "",
    },
  });
  watch("price");

  return (
    <div className="bg-[#F8FAFC] w-full">
      {isLoadingProduct || isLoadingFavoriteProducts ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className="mb-4">
            {product && (
              <BreadCrump
                category_name={product.category_name}
                category_slug={product.slug}
                product_name={product.name}
              />
            )}
          </div>
          {product && (
            <div className="flex flex-col md:flex-row gap-12 mb-12 ">
              <div className="p-8 md:p-0 md:w-1/2 ">
                <ImageCarousel
                  images={[product.main_image, ...(product.extra_images || [])]}
                />
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
                    {product.current_price &&
                      formatCurrency(product.current_price)}
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
                      <p className="text-xs text-slate-600">
                        ⭐{" "}
                        {Math.round(
                          (product.seller.positive_points /
                            (product.seller.positive_points +
                              product.seller.negative_points)) *
                            100
                        )}
                        {"%"}
                      </p>
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
                      parseFloat(product.current_price || 0) +
                        parseFloat(product.price_increment || 0)
                    )}
                  </p>
                </div>
                <div className="pb-6 border-b  mb-6 border-slate-200 gap-4 flex flex-col">
                  <div className="relative">
                    <PrimaryButton
                      text="Đặt lệnh đấu giá"
                      onClick={handleOnclickBid}
                    />

                    {isBid ? (
                      <div className="absolute z-10  inline-block w-64 text-sm text-body transition-opacity duration-300 bg-white border  rounded-2xl shadow-xs ">
                        <div className="relative px-3 py-2 bg-[#F9FAFB] border-b border-default rounded-t-base">
                          <h3 className="font-medium text-heading">
                            Đặt lệnh đấu giá
                          </h3>
                          <button
                            type="button"
                            onClick={handleOnclickCancleBid}
                            className=" absolute right-2 top-1 font-medium mx-auto block text-red-500 bg-white   hover:cursor-pointer  shadow-xs  leading-5 px-2 py-1 rounded-[3px] text-sm "
                          >
                            X
                          </button>
                        </div>
                        <form
                          className="max-w-sm mx-auto px-2"
                          onSubmit={handleSubmitBid(handleBid)}
                        >
                          <input
                            type="text"
                            id="price"
                            {...registerBid("price")}
                            className="border border-amber-50 my-4 rounded-2xl text-heading text-sm rounded-base  w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                            placeholder="150000"
                          />
                          <span className="text-red-600 text-sm mt-1 block mb-2">
                            {formStateBid.errors.price
                              ? formStateBid.errors.price.message
                              : ""}
                          </span>
                          <div>
                            <button
                              type="submit"
                              className="font-medium mx-auto block text-white bg-[#1447E6] box-border border border-blue-300 rounded-4xl hover:cursor-pointer  shadow-xs  leading-5  text-sm px-16 py-2.5 mb-2 "
                            >
                              Xác nhận
                            </button>
                          </div>
                        </form>
                        <div />
                      </div>
                    ) : (
                      <></>
                    )}
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
                    {isFavorite ? <LoveFullIcon /> : <LoveIcon />}
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

            <p
              dangerouslySetInnerHTML={{ __html: product.description || "" }}
            />
          </div>
          {product && <Question productId={product.id} />}
          {product && <BidHistory productId={product.id} />}
          {product && setFavorites && (
            <RelatedProducts
              categoryId={product.category_id}
              favorite_products={setFavorites}
            />
          )}
        </>
      )}
    </div>
  );
}
