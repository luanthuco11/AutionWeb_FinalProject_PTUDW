import { UpgradeRequestPreview } from "../../../shared/src/types";
import { BaseService } from "./BaseService";

export class UpgradeService extends BaseService {
  private static instance: UpgradeService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!UpgradeService.instance) {
      UpgradeService.instance = new UpgradeService();
    }
    return UpgradeService.instance;
  }

  async createSellerRequest(id: number) {
    const sql = `
                INSERT INTO admin.user_upgrade_requests (bidder_id, status, created_at, updated_at)
                VALUES ($1, $2, NOW(), NOW());
                `;
    const params = [id, "pending"];

    return this.safeQuery(sql, params);
  }

  async getRequestStatus(id: string) {
    const sql = `
                SELECT * 
                FROM admin.user_upgrade_requests
                WHERE bidder_id = $1
                ORDER BY created_at DESC
                LIMIT 1
                `;
    const params = [id];

    return this.safeQuery(sql, params);
  }

  async updateApproveRequest(payload: { id: number }) {
    const queryClient = await this.getClient();
    try {
      await queryClient.query("BEGIN");
      const status = "approved";
      let sql = `
                UPDATE admin.user_upgrade_requests
                SET status = $1
                WHERE id = $2
                RETURNING bidder_id
                `;
      let params = [status, payload.id];
      const bidder_id: any = await this.safeQueryWithClient(
        queryClient,
        sql,
        params
      );

      const role = "seller";
      sql = ` UPDATE admin.users
                SET role = $1
                WHERE id = $2`;
      params = [role, bidder_id[0].bidder_id];
      await this.safeQueryWithClient(queryClient, sql, params);
      await queryClient.query("COMMIT");
    } catch (error) {
      console.log("Loi update upgrade");
      await queryClient.query("ROLLBACK");
    }
  }

  async updateRejectRequest(payload: { id: number }) {
    const status = "rejected";
    const sql = `
                UPDATE admin.user_upgrade_requests
                SET status = $1
                WHERE id = $2;
                `;
    const params = [status, payload.id];

    return this.safeQuery(sql, params);
  }
  async getUpgradeRequests(
    page: number,
    limit: number
  ): Promise<UpgradeRequestPreview[]> {
    const offset = (page - 1) * limit;
    const sql = `
                SELECT r.id,r.created_at, u.name as bidder_name, u.email as bidder_email, u.positive_points ,u.negative_points, u.created_at as bidder_created_at
                FROM admin.user_upgrade_requests as r
                JOIN admin.users as u ON u.id = r.bidder_id 
                WHERE r.status = $1 AND r.created_at + INTERVAL '7 days' > NOW()
                ORDER BY  r.created_at desc
                OFFSET $2
                LIMIT $3
                `;

    const params = ["pending", offset, limit];
    const rawRequests = await this.safeQuery(sql, params);
    const requests: UpgradeRequestPreview[] = rawRequests.map((r: any) => {
      const {
        bidder_name,
        bidder_email,
        positive_points,
        negative_points,
        bidder_created_at,
        ...rest
      } = r;

      return {
        ...rest,
        bidder: {
          name: bidder_name,
          email: bidder_email,
          negative_points: negative_points === null ? 0 : negative_points,
          positive_points: positive_points === null ? 0 : positive_points,
          created_at: bidder_created_at,
        },
      };
    });

    return requests;
  }
  async getTotalUpgradeRequests() {
    const sql = `
                SELECT COUNT(*) AS total
                FROM admin.user_upgrade_requests as r
                WHERE r.status = $1
                `;
    const params = ["pending"];
    const totalrequests: { total: number }[] = await this.safeQuery(
      sql,
      params
    );
    return totalrequests[0]?.total;
  }
}
