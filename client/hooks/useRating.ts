import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { RatingService } from "@/services/ratingService";
import { STALE_10_MIN } from "@/config/query.config";
import { CreateRating, UserRating } from "../../shared/src/types";
import { UserRatingHistory } from "../../shared/src/types";
import { off } from "process";
interface CreateRatingPayload extends UserRating {
  rater_id: string;
  ratee_id: string;
}
import { toast } from "react-toastify";

export class RatingHook {
  static useGetRating(userId: number, offset: number) {
    return useQuery({
      queryKey: ["user_rating", userId, offset],

      queryFn: () => RatingService.getRating(userId, offset),

      staleTime: STALE_10_MIN,

      enabled: !!userId,

      select: (data) => {
        return data.data.result;
      },
    });
  }

  static useGetTotalRating(userId: number) {
    return useQuery({
      queryKey: ["total_user_rating", userId],

      queryFn: () => RatingService.getTotalRating(userId),

      staleTime: STALE_10_MIN,

      enabled: !!userId,

      select: (data) => {
        return data.data.result;
      },
    });
  }

  static useCreateRating() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data: CreateRating) => RatingService.createRating(data),

      onSuccess: () => {
        toast.success("Đánh giá thành công");
        queryClient.invalidateQueries({
          queryKey: ["user_rating", "total_user_rating"],
        });
      },

      onError: (error) => {
        toast.error("Đánh giá thất bại");
      },
    });
  }
}
