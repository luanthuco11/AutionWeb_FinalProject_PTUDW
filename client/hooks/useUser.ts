import { STALE_10_MIN } from "@/config/query.config";
import { UserService } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface UpdateUserPayload {
  name: string | "";
  email: string | "";
  address: string | "";
  profile_img: File | null;
}

class UserHook {
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
}
export default UserHook;
