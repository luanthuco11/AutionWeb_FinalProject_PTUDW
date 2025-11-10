export type BidLog = {
  id: number;
  user_id: number;
  product_id: number;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export type BidHistory = {
  product_id: number;
  logs: BidLog[];
}