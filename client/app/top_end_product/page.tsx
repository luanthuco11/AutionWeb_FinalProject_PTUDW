"use client";
import { ArrowRight } from "@/components/icons";
import Link from "next/link";
import { ProductPreview } from "../../../shared/src/types";
import ProductCard from "@/components/ProductCard";
import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "@/components/LoadingSpinner";
import Pagination from "@/components/Pagination";
import { useSearchParams, useRouter } from "next/navigation";

function Page() {
  const per_page = 15;
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || "1";
  const {
    data: topEndingSoonProduct,
    isLoading: isLoadingTopEndingSoonProduct,
    error: errorTopEndingSoonProduct,
  } = ProductHook.useGetTopEndingSoonProduct(per_page, Number(page));

  const handlePageChange = (value: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(value));
    router.replace(`?${next.toString()}`);
  };

  const data = topEndingSoonProduct as ProductPreview[];

  return (
    <>
      {isLoadingTopEndingSoonProduct && <LoadingSpinner />}
      {errorTopEndingSoonProduct && <> Error.... </>}
      {topEndingSoonProduct && (
        <div>
          <div className="text-center w-full">
            <h1 className="text-4xl">Chào mừng đến AuctionHub</h1>
            <div className="mt-2 text-gray-500">
              Tìm kiếm và đấu giá hàng triệu sản phẩm từ những người bán uy tín
            </div>
          </div>

          <div>
            <div className="mt-15">
              <div className="flex justify-between font-medium">
                <div className=" text-2xl">Sản phẩm sắp kết thúc</div>
                <Link
                  href={"/"}
                  className="text-blue-500 flex items-center  gap-2"
                >
                  <div className="text-[15px]">Xem tất cả</div>
                  <ArrowRight className="w-5 h-5 mt-0.5" />
                </Link>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-5 gap-3">
              {data.map((item, index) => {
                return (
                  <div key={index} className="mt-3">
                    <ProductCard product={item} isFavorite={false} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <Pagination
              totalPages={3}
              onPageChange={handlePageChange}
              currentPage={Number(page)}
            />
          </div>
        </div>
      )}
    </>
  );
}
export default Page;
// "/category/[:...category_slugs]/product/[:product_slug]"
// "/user/info"
// "/user/rating"
// "/user/favourite_products"
// "/user/bidding_products"
// "/user/winning_products"
// "/user/seller_role"
// "/user/selling_products"
// "/user/sold_products"
