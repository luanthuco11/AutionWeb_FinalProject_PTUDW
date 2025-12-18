"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ProductPreview } from "../../../shared/src/types";
import { formatDate } from "@/utils/timeService";
import { formatCurrency } from "@/utils/priceService";
import ProductHook from "@/hooks/useProduct";
import LoadingSpinner from "../LoadingSpinner";

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
          {/* Confirm */}
          {isPopup ? (
            <div className="  fixed inset-0   flex  top-0 right-0 left-0 z-50 justify-center items-center w-full  h-[calc(100%-1rem)] max-h-full">
              <div className="relative  w-full max-w-md max-h-full inset-1">
                <div className="relative border border-default rounded-base shadow-sm ">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPopup(false);
                    }}
                    className="absolute top-3 end-2.5 text-body bg-transparent hover:bg-red-100 hover:cursor-pointer hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                  >
                    <svg
                      className="w-5 h-5"
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
                        d="M6 18 17.94 6M18 18 6.06 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className=" p-4 md:p-5 text-center bg-white">
                    <svg
                      className="mx-auto mb-4 text-fg-disabled w-12 h-12"
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
                        d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <h3 className="mb-6 text-body">
                      Bạn có chắc chắn muốn xóa sản phẩm này không?
                    </h3>
                    <div className="flex items-center space-x-4 justify-center">
                      <button
                        type="button"
                        onClick={handleDeleteProduct}
                        className="text-white hover:cursor-pointer bg-danger box-border border border-transparent hover:bg-danger-strong focus:ring-4 focus:ring-danger-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                      >
                        Đồng ý
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsPopup(false);
                        }}
                        className="text-body hover:cursor-pointer  box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                      >
                        Không
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}
    </>
  );
}
