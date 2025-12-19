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
import { useParams, useRouter } from "next/navigation";
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
} from "../../../../../../shared/src/types";
import BidHook from "@/hooks/useBid";
import FavoriteHook from "@/hooks/useFavorite";
import LoadingSpinner from "@/components/LoadingSpinner";
import CategoryHook from "@/hooks/useCategory";
import { formatPrice, parseNumber } from "@/utils";
import { Pencil, X } from "lucide-react";
import OrderHook from "@/hooks/useOrder";
import Link from "next/link";
import { defaultImage } from "@/app/const";

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
  const router = useRouter();
  const { product_slug } = useParams();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState<boolean>();
  const [setFavorites, setSetFavorites] = useState<Set<number>>();
  const [isBid, setIsBid] = useState(false);
  const [openBuyNowModal, setOpenBuyNowModal] = useState<boolean>(false);

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
    if (!router || !user || !product) return;

    if (user.id !== product.seller.id) {
      router.replace(`/product/${product_slug}`);
    }
  }, [router, user, product]);

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
      isLoadingUserBid ? (
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
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-8 w-full">
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
                      product.top_bidder.id === user?.id ? (
                        `${product.top_bidder.name} (Bạn)`
                      ) : (
                        `${product.top_bidder.name}`
                      )
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

                {product.status == "available" ? (
                  <></>
                ) : (
                  <div className="mb-8">
                    {order && (
                      <div className="flex flex-row gap-2 justify-between items-center">
                        <p className="text-blue-500 text-2xl font-medium">
                          {order.buyer.name} đã mua ngay
                        </p>
                        <div className="">
                          <Link
                            href={`/product/sell/order/${product.id}`}
                            className="w-full flex items-center gap-2 justify-center border border-blue-600 text-blue-600 py-2 px-5 font-medium rounded-lg hover:bg-blue-600 hover:border-blue-600 hover:text-white transition-colors duration-200"
                          >
                            Đi tới đơn hàng
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
        </>
      )}
    </div>
  );
}
