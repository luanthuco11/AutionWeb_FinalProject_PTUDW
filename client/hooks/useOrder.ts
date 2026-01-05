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

  static useOrderById(productId: number, isPrivate: boolean = true) {
    return useQuery({
      queryKey: ["order_by_id", productId],

      queryFn: () => OrderService.getOrderById(productId),

      enabled: !!productId && !!isPrivate,

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

      onSuccess: (data, params) => {
        toast.success("Tạo đơn hàng thành công");
        console.log("data hook: ", data);
        queryClient.invalidateQueries({
          queryKey: ["order"],
        });
        queryClient.invalidateQueries({
          queryKey: ["product_by_slug", data.data.slug],
        });
        queryClient.invalidateQueries({
          queryKey: ["product_bidding"],
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
      mutationFn: (params: { productId: number; formData: FormData }) =>
        OrderService.buyerPayOrder(params.productId, params.formData),

      onSuccess: (_, params) => {
        toast.success("Thanh toán và cập nhật thông tin đơn hàng thành công");
        console.log("params.productId: ", params.productId);
        queryClient.invalidateQueries({
          queryKey: ["order_by_id", params.productId],
        });
      },

      onError: (error) => {
        toast.error("Thanh toán và cập nhật thông tin đơn hàng thất bại");
      },
    });
  }

  static useSellerConfirmOrder() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number; buyerId: number }) =>
        OrderService.sellerConfirmOrder(params.productId, params.buyerId),

      onSuccess: (_, params) => {
        toast.success("Xác nhận đơn hàng thành công");
        queryClient.invalidateQueries({
          queryKey: ["order_by_id", params.productId],
        });
      },

      onError: (error) => {
        toast.error("Xác nhận đơn hàng thất bại");
      },
    });
  }

  static useBuyerConfirmShipped() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number }) =>
        OrderService.buyerConfirmShipped(params.productId),

      onSuccess: (_, params) => {
        toast.success("Xác nhận nhận hàng thành công");
        queryClient.invalidateQueries({
          queryKey: ["order_by_id", params.productId],
        });
      },

      onError: (error) => {
        toast.error("Xác nhận nhận hàng thất bại");
      },
    });
  }

  static useSellerRejectOrder() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number; buyerId: number }) =>
        OrderService.sellerRejectOrder(params.productId, params.buyerId),

      onSuccess: (data, params) => {
        toast.success("Hùy đơn hàng thành công");

        queryClient.invalidateQueries({
          queryKey: ["order_by_id", params.productId],
        });

        queryClient.invalidateQueries({
          queryKey: ["product_by_slug", data.data.slug],
        });
      },

      onError: (error) => {
        toast.error("Hủy đơn hàng thất bại");
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
        payload: { message: string };
      }) => OrderService.createOrderChat(params.productId, params.payload),

      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["order_chat", params.productId],
        });
      },

      onError: () => {
        toast.error("Nhắn tin thất bại");
      },
    });
  }
}

export default OrderHook;
