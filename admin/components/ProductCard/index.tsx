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
  const handleOnDelete = () => {
    setIsPopup(true);
  };
  return (
    <>
      {isDeletingProduct ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full h-full">
          <div className="flex flex-row gap-x-4 p-4 bg-white border border-border rounded-lg">
            <div className="flex-1">
              <Image
                src={product.main_image}
                alt="My avatar"
                width={200}
                height={200}
              />
            </div>
            <div className="flex flex-col justify-between flex-3">
              <div>
                <p className="line-clamp-2 font-semibold text-black text-sm">
                  {product.name}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs line-clamp-1">
                  Loại: {product.category.name}
                </p>
                <p className="text-muted-foreground text-xs line-clamp-1">
                  Người bán: {product.seller.email}
                </p>
              </div>
            </div>
            <div className="flex-2">
              <div className="grid grid-rows-2 h-full">
                <div>
                  <p className="text-muted-foreground text-xs line-clamp-1">
                    Ngày bắt đầu
                  </p>
                  <p className="font-semibold text-sm text-foreground">
                    {formatDate(product.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs line-clamp-1">
                    Ngày kết thúc
                  </p>
                  <p className="font-semibold text-sm text-foreground">
                    {formatDate(product.end_time)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-2">
              <div className="grid grid-rows-2 h-full">
                <div>
                  <p className="text-muted-foreground text-xs line-clamp-1">
                    Giá hiện tại
                  </p>
                  <p className="font-semibold text-sm text-foreground">
                    {formatCurrency(product.current_price)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs line-clamp-1">
                    Giá mua ngay
                  </p>
                  <p className="font-semibold text-sm text-foreground">
                    {formatCurrency(product.buy_now_price)}
                  </p>
                </div>
              </div>
            </div>
            <div className=" flex items-center">
              <div
                className="border border-border rounded-lg w-fit p-1 hover:cursor-pointer"
                onClick={handleOnDelete}
              >
                <svg
                  className="w-6 h-6 text-gray-800 hover:text-red-500 dark:text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <ConfirmPopup
            isOpen={isPopup}
            onClose={() => setIsPopup(false)}
            selected={{ id: product.id, content: "xóa " + product.name }}
            onConfirm={handleDeleteProduct}
          />
        </div>
      )}
    </>
  );
}
