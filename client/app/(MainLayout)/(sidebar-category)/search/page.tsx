"use client";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductPreview } from "../../../../../shared/src/types";
import Pagination from "@/components/Pagination";
import FavoriteHook from "@/hooks/useFavorite";
import ProductHook from "@/hooks/useProduct";
import { useMemo } from "react";
import { usePerPage } from "@/utils/getPerPage";
import ShortCategorySideBar from "@/components/ShortCategorySidebar";
import EmptyList from "@/components/EmptyList";
function SearchPage() {
  const per_page = usePerPage();
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

  const {
    data: favoriteProductData,
    isLoading: isLoadingFavoriteProduct,
    error: errorFavoriteProduct,
  } = FavoriteHook.useAllFavorite();

  const favoriteIds = useMemo(
    () =>
      new Set(favoriteProductData?.map((f: ProductPreview) => f.id)) ||
      new Set([]),
    [favoriteProductData]
  );

  const totalProducts = data?.totalProducts ?? 0;
  const products = data?.products ?? [];

  const handlePageChange = (value: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(value));
    router.replace(`?${next.toString()}`);
  };
  console.log("data: ", data);
  if (data) {
    totalPages = Math.ceil(Number(totalProducts) / per_page);
    dataResult = products as ProductPreview[];
  }
  return (
    <>
      {(isLoadingProducts || isLoadingFavoriteProduct) && <LoadingSpinner />}
      {errorProducts && <> Error...</>}
      {errorFavoriteProduct && <> Error...</>}
      {dataResult ? (
        <div>
          <div className="text-center w-full">
            <h1 className="text-4xl">Chào mừng đến AuctionHub</h1>
            <div className="mt-2 text-gray-500">
              Tìm kiếm và đấu giá hàng triệu sản phẩm từ những người bán uy tín
            </div>
          </div>
          <div className="mt-10">
            <ShortCategorySideBar />
            <div className="flex items-center gap-2 text-gray-700">
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
                {query}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
            {(products || []).map((item: ProductPreview, index: number) => {
              const isFavoriteProduct = (item: ProductPreview) =>
                favoriteIds.has(Number(item.id));
              return (
                <div key={index} className="mt-3">
                  <ProductCard
                    key={index}
                    product={item}
                    isFavorite={isFavoriteProduct(item)}
                  />
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
        <EmptyList
          content="Bạn hiện không bán sản phẩm nào. Hãy tìm kiếm những
                món đồ ưng ý và từ đó đưa ra lựa chọn để tạo sản phẩm nhé"
        />
      )}
    </>
  );
}
export default SearchPage;
