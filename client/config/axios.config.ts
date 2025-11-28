import { useAuthStore } from "@/store/auth.store";
import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Interceptor để thêm header user
api.interceptors.request.use((config) => {
  const user = useAuthStore.getState().user; // lấy state trực tiếp, không dùng hook
  if (user) {
    // Nếu config.headers là AxiosHeaders, dùng set()
    config.headers?.set?.("user-id", user.id);
  }
  return config;
});

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
