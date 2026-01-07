"use client";
import { ArrowRight } from "@/components/icons";
import Link from "next/link";
import { ProductPreview } from "../../../../../shared/src/types";
import { CategoryProduct } from "../../../../../shared/src/types";
import ProductCard from "@/components/ProductCard";
import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "@/components/LoadingSpinner";
import FavoriteHook from "@/hooks/useFavorite";
import { useMemo } from "react";
import ShortCategorySideBar from "@/components/ShortCategorySidebar";

function Page() {
  const {
    data: categoryProductData,
    isLoading: isLoadingCategoryProduct,
    error: errorCategoryProduct,
  } = ProductHook.useGetCategoryProductList() as {
    data: CategoryProduct[];
    isLoading: boolean;
    error: unknown;
  };

  const {
    data: favoriteProductData,
    isLoading: isLoadingFavoriteProduct,
    error: errorFavoriteProduct,
  } = FavoriteHook.useAllFavorite();

  const favoriteIds = useMemo(
    () =>
      new Set(favoriteProductData?.map((f: ProductPreview) => f.id)) ||
      new Set([]),
    [favoriteProductData]
  );

  return (
    <>
      {(isLoadingCategoryProduct || isLoadingFavoriteProduct) && (

        <div className="inset-0 h-[80vh]">
          <LoadingSpinner />
        </div>
      )}
      {errorCategoryProduct && <>Error...</>}
      {errorFavoriteProduct && <>Error...</>}
      {categoryProductData && (
        <div>nb
          <div className="text-center w-full">
            <h1 className="text-4xl">Chào mừng đến AuctionHub</h1>
            <div className="mt-2 text-gray-500">
              Tìm kiếm và đấu giá hàng triệu sản phẩm từ những người bán uy tín
            </div>
          </div>
          {categoryProductData.map((item, index) => {
            if (item.products) {
              return (
                <div key={index}>
                  <div className="mt-15">
                    <ShortCategorySideBar />
                    <div className="flex justify-between font-medium">
                      <div className=" text-2xl">{item.category_name}</div>
                      <Link
                        href={`/category/${item.category_slug}`}
                        className="text-blue-500 flex items-center  gap-2"
                      >
                        <div className="text-[15px]">Xem tất cả</div>
                        <ArrowRight className="w-5 h-5 mt-0.5" />
                      </Link>
                    </div>
                  </div>
                  <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
                    {(item.products || []).map((item, index) => {
                      const isFavoriteProduct = (item: ProductPreview) =>
                        favoriteIds.has(Number(item.id));
                      return (
                        <div key={index} className="mt-3">
                          <ProductCard
                            key={index}
                            product={item}
                            isFavorite={isFavoriteProduct(item)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            } else {
              return;
            }
          })}
        </div>
      )}
    </>
  );
}
export default Page;
