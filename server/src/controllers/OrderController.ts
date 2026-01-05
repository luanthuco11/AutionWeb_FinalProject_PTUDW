import { OrderPayment } from "../../../shared/src/types";
import { BaseController } from "./BaseController";
import { Request, Response, NextFunction } from "express";

export class OrderController extends BaseController {
  constructor(service: any) {
    super(service);
  }

  async getOrder(req: Request, res: Response) {
    const orders = await this.service.getOrder();
    return orders;
  }

  async getOrderById(req: Request, res: Response) {
    const userId = req.user?.id;
    const productId = Number(req.params.productId);

    const order = await this.service.getOrderById(userId, productId);
    return order;
  }

  async createOrder(req: Request, res: Response) {
    const buyer_id = req.user?.id;
    const result = await this.service.createOrder(buyer_id, req.body);
    return result;
  }

  async updateOrderStatus(req: Request, res: Response) {
    const productId = Number(req.params.productId);
    const status = req.params.status;

    const result = await this.service.updateOrderStatus(productId, status);
    return result;
  }

  async buyerPayOrder(req: Request, res: Response) {
    const productId = Number(req.params.productId);

    const files = req.files as Express.Multer.File[];
    if (!files) {
      throw new Error("No files were delivered");
    }
    const invoiceImage = files.find((f) => f.fieldname === "payment_invoice");
    const payloadStr = req.body.payload;
    if (!payloadStr) {
      throw new Error("No payload were delivered");
    }

    const payload: OrderPayment = JSON.parse(payloadStr);

    const result = await this.service.buyerPayOrder(productId, payload, invoiceImage);
    return result;
  }

  async sellerConfirmOrder(req: Request, res: Response) {
    const sellerId = req.user?.id;
    const productId = Number(req.params.productId);
    const buyerId = Number(req.params.buyerId);
    const result = await this.service.sellerConfirmOrder(
      productId,
      sellerId,
      buyerId
    );
    return result;
  }

  async buyerConfirmShipped(req: Request, res: Response) {
    const buyerId = req.user?.id;
    const productId = Number(req.params.productId);
    const result = await this.service.buyerConfirmShipped(productId, buyerId);
    return result;
  }

  async sellerRejectOrder(req: Request, res: Response) {
    const sellerId = req.user?.id;
    const productId = Number(req.params.productId);
    const buyerId = Number(req.params.buyerId);
    const result = await this.service.sellerRejectOrder(
      productId,
      sellerId,
      buyerId
    );
    return result;
  }

  async getOrderChat(req: Request, res: Response) {
    const productId = Number(req.params.productId);
    const userId = req.user?.id;
    console.log("kk", req.user, userId);
    const chat = await this.service.getOrderChat(productId, userId);
    return { order_chat: chat };
  }

  async createOrderChat(req: Request, res: Response) {
    const productId = Number(req.params.productId);
    const userId = req.user?.id;
    const result = await this.service.createOrderChat(
      productId,
      userId,
      req.body
    );
    return result;
  }
}
