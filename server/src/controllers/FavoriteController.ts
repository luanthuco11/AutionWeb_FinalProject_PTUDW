import { R2Service } from "../services/R2Service";
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

  async uploadTest(req: Request, res: Response) {
    const file = req.file; // Multer sẽ gán vào req.file
    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const r2 = R2Service.getInstance();
    const result = await r2.uploadToR2(
      file.buffer,
      file.originalname,
      file.mimetype,
      "product"
    );
    return result;
  }

  async deleteTest(req: Request, res: Response) {
    const { imagePath } = req.body;
    const r2 = R2Service.getInstance();
    const result = await r2.deleteFromR2(imagePath);
    return result;
  }
}
