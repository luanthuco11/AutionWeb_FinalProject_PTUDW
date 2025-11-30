"use client";

import React from "react";
import FavoriteButton from "../FavoriteButton";
import {  ProductPreview } from "../../../shared/src/types";
import { getTimeDifference } from "@/app/utils";
import Link from "next/link";
import Image from "next/image";
import FavoriteHook from "@/hooks/useFavorite";
import LoadingSpinner from "../LoadingSpinner";

const defaultImage = "https://img.freepik.com/premium-photo/white-colors-podium-abstract-background-minimal-geometric-shape-3d-rendering_48946-113.jpg?semt=ais_hybrid&w=740&q=80";

export default function ProductCard({
  product,
  isFavorite = false,
}: {
  product: ProductPreview;
  isFavorite: boolean;
}) 
{
  const { mutate: addFavorite, isPending: isAdding } =
    FavoriteHook.useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoving } =
    FavoriteHook.useRemoveFavorite();

  const handleFavorite = (productId: number, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        addFavorite({ productId: productId });
      } else {
        removeFavorite({ productId: productId });
      }
    } catch (e) {
      console.error("Fail to adding or removing favorite products", e);
    }
  };

  return (
    <div className="group relative w-full h-123 rounded-lg border-2 border-gray-200 bg-white shadow-md hover:shadow-2xl hover:border-blue-500 transition-all duration-200 select-none">
      <Image
        src={product.main_image || defaultImage}
        width={50}
        height={123}
        alt={product.name}
        className="w-full aspect-5/4 rounded-t-md"
      />
      <Link href={`/product/${product.slug}`} className="block px-3">
        <section className="mt-2">
          <div className="h-18">
            <p className="font-medium max-h-12 line-clamp-2">{product.name}</p>
            <div className="mt-1 flex flex-row gap-1">
              <svg
                className="w-6 h-6 text-red-500 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8.597 3.2A1 1 0 0 0 7.04 4.289a3.49 3.49 0 0 1 .057 1.795 3.448 3.448 0 0 1-.84 1.575.999.999 0 0 0-.077.094c-.596.817-3.96 5.6-.941 10.762l.03.049a7.73 7.73 0 0 0 2.917 2.602 7.617 7.617 0 0 0 3.772.829 8.06 8.06 0 0 0 3.986-.975 8.185 8.185 0 0 0 3.04-2.864c1.301-2.2 1.184-4.556.588-6.441-.583-1.848-1.68-3.414-2.607-4.102a1 1 0 0 0-1.594.757c-.067 1.431-.363 2.551-.794 3.431-.222-2.407-1.127-4.196-2.224-5.524-1.147-1.39-2.564-2.3-3.323-2.788a8.487 8.487 0 0 1-.432-.287Z" />
              </svg>

              <span>{product.bid_count} lượt đấu giá</span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-sm">Giá hiện tại</p>
            <p>
              <span className="text-2xl font-medium text-red-500">
                {product.current_price?.toLocaleString("en-US") ||
                  product.initial_price}
              </span>
            </p>
          </div>
          <div className="mt-1">
            <p className="text-sm">Giá mua ngay</p>
            <p>
              <span className="text-xl font-medium text-blue-600">
                {product.buy_now_price?.toLocaleString("en-US") || "---"}
              </span>
            </p>
          </div>

          <div className="mt-3 h-10">
            {product.top_bidder_name ? (
              <div>
                <p className="text-sm">Người trả giá cao nhất</p>
                <p className="font-medium">{product.top_bidder_name}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-800">Chưa có lượt trả giá</p>
              </div>
            )}
          </div>
        </section>
        <hr className="border-t border-solid border-gray-300 mt-3 mb-1.5" />
        <section className="flex flex-col gap-1.5">
          <p className="text-sm text-gray-500">
            Ngày bắt đầu:{" "}
            {new Date(product.created_at).toLocaleDateString("en-GB")}
          </p>
          <div className="flex flex-row gap-2 items-center">
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
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
                d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span>
              {getTimeDifference(
                new Date(product.created_at),
                new Date(product.end_time)
              )}
            </span>
          </div>
        </section>
      </Link>

      {/* Favourite Button */}
      <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <FavoriteButton
          isFavorite={isFavorite}
          onClick={() => handleFavorite(product.id, !isFavorite)}
        />
      </div>
      {(isAdding || isRemoving) && <LoadingSpinner />}
    </div>
  );
}
