import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { STALE_10_MIN } from "@/config/query.config";
import { BidService } from "@/services/bidService";
import { BidLog } from "../../shared/src/types";

class BidHook {
  static useBidLogs(product_id: number) {
    return useQuery({
      queryKey: ["bid_logs"],
      queryFn: () => BidService.getBidlogs(product_id),
      staleTime: STALE_10_MIN,
      select: (data) => {
        return data.data;
      },
    });
  }

  static useCreateBid() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (bid: BidLog) => BidService.createBid(bid),
      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["bid_logs"],
        });
      },
    });
  }
  static useCreateReject() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (bid: BidLog) => BidService.createReject(bid),
      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["bid_logs"],
        });
      },
    });
  }
}

export default BidHook;
