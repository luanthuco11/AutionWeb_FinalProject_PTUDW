import { profile } from "console";
import { User } from "../../../shared/src/types";
import { MutationResult } from "../../../shared/src/types/Mutation";
import { createSlugUnique } from "../utils";
import { BaseService } from "./BaseService";
import { ProductService } from "./ProductService";
import { R2Service } from "./R2Service";
interface UpdateUserPayload {
  id: number;
  name: string | "";
  email: string | "";
  address: string | "";
  profile_image: Express.Multer.File;
  day_of_birth: Date;
}

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

  async getUsers(page: number, limit: number): Promise<User[]> {
    const offset = (page - 1) * limit;

    const sql = `
            SELECT * FROM admin.users as u
            WHERE u.role != $1 AND u.role != $4
            ORDER BY u.created_at desc
            OFFSET $2
            LIMIT $3
            `;
    const params = ["admin", offset, limit, "guest"];

    const rawUsers: User[] = await this.safeQuery(sql, params);
    const users = rawUsers.map((u) => {
      const { negative_points, positive_points, ...rest } = u;
      return {
        ...rest,
        negative_points: negative_points === null ? 0 : negative_points,
        positive_points: positive_points === null ? 0 : positive_points,
      };
    });

    return users;
  }
  async getProfile(id: number) {
    const sql = `
            SELECT * FROM admin.users
            WHERE id = $1
            `;
    const params = [id];
    const profile = await this.safeQuery(sql, params);

    return profile[0];
  }
  async getTotalUser(): Promise<number | undefined> {
    const sql = `
            SELECT COUNT(*) AS total
            FROM admin.users u
            WHERE u.role != $1 
            `;
    const params = ["admin"];
    const totalUsers: { total: number }[] = await this.safeQuery(sql, params);
    return totalUsers[0]?.total;
  }
  async updateProfile(payload: UpdateUserPayload) {
    const r2 = R2Service.getInstance();
    const filesArray = payload.profile_image ? [payload.profile_image] : [];
    const [avatarUrl] = await r2.uploadFilesToR2(filesArray, "user");
    if (payload.profile_image === undefined) {
      const sql = `
            UPDATE admin.users
            SET name = $1,
                email = $2,
                address = $3,
                day_of_birth = $4
            WHERE id = $5
            `;
      const { name, email, address, day_of_birth, id } = payload;
      const params = [name, email, address, day_of_birth, id];
      const result = await this.safeQuery(sql, params);

      return result;
    } else {
      const sql = `
            UPDATE admin.users
            SET name = $1,
                email = $2,
                address = $3,
                profile_img = $4,
                day_of_birth = $6
            WHERE id = $5
            `;
      const { name, email, address, id, day_of_birth } = payload;
      const params = [name, email, address, avatarUrl, id, day_of_birth];
      const result = await this.safeQuery(sql, params);
      return result;
    }
  }
  async deleteUser(id: number): Promise<MutationResult> {
    const params = [id];
    const sql = " DELETE FROM admin.users WHERE users.id = $1";
    await this.safeQuery(sql, params);

    return {
      success: true,
    };
  }
}
