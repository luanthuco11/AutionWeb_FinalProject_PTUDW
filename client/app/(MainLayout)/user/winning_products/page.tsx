"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "@/components/LoadingSpinner";
import WinProduct from "@/components/WinProduct";
import { WinningProduct } from "../../../../../shared/src/types";
import Pagination from "@/components/Pagination";
import Link from "next/link";

const WinningProductPage = () => {
  const per_page = 5;
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || "1";
  let totalPages = 1;
  let dataResult = null;
  const {
    data,
    isLoading: isLoadingWinningProduct,
    error: isErrorWinningProduct,
  } = ProductHook.useGetWinningProduct(per_page, Number(page));

  const totalProducts = data?.totalProducts ?? 0;
  const products = data?.products ?? [];

  const handlePageChange = (value: number) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(value));
    router.replace(`?${next.toString()}`);
  };

  if (data) {
    totalPages = Math.ceil(Number(totalProducts) / per_page);
    dataResult = products as WinningProduct[];
  }

  return (
    <>
      {isLoadingWinningProduct && <LoadingSpinner />}
      {isErrorWinningProduct && <> Error...</>}
      {dataResult && dataResult.length > 0 ? (
        <div className="bg-card shadow-sm rounded-lg p-8">
          <div className="text-3xl text-[#1e293b] font-semibold mb-7">
            Sản phẩm đã thắng
          </div>
          <div className="flex flex-col gap-5">
            {dataResult.map((bP, index) => (
              <WinProduct product={bP} key={index} />
            ))}
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
        <div>Không có sản phẩm thuộc loại này...</div>
      )}
    </>
  );
};

export default WinningProductPage;
