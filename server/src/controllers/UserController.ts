import { BaseController } from "./BaseController";

export class UserController extends BaseController {
  constructor(service: any) {
    super(service); // inject service
  }

  handleGetUser(req: any, res: any) {
    try {
      const id = Number(req.params.id);
      const user = this.service.getUserById(id);
      if (!user) return this.sendError(res, { message: "User not found" }, 404);
      this.sendSuccess(res, user);
    } catch (err) {
      this.sendError(res, err);
    }
  }

  handleGetAllUsers(req: any, res: any) {
    try {
      const users = this.service.getAllUsers();
      this.sendSuccess(res, users);
    } catch (err) {
      this.sendError(res, err);
    }
  }
}
