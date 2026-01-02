"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ProductPreview } from "../../../shared/src/types";
import { formatDate } from "@/utils/timeService";
import { formatCurrency } from "@/utils/priceService";
import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "../LoadingSpinner";
import { ConfirmPopup } from "../ConfirmPopup";

interface Props {
  product: ProductPreview;
}

export default function ProductCard({ product }: Props) {
  const [isPopup, setIsPopup] = useState(false);
  const { mutate: deleteProduct, isPending: isDeletingProduct } =
    ProductHook.useDeleteProductById();

  const handleDeleteProduct = () => {
    setIsPopup(false);
    deleteProduct(product.id, {
      onSuccess: () => {
        console.log("Deleted!");
      },
      onError: () => {
        console.log("Error!");
      },
    });
  };

  const handleOnDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPopup(true);
  };

  return (
    <>
      {isDeletingProduct ? (
        <div className="w-full h-32 flex items-center justify-center bg-white border border-gray-200 rounded-lg">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="w-full group">
          <div className="flex flex-row items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 h-auto md:h-36">
            <div className="shrink-0 w-28 h-28 md:w-40 md:h-full relative rounded-md overflow-hidden bg-gray-100">
              <Image
                src={product.main_image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 112px, 160px"
              />
            </div>

            <div className="flex flex-1 flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden">
              <div className="flex flex-col justify-center min-w-0 md:flex-[2]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600 bg-blue-50 rounded border border-blue-100">
                    {product.category.name}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-tight mb-1 group-hover:text-blue-600">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-3">
                  <span className="font-medium text-gray-400">Người bán: </span>
                  {product.seller.email}
                </p>
              </div>

              <div className="flex flex-row gap-6 md:flex-[3] justify-start md:justify-end items-center  md:border-t-0 md:border-l border-gray-100 pt-2 md:pt-0 md:pl-6">
                <div className="flex flex-col gap-1 min-w-[100px]">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Giá hiện tại
                    </p>
                    <p className="text-md font-bold text-emerald-600">
                      {formatCurrency(product.current_price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Giá mua ngay
                    </p>
                    <p className="text-md font-bold text-blue-600">
                      {formatCurrency(product.buy_now_price)}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex flex-col gap-1 min-w-[100px]">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Bắt đầu
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {formatDate(product.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">
                      Kết thúc
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {formatDate(product.end_time)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 pl-2">
              <button
                className="p-2 rounded-full text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                onClick={handleOnDelete}
                title="Xóa"
              >
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          <ConfirmPopup
            isOpen={isPopup}
            onClose={() => setIsPopup(false)}
            selected={{ id: product.id, content: `xóa "${product.name}"` }}
            onConfirm={handleDeleteProduct}
          />
        </div>
      )}
    </>
  );
}
