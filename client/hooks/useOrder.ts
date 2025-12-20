import { STALE_10_MIN } from "@/config/query.config";
import { OrderService } from "@/services/orderService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  NewOrderMessageRequest,
  NewOrderRequest,
  OrderPayment,
  OrderStatus,
} from "../../shared/src/types";
import { toast } from "react-toastify";

class OrderHook {
  static useOrder() {
    return useQuery({
      queryKey: ["order"],

      queryFn: () => OrderService.getOrder(),

      staleTime: STALE_10_MIN,

      select: (data) => {
        return data;
      },
    });
  }

  static useOrderById(productId: number) {
    return useQuery({
      queryKey: ["order_by_id", productId],

      queryFn: () => OrderService.getOrderById(productId),

      enabled: !!productId,

      select: (data) => {
        return data.data;
      },
    });
  }

  static useCreateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { payload: NewOrderRequest }) =>
        OrderService.createOrder(params.payload),

      onSuccess: (_, params) => {
        toast.success("Tạo đơn hàng thành công");
        queryClient.invalidateQueries({
          queryKey: ["order"],
        });
      },
      onError: (error) => {
        toast.error("Tạo đơn hàng thất bại");
      },
    });
  }

  static useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number; status: OrderStatus }) =>
        OrderService.updateOrderStatus(params.productId, params.status),

      onSuccess: (_, params) => {
        toast.success("Cập nhật trạng thái thành công");
        queryClient.invalidateQueries({
          queryKey: ["order_by_id", params.productId],
        });
      },

      onError: (error) => {
        toast.error("Cập nhật trạng thái thất bại");
      },
    });
  }

  static useBuyerPayOrder() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number; payment: OrderPayment }) =>
        OrderService.buyerPayOrder(params.productId, params.payment),

      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["order_by_id", params.productId],
        });
      },
    });
  }

  static useSellerConfirmOrder() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number; buyerId: number }) =>
        OrderService.sellerConfirmOrder(params.productId, params.buyerId),

      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["order_by_id", params.productId],
        });
      },
    });
  }

  static useBuyerConfirmShipped() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number }) =>
        OrderService.buyerConfirmShipped(params.productId),

      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["order_by_id", params.productId],
        });
      },
    });
  }

  static useSellerRejectOrder() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number; buyerId: number }) =>
        OrderService.sellerRejectOrder(params.productId, params.buyerId),

      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["order_by_id", params.productId],
        });
      },
    });
  }

  static useOrderChat(productId: number) {
    return useQuery({
      queryKey: ["order_chat", productId],

      queryFn: () => OrderService.getOrderChat(productId),

      enabled: !!productId,

      select: (data) => {
        return data.data.order_chat;
      },
    });
  }

  static useCreateOrderChat() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: {
        productId: number;
        payload: NewOrderMessageRequest;
      }) => OrderService.createOrderChat(params.productId, params.payload),

      onSuccess: (_, params) => {
        toast.success("Nhắn tin thành công");
        queryClient.invalidateQueries({
          queryKey: ["order_chat", params.productId],
        });
      },
      onError: (error) => {
        toast.error("Nhắn tin thất bại");
      },
    });
  }
}

export default OrderHook;
