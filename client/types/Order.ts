export type Order = {
  product_id: number;
  seller_id: number;
  bidder_id: number;
  status: 'pending | paid | shipped | completed | cancelled';
  shipping_address: string;
  payment_invoice: string;
  created_at: Date;
  updated_at: Date;
}