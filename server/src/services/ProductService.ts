import {
  CategoryProduct,
  BiddingProduct,
  CreateAnswer,
  CreateProduct,
  CreateQuestion,
  Product,
  ProductPreview,
  ProductQuestion,
  SearchProduct,
  WinningProduct,
  ProductQuestionPagination,
} from "./../../../shared/src/types/Product";
import { BaseService } from "./BaseService";
import { ShortUser } from "../../../shared/src/types";

import { createSlugUnique } from "../utils";
import { R2Service } from "./R2Service";
import { Pagination } from "../../../shared/src/types/Pagination";
import { PoolClient } from "pg";

export class ProductService extends BaseService {
  private static instance: ProductService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  async getTopBidder(productId: number): Promise<ShortUser | null> {
    const sql = `  
    SELECT u.id, u.name, u.profile_img
    FROM admin.users u
    JOIN product.products p ON p.top_bidder_id = u.id
    WHERE p.id = $1
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
    return bidCount[0]?.bid_count ?? 0;
  }

  async getCurrentPrice(productId: number): Promise<number | undefined | null> {
    const sql = `  
    SELECT MAX(bl.price) AS current_price
    FROM product.products p
    JOIN auction.bid_logs bl ON bl.product_id = p.id AND bl.user_id = p.top_bidder_id 
    WHERE bl.product_id = $1
    `;
    const currentPrice: { current_price: number | null }[] =
      await this.safeQuery(sql, [productId]);
    return currentPrice[0]?.current_price;
  }

  async getStatus(productId: number): Promise<string> {
    const sql = `
    SELECT 
      ao.status
    FROM auction.orders ao
    WHERE ao.product_id = $1
    `;
    const status: { status: string }[] = await this.safeQuery(sql, [productId]);
    return status[0]?.status ?? "available";
  }

  async getProductType(productId: number): Promise<Product> {
    const result = await Promise.all([
      this.getTopBidder(productId),
      this.getBidCount(productId),
      this.getCurrentPrice(productId),
      this.getStatus(productId),
    ]);
    const top_bidder = result[0];
    const bid_count = result[1];
    let current_price = result[2];
    const status = result[3];
    const sql = `
    SELECT 
      p.id, 
      p.slug,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'profile_img', u.profile_img,
        'positive_points', u.positive_points,
        'negative_points', u.negative_points
      ) AS seller,
      p.category_id,
      p.main_image,
      p.extra_images,
      p.name,
      p.initial_price,
      p.buy_now_price,
      p.end_time,
      p.description,
      p.auto_extend,
      p.price_increment,
      p.created_at,
      p.updated_at,
      c.name as category_name
    FROM product.products p 
    JOIN admin.users u on u.id = p.seller_id 
    JOIN product.product_categories c on c.id = p.category_id
    WHERE p.id = $1
    `;

    let products: any = await this.safeQuery<Product>(sql, [productId]);
    if (current_price == null) {
      current_price = products[0].initial_price;
    }

    products = {
      ...products[0],
      top_bidder: top_bidder,
      current_price: current_price,
      bid_count: bid_count,
      status: status,
    };
    return products;
  }

  async getProductPreviewType(productId: number): Promise<ProductPreview> {
    const result = await Promise.all([
      this.getTopBidder(productId),
      this.getBidCount(productId),
      this.getCurrentPrice(productId),
      this.getStatus(productId),
    ]);

    const top_bidder: any = result[0];
    const bid_count = result[1];
    let current_price = result[2];
    let status: string = result[3];
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
    const { seller_email, category_name, ...rest } = products[0];
    products = {
      ...rest,
      top_bidder_name: top_bidder ? top_bidder.name : null,
      current_price: current_price ? current_price : products[0].initial_price,
      bid_count: bid_count,
      status: status,
      seller: {
        email: seller_email,
      },
      category: {
        name: category_name,
      },
    };

    return products;
  }

  async getTotalProductsBySearch(query: string): Promise<number | undefined> {
    let sql = `
       SELECT COUNT(*) as total
       FROM product.products pp
       WHERE to_tsvector('simple', unaccent(pp.name))
             @@ websearch_to_tsquery('simple', unaccent($1))
    `;
    const params: any[] = [query];

    let totalProducts: { total: number }[] = await this.safeQuery(sql, params);

    return totalProducts[0]?.total;
  }

  async getProductsBySearch(
    query: string,
    limit: number,
    page: number
  ): Promise<ProductPreview[]> {
    let sql = `
       SELECT pp.id
       FROM product.products pp
       WHERE to_tsvector('simple', unaccent(pp.name))
             @@ websearch_to_tsquery('simple', unaccent($1))
    `;
    const params: any[] = [query];
    if (limit) {
      sql += `LIMIT $2 \n`;
      params.push(limit);
    }
    if (page && limit) {
      const offset = (page - 1) * limit;
      sql += "OFFSET $3 \n";
      params.push(offset);
    }

    let products: ProductPreview[] = await this.safeQuery(sql, params);

    const newProducts = await Promise.all(
      products.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType;
      })
    );

    return newProducts;
  }

  async getTotalProducts(): Promise<number | undefined> {
    let sql = `
    SELECT COUNT(*) AS total
    FROM product.products pp
    `;
    let totalProducts: { total: number }[] = await this.safeQuery(sql);
    return totalProducts[0]?.total;
  }

  async getTotalProductsByCategory(slug: string): Promise<number | undefined> {
    let sql = `
    SELECT COUNT(*) AS total
    FROM product.products
    WHERE pp.category_id = $1;
    `;
    let totalProducts: { total: number }[] = await this.safeQuery(sql, [slug]);
    return totalProducts[0]?.total;
  }

  async getTotalBiddingProducts(): Promise<number | undefined> {
    let sql = `
    SELECT COUNT(DISTINCT(bl.product_id)) AS total
    FROM product.products AS products 
    JOIN auction.bid_logs  AS bl ON bl.product_id = products.id 
    `;
    let totalProducts: { total: number }[] = await this.safeQuery(sql);
    return totalProducts[0]?.total;
  }

  async getTopEndingSoonProducts(
    limit?: number,
    page?: number
  ): Promise<ProductPreview[]> {
    let sql = `
        SELECT id
        FROM product.products
        ORDER BY product.products.end_time ASC
    `;

    const params: any[] = [];
    if (limit) {
      sql += `LIMIT $1 \n`;
      params.push(limit);
    }
    if (page && limit) {
      const offset = (page - 1) * limit;
      sql += "OFFSET $2 \n";
      params.push(offset);
    }

    const endTimeProducts = await this.safeQuery<ProductPreview>(sql, params);

    const newEndtimeProducts = await Promise.all(
      endTimeProducts.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType;
      })
    );
    return newEndtimeProducts;
  }

  async getProductsByCategory(
    limit: number,
    page: number,
    slug: string,
    sort: string
  ): Promise<ProductPreview[]> {
    let sql = `
    SELECT pp.id, GREATEST(COALESCE(bl.current_price, 0), pp.initial_price) AS price, pp.end_time
    FROM product.products pp
    LEFT JOIN (
        SELECT 
          bl.product_id, 
          MAX(bl.price) AS current_price
        FROM auction.bid_logs bl 
        GROUP BY bl.product_id
    ) bl ON bl.product_id = pp.id
    WHERE pp.category_id = $1
    `;

    const params: any[] = [slug];
    if (limit) {
      sql += `LIMIT $2 \n`;
      params.push(limit);
    }
    if (page && limit) {
      const offset = (page - 1) * limit;
      sql += "OFFSET $3 \n";
      params.push(offset);
    }
    if (sort) {
      if (sort == "ascending-price") {
        sql += `ORDER BY price ASC`;
        params.push(sort);
      } else if (sort == "descending-price") {
        sql += `ORDER BY price DESC`;
        params.push(sort);
      } else if (sort == "expiring-soon") {
        sql += "ORDER BY end_time ASC";
        params.push(sort);
      }
    }

    const products = await this.safeQuery<ProductPreview>(sql, params);

    const newProducts = await Promise.all(
      products.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType;
      })
    );
    return newProducts;
  }

  async getTopBiddingProducts(
    limit?: number,
    page?: number
  ): Promise<ProductPreview[]> {
    let sql = `
  
  SELECT products.id
  FROM product.products AS products 
  JOIN auction.bid_logs  AS bid_logs ON bid_logs.product_id = products.id 
  GROUP BY products.id 
  ORDER BY COUNT(DISTINCT bid_logs.user_id) DESC
  `;
    const params: any[] = [];
    if (limit) {
      sql += `LIMIT $1 \n`;
      params.push(limit);
    }

    if (page && limit) {
      const offset = (page - 1) * limit;
      sql += "OFFSET $2 \n";
      params.push(offset);
    }

    const topBiddingProducts = await this.safeQuery<ProductPreview>(
      sql,
      params
    );

    const newTopBiddingProducts = await Promise.all(
      topBiddingProducts.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType;
      })
    );

    return newTopBiddingProducts;
  }

  // Lấy id nếu có của sp có đấu giá hoặc initial price
  async getTopPriceProducts(
    limit?: number,
    page?: number
  ): Promise<ProductPreview[]> {
    let sql = `
   SELECT pp.id
  FROM product.products pp 
  LEFT JOIN (
     SELECT bl.product_id, MAX(bl.price) as current_price
     FROM auction.bid_logs bl 
     GROUP BY bl.product_id
  ) bl on bl.product_id = pp.id 
  ORDER BY GREATEST(COALESCE(bl.current_price, 0), pp.initial_price) DESC 
    `;
    let params: any[] = [];
    if (limit) {
      sql += `LIMIT $1 \n`;
      params.push(limit);
    }

    if (page && limit) {
      const offset = (page - 1) * limit;
      sql += "OFFSET $2 \n";
      params.push(offset);
    }

    const topPriceProducts = await this.safeQuery<ProductPreview>(sql, params);

    const newTopPriceProducts = await Promise.all(
      topPriceProducts.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType;
      })
    );
    return newTopPriceProducts;
  }

  async getProductById(productId: number): Promise<Product | undefined> {
    const sql = `
    SELECT id
    FROM product.products 
    WHERE id = $1
    `;
    const product = await this.safeQuery<Product>(sql, [productId]);

    const newProduct = await Promise.all(
      product.map(async (item: any) => {
        const productType = this.getProductType(item.id);
        return productType;
      })
    );
    return newProduct[0];
  }
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const sql = `
    SELECT id
    FROM product.products 
    WHERE slug = $1
    `;
    const product = await this.safeQuery<Product>(sql, [slug]);

    const newProduct = await Promise.all(
      product.map(async (item: any) => {
        const productType = this.getProductType(item.id);
        return productType;
      })
    );

    return newProduct[0];
  }
  async getSoldProducts(): Promise<ProductPreview[] | undefined> {
    const sql = `
   SELECT o.product_id as id
  FROM auction.orders o 
  WHERE  o.status = 'completed'
    `;

    const product = await this.safeQuery<ProductPreview>(sql);

    const soldProduct = await Promise.all(
      product.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType;
      })
    );
    return soldProduct;
  }

  async getCategoryProductList(): Promise<CategoryProduct[]> {
    let sql = `
SELECT 
  pc.id as category_id,
  pc.slug as category_slug,
  pc.name as category_name,
  (
      SELECT json_agg(
        json_build_object(
          'id', pp.id,
          'slug', pp.slug,
          'category_id', pp.category_id,
          'main_image', pp.main_image,
          'name', pp.name,
          'current_price', pp.current_price,
          'buy_now_price', pp.buy_now_price,
          'bid_count', pp.bid_count,
          'end_time', pp.end_time,
          'auto_extend', pp.auto_extend,
          'created_at', pp.created_at,
          'initial_price', pp.initial_price,
          'status', pp.status,
          'top_bidder_name', pp.top_bidder_name

        )
      ) as products
      FROM (
            SELECT *, 
            (
              SELECT COALESCE(MAX(bl.price), pp.initial_price)
              FROM auction.bid_logs bl
              WHERE bl.product_id = pp.id
            ) as current_price,

            (
              SELECT COALESCE(COUNT(DISTINCT(bl.user_id)), 0)
              FROM auction.bid_logs bl 
              WHERE bl.product_id = pp.id
            ) as bid_count,

           (
             SELECT u.name as bidder
             FROM auction.bid_logs bl 
             JOIN admin.users u on bl.user_id = u.id 
             WHERE bl.product_id = pp.id 
             ORDER BY bl.price DESC 
             LIMIT 1 
            ) as top_bidder_name, 

            (
              SELECT COALESCE(MAX(ao.status), 'available') 
              FROM auction.orders ao
              WHERE ao.product_id = pp.id 
              ) as status

            FROM product.products pp 
            WHERE pp.category_id = pc.id 
            ORDER by pp.id 
            LIMIT 5
          ) pp 
  )
FROM product.product_categories pc 
WHERE pc.parent_id is not null

  `;

    const categoryProduct: CategoryProduct[] = await this.safeQuery(sql);
    return categoryProduct;
  }

  async getProductsBySearchSuggestion(
    query: string,
    limit: number
  ): Promise<SearchProduct[] | undefined> {
    let params: any[] = [query];
    let sql = `
   SELECT 
    pp.id,
    pp.name,
    pp.main_image,
    pp.slug,
    (
    SELECT (GREATEST(MAX(bl.price), pp.initial_price) )  as current_price
    FROM auction.bid_logs bl 
    WHERE bl.product_id = pp.id
    )
  FROM product.products pp
  WHERE to_tsvector('simple', unaccent(pp.name))
        @@ websearch_to_tsquery('simple', unaccent($1))
  ORDER BY ts_rank(
      to_tsvector('simple', unaccent(pp.name)),
      websearch_to_tsquery('simple', unaccent($1))
    ) DESC
    `;

    if (limit) {
      sql += "LIMIT $2";
      params.push(limit);
    }

    const product: SearchProduct[] = await this.safeQuery(sql, params);

    return product;
  }

  async createProduct(
    payload: CreateProduct,
    mainImage: Express.Multer.File,
    extraImages: Express.Multer.File[],
    userId: number
  ) {
    const r2 = R2Service.getInstance();
    const [mainImageUrl, ...extraImageUrls] = await r2.uploadFilesToR2(
      [mainImage, ...extraImages],
      "product"
    ); // Upload lên R2 và lấy link ảnh R2

    const slug = createSlugUnique(payload.name);
    const sql = `
    INSERT INTO product.products(
    slug, 
    seller_id,
    category_id, 
    main_image, 
    extra_images, 
    name, 
    initial_price, 
    buy_now_price, 
    end_time, 
    description, 
    auto_extend, 
    price_increment,
    created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
    RETURNING * 
    `;
    const newProduct = await this.safeQuery(sql, [
      slug,
      userId,
      payload.category_id,
      mainImageUrl,
      extraImageUrls,
      payload.name,
      payload.initial_price,
      payload.buy_now_price,
      payload.end_time,
      payload.description,
      payload.auto_extend,
      payload.price_increment,
    ]);
    return newProduct;
  }

  async updateProductDescription(productId: number, description: string) {
    const sql = `
    UPDATE product.products
    SET description = 
        CASE
            WHEN description IS NULL THEN $1
            ELSE description || E'\n\n' || $1
        END,
        updated_at = NOW()
    WHERE id = $2
    RETURNING *;
    `;
    const updateProduct = await this.safeQuery(sql, [description, productId]);
    return updateProduct;
  }
  async deleteProductById(productId: number) {
    const params = [productId];

    const sql =
      "DELETE FROM product.products WHERE id = $1 RETURNING MAIN_IMAGE, EXTRA_IMAGES";
    const result = await this.safeQuery<{
      main_image: string;
      extra_images: string[];
    }>(sql, [productId]);
    if (result.length == 0) {
      throw new Error(`Không thể tìm thấy sản phẩm có id = ${productId}`);
    }
    const { main_image, extra_images = [] } = result[0]!;
    const r2 = R2Service.getInstance();
    await r2.deleteFilesFromR2([main_image, ...extra_images]);
  }

  async getQuestions(productId: number): Promise<ProductQuestion[]> {
    const sql = `
    SELECT 
          pq.id, 
          pq.product_id, 
          json_build_object(
              'id', u.id,
              'name', u.name,
              'profile_img', u.profile_img
          ) AS user,
          pq.comment,
          pq.created_at,
          (
            SELECT 
                json_build_object(
                    'id', pa.id,
                    'comment', pa.comment,
                    'question_id', pa.question_id,
                    'user', json_build_object(
                        'id', u2.id,
                        'name', u2.name,
                        'profile_img', u2.profile_img
                    )
                )
            FROM feedback.product_answers pa
            JOIN admin.users u2 ON u2.id = pa.user_id
            WHERE pa.question_id = pq.id
          ) AS answer
      FROM feedback.product_questions pq
      JOIN admin.users u ON u.id = pq.user_id
      WHERE pq.product_id = $1;
      ORDER BY pq.created_at desc
    `;
    const questions = await this.safeQuery<ProductQuestion>(sql, [productId]);

    return questions;
  }

  async getQuestionsByPage(
    productId: number,
    page: number,
    limit: number
  ): Promise<ProductQuestionPagination> {
    const sql = `
    SELECT 
          pq.id, 
          pq.product_id, 
          json_build_object(
              'id', u.id,
              'name', u.name,
              'profile_img', u.profile_img
          ) AS user,
          pq.comment,
          pq.created_at,
          (
            SELECT 
                json_build_object(
                    'id', pa.id,
                    'comment', pa.comment,
                    'question_id', pa.question_id,
                    'user', json_build_object(
                        'id', u2.id,
                        'name', u2.name,
                        'profile_img', u2.profile_img
                    )
                )
            FROM feedback.product_answers pa
            JOIN admin.users u2 ON u2.id = pa.user_id
            WHERE pa.question_id = pq.id
          ) AS answer,
          COUNT(*) OVER() AS total_count
      FROM feedback.product_questions pq
      JOIN admin.users u ON u.id = pq.user_id
      WHERE pq.product_id = $1
      ORDER BY pq.created_at desc
      OFFSET $2 LIMIT $3;
    `;

    const offset = (page - 1) * limit;
    const questions = await this.safeQuery<
      ProductQuestion & { total_count: number }
    >(sql, [productId, offset, limit]);

    return {
      page: page,
      limit: limit,
      total: questions?.[0]?.total_count || 0,
      questions: questions,
    };
  }

  async createQuestion(
    createQuestion: CreateQuestion,
    userId: number,
    productId: number
  ) {
    const sql = `
    INSERT INTO feedback.product_questions(
    product_id, 
    user_id,
    comment,
    created_at
    )
    VALUES ($1, $2, $3, NOW())
    RETURNING *
    `;
    const question = await this.safeQuery(sql, [
      productId,
      userId,
      createQuestion.comment,
    ]);
    return question[0];
  }

  async createAnswer(
    createAnswer: CreateAnswer,
    userId: number,
    questionId: number
  ) {
    const sql = `
    INSERT INTO feedback.product_answers(
    question_id,
    user_id,
    comment, 
    created_at
    )
    VALUES ($1, $2, $3, NOW())
    RETURNING *
    `;
    const answer = await this.safeQuery(sql, [
      questionId,
      userId,
      createAnswer.comment,
    ]);
    return answer[0];
  }

  async updateProductExtend(productId: number, auto_extend: boolean) {
    const sql = `
    UPDATE product.products
    SET auto_extend = $1, 
        updated = NOW()
    WHERE id = $2
    RETURNING * 
    `;

    const productExtend = await this.safeQuery(sql, [auto_extend, productId]);
    return productExtend;
  }

  async getTotalWinningProductsByUser(
    userId: number
  ): Promise<number | undefined> {
    const status = "completed";
    const sql = `
    SELECT COUNT (*) as total
     FROM auction.orders o  
     WHERE o.winner_id = $1 AND o.status = $2
          `;
    const totalProducts: { total: number }[] = await this.safeQuery(sql, [
      userId,
      status,
    ]);

    return totalProducts[0]?.total;
  }

  async getWinningProducts(
    userId: number,
    limit: number,
    page: number
  ): Promise<WinningProduct[]> {
    const status = "completed";
    const params: any[] = [userId, status];
    let sql = `
    SELECT  p.id, p.name, p.slug, p.main_image
                FROM auction.orders as o
                JOIN product.products as p ON p.id = o.product_id
                WHERE o.winner_id =$1 AND o.status = $2
                `;

    if (limit) {
      sql += `LIMIT $3 \n`;
      params.push(limit);
    }
    if (page && limit) {
      const offset = (page - 1) * limit;
      sql += "OFFSET $4 \n";
      params.push(offset);
    }
    const productsNotPrice: WinningProduct[] = await this.safeQuery(
      sql,
      params
    );

    const productHavePrice = await Promise.all(
      productsNotPrice.map(async (p) => {
        const current_price = await this.getCurrentPrice(p.id);
        if (current_price === undefined) {
          return { ...p, current_price: null };
        }
        return { ...p, current_price };
      })
    );
    return productHavePrice;
  }

  async getTotalBiddingProductsByUser(
    userId: number
  ): Promise<number | undefined> {
    const sql = `
    SELECT COUNT (DISTINCT bl.product_id) as total
     FROM auction.bid_logs bl 
     WHERE bl.user_id = $1
          `;
    const totalProducts: { total: number }[] = await this.safeQuery(sql, [
      userId,
    ]);

    return totalProducts[0]?.total;
  }

  async getBiddingProducts(
    userId: number,
    limit: number,
    page: number
  ): Promise<BiddingProduct[]> {
    const params: any[] = [userId];
    let sql = `
    SELECT DISTINCT p.id, p.name, p.slug, p.main_image, b.price as user_price
                FROM auction.bid_logs as b
                JOIN product.products as p ON p.id = b.product_id
                WHERE b.user_id =$1 AND b.price = (
                    SELECT MAX(price)
                    FROM auction.bid_logs as c
                    WHERE c.user_id = $1 AND c.product_id = b.product_id
                  )
                   `;
    if (limit) {
      sql += `LIMIT $2 \n`;
      params.push(limit);
    }
    if (page && limit) {
      const offset = (page - 1) * limit;
      sql += "OFFSET $3 \n";
      params.push(offset);
    }
    const productsNotPrice: BiddingProduct[] = await this.safeQuery(
      sql,
      params
    );

    const productHavePrice = await Promise.all(
      productsNotPrice.map(async (p) => {
        const current_price = await this.getCurrentPrice(p.id);
        if (current_price === undefined) {
          return { ...p, current_price: null };
        }
        return { ...p, current_price };
      })
    );
    return productHavePrice;
  }

  async getProducts(pagination: Pagination): Promise<ProductPreview[]> {
    const sql = `
                SELECT p.id 
                FROM product.products p
                ORDER BY created_at desc
                LIMIT $1
                OFFSET $2
                  `;
    const offset = (pagination.page - 1) * pagination.limit;
    const params = [pagination.limit, offset];
    const product = await this.safeQuery<ProductPreview>(sql, params);

    const productPreview = await Promise.all(
      product.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType;
      })
    );
    return productPreview;
  }
}
