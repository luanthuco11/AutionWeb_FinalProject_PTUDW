import { api, safeRequest } from "@/config/axios.config";
import API_ROUTES from "../../shared/src/api";

export class SystemService {
  static async updateProductRenewTime(time: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.system.updateProductRenewTime, {
        time,
      });
      return res.data;
    });
  }
}
