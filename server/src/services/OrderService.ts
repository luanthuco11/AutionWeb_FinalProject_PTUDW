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
  OrderMessageV2,
} from "./../../../shared/src/types";

import { MutationResult } from "../../../shared/src/types/Mutation";
import { R2Service } from "./R2Service";

export class OrderService extends BaseService {
  private static instance: OrderService;

  constructor(private bidService: any) {
    super();
  }

  static getInstance(bidService?: any) {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService(bidService || null);
    } else if (bidService) {
      OrderService.instance.bidService = bidService;
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
        (O.BUYER_ID = $2 OR (P.SELLER_ID = $2 AND O.STATUS != 'cancelled'))
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

    // --- SỬA ĐOẠN NÀY ---
    const createOrderSql = `
      WITH inserted_order AS (
        INSERT INTO AUCTION.ORDERS (PRODUCT_ID, BUYER_ID, STATUS, SHIPPING_ADDRESS, PAYMENT_INVOICE, PRICE, CREATED_AT, UPDATED_AT)
        SELECT $1, $2, 'pending', $3, null, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        FROM PRODUCT.PRODUCTS P
        WHERE P.id = $1 AND P.seller_id != $2
        ON CONFLICT(product_id, buyer_id) DO NOTHING
        RETURNING product_id 
      )
      SELECT P.slug
      FROM inserted_order I
      JOIN PRODUCT.PRODUCTS P ON P.id = I.product_id
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
    } else return { success: true, slug: createOrderResult[0].slug };
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

    const productSlug = await this.safeQuery<{ slug: string }>(
      "SELECT slug FROM PRODUCT.PRODUCTS WHERE id = $1",
      [productId]
    );
    return {
      success: true,
      slug: productSlug[0]?.slug || "",
    };
  }

  async buyerPayOrder(
    product_id: number,
    payment: OrderPayment,
    invoiceImage: Express.Multer.File
  ): Promise<MutationResult> {
    const r2 = R2Service.getInstance();
    const invoiceImageUrl = await r2.uploadToR2(invoiceImage, "order");

    const { is_paid, address, phone_number } = payment;

    if (!is_paid) return { success: false };

    const sql = `
      UPDATE AUCTION.ORDERS
      SET
        SHIPPING_ADDRESS = $1,
        PHONE_NUMBER = $2,
        STATUS = 'paid',
        PAYMENT_INVOICE = $3,
        UPDATED_AT = NOW()
      WHERE PRODUCT_ID = $4 AND STATUS = 'pending'
    `;

    const result = await this.safeQuery(sql, [
      address,
      phone_number,
      invoiceImageUrl,
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
      RETURNING P.SLUG
    `;

    const promises = [
      this.safeQuery<{ slug: string }>(cancelOrderSql, [
        product_id,
        buyer_id,
        seller_id,
      ]),
      this.bidService.blacklistABuyer(product_id, seller_id, buyer_id),
    ];

    const [cancelOrderResult, insertToBlacklistResult] = await Promise.all(
      promises
    );

    return {
      success: true,
      slug: (cancelOrderResult as { slug: string }[])?.[0]?.slug || "",
    };
  }

  async getOrderChat(
    productId: number,
    userId: number
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
      WHERE M.PRODUCT_ID = $1 AND M.BUYER_ID = $2
      ORDER BY M.CREATED_AT ASC
    `;

    const order = await this.getOrderById(userId, productId);
    if (!order) throw new Error("No active order");

    if (userId !== order.buyer.id && userId !== order.seller.id) {
      throw new Error("No order valid");
    }

    const buyerId = order?.buyer.id;

    const orderMessages = await this.safeQuery<OrderMessageV2>(sql, [
      productId,
      buyerId,
    ]);
    if (!orderMessages) return undefined;

    return {
      product_id: productId,
      buyer_id: buyerId,
      messages: orderMessages.map((message) => ({
        user: {
          id: message.id,
          name: message.name,
          profile_img: message.profile_img,
        },
        message: message.message,
        created_at: new Date(message.created_at),
      })),
    };
  }

  async createOrderChat(
    productId: number,
    userId: number,
    payload: NewOrderMessageRequest
  ): Promise<MutationResult> {
    const { message } = payload;

    const order = await this.getOrderById(userId, productId);

    if (!order) throw new Error("No active order");

    if (userId !== order.buyer.id && userId !== order.seller.id) {
      throw new Error("No order valid");
    }
    const buyerId = order?.buyer.id;
    const sql = `
      INSERT INTO AUCTION.ORDER_MESSAGES (PRODUCT_ID, USER_ID, BUYER_ID, MESSAGE)
      VALUES ($1, $2, $3, $4)
    `;

    await this.safeQuery(sql, [productId, userId, buyerId, message]);

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
