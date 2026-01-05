import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ResetUserPasswordRequest,
} from "../../shared/src/types";
import { authService } from "@/services/authService";


class AuthHook {
  static useResetUserPassword() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (user: ResetUserPasswordRequest) => authService.resetUserPassword(user),

      onSuccess: () => {
        toast.success("Yêu cầu thay đổi mật khẩu thành công");
      },

      onError: (error) => {
        toast.error("Yêu cầu thay đổi mật khẩu thất bại");
      },
    });
  }
}
export default AuthHook;
