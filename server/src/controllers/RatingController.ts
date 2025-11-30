import { Request, Response } from "express";
import { BaseController } from "./BaseController";

export class RatingController extends BaseController {
    constructor(service: any) {
        super(service);
    }

    async getRating(req: Request, res: Response) {
        const {userId} = req.params
        const result = await this.service.getRating(userId);
        return { result };
    }

    async createRating(req: Request, res: Response) {
        const result = await this.service.createRating(req.body);
        return { result };
    }
}