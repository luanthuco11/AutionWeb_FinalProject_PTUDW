import { api, safeRequest } from "../config/axios.config";
import API_ROUTES from "../../shared/src/api";
import { CreateAnswer, CreateQuestion } from "../../shared/src/types";
import { Pagination } from "../../shared/src/types/Pagination";

// Một hàm để tạo kết nối tới endpoint bên backend
// Không được biết gì về frontend cả
// NO COUPLING

export class ProductService {
  static async getProducts(pagination: Pagination): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.getProducts(pagination));
      return res.data;
    });
  }
  static async getCategoryProductList(): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.getCategoryProductList);
      return res.data;
    });
  }

  static async getProductsBySearch(
    query: string,
    limit: number,
    page: number
  ): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(
        API_ROUTES.product.getProductsBySearch(query, limit, page)
      );
      return res.data;
    });
  }

  static async getProductsBySearchSuggestion(
    query: string,
    limit: number
  ): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(
        API_ROUTES.product.getProductsBySearchSuggestion(query, limit)
      );
      return res.data;
    });
  }

  static async getProductTop(): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.getProductTop);
      return res.data;
    });
  }

  static async getTopEndingSoonProduct(
    limit: number,
    page: number
  ): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(
        API_ROUTES.product.getTopEndingSoonProduct(limit, page)
      );
      return res.data;
    });
  }

  static async getTopBiddingProduct(limit: number, page: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(
        API_ROUTES.product.getTopBiddingProduct(limit, page)
      );
      return res.data;
    });
  }

  static async getTopPriceProduct(limit: number, page: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(
        API_ROUTES.product.getTopPriceProduct(limit, page)
      );
      return res.data;
    });
  }

  static async getProductById(id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.getProductById(id));
      return res.data;
    });
  }
  static async getProductBySlug(slug: string): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.getProductBySlug(slug));
      return res.data;
    });
  }
  static async getSoldProduct(): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.getSoldProduct);
      return res.data;
    });
  }
  static async getBiddingProduct(limit: number, page: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(
        API_ROUTES.product.getBiddingProduct(limit, page)
      );
      return res.data;
    });
  }
  static async getWinningProduct(limit: number, page: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(
        API_ROUTES.product.getWinningProduct(limit, page)
      );
      return res.data;
    });
  }

  static async createProduct(formData: FormData): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.product.createProduct, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    });
  }
  static async updateProductDescription(
    id: number,
    description: string
  ): Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(
        API_ROUTES.product.updateProductDescription(id),
        { description }
      );
      return res.data;
    });
  }

  static async deleteProductById(id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.delete(API_ROUTES.product.deleteProductById(id));
      return res.data;
    });
  }

  static async getProductQuestion(id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.geProductQuestion(id));
      return res.data;
    });
  }

  static async createProductQuestion(
    id: number,
    data: CreateQuestion
  ): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(
        API_ROUTES.product.createProductQuestion(id),
        data
      );
      return res.data;
    });
  }

  static async createProductAnswer(
    idProduct: number,
    idQuestion: number,
    data: CreateAnswer
  ): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(
        API_ROUTES.product.createProductAnswer(idProduct, idQuestion),
        data
      );
      return res.data;
    });
  }

  static async updateProductExtend(
    id: number,
    auto_extend: boolean
  ): Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(API_ROUTES.product.updateProductExtend(id), {
        auto_extend,
      });
      return res.data;
    });
  }
}
