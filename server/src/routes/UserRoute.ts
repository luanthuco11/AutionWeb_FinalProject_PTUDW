import { BaseRoute } from "./BaseRoute";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { BaseController } from "../controllers/BaseController";
export class UserRoute extends BaseRoute {
    private controller: UserController;
    constructor() {
        super();
        this.controller = new UserController(UserService.getInstance());
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", BaseController.handleRequest(this.controller.getUsers.bind(this.controller)));
        this.router.get("/profile", BaseController.handleRequest(this.controller.getProfile.bind(this.controller)));
        this.router.patch("/profile", BaseController.handleRequest(this.controller.updateProfile.bind(this.controller)))
    }
}
