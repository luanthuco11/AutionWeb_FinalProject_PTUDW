import Database from "../config/db";
import { PoolClient } from "pg";

export class BaseService {
  protected pool = Database.getInstance();
  protected async getClient(): Promise<PoolClient> {
    if (!this.pool) throw new Error("Database pool not initialized");
    return this.pool.connect();
  }
  protected async safeQuery<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.pool) throw new Error("Database pool not initialized");
    try {
      const result = await this.pool.query(sql, params);
      return result.rows as T[];
    } catch (error: any) {
      console.error("[BaseService] Database query error:", {
        sql,
        params,
        error,
      });
      throw new Error("[BaseService] Database operation failed");
    }
  }
  // Giống hàm safeQuery nhưng truyền thêm poolClient -> hỗ trợ transaction
  protected async safeQueryWithClient<T>(
    client: PoolClient,
    sql: string,
    params: any[] = []
  ): Promise<T[]> {
    try {
      const result = await client.query(sql, params);
      return result.rows as T[];
    } catch (error: any) {
      console.error("[BaseService] Database client query error:", {
        sql,
        params,
        error,
      });
      throw error;
    }
  }
}
