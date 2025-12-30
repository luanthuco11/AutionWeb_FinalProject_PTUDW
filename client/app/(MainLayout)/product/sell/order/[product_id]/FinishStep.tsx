import React from "react";
import Lottie from "lottie-react";
import checkAnimation from "@/public/Success.json";
import FeedbackBox from "@/components/FeedbackBox";
import {
  CreateRating,
  Order,
  Product,
  UserRating,
} from "../../../../../../../shared/src/types";
import OrderHook from "@/hooks/useOrder";
import { RatingHook } from "@/hooks/useRating";
import LoadingSpinner from "@/components/LoadingSpinner";

type PageProps = {
  order: Order;
};

const FinishStep = ({ order }: PageProps) => {
  const { data: rating, isLoading: isLoadingRating } =
    RatingHook.useGetOneRating(order?.seller?.id, order?.buyer?.id) as {
      data: UserRating;
      isLoading: boolean;
    };

  const { mutate: createRating, isPending: isCreatingRating } =
    RatingHook.useCreateRating();

  const { mutate: updateRating, isPending: isUpdatingRating } =
    RatingHook.useUpdateRating();

  const handleRatingSeller = (ratingPoint: number, message: string) => {
    if (!order.buyer.id || !order.seller.id) return;
    const newRating: CreateRating = {
      ratee: order.buyer,
      rating: ratingPoint,
      comment: message,
    };

    if (!rating) createRating(newRating);
    else updateRating(newRating);
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="relative w-full py-5 flex flex-col gap-2 items-center justify-center">
        <Lottie
          animationData={checkAnimation}
          loop={false}
          className="w-25 h-25"
        />
        <p className="text-2xl font-medium text-green-500">Đã giao hàng</p>
      </div>

      <div className="relative w-full flex justify-center">
        {isLoadingRating ? (
          <LoadingSpinner />
        ) : (
          <div className="w-100">
            <FeedbackBox
              targetName={order.seller.name}
              rating={rating}
              onRating={handleRatingSeller}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FinishStep;
