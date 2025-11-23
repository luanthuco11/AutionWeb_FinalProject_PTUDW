import { STALE_10_MIN } from "@/config/query.config";
import { OrderService } from "@/services/orderService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

class OrderHook {
  static useOrder() {
    return useQuery({
      queryKey: ["order"],

      queryFn: () => OrderService.getOrder(),
      
      staleTime: STALE_10_MIN,

      select: (data) => {
        return data;
      }
    });
  }

  static useOrderById(productId: number) {
    return useQuery({
      queryKey: ["order_by_id", productId],
      
      queryFn: () => OrderService.getOrderById(productId),

      enabled: !!productId,

      select: (data) => {
        return data;
      }
    });
  }

  static useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { payload: any }) =>
        OrderService.createOrder('/order'),

      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["order"]
        })
      }
    });
  }

  static useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number, status: string}) =>
        OrderService.updateOrderStatus(params.productId, params.status),

      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["order_by_id", params.productId]
        })
      }
    })
  }

  static useOrderChat(productId: number) {
    return useQuery({
      queryKey: ["order_chat", productId],

      queryFn: () => OrderService.getOrderChat(productId),

      enabled: !!productId,

      select: (data) => {
        return data;
      }
    })
  }

  static useCreateOrderChat() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number, payload: any}) =>
        OrderService.createOrderChat(params.productId, params.payload),

      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["order_chat", params.productId]
        })
      }
    })
  }
}

export default OrderHook