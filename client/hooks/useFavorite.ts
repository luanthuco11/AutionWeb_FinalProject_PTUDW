import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FavoriteService } from "@/services/favoriteService";
import { STALE_10_MIN } from "@/config/query.config";
import { Pagination } from "../../shared/src/types/Pagination";

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
    return useQuery({
      queryKey: ["favorite_product", pagination.page, pagination.limit],

      queryFn: () => FavoriteService.getFavorite(pagination),

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

      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["favorite_product"],
        });
      },
    });
  }

  static useRemoveFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (params: { productId: number }) =>
        FavoriteService.removeFavorite(params.productId),

      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["favorite_product"],
        });
      },
    });
  }
}

export default FavoriteHook;
