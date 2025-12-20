import { BaseService } from "./BaseService";
import { CreateRating, UserRating } from "../../../shared/src/types";
import { UserRatingHistory } from "../../../shared/src/types";

interface CreateRatingPayload extends UserRating {
  rater_id: string;
  ratee_id: string;
}

export class RatingService extends BaseService {
  private static instance: RatingService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!RatingService.instance) {
      RatingService.instance = new RatingService();
    }
    return RatingService.instance;
  }

  async createRating(raterId: number, payload: CreateRating) {
    const { ratee, comment, rating } = payload;
    const sql = `
                INSERT INTO feedback.user_ratings (rater_id, ratee_id, comment, rating, created_at, updated_at)
                VALUES ( $1, $2, $3, $4, NOW(), NOW() )
                `;
    const params = [raterId, ratee.id, comment ? comment : "", rating];
    return await this.safeQuery(sql, params);
  }

  async getAllRating(userId: number): Promise<UserRatingHistory> {
    const sql = `
        SELECT 
            fur.id as rating_id, fur.rating, fur.comment, fur.created_at, fur.updated_at,
            aurt.id as rater_id, aurt.name as rater_name, aurt.profile_img as rater_img,
            aurtt.id as ratee_id, aurtt.name as ratee_name, aurtt.profile_img as ratee_img
        FROM feedback.user_ratings fur
        JOIN admin.users aurt ON fur.rater_id = aurt.id
        JOIN admin.users aurtt ON fur.ratee_id = aurtt.id
        WHERE fur.ratee_id = $1
    `;
    const params = [userId];
    const rows = await this.safeQuery(sql, params);

    const ratingHistory: UserRatingHistory = {
      ratee_id: userId,
      logs: rows.map((row: any) => ({
        id: row.rating_id,
        rater: {
          id: row.rater_id,
          name: row.rater_name,
          profile_img: row.rater_img,
        },
        ratee: {
          id: row.ratee_id,
          name: row.ratee_name,
          profile_img: row.ratee_img,
        },
        rating: row.rating,
        comment: row.comment,
        created_at: row.created_at,
        updated_at: row.updated_at || null,
      })),
    };

    return ratingHistory;
  }

  async getRating(data: {
    userId: number;
    offset: number;
  }): Promise<UserRatingHistory> {
    const sql = `
        SELECT 
            fur.id as rating_id, fur.rating, fur.comment, fur.created_at, fur.updated_at,
            aurt.id as rater_id, aurt.name as rater_name, aurt.profile_img as rater_img,
            aurtt.id as ratee_id, aurtt.name as ratee_name, aurtt.profile_img as ratee_img
        FROM feedback.user_ratings fur
        JOIN admin.users aurt ON fur.rater_id = aurt.id
        JOIN admin.users aurtt ON fur.ratee_id = aurtt.id
        WHERE fur.ratee_id = $1
        LIMIT 4 OFFSET $2
    `;
    const params = [data.userId, data.offset];
    const rows = await this.safeQuery(sql, params);

    const ratingHistory: UserRatingHistory = {
      ratee_id: data.userId,
      logs: rows.map((row: any) => ({
        id: row.rating_id,
        rater: {
          id: row.rater_id,
          name: row.rater_name,
          profile_img: row.rater_img,
        },
        ratee: {
          id: row.ratee_id,
          name: row.ratee_name,
          profile_img: row.ratee_img,
        },
        rating: row.rating,
        comment: row.comment,
        created_at: row.created_at,
        updated_at: row.updated_at || null,
      })),
    };

    return ratingHistory;
  }
}
