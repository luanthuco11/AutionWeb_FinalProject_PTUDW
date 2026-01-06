import {
  BidLog,
  CanBid,
  CreateBidLog,
  UserBidInfo,
} from "../../../shared/src/types/Bid";
import { BaseService } from "./BaseService";
import { MutationResult } from "../../../shared/src/types/Mutation";
import { sendEmailToUser } from "../utils/mailer";
import { NewOrderRequest, Product, User } from "../../../shared/src/types";
import { formatPrice } from "../utils/price";

type BidStatusType = {
  top_bidder_id: number;
  seller_id: number;
  current_price: number;
  max_price: number;
  price_increment: number;
  buy_now_price: number | null;
  auto_extend: boolean;
  end_time: Date;
  product_threshold_time: number;
  product_renew_time: number;
};

export class BidService extends BaseService {
  private static instance: BidService;

  private constructor(private orderService: any) {
    super();
  }

  static getInstance(orderService?: any) {
    if (!BidService.instance) {
      BidService.instance = new BidService(orderService || null);
    } else if (orderService) {
      BidService.instance.orderService = orderService;
    }
    return BidService.instance;
  }
  async getBidLogs(id: number): Promise<BidLog[]> {
    const sql = `SELECT l.*, json_build_object(
                            'id', u.id,
                            'name', u.name
                            ) AS user
    FROM auction.bid_logs as l, admin.users as u
    WHERE l.product_id = $1 AND u.id = l.user_id AND NOT EXISTS (
      SELECT 1
      FROM auction.black_list bl
      WHERE bl.user_id = u.id AND bl.product_id = l.product_id
    )
    ORDER BY l.created_at DESC
    LIMIT 10`;
    const logs: BidLog[] = await this.safeQuery(sql, [id]);
    return logs;
  }
  async getUserBid(userId: number, productId: number): Promise<UserBidInfo> {
    const sql =
      "SELECT max_price::INT FROM auction.user_bids WHERE user_id = $1 AND product_id = $2";
    const max_price = (
      await this.safeQuery<{ max_price: number }>(sql, [userId, productId])
    )?.[0]?.max_price;
    return {
      user_id: userId,
      product_id: productId,
      max_price: max_price || undefined,
    };
  }
  async createBid(bid: CreateBidLog): Promise<MutationResult> {
    const poolClient = await this.getClient();

    const isUserInBlackList = async () => {
      const blackListSql = `SELECT COUNT(*) as total FROM auction.black_list as bl WHERE bl.user_id = $1 AND bl.product_id = $2`;

      const totalBl: any[] = await this.safeQueryWithClient(
        poolClient,
        blackListSql,
        [bid.user_id, bid.product_id]
      );
      return totalBl[0].total > 0;
    };

    const getUserMaxPrice = async () => {
      const getUserMaxPriceSql = `
        SELECT max_price
        FROM AUCTION.USER_BIDS
        WHERE user_id = $1 AND product_id = $2
      `;

      const getUserMaxPriceResult = await this.safeQueryWithClient<{
        max_price: number;
      }>(poolClient, getUserMaxPriceSql, [bid.user_id, bid.product_id]);

      return getUserMaxPriceResult?.[0]?.max_price || null;
    };

    const getSaveUserBid = async (max_price: number | null) => {
      let saveBidPromise;
      if (!max_price) {
        // Người dùng chưa đấu giá trước đó -> thêm mới giá
        const createUserBidSql = `
          INSERT INTO AUCTION.USER_BIDS (user_id, product_id, max_price, created_at, updated_at)
          VALUES ($1, $2, $3, NOW(), NOW())
        `;
        saveBidPromise = this.safeQueryWithClient(
          poolClient,
          createUserBidSql,
          [bid.user_id, bid.product_id, bid.price]
        );
      } else {
        // Người dùng đã đấu giá trước đó -> cập nhật giá
        const updateUserBidSql = `
          UPDATE AUCTION.USER_BIDS
          SET max_price = $1, updated_at = NOW()
          WHERE user_id = $2 AND product_id = $3
        `;
        saveBidPromise = this.safeQueryWithClient(
          poolClient,
          updateUserBidSql,
          [bid.price, bid.user_id, bid.product_id]
        );
      }

      return saveBidPromise;
    };

    const getProductBidStatusPromise = async () => {
      const getProductBidStatusSql = `
        SELECT 
          P.top_bidder_id,
          P.seller_id,
          COALESCE(
            (
              SELECT BLOG.price::INT
              FROM AUCTION.BID_LOGS BLOG
              WHERE BLOG.product_id = P.id AND BLOG.user_id = P.top_bidder_id
              ORDER BY BLOG.price DESC
              LIMIT 1
            ),
            P.initial_price::INT
          ) AS current_price,
          BID.max_price::INT,
          P.price_increment::INT,
          P.buy_now_price::INT,
          P.auto_extend,
          P.end_time,
          CONF.product_threshold_time,
          CONF.product_renew_time
        FROM PRODUCT.PRODUCTS P
        LEFT JOIN AUCTION.USER_BIDS BID ON BID.user_id = P.top_bidder_id AND BID.product_id = P.id
        CROSS JOIN SYSTEM_CONFIG CONF
        WHERE P.id = $1
      `;

      return this.safeQueryWithClient<BidStatusType>(
        poolClient,
        getProductBidStatusSql,
        [bid.product_id]
      );
    };

    const updateTopBidderId = async (bidder_id: number) => {
      const updateTopBidderSql = `
        UPDATE PRODUCT.PRODUCTS
        SET top_bidder_id = $1
        WHERE id = $2
      `;
      return this.safeQueryWithClient(poolClient, updateTopBidderSql, [
        bidder_id,
        bid.product_id,
      ]);
    };

    const createBidLog = async (bidder_id: number, price: number) => {
      const writeBidLogSql = `
        INSERT INTO AUCTION.BID_LOGS (user_id, product_id, price, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
      `;
      return this.safeQueryWithClient(poolClient, writeBidLogSql, [
        bidder_id,
        bid.product_id,
        price,
      ]);
    };

    const getBidPrice = (
      current: number,
      increment: number,
      max: number,
      lower: number
    ): number => {
      const delta = lower - current;
      const minSignificantGap =
        Math.ceil((1.0 * delta) / increment) * increment;
      const upperboundPrice = current + minSignificantGap;
      return upperboundPrice - (upperboundPrice > max ? increment : 0);
    };
    //Lấy thông tin người bán
    const getSellerInfo = async () => {
      const sql = `
      SELECT u.*
      FROM admin.users as u 
      JOIN product.products as p ON u.id = p.seller_id
      WHERE p.id = $1 `;
      const params = [bid.product_id];
      const result: User[] = await this.safeQueryWithClient(
        poolClient,
        sql,
        params
      );
      return result[0];
    };

    //Lấy thông tin user
    const getUserInfo = async (id: number) => {
      const sql = `
      SELECT u.*
      FROM admin.users as u 
      WHERE u.id = $1 `;
      const params = [id];
      const result: User[] = await this.safeQueryWithClient(
        poolClient,
        sql,
        params
      );

      return result[0];
    };
    //Lấy thông tin sản phẩm
    const getProductInfo = async (id: number) => {
      const sql = `
      SELECT p.*
      FROM product.products as p 
      WHERE p.id = $1 `;
      const params = [id];
      const result: Product[] = await this.safeQueryWithClient(
        poolClient,
        sql,
        params
      );

      return result[0];
    };

    const extendProductEndTimeIfNecessary = async (
      auto_extend: boolean,
      end_time: Date,
      threshold: number,
      extend: number
    ) => {
      if (!auto_extend) return;
      const nowTime = new Date();
      const diffInMinutes: number =
        (end_time.getTime() - nowTime.getTime()) / (1000 * 60);
      if (diffInMinutes > 0 && diffInMinutes <= threshold) {
        const newEndTime = new Date(end_time.getTime() + extend * 1000 * 60);
        const result = await this.safeQuery(
          `
          UPDATE product.products
          SET
            end_time = $1,
            updated_at = NOW()
          WHERE id = $2
        `,
          [newEndTime, bid.product_id]
        );
      }
    };

    try {
      await poolClient.query("BEGIN");

      // 1. Kiểm tra user có bị đánh blacklist không
      if (await isUserInBlackList()) {
        await poolClient.query("ROLLBACK");
        return { success: false };
      }

      // 2. Lưu thông tin đấu giá mới của người dùng
      const user_max_price = await getUserMaxPrice();
      const saveBidPromise = getSaveUserBid(user_max_price);
      const productBidStatusPromise = getProductBidStatusPromise();
      const [_, productBidStatusResult] = await Promise.all([
        saveBidPromise,
        productBidStatusPromise,
      ]);

      // 3. Lấy thông tin đấu giá hiện tại của sản phẩm
      const productBidStatus: BidStatusType = productBidStatusResult[0]!;
      const {
        seller_id,
        current_price,
        price_increment,
        buy_now_price,
        auto_extend,
        end_time,
        product_threshold_time,
        product_renew_time,
      } = productBidStatus;

      // 4. Kiểm tra giá bid có hợp lệ điều kiện cần không
      if (bid.user_id == seller_id) {
        await poolClient.query("ROLLBACK");
        return { success: false };
      }
      if (bid.price < current_price + price_increment) {
        await poolClient.query("ROLLBACK");
        return { success: false };
      }

      //Gửi Mail
      const sellerInfo: User | undefined = await getSellerInfo();
      const bidderInfo: User | undefined = await getUserInfo(bid.user_id);
      const productInfo: Product | undefined = await getProductInfo(
        bid.product_id
      );

      let nowPrice = 0;
      // 5. Thực hiện so sánh và lưu kết quả đấu giá
      if (productBidStatus.top_bidder_id == bid.user_id) {
        await poolClient.query("COMMIT");
        if (sellerInfo && bidderInfo && productInfo) {
          sendEmailToUser(
            sellerInfo.email,
            "THÔNG BÁO VỀ SẢN PHẨM ĐANG BÁN",
            `
        <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
          <tr>
            <td style="background-color:#173E8C; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
              Thông báo đấu giá
            </td>
          </tr>
          <tr>
            <td style="padding:20px; font-size:16px; line-height:1.5; color:#333;">
              <p>Người đấu giá <strong> ${bidderInfo.name}</strong> </p>
              <p>Đã đấu giá sản phẩm <strong>${
                productInfo.name
              }</strong> của bạn</p>
              <p>Với mức giá:<strong> ${formatPrice(bid.price)}</strong> </p>
              <p>Mức giá hiện tại:<strong> ${formatPrice(
                productBidStatus.current_price
              )}</strong> </p>
              <p>Giá mua ngay:<strong> ${formatPrice(
                productInfo.buy_now_price
              )}</strong> </p> 
            </td>
          </tr>
        </table>
           `
          ); //Seller

          sendEmailToUser(
            bidderInfo.email,
            "THÔNG BÁO VỀ SẢN PHẨM ĐÃ ĐẤU GIÁ",
            `
          <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
            <tr>
              <td style="background-color:#28a745; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
                Thông báo đấu giá thành công
              </td>
            </tr>
            <tr>
              <td style="padding:20px; font-size:16px; line-height:1.5; color:#333;">
                <p>Bạn đã đấu giá thành công sản phẩm: <strong>${
                  productInfo.name
                }</strong></p>
                <p>Của người bán: <strong>${sellerInfo.name}</strong></p>
                <p>Với mức giá:<strong> ${formatPrice(bid.price)}</strong></p>
                <p>Giá hiện tại của sản phẩm: <strong>${formatPrice(
                  productBidStatus.current_price
                )}</strong></p>
              </td>
            </tr>
  
          </table>
         `
          ); //Bidder
        }
        return { success: true };
      }

      const order: NewOrderRequest = {
        product_id: bid.product_id,
        price: buy_now_price || 0,
        shipping_address: "",
      };
      if (!productBidStatus.top_bidder_id) {
        //TH1: Sản phẩm chưa có lượt đấu giá -> user là top_bidder
        const updateTopBidderPromise = updateTopBidderId(bid.user_id);

        let bidPrice = current_price + price_increment;
        if (buy_now_price)
          bidPrice = Math.min(buy_now_price, current_price + price_increment);

        const writeBidLogPromise = createBidLog(
          bid.user_id,
          current_price + price_increment
        );
        nowPrice = current_price + price_increment;
        const extendEndTimePromise = extendProductEndTimeIfNecessary(
          auto_extend,
          end_time,
          product_threshold_time,
          product_renew_time
        );

        await Promise.all([
          updateTopBidderPromise,
          writeBidLogPromise,
          extendEndTimePromise,
        ]);

        if (buy_now_price && bidPrice == buy_now_price) {
          await this.orderService.createOrder(bid.user_id, order);
        }
      } else {
        // TH2: Sản phẩm đã được đấu giá trước đó
        if (bid.price <= productBidStatus.max_price) {
          // Đấu giá thua
          let opponentBidPrice = getBidPrice(
            current_price,
            price_increment,
            productBidStatus.max_price,
            bid.price
          );
          if (buy_now_price)
            opponentBidPrice = Math.min(buy_now_price, opponentBidPrice);

          nowPrice = opponentBidPrice;
          const createBidLogPromise = createBidLog(
            productBidStatus.top_bidder_id,
            opponentBidPrice
          );
          const extendEndTimePromise = extendProductEndTimeIfNecessary(
            auto_extend,
            end_time,
            product_threshold_time,
            product_renew_time
          );

          await Promise.all([createBidLogPromise, extendEndTimePromise]);

          if (buy_now_price && opponentBidPrice == buy_now_price) {
            await this.orderService.createOrder(
              productBidStatus.top_bidder_id,
              order
            );
          }
        } else {
          // Đấu giá thắng
          let myBidPrice = getBidPrice(
            current_price,
            price_increment,
            bid.price,
            productBidStatus.max_price
          );
          if (buy_now_price) myBidPrice = Math.min(buy_now_price, myBidPrice);

          const writeBidLogPromise = createBidLog(bid.user_id, myBidPrice);
          const updateTopBidderPromise = updateTopBidderId(bid.user_id);
          const extendEndTimePromise = extendProductEndTimeIfNecessary(
            auto_extend,
            end_time,
            product_threshold_time,
            product_renew_time
          );

          await Promise.all([
            writeBidLogPromise,
            updateTopBidderPromise,
            extendEndTimePromise,
          ]);

          if (buy_now_price && myBidPrice == buy_now_price) {
            await this.orderService.createOrder(bid.user_id, order);
          }

          const oldBidderInfo: User | undefined = await getUserInfo(
            productBidStatus.top_bidder_id
          );

          nowPrice = myBidPrice;
          if (oldBidderInfo && sellerInfo && bidderInfo && productInfo) {
            sendEmailToUser(
              oldBidderInfo.email,
              "THÔNG BÁO VỀ SẢN PHẨM ĐANG ĐẤU GIÁ",
              `
            <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
              <tr>
                <td style="background-color:#dc3545; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
                  Cập nhật đấu giá
                </td>
              </tr>
              <tr>
                <td style="padding:20px; font-size:16px; line-height:1.5; color:#333;">
                  <p>Đã có người đấu giá thành công sản phẩm <strong>
                          <a 
                            href="${
                              process.env.NEXT_PUBLIC_CLIENT_URL
                            }/product/${productInfo.slug}" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style="color: #0d6efd; text-decoration: underline;"
                          >
                            ${productInfo.name}
                          </a>
                        </strong> mà bạn đang tham gia</p>
                  <p>Của người bán:<strong>  ${sellerInfo.name}</strong></p>
                  <p>Mức giá hiện tại của sản phẩm: <strong>${formatPrice(
                    myBidPrice
                  )}</strong></p>
                </td>
              </tr>
             
            </table>
              `
            ); //Old bidder
          }
        }
      }
      await poolClient.query("COMMIT");

      if (sellerInfo && bidderInfo && productInfo) {
        sendEmailToUser(
          sellerInfo.email,
          "THÔNG BÁO VỀ SẢN PHẨM ĐANG BÁN",
          `
        <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
          <tr>
            <td style="background-color:#173E8C; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
              Thông báo đấu giá
            </td>
          </tr>
          <tr>
            <td style="padding:20px; font-size:16px; line-height:1.5; color:#333;">
              <p>Người đấu giá <strong> ${bidderInfo.name}</strong> </p>
              <p>Đã đấu giá sản phẩm <strong>${
                productInfo.name
              }</strong> của bạn</p>
              <p>Với mức giá:<strong> ${formatPrice(bid.price)}</strong> </p>
              <p>Mức giá hiện tại:<strong> ${formatPrice(
                nowPrice
              )}</strong> </p>
              <p>Giá mua ngay:<strong> ${formatPrice(
                productInfo.buy_now_price!
              )}</strong> </p>
            </td>
          </tr>
        </table>
           `
        ); //Seller

        sendEmailToUser(
          bidderInfo.email,
          "THÔNG BÁO VỀ SẢN PHẨM ĐÃ ĐẤU GIÁ",
          `
          <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
            <tr>
              <td style="background-color:#28a745; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
                Thông báo đấu giá thành công
              </td>
            </tr>
            <tr>
              <td style="padding:20px; font-size:16px; line-height:1.5; color:#333;">
                <p>Bạn đã đấu giá thành công sản phẩm: <strong>${
                  productInfo.name
                }</strong></p>
                <p>Của người bán: <strong>${sellerInfo.name}</strong></p>
                <p>Với mức giá:<strong> ${formatPrice(bid.price)}</strong></p>
                <p>Giá hiện tại của sản phẩm: <strong>${formatPrice(
                  nowPrice
                )}</strong></p>
              </td>
            </tr>

          </table>
         `
        ); //Bidder
      }
      return { success: true };
    } catch (e) {
      await poolClient.query("ROLLBACK");
      console.error("Bid transaction failed:", e);
      return { success: false };
    } finally {
      poolClient.release();
    }
  }
  async createReject(bid: BidLog): Promise<MutationResult> {
    const poolClient = await this.getClient();

    const getEmailBidder = async (id: number) => {
      const sql = `
      SELECT u.email 
      FROM admin.users as u 
      WHERE u.id = $1 `;
      const params = [id];
      const result: { email: string }[] = await this.safeQueryWithClient(
        poolClient,
        sql,
        params
      );
      return result[0]?.email ?? "";
    };
    try {
      await poolClient.query("BEGIN");
      let sql = `INSERT INTO auction.black_list(user_id, product_id, created_at, updated_at)
                VALUES
                ($1, $2, NOW(), NOW())`;
      await this.safeQueryWithClient(poolClient, sql, [
        bid.user,
        bid.product_id,
      ]);
      sql =
        "DELETE FROM auction.bid_logs WHERE user_id = $1 and product_id = $2";
      await this.safeQueryWithClient(poolClient, sql, [
        bid.user,
        bid.product_id,
      ]);

      const emailBidder: string = await getEmailBidder(bid.user.id);

      sendEmailToUser(
        emailBidder,
        "THÔNG BÁO VỀ SẢN PHẨM ĐANG ĐẤU GIÁ",
        `
            <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
              <tr>
                <td style="background-color:#6c757d; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
                  Thông báo đấu giá
                </td>
              </tr>
              <tr>
                <td style="padding:20px; font-size:16px; line-height:1.5; color:#333;">
                  <p>Người bán: <strong>[Tên seller]</strong></p>
                  <p>Đã chặn bạn không được phép đấu giá sản phẩm:</p>
                  <p style="font-weight:bold;">[Tên sản phẩm]</p>
                </td>
              </tr>
  
            </table>
        `
      );
      await poolClient.query("COMMIT");
      return { success: true };
    } catch (error) {
      await poolClient.query("ROLLBACK");
      return { success: false };
    }
  }
  // async getBiddingProduct(userId: number): Promise<>

  async blacklistABuyer(
    product_id: number,
    seller_id: number,
    buyer_id: number
  ): Promise<MutationResult> {
    const productWithSellerSql = `
        SELECT *
        FROM PRODUCT.PRODUCTS
        WHERE id = $1 AND seller_id = $2
      `;
    const product = await this.safeQuery<any>(productWithSellerSql, [
      product_id,
      seller_id,
    ]);
    if (!product || product.length != 1) return { success: false };

    const insertToBlacklistSql = `
      INSERT INTO AUCTION.BLACK_LIST (user_id, product_id, created_at, updated_at)
      SELECT $1, P.id, NOW(), NOW()
      FROM PRODUCT.PRODUCTS P
      WHERE P.id = $2 AND P.seller_id = $3
      ON CONFLICT (user_id, product_id) DO NOTHING
      RETURNING user_id;
    `;
    const getNextTwoTopBiddersSql = `
        SELECT BID.user_id, BID.max_price
        FROM AUCTION.USER_BIDS BID
        WHERE BID.product_id = $1 AND 
        NOT EXISTS (SELECT 1 
                    FROM AUCTION.BLACK_LIST BL 
                    WHERE BL.product_id = BID.product_id
                    AND BL.user_id = BID.user_id)
        AND BID.user_id != $2
        ORDER BY BID.max_price DESC, BID.UPDATED_AT desc, BID.created_at desc
        LIMIT 2
      `;

    const [insertToBlacklistResult, nextTwoTopBidders] = await Promise.all([
      this.safeQuery<{ user_id: number }>(insertToBlacklistSql, [
        buyer_id,
        product_id,
        seller_id,
      ]),
      this.safeQuery<{ user_id: number; price: number }>(
        getNextTwoTopBiddersSql,
        [product_id, buyer_id]
      ),
    ]);

    // Nếu người này đã từng bị blacklist rồi
    if (
      insertToBlacklistResult.length == 0 ||
      insertToBlacklistResult[0]?.user_id == null
    )
      return { success: false };

    // Nếu người bị blacklist không phải dẫn đầu -> dừng
    //Email của người bị chặn
    const getEmailBidder = async (id: number) => {
      const sql = `
      SELECT u.email 
      FROM admin.users as u 
      WHERE u.id = $1 `;
      const params = [id];
      const result: { email: string }[] = await this.safeQuery(sql, params);
      return result[0]?.email ?? "";
    };

    //Thông tin người bán
    const getSellerInfo = async () => {
      const sql = `
      SELECT u.*
      FROM admin.users as u 
      JOIN product.products as p ON u.id = p.seller_id
      WHERE p.id = $1 `;
      const params = [product_id];
      const result: User[] = await this.safeQuery(sql, params);
      return result[0];
    };
    const sellerInfo: User | undefined = await getSellerInfo();
    const emailBidder: string = await getEmailBidder(buyer_id);
    if (sellerInfo) {
      sendEmailToUser(
        emailBidder,
        "THÔNG BÁO VỀ SẢN PHẨM ĐANG ĐẤU GIÁ",
        `
              <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
          <tr>
            <td style="background-color:#6c757d; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
              Thông báo đấu giá
            </td>
          </tr>
          <tr>
            <td style="padding:20px; font-size:16px; line-height:1.5; color:#333;">
              <p>Người bán <strong>${sellerInfo.name}</strong></p>
              <p>Đã chặn bạn không được phép đấu giá sản phẩm: <strong>${product[0].name}</strong></p>
            </td>
          </tr>
        
        </table>
`
      );
    }

    if (product?.[0]?.top_bidder_id != buyer_id) return { success: true };

    // Người bị blacklist đang dẫn đầu -> phải cập nhật lại top_bidder
    const isStillTopBidder = async (target_id: number) => {
      const secondBidderInLogs = `
        SELECT user_id
        FROM AUCTION.BID_LOGS
        WHERE user_id != $1
        ORDER BY UPDATED_AT desc
        LIMIT 1
      `;

      const result = await this.safeQuery<{ user_id: number }>(
        secondBidderInLogs,
        [buyer_id]
      );

      return result[0]?.user_id == target_id;
    };

    if (!nextTwoTopBidders || nextTwoTopBidders.length == 0) {
      // Chưa có bidder nào
      await this.safeQuery(
        `
          UPDATE PRODUCT.PRODUCTS
          SET top_bidder_id = null, UPDATED_AT = NOW()
          WHERE id = $1
        `,
        [product_id]
      );
    } else if (nextTwoTopBidders.length == 1) {
      // Chỉ có một bidder đang đấu giá duy nhất
      const nextBidder = nextTwoTopBidders[0]!;
      const promises = [];
      if (!isStillTopBidder(nextBidder.user_id)) {
        promises.push(
          this.safeQuery(
            `
            INSERT INTO AUCTION.BID_LOGS (user_id, product_id, price, created_at, updated_at)
            SELECT $1, P.id, P.initial_price + P.price_increment, NOW(), NOW()
            FROM PRODUCT.PRODUCTS P
            WHERE id = $2
          `,
            [nextBidder.user_id, product_id]
          )
        );
      }

      promises.push(
        this.safeQuery(
          `
            UPDATE PRODUCT.PRODUCTS
            SET top_bidder_id = $1, UPDATED_AT = NOW()
            WHERE id = $2
          `,
          [nextBidder.user_id, product_id]
        )
      );

      await Promise.all(promises);
    } else {
      // Đã có đủ 2 bidder trở lên
      const [firstBidder, secondBidder] = nextTwoTopBidders!;
      const promises = [];
      if (!isStillTopBidder(firstBidder!.user_id)) {
        promises.push(
          this.safeQuery(
            `
            INSERT INTO AUCTION.BID_LOGS (user_id, product_id, price, created_at, updated_at)
            VALUES ($1, $2, $3, NOW(), NOW())
          `,
            [firstBidder?.user_id, product_id, secondBidder?.price]
          )
        );
      }

      promises.push(
        this.safeQuery(
          `
            UPDATE PRODUCT.PRODUCTS
            SET top_bidder_id = $1, UPDATED_AT = NOW()
            WHERE id = $2
          `,
          [firstBidder?.user_id, product_id]
        )
      );

      await Promise.all(promises);
    }

    return { success: true, id: product?.[0]?.id, slug: product?.[0]?.slug };
  }
  async getCanBid(userId: number, product_slug: string): Promise<CanBid> {
    const sql = `
              SELECT user_id
              FROM product.products as p
              JOIN auction.black_list as l ON p.id = l.product_id
              WHERE p.slug = $1 AND l.user_id = $2
                `;
    const params = [product_slug, userId];
    const rs: { user_id: number }[] = await this.safeQuery(sql, params);
    if (rs.length === 0) {
      return { canBid: true };
    } else {
      return { canBid: false };
    }
  }
}
