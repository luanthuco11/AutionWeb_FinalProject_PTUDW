import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product, ProductPreview } from "../../../../../../../shared/src/types";
import CategoryHook from "@/hooks/useCategory";
import { Pagination } from "../../../../../../../shared/src/types/Pagination";

interface RelatedProductsProps {
  categoryId: number;
  favorite_products: Set<number>;
}
export const RelatedProducts = ({
  categoryId,
  favorite_products,
}: RelatedProductsProps) => {
  const pagination: Pagination = {
    id: categoryId,
    page: 1,
    limit: 5,
    sort: "time",
  };
  const {
    data: products,
    isLoading: isLoadingProducts,
  }: {
    data: ProductPreview[] | undefined;
    isLoading: boolean;
  } = CategoryHook.useProductsByCategoryId(pagination);
  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4">
        Sản phẩm liên quan
      </h3>
      <div className="block lg:hidden">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 ">
          {products &&
            (products || []).map((product, index) => (
              <div
                key={`mobile-${index}`}
                className="w-[70%] mx-auto max-w-[300px] sm:w-full sm:max-w-none"
              >
                <ProductCard
                  product={product as ProductPreview}
                  isFavorite={favorite_products.has(Number(product.id))}
                />
              </div>
            ))}
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-5  gap-4 xl:gap-6">
        {products &&
          (products || []).map((product, index) => (
            <div key={`desktop-${index}`} className="w-full">
              <ProductCard
                product={product as ProductPreview}
                isFavorite={favorite_products.has(Number(product.id))}
              />
            </div>
          ))}
      </div>
    </div>
  );
};
