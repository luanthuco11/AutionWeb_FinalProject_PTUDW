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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Question, formatCurrency, formatDate } from "./components/Question";
import { BidHistory } from "./components/BidHistory";
import { RelatedProducts } from "./components/RelatedProducts";
import { useAuth } from "@/hooks/useAuth";
import {
  NewOrderRequest,
  Order,
  Product,
  ProductCategoryTree,
  UserBidInfo,
} from "../../../../../../shared/src/types";
import BidHook from "@/hooks/useBid";
import FavoriteHook from "@/hooks/useFavorite";
import LoadingSpinner from "@/components/LoadingSpinner";
import CategoryHook from "@/hooks/useCategory";
import { formatPrice, getTimeDifference, parseNumber } from "@/utils";
import { Pencil, X } from "lucide-react";
import OrderHook from "@/hooks/useOrder";
import Link from "next/link";
import { defaultImage } from "@/app/const";
import { SimpleConfirmPopup } from "@/components/SimpleConfirmPopup";
import { useMemo } from "react";

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

  if (hours > 0) return `${hours} giờ ${minutes} phút`;
  else return `${minutes} phút ${seconds} giây`;
}
interface Time {
  endTime?: Date | null;
}

function EndTime({ endTime }: Time) {
  const now = new Date();
  const localString = formatDate(endTime || "");

  return (
    <div className="mb-4 md:mb-6 border-b  pb-4 md:pb-6 border-slate-200 ">
      <p className="text-sm text-slate-600 mb-2 font-light">
        {endTime && isLessThreeDays(now, endTime)
          ? "Thời gian còn lại"
          : "Thời gian kết thúc"}
      </p>
      {endTime && endTime.getTime() <= now.getTime() ? (
        <p className="text-xl font-bold text-slate-600">Đã kết thúc</p>
      ) : (
        <p className="text-xl font-bold text-red-500">
          {endTime && isLessThreeDays(now, endTime) ? (
            <>{getTimeDifference(new Date(), endTime)}</>
          ) : (
            <>{localString}</>
          )}
        </p>
      )}
    </div>
  );
}

export default function ProductPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { product_slug } = useParams();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>();
  const [setFavorites, setSetFavorites] = useState<Set<number>>();
  const [navToOrderConfirm, setNavToOrderConfirm] = useState<boolean>(false);

  const { data: product, isLoading: isLoadingProduct } =
    ProductHook.useGetProductBySlug(product_slug as string) as {
      data: Product;
      isLoading: boolean;
    };
  const { data: favorite_products, isLoading: isLoadingFavoriteProducts } =
    FavoriteHook.useAllFavorite();
  const { data: category, isLoading: isLoadingProductCategory } =
    CategoryHook.useCategoryDetailById(product?.category_id) as {
      data: ProductCategoryTree;
      isLoading: boolean;
    };
  const { data: userBid, isLoading: isLoadingUserBid } = BidHook.useUserBid(
    product?.id
  ) as { data: UserBidInfo; isLoading: boolean };
  const { data: order, isLoading: isLoadingOrder } = OrderHook.useOrderById(
    product?.id
  ) as {
    data: Order;
    isLoading: boolean;
  };

  const { mutate: createBid, isPending: isCreatingBid } =
    BidHook.useCreateBid();
  const { mutate: createOrder, isPending: isCreatingOrder } =
    OrderHook.useCreateOrder();

  const { mutate: addFavorite, isPending: isAddFavorite } =
    FavoriteHook.useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoveFavorite } =
    FavoriteHook.useRemoveFavorite();

  const bidderRating = useMemo(() => {
    if (!product?.top_bidder) return 0;

    const { positive_points, negative_points } = product.top_bidder;
    const total = positive_points + negative_points;

    if (total === 0) return 0;

    return Math.round((positive_points / total) * 100);
  }, [product?.top_bidder]);

  const totalRating = useMemo<number>(() => {
    if (product?.seller)
      return product.seller.positive_points + product.seller.negative_points;
    return 0;
  }, [product]);

  useEffect(() => {
    if (favorite_products && product) {
      const newSetFavorites: Set<number> = new Set(
        favorite_products.map((p: Product) => Number(p.id))
      );

      setSetFavorites(newSetFavorites);
      if (newSetFavorites.has(Number(product.id))) {
        setIsFavorite(true);
      } else {
        setIsFavorite(false);
      }
    }
  }, [favorite_products, product]);

  useEffect(() => {
    if (!router || !user || !product || !order) return;
    const order_navigate = searchParams.get("order_navigate");

    if (user.id !== product.seller.id) {
      router.replace(`/product/${product_slug}`);
    }

    if (order_navigate != "false" && user.id == order.seller?.id) {
      setNavToOrderConfirm(true);
    }
  }, [router, user, order, product]);

  if (favorite_products) console.log(favorite_products);

  const handleOrder = () => {
    const newOrder: NewOrderRequest = {
      product_id: product.id,
      shipping_address: "",
      price: product?.buy_now_price || 0,
    };
    createOrder(
      { payload: newOrder },
      {
        onSuccess: () => {
          router.replace(`/product/order/${product.id}`);
        },
      }
    );
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

  if (
    isLoadingFavoriteProducts ||
    isLoadingOrder ||
    isLoadingProduct ||
    isLoadingProductCategory ||
    isLoadingUserBid
  )
    return (
      <div className="w-screen h-screen inset-0 z-100">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="xl:bg-[#F8FAFC] w-full">
      {isLoadingProduct ||
      isLoadingFavoriteProducts ||
      isLoadingProductCategory ||
      isLoadingOrder ||
      isLoadingUserBid ? (
        <div className="w-screen h-screen inset-0 z-100">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="mb-4">
            {product && (
              <BreadCrump
                category_name={product.category_name || "(không có tên loại)"}
                category_slug={category.slug}
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
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-8 w-full">
                <div className="mb-4 md:mb-6 border-b pb-4 md:pb-6  border-slate-200">
                  <h1 className="text-2xl font-bold mb-4 text-slate-900">
                    {product.name}
                  </h1>
                  <div className="grid grid-cols-2 items-start">
                    <div>
                      <p className="text-sm font-light mb-2 text-slate-600">
                        Giá hiện tại
                      </p>{" "}
                      <p className="text-2xl md:text-4xl font-bold text-blue-600 mb-2">
                        {product.current_price &&
                          formatCurrency(product.current_price)}
                      </p>
                      <p className="text-sm text-slate-600 font-light">
                        {" "}
                        {product.bid_count} Lượt đấu giá
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-light mb-2 text-slate-600">
                        Giá mua ngay
                      </p>{" "}
                      <p className="text-2xl md:text-4xl font-bold text-red-500 mb-2">
                        {product.buy_now_price != null ? (
                          product.current_price &&
                          formatCurrency(product.buy_now_price)
                        ) : (
                          <>Chưa có</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-4 md:mb-6 border-b pb-4 md:pb-6 border-slate-200 grid grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                      <CalendarOutlineIcon />
                      Thời điểm đăng
                    </p>
                    <p className="text-sm lg:ml-4 md:text-[16px] font-semibold text-slate-900">
                      {formatDate(product.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                      <UserOutlineIcon />
                      Người ra giá cao nhất
                    </p>
                    {product.top_bidder ? (
                      <>
                        <p className="font-semibold text-slate-900 mb-1">
                          {product.top_bidder.name}
                        </p>
                        <p className="text-xs text-slate-600">
                          {bidderRating !== 0
                            ? `⭐${bidderRating}%`
                            : `Chưa có đánh giá`}
                        </p>
                      </>
                    ) : (
                      <p className=" ml-4 text-[16px] font-semibold text-slate-900">
                        Chưa có
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-4 md:mb-6 border-b pb-4 md:pb-6 border-slate-200">
                  <div>
                    <p className="text-sm font-medium  text-slate-600 mb-3">
                      Người bán
                    </p>
                  </div>
                  <div className="flex flex-row gap-4">
                    <div className="rounded-[6px] overflow-hidden">
                      <Image
                        src={product.seller.profile_img || defaultImage}
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
                        {totalRating === 0
                          ? "Chưa có đánh giá"
                          : `⭐${" "}${Math.round(
                              (product.seller.positive_points /
                                (product.seller.positive_points +
                                  product.seller.negative_points)) *
                                100
                            )}%`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4 md:mb-6 border-b pb-4 md:pb-6 border-slate-200 ">
                  <p className="text-sm text-slate-600 mb-2 font-light">
                    Giá đấu tiếp theo
                  </p>
                  <p className="text-2xl md:text-3xl font-bold text-blue-600">
                    {formatCurrency(
                      Number(product.current_price || 0) +
                        Number(product.price_increment || 0)
                    )}
                  </p>
                </div>

                <EndTime endTime={new Date(product.end_time || "")} />

                {product.status == "available" ? (
                  <></>
                ) : (
                  <div className="mb-8">
                    {order && (
                      <div className="flex flex-row gap-2 justify-between items-center">
                        <p className="text-blue-500 text-2xl font-medium">
                          {order.buyer?.name} đã mua ngay
                        </p>
                        <div className="">
                          <Link
                            href={`/product/sell/order/${product.id}`}
                            className="
                              w-full flex items-center justify-center gap-2 
                              py-2.5 px-4 rounded-lg                              
                              font-medium text-sm sm:text-base text-blue-600                              
                              border border-blue-600 bg-transparent                             
                              sm:w-auto sm:px-6 sm:py-2                           
                              transition-all duration-200
                              hover:bg-blue-600 hover:text-white hover:shadow-md
                              active:scale-95
                            "
                          >
                            <span>Đi tới đơn hàng</span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="pb-3 border-slate-200 gap-4 flex flex-col">
                  <PrimaryButton
                    backgroundColor="#2563eb"
                    hoverBackgroundColor="#3376eb"
                    icon={() => <Pencil width={20} height={20} />}
                    text="Chỉnh sửa sản phẩm"
                    onClick={() =>
                      router.replace(
                        `/user/selling_products/${product_slug}/edit`
                      )
                    }
                  />
                </div>
                <div>
                  {isAddFavorite || isRemoveFavorite ? (
                    <LoadingSpinner />
                  ) : (
                    <div
                      onClick={handleLike}
                      className="flex-1 flex items-center justify-center gap-2 py-2 border border-slate-300 rounded-lg hover:bg-slate-100  hover:cursor-pointer"
                    >
                      {isFavorite ? <LoveFullIcon /> : <LoveIcon />}
                      <span className="text-sm font-medium">Yêu thích</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-sm   mb-4 sm:mb-8 border border-slate-200">
            <div className="border-b border-slate-100 bg-slate-50/50 p-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Thông tin chi tiết sản phẩm
              </h3>
            </div>

            <div className="p-4">
              {product && (
                <p
                  dangerouslySetInnerHTML={{
                    __html: product.description || "",
                  }}
                />
              )}
            </div>
          </div>
          {product && (
            <div className="grid grid-cols-1 lg:flex lg:flex-row lg:gap-x-1 xl:gap-x-2 mb-4">
              <div className="lg:flex-4 ">
                <BidHistory productId={product.id} />
              </div>
              <div className="lg:flex-7">
                <Question productId={product.id} />
              </div>
            </div>
          )}
          {product && setFavorites && (
            <RelatedProducts
              categoryId={product.category_id}
              favorite_products={setFavorites}
            />
          )}

          <SimpleConfirmPopup
            title="Đi tới đơn hàng"
            isOpen={!!(navToOrderConfirm && order?.buyer?.id)}
            onClose={() => setNavToOrderConfirm(false)}
            content={`${order.buyer?.name} đã mua ngay. Bạn có muốn đi tới đơn hàng không?`}
            confirmLabel="Tới đơn hàng"
            cancelLabel="Ở lại"
            onConfirm={() => {
              setNavToOrderConfirm(false);
              router.replace(`/product/sell/order/${order.product_id}`);
            }}
          />
        </>
      )}
    </div>
  );
}
