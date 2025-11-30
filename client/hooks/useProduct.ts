import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/ProductService";
import { STALE_10_MIN } from "@/config/query.config";
import {
  CreateAnswer,
  CreateProduct,
  CreateQuestion,
} from "../../shared/src/types";

// Một hàm xử lý logic REACT, và chỉ được biết tới REACT(FRONT END) thôi
// Nó không được biết về api
class ProductHook {
  static useGetProducts() {
    return useQuery({
      queryKey: ["products"],

      queryFn: () => ProductService.getProducts(),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data.products;
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

  static useGetTopEndingSoonProduct(limit: number, page: number) {
    return useQuery({
      queryKey: ["product_top_ending_soon", limit, page],

      queryFn: () => ProductService.getTopEndingSoonProduct(limit, page),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        console.log(data);
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data.data.topEndingSoonProducts;
      },
    });
  }

  static useGetTopBiddingProduct() {
    return useQuery({
      queryKey: ["product_top_bidding"],

      queryFn: () => ProductService.getTopBiddingProduct(),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data;
      },
    });
  }

  static useGetTopPriceProduct() {
    return useQuery({
      queryKey: ["product_top_price"],

      queryFn: () => ProductService.getTopPriceProduct(),

      staleTime: STALE_10_MIN,

      // Transform data tại Hook (select)
      select: (data) => {
        // Cần BE trả dạng gì ví dụ { data: { ... } } → thì sửa ở đây
        return data;
      },
    });
  }

  static useCreateProduct() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: CreateProduct) => ProductService.createProduct(data),
      onSuccess: () => {
        // Invalidate cache của dữ liệu
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      },
    });
  }

  static useUpdateProductDescription() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, description }: { id: number; description: string }) =>
        ProductService.updateProductDescription(id, description),
      onSuccess: () => {
        // Invalidate cache của dữ liệu
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      },
    });
  }

  static useDeleteProductById() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => ProductService.deleteProductById(id),
      onSuccess: () => {
        // Invalidate cache của dữ liệu
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
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

  static useCreateProductQuestion() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: CreateQuestion }) =>
        ProductService.createProductQuestion(id, data),
      onSuccess: (_data, variables) => {
        // Invalidate cache của dữ liệu
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
      onSuccess: () => {
        // Invalidate cache của dữ liệu
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      },
    });
  }
}

export default ProductHook;
