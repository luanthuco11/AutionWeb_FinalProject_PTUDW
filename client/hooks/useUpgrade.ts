import { STALE_10_MIN } from "@/config/query.config";
import { UpgradeRequestService } from "@/services/upgradeRequestService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

class UpgradeRequestHook {
    static useGetRequestStatus(id: string) {
        return useQuery({
            queryKey: ["request_status", id],

            queryFn: () => UpgradeRequestService.getRequestStatus(id),

            staleTime: STALE_10_MIN,

            select: (data) => {
                return data.data;
            }
        });
    }

    static useCreateSellerRequest(id: string) {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: () =>
                UpgradeRequestService.createSellerRequest(id),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["request_status", id]
                })
            }
        })
    }

    static useUpdateApproveRequest(id: string) {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: () =>
                UpgradeRequestService.updateApproveRequest(id),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["request_status", id]
                })
            }
        })
    }

    static useUpdateRejectRequest(id: string) {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: () =>
                UpgradeRequestService.updateRejectRequest(id),

            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["request_status", id]
                })
            }
        })
    }
}
export default UpgradeRequestHook