"use client";

import OtpInput from "@/components/OtpInput/OtpInput";
import {
  UserOTP,
  UserRegisterOTP,
} from "../../../shared/src/types/ResetPasswordOTP";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import AccessDenied from "@/components/AccessDefined";
export default function VerifyOtpPage() {
  const router = useRouter();
  const forgetUserId = useAuthStore((s) => s.forgetUserId);
  const pendingUserEmail = useAuthStore((s) => s.pendingUserEmail);
  const verifyOTPType: string | null = useAuthStore((s) => s.verifyOTPType);
  const verifyOTP = useAuthStore((s) => s.verifyOTP);
  const verifyRegisterOTP = useAuthStore((s) => s.verifyRegisterOTP);
  const reSendRegisterOTP = useAuthStore((s) => s.reSendRegisterOTP);
  const reSendResetPasswordOTP = useAuthStore((s) => s.reSendRResetPasswordOTP);

  const handleOtpComplete = async (otp: string) => {
    try {
      if (verifyOTPType === "forgetPassword-otp") {
        const user: UserOTP = {
          otp: otp,
          user_id: forgetUserId,
        };

        await verifyOTP(user);
        (useAuthStore.getState().resetToken);
        if (useAuthStore.getState().resetToken) {
          router.push("/reset-password");
        }
      } else if (verifyOTPType === "register-otp") {
        const user: UserRegisterOTP = {
          otp: otp,
          email: pendingUserEmail,
        };
        await verifyRegisterOTP(user);
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleResend = async () => {
    try {
      if (verifyOTPType === "forgetPassword-otp") {
        await reSendResetPasswordOTP();
      } else if (verifyOTPType === "register-otp") {
        await reSendRegisterOTP();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {verifyOTPType ? (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-2">Xác thực OTP</h1>
            <p className="text-gray-500 mb-6">
              Vui lòng nhập mã 6 số chúng tôi vừa gửi vào email của bạn.
            </p>

            <OtpInput length={6} onComplete={handleOtpComplete} />

            <button
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
              onClick={() => {
                /* Logic submit thủ công nếu cần */
              }}
            >
              Xác nhận
            </button>

            <p className="mt-4 text-sm text-gray-400">
              Chưa nhận được mã?{" "}
              <button
                onClick={handleResend}
                className="text-blue-500 cursor-pointer"
              >
                Gửi lại
              </button>
            </p>
          </div>
        </div>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}
