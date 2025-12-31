import { SystemService } from "../services/SystemService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { STALE_10_MIN } from "@/config/query.config";
import {toast} from "react-toastify";
class SystemHook {
  static useGetProductRenewTime() {
    return useQuery({
      queryKey: ["system_config"],
      queryFn: () => SystemService.getProductRenewTime(),
      staleTime: STALE_10_MIN,
      select: (data) => {
        return data.data.result;
      },
    });
  }
  static useUpdateProductRenewTime() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (time: number) => SystemService.updateProductRenewTime(time),

      onSuccess: () => {
        toast.success("Cập nhật thời gian gia hạn thành công!");
        queryClient.invalidateQueries({
          queryKey: ["system_config"],
        });
      },
      onError: (error) => {
        toast.error("Cập nhật thời gian gia hạn thất bại!");
        console.log(error);
      },
    });
  }
  static useGetProductMinTime() {
    return useQuery({
      queryKey: ["system_config_min_time"],
      queryFn: () => SystemService.getProductMinTime(),
      staleTime: STALE_10_MIN,
      select: (data) => {
        return data.data.result;
      },
    });
  }
  static useUpdateProductMinTime() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (time: number) => SystemService.updateProductMinTime(time),

      onSuccess: () => {
        toast.success("Cập nhật thời gian nhỏ nhất thành công!");
        queryClient.invalidateQueries({
          queryKey: ["system_config_min_time"],
        });
      },
      onError: (error) => {
        toast.error("Cập nhật thời gian nhỏ nhất thất bại!");
        console.log(error);
      },
    });
  }
}
export default SystemHook;
