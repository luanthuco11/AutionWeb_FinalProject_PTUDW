import { create } from "zustand";
import { RegisterRequest, SignRequest } from "../../shared/src/types";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import { AuthState } from "@/types/store";

//  state đại diện cho toàn bộ store hiện tại
// set(): Dùng để GHI (cậ  nhật/thay đổi) state (chỉ dùng bên trong store).
// get(): Dùng để ĐỌC (lấy) giá trị hiện tại của state (chỉ dùng bên trong store)
export const useAuthStore = create<AuthState>((set, get) => ({
  /**
   * Access token (JWT) dùng cho các request cần xác thực
   */
  accessToken: null,
  /**
   * Thông tin người dùng hiện tại
   */
  user: null,
  /**
   * Thông tin người dùng hiện tại
   */
  loading: false,

  /**
   * Cập nhật access token vào store
   *
   * @param accessToken JWT access token
   */
  setAccessToken: (accessToken: string) => {
    set({ accessToken });
  },

  /**
   * Xoá toàn bộ trạng thái xác thực
   *
   * @description
   * - Dùng khi đăng xuất
   * - Hoặc khi refresh token thất bại
   */
  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  /**
   * Đăng ký tài khoản mới
   *
   * @param user Dữ liệu đăng ký (email, password, ...)
   *
   * @description
   * - Gửi request đăng ký lên server
   * - Không tự động đăng nhập sau khi đăng ký
   */
  signUp: async (user: RegisterRequest) => {
    try {
      set({ loading: true });
      // goi api

      await authService.signUp(user);
      toast.success("Đăng kí thành công");
    } catch (error) {
      console.log(error);
      toast.error("Đăng kí không thành công");
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Đăng nhập hệ thống
   *
   * @param user Thông tin đăng nhập (email, password)
   *
   * @description
   * - Gọi API signIn để lấy access token
   * - Lưu access token vào store
   * - Fetch thông tin user ngay sau khi đăng nhập
   */
  signIn: async (user: SignRequest) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIn(user);
      get().setAccessToken(accessToken);
      // Lấy thông tin về user đang đăng nhập
      await get().fetchMe();
      toast.success("Chào mừng bạn quay lại với trang của chúng tôi");
    } catch (error) {
      console.log(error);
      toast.error("Đăng nhập không thành công");
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Đăng xuất khỏi hệ thống
   *
   * @description
   * - Xoá toàn bộ auth state ở client
   * - Gọi API signOut để server xoá refresh token (nếu có)
   */
  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      toast.success("Đăng xuất thành công");
    } catch (error) {
      console.log(error);
      toast.error("Đăng xuất không thành công");
    }
  },

  /**
   * Lấy thông tin người dùng hiện tại
   *
   * @description
   * - Gọi API GET /auth/me
   * - Yêu cầu access token hợp lệ trong header Authorization
   * - Lưu thông tin user vào store
   */
  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.log(error);
      set({ user: null, accessToken: null });
      toast.error("Lỗi xảy ra khi lấy dữ liệu từ người dùng");
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Refresh access token khi token hết hạn
   *
   * @description
   * - Gửi request refresh token (qua httpOnly cookie)
   * - Nhận access token mới từ server
   * - Tự động fetch user nếu chưa có thông tin user
   *
   * @note
   * - Được gọi khi reload trang (F5)
   * - Hoặc khi access token hết hạn
   */
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
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },
}));
