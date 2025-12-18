"use client";
import ProductCard from "@/components/ProductCard";
import CategoryHook from "@/hooks/useCategory";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductPreview } from "../../../../../../shared/src/types";
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

      {dataResult ? (
        dataResult.length === 0 ? (
          <div>Không có sản phẩm thuộc loại này...</div>
        ) : (
          <div>
            <div className="text-2xl font-medium mt-10">{categoryName}</div>
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
        )
      ) : (
        <div>Không có sản phẩm thuộc loại này...</div>
      )}
    </>
  );
}
export default CategorySlugPage;
