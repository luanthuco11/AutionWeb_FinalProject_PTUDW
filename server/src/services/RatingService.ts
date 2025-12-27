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
    const insertRatingSql = `
                INSERT INTO feedback.user_ratings (rater_id, ratee_id, comment, rating, created_at, updated_at)
                VALUES ( $1, $2, $3, $4, NOW(), NOW() )
                `;
    const updateUserSql = `
                UPDATE admin.users u
                SET 
                  positive_points = sub.pos,
                  negative_points = sub.neg,
                  updated_at = NOW()
                FROM (
                  SELECT 
                    COUNT(*) FILTER (WHERE rating = 1) AS pos,
                    COUNT(*) FILTER (WHERE rating = -1) AS neg
                  FROM feedback.user_ratings
                  WHERE ratee_id = $1
                ) AS sub
                WHERE u.id = $1;
    `;
    const insertRatingParams = [
      raterId,
      ratee.id,
      comment ? comment : "",
      rating,
    ];

    const promises = [
      this.safeQuery(insertRatingSql, insertRatingParams),
      this.safeQuery(updateUserSql, [ratee.id]),
    ];

    await Promise.all(promises);
  }

  async updateRating(raterId: number, payload: CreateRating) {
    const { ratee, comment, rating } = payload;
    const updateRatingSql = `
                UPDATE feedback.user_ratings
                SET
                  rating = $1,
                  comment = $2,
                  updated_at = NOW()
                WHERE rater_id = $3 AND ratee_id = $4
                `;
    const updateUserSql = `
                UPDATE admin.users u
                SET 
                  positive_points = sub.pos,
                  negative_points = sub.neg,
                  updated_at = NOW()
                FROM (
                  SELECT 
                    COUNT(*) FILTER (WHERE rating = 1) AS pos,
                    COUNT(*) FILTER (WHERE rating = -1) AS neg
                  FROM feedback.user_ratings
                  WHERE ratee_id = $1
                ) AS sub
                WHERE u.id = $1;
    `;
    const updateRatingParams = [
      rating,
      comment ? comment : "",
      raterId,
      ratee.id,
    ];

    const promises = [
      this.safeQuery(updateRatingSql, updateRatingParams),
      this.safeQuery(updateUserSql, [ratee.id]),
    ];

    await Promise.all(promises);
  }

  async getOneRating(
    raterId: number,
    targetId: number // ratee
  ): Promise<UserRating | null> {
    const sql = `
        SELECT 
            fur.id as rating_id, fur.rating, fur.comment, fur.created_at, fur.updated_at,
            aurt.id as rater_id, aurt.name as rater_name, aurt.profile_img as rater_img,
            aurtt.id as ratee_id, aurtt.name as ratee_name, aurtt.profile_img as ratee_img
        FROM feedback.user_ratings fur
        JOIN admin.users aurt ON fur.rater_id = aurt.id
        JOIN admin.users aurtt ON fur.ratee_id = aurtt.id
        WHERE fur.rater_id = $1 AND fur.ratee_id = $2
    `;
    const params = [raterId, targetId];
    const result = (await this.safeQuery<any>(sql, params))?.[0];

    if (!result) return null;

    const rating: UserRating = {
      id: result.rating_id,
      rater: {
        id: result.rater_id,
        name: result.rater_name,
        profile_img: result.rater_img,
      },
      ratee: {
        id: result.ratee_id,
        name: result.ratee_name,
        profile_img: result.ratee_img,
      },
      rating: result.rating,
      comment: result.comment,
      created_at: result.created_at,
      updated_at: result.updated_at || null,
    };

    return rating;
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
