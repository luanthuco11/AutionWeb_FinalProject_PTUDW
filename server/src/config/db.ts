// import { Pool } from "pg";

// class Database {
//   private static _instance: Pool;

//   private constructor() {}

//   public static getInstance(): Pool {
//     if (!Database._instance) {
//       Database._instance = new Pool({
//         connectionString: process.env.DATABASE_URL,
//         ssl: {
//           rejectUnauthorized: false,
//         },
//       });
//     }
//     return Database._instance;
//   }
// }

// export default Database;

import { Pool } from "pg";

// 👇 Global type để tránh TypeScript báo lỗi
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

class Database {
  private constructor() {}

  public static getInstance(): Pool {
    if (!global._pgPool) {
      global._pgPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      });

      console.log("🔥 PostgreSQL Pool initialized");
    }
    return global._pgPool;
  }
}

export default Database;
