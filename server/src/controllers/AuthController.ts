import {
  CreateRefreshToken,
  RefreshToken,
} from "./../../../shared/src/types/RefreshToken";
import {
  CreateUser,
  RegisterRequest,
  SignRequest,
  UserEntity,
} from "../../../shared/src/types";
import { BaseController } from "./BaseController";
import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/UserService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "10s"; // chinh 15p
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days (ms)
export class AuthController extends BaseController {
  constructor(service: any) {
    super(service); // inject service
  }
  async signUp(req: Request, res: Response) {
    const registerUser: RegisterRequest = req.body;

    // Check input
    if (
      !registerUser.email ||
      !registerUser.password ||
      !registerUser.name ||
      !registerUser.username
    ) {
      throw new Error("Không thể thiếu username, password, email, name");
    }

    // Kiem tra username co ton tai chua
    const duplicate = await this.service.getUserByUserName(
      registerUser.username
    );

    if (duplicate) {
      throw new Error("Username đã tồn tại");
    }

    // Ma hoa password
    const hashPassword = await bcrypt.hash(registerUser.password, 10); // salt = 10
    const newUser: CreateUser = {
      username: registerUser.username,
      email: registerUser.email,
      password_hash: hashPassword,
      name: registerUser.name,
    };

    // Tao user moi
    await this.service.createUser(newUser);
    return {
      message: "Đăng kí tài khoản thành công",
    };
  }
  async signIn(req: Request, res: Response) {
    // Lay input
    const signUser: SignRequest = req.body;

    if (!signUser.username || !signUser.password) {
      throw new Error("Không thể thiếu username hoặc password");
    }

    // Kiem tra user
    const user = await this.service.getUserByUserName(signUser.username);
    if (!user) {
      throw new Error("username hoặc password không đúng");
    }

    // Lay hashedPassword trong db de so voi password input
    const isPasswordCorrect = await bcrypt.compare(
      signUser.password,
      user.password_hash
    );

    // Kiem tra password
    if (!isPasswordCorrect) {
      throw new Error("username hoặc password không đúng");
    }

    // Neu khop , tao accessToken voi JWT
    const accessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // Tao refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // Tao session moi de luu refresh token
    const createRefreshToken: CreateRefreshToken = {
      user_id: user.id,
      token: refreshToken,
      expired_at: new Date(Date.now() + REFRESH_TOKEN_TTL),
    };

    await this.service.createRefreshToken(createRefreshToken);

    // Tra refresh token  ve trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: REFRESH_TOKEN_TTL,
    });

    return {
      message: "Đăng nhập tài khoản thành công",
      accessToken,
    };
  }
  async signOut(req: Request, res: Response) {
    // Lay refresh token tu cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // Xoa refresh token trong session
      await this.service.deleteRefreshToken(token);

      // Xoa cookie
      res.clearCookie("refreshToken");
    }
    return {
      message: "Đăng xuất thành công",
    };
  }

  async refreshToken(req: Request, res: Response) {
    // Lay refresh token tu cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      throw new Error("Token không tồn tại");
    }

    // So voi refresh token trong cookie
    const refreshToken: RefreshToken =
      await this.service.getRefreshTokenByToken(token);

    if (!refreshToken) {
      throw new Error("Token không hợp lệ hoặc hết hạn");
    }

    // Kiem tra het han chua
    if (refreshToken.expired_at < new Date()) {
      throw new Error("Token đã hết hạn");
    }

    const accessToken = jwt.sign(
      {
        userId: refreshToken.user_id,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      }
    );

    return {
      accessToken: accessToken,
    };
  }
}

export const fetchMe = async (req: Request, res: Response) => {
  try {
    const user = req.user; // lấy từ authMiddleware

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// user/

/*
Hàm jwt.sign nhận vào 3 tham số chính:
+ Tham số thứ nhất: Payload (Dữ liệu mang theo)

{ userId: user.id }: thông tin lưu trữ bên trong token.

Khi người dùng gửi token này lên server trong các request tiếp theo, server sẽ giải mã token và đọc được userId này để biết "ai đang thực hiện hành động này".

+ Tham số thứ hai: Secret Key (Khóa bí mật)

process.env.ACCESS_TOKEN_SECRET: 

Chức năng: Nó dùng để tạo ra chữ ký điện tử cho token. Chỉ có server nắm giữ khóa này mới có thể tạo ra token hợp lệ hoặc xác thực xem token có bị làm giả hay không.


Tham số thứ ba: Options (Cấu hình)

{ expiresIn: ACCESS_TOKEN_TTL }: Quy định thời gian sống (Time To Live) của token.

Đoạn code này được viết bằng JavaScript/TypeScript (thường dùng trong môi trường Node.js) sử dụng thư viện jsonwebtoken (thường được import là jwt).

Tóm lại: Đoạn code này tạo ra (ký) một "Access Token" (chìa khóa truy cập) dạng JWT cho một người dùng cụ thể.

Dưới đây là giải thích chi tiết từng thành phần:


Ví dụ: Nếu ACCESS_TOKEN_TTL là '15m' (15 phút) hoặc '1h' (1 giờ), thì sau khoảng thời gian này, token sẽ hết hạn và không còn sử dụng được nữa. Đây là cơ chế bảo mật để hạn chế rủi ro nếu token bị đánh cắp.

2. Ví dụ minh họa dễ hiểu
Hãy tưởng tượng bạn đi vào một công viên giải trí:

userId: user.id: Là thông tin ghi trên vé của bạn (VD: "Khách hàng số 123").

process.env.ACCESS_TOKEN_SECRET: Là con dấu riêng của ban quản lý công viên đóng lên vé. Nếu ai đó tự in vé giả nhưng không có con dấu này, vé sẽ không hợp lệ.

expiresIn: Là thời gian ghi trên vé (VD: "Vé chỉ có giá trị trong ngày hôm nay").

const accessToken: Chính là chiếc vé hoàn chỉnh mà bạn nhận được để đi qua cổng soát vé.
    */
