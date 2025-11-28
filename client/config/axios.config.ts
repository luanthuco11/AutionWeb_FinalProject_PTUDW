import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
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
