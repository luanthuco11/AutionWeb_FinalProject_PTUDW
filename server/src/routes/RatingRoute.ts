import { BaseController } from "../controllers/BaseController";
import { BaseRoute } from "./BaseRoute";
import { RatingController } from "../controllers/RatingController";
import { RatingService } from "../services/RatingService";
import { protectedRoutes } from "../middlewares/authMiddleware";

export class RatingRoute extends BaseRoute {
  private controller: RatingController;
  constructor() {
    super();
    this.controller = new RatingController(RatingService.getInstance());
    this.initRoutes();
  }

  initRoutes() {
    this.router.use(protectedRoutes);

    this.router.get(
      "/total/:userId",
      BaseController.handleRequest(
        this.controller.getTotalRating.bind(this.controller)
      )
    );

    this.router.get(
      "/rater/:raterId/target/:targetId",
      BaseController.handleRequest(
        this.controller.getOneRating.bind(this.controller)
      )
    );

    this.router.get(
      "/:userId/:offset",
      BaseController.handleRequest(
        this.controller.getRating.bind(this.controller)
      )
    );

    this.router.post(
      "/",
      protectedRoutes,
      BaseController.handleRequest(
        this.controller.createRating.bind(this.controller)
      )
    );
    
    this.router.patch(
      "/",
      protectedRoutes,
      BaseController.handleRequest(
        this.controller.updateRating.bind(this.controller)
      )
    );
  }
}
