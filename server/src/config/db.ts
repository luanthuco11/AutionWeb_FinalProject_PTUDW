import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();


class Database {
  private static _instance: Pool;

  private constructor() {}

  public static getInstance(): Pool {
    if (!Database._instance) {
      Database._instance = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false, 
        },
      });
    }
    return Database._instance;
  }
}

export default Database;
