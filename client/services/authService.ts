import { RegisterRequest, SignRequest } from "../../shared/src/types";
import { api } from "@/config/axios.config";
import API_ROUTES from "../../shared/src/api";

export const authService = {
  signUp: async (user: RegisterRequest) => {
    const res = await api.post(API_ROUTES.auth.createAccount, user, {
      withCredentials: true,  // cho phép trình duyệt gửi & nhận COOKIE khi gọi API ở domain khác
    });
    return res.data;
  },

  signIn: async (user: SignRequest) => {
    const res = await api.post(API_ROUTES.auth.signIn, user, {
      withCredentials: true, 
    });
    return res.data;
  },

  signOut: async () => {
    return api.post(API_ROUTES.auth.signOut, {}, { withCredentials: true });
  },

    fetchMe: async () => {
    const res = await api.get(API_ROUTES.user.fetchMe, {
      withCredentials: true,
    });
    return res.data.user;
  },

  refresh: async () => {
    const res = await api.post(API_ROUTES.auth.refresh, {
      withCredentials: true,
    });
    return res.data.accessToken;
  },
};
