import { createSlugUnique } from "../utils";
import { BaseService } from "./BaseService";
import { R2Service } from "./R2Service";

interface UpdateUserPayload {
    id: number;
    name: string | "";
    email: string | "";
    address: string | "";
    profile_image: Express.Multer.File;
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

    async getUsers() {
        const sql = 
            `
            SELECT * FROM product.products
            `;
        const users = await this.safeQuery(sql);
        // const result = await this.safeQuery<User>(sql, [id]); (cung duoc)
        // const users = await this.safeQuery(sql, params);
        return users;
    }
    async getProfile(id: number) {
        const sql =
            `
            SELECT * FROM admin.users
            WHERE id = $1
            `
        const params = [id];
        const profile = await this.safeQuery(sql, params);

        return profile[0];
    }

    async updateProfile(payload: UpdateUserPayload) {
        const r2 = R2Service.getInstance();
        const filesArray = payload.profile_image ? [payload.profile_image] : [];
        const [avatarUrl] = await r2.uploadFilesToR2(
            filesArray,
            "user"
        );
        const sql =
            `
            UPDATE admin.users
            SET name = $1,
                email = $2,
                address = $3,
                profile_img = $4
            WHERE id = $5
            `
        const {name, email, address, id} = payload
        const params = [name, email, address, avatarUrl, id]
        const result = await this.safeQuery(sql, params);

        return result;
    }
}
