import { BaseController } from "./BaseController";
import { Request, Response, NextFunction } from "express";
import { Pagination } from "../../../shared/src/types/Pagination";
import {
  CreateCategory,
  ProductCategoryTree,
  UpdateCategory,
} from "../../../shared/src/types/Product";

export class CategoryController extends BaseController {
  constructor(service: any) {
    super(service);
  }

  async getCategories(req: Request, res: Response) {
    const categories = await this.service.getCategories();
    return { categories: categories };
  }
  async getProductsByCategory(req: Request, res: Response) {
    const pagination: Pagination = {
      id: parseInt(req.params.id as string),
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sort: (req.query.sort as string) || "",
    };
    const products = await this.service.getProductsByCategory(pagination);
    return products;
  }
  async createCategory(req: Request, res: Response) {
    const category: CreateCategory = {
      name: req.body.name,
      parent_id: req.body.parent_id,
    };
    await this.service.createCategory(category);
  }
  async updateCategory(req: Request, res: Response) {
    const category: UpdateCategory = {
      id: parseInt(req.params.id as string),
      name: req.body.name,
    };
    await this.service.updateCategory(category);
  }
  async deleteCategory(req: Request, res: Response) {
    const category = await this.service.deleteCategory(req.params.id);
    return { category: category };
  }
}
