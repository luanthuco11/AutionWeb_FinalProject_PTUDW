import axios  from "axios";
import { api, safeRequest } from "../config/axios.config";
import API_ROUTES from "../../shared/src/api";
import { Product, ProductAnswer, ProductQuestion } from "../../shared/src/types";

// Một hàm để tạo kết nối tới endpoint bên backend
// Không được biết gì về frontend cả
// NO COUPLING

export class ProductService {
  static async getProducts(){
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.getProducts);
      return res.data;
    });
  }

  static async getProductTop() {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.getProductTop);
      return res.data;
    });
  }

  static async getProductById(id: number) {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.getProductById(id));
      return res.data;
    });
  }

  static async createProduct(payload: Product) {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.product.createProduct, payload);
      return res.data;
    });
  }
  static async updateProductDescription(id: number, description: string) {
    return safeRequest(async () => {
      const res = await api.patch(
        API_ROUTES.product.updateProductDescription(id), {description}
      );
      return res.data;
    });
  }

  static async deleteProductById(id: number) {
    return safeRequest(async () => {
      const res = await api.delete(API_ROUTES.product.deleteProductById(id));
      return res.data;
    });
  }

  static async getProductQuestion(id: number){
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.product.geProductQuestion(id));
      return res.data;
    });
  }

  static async createProductQuestion(id: number, data: ProductQuestion) {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.product.createProductQuestion(id), data);
      return res.data;
    });
  }

  static async createProductAnswer(
    idProduct: number,
    idQuestion: number,
    data: ProductAnswer
  ) {
    return safeRequest(async () => {
      const res = await api.post(
        API_ROUTES.product.createProductAnswer(idProduct, idQuestion), data
      );
      return res.data;
    });
  }

  static async updateProductExtend(id: number, auto_extend: boolean) {
    return safeRequest(async () => {
      const res = await api.patch(API_ROUTES.product.updateProductExtend(id), {auto_extend});
      return res.data;
    });
  }
}
