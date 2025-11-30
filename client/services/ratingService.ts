import { api, safeRequest } from "@/config/axios.config";
import API_ROUTES from "../../shared/src/api"
import { UserRating } from "../../shared/src/types";

interface CreateRatingPayload extends UserRating {
    rater_id: string
    ratee_id: string
}

export class RatingService {
  static async getRating(userId: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.rating.getRating(userId));
      return res.data;
    })
  }

  static async createRating(data: CreateRatingPayload): Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(API_ROUTES.rating.createRating, data);
      return res.data;
    })
  }
}