import {
  UserOTP,
  UserRegisterOTP,
} from "./../../shared/src/types/ResetPasswordOTP";
import { create } from "zustand";
import {
  ForgetPasswordRequest,
  RegisterRequest,
  ResetPasswordRequest,
  SignRequest,
} from "../../shared/src/types";
import { authService } from "@/services/authService";
import { AuthState } from "@/types/store";
import { toast } from "react-toastify";

//  state đại diện cho toàn bộ store hiện tại
// set(): Dùng để GHI (cậ  nhật/thay đổi) state (chỉ dùng bên trong store).
// get(): Dùng để ĐỌC (lấy) giá trị hiện tại của state (chỉ dùng bên trong store)
export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  forgetUserId: null,
  pendingUserEmail: null,
  resetToken: null,

  verifyOTPType: null,

  setAccessToken: (accessToken: string) => {
    set({ accessToken });
  },

  setResetToken: (resetToken: string) => {
    set({ resetToken });
  },

  setVerifyOTPType: (verifyOTPType: string) => {
    set({ verifyOTPType });
  },

  setPendingUserEmail: (pendingUserEmail: string) => {
    set({ pendingUserEmail });
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (user: RegisterRequest) => {
    try {
      set({ loading: true });
      // goi api

      const { message } = await authService.signUp(user);
      get().setPendingUserEmail(user.email);
      get().setVerifyOTPType("register-otp");
      toast.success(message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      throw new Error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (user: SignRequest) => {
    try {
      set({ loading: true });

      // Khi đăng nhập Ethành công thì lấy accessToken của user đó
      const { accessToken, message } = await authService.signIn(user);
      get().setAccessToken(accessToken);

      // Lấy thông tin về user đang đăng nhập và lưu thông tin user vào trong store
      await get().fetchMe();

      toast.success(message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      throw new Error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  forgetPassword: async (user: ForgetPasswordRequest) => {
    try {
      set({ loading: true });

      const data = await authService.forgetPassword(user);
      set({ forgetUserId: data.userId });
      get().setVerifyOTPType("forgetPassword-otp");
      console.log(data);
      toast.success(data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      throw new Error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      const { message } = await authService.signOut();
      toast.success(message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      throw new Error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.log(error);
      set({ user: null, accessToken: null });
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      // Check nếu refreshToken hợp lệ và còn hạn --> sinh ra accessToken mới
      const accessToken = await authService.refresh();
      setAccessToken(accessToken);
      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.log(error);
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },

  verifyOTP: async (user: UserOTP) => {
    try {
      set({ loading: true });
      const { resetToken, message } = await authService.verifyOTP(user);
      get().setResetToken(resetToken);
      toast.success(message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      throw new Error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  verifyRegisterOTP: async (user: UserRegisterOTP) => {
    try {
      set({ loading: true });
      const { message } = await authService.verifyRegisterOTP(user);
      toast.success(message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      throw new Error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (user: ResetPasswordRequest) => {
    try {
      const resetToken = get().resetToken;
      set({ loading: true });
      const data = await authService.resetPassword(user, resetToken);

      toast.success(data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      throw new Error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  reSendRegisterOTP: async () => {
    try {
      const email = get().pendingUserEmail;
      set({ loading: true });
      const data = await authService.reSendRegisterOTP(email);
      toast.success(data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      throw new Error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  reSendRResetPasswordOTP: async () => {
    try {
      set({ loading: true });
      const userId = get().forgetUserId;
      const data = await authService.reSendRResetPasswordOTP(userId);
      toast.success(data.message);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
      throw new Error(error.message);
    } finally {
      set({ loading: false });
    }
  },
}));
