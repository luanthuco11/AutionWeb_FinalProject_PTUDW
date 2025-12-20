import { BaseRoute } from "./BaseRoute";
import { SystemService } from "../services/SystemService";
import { BaseController } from "../controllers/BaseController";
import { SystemController } from "../controllers/SystemController";

export class SystemRoute extends BaseRoute {
  private controller: SystemController;
  constructor() {
    super();
    this.controller = new SystemController(SystemService.getInstance());
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(
        "/renew-time",
        BaseController.handleRequest(
            this.controller.getProductRenewTime.bind(this.controller)
        )
    );
    this.router.post(
      "/renew-time",
      BaseController.handleRequest(
        this.controller.updateProductRenewTime.bind(this.controller)
      )
    );
  }
}
