import { BaseRoute } from "./BaseRoute";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";
import { BaseController } from "../controllers/BaseController";
export class UserRoute extends BaseRoute {
    private userController: UserController;
    constructor() {
        super();
        this.userController = new UserController(UserService.getInstance());
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", BaseController.handleRequest(this.userController.getUsers.bind(this.userController)));
        this.router.get("/profile/:id", BaseController.handleRequest(this.userController.getProfile.bind(this.userController)));
        this.router.patch("/profile", BaseController.handleRequest(this.userController.updateProfile.bind(this.userController)))
    }
}