import Image from "next/image";

import { useState } from "react";
import RatingPopup from "../RatingPopUp";
import { CreateRating, Product } from "../../../shared/src/types";
import { RatingHook } from "@/hooks/useRating";
interface User {
  id: string;
  email: string;
}

interface SoldProps {
  product: Product;
  rater_id: number;
}
const SoldProduct = ({ product, rater_id }: SoldProps) => {
  const { mutate: createRating, isPending: isLoadingRating } =
    RatingHook.useCreateRating();
  const [openPopup, setOpenPopup] = useState(false);

  const handleSubmitRating = (rating: number, comment: string) => {
    if (product.top_bidder) {
      const ratingData: CreateRating = {
        ratee: product.top_bidder,
        rater_id,
        rating,
        comment: comment,
      };
      console.log(ratingData);
      createRating(ratingData);
      alert("Thanh cong");
    } else {
      alert("Chua co nguoi mua");
    }
    setOpenPopup(false);
  };
  console.log(product);
  return (
    <>
      <RatingPopup
        isOpen={openPopup}
        onClose={() => setOpenPopup(false)}
        onSubmit={handleSubmitRating}
        buyerName={product.top_bidder?.name ?? "Người mua"}
      />
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg shadow-xs p-4 w-full">
        <div className="flex items-center gap-3">
          <Image
            src={product.main_image}
            alt="Ảnh sản phẩm"
            width={90}
            height={90}
            className="rounded-md object-cover p-1 border border-gray-200"
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-gray-700 text-[15px]">
              {product.name}
            </span>
            <span className="text-slate-500 font-stretch-10% text-sm">
              Giá chốt:{" "}
              <span className="text-[#0D9488] font-bold text-md">
                {product.current_price} đ
              </span>
            </span>
            <button
              onClick={() => setOpenPopup(true)}
              className="mt-1 text-sm bg-gray-200 text-slate-600 px-3 py-1 rounded-md hover:bg-gray-300 transition w-[90px]"
            >
              Đánh giá
            </button>
          </div>
        </div>
        <div className="text-right flex flex-col gap-1">
          <span className="text-slate-500 font-stretch-10% text-sm">
            Giá ban đầu
          </span>
          <span className="text-[#0D9488] font-bold text-lg">
            {product.initial_price} đ
          </span>
        </div>
      </div>
    </>
  );
};

export default SoldProduct;
