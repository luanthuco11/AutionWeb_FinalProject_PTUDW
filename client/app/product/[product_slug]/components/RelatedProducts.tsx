import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "../../../../../shared/src/types";
import CategoryHook from "@/hooks/useCategory";
import { Pagination } from "../../../../../shared/src/types/Pagination";

interface CategoryId {
  categoryId: number;
}
export const RelatedProducts = ({ categoryId }: CategoryId) => {
  const pagination: Pagination = {
    id: categoryId,
    page: 1,
    limit: 5,
    sort: "time",
  };
  const { data: data, isLoading: isLoadingProducts } =
    CategoryHook.useProductsByCategory(pagination);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (data) {
      setProducts(data.products);
    }
  }, [data]);
 
  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4">
        Sản phẩm liên quan
      </h3>
      <div className=" grid gap-4 lg:gap-0 lg:grid-cols-5 ">
        {products.map((product, index) => (
          <div key={index}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};
