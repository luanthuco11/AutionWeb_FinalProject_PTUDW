"use client";

import React from "react";
import { Product, ProductPreview } from "../../../../../shared/src/types";
import ProductCard from "@/components/ProductCard";
import FavoriteHook from "@/hooks/useFavorite";
import { useAuthStore } from "@/store/auth.store";
import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyList from "@/components/EmptyList";
import Pagination from "@/components/Pagination";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const FavoriteProductPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const {
    data: favoriteProducts = [],
    isLoading,
    error,
  } = FavoriteHook.useAllFavorite() as {
    data: ProductPreview[];
    isLoading: boolean;
    error: any;
  };

  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const { data: sellingProducts, isLoading: isLoadingSellingProducts } =
    ProductHook.useGetSellingProduct() as {
      data: ProductPreview[];
      isLoading: boolean;
    };

  const favoriteSet = new Set(favoriteProducts.map((item) => item.id));
  const totalPages = Math.ceil((sellingProducts?.length ?? 0) / limit);

  const handlePageChange = (value: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", value.toString());
    router.replace(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="background-user">
      <div className="text-xl sm:text-2xl font-medium">Sản phẩm đang bán</div>
      {(isLoading || isLoadingSellingProducts) && (
        <div className="w-screen h-screen inset-0 z-100">
          <LoadingSpinner />
        </div>
      )}
      {error && <div>{error.message}</div>}
      {!isLoading &&
        !isLoadingSellingProducts &&
        !error &&
        (sellingProducts && sellingProducts.length === 0 ? (
          <EmptyList
            content=" Bạn hiện không bán sản phẩm nào. Hãy tìm kiếm những
                món đồ ưng ý và từ đó đưa ra lựa chọn để tạo sản phẩm nhé"
          />
        ) : (
          <div className="flex flex-col gap-10">
            <div className="mt-2 grid min-[390px]:grid-cols-2 min-[500px]:grid-cols-3 min-[700px]:grid-cols-4 min-[900px]:grid-cols-5 gap-3">
              {sellingProducts.map((item) => {
                return (
                  <div key={item.id} className="mt-3">
                    <ProductCard
                      key={item.id}
                      product={item}
                      isFavorite={favoriteSet.has(item.id)}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center">
              <Pagination
                totalPages={totalPages}
                onPageChange={handlePageChange}
                currentPage={page}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default FavoriteProductPage;
