export type UserRating = {
  id: number;
  rater_id: number;
  ratee_id: number;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

export type UserRatingHistory = {
  ratee_id: number;
  logs: UserRating[];
}