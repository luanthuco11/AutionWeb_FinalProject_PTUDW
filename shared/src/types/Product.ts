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
  current_price: number | null ;
  top_bidder: Pick<User, 'id' | 'name' | 'profile_img'> | null;
  bid_count: number;
  end_time: Date;
  description: string | null;
  auto_extend: boolean | null;
  status: Pick<Order, 'status'> | "available";
  price_increment: number | null;
  created_at: Date;
  updated_at: Date | null;
}

export type ProductPreview = Pick<Product,
  'id' |
  'slug' |
  'category_id' |
  'main_image' |
  'name' |
  'current_price' |
  'buy_now_price' |
  'bid_count' |
  'end_time' |
  'auto_extend' | 
  'created_at' |
  'initial_price'
> & {
  top_bidder_name: string | null
}


export type ProductCategoryTree = {
  id: number;
  slug: string;
  name: string;
  parent_id?: number;
  children?: ProductCategoryTree[];
  created_at?: Date;
  updated_at?: Date | null;
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
export type ProductPagination = {
  page: number;
  limit: number;
  total: number;
  products: Product[];
};
