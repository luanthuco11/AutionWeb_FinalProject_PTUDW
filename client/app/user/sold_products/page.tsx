"use client";

import SoldProduct from "@/components/SoldProduct";
import ProductHook from "@/hooks/useProduct";

import { useState } from "react";
import { Product } from "../../../../shared/src/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/hooks/useAuth";

const SoldProductPage = () => {
  const { user } = useAuth();
  const { data: soldProducts, isLoading: isLoadingSoldProducts } =
    ProductHook.useGetSoldProduct() as {
      data: Product[] | undefined;
      isLoading: boolean;
    };

  return (
    <div className="bg-card shadow-sm rounded-lg p-8">
      <div className="text-3xl text-[#1e293b] font-semibold mb-7">
        Sản phẩm đã bán
      </div>
      {isLoadingSoldProducts ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col gap-5">
          {soldProducts && soldProducts.length == 0 ? (
            <>Chưa có sản phẩm</>
          ) : (
            soldProducts &&
            user &&
            soldProducts.map((bP, index) => (
              <SoldProduct
                key={index}
                product={bP}
                rater_id={parseInt(user.id as string)}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SoldProductPage;
