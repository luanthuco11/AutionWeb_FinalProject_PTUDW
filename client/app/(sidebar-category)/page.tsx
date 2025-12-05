"use client";
import { ArrowRight } from "@/components/icons";
import Link from "next/link";
import { ProductPreview } from "../../../shared/src/types";
import ProductCard from "@/components/ProductCard";
import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "@/components/LoadingSpinner";
import FavoriteHook from "@/hooks/useFavorite";
import { useMemo } from "react";

interface PageItem {
  title: string;
  href?: string;
  products: ProductPreview[];
}

function Page() {
  const {
    data: productTop,
    isLoading: isLoadingTopProduct,
    error: errorTopProduct,
  } = ProductHook.useGetProductTop();

  const {
    data: fullFavoriteProductData,
    isLoading: isLoadingFavoriteProduct,
    error: errorFavoriteProduct,
  } = FavoriteHook.useAllFavorite();

  const favoriteIds = useMemo(
    () =>
      new Set(fullFavoriteProductData?.map((f: ProductPreview) => f.id)) ||
      new Set([]),
    [fullFavoriteProductData]
  );

  if (isLoadingTopProduct && isLoadingFavoriteProduct)
    return (
      <>
        <LoadingSpinner />
      </>
    );
  if (errorTopProduct) {
    return <>{errorTopProduct.message};</>;
  }

  if (errorFavoriteProduct) {
    return <>{errorFavoriteProduct.message};</>;
  }
  let pageItems: PageItem[] = [];
  if (productTop) {
    pageItems = [
      {
        title: "Sản phẩm sắp kết thúc",
        href: "/top_end_product",
        products: productTop.topEndingSoonProducts,
      },
      {
        title: "Sản phẩm nhiều lượt đấu giá nhất",
        href: "/top_bid_product",
        products: productTop.topBiddingProducts,
      },
      {
        title: "Sản phẩm giá cao nhất",
        href: "/top_price_product",
        products: productTop.topPriceProducts,
      },
    ];
  }

  return (
    <>
      <div>
        <div className="text-center w-full">
          <h1 className="text-4xl">Chào mừng đến AuctionHub</h1>
          <div className="mt-2 text-gray-500">
            Tìm kiếm và đấu giá hàng triệu sản phẩm từ những người bán uy tín
          </div>
        </div>
        {pageItems.map((item, index) => {
          return (
            <div key={index}>
              <div className="mt-15">
                <div className="flex justify-between font-medium">
                  <div className=" text-2xl">{item.title}</div>
                  <Link
                    href={item.href || "/"}
                    className="text-blue-500 flex items-center  gap-2"
                  >
                    <div className="text-[15px]">Xem tất cả</div>
                    <ArrowRight className="w-5 h-5 mt-0.5" />
                  </Link>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-5 gap-3">
                {item.products.map((item, _) => {
                  return (
                    <div key={item.id} className="mt-3">
                      <ProductCard
                        key={item.id}
                        product={item}
                        isFavorite={favoriteIds.has(item.id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
export default Page;
