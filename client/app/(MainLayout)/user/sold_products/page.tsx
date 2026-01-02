"use client";

import SoldProduct from "@/components/SoldProduct";
import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { FullSoldProduct } from "../../../../../shared/src/types";

const SoldProductPage = () => {
  const { user } = useAuth();
  const { data: soldProducts, isLoading: isLoadingSoldProducts } =
    ProductHook.useGetSoldProduct() as {
      data: FullSoldProduct[];
      isLoading: boolean;
    };

  return (
    <div className="bg-card shadow-sm rounded-lg p-4 sm:p-6 md:p-8">
      <div className="text-xl sm:text-2xl md:text-3xl text-[#1e293b] font-semibold mb-5 md:mb-7">
        Sản phẩm đã bán
      </div>

      {isLoadingSoldProducts ? (
        <div className="fixed inset-0 z-100">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-5">
          {soldProducts && soldProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] bg-card shadow-sm rounded-lg p-6 md:p-8 text-center border border-slate-100">
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
                    d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25-2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                  />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-medium text-slate-900 mb-2">
                Chưa có sản phẩm nào
              </h3>
              <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 max-w-xs md:max-w-sm">
                Có vẻ như bạn chưa bán được sản phẩm nào. Hãy đăng sản phẩm một
                cách hợp lí để bán thuận lợi nhé!
              </p>
              <Link
                href="/user/selling_products/create"
                className="px-5 py-2 md:px-6 md:py-2.5 bg-primary text-white text-sm md:text-base font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Đăng bán sản phẩm
              </Link>
            </div>
          ) : (
            soldProducts &&
            user &&
            soldProducts.map((bP, index) => (
              <SoldProduct key={index} product={bP} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SoldProductPage;
