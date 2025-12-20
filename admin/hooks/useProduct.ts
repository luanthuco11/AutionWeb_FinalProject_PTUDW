import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "../services/ProductService";
import { STALE_10_MIN } from "@/config/query.config";
import {
  CreateAnswer,
  CreateProduct,
  CreateQuestion,
} from "../../shared/src/types";
import { Pagination } from "../../shared/src/types/Pagination";
import { toast } from "react-hot-toast";

class ProductHook {
  static useGetProduct(pagination: Pagination) {
    return useQuery({
      queryKey: ["products", pagination.page, pagination.limit],
      queryFn: () => ProductService.getProducts(pagination),
      staleTime: STALE_10_MIN,
      select: (data) => {
        return data.data;
      },
    });
  }
  static useGetCategoryProductList() {
    return useQuery({
      queryKey: ["category_product_list"],

      queryFn: () => ProductService.getCategoryProductList(),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data.categoryProducts;
      },
    });
  }

  static useGetProductTop() {
    return useQuery({
      queryKey: ["product_top"],

      queryFn: () => ProductService.getProductTop(),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data;
      },
    });
  }

  static useGetProductById(id: number) {
    return useQuery({
      queryKey: ["product_by_id", id],

      queryFn: () => ProductService.getProductById(id),

      staleTime: STALE_10_MIN,

      enabled: !!id,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data.product;
      },
    });
  }
  static useGetProductBySlug(slug: string) {
    return useQuery({
      queryKey: ["products", slug],

      queryFn: () => ProductService.getProductBySlug(slug),

      staleTime: STALE_10_MIN,

      enabled: !!slug,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data.product;
      },
    });
  }
  static useGetSoldProduct() {
    return useQuery({
      queryKey: ["product_sold"],

      queryFn: () => ProductService.getSoldProduct(),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data.soldProducts;
      },
    });
  }
  static useGetBiddingProduct(limit: number, page: number) {
    return useQuery({
      queryKey: ["product_bidding", limit, page],

      queryFn: () => ProductService.getBiddingProduct(limit, page),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data;
      },
    });
  }
  static useGetProductsBySearch(query: string, limit: number, page: number) {
    return useQuery({
      queryKey: ["products", query, limit, page],

      queryFn: () => ProductService.getProductsBySearch(query, limit, page),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data;
      },
    });
  }

  static useGetProductsBySearchSuggestion(query: string, limit: number) {
    return useQuery({
      queryKey: ["products", query, limit],

      queryFn: () => ProductService.getProductsBySearchSuggestion(query, limit),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data.products;
      },
    });
  }
  static useGetWinningProduct(limit: number, page: number) {
    return useQuery({
      queryKey: ["product_winning", limit, page],

      queryFn: () => ProductService.getWinningProduct(limit, page),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data;
      },
    });
  }
  static useGetTopEndingSoonProduct(limit: number, page: number) {
    return useQuery({
      queryKey: ["product_top_ending_soon", limit, page],

      queryFn: () => ProductService.getTopEndingSoonProduct(limit, page),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data;
      },
    });
  }

  static useGetTopBiddingProduct(limit: number, page: number) {
    return useQuery({
      queryKey: ["product_top_bidding", limit, page],

      queryFn: () => ProductService.getTopBiddingProduct(limit, page),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data;
      },
    });
  }

  static useGetTopPriceProduct(limit: number, page: number) {
    return useQuery({
      queryKey: ["product_top_price", limit, page],

      queryFn: () => ProductService.getTopPriceProduct(limit, page),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data;
      },
    });
  }

  static useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (formData: FormData) =>
        ProductService.createProduct(formData),
      onSuccess: () => {
        // Invalidate cache của dữ liệu
        toast.success("Tạo sản phẩm thành công!")
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });

        window.location.reload();
      },
      onError: (error) => {
        toast.error("Tạo sản phẩm thất bại!")
        console.log(error);
      }
    });
  }

  static useUpdateProductDescription() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, description }: { id: number; description: string }) =>
        ProductService.updateProductDescription(id, description),
      onSuccess: () => {
        // Invalidate cache của dữ liệu
        toast.success("Cập nhật sản phẩm thành công!")
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      },
      onError: (error) => {
        toast.error("Cập nhật sản phẩm thất bại!")
        console.log(error);
      }
    });
  }

  static useDeleteProductById() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => ProductService.deleteProductById(id),
      onSuccess: () => {
        // Invalidate cache của dữ liệu
        toast.success("Xóa sản phẩm thành công!")
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      },
      onError: (error) => {
        toast.error("Xóa sản phẩm thất bại!")
        console.log(error);
      }
    });
  }

  static useGetProductQuestion(id: number) {
    return useQuery({
      queryKey: ["product_question", id],

      queryFn: () => ProductService.getProductQuestion(id),

      staleTime: STALE_10_MIN,

      enabled: !!id,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data.questions;
      },
    });
  }

  static useCreateProductQuestion() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: CreateQuestion }) =>
        ProductService.createProductQuestion(id, data),
      onSuccess: (_data, variables) => {
        
        queryClient.invalidateQueries({
          queryKey: ["product_question", variables.id],
        });
      },
    });
  }

  static useCreateProductAnswer() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({
        idProduct,
        idQuestion,
        data,
      }: {
        idProduct: number;
        idQuestion: number;
        data: CreateAnswer;
      }) => ProductService.createProductAnswer(idProduct, idQuestion, data),
      onSuccess: (_data, variables) => {
        // Invalidate cache của dữ liệu
        queryClient.invalidateQueries({
          queryKey: ["product_question", variables.idProduct],
        });
      },
    });
  }

  static useUpdateProductExtend() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, auto_extend }: { id: number; auto_extend: boolean }) =>
        ProductService.updateProductExtend(id, auto_extend),
      onSuccess: (_data, variables) => {
        // Invalidate cache của dữ liệu
        queryClient.invalidateQueries({
          queryKey: ["product_by_id", variables.id],
        });
      },
    });
  }
}

export default ProductHook;
