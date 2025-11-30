import { BaseService } from "./BaseService";
import { UserRating } from "../../../shared/src/types";

interface CreateRatingPayload extends UserRating {
    rater_id: string
    ratee_id: string
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
        return RatingService.instance
    }

    async getRating(userId: number) {
        const sql =
            `
                SELECT sum(rating)
                FROM feedback.user_ratings
                WHERE ratee_id = $1
                `
        const params = [userId]

        return await this.safeQuery(sql, params);
    }

    async createRating(payload: CreateRatingPayload) {
        const {rater_id, ratee_id, comment, rating} = payload;
        const sql = 
                `
                INSERT INTO feedback.user_ratings (rater_id, ratee_id, comment, rating)
                VALUES ( $1, $2, $3, $4 )
                `
        const params = [rater_id, ratee_id, comment ? comment : "", rating];

        return await this.safeQuery(sql, params);
    }

}