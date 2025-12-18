import { STALE_10_MIN } from "@/config/query.config";
import { UserService } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "../../shared/src/types/Pagination";

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
        queryClient.invalidateQueries({
          queryKey: ["user_profile"],
        });
      },
    });
  }
  static useDeleteUser() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => UserService.deleteUser(id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["users"],
        });
      },
    });
  }
}
export default UserHook;
