import { FavoriteController } from "../controllers/FavoriteController";
import { FavoriteService } from "../services/FavoriteService";
import { BaseRoute } from "./BaseRoute";

export class FavoriteRoute extends BaseRoute {
  private controller : FavoriteController;

  constructor() {
    super();
    this.controller = new FavoriteController(FavoriteService.getInstance());
    this.initRoutes();
  }
  
  initRoutes() {
    this.router.get("/", this.controller.getFavorite.bind(this.controller));
    this.router.post("/:productId", this.controller.addFavorite.bind(this.controller));
    this.router.delete("/:productId", this.controller.removeFavorite.bind(this.controller));
  }
}