import LoadingSpinner from "@/components/LoadingSpinner";
import React from "react";

const WaitingConfirmStep = () => {
  return (
    <div>
      <p className="text-xl font-bold ">
        Thông tin của bạn đã được gửi đi, vui lòng chờ xác nhận từ phía người
        bán
      </p>

      <div>
        <h1 className="text-xl mt-3 mb-2">Thông tin của bạn</h1>
        <div className="flex flex-col gap-1">
          <div className="w-1/2 grid grid-cols-13 gap-2">
            <p className="col-span-3 font-medium">Họ và tên</p>
            <p className="col-span-10">Huỳnh Gia Âu</p>
          </div>
          <div className="w-1/2 grid grid-cols-13 gap-2">
            <p className="col-span-3 font-medium">Email</p>
            <p className="col-span-10">huynhgiaau27112005</p>
          </div>
          <div className="w-1/2 grid grid-cols-13 gap-2">
            <p className="col-span-3 font-medium">Địa chỉ</p>
            <p className="col-span-10">47 Lý Thái Tổ</p>
          </div>
          <p className="font-medium text-green-600">
            Đã thanh toán <span className="font-bold">1.000.000đ</span>
          </p>
        </div>

        <div className="relative h-35 flex justify-end mt-5">
          <LoadingSpinner />
        </div>
        <p className="text-center text-lg font-medium">
          Người bán sẽ sớm xác nhận đơn của bạn
        </p>
      </div>
    </div>
  );
};

export default WaitingConfirmStep;
