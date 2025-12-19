"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import OrderHook from "@/hooks/useOrder";
import React, { useState } from "react";
import { Order } from "../../../../../../../shared/src/types";
import { formatCurrency } from "../../[product_slug]/components/Question";
import { CircleCheckBig, Search, Truck } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";

type ComponentProps = {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  order: Order;
};

const ConfirmStep = ({ setActive, order }: ComponentProps) => {
  const [isPackaged, setIsPackaged] = useState<boolean>(false);

  const { mutate: sellerConfirmOrder, isPending: isConfirmingOrder } =
    OrderHook.useSellerConfirmOrder();

  const handleConfirm = () => {
    if (!order.buyer?.id || !order.product_id) return;

    sellerConfirmOrder(
      {
        productId: order.product_id,
        buyerId: order.buyer.id,
      },
      {
        onSuccess: () => setActive(2),
      }
    );
  };

  return (
    <div>
      <div className="w-full">
        <div className="w-full flex flex-row gap-5 items-center">
          <p className="w-fit text-xl font-bold">
            <span className="text-blue-600">Bước 1. </span>Xác nhận thông tin và
            đóng gói đơn hàng
          </p>
          <div className="growth justify-center items-center">
            {isPackaged ? (
              <div className="flex flex-row gap-2 text-green-600 py-2">
                <CircleCheckBig /> <span>Đã đóng gói</span>
              </div>
            ) : (
              <div className="w-[150%] justify-start">
                <PrimaryButton
                  backgroundColor={"#3B82F6"}
                  hoverBackgroundColor={"#4B92F6"}
                  onClick={() => setIsPackaged(true)}
                  text="Đóng gói"
                />
              </div>
            )}
          </div>
        </div>

        <h1 className="text-xl mt-1 mb-2">Thông tin người bán</h1>
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
      </div>

      <p className="w-fit text-xl font-bold mt-10">
        <span className="text-blue-600">Bước 2. </span>Tìm tài xế gần nhất để
        vận chuyển đơn hàng
      </p>

      <div className="relative w-full flex justify-center mt-5">
        <button
          onClick={handleConfirm}
          disabled={!isPackaged}
          className="flex flex-rows gap-2 items-center border border-blue-500 py-2 px-7 rounded-lg bg-blue-500 text-white hover:bg-blue-400 hover:border-blue-400 cursor-pointer disabled:bg-gray-400 disabled:border-gray-400"
        >
          <Truck height={20} width={20} />
          <span className="text-md font-medium">Tìm tài xế</span>
        </button>
      </div>
    </div>
  );
};

export default ConfirmStep;
