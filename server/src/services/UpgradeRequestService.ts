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

    async createSellerRequest(payload: {id: string}) {
        const sql = 
                `
                INSERT INTO admin.user_upgrade_requests (bidder_id)
                VALUES ($1);
                `
        const params = [payload.id];

        return this.safeQuery(sql, params);
    }
}