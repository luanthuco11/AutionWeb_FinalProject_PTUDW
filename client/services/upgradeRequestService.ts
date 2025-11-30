import { api, safeRequest } from "@/config/axios.config";
import API_ROUTES from "../../shared/src/api"

export class UpgradeRequestService {
    static async createSellerRequest(id: string): Promise<any> {
        return safeRequest(async () => {
            const res = await api.post(API_ROUTES.upgrade.createSellerRequest, id);
            return res.data;
        })
    }

    static async getRequestStatus(id: string): Promise<any> {
        return safeRequest(async () => {
            const res = await api.get(API_ROUTES.upgrade.getRequestStatus(id));
            return res.data;
        })
    }

    static async updateApproveRequest(id: string): Promise<any> {
        return safeRequest(async () => {
            const res = await api.post(API_ROUTES.upgrade.updateApproveRequest, id);
            return res.data;
        })
    }

    static async updateRejectRequest(id: string): Promise<any> {
        return safeRequest(async () => {
            const res = await api.post(API_ROUTES.upgrade.updateRejectRequest, id);
            return res.data;
        })
    }

}