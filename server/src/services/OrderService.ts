import { BaseService } from "./BaseService";
import {
  User,
  Order,
  NewOrderRequest,
  OrderStatus,
  OrderMessage,
  OrderConversation,
  NewOrderMessageRequest,
  OrderPayment,
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

  async getOrderById(
    userId: number,
    productId: number
  ): Promise<Order | undefined> {
    const sql = `
      SELECT
        O.*,
        P.SELLER_ID,
        O.PRICE,
        O.BUYER_ID,
        O.PHONE_NUMBER
      FROM AUCTION.ORDERS O
      JOIN PRODUCT.PRODUCTS P ON P.ID = O.PRODUCT_ID
      WHERE
        O.PRODUCT_ID = $1 AND
        (O.BUYER_ID = $2 OR P.SELLER_ID = $2)
    `;

    type OrderWithUsers = Order & {
      seller_id: number;
      buyer_id: number;
    };

    const order = (
      await this.safeQuery<OrderWithUsers>(sql, [productId, userId])
    )?.[0];
    if (!order) return undefined;

    const promises = [
      this.Helper.getUserById(order.seller_id),
      this.Helper.getUserById(order.buyer_id),
    ];

    const [seller, buyer] = await Promise.all(promises);
    if (!seller || !buyer) return undefined;

    return {
      product_id: order.product_id,
      price: order.price,
      seller,
      buyer,
      phone_number: order.phone_number,
      status: order.status,
      shipping_address: order.shipping_address,
      payment_invoice: order.payment_invoice,
      created_at: new Date(order.created_at),
      updated_at: order.updated_at && new Date(order.updated_at),
    };
  }

  async createOrder(
    buyer_id: number,
    payload: NewOrderRequest
  ): Promise<MutationResult> {
    const { product_id, shipping_address, price } = payload;

    const orderExistedSql = `
      SELECT 1
      FROM AUCTION.ORDERS
      WHERE status != 'cancelled' AND product_id = $1
    `;

    const orderExistedResult = await this.safeQuery<number>(orderExistedSql, [
      product_id,
    ]);
    if (orderExistedResult.length != 0) return { success: false };

    const createOrderSql = `
      INSERT INTO AUCTION.ORDERS (PRODUCT_ID, BUYER_ID, STATUS, SHIPPING_ADDRESS, PAYMENT_INVOICE, PRICE, CREATED_AT, UPDATED_AT)
      SELECT $1, $2, 'pending', $3, null, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      FROM PRODUCT.PRODUCTS P
      WHERE P.id = $1 AND P.seller_id != $2
      ON CONFLICT(product_id, buyer_id) DO NOTHING
      RETURNING *
    `;

    const createOrderResult = await this.safeQuery<any>(createOrderSql, [
      product_id,
      buyer_id,
      shipping_address,
      price,
    ]);
    if (createOrderResult.length == 0) {
      console.log("Seller không thể mua sản phẩm của chính mình");
      return { success: false };
    } else return { success: true };
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

  async buyerPayOrder(
    product_id: number,
    payment: OrderPayment
  ): Promise<MutationResult> {
    const { is_paid, address, phone_number } = payment;

    if (!is_paid) return { success: false };

    const sql = `
      UPDATE AUCTION.ORDERS
      SET
        SHIPPING_ADDRESS = $1,
        PHONE_NUMBER = $2,
        STATUS = 'paid',
        UPDATED_AT = NOW()
      WHERE PRODUCT_ID = $3 AND STATUS = 'pending'
    `;

    const result = await this.safeQuery(sql, [
      address,
      phone_number,
      product_id,
    ]);

    return { success: result?.length != 0 };
  }

  async sellerConfirmOrder(
    product_id: number,
    seller_id: number,
    buyer_id: number
  ): Promise<MutationResult> {
    const sql = `
      UPDATE AUCTION.ORDERS O
      SET
        STATUS = 'confirmed',
        UPDATED_AT = NOW()
      FROM PRODUCT.PRODUCTS P
      WHERE 
        P.ID = O.PRODUCT_ID AND
        O.STATUS = 'paid' AND
        O.PRODUCT_ID = $1 AND
        O.BUYER_ID = $2 AND
        P.SELLER_ID = $3
    `;

    const result = await this.safeQuery(sql, [product_id, buyer_id, seller_id]);
    return { success: result?.length != 0 };
  }

  async buyerConfirmShipped(
    product_id: number,
    buyer_id: number
  ): Promise<MutationResult> {
    const sql = `
      UPDATE AUCTION.ORDERS O
      SET
        STATUS = 'shipped',
        UPDATED_AT = NOW()
      FROM PRODUCT.PRODUCTS P
      WHERE 
        P.ID = O.PRODUCT_ID AND
        O.STATUS = 'confirmed' AND
        O.PRODUCT_ID = $1 AND
        O.BUYER_ID = $2
    `;

    const result = await this.safeQuery(sql, [product_id, buyer_id]);
    return { success: result?.length != 0 };
  }

  async sellerRejectOrder(
    product_id: number,
    seller_id: number,
    buyer_id: number
  ): Promise<MutationResult> {
    const cancelOrderSql = `
      UPDATE AUCTION.ORDERS O
      SET
        STATUS = 'cancelled',
        UPDATED_AT = NOW()
      FROM PRODUCT.PRODUCTS P
      WHERE 
        P.ID = O.PRODUCT_ID AND
        O.PRODUCT_ID = $1 AND
        O.BUYER_ID = $2 AND
        P.SELLER_ID = $3
    `;

    const insertToBlacklistSql = `
      INSERT INTO AUCTION.BLACK_LIST (user_id, product_id, created_at, updated_at)
      SELECT $1, P.id, NOW(), NOW()
      FROM PRODUCT.PRODUCTS P
      WHERE P.id = $2 AND P.seller_id = $3
      ON CONFLICT (user_id, prodct_id) DO NOTHING;
    `;

    const promises = [
      this.safeQuery(cancelOrderSql, [product_id, buyer_id, seller_id]),
      this.safeQuery(insertToBlacklistSql, [buyer_id, seller_id]),
    ];

    const [cancelOrderResult, insertToBlacklistResult] = await Promise.all(
      promises
    );
    return {
      success:
        cancelOrderResult?.length != 0 && insertToBlacklistResult?.length != 0,
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
    if (!orderMessages) return undefined;

    return {
      product_id: productId,
      messages: orderMessages.map((message) => ({
        ...message,
        created_at: new Date(message.created_at),
      })),
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
