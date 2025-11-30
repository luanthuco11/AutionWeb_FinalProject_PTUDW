import { BaseController } from "../controllers/BaseController";
import { BaseRoute } from "./BaseRoute";
import { RatingController } from "../controllers/RatingController";
import { RatingService } from "../services/RatingService";

export class RatingRoute extends BaseRoute {
    private controller: RatingController
    constructor() {
        super();
        this.controller = new RatingController(RatingService.getInstance());
        this.initRoutes();
    }

    initRoutes() {
        this.router.get(
            "/:userId", 
            BaseController.handleRequest(
                this.controller.getRating.bind(
                    this.controller
                )));

        this.router.post("/", 
            BaseController.handleRequest(
                this.controller.createRating.bind(
                    this.controller
                )));
    }
}