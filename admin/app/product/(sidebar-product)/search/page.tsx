"use client";
import ProductCard from "../../../../components/ProductCard";
import CategoryHook from "@/hooks/useCategory";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductPreview } from "../../../../../shared/src/types";
import Pagination from "@/components/Pagination";
import { use } from "react";
import ProductHook from "@/hooks/useProduct";

function SearchPage() {
  const per_page = 5;
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || "1";
  const query = searchParams.get("query") || "";
  let totalPages = 1;
  let dataResult = null;
  const {
    data,
    isLoading: isLoadingProducts,
    error: errorProducts,
  } = ProductHook.useGetProductsBySearch(query, per_page, Number(page));

  const totalProducts = data?.totalProducts ?? 0;
  const products = data?.products ?? [];

  const handlePageChange = (value: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(value));
    router.replace(`?${next.toString()}`);
  };
  if (data) {
    totalPages = Math.ceil(Number(totalProducts) / per_page);
    dataResult = products as ProductPreview[];
  }
  return (
    <>
      {isLoadingProducts && <LoadingSpinner />}
      {errorProducts && <> Error...</>}
      {dataResult ? (
        <div>
          <div className="mt-10 flex items-center gap-2 text-gray-700">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>

            <span className="text-xl font-medium">Từ khóa tìm kiếm </span>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-semibold">
              "{query}"
            </span>
          </div>
          <div className=" grid grid-cols-y gap-y-2">
            {products.map((item: ProductPreview, index: number) => {
              return (
                <div key={index} className="mt-3">
                  <ProductCard key={index} product={item} />
                </div>
              );
            })}
          </div>
          <div className="mt-10 flex justify-center">
            <Pagination
              totalPages={totalPages}
              onPageChange={handlePageChange}
              currentPage={Number(page)}
            />
          </div>
        </div>
      ) : (
        <div>Không có sản phẩm thuộc loại này...</div>
      )}
    </>
  );
}
export default SearchPage;
