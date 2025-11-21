import { ProductQuestion } from "./../../../shared/src/types/Product";
import { BaseService } from "./BaseService";
import { Request, Response, NextFunction } from "express";
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

  async getProducts() {
    const sql = `SELECT * FROM product.products`;
    const products = await this.safeQuery(sql);
    // const result = await this.safeQuery<User>(sql, [id]); (cung duoc)
    // const users = await this.safeQuery(sql, params);
    return products;
  }

  // Ko chuyen limit cung
  async getTopEndingSoonProducts() {
    const sql = `
    SELECT * 
    FROM product.products
    ORDER BY product.products.end_time ASC
    LIMIT 5
    `;
    const endTimeProducts = await this.safeQuery(sql);
    return endTimeProducts;
  }

  // Ko chuyen limit cung
  async getTopBiddingProducts() {
    const sql = `
  SELECT * 
  FROM product.products AS products 
  WHERE products.id IN (
  SELECT products.id
  FROM product.products AS products 
  JOIN auction.bid_logs  AS bid_logs ON bid_logs.product_id = products.id 
  GROUP BY products.id 
  ORDER BY COUNT(DISTINCT bid_logs.user_id) DESC
  LIMIT 5
  )
  `;
    const topBiddingProducts = await this.safeQuery(sql);
    return topBiddingProducts;
  }

  // Ko chuyen limit cung
  async getTopPriceProducts() {
    const sql = `
    SELECT * 
    FROM product.products AS products 
    ORDER BY products.initial_price DESC 
    LIMIT 5
    `;
    const topPriceProducts = await this.safeQuery(sql);
    return topPriceProducts;
  }

  // check productId phai la number
  async getProductById(req: Request) {
    const productId = req.params.productId;

    const sql = `
    SELECT * 
    FROM product.products 
    WHERE id = $1
    `;

    const product = await this.safeQuery(sql, [productId]);
    return product;
  }

  async createProduct(req: Request) {
    // const data = {
    //   ...req.body,
    //   seller_id: req.body.seller.id
    // }
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
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

  async getQuestions(req: Request) {
    const productId = req.params.productId;
    const sql = `
    SELECT
  jsonb_set(
    to_jsonb(questions),
    '{answer}',
    to_jsonb(answers)
  ) AS questions
    FROM feedback.product_questions AS questions 
    JOIN feedback.product_answers AS answers on questions.id = answers.question_id
    WHERE product_id = $1
    `;
    const questions: any[] = await this.safeQuery(sql, [productId]);
    console.log("This is question", questions);
    return questions[0].questions;
  }

  async createQuestion(req: Request) {
    const object = {
      ...req.body,
      product_id: Number(req.params.productId),
    };
    const key = Object.keys(object);
    const data = Object.values(object);
    const params = key.map((_, i) => `$${i + 1}`);
    const sql = `
    INSERT INTO feedback.product_questions(${key.join(",")})
    VALUES (${params})
    RETURNING *
    `;
    const question = await this.safeQuery(sql, data);
    return question;
  }

  async createAnswer(req: Request) {
    const object = {
      ...req.body,
      question_id: Number(req.params.questionId),
    };
    const key = Object.keys(object);
    const data = Object.values(object);
    const params = key.map((_, i) => `$${i + 1}`);
    const sql = `
    INSERT INTO feedback.product_answers(${key.join(",")})
    VALUES (${params})
    RETURNING *
    `;
    const question = await this.safeQuery(sql, data);
    return question;
  }


  async updateProductExtend(req: Request){
    const productId = req.params.productId
    const auto_extend = req.body.auto_extend;
    const sql = `
    UPDATE product.products
    SET auto_extend = $1
    WHERE id = $2
    `

    const productExtend = await this.safeQuery(sql, [auto_extend, productId]);
    return productExtend;
  }
}

/*
row_to_json: chuyển row trên sql thành json 

to_jsonb() = chuyển một row (bản ghi) thành JSONB

jsonb_set(json_origin, {path}, new_value) --> Từ json_origin thêm key là path với data của path đó là new_value
*/
