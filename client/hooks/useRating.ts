import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { RatingService } from "@/services/ratingService";
import { STALE_10_MIN } from "@/config/query.config";
import { CreateRating, UserRating } from "../../shared/src/types";

export class RatingHook {
  static useGetRating(userId: number) {
    return useQuery({
      queryKey: ["user_rating", userId],

      queryFn: () => RatingService.getRating(userId),

      staleTime: STALE_10_MIN,

      select: (data) => {
        return data.data;
      },
    });
  }

  static useCreateRating() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data: CreateRating) => RatingService.createRating(data),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["user_rating"],
        });
      },
    });
  }
}
