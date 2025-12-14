import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { STALE_10_MIN } from "@/config/query.config";
import { Pagination } from "../../shared/src/types/Pagination";
import { CreateCategory, UpdateCategory } from "../../shared/src/types";
import { CategoryService } from "@/services/categoryService";

class CategoryHook {
  static useCategories() {
    return useQuery({
      queryKey: ["admin_categories"],
      queryFn: () => CategoryService.getCategories(),
      staleTime: STALE_10_MIN,
      select: (data) => {
        return data.data.categories;
      },
    });
  }

  static useCountProducts() {
    return useQuery({
      queryKey: ["admin_count_product"],
      queryFn: () => CategoryService.getCountProduct(),
      staleTime: STALE_10_MIN,
      select: (data) => {
        return data.data.result;
      },
    });
  }

  static useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (category: CreateCategory) =>
        CategoryService.createCategory(category),
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: ["admin_categories"],
        });
      },
    });
  }

  static useUpdateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (category: UpdateCategory) =>
        CategoryService.updateCategory(category.id, category),
      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["admin_categories"],
        });
      },
    });
  }
  static useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: number) => CategoryService.deleteCategory(id),
      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["admin_categories"],
        });
      },
    });
  }
}

export default CategoryHook;
