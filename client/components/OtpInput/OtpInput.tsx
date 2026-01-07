"use client";

import React, { useState, useRef, useEffect } from "react";

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
}

const OtpInput = ({ length = 6, onComplete }: OtpInputProps) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Tự động focus vào ô đầu tiên khi component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return; // Chỉ cho phép nhập số

    const newOtp = [...otp];
    // Chỉ lấy ký tự cuối cùng nếu user nhập đè
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Ghép mã và gửi lên nếu đã đủ độ dài
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) {
      onComplete(combinedOtp);
    }

    // Tự động chuyển sang ô tiếp theo
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // Xử lý khi nhấn Backspace
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const data = e.clipboardData.getData("text").slice(0, length);
    if (!/^\d+$/.test(data)) return; // Chỉ xử lý nếu chuỗi paste là số

    const newOtp = [...otp];
    data.split("").forEach((char, idx) => {
      newOtp[idx] = char;
      if (inputRefs.current[idx]) {
        inputRefs.current[idx]!.value = char;
      }
    });
    setOtp(newOtp);


    // Focus vào ô cuối cùng hoặc ô tiếp theo sau chuỗi paste
    const nextIndex = data.length < length ? data.length : length - 1;
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          ref={(el) => (inputRefs.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg 
                     bg-white border-gray-300 focus:border-blue-500 focus:ring-2 
                     focus:ring-blue-200 outline-none transition-all dark:bg-gray-800 
                     dark:border-gray-600 dark:text-white"
        />
      ))}
    </div>
  );
};

export default OtpInput;
