import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { STALE_10_MIN } from "@/config/query.config";
import { CategoryService } from "@/services/categoryService";
import { Pagination } from "../../shared/src/types/Pagination";
import { CreateCategory, UpdateCategory } from "../../shared/src/types";

class CategoryHook {
  static useCategories() {
    return useQuery({
      queryKey: ["categories"],
      queryFn: () => CategoryService.getCategories(),
      staleTime: STALE_10_MIN,
      select: (data) => {
        return data.data.categories;
      },
    });
  }

  static useCategoryDetailById(id: number) {
    return useQuery({
      queryKey: ["category_by_id", id],
      enabled: !!id,
      queryFn: () => CategoryService.getCategoryDetailById(id),
      staleTime: STALE_10_MIN,
      select: (data) => {
        return data.data.category;
      },
    });
  }

  static useProductsByCategorySlug(
    slug: string,
    page: number,
    limit: number,
    sort: string
  ) {
    return useQuery({
      queryKey: ["products_by_category", slug, page, limit, sort],
      queryFn: () =>
        CategoryService.getProductsByCategorySlug(slug, page, limit, sort),
      staleTime: STALE_10_MIN,
      select: (data) => {
        return data.data;
      },
    });
  }

  static useProductsByCategoryId(pagination: Pagination) {
    return useQuery({
      queryKey: ["products_by_category", pagination],
      queryFn: () => CategoryService.getProductsByCategoryId(pagination),
      staleTime: STALE_10_MIN,
      select: (data) => {
        return data.data.products;
      },
    });
  }

  static useCreateCategory() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (category: CreateCategory) =>
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
      mutationFn: (category: UpdateCategory) =>
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
      mutationFn: (id: number) => CategoryService.deleteCategory(id),
      onSuccess: (_, params) => {
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        });
      },
    });
  }
}

export default CategoryHook;
