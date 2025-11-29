import {
  Product,
  ProductCategoryTree,
  ProductPagination,
} from "../../../shared/src/types/Product";
import { BaseService } from "./BaseService";
import { Pagination } from "../../../shared/src/types/Pagination";
import { MutationResult } from "../../../shared/src/types/Mutation";


export class CategoryService extends BaseService {
  private static instance: CategoryService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!CategoryService.instance) {
      CategoryService.instance = new CategoryService();
    }
    return CategoryService.instance;
  }

  async getCategories(): Promise<ProductCategoryTree[]> {
    const sql = `SELECT * FROM product.product_categories`;
    const categories: ProductCategoryTree[] = await this.safeQuery(sql);
    return categories;
  }

  
  async getProductsByCategory(
    pagination: Pagination
  ): Promise<ProductPagination> {
    const offset = (pagination.page - 1) * pagination.limit;
    const sortColumn = pagination.sort;

    let sql = `SELECT * FROM product.products as p WHERE p.category_id = $1 ${
      sortColumn != ""
        ? `ORDER BY  p.${
            sortColumn === "time" ? "end_time DESC" : "initial_price ASC"
          } `
        : ""
    } LIMIT $2 OFFSET $3`;

    const products: Product[] = await this.safeQuery(sql, [
      pagination.id,
      pagination.limit,
      offset,
    ]);

    sql = ` SELECT COUNT(*) AS total
    FROM product.products
    WHERE category_id = $1`;
    const dataTotal: any = await this.safeQuery(sql, [pagination.id]);
    const total = dataTotal[0].total;

    return {
      page: pagination.page,
      limit: pagination.limit,
      total,
      products: products,
    };
  }
  async createCategory(category: ProductCategoryTree): Promise<MutationResult> {
    const sql = `INSERT INTO product.product_categories (slug, parent_id, name, created_at, updated_at)
        VALUES
  ($1, $2, $3, NOW(), NOW())`;
    await this.safeQuery(sql, [
      category.slug,
      category.parent_id,
      category.name,
    ]);
    return {
      success: true,
    };
  }
  async updateCategory(category: ProductCategoryTree): Promise<MutationResult> {
    const sql = `UPDATE product.product_categories SET slug = $1, name = $2, updated_at = NOW() WHERE id = $3`;
    await this.safeQuery(sql, [category.slug, category.name, category.id]);
    return {
      success: true,
    };
  }
  async deleteCategory(id: number): Promise<MutationResult> {
    const sql = `DELETE FROM product.product_categories WHERE id = $1 RETURNING *`;
    await this.safeQuery(sql, [id]);
    return {
      success: true,
    };
  }
}
