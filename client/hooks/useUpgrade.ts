import { STALE_10_MIN } from "@/config/query.config";
import { UpgradeRequestService } from "@/services/upgradeRequestService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

class UpgradeRequestHook {
    static useGetRequestStatus(id: string) {
        return useQuery({
            queryKey: ["request_status", id],

            queryFn: () => UpgradeRequestService.getRequestStatus(id),

            staleTime: STALE_10_MIN,

            enabled: !!id,

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