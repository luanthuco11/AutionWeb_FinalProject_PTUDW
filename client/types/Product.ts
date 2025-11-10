export type Product = {
  id: number;
  slug: string;
  seller_id: number;
  category_id: number;
  main_image: string;
  extra_images: string[];
  name: string;
  initial_price: number;
  buy_now_price: number;
  top_bidder_id: number | null;
  end_time: Date;
  description: string;
  auto_extend: boolean;
  price_increment: number;
  created_at: Date;
  updated_at: Date;
}

export type ProductCategoryTree = {
  id: number;
  slug: string;
  name: string;
  parent_id: number;
  children?: ProductCategoryTree[];
  created_at: Date;
  updated_at: Date;
}

export type ProductAnswer = {
  id: number;
  question_id: number;
  user_id: number;
  comment: string;
  created_at: Date;
}

export type ProductQuestion = {
  id: number;
  product_id: number;
  user_id: number;
  comment: string;
  answer?: ProductAnswer;
  created_at: Date;
}