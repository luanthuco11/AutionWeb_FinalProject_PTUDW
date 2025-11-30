import { User } from "./User";

export type UserRating = {
  id: number;
  rater: Pick<User, "id" | "name" | "profile_img">;
  ratee: Pick<User, "id" | "name" | "profile_img">;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date | null;
};
export type CreateRating = Omit<
  UserRating,
  "id" | "rater" | "created_at" | "updated_at"
> & { rater_id: number };
export type UserRatingHistory = {
  ratee_id: number;
  logs: UserRating[];
};
