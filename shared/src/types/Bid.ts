import { create } from "zustand";
import { User } from "./User";
import { Product } from "./Product";

export type BidLog = {
  id: number;
  user: Pick<User, "id" | "name">;
  price: number;
  product_id: number;
  created_at?: Date;
  updated_at?: Date;
};

export type CreateBidLog = {
  user_id: number;
  price: number;
  product_id: number;
  product_slug?: string;
};

export type BidHistory = {
  product_id: number;
  logs: BidLog[];
};

export type UserBid = {
  id: number;
  max_price: number;
  productCurrentPrice: Product["current_price"];
  productName: Product["name"];
  mainImage: Product["main_image"];
  userCurrentPrice: BidLog["price"];
  created_at: Date;
  updated_at: Date;
};

export type UserBidInfo = {
  user_id: number;
  product_id: number;
  max_price: number | undefined;
};

export type BlacklistPayload = {
  product_id: number;
  buyer_id: number;
};
