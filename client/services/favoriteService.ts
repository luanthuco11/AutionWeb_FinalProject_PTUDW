import { api, safeRequest } from "../config/axios.config";
import API_ROUTES from "../../shared/src/api";

export class FavoriteService {
  static async getFavorite(): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.favorite.getFavorite);
      return res.data;
    });
  }

  static async addFavorite(productId: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.favorite.addFavorite(productId));
      return res.data;
    });
  }

  static async removeFavorite(productId: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.delete(
        API_ROUTES.favorite.removeFavorite(productId)
      );
      return res.data;
    });
  }
}
