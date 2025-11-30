import { STALE_10_MIN } from "@/config/query.config";
import { UpgradeRequestService } from "@/services/upgradeRequestService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

class UpgradeRequestHook {
    static useGetRequestStatus(userId: number) {
        return useQuery({
            queryKey: ["request_status", userId],

            queryFn: () => UpgradeRequestService.getRequestStatus(userId),

            staleTime: STALE_10_MIN,

            enabled: !!userId,

            select: (data) => {
                return data.data.result;
            }
        });
    }

    static useCreateSellerRequest() {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: () =>
                UpgradeRequestService.createSellerRequest(),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["request_status"]
                })
            }
        })
    }

    static useUpdateApproveRequest() {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (id: string) =>
                UpgradeRequestService.updateApproveRequest(id),

            onSuccess: (_, id) => {
                queryClient.invalidateQueries({
                    queryKey: ["request_status", id]
                })
            }
        })
    }

    static useUpdateRejectRequest() {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: (id: string) =>
                UpgradeRequestService.updateRejectRequest(id),

            onSuccess: (_, id) => {
                queryClient.invalidateQueries({
                    queryKey: ["request_status", id]
                })
            }
        })
    }
}
export default UpgradeRequestHook