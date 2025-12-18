import { User } from "./User";

export type UpgradeRequest = {
  id: number;
  bidder_id: number;
  status: "approved" | "pending" | "rejected";
  created_at: Date;
  updated_at: Date | null;
  expired_at: Date;
};

export type UpgradeRequestPreview = {
  id: number;
  bidder: Pick<
    User,
    "name" | "email" | "positive_points" | "negative_points" | "created_at"
  >;
  created_at: Date;
};
