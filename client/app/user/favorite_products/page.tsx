"use client";

import React from "react";
import { Product, ProductPreview } from "../../../../shared/src/types";
import ProductCard from "@/components/ProductCard";
import FavoriteHook from "@/hooks/useFavorite";

const FavoriteProductPage = () => {
  const {
    data: favoriteProducts = [],
    isLoading,
    error,
  } = FavoriteHook.useFavorite() as {
    data: ProductPreview[];
    isLoading: boolean;
    error: any;
  };

  const favoriteSet = new Set(favoriteProducts.map((item) => item.id));

  return (
    <div className="background-user">
      <div className="text-2xl font-medium">Sản phẩm yêu thích</div>
      {isLoading && <div>Loading</div>}
      {error && <div>{error.message}</div>}
      {!isLoading && !error && (
        <div className="mt-2 grid grid-cols-5 gap-3">
          {favoriteProducts.map((item) => {
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
      )}
    </div>
  );
};

export default FavoriteProductPage;
