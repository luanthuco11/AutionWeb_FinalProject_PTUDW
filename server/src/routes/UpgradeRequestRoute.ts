import { BaseRoute } from "./BaseRoute";
import { UpgradeService } from "../services/UpgradeRequestService";
import { BaseController } from "../controllers/BaseController";
import { UpgradeController } from "../controllers/UpgradeRequestController";

export class UpgradeRequestRoute extends BaseRoute {
    private controller: UpgradeController;
    constructor() {
        super();
        this.controller = new UpgradeController(UpgradeService.getInstance());
        this.initRoutes();
    }

    initRoutes() {
        this.router.post(
            "/request", 
            BaseController.handleRequest(
                this.controller.createSellerRequest.bind(
                    this.controller
                )));

        this.router.get(
            "/status", 
            BaseController.handleRequest(
                this.controller.getRequestStatus.bind(
                    this.controller
                )));

        this.router.patch(
            "/approve", 
            BaseController.handleRequest(
                this.controller.updateApproveRequest.bind(
                    this.controller
                )));

        this.router.patch(
            "/reject", 
            BaseController.handleRequest(
                this.controller.updateRejectRequest.bind(
                    this.controller
                )));
    }
}
