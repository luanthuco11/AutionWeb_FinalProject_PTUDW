import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Order } from "../../../../../../../shared/src/types";
import { formatDate } from "../../[product_slug]/components/Question";
import DeliveryGuy from "@/public/Delivery guy.json";

type ComponentProps = {
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

const DeliveringStep = ({ order }: ComponentProps) => {
  const beginDate = new Date(order.updated_at || order.created_at);
  const expectedDate = new Date(beginDate);
  expectedDate.setDate(beginDate.getDate() + 3);

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <p className="text-center text-red-500 font-medium text-2xl">
        Đơn hàng đang được vận chuyển
      </p>
      <DeliveryAnimation />

      <div className="flex flex-col gap-5">
        <ul>
          <p className="text-lg font-medium mb-1">Thông tin người nhận</p>
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
    </div>
  );
};

export default DeliveringStep;
