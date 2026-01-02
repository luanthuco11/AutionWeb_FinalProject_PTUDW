"use client";

import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useSearchParams, useRouter } from "next/navigation";
import { BiddingProduct } from "../../../../../shared/src/types";
import Pagination from "@/components/Pagination";
import BidProduct from "@/components/BidProduct";
import Link from "next/link";

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
            <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] text-center">
              <div className="bg-slate-100 p-4 md:p-6 rounded-full mb-4 md:mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 md:w-16 md:h-16 text-slate-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15.5A2.25 2.25 0 0021.75 18v-4.162c0-1.242-1.008-2.25-2.25-2.25H15.75a2.25 2.25 0 01-2.012-1.244l-.257-.513a2.25 2.25 0 00-2.013-1.244H8.518a2.25 2.25 0 00-2.013 1.244l-.256.513A2.25 2.25 0 014.25 11.25H2.25A2.25 2.25 0 000 13.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-medium text-slate-900 mb-2">
                Danh sách trống
              </h3>
              <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 max-w-xs md:max-w-sm">
                Bạn hiện không tham gia đấu giá sản phẩm nào. Hãy tìm kiếm những
                món đồ ưng ý và bắt đầu ra giá nhé!
              </p>
              <Link
                href="/"
                className="px-5 py-2 md:px-6 md:py-2.5 bg-primary text-white text-sm md:text-base font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default BiddingProductPage;
