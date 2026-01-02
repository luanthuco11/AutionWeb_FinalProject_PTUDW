"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import React from "react";
import { useState, useEffect } from "react";
import LoadingSpinner from "../LoadingSpinner";

/**
 * Component bảo vệ route phía Client (Next.js)
 *
 * @description
 * - Kiểm tra trạng thái đăng nhập của người dùng
 * - Tự động refresh access token khi reload trang
 * - Fetch thông tin user nếu đã có token nhưng chưa có thông tin user
 *
 * @example
 * <AuthRoute>
 *   <Dashboard />
 * </AuthRoute>
 */
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken, user, loading, refresh, fetchMe } = useAuthStore();
  const [starting, setStarting] = useState(true);

  useEffect(() => {
    const init = async () => {
      // Xay ra khi refresh trang
      if (!accessToken) {
        await refresh();
      }

      if (accessToken && !user) {
        await fetchMe();
      }

      setStarting(false);
    };
    init();
  }, []);

  // Nếu chưa mount (đang load lại trang) hoặc không có token -> Hiện loading hoặc null
  if (starting || loading) {
    return <LoadingSpinner />; // Hoặc <LoadingScreen /> rất quan trọng để tránh nháy
  }

  console.log("hello");
  return <>{children}</>;
};

export default AuthRoute;
