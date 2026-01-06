import {
  CreateResetPasswordOTP,
  PendingUserHashOTP,
  UserHashOTP,
  UserRegisterOTP,
} from "../../../shared/src/types/ResetPasswordOTP";
import {
  CreateRefreshToken,
  RefreshToken,
} from "./../../../shared/src/types/RefreshToken";
import {
  ChangePasswordRequest,
  CreateTempUser,
  CreateUser,
  RegisterRequest,
  ResetPasswordRequest,
  ResetUserPasswordRequest,
  SignRequest,
  UserEntity,
} from "../../../shared/src/types";
import { BaseController } from "./BaseController";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendEmailToUser,
  sendForgetPasswordOTPEmail,
  sendRegisterOTPEmail,
} from "../utils/mailer";
import { UserOTP } from "./../../../shared/src/types/ResetPasswordOTP";
import axios from "axios";
import { generatePassword } from "../utils/password";
const ACCESS_TOKEN_TTL = "15m";
const RESET_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 days (ms)
const RESET_PASSWORD_OTP_TTL = 5 * 60 * 1000;
const VERIFY_EMAIL_OTP_TTL = 6 * 60 * 1000;
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
      !registerUser.username ||
      !registerUser.address ||
      !registerUser.captchaToken
    ) {
      throw new Error(
        "Không thể thiếu username, password, email, name hoặc re-captcha"
      );
    }

    // Kiem tra username co ton tai chua
    const duplicateUsername = await this.service.getUserByUserName(
      registerUser.username
    );

    if (duplicateUsername) {
      throw new Error("Tên đăng nhập đã tồn tại");
    }

    const duplicateEmail = await this.service.getUserByEmail(
      registerUser.email
    );

    if (duplicateEmail) {
      throw new Error("Email đã tồn tại");
    }

    // Ma hoa password
    const hashPassword = await bcrypt.hash(registerUser.password, 10); // salt = 10
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_hash = await bcrypt.hash(otp, 10);
    const newUser: CreateTempUser = {
      username: registerUser.username,
      email: registerUser.email,
      password_hash: hashPassword,
      name: registerUser.name,
      address: registerUser.address,
      expired_at: new Date(Date.now() + VERIFY_EMAIL_OTP_TTL),
      otp_hash: otp_hash,
    };
    // Check logic re-captcha
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${registerUser.captchaToken}`;

    const response = await axios.post(googleVerifyUrl);
    const { success } = response.data;
    if (!success) {
      throw new Error("Xác thực Captcha thất bại, vui lòng thử lại.");
    }

    // Tao user moi
    await this.service.deletePendingUserOTPByEmail(newUser.email);
    await this.service.createTempUser(newUser);

    await sendRegisterOTPEmail(registerUser.email, otp);

    return {
      message: "Cần xác thực OTP để đăng kí thành công",
    };
  }

  async signIn(req: Request, res: Response) {
    // Lay input
    const signUser: SignRequest = req.body;

    if (!signUser.username || !signUser.password) {
      throw new Error("Không thể thiếu tên đăng nhập hoặc mật khẩu");
    }

    // Kiem tra user
    const user = await this.service.getUserByUserName(signUser.username);
    if (!user) {
      throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
    }

    // Lay hashedPassword trong db de so voi password input
    const isPasswordCorrect = await bcrypt.compare(
      signUser.password,
      user.password_hash
    );

    // Kiem tra password
    if (!isPasswordCorrect) {
      throw new Error(" Tên đăng nhập hoặc mật khẩu không đúng");
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

  async signInAdmin(req: Request, res: Response) {
    // Lay input
    const signUser: SignRequest = req.body;

    if (!signUser.username || !signUser.password) {
      throw new Error("Không thể thiếu tên đăng nhập hoặc mật khẩu");
    }

    // Kiem tra user
    const user = await this.service.getUserByUserName(signUser.username);
    if (!user) {
      throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
    }

    // Lay hashedPassword trong db de so voi password input
    const isPasswordCorrect = await bcrypt.compare(
      signUser.password,
      user.password_hash
    );

    // Kiem tra password
    if (!isPasswordCorrect) {
      throw new Error(" Tên đăng nhập hoặc mật khẩu không đúng");
    }

    if (user.role !== "admin") {
      throw new Error("Tài khoản phải có quyền admin mới có thể truy cập");
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
    res.cookie("refreshTokenAdmin", refreshToken, {
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

  async verifyRegisterOTP(req: Request, res: Response) {
    // 1. Kiem tra thong tin input
    const userOTP: UserRegisterOTP = req.body;
    if (!userOTP.email || !userOTP.otp) {
      throw new Error("Thiếu thông tin người dùng hoặc mã otp");
    }


    const otpRes: PendingUserHashOTP =
      await this.service.getPendingUserOTPByEmail(userOTP.email);
    if (!otpRes) {
      throw new Error("OTP hết hạn hoặc không hợp lệ 123");
    }

    // 4. Kiem tra otp co hop le hay khong ?
    const isOTPCorrect = await bcrypt.compare(userOTP.otp, otpRes.otp_hash);

    if (!isOTPCorrect) {
      throw new Error("OTP không hợp lệ");
    }

    // 4. Đánh dấu OTP is verified
    await this.service.updateResetPasswordOTP(otpRes.user_id);
    const createUser: CreateUser = {
      name: otpRes.name,
      username: otpRes.user_name,
      email: otpRes.email,
      address: otpRes.address,
      password_hash: otpRes.password_hash,
    };

    await this.service.createUser(createUser);

    return {
      message: "Tạo tài khoản thành công",
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

  async signOutAdmin(req: Request, res: Response) {
    // Lay refresh token tu cookie
    const token = req.cookies?.refreshTokenAdmin;

    if (token) {
      // Xoa refresh token trong session
      await this.service.deleteRefreshToken(token);

      // Xoa cookie
      res.clearCookie("refreshTokenAdmin");
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

  async refreshTokenAdmin(req: Request, res: Response) {
    // Lay refresh token tu cookie
    const token = req.cookies?.refreshTokenAdmin;
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

  async forgetPassword(req: Request, res: Response) {
    // Kiem tra username co ton tai
    const { username, email } = req.body;
    if (!username || !email) {
      throw new Error("Vui lòng nhập đủ thông tin tên đăng nhập và email");
    }
    const user = await this.service.getUserByUserNameAndEmail(username, email);
    if (!user) {
      throw new Error("Tên đăng nhập hoặc email  không hợp lệ");
    }

    // Tao OTP va hash OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_hash = await bcrypt.hash(otp, 10);

    // Luu OTP hash vao db
    const createResetPasswordOTP: CreateResetPasswordOTP = {
      user_id: user.id,
      otp_hash: otp_hash,
      expired_at: new Date(Date.now() + RESET_PASSWORD_OTP_TTL),
    };

    await this.service.deleteResetPasswordOTPByUserId(
      createResetPasswordOTP.user_id
    );
    await this.service.createResetPasswordOTP(createResetPasswordOTP);

    // Gui gmail vs OTP do

    await sendForgetPasswordOTPEmail(user.email, otp);

    return {
      message: "Gửi email thành công",
      userId: user.id,
    };
  }

  async verifyOTP(req: Request, res: Response) {
    // 1. Kiem tra thong tin input
    const userOTP: UserOTP = req.body;
    if (!userOTP.user_id || !userOTP.otp) {
      throw new Error("Thiếu thông tin người dùng hoặc mã otp");
    }

    // 2. Lay thong tin user
    const user: UserEntity = await this.service.getUserById(userOTP.user_id);
    if (!user) {
      throw new Error("Không tồn tại thông tin người dùng");
    }
    const userId = user.id;

    // 3. Lay record cua user o reset password otp
    const otpRes: UserHashOTP = await this.service.getResetPasswordOTPById(
      userOTP.user_id
    );
    if (!otpRes) {
      throw new Error("OTP hết hạn hoặc không hợp lệ");
    }

    // 4. Kiem tra otp co hop le hay khong ?
    const isOTPCorrect = await bcrypt.compare(userOTP.otp, otpRes.otp_hash);

    if (!isOTPCorrect) {
      throw new Error("OTP không hợp lệ");
    }

    // 4. Đánh dấu OTP is verified
    await this.service.updateResetPasswordOTP(userOTP.user_id);

    // 5. Tao reset token (cho bước nhập mật khẩu mới)
    const resetToken = jwt.sign(
      { userId, type: "reset-password" },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: RESET_TOKEN_TTL }
    );
    return {
      message: "Xác thực OTP thành công",
      resetToken,
    };
  }

  async resetPassword(req: Request, res: Response) {
    const userConfirm: ResetPasswordRequest = req.body;
    const user = req.user;
    if (!user || !user.id) {
      throw new Error("Phiên làm việc không hợp lệ hoặc đã hết hạn");
    }
    if (!userConfirm.newPassword || !userConfirm.confirmPassword) {
      throw new Error("Vui lòng nhập đầy đủ thông tin mật khẩu");
    }

    if (userConfirm.newPassword != userConfirm.confirmPassword) {
      throw new Error(
        "Thông tin mật khẩu mới và xác nhận mật khẩu mới không chính xác"
      );
    }
    const passwordHash: string = await bcrypt.hash(userConfirm.newPassword, 10);
    await this.service.updateHashPassword(user?.id, passwordHash);
    await this.service.cleanupOTP(user?.id);

    return {
      message: "Thay đổi mật khẩu thành công. Vui lòng đăng nhập lại",
    };
  }

  async changePassword(req: Request, res: Response) {
    const userConfirm: ChangePasswordRequest = req.body;
    const user = req.user;

    // 1. Kiem tra thong tin user
    if (!user || !user.id) {
      throw new Error("Phiên làm việc không hợp lệ hoặc đã hết hạn");
    }
    if (
      !userConfirm.oldPassword ||
      !userConfirm.newPassword ||
      !userConfirm.confirmPassword
    ) {
      throw new Error("Vui lòng nhập đầy đủ thông tin mật khẩu");
    }

    // 2. Check dieu kien
    // 2.1 Check mat khau moi va xac nhan mat khau moi phai giong nhau
    if (userConfirm.newPassword != userConfirm.confirmPassword) {
      throw new Error(
        "Thông tin mật khẩu mới và xác nhận mật khẩu mới không chính xác"
      );
    }

    // // 2.2 Check mat khau cu phai khop trong db
    const userInfo: UserEntity = await this.service.getUserById(user.id);
    if (!userInfo) {
      throw new Error("Tài khoản không tồn tại");
    }

    const oldHashPassword = userInfo.password_hash;
    const isCorrectPassword = await bcrypt.compare(
      userConfirm.oldPassword,
      oldHashPassword
    );
    if (!isCorrectPassword) {
      throw new Error("Mật khẩu cũ không đúng");
    }

    // 4. Ma hoa mat khau moi va luu  vao db
    const passwordHash: string = await bcrypt.hash(userConfirm.newPassword, 10);
    await this.service.updateHashPassword(user?.id, passwordHash);
    await this.service.cleanupOTP(user?.id);

    return {
      message: "Thay đổi mật khẩu thành công",
    };
  }

  async reSendPendingUserOTP(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      throw new Error("Phiên làm việc không hợp lệ hoặc đã hết hạn");
    }

    // lay record
    const otpRecord: PendingUserHashOTP =
      await this.service.getPendingUserOTPByEmail(email);

    // check xem co record ko ?
    if (!otpRecord) {
      throw new Error("Tải khoản của bạn chưa qua bước đăng kí");
    }
    // Tao otp moi
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_hash = await bcrypt.hash(otp, 10);

    // Cap nhat lai record do
    await this.service.updateHashOTPPendingUserById(
      otpRecord.user_id,
      otp_hash
    );

    await sendRegisterOTPEmail(otpRecord.email, otp);
    return {
      message: "Gửi lại OTP thành công",
    };
  }

  async reSendResetPasswordOTP(req: Request, res: Response) {
    const { userId } = req.body;

    if (!userId) {
      throw new Error("Phiên làm việc không hợp lệ hoặc đã hết hạn");
    }

    const user: UserEntity = await this.service.getUserById(userId);

    if (!user) {
      throw new Error("Tài khoản này chưa được đăng kí");
    }

    // 1. lay record
    const otpRecord: UserHashOTP = await this.service.getResetPasswordOTPById(
      userId
    );

    // 2. check xem co record ko ?
    if (!otpRecord) {
      throw new Error("Tải khoản của bạn chưa qua bước đăng kí");
    }
    // 3. Tao otp moi
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_hash = await bcrypt.hash(otp, 10);

    // 4. Cap nhat lai record do
    await this.service.updateHashOTPResetPasswordByUserId(
      otpRecord.user_id,
      otp_hash
    );

    // 5: Gui mail
    await sendForgetPasswordOTPEmail(user.email, otp);
    return {
      message: "Gửi lại OTP thành công",
    };
  }

  async resetUserPassword(req: Request, res: Response) {
    const body: ResetUserPasswordRequest = req.body;

    const newPassword: string = generatePassword(12);
    const passwordHash: string = await bcrypt.hash(newPassword, 10);
    await this.service.updateHashPassword(body?.userId, passwordHash);

    if (body.mail) {
      sendEmailToUser(
        body.mail,
        "THÔNG BÁO THAY ĐỔI MẬT KHẨU",
        `
    <table style="width:100%; max-width:600px; margin:auto; font-family:Arial,sans-serif; border-collapse:collapse; border:1px solid #ddd;">
      <tr>
        <td style="background-color:#dc3545; color:white; padding:20px; text-align:center; font-size:20px; font-weight:bold;">
          Thông báo thay đổi mật khẩu
        </td>
      </tr>

      <tr>
        <td style="padding:20px; font-size:15px; line-height:1.6; color:#333;">
          <p>Xin chào,</p>

          <p>
            Mật khẩu tài khoản của bạn đã được <strong>Admin</strong> thay đổi nhằm
            <strong>đảm bảo an toàn cho hệ thống</strong>.
          </p>

          <p>
            <strong>Mật khẩu tạm thời của bạn:</strong>
          </p>

          <div style="
            background-color:#f8f9fa;
            border:1px dashed #dc3545;
            padding:12px;
            font-size:18px;
            font-weight:bold;
            text-align:center;
            letter-spacing:1px;
            margin:15px 0;
          ">
            ${newPassword}
          </div>

          <p>
            Vui lòng sử dụng mật khẩu trên để
            <strong>đăng nhập tạm thời</strong> vào hệ thống tại đường link bên dưới:
          </p>

          <p style="text-align:center; margin:25px 0;">
            <a
              href="${process.env.NEXT_PUBLIC_CLIENT_URL}/login"
              target="_blank"
              rel="noopener noreferrer"
              style="
                background-color:#0d6efd;
                color:white;
                padding:12px 20px;
                text-decoration:none;
                border-radius:5px;
                font-weight:bold;
                display:inline-block;
              "
            >
              Đăng nhập hệ thống
            </a>
          </p>

          <p>
            Sau khi đăng nhập, vui lòng vào
            <strong>Hồ sơ cá nhân → Chỉnh sửa thông tin</strong>
            để <strong>cập nhật mật khẩu mới</strong>.
          </p>

          <p style="font-size:14px; color:#666; margin-top:15px;">
            ⚠️ Vì lý do bảo mật, vui lòng không chia sẻ mật khẩu tạm thời này cho bất kỳ ai
            và hãy đổi mật khẩu ngay sau khi đăng nhập.
          </p>

          <p style="margin-top:20px;">
            Trân trọng,<br/>
            <strong>Đội ngũ quản trị hệ thống</strong>
          </p>
        </td>
      </tr>
    </table>
    `
      );
    }

    return {
      message: "Thay đổi mật khẩu người dùng thành công.",
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
