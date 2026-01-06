"use client";
import ProductCard from "@/components/ProductCard";
import CategoryHook from "@/hooks/useCategory";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductPreview } from "../../../../../../shared/src/types";
import Pagination from "@/components/Pagination";
import FavoriteHook from "@/hooks/useFavorite";
import { use, useMemo } from "react";
import { usePerPage } from "@/utils/getPerPage";
import ShortCategorySideBar from "@/components/ShortCategorySidebar";
import EmptyList from "@/components/EmptyList";

function CategorySlugPage({
  params,
}: {
  params: Promise<{ category_slug: string }>;
}) {
  const { category_slug } = use(params);
  const per_page = usePerPage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || "1";
  const sort = searchParams.get("sort") || "ascending-price";
  let totalPages = 1;

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

  const {
    data: favoriteProductData,
    isLoading: isLoadingFavoriteProduct,
    error: errorFavoriteProduct,
  } = FavoriteHook.useAllFavorite();

  const favoriteIds = useMemo(
    () =>
      new Set(
        favoriteProductData?.map((p: ProductPreview) => Number(p.id)) || []
      ),
    [favoriteProductData]
  );

  const totalPriceProducts = data?.totalProducts ?? 0;
  const categoryName = data?.categoryName ?? "";
  const products = data?.products ?? [];
  totalPages = Math.ceil(Number(totalPriceProducts) / per_page);

  const handlePageChange = (value: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(value));
    router.replace(`?${next.toString()}`);
  };

  // 1. Logic Loading: Ưu tiên hiển thị Spinner khi bất kỳ API nào đang fetch
  if (isLoadingProducts || isLoadingFavoriteProduct) {
    return (
      <div className="inset-0 h-[80vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // 2. Logic Error: Hiển thị lỗi nếu có
  if (errorProducts || errorFavoriteProduct) {
    return (
      <div className="p-10 text-center text-red-500">
        Đã có lỗi xảy ra. Vui lòng thử lại sau.
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
          <div className="text-2xl font-medium">{categoryName}</div>
        </div>

        {/* 3. Logic Empty List: Kiểm tra mảng products sau khi đã tải xong và không có lỗi */}
        {products.length === 0 ? (
          <EmptyList content="Danh mục này hiện chưa có sản phẩm nào. Hãy quay lại sau hoặc khám phá các danh mục khác nhé!" />
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

export default CategorySlugPage;
