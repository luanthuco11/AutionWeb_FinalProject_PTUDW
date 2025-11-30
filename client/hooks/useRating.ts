import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { RatingService } from "@/services/ratingService";
import { STALE_10_MIN } from "@/config/query.config";
import { UserRating } from "../../shared/src/types";

interface CreateRatingPayload extends UserRating {
    rater_id: string
    ratee_id: string
}

export class RatingHook {

    static async useGetRating(userId: number) {
        return useQuery({
            queryKey: ["user_rating", userId],

            queryFn: () => RatingService.getRating(userId),
            
            staleTime: STALE_10_MIN,

            select: (data) => {
                return data.data;
            }
        })
    }

    static async useCreateRating(data: CreateRatingPayload) {

        const queryClient = useQueryClient();
        
        return useMutation({
            mutationFn: () => 
                RatingService.createRating(data),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["user_rating", data.ratee_id]
                })
            }
        })
    }
}