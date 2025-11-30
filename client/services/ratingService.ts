import { api, safeRequest } from "@/config/axios.config";
import API_ROUTES from "../../shared/src/api";
import { CreateRating, UserRating } from "../../shared/src/types";

export class RatingService {
  static async getRating(userId: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.rating.getRating(userId));
      return res.data;
    });
  }

  static async createRating(data: CreateRating): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.rating.createRating, data);
      return res.data;
    });
  }
}
