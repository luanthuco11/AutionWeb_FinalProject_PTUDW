import {
  UserOTP,
  UserRegisterOTP,
} from "./../../shared/src/types/ResetPasswordOTP";
import {
  ForgetPasswordRequest,
  RegisterRequest,
  ResetPasswordRequest,
  ResetUserPasswordRequest,
  SignRequest,
} from "../../shared/src/types";
import { api } from "@/config/axios.config";
import API_ROUTES from "../../shared/src/api";

export const authService = {
  signUp: async (user: RegisterRequest) => {
    try {
      const res = await api.post(API_ROUTES.auth.createAccount, user, {
        withCredentials: true, // cho phép trình duyệt gửi & nhận COOKIE khi gọi API ở domain khác
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message ?? "Lỗi khi đăng kí");
    }
  },

  signIn: async (user: SignRequest) => {
    try {
      const res = await api.post(API_ROUTES.auth.signInAdmin, user, {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message ?? "Lỗi khi đăng nhập");
    }
  },

  forgetPassword: async (user: ForgetPasswordRequest) => {
    try {
      const res = await api.post(API_ROUTES.auth.forgetPassword, user, {
        withCredentials: true, // cho phép trình duyệt gửi & nhận COOKIE khi gọi API ở domain khác
      });
      return res.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ?? "Lỗi khi quên mật khẩu"
      );
    }
  },

  verifyOTP: async (user: UserOTP) => {
    try {
      const res = await api.post(API_ROUTES.auth.verifyOTP, user, {
        withCredentials: true, // cho phép trình duyệt gửi & nhận COOKIE khi gọi API ở domain khác
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message ?? "Lỗi khi xác thực OTP");
    }
  },

  verifyRegisterOTP: async (user: UserRegisterOTP) => {
    try {
      const res = await api.post(API_ROUTES.auth.verifyRegisterOTP, user, {
        withCredentials: true, // cho phép trình duyệt gửi & nhận COOKIE khi gọi API ở domain khác
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message ?? "Lỗi khi xác thực OTP");
    }
  },

  signOut: async () => {
    try {
      const res = await api.post(
        API_ROUTES.auth.signOutAdmin,
        {},
        { withCredentials: true }
      );
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message ?? "Lỗi khi đăng xuất");
    }
  },

  fetchMe: async () => {
    const res = await api.get(API_ROUTES.user.fetchMe, {
      withCredentials: true,
    });
    return res.data.user;
  },

  refresh: async () => {
    const res = await api.post(
      API_ROUTES.auth.refreshAdmin,
      {},
      {
        withCredentials: true,
      }
    );
    return res.data.accessToken;
  },

  resetPassword: async (
    user: ResetPasswordRequest,
    resetToken: string | null
  ) => {
    try {
      const res = await api.post(API_ROUTES.auth.resetPassword, user, {
        headers: {
          Authorization: `Bearer ${resetToken}`,
        },
      });

      return res.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ?? "Lỗi khi đặt lại mật khẩu"
      );
    }
  },

  resetUserPassword: async (
    user: ResetUserPasswordRequest,
  ) => {
    try {
      const res = await api.patch(API_ROUTES.auth.resetUserPassword, user);

      return res.data;
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message ?? "Lỗi khi đặt lại mật khẩu"
      );
    }
  },

  reSendRegisterOTP: async (email: string | null) => {
    try {
      console.log("email service: ", email);
      const res = await api.post(API_ROUTES.auth.reSendRegisterOTP, { email });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message ?? "Lỗi khi gửi lại OTP");
    }
  },

  reSendRResetPasswordOTP: async (userId: number | null) => {
    try {
      const res = await api.post(API_ROUTES.auth.reSendResetPasswordOTP, {
        userId,
      });

      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message ?? "Lỗi khi gửi lại OTP");
    }
  },
};
