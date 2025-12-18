import { BaseController } from "./BaseController";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";

export class UserController extends BaseController {
  constructor(service: UserService) {
    super(service); // inject service
  }

  async getUsers(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const users = await this.service.getUsers(page, limit);
    const totalUsers = await this.service.getTotalUser();
    return { users: users, totalUsers };
  }

  async getProfile(req: Request, res: Response) {
    const userId = req.headers["user-id"];
    const profile = await this.service.getProfile(userId);
    return { profile };
  }

  async updateProfile(req: Request, res: Response) {
    const files = req.file;
    const userId = req.headers["user-id"];
    const result = await this.service.updateProfile({
      profile_image: files,
      ...req.body,
      id: userId,
    });
    return { result };
  }
  async deleteUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    const result = await this.service.deleteUser(id);
    return { result };
  }
}
