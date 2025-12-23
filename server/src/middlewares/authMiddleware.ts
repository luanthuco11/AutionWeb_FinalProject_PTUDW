import { User } from "./../../../shared/src/types/User";
import { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserEntity } from "../../../shared/src/types";
import { AuthService } from "../services/AuthService";
import { JwtPayload } from "jsonwebtoken";

interface DecodedUser extends JwtPayload {
  userId: number;
}

const authService = AuthService.getInstance();
/**
 * Middleware bảo vệ route (Authentication)
 *
 * @description
 * - Lấy access token từ header Authorization (Bearer token)
 * - Xác thực và giải mã JWT
 * - Truy vấn user từ database dựa trên userId trong token
 * - Gắn thông tin user vào req.user
 *
 * @throws 401 Không có token / token không hợp lệ / user không tồn tại
 *
 * @example
 * router.get("/me", protectedRoutes, fetchMe)
 */
export const protectedRoutes = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // lay token tu header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Bạn cần đăng nhập để thực hiện tác vụ này" });
    }

    // Xac nhan token hop le
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      async (error, decoded) => {
        if (error) {
          console.log(error);
          return res
            .status(403)
            .json({ message: "Access token hết hạn hoặc không đúng" });
        }
        // Tim user
        const decodedUser = decoded as DecodedUser;
        const user: UserEntity | undefined = await authService.getUserById(
          decodedUser.userId
        );
        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại" });
        }

        // tra user trong req
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.log("Lỗi khi xác minh JWT trong middleware", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
