import { BaseRoute } from "./BaseRoute";

import { BaseController } from "../controllers/BaseController";
import { BidController } from "../controllers/BidController";
import { BidService } from "../services/BidService";
import { protectedRoutes } from "../middlewares/authMiddleware";

export class BidRoute extends BaseRoute {
  private controller: BidController;
  constructor() {
    super();
    this.controller = new BidController(BidService.getInstance());
    this.initRoutes();
  }

  initRoutes() {
    this.router.use(protectedRoutes);
    this.router.get(
      "/user-bid/:productId",
      BaseController.handleRequest(
        this.controller.getUserBid.bind(this.controller)
      )
    );
    this.router.get(
      "/:id",
      BaseController.handleRequest(
        this.controller.getBidLogs.bind(this.controller)
      )
    );
    this.router.post(
      "/",
      BaseController.handleRequest(
        this.controller.createBid.bind(this.controller)
      )
    );
    this.router.post(
      "/reject",
      BaseController.handleRequest(
        this.controller.createReject.bind(this.controller)
      )
    );
  }
}
