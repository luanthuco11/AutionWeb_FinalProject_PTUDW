import { BaseService } from "./BaseService";
export class UserService extends BaseService {
  private static instance: UserService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getUsers() {
    const sql = `SELECT * FROM product.products`;
    const users = await this.safeQuery(sql);
    // const result = await this.safeQuery<User>(sql, [id]); (cung duoc)
    // const users = await this.safeQuery(sql, params);
    return users;
  }
}
