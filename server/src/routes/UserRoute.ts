import { BaseRoute } from "./BaseRoute";
import { UserController } from "../controllers/UserController";
import { UserService } from "../services/UserService";

export class UserRoute extends BaseRoute {
  private userController: UserController;

  constructor() {
    super();
    // Dependency Injection + Singleton
    this.userController = new UserController(UserService.getInstance());
  }

  initRoutes() {
    this.router.get("/", (req, res) => this.userController.handleGetAllUsers(req, res));
    this.router.get("/:id", (req, res) => this.userController.handleGetUser(req, res));
  }
}





// GET: https:localhost:8000/users 