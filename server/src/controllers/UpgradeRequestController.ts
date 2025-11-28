import { UpgradeService } from "../services/UpgradeRequestService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";
export class UpgradeController extends BaseController {
    constructor (service: UpgradeService) {
        super(service);
    }

    async createSellerRequest(req: Request, res: Response) {
        const result = await this.service.createSellerRequest(req.body);
        return {result};
    }
}