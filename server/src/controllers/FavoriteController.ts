import { BaseController } from "./BaseController";
import { Request, Response, NextFunction } from "express";

export class FavoriteController extends BaseController {
  constructor(service: any) {
    super(service);
  }

  async getFavorite(req: Request, res: Response) {
    const userId = req.headers["user-id"];
    const favoriteProducts = await this.service.getFavorite(userId);
    return { favorite_products: favoriteProducts };
  }

  async addFavorite(req: Request, res: Response) {
    const userId = req.headers["user-id"];
    const productId = Number(req.params.productId);

    const result = await this.service.addFavorite(userId, productId);
    return result;
  }

  async removeFavorite(req: Request, res: Response) {
    const userId = req.headers["user-id"];
    const productId = Number(req.params.productId);

    const result = await this.service.removeFavorite(userId, productId);
    return result;
  }
}
