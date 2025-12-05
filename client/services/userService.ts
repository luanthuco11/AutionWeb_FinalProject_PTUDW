import { api, safeRequest } from "@/config/axios.config";
import API_ROUTES from "../../shared/src/api"

interface UpdateUserPayload {
    name: string | '';
    email: string | '';
    address: string | '';
    profile_img: File | null;
}

export class UserService {
  static async getProfile(): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.user.getProfile());
      return res.data;
    })
  }

  static async updateProfile(data: FormData): Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(API_ROUTES.user.updateProfile, data);
      return res.data;
    })
  }
}