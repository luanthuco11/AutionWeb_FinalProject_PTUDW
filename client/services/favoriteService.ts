import { api, safeRequest } from "../config/axios.config"
import API_ROUTES from "../../shared/src/api"

export class FavoriteService {
  static async getFavorite(): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.favorite.getFavorite);
      return res.data;
    });
  }

  static async updateFavorite(productId: number, isFavorite: boolean): Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(API_ROUTES.favorite.updateFavorite(productId, isFavorite));
      return res.data;
    });
  }
}

