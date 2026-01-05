import { api, safeRequest } from "@/config/axios.config";
import API_ROUTES from "../../shared/src/api";
import {
  NewOrderMessageRequest,
  NewOrderRequest,
  OrderPayment,
  OrderStatus,
} from "../../shared/src/types";

export class OrderService {
  static async getOrder(): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.order.getOrder);
      return res.data;
    });
  }

  static async getOrderById(productId: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.order.getOrderById(productId));
      return res.data;
    });
  }

  static async createOrder(payload: NewOrderRequest): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.order.createOrder, payload);
      return res.data;
    });
  }

  static async updateOrderStatus(
    productId: number,
    status: OrderStatus
  ): Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(
        API_ROUTES.order.updateOrderStatus(productId, status)
      );
      return res.data;
    });
  }

  static async buyerPayOrder(productId: number, formData: FormData) {
    return safeRequest(async () => {
      const res = await api.patch(
        API_ROUTES.order.buyerPayOrder(productId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    });
  }

  static async sellerConfirmOrder(productId: number, buyer_id: number) {
    return safeRequest(async () => {
      const res = await api.patch(
        API_ROUTES.order.sellerConfirmOrder(productId, buyer_id)
      );
      return res.data;
    });
  }

  static async buyerConfirmShipped(productId: number) {
    return safeRequest(async () => {
      const res = await api.patch(
        API_ROUTES.order.buyerConfirmShipped(productId)
      );
      return res.data;
    });
  }

  static async sellerRejectOrder(productId: number, buyer_id: number) {
    return safeRequest(async () => {
      const res = await api.patch(
        API_ROUTES.order.sellerRejectOrder(productId, buyer_id)
      );
      return res.data;
    });
  }

  static async getOrderChat(productId: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.order.getOrderChat(productId));
      return res.data;
    });
  }

  static async createOrderChat(
    productId: number,
    payload: NewOrderMessageRequest
  ): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(
        API_ROUTES.order.createOrderChat(productId),
        payload
      );
      return res.data;
    });
  }
}
