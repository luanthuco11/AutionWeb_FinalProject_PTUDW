import { BaseService } from "./BaseService";

export class SystemService extends BaseService {
    private static instance: SystemService;

    private constructor() {
        super();
    }

    static getInstance() {
        if (!SystemService.instance) {
            SystemService.instance = new SystemService();
        }
        return SystemService.instance;
    }

    async getProductRenewTime(time: number) {
        const sql = `
                SELECT product_renew_time
                FROM public.system_config
                `;
        return this.safeQuery(sql);
    }

    async updateProductRenewTime(time: number) {
        const sql = `
                UPDATE public.system_config
                SET product_renew_time = $1
                `;
        const params = [time];

        return this.safeQuery(sql, params);
    }
}
