import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { CreateRating } from "../../../shared/src/types";

export class RatingController extends BaseController {
  constructor(service: any) {
    super(service);
  }

  async getRating(req: Request, res: Response) {
    const { userId, offset } = req.params;
    const result = await this.service.getRating({ userId, offset });
    return { result };
  }

  async getTotalRating(req: Request, res: Response) {
    const { userId } = req.params;
    const result = await this.service.getAllRating(userId);
    return { result };
  }

  async createRating(req: Request, res: Response) {
    const userId = Number(req.user?.id);
    const result = await this.service.createRating(userId, req.body);
    return { result };
  }
}
