import { ProductPreview } from "../../../shared/src/types";
import { BaseService } from "./BaseService";
import { MutationResult } from "../../../shared/src/types/Mutation";
export class FavoriteService extends BaseService {
  private static instance: FavoriteService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!FavoriteService.instance) {
      FavoriteService.instance = new FavoriteService();
    }

    return FavoriteService.instance;
  }

  async getFavorite(userId: number): Promise<ProductPreview[]> {
    const sql = `
      SELECT 
        P.*,
        BID.NAME AS TOP_BIDDER_NAME,
        COUNT(LOG.ID) AS BID_COUNT,
        (
          SELECT L.PRICE
          FROM AUCTION.BID_LOGS L
          WHERE L.PRODUCT_ID = P.ID
          ORDER BY L.CREATED_AT DESC
          LIMIT 1
        ) AS CURRENT_PRICE
      FROM AUCTION.FAVORITE_PRODUCTS FP
      JOIN PRODUCT.PRODUCTS P ON P.ID = FP.PRODUCT_ID 
      LEFT JOIN ADMIN.USERS BID ON BID.ID = P.TOP_BIDDER_ID
      LEFT JOIN AUCTION.BID_LOGS LOG ON LOG.PRODUCT_ID = P.ID
      WHERE FP.USER_ID = $1
      GROUP BY
        P.ID, P.SLUG, P.CATEGORY_ID, P.MAIN_IMAGE, P.NAME,
        P.BUY_NOW_PRICE, P.END_TIME, P.AUTO_EXTEND, P.CREATED_AT,
        BID.NAME, FP.CREATED_AT
      ORDER BY FP.CREATED_AT DESC
    `;

    const favoriteProducts = await this.safeQuery<ProductPreview>(sql, [
      userId,
    ]);

    return favoriteProducts;
  }

  async addFavorite(
    userId: number,
    productId: number
  ): Promise<MutationResult> {
    const sql = `
      INSERT INTO AUCTION.FAVORITE_PRODUCTS (PRODUCT_ID, USER_ID, CREATED_AT, UPDATED_AT)
      VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    await this.safeQuery(sql, [productId, userId]);
    return {
      success: true,
    };
  }

  async removeFavorite(
    userId: number,
    productId: number
  ): Promise<MutationResult> {
    const sql = `
      DELETE FROM AUCTION.FAVORITE_PRODUCTS
      WHERE PRODUCT_ID = $1 AND USER_ID = $2
    `;

    await this.safeQuery(sql, [productId, userId]);
    return {
      success: true,
    };
  }
}
