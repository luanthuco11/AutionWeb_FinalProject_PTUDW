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

  static useGetOneRating(raterId: number, targetId: number) {
    return useQuery({
      queryKey: ["user_rating", targetId],

      queryFn: () => RatingService.getOneRating(raterId, targetId),

      staleTime: STALE_10_MIN,

      enabled: !!raterId || !!targetId,

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
      mutationFn: ({ silent, ...data }: CreateRating & { silent?: boolean }) =>
        RatingService.createRating(data),

      onSuccess: (_, params) => {
        if (!params.silent) toast.success("Tạo đánh giá thành công");
        queryClient.invalidateQueries({
          queryKey: ["user_rating", "total_user_rating"],
        });
        queryClient.invalidateQueries({
          queryKey: ["user_rating", params.ratee.id],
        });
      },

      onError: (error) => {
        toast.error("Tạo đánh giá thất bại");
      },
    });
  }

  static useUpdateRating() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ silent, ...data }: CreateRating & { silent?: boolean }) =>
        RatingService.updateRating(data),

      onSuccess: (_, params) => {
        if (!params.silent) toast.success("Sửa đánh giá thành công");
        queryClient.invalidateQueries({
          queryKey: ["user_rating", "total_user_rating"],
        });
        queryClient.invalidateQueries({
          queryKey: ["user_rating", params.ratee.id],
        });
      },

      onError: (error) => {
        toast.error("Sửa đánh giá thất bại");
      },
    });
  }
}
