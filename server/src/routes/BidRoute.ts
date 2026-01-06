import { BaseRoute } from "./BaseRoute";

import { BaseController } from "../controllers/BaseController";
import { BidController } from "../controllers/BidController";
import { BidService } from "../services/BidService";
import { protectedRoutes } from "../middlewares/authMiddleware";
import { OrderService } from "../services/OrderService";

export class BidRoute extends BaseRoute {
  private controller: BidController;
  
  constructor() {
    super();
    this.controller = new BidController(
      BidService.getInstance(OrderService.getInstance())
    );
    this.initRoutes();
  }

  initRoutes() {
    this.router.get(
      "/user-bid/:productId",
      protectedRoutes,
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
      protectedRoutes,
      BaseController.handleRequest(
        this.controller.createBid.bind(this.controller)
      )
    );
    this.router.post(
      "/reject",
      protectedRoutes,
      BaseController.handleRequest(
        this.controller.createReject.bind(this.controller)
      )
    );

    this.router.post(
      "/blacklist",
      protectedRoutes,
      BaseController.handleRequest(
        this.controller.createBlacklist.bind(this.controller)
      )
    );
    this.router.get(
      "/:product_slug/can-bid",
      protectedRoutes,
      BaseController.handleRequest(
        this.controller.getCanBid.bind(this.controller)
      )
    );
  }
}
