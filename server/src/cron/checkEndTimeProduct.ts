import cron from "node-cron";
import Database from "../config/db";
import { Product } from "../../../shared/src/types";
import { sendEmailToUser } from "../utils/mailer";

const pool = Database.getInstance();

export const checkEndTimeProduct = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await pool.query("BEGIN");

      let sql = `
            SELECT p.id 
            FROM product.products as p
            WHERE p.end_time <= NOW() AND p.is_end = FALSE
            `;
      const res = await pool.query(sql);
      const productIds: { id: number }[] = res.rows;
      if (productIds.length != 0) {
        const idsInOrders = new Set<number>();
        sql = `
            SELECT o.product_id as id
            FROM auction.orders as o
            WHERE o.status != $1
        `;
        const rs2 = await pool.query(sql, ["cancelled"]);
        const productIdsInOreders: { id: number }[] = rs2.rows;
        productIdsInOreders.map((item) => idsInOrders.add(item.id));

        await Promise.all([
          productIds.map(async (item) => {
            //Lấy thông tin sản phẩm
            const getProductInfo = async (id: number) => {
              const sql = `
                        SELECT p.*
                        FROM product.products as p 
                        WHERE p.id = $1
                         `;
              const params = [id];
              const result = await pool.query(sql, params);

              return result.rows[0];
            };
            //Lấy thông tin người bán
            const getSellerInfo = async () => {
              const sql = `
                        SELECT u.*
                        FROM admin.users as u 
                        JOIN product.products as p ON u.id = p.seller_id
                        WHERE p.id = $1 `;
              const params = [item.id];
              const result = await pool.query(sql, params);
              return result.rows[0];
            };
            //Lấy thông tin user
            const getUserInfo = async (id: number) => {
              const sql = `
                    SELECT u.*
                    FROM admin.users as u 
                    WHERE u.id = $1 `;
              const params = [id];
              const result = await pool.query(sql, params);

              return result.rows[0];
            };
            const [sellerInfo, productInfo] = await Promise.all([
              getSellerInfo(),
              getProductInfo(item.id),
            ]);

            if (!idsInOrders.has(item.id)) {
              sql = `
                SELECT p.top_bidder_id
                FROM product.products as p
                WHERE p.id = $1
                `;
              const params = [item.id];
              const rs3 = await pool.query(sql, params);
              const topBidderId: { top_bidder_id: number } = rs3.rows[0];
              if (topBidderId.top_bidder_id != null) {
                sql = `
                    SELECT p.price
                    FROM auction.bid_logs as p
                    WHERE p.product_id = $1 AND p.user_id = $2
                    ORDER BY p.created_at DESC
                    LIMIT 1
                    `;
                const params = [item.id, topBidderId.top_bidder_id];
                const rs4 = await pool.query(sql, params);
                const maxPrice = rs4.rows[0].price;
                sql = `
                    INSERT INTO auction.orders (product_id, status, created_at, updated_at, buyer_id, price ) VALUES( $1,$2,NOW(),NOW(),$3,$4)
                `;
                const paramsInsert = [
                  item.id,
                  "pending",
                  topBidderId.top_bidder_id,
                  maxPrice,
                ];
                await pool.query(sql, paramsInsert);

                ///Gửi mail

                const buyerInfo = await getUserInfo(topBidderId.top_bidder_id);
                sendEmailToUser(
                  sellerInfo.email,
                  "THôNG BÁO VỀ SẢN PHẨM ĐANG BÁN",

                  `
                <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
                    <tr>
                        <td style="background-color:#fd7e14; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
                        Kết thúc đấu giá
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px; font-size:16px; line-height:1.6; color:#333;">
                        <p>
                            Sản phẩm <strong>${productInfo.name}</strong> của bạn đã <strong>kết thúc</strong>.
                        </p>
                        <p>
                            Người đấu giá <strong>${buyerInfo.name}</strong> đã chiến thắng sản phẩm của bạn
                            với mức giá <strong>${maxPrice}</strong>.
                        </p>
                        <p style="margin-top:15px;">
                            Hãy kiểm tra và hoàn tất thủ tục đấu giá để tiếp tục các bước tiếp theo.
                        </p>
                        </td>
                    </tr>

                    </table>
                `
                );
                console.log(sellerInfo.email);
                console.log(buyerInfo.email);

                sendEmailToUser(
                  buyerInfo.email,
                  "THÔNG BÁO VỀ SẢN PHẨM ĐANG ĐẤU GIÁ",
                  `
                    <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
                    <tr>
                        <td style="background-color:#20c997; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
                        Chúc mừng bạn!
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px; font-size:16px; line-height:1.6; color:#333;">
                        <p>
                            Chúc mừng bạn đã <strong>chiến thắng đấu giá</strong> sản phẩm
                            <strong>${productInfo.name}</strong> của người bán
                            <strong>${sellerInfo.name}</strong>.
                        </p>
                        <p style="margin-top:15px;">
                            Hãy kiểm tra và hoàn tất thủ tục đấu giá để tiếp tục các bước tiếp theo.
                        </p>
                        </td>
                    </tr>
                    
                    </table>
                    `
                );
              } else {
                console.log(sellerInfo.email);
                sendEmailToUser(
                  sellerInfo.email,
                  "THôNG BÁO VỀ SẢN PHẨM ĐANG BÁN",

                  `
                <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
                    <tr>
                        <td style="background-color:#fd7e14; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
                        Kết thúc đấu giá
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px; font-size:16px; line-height:1.6; color:#333;">
                        <p>
                            Sản phẩm <strong>${productInfo.name}</strong> của bạn đã <strong>kết thúc</strong> và không có người đấu giá.
                        </p>
                        </td>
                    </tr>

                    </table>
                `
                );
              }
              sql = `
                UPDATE product.products
                SET is_end = true
                WHERE id = $1 AND is_end = false
                `;
              await pool.query(sql, [item.id]);
            }
          }),
        ]);
      }
      await pool.query("COMMIT");
    } catch (err) {
      await pool.query("ROLLBACK");

      console.error("Cron job error:", err);
    }
  });
};
