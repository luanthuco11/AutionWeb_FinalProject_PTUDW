import { api, safeRequest } from "../config/axios.config";
import API_ROUTES from "../../shared/src/api";
import { BidLog, BlacklistPayload, CreateBidLog } from "../../shared/src/types";

export class BidService {
  static async getBidlogs(product_id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.bid.getBidLogs(product_id));
      return res.data;
    });
  }

  static async getUserBid(product_id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.bid.getUserBid(product_id));
      return res.data;
    });
  }

  static async createBid(payload: CreateBidLog): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.bid.createBid, payload);
      return res.data;
    });
  }
  static async createReject(payload: BidLog): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.bid.createReject, payload);
      return res.data;
    });
  }
  static async createBlacklist(payload: BlacklistPayload): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.bid.createBlacklist, payload);
      return res.data;
    });
  }
}
