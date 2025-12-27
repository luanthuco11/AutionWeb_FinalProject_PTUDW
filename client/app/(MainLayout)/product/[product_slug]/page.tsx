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
import { useState, useEffect, useMemo } from "react";
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
import { formatPrice, parseNumber } from "@/utils";
import { X } from "lucide-react";
import OrderHook from "@/hooks/useOrder";
import Link from "next/link";
import { defaultImage } from "@/app/const";
import { ConfirmPopup } from "@/app/(MainLayout)/product/[product_slug]/components/ConfirmPopup";
import { SimpleConfirmPopup } from "@/components/SimpleConfirmPopup";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const { product_slug } = useParams();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>();
  const [setFavorites, setSetFavorites] = useState<Set<number>>();
  const [isBid, setIsBid] = useState(false);
  const [openBuyNowModal, setOpenBuyNowModal] = useState<boolean>(false);
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const [canBid, setIsCanBid] = useState<boolean>(false);
  const [navToOrderConfirm, setNavToOrderConfirm] = useState<boolean>(false);

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

  useEffect(() => {
    if (!router || !user || !product || !order || !searchParams) return;
    //Check can bid
    if (user) {
      const pos = user.positive_points ? user.positive_points : 0;
      const neg = user.negative_points ? user.negative_points : 0;

      const total = pos + neg;
      if (total === 0) {
        //Todo Ha
      } else {
        if (pos / total >= 0.8) {
          setIsCanBid(true);
        } else {
          setIsCanBid(false);
        }
      }
    }
    const order_navigate = searchParams.get("order_navigate");

    if (user.id == product.seller.id) {
      router.replace(`/product/sell/${product_slug}`);
    }

    if (order_navigate != "false" && user.id == order.buyer?.id) {
      setNavToOrderConfirm(true);
    }
  }, [router, user, order, product, searchParams]);

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

  const handleBid: SubmitHandler<{ price: number }> = (data) => {
    if (product.buy_now_price && data.price >= product.buy_now_price) {
      setOpenBuyNowModal(true);
      setIsBid(false);
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
    <div className="bg-[#F8FAFC] w-full">
      {isLoadingProduct ||
      isLoadingFavoriteProducts ||
      isLoadingProductCategory ||
      isLoadingOrder ||
      isLoadingUserBid ||
      isCreatingOrder ? (
        <LoadingSpinner />
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
              <div className="bg-white border  border-gray-200 rounded-lg p-4 sm:p-8 w-full">
                <div className="pb-6 border-b mb-6  border-slate-200">
                  <h1 className="text-2xl font-bold mb-4 text-slate-900">
                    {product.name}
                  </h1>
                  <div className="grid grid-cols-2 items-start">
                    <div>
                      <p className="text-sm font-light mb-2 text-slate-600">
                        Giá hiện tại
                      </p>{" "}
                      <p className="text-4xl font-bold text-blue-600 mb-2">
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
                      <p className="text-4xl font-bold text-red-500 mb-2">
                        {product.current_price &&
                          formatCurrency(product.buy_now_price)}
                      </p>
                    </div>
                  </div>
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
                      <>
                        <p className="font-semibold text-slate-900 mb-1">
                          {product.top_bidder.id === user?.id
                            ? `${product.top_bidder.name} (Bạn)`
                            : `${product.top_bidder.name[0]}***${
                                product.top_bidder.name[
                                  product.top_bidder.name.length - 1
                                ]
                              }`}
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

                <div className="pb-6 border-b  mb-6 border-slate-200">
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

                <div className="pb-6 border-b  mb-6 border-slate-200 ">
                  <p className="text-sm text-slate-600 mb-2 font-light">
                    Giá đấu tiếp theo
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {formatCurrency(
                      Number(product.current_price || 0) +
                        Number(product.price_increment || 0)
                    )}
                  </p>
                </div>

                <EndTime endTime={new Date(product.end_time || "")} />

                <div className="pb-6 border-b mb-6 border-slate-200 gap-4 flex flex-col">
                  {product.status == "available" ? (
                    <>
                      <div className="relative">
                        <div>
                          <PrimaryButton
                            backgroundColor={canBid ? "#2563eb" : "#5d97fc"}
                            hoverBackgroundColor={
                              canBid ? "#3376eb" : "#dc2626"
                            }
                            text="Đặt lệnh đấu giá"
                            onClick={handleOnclickBid}
                            disabled={!canBid}
                          />
                        </div>

                        {isBid && (
                          <>
                            <div className="z-1000 fixed inset-0 w-screen h-screen bg-black opacity-50 flex justify-center items-center"></div>
                            <div className="z-1001 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg px-4 py-4 shadow-lg">
                              <div className="bg-white w-full">
                                <form
                                  className="px-2 w-full"
                                  onSubmit={handleSubmitBid(handleBid)}
                                >
                                  <label
                                    htmlFor="price"
                                    className="block font-medium text-heading text-xl"
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
                                    className="border border-gray-300 mt-4 rounded-2xl text-heading text-3xl! text-blue-500 rounded-base  w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                                    placeholder={
                                      product.current_price &&
                                      userBid.max_price &&
                                      userBid.max_price > product.current_price
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
                                  <span className="text-red-600 text-sm mt-1 block mb-2">
                                    {formStateBid.errors.price
                                      ? formStateBid.errors.price.message
                                      : ""}
                                  </span>

                                  <div className="text-md mt-4">
                                    <p>
                                      <span className="">Giá hiện tại: </span>
                                      <span className="ml-1 text-blue-600 font-medium text-lg">
                                        {formatCurrency(product.current_price)}
                                      </span>
                                    </p>
                                    <p>
                                      <span className="">Bước nhảy: </span>
                                      <span className="ml-2 text-blue-600 font-medium text-lg">
                                        {formatCurrency(
                                          product.price_increment
                                        )}
                                      </span>
                                    </p>
                                    {userBid?.max_price ? (
                                      <p className="">
                                        <span className="">Giá đấu cũ: </span>
                                        <span className="ml-2 text-orange-600 font-medium text-lg">
                                          {formatCurrency(userBid.max_price)}
                                        </span>
                                      </p>
                                    ) : (
                                      <p className="text-slate-600">
                                        Bạn chưa từng đấu giá sản phẩm này
                                      </p>
                                    )}
                                  </div>

                                  <div className="mt-2">
                                    {product.current_price &&
                                    userBid.max_price &&
                                    userBid.max_price >
                                      product.current_price ? (
                                      <p>
                                        Bạn cần đặt giá lớn hơn{" "}
                                        <span className="text-orange-600">
                                          {formatCurrency(userBid.max_price)}
                                        </span>
                                      </p>
                                    ) : (
                                      <p>
                                        Bạn cần đặt giá tối thiểu là{" "}
                                        <span className="font-medium text-orange-600">
                                          {formatCurrency(
                                            Number(product.current_price) +
                                              Number(product.price_increment)
                                          )}
                                        </span>
                                      </p>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 mt-5 ">
                                    <button
                                      onClick={() => setIsPopup(true)}
                                      type="button"
                                      className="font-medium mx-auto block text-white bg-[#1447E6] box-border border border-blue-300 rounded-4xl hover:bg-[#2957e3] hover:cursor-pointer  shadow-xs  leading-5  text-sm w-full py-2.5"
                                    >
                                      Xác nhận
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleOnclickCancleBid();
                                      }}
                                      className="font-medium mx-auto block text-white bg-gray-500 box-border border border-gray-200 rounded-4xl hover:bg-gray-400 hover:cursor-pointer  shadow-xs  leading-5  text-sm w-full py-2.5"
                                    >
                                      Hủy
                                    </button>
                                  </div>
                                </form>
                              </div>
                              <button
                                onClick={(e) => setIsBid(false)}
                                className="absolute top-2.5 right-3 "
                              >
                                <X className="text-gray-500 hover:text-red-600 cursor-pointer" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      <div>
                        <button
                          onClick={handleBuyNow}
                          className="w-full flex items-center gap-2 justify-center border border-red-600 text-red-600 py-2 font-medium rounded-lg hover:bg-red-400 hover:border-red-400 hover:text-white transition-colors duration-200"
                        >
                          {"Mua ngay " +
                            formatCurrency(product.buy_now_price || 0)}
                        </button>
                      </div>
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
                      <div className="z-1000 fixed inset-0 w-screen h-screen bg-black opacity-50 flex justify-center items-center"></div>
                      <div className="z-1001 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg px-4 py-4 shadow-lg max-w-md">
                        <p className="text-2xl font-bold text-center">
                          Xác nhận mua ngay
                        </p>
                        <p className="text-lg mt-5 text-center">
                          Bạn xác nhận đồng ý mua ngay sản phẩm với giá
                        </p>
                        <p className="text-red-500 text-4xl font-medium text-center">
                          {formatCurrency(product.buy_now_price)}
                        </p>
                        <p className="mt-3">
                          Sau khi mua ngay, bạn có 24 giờ để thanh toán và nhập
                          thông tin nhận hàng.
                        </p>
                        {product.top_bidder?.id == userBid.user_id &&
                          userBid?.max_price && (
                            <p className="mt-3 font-medium text-slate-600">
                              Nhắc nhở: Bạn vẫn đang dẫn đầu đấu giá với{" "}
                              <span className="text-blue-600">
                                {formatCurrency(userBid.max_price)}
                              </span>
                            </p>
                          )}
                        <div className="grid grid-cols-2 gap-2 mt-5">
                          <button
                            onClick={handleOrder}
                            className="font-medium mx-auto block text-white bg-[#1447E6] box-border border border-blue-300 rounded-4xl hover:bg-[#2957e3] hover:cursor-pointer  shadow-xs  leading-5  text-sm w-full py-2.5"
                          >
                            Mua ngay
                          </button>
                          <button
                            onClick={() => setOpenBuyNowModal(false)}
                            className="font-medium mx-auto block text-white bg-gray-500 box-border border border-gray-200 rounded-4xl hover:bg-gray-400 hover:cursor-pointer  shadow-xs  leading-5  text-sm w-full py-2.5"
                          >
                            Hủy
                          </button>
                        </div>
                        <button
                          onClick={(e) => setOpenBuyNowModal(false)}
                          className="absolute top-2.5 right-3 "
                        >
                          <X className="text-gray-500 hover:text-red-600 cursor-pointer" />
                        </button>
                      </div>
                    </>
                  )}
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

            {product && (
              <p
                dangerouslySetInnerHTML={{ __html: product.description || "" }}
              />
            )}
          </div>
          {product && (
            <div className="grid grid-cols-10 gap-5">
              <div className="col-span-3">
                <BidHistory productId={product.id} />
              </div>
              <div className="col-span-7">
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
          <ConfirmPopup
            isOpen={isPopup}
            onClose={() => setIsPopup(false)}
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
        </>
      )}
    </div>
  );
}
