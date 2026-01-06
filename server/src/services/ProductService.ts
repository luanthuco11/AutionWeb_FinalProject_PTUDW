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
  SoldProduct,
  FullSoldProduct,
} from "./../../../shared/src/types/Product";
import { BaseService } from "./BaseService";
import { ShortUser, User } from "../../../shared/src/types";

import { createSlugUnique } from "../utils";
import { R2Service } from "./R2Service";
import { Pagination } from "../../../shared/src/types/Pagination";
import { sendEmailToUser } from "../utils/mailer";


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
    SELECT u.id, u.name, u.profile_img, u.positive_points, u.negative_points
    FROM admin.users u
    JOIN product.products p ON p.top_bidder_id = u.id
    WHERE p.id = $1
    `;
    const bidder = await this.safeQuery<ShortUser>(sql, [productId]);
    return bidder[0] ? bidder[0] : null;
  }

  async getBidCount(productId: number): Promise<number | undefined> {
    const sql = `  
    SELECT COUNT(*) AS bid_count
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
    WHERE ao.product_id = $1 AND ao.status != 'cancelled'
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
      p.id::INT, 
      p.slug,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'profile_img', u.profile_img,
        'positive_points', u.positive_points,
        'negative_points', u.negative_points
      ) AS seller,
      p.category_id::INT,
      p.main_image,
      p.extra_images,
      p.name,
      p.initial_price::INT,
      p.buy_now_price::INT,
      COALESCE((
        SELECT created_at
        FROM auction.orders o
        WHERE o.product_id = p.id AND o.status != 'cancelled'
      ), p.end_time) AS end_time,
      p.description,
      p.auto_extend,
      p.price_increment::INT,
      p.created_at,
      p.updated_at,
      p.is_all_can_bid,
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
      p.seller_id,
      p.buy_now_price,
      COALESCE((
        SELECT created_at
        FROM auction.orders o
        WHERE o.product_id = p.id AND o.status != 'cancelled'
      ), p.end_time) as end_time,
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
      top_bidder_id: top_bidder ? top_bidder.id : null,
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
  async getSoldProductType(productId: number): Promise<SoldProduct> {
    const result = await Promise.all([
      this.getTopBidder(productId),
      this.getCurrentPrice(productId),
    ]);

    const top_bidder: any = result[0];
    let current_price = result[1];

    const sql = `
    SELECT 
      p.id, 
      p.main_image,
      p.name,
      p.initial_price
    FROM product.products p 
    WHERE p.id = $1
    `;

    let products: any = await this.safeQuery<SoldProduct>(sql, [productId]);

    products = {
      ...products[0],
      top_bidder: top_bidder ? top_bidder : null,
      current_price: current_price ? current_price : products[0].initial_price,
    };

    return products;
  }
  async getTotalProductsBySearch(query: string): Promise<number | undefined> {
    let sql = `
       SELECT COUNT(*) as total
       FROM product.products pp
       JOIN product.product_categories pc on pc.id = pp.category_id
       WHERE (
              setweight(to_tsvector('simple', unaccent(pp.name)), 'A') || 
              setweight(to_tsvector('simple', unaccent(pc.name)), 'B')
          ) @@ to_tsquery('simple', regexp_replace(trim(unaccent($1)), '\\s+', ' & ', 'g') || ':*') and pp.end_time >= NOW() and not exists (
   select 1
   from auction.orders o 
   where o.product_id = pp.id and o.status <> 'cancelled' 
   )
    `;
    const params: any[] = [query];

    let totalProducts: { total: number }[] = await this.safeQuery(sql, params);

    return totalProducts[0]?.total;
  }

  async getProductsBySearch(
    query: string,
    limit: number,
    page: number,
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
       WHERE (
              setweight(to_tsvector('simple', unaccent(pp.name)), 'A') || 
              setweight(to_tsvector('simple', unaccent(pc.name)), 'B')
          ) @@ to_tsquery('simple', regexp_replace(trim(unaccent($1)), '\\s+', ' & ', 'g') || ':*')
             AND pp.end_time >= NOW() 
             AND NOT EXISTS (
                SELECT 1
                FROM auction.orders o 
                WHERE o.product_id = pp.id AND o.status <> 'cancelled'
             )
    `;
    const params: any[] = [query];
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
WHERE pp.end_time >= NOW() and not exists (
   select 1
   from auction.orders o 
   where o.product_id = pp.id and o.status <> 'cancelled' 
   )
    `;
    let totalProducts: { total: number }[] = await this.safeQuery(sql);
    return totalProducts[0]?.total;
  }

  async getTotalProductsByCategory(slug: string): Promise<number | undefined> {
    let sql = `
    SELECT COUNT(*) AS total
    FROM product.products pp
    WHERE pp.category_id = $1 and pp.end_time >= NOW() and not exists (
   select 1
   from auction.orders o 
   where o.product_id = pp.id and o.status <> 'cancelled' 
   )
    `;
    let totalProducts: { total: number }[] = await this.safeQuery(sql, [slug]);
    return totalProducts[0]?.total;
  }

  async getTotalBiddingProducts(): Promise<number | undefined> {
    let sql = `
    SELECT COUNT(DISTINCT(bl.product_id)) AS total
    FROM product.products AS pp
    JOIN auction.bid_logs  AS bl ON bl.product_id = pp.id 
 WHERE pp.end_time >= NOW() and not exists (
   select 1
   from auction.orders o 
   where o.product_id = pp.id and o.status <> 'cancelled' 
   )
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
        FROM product.products pp
   WHERE pp.end_time >= NOW() and not exists (
   select 1
   from auction.orders o 
   where o.product_id = pp.id and o.status <> 'cancelled' 
   )
        ORDER BY pp.end_time ASC


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
    SELECT pp.id, GREATEST(COALESCE(bl.current_price, 0), pp.initial_price) AS price, COALESCE((
        SELECT created_at
        FROM auction.orders o
        WHERE o.product_id = pp.id AND o.status != 'cancelled'
      ), pp.end_time) AS end_time,
    FROM product.products pp
    LEFT JOIN (
        SELECT 
          bl.product_id, 
          MAX(bl.price) AS current_price
        FROM auction.bid_logs bl 
        GROUP BY bl.product_id
    ) bl ON bl.product_id = pp.id
    WHERE pp.category_id = $1 and pp.end_time >= NOW() and not exists (
   select 1
   from auction.orders o 
   where o.product_id = pp.id and o.status <> 'cancelled' 
   )
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
        sql += ` AND NOT EXISTS (
          SELECT 1
          FROM auction.orders o
          WHERE o.product_id = pp.id
        ) ORDER BY end_time ASC`;
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
  
  SELECT pp.id
  FROM product.products pp
  JOIN auction.bid_logs  AS bid_logs ON bid_logs.product_id = pp.id 
  WHERE pp.end_time >= NOW() and not exists (
   select 1
   from auction.orders o 
   where o.product_id = pp.id and o.status <> 'cancelled' 
   )
  GROUP BY pp.id 
  ORDER BY COUNT (*) DESC
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

   WHERE pp.end_time >= NOW() and not exists (
   select 1
   from auction.orders o 
   where o.product_id = pp.id and o.status <> 'cancelled' 
   )
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
  async getSoldProducts(
    userId: number
  ): Promise<FullSoldProduct[] | undefined> {
    const sql = `
    SELECT 
      product_id,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'profile_img', u.profile_img,
        'positive_points', u.positive_points,
        'negative_points', u.negative_points
      ) AS buyer
    FROM auction.orders o
    JOIN product.products p ON p.id = o.product_id
    JOIN admin.users u ON u.id = o.buyer_id
    WHERE p.seller_id = $1 AND o.status != 'cancelled'
    ORDER BY o.created_at DESC
    `;
    const params = [userId];
    const product = await this.safeQuery<{
      product_id: number;
      buyer: Pick<
        User,
        "id" | "name" | "profile_img" | "positive_points" | "negative_points"
      >;
    }>(sql, params);

    const soldProduct = await Promise.all(
      product.map(async (item: any) => {
        const productType = await this.getProductType(item.product_id);
        return {
          ...productType,
          buyer: item.buyer,
        };
      })
    );

    return soldProduct;
  }
  async getSellingProducts(
    userId: number,
    page?: number,
    limit?: number
  ): Promise<ProductPreview[] | undefined> {
    const sql = `
  SELECT pp.id
  FROM product.products pp
  WHERE pp.seller_id = $1 and pp.end_time >= NOW()   and not exists (
   select 1
   from auction.orders o 
   where o.product_id = pp.id and o.status <> 'cancelled' 
   )
  LIMIT $2 OFFSET $3
    `;

    const totalSql = `
  SELECT pp.id
  FROM product.products pp
  WHERE pp.seller_id = $1 and pp.end_time >= NOW()   and not exists (
   select 1
   from auction.orders o 
   where o.product_id = pp.id and o.status <> 'cancelled' 
   )
    `;
    const offset = limit && page ? (page - 1) * limit : 0;

    const params = limit && page ? [userId, limit, offset] : [userId];

    const product = await this.safeQuery<ProductPreview>(
      limit && page ? sql : totalSql,
      params
    );

    const sellingProduct = await Promise.all(
      product.map(async (item: any) => {
        const productType = this.getProductPreviewType(item.id);
        return productType;
      })
    );
    return sellingProduct;
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
            WHERE pp.category_id = pc.id  and pp.end_time >= NOW() and not exists (
   select 1
   from auction.orders o 
   where o.product_id = pp.id and o.status <> 'cancelled' 
   )
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
    ),
    pc.name as category_name
  FROM product.products pp
  JOIN product.product_categories pc on pp.category_id = pc.id
  WHERE (
        setweight(to_tsvector('simple', unaccent(pp.name)), 'A') || 
        setweight(to_tsvector('simple', unaccent(pc.name)), 'B')
    ) @@ to_tsquery('simple', regexp_replace(trim(unaccent($1)), '\\s+', ' & ', 'g') || ':*') and pp.end_time >= NOW() and not exists (
   select 1
   from auction.orders o 
   where o.product_id = pp.id and o.status <> 'cancelled' 
   )
  ORDER BY ts_rank(
      setweight(to_tsvector('simple', unaccent(pp.name)), 'A') || 
        setweight(to_tsvector('simple', unaccent(pc.name)), 'B'),
        to_tsquery('simple', regexp_replace(trim(unaccent($1)), '\\s+', ' & ', 'g') || ':*')
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
    created_at,
    is_all_can_bid
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), $13)
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
      payload.is_all_can_bid,
    ]);
    return newProduct;
  }

  async updateProductDescription(productId: number, description: string) {
    const now: Date = new Date();

    const pad = (n: number): string => n.toString().padStart(2, "0");

    const dateTime: string =
      `${pad(now.getDate())}/` +
      `${pad(now.getMonth() + 1)}/` +
      `${now.getFullYear()} ` +
      `${pad(now.getHours())}:` +
      `${pad(now.getMinutes())}`;

    const dateHtml = `
    <p style="
      font-weight: 600;
      color: #2563eb;
      background: #eff6ff;
      padding: 6px 10px;
      border-left: 4px solid #2563eb;
      margin-bottom: 12px;
    ">
      ✏️ ${dateTime}
    </p>
  `;
    const afterAddDate = dateHtml + description;
    const sql = `
   UPDATE product.products
SET description =
    CASE
        WHEN description IS NULL THEN $1
        ELSE
            description || $1
    END,
    updated_at = NOW()
WHERE id = $2
RETURNING *;
    `;

    const updateProduct: Product[] = await this.safeQuery(sql, [
      afterAddDate,
      productId,
    ]);
    const sqlBidders = `
      SELECT u.*
      FROM auction.user_bids as l 
      JOIN admin.users as u ON l.user_id = u.id
      WHERE l.product_id = $1
    `;
    const bidders: User[] = await this.safeQuery(sqlBidders, [productId]);
    const getSellerInfo = async () => {
      const sql = `
          SELECT u.*
          FROM admin.users as u 
          JOIN product.products as p ON u.id = p.seller_id
          WHERE p.id = $1 `;
      const params = [productId];
      const result: User[] = await this.safeQuery(sql, params);
      return result[0];
    };
    const sellerInfo: User | undefined = await getSellerInfo();
    if (updateProduct && bidders) {
      const productInfo: Product | undefined = updateProduct[0];

      if (productInfo && sellerInfo) {
        await Promise.all([
          bidders.map((item) =>
            sendEmailToUser(
              item.email,
              "THÔNG BÁO VỀ SẢN PHẨM ĐANG ĐẤU GIÁ",
              `       
                <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
                  <tr>
                    <td style="background-color:#0d6efd; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
                      Cập nhật thông tin sản phẩm
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px; font-size:16px; line-height:1.5; color:#333;">
                      <p>
                        Người bán <strong>${sellerInfo.name}</strong> đã chỉnh sửa chi tiết sản phẩm 
                        <strong>
                          <a 
                            href="${process.env.NEXT_PUBLIC_CLIENT_URL}/product/${productInfo.slug}" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style="color: #0d6efd; text-decoration: underline;"
                          >
                            ${productInfo.name}
                          </a>
                        </strong>.
                      </p>
                      <p style="margin-top:15px;">
                        Hãy truy cập vào trang chi tiết để cập nhật thông tin mới nhất về sản phẩm và tiếp tục phiên đấu giá của bạn!
                      </p>
                      <div style="text-align: center; margin-top: 25px;">
                        <a href="${process.env.NEXT_PUBLIC_CLIENT_URL}/product/${productInfo.slug}" 
                          style="background-color: #0d6efd; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                          Xem chi tiết sản phẩm
                        </a>
                      </div>
                    </td>
                  </tr>
                </table>
            `
            )
          ),
        ]);
      }
    }
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
                (
                  json_agg(
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
    //Lấy thông tin người bán
    const getSellerInfo = async () => {
      const sql = `
          SELECT u.*
          FROM admin.users as u 
          JOIN product.products as p ON u.id = p.seller_id
          WHERE p.id = $1 `;
      const params = [productId];
      const result: User[] = await this.safeQuery(sql, params);
      return result[0];
    };
    //Lấy thông tin sản phẩm
    const getProductInfo = async (id: number) => {
      const sql = `
      SELECT p.*
      FROM product.products as p 
      WHERE p.id = $1 `;
      const params = [id];
      const result: Product[] = await this.safeQuery(sql, params);
      return result[0];
    };
    //Lấy thông tin người đấu giá
    const getBidderInfo = async () => {
      const sql = `
      SELECT u.*
      FROM admin.users as u
      WHERE u.id = $1 `;
      const params = [userId];
      const result: User[] = await this.safeQuery(sql, params);
      return result[0];
    };

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

    const sellerInfo: User | undefined = await getSellerInfo();
    const bidderInfo: User | undefined = await getBidderInfo();
    const productInfo: Product | undefined = await getProductInfo(productId);
    if (sellerInfo && bidderInfo && productInfo) {
      sendEmailToUser(
        sellerInfo.email,
        "THÔNG BÁO VỀ SẢN PHẨM ĐANG BÁN",
        `
              <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
          <tr>
            <td style="background-color:#0d6efd; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
              Câu hỏi mới về sản phẩm
            </td>
          </tr>
          <tr>
            <td style="padding:20px; font-size:16px; line-height:1.5; color:#333;">
              <p>
                Người đấu giá <strong> ${bidderInfo.name}</strong>  đã đặt câu hỏi về sản phẩm
                <strong>
                 <a 
                    href="${process.env.NEXT_PUBLIC_CLIENT_URL}/product/sell/${productInfo.slug}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style="color: inherit; text-decoration: underline;"
                    >
                    ${productInfo.name}
                  </a>
                </strong> của bạn.
              </p>
              <p style="margin-top:15px;">
                Hãy trả lời câu hỏi để <strong>${bidderInfo.name}</strong> biết thêm chi tiết!
              </p>
            </td>
          </tr>
        </table>
       `
      );
    }

    return question[0];
  }

  async createAnswer(
    createAnswer: CreateAnswer,
    userId: number,
    questionId: number
  ) {
    const getRelatedUsersInQuestion = async () => {
      const sql = `
      SELECT u.*
      FROM feedback.product_questions as q
      JOIN admin.users as u ON u.id = q.user_id
      WHERE q.product_id = $1 `;
      const params = [createAnswer.productId];
      const result: User[] = await this.safeQuery(sql, params);
      return result;
    };
    const getIdOfQuestioner = async () => {
      const sql = `
      SELECT u.id
      FROM feedback.product_questions as q
      JOIN admin.users as u ON u.id = q.user_id
      WHERE q.id = $1 
      `;
      const params = [questionId];
      const result: { id: number }[] = await this.safeQuery(sql, params);
      return result[0]?.id;
    };
    const getRelatedUsersInUserBids = async () => {
      const sql = `
      SELECT u.*
      FROM auction.user_bids as b
      JOIN admin.users as u ON u.id = b.user_id
      WHERE b.product_id = $1 AND NOT EXISTS (SELECT l.user_id as id 
                                              FROM auction.black_list AS l  
                                              WHERE l.user_id = u.id
      )`;
      const params = [createAnswer.productId];
      const result: User[] = await this.safeQuery(sql, params);
      return result;
    };
    //Lấy thông tin user
    const getUserInfo = async (id: number) => {
      const sql = `
      SELECT u.*
      FROM admin.users as u 
      WHERE u.id = $1 `;
      const params = [id];
      const result: User[] = await this.safeQuery(sql, params);

      return result[0];
    };
    const getProductInfo = async (id: number) => {
      const sql = `
      SELECT p.*
      FROM product.products as p 
      WHERE p.id = $1 `;
      const params = [id];
      const result: Product[] = await this.safeQuery(sql, params);

      return result[0];
    };
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
    const [usersFromQuestions, usersFromBids] = await Promise.all([
      getRelatedUsersInQuestion(),
      getRelatedUsersInUserBids(),
    ]);

    // Gộp & loại trùng theo id
    const userMap = new Map<number, User>();

    [...usersFromQuestions, ...usersFromBids].forEach((user) => {
      userMap.set(user.id, user);
    });

    const [questionerId, sellerInfo, productInfo] = await Promise.all([
      getIdOfQuestioner(),
      getUserInfo(userId),
      getProductInfo(createAnswer.productId),
    ]);
    const relatedUsers: User[] = Array.from(userMap.values());

    if (sellerInfo && productInfo) {
      await Promise.all([
        relatedUsers.forEach((user) => {
          let html: string = "";
          if (user.id == questionerId) {
            html = `
       <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
          <tr>
            <td style="background-color:#198754; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
              Phản hồi từ người bán
            </td>
          </tr>
          <tr>
            <td style="padding:20px; font-size:16px; line-height:1.5; color:#333;">
              <p>
                Người bán <strong>${sellerInfo.name}</strong> đã trả lời câu hỏi của bạn
                tại sản phẩm <strong>
                  <a 
                    href="${process.env.NEXT_PUBLIC_CLIENT_URL}/product/${productInfo.slug}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style="color: inherit; text-decoration: underline;"
                  >
                    ${productInfo.name}
                  </a>
                </strong>.
              </p>
              <p style="margin-top:15px;">
                Hãy truy cập sản phẩm để xem chi tiết nội dung phản hồi.
              </p>
            </td>
          </tr>
        </table>
        `;
          } else {
            html = `
       <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
          <tr>
            <td style="background-color:#198754; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
              Phản hồi từ người bán
            </td>
          </tr>
          <tr>
            <td style="padding:20px; font-size:16px; line-height:1.5; color:#333;">
              <p>
                Người bán <strong>${sellerInfo.name}</strong> đã trả lời câu hỏi của người khác
                tại sản phẩm <strong>
                  <a 
                    href="${process.env.NEXT_PUBLIC_CLIENT_URL}/product/${productInfo.slug}" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style="color: inherit; text-decoration: underline;"
                  >
                    ${productInfo.name}
                  </a>
                </strong>.
              </p>
              <p style="margin-top:15px;">
                Hãy truy cập sản phẩm để xem chi tiết nội dung phản hồi.
              </p>
            </td>
          </tr>
        </table>
        `;
          }
          sendEmailToUser(user.email, "SẢN PHẨM ĐANG THEO DÕI", html);
        }),
      ]);
    }

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
    const sql = `
    SELECT COUNT (*) as total
     FROM auction.orders o  
     WHERE o.buyer_id = $1
          `;
    const totalProducts: { total: number }[] = await this.safeQuery(sql, [
      userId,
    ]);

    return totalProducts[0]?.total;
  }

  async getWinningProducts(
    userId: number,
    limit: number,
    page: number
  ): Promise<WinningProduct[]> {
    const params: any[] = [userId];
    let sql = `
      SELECT 
        p.id, 
        p.name, 
        p.slug, 
        p.main_image, 
        o.price AS current_price, 
        jsonb_build_object(
            'id', s.id, 
            'name', s.name, 
            'positive_points', s.positive_points, 
            'negative_points', s.negative_points
        ) AS seller,
        o.created_at AS winning_date,
        o.status
      FROM auction.orders AS o
      JOIN product.products AS p ON p.id = o.product_id
      JOIN admin.users s ON s.id = p.seller_id
      WHERE o.buyer_id = $1 AND o.status != 'cancelled'
      ORDER BY winning_date DESC `;

    if (limit) {
      sql += `LIMIT $2 \n`;
      params.push(limit);
    }
    if (page && limit) {
      const offset = (page - 1) * limit;
      sql += "OFFSET $3 \n";
      params.push(offset);
    }
    const winningProducts: WinningProduct[] = await this.safeQuery(sql, params);

    return winningProducts;
  }

  async getTotalBiddingProductsByUser(
    userId: number
  ): Promise<number | undefined> {
    const sql = `
    SELECT COUNT (DISTINCT b.product_id) as total
     FROM auction.user_bids b
     JOIN product.products p ON p.id = b.product_id
     WHERE b.user_id = $1 AND (p.end_time >= NOW() AND NOT EXISTS (
        SELECT 1
        FROM auction.orders o
        WHERE o.product_id = b.product_id AND o.status <> 'cancelled'
      ))
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
      SELECT product_id::INT, b.max_price::INT
      FROM auction.user_bids b
      JOIN product.products p ON p.id = b.product_id
      WHERE user_id = $1 AND (p.end_time >= NOW() AND NOT EXISTS (
        SELECT 1
        FROM auction.orders o
        WHERE o.product_id = b.product_id AND o.status <> 'cancelled'
      ))
      ORDER BY p.end_time DESC
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
    const productIds = await this.safeQuery<{
      product_id: number;
      max_price: number;
    }>(sql, params);

    const productPreview = await Promise.all(
      productIds.map(async (item: any) => {
        const productType = await this.getProductType(item.product_id);
        return {
          ...productType,
          user_price: item.max_price,
        };
      })
    );
    return productPreview;
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
