import LoadingSpinner from "@/components/LoadingSpinner";
import OrderHook from "@/hooks/useOrder";
import React from "react";
import { Order } from "../../../../../../shared/src/types";
import { formatCurrency } from "../../[product_slug]/components/Question";

type ComponentProps = {
  order: Order;
};

const WaitingConfirmStep = ({ order }: ComponentProps) => {
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
            <p className="col-span-3 font-medium">Họ và tên:</p>
            <p className="col-span-10">{order.buyer.name}</p>
          </div>
          <div className="w-1/2 grid grid-cols-13 gap-2">
            <p className="col-span-3 font-medium">Email:</p>
            <p className="col-span-10">{order.buyer.email}</p>
          </div>
          <div className="w-1/2 grid grid-cols-13 gap-2">
            <p className="col-span-3 font-medium">Địa chỉ:</p>
            <p className="col-span-10">{order.shipping_address}</p>
          </div>
          <p className="font-medium text-green-600">
            Đã thanh toán{" "}
            <span className="font-bold">{formatCurrency(order.price)}</span>
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
