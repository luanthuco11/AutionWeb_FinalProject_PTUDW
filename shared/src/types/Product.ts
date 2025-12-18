import { Order } from "./Order";
import { User } from "./User";

export type Product = {
  id: number;
  slug: string;
  seller: Pick<User, "id" | "name" | "profile_img">;
  category_id: number;
  main_image: string;
  extra_images?: string[];
  name: string;
  initial_price: number | null;
  buy_now_price: number | null;
  current_price: number | null;
  top_bidder: Pick<User, "id" | "name" | "profile_img"> | null;
  bid_count: number;
  end_time: Date;
  description: string | null;
  auto_extend: boolean | null;
  status: Pick<Order, "status"> | "available";
  price_increment: number | null;
  created_at: Date;
  updated_at: Date | null;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
};
export type ProductPreview = Pick<
  Product,
  | "id"
  | "slug"
  | "category_id"
  | "main_image"
  | "name"
  | "current_price"
  | "buy_now_price"
  | "bid_count"
  | "end_time"
  | "auto_extend"
  | "created_at"
  | "initial_price"
  | "status"
> & {
  top_bidder_name: string | null;
  category: Pick<Category, "name">;
  seller: Pick<User, "email">;
};

export type SearchProduct = Pick<
  Product,
  "id" | "slug" | "name" | "main_image" | "current_price"
>;

export type ProductCategoryTree = {
  id: number;
  slug: string;
  name: string;
  parent_id?: number;
  children?: ProductCategoryTree[];
  created_at?: Date;
  updated_at?: Date | null;
};

export type CategoryProduct = {
  category_id: ProductCategoryTree["id"];
  category_slug: ProductCategoryTree["slug"];
  category_name: ProductCategoryTree["name"];
  products: ProductPreview[] | null;
};

export type ProductAnswer = {
  id: number;
  question_id: number;
  user: Pick<User, "id" | "name" | "profile_img">;
  comment: string;
  created_at?: Date;
};

export type ProductQuestion = {
  id: number;
  product_id: number;
  user: Pick<User, "id" | "name" | "profile_img">;
  comment: string;
  answer?: ProductAnswer;
  created_at?: Date;
};

export type ProductQuestionPagination = {
  page: number;
  limit: number;
  total: number;
  questions: ProductQuestion[];
};

export type ProductPagination = {
  page: number;
  limit: number;
  total: number;
  products: ProductPreview[];
};

export type CreateCategory = {
  name: string;
  parent_id?: number;
};

export type UpdateCategory = {
  id: number;
  name: string;
};

export type CreateProduct = Pick<
  Product,
  | "name"
  | "category_id"
  | "initial_price"
  | "price_increment"
  | "buy_now_price"
  | "end_time"
  | "description"
  | "auto_extend"
>;
export type WinningProduct = Pick<
  Product,
  "id" | "name" | "slug" | "current_price" | "main_image"
>;
export type BiddingProduct = WinningProduct & {
  user_price: number;
};
export type CreateQuestion = Pick<ProductQuestion, "comment">;
export type CreateAnswer = Pick<ProductAnswer, "comment">;
