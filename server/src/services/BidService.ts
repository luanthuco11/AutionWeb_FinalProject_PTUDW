import { BidLog, CreateBidLog } from "../../../shared/src/types/Bid";
import { BaseService } from "./BaseService";
import { MutationResult } from "../../../shared/src/types/Mutation";
export class BidService extends BaseService {
  private static instance: BidService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!BidService.instance) {
      BidService.instance = new BidService();
    }
    return BidService.instance;
  }
  async getBidLogs(id: number): Promise<BidLog[]> {
    const sql = `SELECT * FROM auction.bid_logs as l WHERE l.product_id = $1 ORDER BY l.created_at DESC `;
    const logs: BidLog[] = await this.safeQuery(sql, [id]);
    return logs;
  }
  async createBid(bid: CreateBidLog): Promise<MutationResult> {
    let sql = `SELECT COUNT(*) as total FROM auction.black_list as bl WHERE bl.user_id = $1 AND bl.product_id = $2`;
    const totalBl = await this.safeQuery(sql, [bid.user_id, bid.product_id]);
    if (totalBl.length > 0) return { success: false };
    sql = `INSERT INTO auction.bid_logs (user_id, product_id, price, created_at, updated_at)
                VALUES
                ($1, $2, $3, NOW(), NOW() )`;
    await this.safeQuery(sql, [bid.user_id, bid.product_id, bid.price]);
    return { success: true };
  }
  async createReject(bid: BidLog): Promise<MutationResult> {
    let sql = `INSERT INTO auction.black_list(user_id, product_id, created_at, updated_at)
                VALUES
                ($1, $2, NOW(), NOW())`;
    await this.safeQuery(sql, [bid.user, bid.product_id]);
    sql = "DELETE FROM auction.bid_logs WHERE user_id = $1 and product_id = $2";
    await this.safeQuery(sql, [bid.user, bid.product_id]);
    return { success: true };
  }
}
