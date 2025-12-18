import { UpgradeService } from "../services/UpgradeRequestService";
import { BaseController } from "./BaseController";
import { Request, Response } from "express";
export class UpgradeController extends BaseController {
  constructor(service: UpgradeService) {
    super(service);
  }

  async createSellerRequest(req: Request, res: Response) {
    const result = await this.service.createSellerRequest(
      req.headers["user-id"]
    );
    return { result };
  }
  async getUpgradeRequests(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const requests = await this.service.getUpgradeRequests(page, limit);
    const totalRequests = await this.service.getTotalUpgradeRequests();
    return { requests: requests, totalRequests };
  }
  async getRequestStatus(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.service.getRequestStatus(id);
    return { result };
  }

  async updateApproveRequest(req: Request, res: Response) {
    const result = await this.service.updateApproveRequest(req.body);
    return { result };
  }

  async updateRejectRequest(req: Request, res: Response) {
    const result = await this.service.updateRejectRequest(req.body);
    return { result };
  }
}
