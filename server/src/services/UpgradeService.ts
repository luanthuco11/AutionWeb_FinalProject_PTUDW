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

    async createSellerRequest(id: string) {
        
    }
}