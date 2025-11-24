import axios  from "axios";
import { api, safeRequest } from "../config/axios.config";
import API_ROUTES from "../../shared/src/api";
import { Product, ProductAnswer, ProductPreview, ProductQuestion } from "../../shared/src/types";

// Một hàm để tạo kết nối tới endpoint bên backend
// Không được biết gì về frontend cả
// NO COUPLING

export class ProductService {
  static async getProducts(): Promise<any>{
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.getProducts);
      return res.data;
    });
  }

  static async getProductTop():  Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.getProductTop);
      return res.data;
    });
  }

  static async getProductById(id: number):  Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.getProductById(id));
      return res.data;
    });
  }

  static async createProduct(payload: Product):  Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.product.createProduct, payload);
      return res.data;
    });
  }
  static async updateProductDescription(id: number, description: string):  Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(
        API_ROUTES.product.updateProductDescription(id), {description}
      );
      return res.data;
    });
  }

  static async deleteProductById(id: number):  Promise<any> {
    return safeRequest(async () => {
      const res = await api.delete(API_ROUTES.product.deleteProductById(id));
      return res.data;
    });
  }

  static async getProductQuestion(id: number):  Promise<any>{
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.geProductQuestion(id));
      return res.data;
    });
  }

  static async createProductQuestion(id: number, data: ProductQuestion):  Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.product.createProductQuestion(id), data);
      return res.data;
    });
  }

  static async createProductAnswer(
    idProduct: number,
    idQuestion: number,
    data: ProductAnswer
  ):  Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(
        API_ROUTES.product.createProductAnswer(idProduct, idQuestion), data
      );
      return res.data;
    });
  }

  static async updateProductExtend(id: number, auto_extend: boolean):  Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(API_ROUTES.product.updateProductExtend(id), {auto_extend});
      return res.data;
    });
  }
}
