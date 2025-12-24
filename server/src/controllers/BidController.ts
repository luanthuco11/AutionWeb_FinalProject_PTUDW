import {
  BidLog,
  BlacklistPayload,
  CreateBidLog,
} from "../../../shared/src/types/Bid";
import { BaseController } from "./BaseController";
import { Request, Response, NextFunction } from "express";

export class BidController extends BaseController {
  constructor(service: any) {
    super(service);
  }

  async getBidLogs(req: Request, res: Response) {
    const id = parseInt(req.params.id as string);
    const bid_logs = await this.service.getBidLogs(id);
    return { bid_logs: bid_logs };
  }
  async getUserBid(req: Request, res: Response) {
    const userId = req.user?.id;
    const productId = parseInt(req.params.productId as string);
    const userBid = await this.service.getUserBid(userId, productId);
    return { userBid };
  }
  async createBid(req: Request, res: Response) {
    if (!req?.user?.id) return;

    const bid: CreateBidLog = {
      user_id: req.user?.id,
      product_id: req.body.product_id,
      price: req.body.price,
    };
    return await this.service.createBid(bid);
  }
  async createReject(req: Request, res: Response) {
    const bid: BidLog = {
      id: req.body.id,
      user: req.body.user.id,
      product_id: req.body.product_id,
      price: req.body.price,
    };

    return await this.service.createReject(bid);
  }
  async createBlacklist(req: Request, res: Response) {
    const seller_id = req.user?.id;
    const { product_id, buyer_id } = req.body;

    return await this.service.blacklistABuyer(product_id, seller_id, buyer_id);
  }
}
