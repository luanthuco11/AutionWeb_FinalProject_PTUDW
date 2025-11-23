import { User } from "./User";

export type Order = {
  product_id: number;
  seller: User;
  bidder: User;
  status: 'pending | paid | shipped | completed | cancelled';
  shipping_address: string;
  payment_invoice: string | null;
  created_at: Date;
  updated_at: Date | null;
}

export type NewOrderRequest = {
  product_id: number;
  shipping_address: string;
}