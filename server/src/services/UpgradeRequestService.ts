import { BaseService } from "./BaseService";

export class UpgradeService extends BaseService {
    private static instance: UpgradeService;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!UpgradeService.instance) {
            this.instance = new UpgradeService();
        }
        return this.instance;
    }

    async createSellerRequest(payload: { id: string }) {
        const sql =
            `
                INSERT INTO admin.user_upgrade_requests (bidder_id)
                VALUES ($1);
                `
        const params = [payload.id];

        return this.safeQuery(sql, params);
    }

    async getRequestStatus(payload: { id: string }) {
        const sql =
            `
                SELECT status 
                FROM admin.user_upgrade_requests
                WHERE id = $1;
                `
        const params = [payload.id];

        return this.safeQuery(sql, params);
    }

    async updateApproveRequest(payload: { id: string }) {
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

    async updateRejectRequest(payload: { id: string }) {
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