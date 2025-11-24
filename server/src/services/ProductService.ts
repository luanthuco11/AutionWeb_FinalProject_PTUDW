import { Product, ProductPreview, ProductQuestion } from './../../../shared/src/types/Product';
import { profile } from "console";
import { getProductAnswerColumns, getProductAnswerValue, getProductColumns, getProductQuestionColumns, getProductQuestionValue, getProductValue } from "../utils";
import { BaseService } from "./BaseService";
import { Request, Response, NextFunction } from "express";
import { ShortUser, User } from '../../../shared/src/types';
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

  async getTopBidder(productId: number): Promise<ShortUser| null> {
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

  async getBidCount(productId: number) : Promise<number> {
    const sql = `  
    SELECT COUNT(*) AS bid_count
    FROM auction.bid_logs bl 
    WHERE bl.product_id = $1
    `;
    const bidCount: {bid_count: number}[] = await this.safeQuery(sql, [productId]);
    return Number(bidCount[0]?.bid_count ?? 0) ;
  }

  async getCurrentPrice(productId: number) : Promise<number | null>  {
    const sql = `  
    SELECT MAX(bl.price) AS current_price
    FROM auction.bid_logs bl 
    WHERE bl.product_id = $1
    `;
    const currentPrice: {current_price: number | null}[] = await this.safeQuery(sql, [productId]);
    return currentPrice[0]?.current_price ? Number(currentPrice[0].current_price) : null;
  }

  async getStatus(productId: number): Promise<string> {
    const sql = `
    SELECT 
      ao.status
    FROM auction.orders ao
    WHERE ao.product_id = $1
    `
    const status: {status: string}[] = await this.safeQuery(sql, [productId]);
    return status[0]?.status ?? "available"  
  }

  async getProductType(productId: number): Promise<Product> {
    const result = await Promise.all([
      this.getTopBidder(productId),
      this.getBidCount(productId),
      this.getCurrentPrice(productId),
      this.getStatus(productId),
    ]);

    const top_bidder = result[0];
    const bid_count =  result[1];
    let current_price = result[2];
    const status = result[3];
    const sql = `
    SELECT 
      p.id, 
      p.slug,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'profile_img', u.profile_img
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
      p.updated_at

    FROM product.products p 
    JOIN admin.users u on u.id = p.seller_id 
    WHERE p.id = $1
    `;

    let products: any = await this.safeQuery<Product>(sql, [productId]);
    products[0].id = products[0].id ? Number(products[0].id) : null
    products[0].initial_price = products[0].initial_price ? Number(products[0].initial_price) : null
    products[0].buy_now_price = products[0].buy_now_price ? Number(products[0].buy_now_price) : null
    products[0].price_increment = products[0].price_increment ? Number(products[0].price_increment) : null
    if (current_price == null){
      current_price = products[0].initial_price;
    }


    products = {
      ...products[0],
      top_bidder: top_bidder,
      current_price: current_price,
      bid_count: bid_count,
      status: status


    }
    return products;
  }

   async getProductPreviewType(productId: number) : Promise<ProductPreview> {
    const result = await Promise.all([
      this.getTopBidder(productId),
      this.getBidCount(productId),
      this.getCurrentPrice(productId),
    ]);

    const top_bidder: any = result[0];
    const bid_count =  result[1];
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
      p.created_at

    FROM product.products p 
    JOIN admin.users u on u.id = p.seller_id 
    WHERE p.id = $1
    `;

    let products: any = await this.safeQuery<ProductPreview>(sql, [productId]);
    products[0].id = products[0].id ? Number(products[0].id) : null
    products[0].initial_price = products[0].initial_price ? Number(products[0].initial_price) : null
    products[0].buy_now_price = products[0].buy_now_price ? Number(products[0].buy_now_price) : null
    products[0].price_increment = products[0].price_increment ? Number(products[0].price_increment) : null
    if (current_price == null){
      current_price = products[0].initial_price;
    }


    products = {
      ...products[0],
      top_bidder_name: top_bidder ? top_bidder.name : null,
      current_price: current_price,
      bid_count: bid_count
    }

    return products;
  }

  async getProducts(): Promise<ProductPreview[]> {
    const sql = `SELECT id FROM product.products order by id asc  `;
    let products = await this.safeQuery<ProductPreview>(sql);

    const newProducts = await Promise.all(
      products.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType
      })
    );

    return newProducts;
    // const result = await this.safeQuery<User>(sql, [id]); (cung duoc)
    // const users = await this.safeQuery(sql, params);
  }

  // Ko chuyen limit cung
  async getTopEndingSoonProducts(limit?: number) : Promise<ProductPreview[]>  {
    let sql = `
    SELECT id
    FROM product.products
    ORDER BY product.products.end_time ASC
    `;

    const params: any[] = [];
    if (limit){
      sql += `LIMIT $1 \n`;
      params.push(limit);
    }

    const endTimeProducts = await this.safeQuery<ProductPreview>(sql, params);

    const newEndtimeProducts = await Promise.all(
      endTimeProducts.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType
      })
    );

    return newEndtimeProducts;
  }

  // Ko chuyen limit cung
  async getTopBiddingProducts(limit?: number): Promise<ProductPreview[]>  {
    let sql = `
  SELECT products.id 
  FROM product.products AS products 
  WHERE products.id IN (
  SELECT products.id
  FROM product.products AS products 
  JOIN auction.bid_logs  AS bid_logs ON bid_logs.product_id = products.id 
  GROUP BY products.id 
  ORDER BY COUNT(DISTINCT bid_logs.user_id) DESC
  )
  `;
   const params: any[] = [];
    if (limit){
      sql += `LIMIT $1 \n`;
      params.push(limit);
    }

    const topBiddingProducts = await this.safeQuery<ProductPreview>(sql, params);

     const newTopBiddingProducts = await Promise.all(
      topBiddingProducts.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType
      })
    );

    return newTopBiddingProducts;
  }

  // Ko chuyen limit cung
  async getTopPriceProducts(limit? :number): Promise<ProductPreview[]>  {
    let sql = `
    SELECT pp.id
    FROM product.products AS pp
    JOin auction.bid_logs bl on bl.product_id = pp.id 
    GROUP BY pp.id 
    ORDER BY MAX(bl.price) DESC 
    `;
    let params: any[] = []
    if (limit){
      sql += `LIMIT $1 \n`;
      params.push(limit);
    }
    const topPriceProducts = await this.safeQuery<ProductPreview>(sql, params);

     const newTopPriceProducts = await Promise.all(
      topPriceProducts.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType
      })
    );
    return newTopPriceProducts;
  }

  // check productId phai la number
  async getProductById(req: Request): Promise<Product | undefined>  {
    const productId = req.params.productId;

    const sql = `
    SELECT id
    FROM product.products 
    WHERE id = $1
    `;

    const product = await this.safeQuery<Product>(sql, [productId]);

    const newProduct = await Promise.all(
      product.map(async (item: any) => {
        const productType = this.getProductType(item.id);
        return productType
      })
    );
    return newProduct[0];
  }

  async createProduct(req: Request) {
    const keys = await getProductColumns();
    const values = getProductValue(req.body);
    const params = keys.map((_, i) => `$${i + 1}`);

    const sql = `
    INSERT INTO product.products(${keys.join(",")})
    VALUES (${params.join(",")})
    RETURNING * 
    `;
    const newProduct = await this.safeQuery(sql, values);
    return newProduct;
  }

  async updateProductDescription(req: Request) {
    const productId = req.params.productId;
    const description = req.body.description;
    const sql = `
    UPDATE product.products
    SET description = 
        CASE
            WHEN description IS NULL THEN $1
            ELSE description || E'\n\n' || $1
        END
    WHERE id = $2
    RETURNING *;
    `;
    const updateProduct = await this.safeQuery(sql, [description, productId]);
    return updateProduct;
  }
  async deleteProductById(req: Request) {
    const productId = req.params.productId;
    const sql = `
    DELETE FROM product.products 
    WHERE id = $1
    RETURNING *
    `;
    const deleteProduct = await this.safeQuery(sql, [productId]);
    return deleteProduct;
  }

  async getQuestions(req: Request): Promise<ProductQuestion[]> {
    const productId = Number(req.params.productId);
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
          ) AS answers
      FROM feedback.product_questions pq
      JOIN admin.users u ON u.id = pq.user_id
      WHERE pq.product_id = $1;

    `;
    const questions = await this.safeQuery<ProductQuestion>(sql, [productId]);

  
    return questions;
  }

  async createQuestion(req: Request) {
    const key = await getProductQuestionColumns();
    const data = getProductQuestionValue(req.body);
    const params = key.map((_, i) => `$${i + 1}`);
    const sql = `
    INSERT INTO feedback.product_questions(${key.join(",")})
    VALUES (${params})
    RETURNING *
    `;
    const question = await this.safeQuery(sql, data);
    return question[0];
  }


  async createAnswer(req: Request) {
     const key = await getProductAnswerColumns();
    const data = getProductAnswerValue(req.body);
    const params = key.map((_, i) => `$${i + 1}`);
    const sql = `
    INSERT INTO feedback.product_answers(${key.join(",")})
    VALUES (${params})
    RETURNING *
    `;
    const answer = await this.safeQuery(sql, data);
    return answer[0];
  }

  async updateProductExtend(req: Request) {
    const productId = req.params.productId;
    const auto_extend = req.body.auto_extend;
    const sql = `
    UPDATE product.products
    SET auto_extend = $1
    WHERE id = $2

    RETURNING * 
    `;

    const productExtend = await this.safeQuery(sql, [auto_extend, productId]);
    return productExtend;
  }
}

/*
- Can tim hieu async, await , Promise.all
*/


/*
{
  "slug": "Tri-ne",
  "seller": {
    "id": 1,
    "name": "Tri"
  },
  "main_image": "Tri",
  "extra_images": ["123"],
  "description": "Hello ba",
  "auto_extend": true,
  "price_increment": 30,
  "initial_price": 10,
  "buy_now_price": 10,
  "category_id": 1,
  "name": "Do da banh",
  "status": true,
  "top_bidder": {
    "id": 1
  }
}
*/


/*
⚡ Async / Await — Ý chính
async luôn trả về Promise (dù bạn return gì).
await chỉ tạm “pause” trong hàm async, không block event loop.
await làm code tuần tự → dễ đọc nhưng chậm nếu không cần phụ thuộc.
Lỗi khi await ném ra → throw như lỗi bình thường, bắt bằng try/catch.
await trong vòng lặp lớn (forEach/map) → dễ tạo vấn đề performance.
⚡ Promise.all — Ý chính
Chạy song song nhiều Promise → nhanh nhất khi các tác vụ độc lập.
Nếu một Promise reject → tất cả reject.
Không phù hợp nếu bạn muốn xử lý lỗi từng phần.
Tốt nhất dùng với:
Gọi nhiều API độc lập
Query DB song song
Nhiều tác vụ async không phụ thuộc nhau
*/