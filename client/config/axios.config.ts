import { useAuthStore } from "@/store/auth.store";
import axios from "axios";
import API_ROUTES from "../../shared/src/api";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // cho phép trình duyệt gửi & nhận COOKIE khi gọi API ở domain khác
  timeout: 10000,
});

// lấy AccessToken từ useAuthStore (Zustand) và gắn vào header Authorization.
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Xử lí api nếu accessToken hết hạn tự động xin cấp accessToken mới với số lần xin thử tối đa là 4
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Nếu request bị lỗi chính là request đăng nhập, đăng ký hoặc request đang đi xin token mới, thì không thử lại nữa
    if (
      originalRequest.url.includes("/auth/signIn") ||
      originalRequest.url.includes("/auth/signUp") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject();
    }

    originalRequest._retryCount = originalRequest._retryCount || 0;
    // Neu token hết hạn và số lần thử < 4
    if (error.response?.status === 403 && originalRequest._retryCount < 4) {
      originalRequest._retryCount += 1;
      try {
        // Gọi API để xin Access Token mới
        const res = await api.post(API_ROUTES.auth.refresh, {
          withCredentials: true,
        });
        // Lấy token mới
        const newAccessToken = res.data.accessToken;

        // Lưu token mới vào Store:
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Cập nhật token mới vào header của request cũ bị lỗi:
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Gửi lại request cũ ngay lập tức
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export async function safeRequest<T>(fn: () => Promise<T>) {
  try {
    return {
      success: true,
      data: await fn(),
      error: null,
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error?.response?.data || error.message,
    };
  }
}
