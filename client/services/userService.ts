import { api, safeRequest } from "@/config/axios.config";
import API_ROUTES from "../../shared/src/api"
import { User } from "../../shared/src/types";

interface UpdateUserPayload extends User {
    id: number;
    name: string | "";
    email: string | "";
    address: string | "";
    profile_img: string | "";
}


export class UserService {
  static async getProfile(id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.user.getProfile(id));
      return res.data;
    })
  }

  static async updateProfile(data: UpdateUserPayload): Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(API_ROUTES.user.updateProfile, data);
      return res.data;
    })
  }
}