import { STALE_10_MIN } from "@/config/query.config";
import { UserService } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "../../shared/src/types/Pagination";
import { toast } from "react-toastify";
import { ChangePasswordRequest } from "../../shared/src/types";

interface UpdateUserPayload {
  name: string | "";
  email: string | "";
  address: string | "";
  profile_img: File | null;
}

class UserHook {
  static useGetUsers(pagination: Pagination) {
    return useQuery({
      queryKey: ["users", pagination.page, pagination.limit],

      queryFn: () => UserService.getUsers(pagination),

      staleTime: STALE_10_MIN,

      select: (data) => {
        return data.data;
      },
    });
  }
  static useGetProfile() {
    return useQuery({
      queryKey: ["user_profile"],

      queryFn: () => UserService.getProfile(),

      staleTime: STALE_10_MIN,

      select: (data) => {
        return data.data.profile;
      },
    });
  }

  static useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (data: FormData) => UserService.updateProfile(data),

      onSuccess: () => {
        toast.success("Cập nhật thông tin thành công");
        queryClient.invalidateQueries({
          queryKey: ["user_profile"],
        });
      },

      onError: (error) => {
        toast.error("Cập nhật thông tin thất bại");
      },
    });
  }

  static useChangePassword() {
    return useMutation({
      mutationFn: (user: ChangePasswordRequest) =>
        UserService.changePassword(user),

      onSuccess: () => {
        toast.success("Thay đổi mật khẩu thành công");
      },

      onError: (error) => {
        toast.error("Cập nhật thông tin thất bại");
      },
    });
  }
  static useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => UserService.deleteUser(id),
      onSuccess: () => {
        toast.success("Xóa người dùng thành công!");
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      },
      onError: (error) => {
        toast.error("Xóa người dùng thất bại!");
        console.log(error);
      },
    });
  }
}
export default UserHook;
