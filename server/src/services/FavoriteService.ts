import { BaseService } from "./BaseService";

export class FavoriteService extends BaseService{
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

  async getFavorite() {
    const sql = `
      SELECT * 
      FROM FAVORITE_PRODUCTS FP
      JOIN PRODUCTS P ON P.ID = FP.PRODUCT_ID 
      WHERE FP.USER_ID = 1
    `
    const favoriteProducts = await this.safeQuery(sql);
    return favoriteProducts;
  }

  async addFavorite(productId: number) {
    const sql = `
      INSERT INTO FAVORITE_PRODUCTS (PRODUCT_ID, USER_ID, CREATED_AT, UPDATED_AT)
      VALUES ($1, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `

    await this.safeQuery(sql, [productId]);
    return {
      success: true
    }
  }

  async removeFavorite(productId: number) {
    const sql = `
      DELETE FROM FAVORITE_PRODUCTS
      WHERE PRODUCT_ID = $1 AND USER_ID = 1
    `

    await this.safeQuery(sql, [productId]);
    return {
      success: true
    };
  }
}