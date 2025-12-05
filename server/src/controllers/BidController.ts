import { BidLog, CreateBidLog } from "../../../shared/src/types/Bid";
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
  async createBid(req: Request, res: Response) {
    const bid: CreateBidLog = {
      user_id: parseInt(req.headers["user-id"] as string),
      product_id: req.body.product_id,
      price: req.body.price,
    };
    await this.service.createBid(bid);
  }
  async createReject(req: Request, res: Response) {
    const bid: BidLog = {
      id: req.body.id,
      user: req.body.user.id,
      product_id: req.body.product_id,
      price: req.body.price,
    };

    await this.service.createReject(bid);
  }
}
