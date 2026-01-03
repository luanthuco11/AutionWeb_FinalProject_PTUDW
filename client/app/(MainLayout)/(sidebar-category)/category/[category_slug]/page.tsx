"use client";
import ProductCard from "@/components/ProductCard";
import CategoryHook from "@/hooks/useCategory";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductPreview } from "../../../../../../shared/src/types";
import Pagination from "@/components/Pagination";
import FavoriteHook from "@/hooks/useFavorite";
import { use } from "react";
import { useMemo } from "react";
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

  const totalPriceProducts = data?.totalProducts ?? 0;
  const categoryName = data?.categoryName ?? "";
  const products = data?.products ?? [];

  const handlePageChange = (value: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(value));
    router.replace(`?${next.toString()}`);
  };

  if (data) {
    totalPages = Math.ceil(Number(totalPriceProducts) / per_page);
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
          <div className=" mt-10">
            <ShortCategorySideBar />
            <div className="text-2xl font-medium">{categoryName}</div>
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
          content=" Bạn hiện không bán sản phẩm nào. Hãy tìm kiếm những
                món đồ ưng ý và từ đó đưa ra lựa chọn để tạo sản phẩm nhé"
        />
      )}
    </>
  );
}
export default CategorySlugPage;
// "/category/[:...category_slugs]/product/[:product_slug]"
// "/user/info"
// "/user/rating"
// "/user/favourite_products"
// "/user/bidding_products"
// "/user/winning_products"
// "/user/seller_role"
// "/user/selling_products"
// "/user/sold_products"
