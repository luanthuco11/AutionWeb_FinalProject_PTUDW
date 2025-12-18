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

  static async getCountProduct(): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.category.getCountProduct);
      return res.data;
    }
    )
  }
  static async getCategoryDetailById(id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.category.getCategoryDetailById(id));
      return res.data;
    });
  }


  static async getProductsByCategorySlug(
    slug: string,
    page: number,
    limit: number,
    sort: string
  ): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(
        API_ROUTES.category.getProductsByCategorySlug(slug, page, limit, sort)
      );
      return res.data;
    });
  }

  static async getProductsByCategoryId(pagination: Pagination): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(
        API_ROUTES.category.getProductsByCategoryId(pagination)
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

  static async deleteCategory(id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.delete(API_ROUTES.category.deleteCategory(id));
      return res.data;
    });
  }
}
