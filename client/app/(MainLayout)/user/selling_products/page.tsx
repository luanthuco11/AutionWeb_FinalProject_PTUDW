"use client";

import React from "react";
import { Product, ProductPreview } from "../../../../../shared/src/types";
import ProductCard from "@/components/ProductCard";
import FavoriteHook from "@/hooks/useFavorite";
import { useAuthStore } from "@/store/auth.store";
import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "@/components/LoadingSpinner";

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
      <div className="text-2xl font-medium">Sản phẩm đang bán</div>
      {(isLoading || isLoadingSellingProducts) && <LoadingSpinner />}
      {error && <div>{error.message}</div>}
      {!isLoading &&
        !isLoadingSellingProducts &&
        !error &&
        (sellingProducts.length === 0 ? (
          <>Chưa có sản phẩm</>
        ) : (
          <div className="mt-2 grid grid-cols-5 gap-3">
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
