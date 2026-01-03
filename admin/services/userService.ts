import { api, safeRequest } from "@/config/axios.config";
import API_ROUTES from "../../shared/src/api";
import { Pagination } from "../../shared/src/types/Pagination";
import { ChangePasswordRequest } from "../../shared/src/types";

interface UpdateUserPayload {
  name: string | "";
  email: string | "";
  address: string | "";
  profile_img: File | null;
}

export class UserService {
  static async getUsers(pagination: Pagination): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.user.getUsers(pagination));
      return res.data;
    });
  }
  static async getProfile(): Promise<any> {
    return safeRequest(async () => {
      const res = await api.get(API_ROUTES.user.getProfile());
      return res.data;
    });
  }

  static async updateProfile(data: FormData): Promise<any> {
    return safeRequest(async () => {
      const res = await api.patch(API_ROUTES.user.updateProfile, data);
      return res.data;
    });
  }
  static async deleteUser(id: number): Promise<any> {
    return safeRequest(async () => {
      const res = await api.delete(API_ROUTES.user.deleteUser(id));
      return res.data;
    });
  }
  static async changePassword(user: ChangePasswordRequest): Promise<any> {
    return safeRequest(async () => {
      const res = await api.post(API_ROUTES.auth.changePassword, user);
      return res.data;
    });
  }
}
