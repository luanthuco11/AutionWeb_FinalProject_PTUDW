"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Order } from "../../../../../../shared/src/types";
import { MapPinCheckInside } from "lucide-react";
import DeliveryGuy from "@/public/Delivery guy.json";
import OrderHook from "@/hooks/useOrder";
import LoadingSpinner from "@/components/LoadingSpinner";

type ComponentProps = {
  setActive: React.Dispatch<React.SetStateAction<number>>;
  order: Order;
};

const DeliveryAnimation = () => {
  return (
    <div className="w-full flex justify-center">
      {/* Thẻ cha đóng vai trò là "khung cắt" */}
      <div className="w-[500px] h-[400px] overflow-hidden flex items-center justify-center relative">
        <div className="absolute -translate-y-[5%]">
          {/* scale-[1.5] phóng to để tràn viền, translate-y để căn chỉnh lên xuống */}
          <DotLottieReact
            //src="https://lottie.host/3c689ab1-260f-4574-86ec-c026615744f5/DieMd6g4KB.lottie"
            data={DeliveryGuy}
            loop
            autoplay
            className="w-125 h-125" // Giữ size vuông bên trong để không mờ
          />
        </div>
      </div>
    </div>
  );
};

const DeliveringStep = ({ setActive, order }: ComponentProps) => {
  const { mutate: buyerConfirmShipped, isPending: isConfirmingShipped } =
    OrderHook.useBuyerConfirmShipped();

  const beginDate = new Date(order.updated_at || order.created_at);
  const expectedDate = new Date(beginDate);
  expectedDate.setDate(beginDate.getDate() + 3);

  const handleConfirmShipped = () => {
    if (!order?.product_id) return;

    buyerConfirmShipped(
      { productId: Number(order.product_id) },
      {
        onSuccess: () => setActive(3),
      }
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      {isConfirmingShipped ? (
        <div className="w-full h-100">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <p className="text-center text-red-500 font-medium text-2xl">
            Đơn hàng đang được giao tới bạn
          </p>
          <DeliveryAnimation />

          <div className="flex flex-col gap-5">
            <ul>
              <p className="text-lg font-medium mb-1">
                Vui lòng để ý số điện thoại và thông tin nhận hàng
              </p>
              <li className="grid grid-cols-27 gap-2">
                <p className="col-span-3 font-medium">Người nhận:</p>
                <p className="col-span-24 text-black">{order.buyer.name}</p>
              </li>
              <li className="grid grid-cols-27 gap-2">
                <p className="col-span-3 font-medium">Số liên hệ:</p>
                <p className="col-span-24 text-black">{order.phone_number}</p>
              </li>
              <li className="grid grid-cols-27 gap-2">
                <p className="col-span-3 font-medium">Địa chỉ:</p>
                <p className="col-span-24 text-black">
                  {order.shipping_address}
                  {/* 123 Tôn Đức Thắng, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh */}
                </p>
              </li>
            </ul>
            <ul>
              <p className="text-lg font-medium mb-1">Thời gian giao hàng</p>
              <li className="grid grid-cols-30 gap-2">
                <p className="col-span-5 font-medium">Ngày bắt đầu giao:</p>
                <p className="col-span-25 text-black">
                  {beginDate.toLocaleDateString("vi-VN")}
                </p>
              </li>
              <li className="grid grid-cols-30 gap-2">
                <p className="col-span-5 font-medium">Ngày giao dự kiến:</p>
                <p className="col-span-25 text-black">
                  {expectedDate.toLocaleDateString("vi-VN")}
                </p>
              </li>
            </ul>
          </div>

          <div className="flex flex-row gap-2 justify-center mt-5">
            <div className="relative w-50">
              <button
                onClick={handleConfirmShipped}
                className="flex flex-rows gap-2 items-center border border-blue-500 py-2 px-7 rounded-lg bg-blue-500 text-white hover:bg-blue-400 hover:border-blue-400 cursor-pointer disabled:bg-gray-400 disabled:border-gray-400"
              >
                <MapPinCheckInside height={20} width={20} />
                <span className="text-md font-medium">Đã nhận hàng</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveringStep;
