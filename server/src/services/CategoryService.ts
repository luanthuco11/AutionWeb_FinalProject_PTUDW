import {
  CreateCategory,
  Product,
  ProductCategoryTree,
  ProductPagination,
  UpdateCategory,
} from "../../../shared/src/types/Product";
import { BaseService } from "./BaseService";
import { Pagination } from "../../../shared/src/types/Pagination";
import { MutationResult } from "../../../shared/src/types/Mutation";
import { createSlugUnique } from "../utils";
import { ProductPreview } from "../../../shared/src/types/Product";
import { ShortUser } from "../../../shared/src/types";

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
    const sql = `
    SELECT pp.id, 
      pp.slug, 
      pp.name ,
      COALESCE(
      json_agg(
        json_build_object(
          'id', pc.id,
          'slug', pc.slug,
          'parent_id', pc.parent_id,
          'name', pc.name
        )
      ) FILTER (WHERE pc.id IS NOT NULL),
      '[]'
  ) as children FROM product.product_categories as pp
    LEFT JOIN product.product_categories as pc 
    ON  pc.parent_id = pp.id
      WHERE pp.parent_id IS NULL 
      GROUP BY pp.id
    ORDER BY pp.name`;
    const categories: ProductCategoryTree[] = await this.safeQuery(sql);
    return categories;
  }

  async getCategoryDetailById(id: number): Promise<ProductCategoryTree | null> {
    const sql = `
    SELECT pp.id, 
      pp.slug, 
      pp.name ,
      COALESCE(
      json_agg(
        json_build_object(
          'id', pc.id,
          'slug', pc.slug,
          'parent_id', pc.parent_id,
          'name', pc.name
        )
      ) FILTER (WHERE pc.id IS NOT NULL),
      '[]'
    ) as children FROM product.product_categories as pp
      LEFT JOIN product.product_categories as pc ON pc.parent_id = pp.id
      WHERE pp.id = $1
      GROUP BY pp.id`;

    const category = (
      await this.safeQuery<ProductCategoryTree>(sql, [id])
    )?.[0];
    return category || null;
  }

  async createCategory(category: CreateCategory): Promise<MutationResult> {
    const slug = createSlugUnique(category.name);
    const sql = `INSERT INTO product.product_categories (slug, parent_id, name, created_at, updated_at)
        VALUES
  ($1, $2, $3, NOW(), NOW())`;
    await this.safeQuery(sql, [slug, category.parent_id, category.name]);
    return {
      success: true,
    };
  }
  async updateCategory(category: UpdateCategory): Promise<MutationResult> {
    const slug = createSlugUnique(category.name);
    const sql = `UPDATE product.product_categories SET slug = $1, name = $2, updated_at = NOW() WHERE id = $3`;
    await this.safeQuery(sql, [slug, category.name, category.id]);
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
  // ========= TRI ============

  async getTotalProductsByCategory(slug: string): Promise<number | undefined> {
    let sql = `
    SELECT COUNT(*) AS total
    FROM product.products pp 
    JOIN product.product_categories pc on pc.id = pp.category_id
    WHERE pc.slug = $1;
    `;
    let totalProducts: { total: number }[] = await this.safeQuery(sql, [slug]);
    return totalProducts[0]?.total;
  }

  async getCountProductsByCategory(): Promise<
    { category_id: number; total: number }[] 
  > {
  const sql = `
      WITH RECURSIVE category_tree AS (
      SELECT id AS root_id, id AS category_id
      FROM product.product_categories

      UNION ALL

      SELECT ct.root_id, pc.id
      FROM category_tree ct
      JOIN product.product_categories pc
        ON pc.parent_id = ct.category_id
    )
    SELECT
      ct.root_id AS category_id,
      COALESCE(COUNT(p.id), 0) AS total
    FROM category_tree ct
    LEFT JOIN product.products p
      ON p.category_id = ct.category_id
    GROUP BY ct.root_id
    ORDER BY ct.root_id;
  `;

  return this.safeQuery<{ category_id: number; total: number }>(sql);
}


  async getCategoryNameBySlug(slug: string): Promise<string | undefined> {
    let sql = `
    SELECT pc.name
    FROM product.product_categories pc
    WHERE pc.slug = $1;
    `;
    let totalProducts: { name: string }[] = await this.safeQuery(sql, [slug]);
    return totalProducts[0]?.name;
  }

  async getTopBidder(productId: number): Promise<ShortUser | null> {
    const sql = `  
      SELECT u.id, u.name, u.profile_img
      FROM auction.bid_logs bl 
      JOIN admin.users u on bl.user_id = u.id 
      WHERE bl.product_id = $1
      ORDER BY bl.price DESC 
      LIMIT 1 
      `;
    const bidder = await this.safeQuery<ShortUser>(sql, [productId]);
    return bidder[0] ? bidder[0] : null;
  }

  async getBidCount(productId: number): Promise<number | undefined> {
    const sql = `  
    SELECT COUNT(DISTINCT(user_id)) AS bid_count
    FROM auction.bid_logs bl 
    WHERE bl.product_id = $1
    `;
    const bidCount: { bid_count: number }[] = await this.safeQuery(sql, [
      productId,
    ]);
    // return Number(bidCount[0]?.bid_count ?? 0);
    return bidCount[0]?.bid_count;
  }

  async getCurrentPrice(productId: number): Promise<number | undefined | null> {
    const sql = `  
    SELECT MAX(bl.price) AS current_price
    FROM auction.bid_logs bl 
    WHERE bl.product_id = $1
    `;
    const currentPrice: { current_price: number | null }[] =
      await this.safeQuery(sql, [productId]);
    // return currentPrice[0]?.current_price
    //   ? Number(currentPrice[0].current_price)
    //   : null;
    return currentPrice[0]?.current_price;
  }

  async getProductPreviewType(productId: number): Promise<ProductPreview> {
    const result = await Promise.all([
      this.getTopBidder(productId),
      this.getBidCount(productId),
      this.getCurrentPrice(productId),
    ]);

    const top_bidder: any = result[0];
    const bid_count = result[1];
    let current_price = result[2];
    const sql = `
    SELECT 
      p.id, 
      p.slug,
      p.category_id,
      p.main_image,
      p.name,
      p.buy_now_price,
      p.end_time,
      p.auto_extend,
      p.created_at,
      p.initial_price,
      u.email as seller_email,
      c.name as category_name
    FROM product.products p 
    JOIN admin.users u on u.id = p.seller_id 
    JOIN product.product_categories c on c.id = p.category_id
    WHERE p.id = $1
    `;

    let products: any = await this.safeQuery<ProductPreview>(sql, [productId]);
    // products[0].id = products[0].id ? Number(products[0].id) : null;
    // products[0].initial_price = products[0].initial_price
    //   ? Number(products[0].initial_price)
    //   : null;
    // products[0].buy_now_price = products[0].buy_now_price
    //   ? Number(products[0].buy_now_price)
    //   : null;
    // products[0].price_increment = products[0].price_increment
    //   ? Number(products[0].price_increment)
    //   : null;
    if (current_price == null) {
      current_price = products[0].initial_price;
    }
    const { seller_email, category_name, ...rest } = products[0];

    products = {
      ...rest,
      top_bidder_name: top_bidder ? top_bidder.name : null,
      current_price: current_price,
      bid_count: bid_count,
      seller: {
        email: seller_email,
      },
      category: {
        name: category_name,
      },
    };

    return products;
  }

  async getProductsByCategoryId(
    pagination: Pagination
  ): Promise<ProductPagination> {
    const offset = (pagination.page - 1) * pagination.limit;
    const sortColumn = pagination.sort;

    let sql = `
      SELECT pp.id, GREATEST(COALESCE(bl.current_price, 0), pp.initial_price) AS price, pp.end_time
      FROM product.products pp
      JOIN product.product_categories pc on pc.id = pp.category_id
      LEFT JOIN (
          SELECT 
            bl.product_id, 
            MAX(bl.price) AS current_price
          FROM auction.bid_logs bl 
          GROUP BY bl.product_id
      ) bl ON bl.product_id = pp.id
      WHERE pc.id = $1
      `;

    const params: any[] = [pagination.id];
    if (pagination.sort) {
      if (pagination.sort == "ascending-price") {
        sql += `ORDER BY price ASC \n`;
      } else if (pagination.sort == "descending-price") {
        sql += `ORDER BY price DESC \n`;
      } else if (pagination.sort == "expiring-soon") {
        sql += "ORDER BY end_time ASC \n";
      }
    }
    if (pagination.limit) {
      sql += `LIMIT $2 \n`;
      params.push(pagination.limit);
    }
    if (pagination.page && pagination.limit) {
      const offset = (pagination.page - 1) * pagination.limit;
      sql += "OFFSET $3 \n";
      params.push(offset);
    }

    const products = await this.safeQuery<ProductPreview>(sql, params);

    const newProducts = await Promise.all(
      products.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType;
      })
    );

    sql = ` SELECT COUNT(*) AS total
    FROM product.products
    WHERE category_id = $1`;
    const dataTotal: any = await this.safeQuery(sql, [pagination.id]);
    const total = dataTotal[0].total;

    return {
      page: pagination.page,
      limit: pagination.limit,
      total,
      products: newProducts,
    };
  }

  async getProductsByCategorySlug(
    limit: number,
    page: number,
    slug: string,
    sort: string
  ): Promise<ProductPreview[]> {
    let sql = `
      SELECT pp.id, GREATEST(COALESCE(bl.current_price, 0), pp.initial_price) AS price, pp.end_time
      FROM product.products pp
      JOIN product.product_categories pc on pc.id = pp.category_id
      LEFT JOIN (
          SELECT 
            bl.product_id, 
            MAX(bl.price) AS current_price
          FROM auction.bid_logs bl 
          GROUP BY bl.product_id
      ) bl ON bl.product_id = pp.id
      WHERE pc.slug = $1
      `;

    const params: any[] = [slug];
    if (sort) {
      if (sort == "ascending-price") {
        sql += `ORDER BY price ASC \n`;
      } else if (sort == "descending-price") {
        sql += `ORDER BY price DESC \n`;
      } else if (sort == "expiring-soon") {
        sql += "ORDER BY end_time ASC \n";
      }
    }
    if (limit) {
      sql += `LIMIT $2 \n`;
      params.push(limit);
    }
    if (page && limit) {
      const offset = (page - 1) * limit;
      sql += "OFFSET $3 \n";
      params.push(offset);
      console.log("vo limit");
    }

    const products = await this.safeQuery<ProductPreview>(sql, params);

    const newProducts = await Promise.all(
      products.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType;
      })
    );
    console.log("page:", page);

    return newProducts;
  }
}
