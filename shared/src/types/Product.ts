import { User } from "./User";

export type Product = {
  id: number;
  slug: string;
  seller: Pick<User, 'id' | 'name' | 'profile_img'>;
  category_id: number;
  main_image: string;
  extra_images: string[];
  name: string;
  initial_price: number;
  buy_now_price: number;
  current_price: number;
  top_bidder: Pick<User, 'id' | 'name' | 'profile_img'> | null;
  bid_count: number;
  end_time: Date;
  description: string;
  auto_extend: boolean;
  status: "available" | "sold_out"
  price_increment: number;
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
  'created_at'
> & {
  top_bidder_name: string
}

export type ProductCategoryTree = {
  id: number;
  slug: string;
  name: string;
  parent_id?: number;
  children?: ProductCategoryTree[];
  created_at: Date;
  updated_at: Date | null;
}

export type ProductAnswer = {
  id: number;
  question_id: number;
  user: Pick<User, 'id' | 'name' | 'profile_img'>;
  comment: string;
  created_at: Date;
}

export type ProductQuestion = {
  id: number;
  product_id: number;
  user: Pick<User, 'id' | 'name' | 'profile_img'>;
  comment: string;
  answer?: ProductAnswer;
  created_at: Date;
}