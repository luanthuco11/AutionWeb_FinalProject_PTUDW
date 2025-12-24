import {
  BidLog,
  CreateBidLog,
  UserBidInfo,
} from "../../../shared/src/types/Bid";
import { BaseService } from "./BaseService";
import { MutationResult } from "../../../shared/src/types/Mutation";

type BidStatusType = {
  top_bidder_id: number;
  seller_id: number;
  current_price: number;
  max_price: number;
  price_increment: number;
};

export class BidService extends BaseService {
  private static instance: BidService;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!BidService.instance) {
      BidService.instance = new BidService();
    }
    return BidService.instance;
  }
  async getBidLogs(id: number): Promise<BidLog[]> {
    const sql = `SELECT *, json_build_object(
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
    console.log(bid);

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
          P.price_increment::INT
        FROM PRODUCT.PRODUCTS P
        LEFT JOIN AUCTION.USER_BIDS BID ON BID.user_id = P.top_bidder_id AND BID.product_id = P.id
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

    try {
      await poolClient.query("BEGIN");

      console.log(1);
      // 1. Kiểm tra user có bị đánh blacklist không
      if (await isUserInBlackList()) {
        await poolClient.query("ROLLBACK");
        console.log("Người dùng có trong blacklist");
        return { success: false };
      }

      console.log(2);
      // 2. Lưu thông tin đấu giá mới của người dùng
      const user_max_price = await getUserMaxPrice();
      const saveBidPromise = getSaveUserBid(user_max_price);
      const productBidStatusPromise = await getProductBidStatusPromise();
      const [_, productBidStatusResult] = await Promise.all([
        saveBidPromise,
        productBidStatusPromise,
      ]);

      console.log(3);
      // 3. Lấy thông tin đấu giá hiện tại của sản phẩm
      const productBidStatus: BidStatusType = productBidStatusResult[0]!;
      const { seller_id, current_price, price_increment } = productBidStatus;

      console.log(4);
      // 4. Kiểm tra giá bid có hợp lệ điều kiện cần không
      if (bid.user_id == seller_id) {
        await poolClient.query("ROLLBACK");
        console.log("Seller không được đấu giá sản phẩm mình bán");
        return { success: false };
      }
      if (bid.price < current_price + price_increment) {
        await poolClient.query("ROLLBACK");
        console.log("Giá đấu thấp hơn yêu cầu tối thiểu");
        return { success: false };
      }

      console.log(5);
      // 5. Thực hiện so sánh và lưu kết quả đấu giá
      if (productBidStatus.top_bidder_id == bid.user_id) {
        console.log("Bidder vẫn đang thắng đấu giá");
        await poolClient.query("COMMIT");
        console.log("Commit thành công");
        return { success: true };
      }
      if (!productBidStatus.top_bidder_id) {
        //TH1: Sản phẩm chưa có lượt đấu giá -> user là top_bidder
        const updateTopBidderPromise = updateTopBidderId(bid.user_id);
        const writeBidLogPromise = createBidLog(
          bid.user_id,
          current_price + price_increment
        );
        await Promise.all([updateTopBidderPromise, writeBidLogPromise]);
      } else {
        // TH2: Sản phẩm đã được đấu giá trước đó
        if (bid.price <= productBidStatus.max_price) {
          // Đấu giá thua
          const opponentBidPrice = getBidPrice(
            current_price,
            price_increment,
            productBidStatus.max_price,
            bid.price
          );
          createBidLog(productBidStatus.top_bidder_id, opponentBidPrice);
        } else {
          // Đấu giá thắng
          const myBidPrice = getBidPrice(
            current_price,
            price_increment,
            bid.price,
            productBidStatus.max_price
          );

          const writeBidLogPromise = createBidLog(bid.user_id, myBidPrice);
          const updateTopBidderPromise = updateTopBidderId(bid.user_id);

          await Promise.all([writeBidLogPromise, updateTopBidderPromise]);
        }
      }

      await poolClient.query("COMMIT");
      console.log("Commit thành công");

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
    let sql = `INSERT INTO auction.black_list(user_id, product_id, created_at, updated_at)
                VALUES
                ($1, $2, NOW(), NOW())`;
    await this.safeQuery(sql, [bid.user, bid.product_id]);
    sql = "DELETE FROM auction.bid_logs WHERE user_id = $1 and product_id = $2";
    await this.safeQuery(sql, [bid.user, bid.product_id]);
    return { success: true };
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
}
