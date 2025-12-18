import { api, safeRequest } from "@/config/axios.config";
import API_ROUTES from "../../shared/src/api";
import { Pagination } from "../../shared/src/types/Pagination";

export class UpgradeRequestService {
  static async createSellerRequest(): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.upgrade.createSellerRequest);
      return res.data;
    });
  }
  static async getUpgradeRequests(pagination: Pagination): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(
        API_ROUTES.upgrade.getUpgradeRequests(pagination)
      );
      return res.data;
    });
  }
  static async getRequestStatus(id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.upgrade.getRequestStatus(id));
      return res.data;
    });
  }

  static async updateApproveRequest(id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(API_ROUTES.upgrade.updateApproveRequest, {
        id,
      });
      return res.data;
    });
  }

  static async updateRejectRequest(id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(API_ROUTES.upgrade.updateRejectRequest, {
        id,
      });
      return res.data;
    });
  }
}
