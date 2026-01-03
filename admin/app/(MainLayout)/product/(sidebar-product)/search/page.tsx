"use client";
import ProductCard from "../../../../../components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductPreview } from "../../../../../../shared/src/types";
import Pagination from "@/components/Pagination";
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

  const handleClearSearch = () => {
    router.replace("/product");
  };

  if (data) {
    totalPages = Math.ceil(Number(totalProducts) / per_page);
    dataResult = products as ProductPreview[];
  }

  return (
    <>
      {isLoadingProducts && <LoadingSpinner />}
      {errorProducts && <> Error...</>}
      {dataResult && (
        <div>
          <div className="flex items-center justify-between">
            <div className=" flex items-center gap-2 text-gray-700">
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
              {query && (
                <button
                  onClick={handleClearSearch}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors border px-3 py-1 rounded-lg hover:border-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Xóa tìm kiếm
                </button>
              )}
            </div>
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
          {products.length != 0 ? (
            <div className="mt-10 flex justify-center">
              <Pagination
                totalPages={totalPages}
                onPageChange={handlePageChange}
                currentPage={Number(page)}
              />
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
        </div>
      )}
    </>
  );
}
export default SearchPage;
