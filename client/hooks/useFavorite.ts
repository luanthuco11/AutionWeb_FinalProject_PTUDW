import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FavoriteService } from "@/services/favoriteService";
import { STALE_10_MIN } from "@/config/query.config";
import { Pagination } from "../../shared/src/types/Pagination";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "react-toastify";

class FavoriteHook {
  static useAllFavorite() {
    return useQuery({
      queryKey: ["favorite_product"],

      queryFn: () => FavoriteService.getAllFavorite(),

      staleTime: STALE_10_MIN,

      select: (data) => {
        return data.data.allFavorite;
      },
    });
  }
  static useFavorite(pagination: Pagination) {
    const user = useAuthStore((s) => s.user);
    const userId = user?.id;
    return useQuery({
      queryKey: ["favorite_product", userId, pagination.page, pagination.limit],

      queryFn: () => FavoriteService.getFavorite(pagination),

      enabled: !!userId,
      staleTime: STALE_10_MIN,

      select: (data) => {
        return data.data;
      },
    });
  }

  static useAddFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number }) =>
        FavoriteService.addFavorite(params.productId),

      onSuccess: (data) => {
        toast.success("Thêm vào sản phẩm yêu thích thành công");
        queryClient.invalidateQueries({
          queryKey: ["favorite_product"],
        });
      },
      onError: (error) => {
        toast.error("Thêm vào sản phẩm yêu thích thất bại");
      },
    });
  }

  static useRemoveFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number }) =>
        FavoriteService.removeFavorite(params.productId),

      onSuccess: (data, params) => {
        toast.success("Xóa khỏi sản phẩm yêu thích thành công");
        queryClient.invalidateQueries({
          queryKey: ["favorite_product"],
        });
      },
      onError: (error) => {
        toast.error("Xóa khỏi sản phẩm yêu thích thất bại");
      },
    });
  }
}

export default FavoriteHook;
