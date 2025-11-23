import { api, safeRequest } from "@/config/axios.config";
import API_ROUTES from "../../shared/src/api"

export class OrderService {
  static async getOrder(): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.order.getOrder);
      return res.data;
    })
  }

  static async getOrderById(productId: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.order.getOrderById(productId));
      return res.data;
    })
  }

  static async createOrder(payload: any): Promise<any> {
    return safeRequest(async() => {
      const res = await api.post(API_ROUTES.order.createOrder, payload);
      return res.data;
    })
  }

  static async updateOrderStatus(productId: number, status: 'pending | paid | shipped | completed | cancelled'): Promise<any> {
    return safeRequest(async() => {
      const res = await api.patch(API_ROUTES.order.updateOrderStatus(productId, status));
      return res.data;
    })
  }

  static async getOrderChat(productId: number): Promise<any> {
    return safeRequest(async() => {
      const res = await api.get(API_ROUTES.order.getOrderChat(productId));
      return res.data;
    })
  }

  static async createOrderChat(productId: number, payload: any): Promise<any> {
    return safeRequest(async() => {
      const res = await api.post(API_ROUTES.order.createOrderChat(productId), payload);
      return res.data;
    })
  }
}