"use client";

import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSearchParams, useRouter } from "next/navigation";
import { BiddingProduct } from "../../../../../shared/src/types";
import Pagination from "@/components/Pagination";
import BidProduct from "@/components/BidProduct";
import Link from "next/link";
import EmptyList from "@/components/EmptyList";

const BiddingProductPage = () => {
  const per_page = 5;
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || "1";
  let totalPages = 1;
  let dataResult = null;

  const {
    data,
    isLoading: isLoadingBiddingProduct,
    error: isErrorBiddingProduct,
  } = ProductHook.useGetBiddingProduct(per_page, Number(page));

  const totalProducts = data?.totalProducts ?? 0;
  const products = data?.products ?? [];

  const handlePageChange = (value: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(value));
    router.replace(`?${next.toString()}`);
  };

  if (data) {
    totalPages = Math.ceil(Number(totalProducts) / per_page);
    dataResult = products as BiddingProduct[];
  }

  return (
    <>
      {isLoadingBiddingProduct && (
        <div className="fixed inset-0 z-100">
          <LoadingSpinner />
        </div>
      )}

      {isErrorBiddingProduct && (
        <div className="p-8 text-red-500">Đã có lỗi xảy ra...</div>
      )}

      <div className="bg-card shadow-sm rounded-lg p-4 sm:p-6 md:p-8">
        <div className="text-xl sm:text-2xl md:text-3xl text-[#1e293b] font-semibold mb-5 md:mb-7">
          Sản phẩm đang đấu giá
        </div>

        {dataResult && dataResult.length > 0 ? (
          <>
            <div className="flex flex-col gap-4 md:gap-5">
              {dataResult.map((bP, index) => (
                <BidProduct key={index} product={bP} />
              ))}
            </div>
            <div className="mt-8 md:mt-10 flex justify-center">
              <Pagination
                totalPages={totalPages}
                onPageChange={handlePageChange}
                currentPage={Number(page)}
              />
            </div>
          </>
        ) : (
          !isLoadingBiddingProduct && (
            <EmptyList
              content=" Bạn hiện không tham gia đấu giá sản phẩm nào. Hãy tìm kiếm những
                món đồ ưng ý và bắt đầu ra giá nhé!"
            />
          )
        )}
      </div>
    </>
  );
};

export default BiddingProductPage;
