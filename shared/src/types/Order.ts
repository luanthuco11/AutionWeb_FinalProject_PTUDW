import { User } from "./User";

export type OrderStatus = "pending | paid | shipped | completed | cancelled";

export type Order = {
  product_id: number;
  seller: User;
  buyer: User;
  status: OrderStatus;
  shipping_address: string;
  payment_invoice: string | null;
  created_at: Date;
  updated_at: Date | null;
};

export type NewOrderRequest = {
  product_id: number;
  shipping_address: string;
};

export type OrderMessage = {
  user_id: Pick<User, "id" | "name" | "profile_img">;
  message: string;
  created_at: Date;
};

export type OrderConversation = {
  product_id: number;
  messages: OrderMessage[];
};

export type NewOrderMessageRequest = {
  user_id: number;
  message: string;
};
