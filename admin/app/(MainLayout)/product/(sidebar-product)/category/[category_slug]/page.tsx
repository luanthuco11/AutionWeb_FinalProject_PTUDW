"use client";
import ProductCard from "@/components/ProductCard";
import CategoryHook from "@/hooks/useCategory";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductPreview } from "../../../../../../../shared/src/types";
import Pagination from "@/components/Pagination";

import { use } from "react";

function CategorySlugPage({
  params,
}: {
  params: Promise<{ category_slug: string }>;
}) {
  const { category_slug } = use(params);
  const per_page = 5;
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || "1";
  const sort = searchParams.get("sort") || "";
  let totalPages = 1;
  let dataResult = null;
  const {
    data,
    isLoading: isLoadingProducts,
    error: errorProducts,
  } = CategoryHook.useProductsByCategorySlug(
    category_slug,
    Number(page),
    per_page,
    sort
  );

  const totalPriceProducts = data?.totalProducts ?? 0;
  const categoryName = data?.categoryName ?? "";
  const products = data?.products ?? [];

  const handlePageChange = (value: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(value));
    router.replace(`?${next.toString()}`);
  };
  console.log(data);
  if (data) {
    totalPages = Math.ceil(Number(totalPriceProducts) / per_page);
    dataResult = products as ProductPreview[];
  }
  return (
    <>
      {isLoadingProducts && <LoadingSpinner />}
      {errorProducts && <> Error...</>}

      {dataResult && (
        <>
          {dataResult.length != 0 ? (
            <div>
              <div className="text-2xl font-medium ">{categoryName}</div>
              <div className="grid grid-cols-y gap-y-2">
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
            <div className="flex flex-col mt-2 items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-center">
              <svg
                className="w-10 h-10 text-gray-300 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <span className="text-gray-500 font-medium">
                Không tìm thấy kết quả nào
              </span>
            </div>
          )}
        </>
      )}
    </>
  );
}
export default CategorySlugPage;
