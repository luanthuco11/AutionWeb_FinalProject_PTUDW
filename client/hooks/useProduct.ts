import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/ProductService";
import { STALE_10_MIN } from "@/config/query.config";
import {
  CreateAnswer,
  CreateProduct,
  CreateQuestion,
} from "../../shared/src/types";
import { toast } from "react-toastify";

// Một hàm xử lý logic REACT, và chỉ được biết tới REACT(FRONT END) thôi
// Nó không được biết về api
class ProductHook {
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
      queryKey: ["product_by_slug", slug],

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
  static useGetSellingProduct() {
    return useQuery({
      queryKey: ["product_selling"],
      queryFn: () => ProductService.getSellingProduct(),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data.sellingProducts;
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
      queryKey: ["product_by_search", query, limit, page],

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
      queryKey: ["product_by_search_suggestion", query, limit],

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
        toast.success("Tạo sản phẩm thành công");
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });

        window.location.reload();
      },
      onError: (error) => {
        toast.error("Tạo sản phẩm thất bại");
      },
    });
  }

  static useUpdateProductDescription() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, description }: { id: number; description: string }) =>
        ProductService.updateProductDescription(id, description),
      onSuccess: () => {
        toast.success("Cập nhật mô tả thành công");
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      },

      onError: (error) => {
        toast.error("Cập nhật mô tả thất bại");
      },
    });
  }

  static useDeleteProductById() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => ProductService.deleteProductById(id),
      onSuccess: () => {
        toast.success("Xóa sản phẩm thành công");
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      },

      onError: (error) => {
        toast.error("Xóa sản phẩm thất bại");
      },
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

  static useGetProductQuestionsByPage(id: number, page: number, limit: number) {
    return useQuery({
      queryKey: ["product_question", id, page, limit],

      queryFn: () => ProductService.getProductQuestionsByPage(id, page, limit),

      staleTime: STALE_10_MIN,

      enabled: !!id,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data.questionPagination;
      },
    });
  }

  static useCreateProductQuestion() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: CreateQuestion }) =>
        ProductService.createProductQuestion(id, data),
      onSuccess: (_data, variables) => {
        toast.success("Đăng câu hỏi thành công");
        queryClient.invalidateQueries({
          queryKey: ["product_question", variables.id],
        });
      },

      onError: (error) => {
        toast.error("Đăng câu hỏi thất bại");
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
        toast.success("Trả lời câu hỏi thành công");
        queryClient.invalidateQueries({
          queryKey: ["product_question", variables.idProduct],
        });
      },

      onError: (error) => {
        toast.error("Trả lời câu hỏi thất bại");
      },
    });
  }

  static useUpdateProductExtend() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, auto_extend }: { id: number; auto_extend: boolean }) =>
        ProductService.updateProductExtend(id, auto_extend),
      onSuccess: (_data, variables) => {
        toast.success("Cập nhật gia hạng thời gian thành công");
        queryClient.invalidateQueries({
          queryKey: ["product_by_id", variables.id],
        });
      },

      onError: (error) => {
        toast.error("Cập nhật gia hạng thời gian thất bại");
      },
    });
  }
}

export default ProductHook;
