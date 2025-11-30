import { BaseService } from "./BaseService";
import { CreateRating, UserRating } from "../../../shared/src/types";

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

  async getRating(userId: number) {
    const sql = `
                SELECT sum(rating)
                FROM feedback.user_ratings
                WHERE ratee_id = $1
                `;
    const params = [userId];

    return await this.safeQuery(sql, params);
  }

  async createRating(payload: CreateRating) {
    const { rater_id, ratee, comment, rating } = payload;
    console.log(payload);
    const sql = `
                INSERT INTO feedback.user_ratings (rater_id, ratee_id, comment, rating, created_at, updated_at)
                VALUES ( $1, $2, $3, $4, NOW(), NOW() )
                `;
    const params = [rater_id, ratee.id, comment ? comment : "", rating];

    return await this.safeQuery(sql, params);
  }
}
