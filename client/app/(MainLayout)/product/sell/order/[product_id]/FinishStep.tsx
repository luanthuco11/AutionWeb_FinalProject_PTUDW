import React from "react";
import Lottie from "lottie-react";
import checkAnimation from "@/public/Success.json";

const FinishStep = () => {
  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="relative w-full py-5 flex flex-col gap-2 items-center justify-center">
        <Lottie
          animationData={checkAnimation}
          loop={false}
          className="w-25 h-25"
        />
        <p className="text-2xl font-medium text-green-500">Đã giao hàng</p>
      </div>
    </div>
  );
};

export default FinishStep;
