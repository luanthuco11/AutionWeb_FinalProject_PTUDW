import { STALE_10_MIN } from "@/config/query.config";
import { UserService } from "@/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface UpdateUserPayload {
    name: string | '';
    email: string | '';
    address: string | '';
    profile_img: string | '';
}

class UserHook {
    static useGetProfile() {
        return useQuery({
            queryKey: ["user_profile"],

            queryFn: () => UserService.getProfile(),

            staleTime: STALE_10_MIN,

            select: (data) => {
                return data.data.profile;
            }
        });
    }

    static useUpdateProfile() {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (data: UpdateUserPayload) =>
                UserService.updateProfile(data),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["user_profile"]
                })
            }
        })
    }
}
export default UserHook