"use client";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import ProductCategoryTable from "@/components/ProductCategoryTable";
import { SearchBar } from "@/components/SearchBar";
import CategoryHook from "@/hooks/useCategory";
import ProductHook from "@/hooks/useProduct";
import React from "react";
import { CategoryProduct, ProductPreview } from "../../../shared/src/types";
import { useSearchParams } from "next/navigation";
import { Pagination as PaginationType } from "../../../shared/src/types/Pagination";
import Pagination from "@/components/Pagination";
import { useRouter } from "next/navigation";
export default function ManageProductPage() {
  const searchParams = useSearchParams();
  let totalPages = 1;
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 5;
  const router = useRouter();

  const pagination: PaginationType = {
    page: Number(page),
    limit: Number(limit),
  };
  const { data, isLoading: isLoadingProducts } =
    ProductHook.useGetProduct(pagination);

  const totalProducts = data?.totalProducts ?? 0;
  const products = data?.products ?? [];
  if (products) {
    totalPages = Math.ceil(Number(totalProducts) / Number(limit));
  }
  const handlePageChange = (page: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(page));
    next.set("limit", "5");
    router.push(`?${next.toString()}`);
  };
  return (
    <div className="pb-4">
      {isLoadingProducts && <LoadingSpinner />}
      {products && (
        <>
          <div className="grid grid-cols-1 gap-y-2">
            {products.map((p: ProductPreview, index: number) => (
              <ProductCard key={index} product={p} />
            ))}
          </div>
          <div className="w-full flex flex-row justify-center my-4">
            <Pagination
              totalPages={totalPages}
              onPageChange={handlePageChange}
              currentPage={Number(page)}
            />
          </div>
        </>
      )}
    </div>
  );
}
