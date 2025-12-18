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
  async getCountProduct(req: Request, res: Response) {
    const result = await this.service.getCountProductsByCategory();
    return { result: result };
  }
  async getProductsByCategoryId(req: Request, res: Response) {
    const pagination: Pagination = {
      id: Number(req.params.id),
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      sort: (req.query.sort as string) || "",
    };
    const products = await this.service.getProductsByCategoryId(pagination);
    return products;
  }

  async getCategoryDetailById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const category = await this.service.getCategoryDetailById(id);
    return { category: category };
  }

  async getProductsByCategorySlug(req: Request, res: Response) {
    console.log(req.query);
    const page = Number(req.query.page) || null;
    const limit = Number(req.query.limit) || 5;
    const sort = req.query.sort;
    const slug = req.params.slug;
    const products = await this.service.getProductsByCategorySlug(
      limit,
      page,
      slug,
      sort
    );

    const totalProducts = await this.service.getTotalProductsByCategory(slug);
    const categoryName = await this.service.getCategoryNameBySlug(slug);
    return {
      products: products,
      totalProducts: totalProducts,
      categoryName: categoryName,
    };
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
