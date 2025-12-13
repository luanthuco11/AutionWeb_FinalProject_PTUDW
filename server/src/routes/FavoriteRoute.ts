import { FavoriteController } from "../controllers/FavoriteController";
import { FavoriteService } from "../services/FavoriteService";
import { BaseRoute } from "./BaseRoute";
import { BaseController } from "../controllers/BaseController";
import multer from "multer";
import { protectedRoutes } from "../middlewares/authMiddleware";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export class FavoriteRoute extends BaseRoute {
  private controller: FavoriteController;

  constructor() {
    super();
    this.controller = new FavoriteController(FavoriteService.getInstance());
    this.initRoutes();
  }
  initRoutes() {
    this.router.use(protectedRoutes);
    this.router.get(
      "/",
      BaseController.handleRequest(
        this.controller.getFavorite.bind(this.controller)
      )
    );
    this.router.get(
      "/all",
      BaseController.handleRequest(
        this.controller.getAllFavorite.bind(this.controller)
      )
    );
    this.router.post(
      "/upload-test",
      upload.single("image"),
      BaseController.handleRequest(
        this.controller.uploadTest.bind(this.controller)
      )
    );
    this.router.delete(
      "/delete-test",
      BaseController.handleRequest(
        this.controller.deleteTest.bind(this.controller)
      )
    );
    this.router.post(
      "/:productId",
      BaseController.handleRequest(
        this.controller.addFavorite.bind(this.controller)
      )
    );
    this.router.delete(
      "/:productId",
      BaseController.handleRequest(
        this.controller.removeFavorite.bind(this.controller)
      )
    );
  }
}
