import { BaseController } from "./BaseController";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";

export class UserController extends BaseController {
  constructor(service: UserService) {
    super(service); // inject service
  }

  async getUsers(req: Request, res: Response) {
    const users = await this.service.getUsers();
    return { user: users };
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
}
