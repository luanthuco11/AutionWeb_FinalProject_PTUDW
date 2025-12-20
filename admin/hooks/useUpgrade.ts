import { STALE_10_MIN } from "@/config/query.config";
import { UpgradeRequestService } from "@/services/upgradeRequestService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pagination } from "../../shared/src/types/Pagination";
import toast from "react-hot-toast";

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
        toast.success("Chấp nhận yêu cầu thành công!")
        queryClient.invalidateQueries({
          queryKey: ["request"],
        });
      },
      onError: (error) => {
        toast.error("Chấp nhận yêu cầu thất bại!")
        console.log(error);
      }
    });
  }

  static useUpdateRejectRequest() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: number) => UpgradeRequestService.updateRejectRequest(id),

      onSuccess: (_, id) => {
        toast.success("Từ chối yêu cầu thành công")
        queryClient.invalidateQueries({
          queryKey: ["request"],
        });
      },
      onError: (error) => {
        toast.error("Từ chối yêu cầu thất bại!")
        console.log(error);
      }
    });
  }
}
export default UpgradeRequestHook;
