import { BaseService } from "./BaseService";
import { User } from "../../../shared/src/types";

interface UpdateUserPayload extends User {
    id: number;
    name: string | "";
    email: string | "";
    address: string | "";
    profile_img: string | "";
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

        return profile;
    }

    async updateProfile(payload: UpdateUserPayload) {
        const sql =
            `
            UPDATE admin.users
            SET name = $1,
                email = $2,
                address = $3,
                profile_img = $4
            WHERE id = $5
            `
        const {name, email, address, profile_img, id} = payload
        const params = [name, email, address, profile_img, id]
        const result = await this.safeQuery(sql, params);

        return result;
    }
}
