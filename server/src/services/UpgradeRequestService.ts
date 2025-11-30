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

    async createSellerRequest(payload: { id: number }) {
        const sql =
            `
                INSERT INTO admin.user_upgrade_requests (bidder_id)
                VALUES ($1);
                `
        const params = [payload.id];

        return this.safeQuery(sql, params);
    }

    async getRequestStatus(id: string) {
        const sql =
            `
                SELECT status 
                FROM admin.user_upgrade_requests
                WHERE id = $1;
                `
        const params = [id];

        return this.safeQuery(sql, params);
    }

    async updateApproveRequest(payload: { id: number }) {
        const status = 'approved'
        const sql =
            `
                UPDATE admin.user_upgrade_requests
                SET status = $1
                WHERE id = $2;
                `
        const params = [status, payload.id];

        return this.safeQuery(sql, params);
    }

    async updateRejectRequest(payload: { id: number }) {
        const status = 'rejected'
        const sql =
            `
                UPDATE admin.user_upgrade_requests
                SET status = $1
                WHERE id = $2;
                `
        const params = [status, payload.id];

        return this.safeQuery(sql, params);
    }
}