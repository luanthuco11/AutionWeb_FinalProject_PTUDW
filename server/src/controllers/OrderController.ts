import { BaseController } from "./BaseController";
import { Request, Response, NextFunction } from "express";

export class OrderController extends BaseController {
  constructor(service: any) {
    super(service);
  }

  async getOrder (req: Request, res: Response) {
    const orders = await this.service.getOrder();
    return { orders }
  }

  async getOrderById (req: Request, res: Response) {
    const productId = Number(req.params.productId);

    const order = await this.service.getOrderById(productId);
    return { order }
  }

  async createOrder (req: Request, res: Response) {
    const result = await this.service.createOrder(req.body);
    return result;
  }

  async updateOrderStatus (req: Request, res: Response) {
    const productId = Number(req.params.productId);
    const status = req.params.status;

    const result = await this.service.updateOrderStatus(productId, status);
    return result;
  }

  async getOrderChat (req: Request, res: Response) {
    const productId = Number(req.params.productId);

    const chat = await this.service.getOrder(productId);
    return { order_chat: chat }
  }

  async createOrderChat (req: Request, res: Response) {
    const productId = Number(req.params.productId);

    const result = await this.service.createOrderChat(productId, req.body);
    return result;
  }
}