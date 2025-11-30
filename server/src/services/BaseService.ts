import Database from "../config/db";

export class BaseService {
  protected pool = Database.getInstance();

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
}
