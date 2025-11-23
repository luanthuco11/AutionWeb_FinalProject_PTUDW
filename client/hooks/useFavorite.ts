import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FavoriteService } from "@/services/favoriteService";
import { STALE_10_MIN } from "@/config/query.config";
import { Product } from "../../shared/src/types";

class FavoriteHook {
  static useFavorite() {
    return useQuery({
      queryKey: ["favorite_product"],

      queryFn: () => FavoriteService.getFavorite(),

      staleTime: STALE_10_MIN,

      select: (data) => {
        return data;
      }
    });
  }

  static useAddFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number }) =>
        FavoriteService.addFavorite(params.productId),

      onSuccess: (_, params) => {
        // Invalidate cache của dữ liệu
        queryClient.invalidateQueries({
          queryKey: ["favorite_product"],
        });
      }
    });
  }

  static useRemoveFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number }) =>
        FavoriteService.removeFavorite(params.productId),

      onSuccess: (_, params) => {
        // Invalidate cache của dữ liệu
        queryClient.invalidateQueries({
          queryKey: ["favorite_product"],
        });
      }
    });
  }
}

export default FavoriteHook;
