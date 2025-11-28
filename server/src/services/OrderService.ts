import { BaseService } from "./BaseService";
import {
  User,
  Order,
  NewOrderRequest,
  OrderStatus,
  OrderMessage,
  OrderConversation,
  NewOrderMessageRequest,
} from "./../../../shared/src/types";

import { MutationResult } from "../../../shared/src/types/Mutation";

export class OrderService extends BaseService {
  private static instance: OrderService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  async getOrder() {
    // Đâu cần api này nhỉ
  }

  async getOrderById(productId: number): Promise<Order | undefined> {
    const sql = `
      SELECT
        O.*,
        P.SELLER_ID,
        P.TOP_BIDDER_ID
      FROM AUCTION.ORDERS O
      JOIN PRODUCT.PRODUCTS P ON P.ID = O.PRODUCT_ID
      WHERE
        O.PRODUCT_ID = $1
    `;

    type OrderWithUsers = Order & {
      seller_id: number;
      top_bidder_id: number;
    };

    const order = (await this.safeQuery<OrderWithUsers>(sql, [productId]))?.[0];
    if (!order) return undefined;

    const seller = await this.Helper.getUserById(order.seller_id);
    if (!seller) return undefined;

    const bidder = await this.Helper.getUserById(order.top_bidder_id);
    if (!bidder) return undefined;

    return {
      product_id: order.product_id,
      seller,
      bidder,
      status: order.status,
      shipping_address: order.shipping_address,
      payment_invoice: order.payment_invoice,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  }

  async createOrder(payload: NewOrderRequest): Promise<MutationResult> {
    const { product_id, shipping_address } = payload;

    const sql = `
      INSERT INTO AUCTION.ORDERS (PRODUCT_ID, STATUS, SHIPPING_ADDRESS, PAYMENT_INVOICE, CREATED_AT, UPDATED_AT)
      VALUES ($1, 'pending', $2, null, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    await this.safeQuery(sql, [product_id, shipping_address]);
    return {
      success: true,
    };
  }

  async updateOrderStatus(
    productId: number,
    status: OrderStatus
  ): Promise<MutationResult> {
    const sql = `
      UPDATE AUCTION.ORDERS
      SET STATUS = $1
      WHERE PRODUCT_ID = $2
    `;

    await this.safeQuery(sql, [status, productId]);
    return {
      success: true,
    };
  }

  async getOrderChat(
    productId: number
  ): Promise<OrderConversation | undefined> {
    const sql = `
      SELECT 
        U.ID,
        U.NAME,
        U.PROFILE_IMG,
        M.MESSAGE,
        M.CREATED_AT
      FROM AUCTION.ORDER_MESSAGES M
      JOIN ADMIN.USERS U ON U.ID = M.USER_ID
      WHERE M.PRODUCT_ID = $1
    `;

    const orderMessages = await this.safeQuery<OrderMessage>(sql, [productId]);
    console.log(orderMessages);
    if (!orderMessages) return undefined;

    return {
      product_id: productId,
      messages: orderMessages,
    };
  }

  async createOrderChat(
    productId: number,
    payload: NewOrderMessageRequest
  ): Promise<MutationResult> {
    const { user_id, message } = payload;

    const sql = `
      INSERT INTO AUCTION.ORDER_MESSAGES (PRODUCT_ID, USER_ID, MESSAGE)
      VALUES ($1, $2, $3)
    `;

    await this.safeQuery(sql, [productId, user_id, message]);

    return {
      success: true,
    };
  }

  private Helper = {
    getUserById: async (
      userId: number | undefined
    ): Promise<User | undefined> => {
      if (!userId) return undefined;

      const sql = `
        SELECT *  
        FROM ADMIN.USERS
        WHERE ID = $1
      `;

      const user = (await this.safeQuery<User>(sql, [userId]))?.[0];

      return user;
    },
  };
}
