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
  const sort = searchParams.get("sort") || "ascending-price";
  let totalPages = 1;

  const {
    data,
    isLoading: isLoadingProducts,
    error: errorProducts,
  } = ProductHook.useGetProductsBySearch(query, per_page, Number(page), sort);

  const {
    data: favoriteProductData,
    isLoading: isLoadingFavoriteProduct,
    error: errorFavoriteProduct,
  } = FavoriteHook.useAllFavorite();

  const favoriteIds = useMemo(
    () => new Set(favoriteProductData?.map((f: ProductPreview) => f.id) || []),
    [favoriteProductData]
  );

  const totalProducts = data?.totalProducts ?? 0;
  const products = data?.products ?? [];
  totalPages = Math.ceil(Number(totalProducts) / per_page);

  const handlePageChange = (value: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(value));
    router.replace(`?${next.toString()}`);
  };

  const handleClearSearch = () => {
    router.replace("/");
  };

  // 1. Logic Loading: Hiện spinner ngay khi đang tải bất kỳ dữ liệu nào
  if (isLoadingProducts || isLoadingFavoriteProduct) {
    return (
      <div className="inset-0 h-[80vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // 2. Logic Error: Báo lỗi nếu có
  if (errorProducts || errorFavoriteProduct) {
    return (
      <div className="p-10 text-center text-red-500 font-medium">
        Đã có lỗi xảy ra khi tìm kiếm sản phẩm.
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="text-center w-full">
          <h1 className="text-4xl">Chào mừng đến AuctionHub</h1>
          <div className="mt-2 text-gray-500">
            Tìm kiếm và đấu giá hàng triệu sản phẩm từ những người bán uy tín
          </div>
        </div>

        <div className="mt-10">
          <ShortCategorySideBar />
          <div className="flex items-center flex-wrap gap-x-3 gap-y-2 text-gray-700">
            {/* Cụm Icon + Tiêu đề: Giữ liền nhau */}
            <div className="flex items-center gap-2 shrink-0">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500"
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
              <span className="text-base sm:text-xl font-medium whitespace-nowrap">
                Từ khóa tìm kiếm
              </span>
            </div>

            {/* Từ khóa: Cho phép ngắt dòng nếu quá dài */}
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-semibold text-sm sm:text-base break-all">
              {query}
            </span>

            {/* Nút xóa: Tự xuống hàng nếu thiếu chỗ trên mobile */}
            {query && (
              <button
                onClick={handleClearSearch}
                className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-red-500 transition-colors border px-2 py-1 sm:px-3 rounded-lg hover:border-red-500 whitespace-nowrap active:bg-red-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>Xóa tìm kiếm</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Logic EmptyList: Chỉ hiển thị khi products thực sự rỗng sau khi loading xong */}
        {products.length === 0 ? (
          <EmptyList
            content={`Không tìm thấy sản phẩm nào phù hợp với từ khóa "${query}". Vui lòng thử từ khóa khác.`}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
              {products.map((item: ProductPreview, index: number) => (
                <div key={item.id || index} className="mt-3">
                  <ProductCard
                    product={item}
                    isFavorite={favoriteIds.has(Number(item.id))}
                  />
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Pagination
                totalPages={totalPages}
                onPageChange={handlePageChange}
                currentPage={Number(page)}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default SearchPage;
