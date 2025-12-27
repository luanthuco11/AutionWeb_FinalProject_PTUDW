import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendForgetPasswordOTPEmail = async (email: string, otp: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Đội ngũ phát triển" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mã xác thực đổi mật khẩu ",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #333;">Xác nhận quên mật khẩu</h2>
                    <p>Chào bạn,</p>
                    <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP dưới đây để hoàn tất quá trình:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #007bff; padding: 10px; background: #f4f4f4; text-align: center; border-radius: 5px;">
                        ${otp}
                    </div>
                    <p style="margin-top: 20px;">Mã này sẽ hết hạn trong <b>5 phút</b>.</p>
                    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
                    <hr style="border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #888;">Đây là email tự động, vui lòng không phản hồi.</p>
                </div>
            `,
    });

    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const sendRegisterOTPEmail = async (email: string, otp: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Đội ngũ phát triển" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mã xác thực đăng kí tài khoản ",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px;">
                    <h2 style="color: #333;">Xác nhận đăng kí tài khoản </h2>
                    <p>Chào bạn,</p>
                    <p>Bạn đã yêu cầu đăng kí tài khoản. Vui lòng sử dụng mã OTP dưới đây để hoàn tất quá trình:</p>
                    <div style="font-size: 24px; font-weight: bold; color: #007bff; padding: 10px; background: #f4f4f4; text-align: center; border-radius: 5px;">
                        ${otp}
                    </div>
                    <p style="margin-top: 20px;">Mã này sẽ hết hạn trong <b>5 phút</b>.</p>
                    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
                    <hr style="border: none; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #888;">Đây là email tự động, vui lòng không phản hồi.</p>
                </div>
            `,
    });

    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.log(error);
  }
};

export const sendEmailToUser = async (
  receiver: string,
  subject: string,
  html: string
) => {
  try {
    const info = await transporter.sendMail({
      from: `"Auction bid" <${process.env.EMAIL_USER}>`,
      to: receiver,
      subject: subject,
      html: html,
    });

    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.log(error);
  }
};
