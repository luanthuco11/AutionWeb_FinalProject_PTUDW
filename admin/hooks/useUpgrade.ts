import { STALE_10_MIN } from "@/config/query.config";
import { UpgradeRequestService } from "@/services/upgradeRequestService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "../../shared/src/types/Pagination";

class UpgradeRequestHook {
  static useGetRequestStatus(userId: number) {
    return useQuery({
      queryKey: ["request", userId],

      queryFn: () => UpgradeRequestService.getRequestStatus(userId),

      staleTime: STALE_10_MIN,

      enabled: !!userId,

      select: (data) => {
        return data.data.result;
      },
    });
  }
  static useUpgradeRequests(pagination: Pagination) {
    return useQuery({
      queryKey: ["request", pagination.page, pagination.limit],

      queryFn: () => UpgradeRequestService.getUpgradeRequests(pagination),

      staleTime: STALE_10_MIN,

      select: (data) => {
        return data.data;
      },
    });
  }

  static useCreateSellerRequest() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: () => UpgradeRequestService.createSellerRequest(),

      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["request_status"],
        });
      },
    });
  }

  static useUpdateApproveRequest() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: number) =>
        UpgradeRequestService.updateApproveRequest(id),

      onSuccess: (_, id) => {
        queryClient.invalidateQueries({
          queryKey: ["request"],
        });
      },
    });
  }

  static useUpdateRejectRequest() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: number) => UpgradeRequestService.updateRejectRequest(id),

      onSuccess: (_, id) => {
        queryClient.invalidateQueries({
          queryKey: ["request"],
        });
      },
    });
  }
}
export default UpgradeRequestHook;
