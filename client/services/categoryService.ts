import { api, safeRequest } from "../config/axios.config";
import API_ROUTES from "../../shared/src/api";
import { Pagination } from "../../shared/src/types/Pagination";
import {
  CreateCategory,
  ProductCategoryTree,
  UpdateCategory,
} from "../../shared/src/types";


export class CategoryService {
  static async getCategories(): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.category.getCategories);
      return res.data;
    });
  }
  static async getProductsByCategory(pagination: Pagination): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(
        API_ROUTES.category.getProductsByCategory(pagination)
      );
      return res.data;
    });
  }
  static async createCategory(payload: CreateCategory): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.category.createCategory, payload);
      return res.data;
    });
  }
  static async updateCategory(
    id: number,
    payload: UpdateCategory
  ): Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(
        API_ROUTES.category.updateCategory(id),
        payload
      );
      return res.data;
    });
  }

  static async deeleteCategory(id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.delete(API_ROUTES.category.deleteCategory(id));
      return res.data;
    });
  }
}
