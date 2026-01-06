import cron from "node-cron";
import Database from "../config/db";

const pool = Database.getInstance();

export const deleteExpiredTokensJob = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const res = await pool.query(
        `DELETE FROM admin.refresh_tokens WHERE expired_at < NOW();`
      );
    } catch (err) {
      console.error("Cron job error:", err);
    }
  });

  cron.schedule("0 * * * *", async () => {
    try {
      const res = await pool.query(
        `DELETE FROM admin.reset_password_otp WHERE expired_at < NOW();`
      );
    } catch (err) {
      console.error("Cron job error:", err);
    }
  });

};
