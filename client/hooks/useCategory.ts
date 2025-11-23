import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { STALE_10_MIN } from "@/config/query.config";
import { CategoryService } from "@/services/categoryService";
import { Pagination } from "../../shared/src/types/Pagination";
import { ProductCategoryTree } from "../../shared/src/types";

class CategoryHook {
  static useCategories() {
    return useQuery({
      queryKey: ["categories"],
      queryFn: () => CategoryService.getCategories(),
      staleTime: STALE_10_MIN,
      select: (data) => {
        return data.data;
      },
    });
  }
  static useProductsByCategory(pagination: Pagination) {
    return useQuery({
      queryKey: ["products_by_category"],
      queryFn: () => CategoryService.getProductsByCategory(pagination),
      staleTime: STALE_10_MIN,
      select: (data) => {
        return data.data;
      },
    });
  }
  static useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (category: ProductCategoryTree) =>
        CategoryService.createCategory(category),
      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        });
      },
    });
  }
  static useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (category: ProductCategoryTree) =>
        CategoryService.updateCategory(category.id, category),
      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        });
      },
    });
  }
  static useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: number) => CategoryService.deeleteCategory(id),
      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        });
      },
    });
  }
}

export default CategoryHook;
