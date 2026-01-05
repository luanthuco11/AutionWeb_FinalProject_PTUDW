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
import { useState, useEffect, useMemo, useRef } from "react";
import ProductHook from "@/hooks/useProduct";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Question, formatCurrency, formatDate } from "./components/Question";
import { BidHistory } from "./components/BidHistory";
import { RelatedProducts } from "./components/RelatedProducts";
import { useAuth } from "@/hooks/useAuth";

import { useForm, SubmitHandler } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  CreateBidLog,
  NewOrderRequest,
  Order,
  Product,
  ProductCategoryTree,
  UserBidInfo,
} from "../../../../../shared/src/types";
import BidHook from "@/hooks/useBid";
import FavoriteHook from "@/hooks/useFavorite";
import LoadingSpinner from "@/components/LoadingSpinner";
import CategoryHook from "@/hooks/useCategory";
import { formatPrice, getTimeDifference, parseNumber } from "@/utils";
import { X } from "lucide-react";
import OrderHook from "@/hooks/useOrder";
import Link from "next/link";
import { defaultImage } from "@/app/const";
import { ConfirmPopup } from "@/app/(MainLayout)/product/[product_slug]/components/ConfirmPopup";
import { SimpleConfirmPopup } from "@/components/SimpleConfirmPopup";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/auth.store";

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
    <div className="pb-6 border-b  mb-6 border-slate-200 ">
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
  const isPrivate = user ? true : false;
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [setFavorites, setSetFavorites] = useState<Set<number>>(new Set([]));
  const [isBid, setIsBid] = useState(false);
  const [openBuyNowModal, setOpenBuyNowModal] = useState<boolean>(false);
  const [warningAutoBuyNowModal, setWarningAutoBuyNowModal] =
    useState<boolean>(false);
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const [canBid, setCanBid] = useState<boolean>(false);
  const [navToOrderConfirm, setNavToOrderConfirm] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

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
    setValue,
    watch,
  } = useForm<{ price: string }, any, { price: number }>({
    resolver: zodResolver(schemaBid),
    defaultValues: {
      price: "",
    },
  });

  const { data: product, isLoading: isLoadingProduct } =
    ProductHook.useGetProductBySlug(product_slug as string, isPrivate) as {
      data: Product;
      isLoading: boolean;
    };
  const { data: favorite_products, isLoading: isLoadingFavoriteProducts } =
    FavoriteHook.useAllFavorite();
  const { data: category, isLoading: isLoadingProductCategory } =
    CategoryHook.useCategoryDetailById(product?.category_id, isPrivate) as {
      data: ProductCategoryTree;
      isLoading: boolean;
    };
  const { data: userBid, isLoading: isLoadingUserBid } = BidHook.useUserBid(
    product?.id,
    isPrivate
  ) as { data: UserBidInfo; isLoading: boolean };
  const { data: order, isLoading: isLoadingOrder } = OrderHook.useOrderById(
    product?.id,
    isPrivate
  ) as {
    data: Order;
    isLoading: boolean;
  };
  const { data: isCanBid, isLoading: isLoadingIsCanBid } = BidHook.useGetCanBid(
    product_slug as string,
    isPrivate
  ) as {
    data: boolean;
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

  const sellerRating = useMemo(() => {
    if (!product?.seller) return 0;

    const { positive_points, negative_points } = product.seller;
    const total = positive_points + negative_points;

    if (total === 0) return 0;

    return Math.round((positive_points / total) * 100);
  }, [product?.seller]);

  const bidderRating = useMemo(() => {
    if (!product?.top_bidder) return 0;

    const { positive_points, negative_points } = product.top_bidder;
    const total = positive_points + negative_points;

    if (total === 0) return 0;

    return Math.round((positive_points / total) * 100);
  }, [product?.top_bidder]);

  // Check co phai san pham yeu thich hay khong (them user ton tai de loai bo guest)
  useEffect(() => {
    if (user && favorite_products && product) {
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
  }, [favorite_products, product, user]);

  // Check can bid (guest no)
  useEffect(() => {
    if (!user || !product || !order || !searchParams || !isCanBid) return;

    //Check can bid
    if (user) {
      if (!isCanBid) {
        setCanBid(false);
      } else {
        const pos = user.positive_points ? user.positive_points : 0;
        const neg = user.negative_points ? user.negative_points : 0;

        const total = pos + neg;
        if (total === 0) {
          if (product.is_all_can_bid) {
            setCanBid(true);
          } else {
            setCanBid(false);
          }
        } else {
          if (pos / total >= 0.8) {
            setCanBid(true);
          } else {
            setCanBid(false);
          }
        }
      }
    }
    const nowTime: Date = new Date();
    const endTime = new Date(product.end_time);
    if (nowTime.getTime() >= endTime.getTime()) {
      setIsEnd(true);
    } else {
      setIsEnd(false);
    }
    const order_navigate = searchParams.get("order_navigate");

    if (order_navigate != "false" && user.id == order.buyer?.id) {
      setNavToOrderConfirm(true);
    }
  }, [user, order, product, searchParams, isCanBid]);

  // Check role
  useEffect(() => {
    if (!router || !user || !product) return;

    if (user.id == product.seller.id) {
      router.replace(`/product/sell/${product_slug}`);
    }
  }, [router, user, product, product_slug]);

  // Set value
  useEffect(() => {
    setValue("price", "");
  }, []);

  const handleOnclickBid = () => {
    setIsBid(true);
  };
  const handleOnclickCancleBid = () => {
    setIsBid(false);
  };
  if (favorite_products) console.log(favorite_products);

  const waitUserConfirm = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const userConfirm = (isConfirm: boolean): void => {
    if (resolveRef.current) {
      resolveRef.current(isConfirm);
      resolveRef.current = null;
    }
  };

  const handleBid: SubmitHandler<{ price: number }> = async (data) => {
    if (product.buy_now_price && data.price >= product.buy_now_price) {
      setWarningAutoBuyNowModal(true);
      const isConfirm = await waitUserConfirm();
      if (!isConfirm) return;
    }

    console.log("data.price: ", data.price);
    console.log(
      "product.current_price + product.price_increment!: ",
      Number(product.current_price!) + Number(product.price_increment!)
    );
    if (
      product.current_price &&
      data.price <
        Number(product.current_price) + Number(product.price_increment!)
    ) {
      toast.error("Giá đấu không thể thấp hơn giá tối thiểu");
      return;
    }

    if (userBid.max_price && data.price <= userBid.max_price) {
      toast.error("Giá đấu mới phải cao hơn giá đấu cũ");
      return;
    }

    const bid: CreateBidLog = {
      user_id: user?.id || 0,
      price: data.price,
      product_id: product.id,
      product_slug: product_slug as string | undefined,
    };

    createBid(bid);
    reset({
      price: "",
    });
    reset();
    setIsBid(false);
  };

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

  const handleBuyNow = () => {
    setOpenBuyNowModal(true);
  };

  return (
    <div className="xl:bg-[#F8FAFC] w-full">
      {isLoadingProduct ||
      isLoadingFavoriteProducts ||
      isLoadingProductCategory ||
      isLoadingOrder ||
      isLoadingUserBid ||
      isLoadingIsCanBid ||
      isCreatingBid ||
      isCreatingOrder ? (
        <div className="h-screen">
          <div className="fixed inset-0 z-100">
            <LoadingSpinner />
          </div>
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
              <div
                className={`
                 relative rounded-lg p-4 sm:p-8 w-full transition-all duration-300
                  ${
                    product.top_bidder?.id === user?.id
                      ? "bg-green-50/30 relative border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]"
                      : "bg-white border border-gray-200 shadow-sm"
                  }
                `}
              >
                {product.top_bidder?.id === user?.id && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className="
                            flex items-center gap-1.5
                            bg-green-600 text-white 
                            px-4 py-1.5 
                            rounded-full 
                            text-sm font-bold uppercase tracking-wide
                            shadow-lg shadow-green-600/30
                            whitespace-nowrap
                            border-2 border-white
                          "
                    >
                      🏆 Bạn đang dẫn đầu
                    </span>
                  </div>
                )}
                <div className="pb-4 md:pb-6 border-b mb-4 md:mb-6  border-slate-200">
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
                <div className="pb-4 md:pb-6 border-b mb-4 md:mb-6 border-slate-200 grid grid-cols-2">
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
                          {product.top_bidder.id === user?.id ? (
                            <span className="text-green-600 font-semibold flex items-center gap-1 animate-pulse drop-shadow-[0_0_5px_rgba(220,38,38,0.5)]">
                              ● Bạn đang là người ra giá cao nhất
                            </span>
                          ) : (
                            `${product.top_bidder.name[0]}***${
                              product.top_bidder.name[
                                product.top_bidder.name.length - 1
                              ]
                            }`
                          )}
                        </p>
                        <p className="text-xs text-slate-600">
                          {bidderRating !== 0
                            ? `⭐${" "}${bidderRating}%`
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

                <div className="pb-4 md:pb-6 border-b  mb-4 md:mb-6 border-slate-200">
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
                        {sellerRating !== 0
                          ? `⭐${" "}${sellerRating}%`
                          : `Chưa có đánh giá`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pb-4 md:pb-6 border-b  mb-4 md:mb-6 border-slate-200 ">
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
                {user ? (
                  <div className="pb-6 border-b mb-6 border-slate-200 gap-4 flex flex-col">
                    {product.status == "available" && !isEnd ? (
                      <>
                        <div className="relative">
                          <div className="relative group inline-block w-full">
                            <PrimaryButton
                              backgroundColor={canBid ? "#2563eb" : "#5d97fc"}
                              hoverBackgroundColor={
                                canBid ? "#3376eb" : "#dc2626"
                              }
                              text="Đặt lệnh đấu giá"
                              onClick={handleOnclickBid}
                              disabled={!canBid}
                            />

                            {/* Tooltip */}
                            {!canBid && (
                              <div
                                className="
                                    absolute
                                    bottom-full
                                    left-1/2
                                    -translate-x-1/2
                                    mb-2
                                    hidden
                                    group-hover:block
                                    whitespace-nowrap
                                    rounded
                                    bg-gray-900
                                    px-3
                                    py-1
                                    text-xs
                                    text-white
                                    shadow-lg
                                    z-50
                                  "
                              >
                                Bạn không đủ điều kiện để đấu giá
                              </div>
                            )}
                          </div>

                          {isBid && (
                            <>
                              <div
                                className="z-[1000] fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm transition-opacity"
                                onClick={() => setIsBid(false)}
                              ></div>

                              <div
                                className="
                                          z-[1001] 
                                          fixed 
                                          top-1/2 left-1/2 
                                          -translate-x-1/2 -translate-y-1/2 
                                          w-[90%] sm:w-[450px] 
                                          bg-white 
                                          border border-gray-200 
                                          rounded-xl 
                                          p-6 
                                          shadow-2xl
                                      "
                              >
                                <div className="w-full">
                                  <form
                                    className="w-full"
                                    onSubmit={handleSubmitBid(handleBid)}
                                  >
                                    <label
                                      htmlFor="price"
                                      className="block font-bold text-slate-800 text-lg sm:text-xl mb-1"
                                    >
                                      Đặt lệnh đấu giá
                                    </label>

                                    <input
                                      type="text"
                                      id="price"
                                      value={formatPrice(
                                        Number(watch("price") || undefined)
                                      )}
                                      onChange={(e) => {
                                        const parsed = parseNumber(
                                          e.target.value
                                        );
                                        setValue("price", String(parsed));
                                      }}
                                      autoComplete="off"
                                      className="
                                              w-full 
                                              border border-gray-300 
                                              mt-4 
                                              rounded-xl 
                                              text-blue-600 font-bold
                                              text-4xl!
                                              px-4 py-3 
                                              shadow-sm 
                                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                              placeholder:text-gray-300
                                                    "
                                      placeholder={
                                        product.current_price &&
                                        userBid.max_price &&
                                        userBid.max_price >
                                          product.current_price
                                          ? formatCurrency(
                                              Number(userBid.max_price) +
                                                Number(product.price_increment)
                                            )
                                          : formatCurrency(
                                              Number(product.current_price) +
                                                Number(product.price_increment)
                                            )
                                      }
                                    />

                                    <span className="text-red-500 text-sm mt-2 block min-h-[20px]">
                                      {formStateBid.errors.price
                                        ? formStateBid.errors.price.message
                                        : ""}
                                    </span>

                                    <div className="text-sm sm:text-base mt-2 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                      <p className="flex justify-between">
                                        <span className="text-slate-600">
                                          Giá hiện tại:
                                        </span>
                                        <span className="font-semibold text-2xl text-blue-600">
                                          {formatCurrency(
                                            product.current_price
                                          )}
                                        </span>
                                      </p>
                                      <p className="flex justify-between">
                                        <span className="text-slate-600">
                                          Bước nhảy:
                                        </span>
                                        <span className="font-semibold text-2xl text-blue-600">
                                          {formatCurrency(
                                            product.price_increment
                                          )}
                                        </span>
                                      </p>
                                      <p className="flex justify-between">
                                        <span className="text-slate-600">
                                          Giá đấu cũ của bạn:
                                        </span>
                                        <span className="font-semibold text-2xl text-orange-600">
                                          {userBid?.max_price
                                            ? formatCurrency(userBid.max_price)
                                            : "Chưa có"}
                                        </span>
                                      </p>
                                    </div>

                                    <div className="mt-3 text-sm text-slate-500 text-center">
                                      {product.current_price &&
                                      userBid.max_price &&
                                      userBid.max_price >
                                        product.current_price ? (
                                        <p>
                                          Cần đặt lớn hơn{" "}
                                          <span className="font-bold text-2xl text-orange-600">
                                            {formatCurrency(userBid.max_price)}
                                          </span>
                                        </p>
                                      ) : (
                                        <p>
                                          Tối thiểu:{" "}
                                          <span className="font-bold text-2xl text-orange-600">
                                            {formatCurrency(
                                              Number(product.current_price) +
                                                Number(product.price_increment)
                                            )}
                                          </span>
                                        </p>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mt-6">
                                      <button
                                        onClick={() => setIsPopup(true)}
                                        type="button"
                                        className="
                                            font-medium text-white bg-blue-600 
                                            rounded-full hover:bg-blue-700 
                                            transition-colors shadow-md 
                                            text-sm sm:text-base py-3 w-full
                                        "
                                      >
                                        Xác nhận
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleOnclickCancleBid();
                                        }}
                                        className="
                                            font-medium text-slate-700 bg-gray-100 
                                            border border-gray-300 rounded-full 
                                            hover:bg-gray-200 transition-colors 
                                            text-sm sm:text-base py-3 w-full
                                          "
                                      >
                                        Hủy
                                      </button>
                                    </div>
                                  </form>
                                </div>
                                <button
                                  onClick={(e) => setIsBid(false)}
                                  className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 transition-colors"
                                >
                                  <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                        {product.buy_now_price != null ? (
                          <div className="relative group w-full">
                            {/* Button */}
                            <button
                              disabled={!canBid}
                              onClick={handleBuyNow}
                              style={{
                                cursor: !canBid ? "not-allowed" : "pointer",
                              }}
                              className="
                                    w-full flex items-center gap-2 justify-center
                                    border border-red-600 text-red-600
                                    py-2 font-medium rounded-lg
                                    transition-colors duration-200
                                    hover:bg-red-400 hover:border-red-400 hover:text-white
                                    disabled:hover:bg-transparent
                                    disabled:hover:text-red-600
                                  "
                            >
                              {"Mua ngay " +
                                formatCurrency(product.buy_now_price || 0)}
                            </button>
                            {/* Tooltip */}
                            {!isCanBid && (
                              <div
                                className=" absolute bottom-full left-1/2
                                      -translate-x-1/2
                                      mb-2
                                      hidden
                                      group-hover:block
                                      whitespace-nowrap
                                      rounded
                                      bg-gray-900
                                      px-3
                                      py-1
                                      text-xs
                                      text-white
                                      shadow-lg
                                      z-50
                                    "
                              >
                                Bạn không đủ điều kiện để mua sản phẩm này
                              </div>
                            )}
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <div>
                        {order && order.buyer?.id == user?.id ? (
                          <div className="flex flex-row gap-2 justify-between items-center">
                            <p className="text-blue-500 text-2xl font-medium">
                              Bạn đã mua ngay sản phẩm này
                            </p>
                            <div className="">
                              <Link
                                href={`/product/order/${product.id}`}
                                className="w-full flex items-center gap-2 justify-center border border-blue-600 text-blue-600 py-2 px-5 font-medium rounded-lg hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors duration-200"
                              >
                                Đi tới đơn hàng
                              </Link>
                            </div>
                          </div>
                        ) : (
                          <p className="text-red-500 text-2xl font-medium">
                            Đã có người mua ngay
                          </p>
                        )}
                      </div>
                    )}
                    {openBuyNowModal && (
                      <>
                        <div
                          className="z-[1000] fixed inset-0 w-screen h-screen bg-black/50 backdrop-blur-sm transition-opacity"
                          onClick={() => setOpenBuyNowModal(false)}
                        ></div>

                        <div
                          className="
                                z-[1001] 
                                fixed 
                                top-1/2 left-1/2 
                                -translate-x-1/2 -translate-y-1/2 
                                w-[90%] sm:w-full sm:max-w-md
                                bg-white 
                                border border-gray-200 
                                rounded-xl 
                                p-6 
                                shadow-2xl
                              "
                        >
                          <p className="text-xl sm:text-2xl font-bold text-center text-slate-800">
                            Xác nhận mua ngay
                          </p>

                          <p className="text-sm sm:text-base mt-4 text-center text-slate-600">
                            Bạn xác nhận đồng ý mua ngay sản phẩm với giá:
                          </p>

                          <p className="text-red-600 text-3xl sm:text-4xl font-bold text-center my-4 break-words">
                            {formatCurrency(product.buy_now_price)}
                          </p>

                          <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800 text-center">
                            Sau khi xác nhận, bạn có <strong>24 giờ</strong> để
                            thanh toán và nhập thông tin nhận hàng.
                          </div>

                          {product.top_bidder?.id == userBid.user_id &&
                            userBid?.max_price && (
                              <div className="mt-3 bg-orange-50 border border-orange-100 p-3 rounded-lg text-sm text-orange-800">
                                <p className="font-semibold mb-1">⚠️ Lưu ý:</p>
                                Bạn vẫn đang dẫn đầu đấu giá với mức giá{" "}
                                <span className="font-bold">
                                  {formatCurrency(userBid.max_price)}
                                </span>
                              </div>
                            )}

                          <div className="grid grid-cols-2 gap-3 mt-6">
                            <button
                              onClick={handleOrder}
                              className="
                                  font-medium text-white bg-blue-600 
                                  rounded-full hover:bg-blue-700 
                                  transition-colors shadow-md 
                                  text-sm sm:text-base py-3 w-full
                                "
                            >
                              Mua ngay
                            </button>
                            <button
                              onClick={() => setOpenBuyNowModal(false)}
                              className="
                            font-medium text-slate-700 bg-gray-100 
                            border border-gray-300 rounded-full 
                            hover:bg-gray-200 transition-colors 
                            text-sm sm:text-base py-3 w-full
                          "
                            >
                              Hủy
                            </button>
                          </div>

                          <button
                            onClick={() => setOpenBuyNowModal(false)}
                            className="absolute top-3 right-3 p-1 rounded-full hover:bg-slate-100 transition-colors"
                          >
                            <X className="w-5 h-5 text-gray-400 hover:text-red-500" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <></>
                )}
                {user ? (
                  <div>
                    {isAddFavorite || isRemoveFavorite ? (
                      <LoadingSpinner />
                    ) : user ? (
                      <div
                        onClick={handleLike}
                        className="flex-1 flex items-center justify-center gap-2 py-2 border border-slate-300 rounded-lg hover:bg-slate-100  hover:cursor-pointer"
                      >
                        {isFavorite ? <LoveFullIcon /> : <LoveIcon />}
                        <span className="text-sm font-medium">Yêu thích</span>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl shadow-sm   mb-4 sm:mb-8 border border-slate-200 ">
            <div className="border-b border-slate-100 bg-slate-50/50 p-4">
              {" "}
              <h3 className="text-2xl font-bold text-slate-900 mb-1 sm:mb-4">
                Thông tin chi tiết sản phẩm
              </h3>
            </div>

            <div className="p-4 max-h-[500px] overflow-y-scroll">
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
              <div className="lg:flex-3 ">
                <BidHistory productId={product.id} />
              </div>
              <div className="lg:flex-7">
                <Question productId={product.id} />
              </div>
            </div>
          )}
          {product && (
            <div className="w-full">
              <RelatedProducts
                categoryId={product.category_id}
                favorite_products={user ? setFavorites : new Set([])}
              />
            </div>
          )}
          <SimpleConfirmPopup
            isOpen={isPopup}
            onClose={() => setIsPopup(false)}
            content={
              <div>
                <p className="text-gray-700">
                  Bạn có chắc chắn muốn đấu giá không
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Hành động này không thể hoàn tác.
                </p>
              </div>
            }
            onConfirm={() => {
              handleSubmitBid(handleBid)();
              setIsPopup(false);
            }}
          />
          <SimpleConfirmPopup
            title="Đi tới đơn hàng"
            isOpen={navToOrderConfirm}
            onClose={() => setNavToOrderConfirm(false)}
            content={`Bạn đã mua sản phẩm này. Bạn có muốn đi tới đơn hàng không?`}
            confirmLabel="Tới đơn hàng"
            cancelLabel="Ở lại"
            onConfirm={() =>
              router.replace(`/product/order/${order.product_id}`)
            }
          />
          <SimpleConfirmPopup
            title="Đi tới đơn hàng"
            isOpen={navToOrderConfirm}
            onClose={() => setNavToOrderConfirm(false)}
            content={`Bạn đã mua sản phẩm này. Bạn có muốn đi tới đơn hàng không?`}
            confirmLabel="Tới đơn hàng"
            cancelLabel="Ở lại"
            onConfirm={() =>
              router.replace(`/product/order/${order.product_id}`)
            }
          />
          <SimpleConfirmPopup
            title="Lưu ý"
            isOpen={warningAutoBuyNowModal}
            onClose={() => setWarningAutoBuyNowModal(false)}
            content={
              <div>
                <p>Giá đấu của bạn đang cao hơn giá mua ngay.</p>
                <p>
                  Hệ thống sẽ <b>tự động mua ngay</b> nếu bạn dẫn đầu với giá
                  cao hơn giá mua ngay. Bạn muốn chấp nhận rủi ro và xác nhận
                  đấu giá không?
                </p>
              </div>
            }
            confirmLabel="Đấu giá"
            cancelLabel="Hủy"
            onConfirm={() => {
              setWarningAutoBuyNowModal(false);
              userConfirm(true);
            }}
          />
        </>
      )}
    </div>
  );
}
