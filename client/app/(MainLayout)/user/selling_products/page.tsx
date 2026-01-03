"use client";

import React from "react";
import { Product, ProductPreview } from "../../../../../shared/src/types";
import ProductCard from "@/components/ProductCard";
import FavoriteHook from "@/hooks/useFavorite";
import { useAuthStore } from "@/store/auth.store";
import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyList from "@/components/EmptyList";

const FavoriteProductPage = () => {
  const {
    data: favoriteProducts = [],
    isLoading,
    error,
  } = FavoriteHook.useAllFavorite() as {
    data: ProductPreview[];
    isLoading: boolean;
    error: any;
  };

  const { data: sellingProducts, isLoading: isLoadingSellingProducts } =
    ProductHook.useGetSellingProduct() as {
      data: ProductPreview[];
      isLoading: boolean;
    };

  const favoriteSet = new Set(favoriteProducts.map((item) => item.id));

  return (
    <div className="background-user">
      <div className="text-xl sm:text-2xl font-medium">Sản phẩm đang bán</div>
      {(isLoading || isLoadingSellingProducts) && <LoadingSpinner />}
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
        ))}
    </div>
  );
};

export default FavoriteProductPage;
