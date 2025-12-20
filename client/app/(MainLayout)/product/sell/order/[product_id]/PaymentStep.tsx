"use client";

import Image from "next/image";
import OrderHook from "@/hooks/useOrder";
import { Order, OrderPayment } from "../../../../../../../shared/src/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import { formatCurrency } from "../../[product_slug]/components/Question";
import { CircleMinus } from "lucide-react";

type ComponentProps = {
  order: Order;
};

const PaymentStep = ({ order }: ComponentProps) => {
  const { mutate: sellerRejectOrder, isPending: isRejectingOrder } =
    OrderHook.useSellerRejectOrder();

  const handleDeleteOrder = () => {
    if (!order || !order.product_id || !order.buyer?.id) return;
    const isConfirmed: boolean = confirm(
      "Bạn có chắc chắn muốn xóa đơn hàng này?"
    );

    if (isConfirmed) {
      sellerRejectOrder({
        productId: order.product_id,
        buyerId: order.buyer.id,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold ">
            Thông tin thanh toán đã được gửi đi
          </p>
          <div className="flex flex-row gap-3">
            <Image
              src="/seller-QR.jpg"
              alt="QR thanh toán"
              width={200}
              height={200}
            />
            <div className="my-2 flex flex-col text-lg font-medium">
              <div>
                <div className="grid grid-cols-11 gap-2">
                  <p className="col-span-4">Số tài khoản:</p>
                  <p className="col-span-7 font-mono text-lg text-gray-800">
                    1027329108
                  </p>
                </div>
                <div className="grid grid-cols-11 gap-2">
                  <p className="col-span-4">Tên tài khoản:</p>
                  <p className="col-span-7 font-mono text-lg text-gray-800">
                    {order.seller.name}
                  </p>
                </div>
                <div className="grid grid-cols-11 gap-2 mt-5">
                  <p className="col-span-4">Giả sản phẩm:</p>
                  <p className="col-span-7 text-xl text-red-500">
                    {formatCurrency(order.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-xl font-bold">
              Vui lòng chờ người dùng thanh toán và xác nhận thông tin nhận hàng
            </p>
            <p className="text-lg font-medium text-gray-500">
              Bạn sẽ được chuyển tới bước Xác nhận sau khi người dùng xác nhận
              đơn hàng.
            </p>
          </div>

          <ul className="text-red-600 mt-2">
            <li>
              Vui lòng cư xử văn minh, kiên nhẫn chờ xác nhận đơn hàng từ người
              mua.
            </li>
            <li>
              Khi cần thiết, bạn có thể giao tiếp với người mua ở phần "Trò
              chuyện với người mua".
            </li>
            <li>
              Khi thấy không ổn, bạn có thể hủy đơn hàng và người mua sẽ bị cấm
              mua/đấu giá khỏi sản phẩm này.
            </li>
          </ul>

          <div className="flex flex-row gap-2 justify-center mt-10">
            <div className="relative w-50">
              <button
                onClick={handleDeleteOrder}
                className="flex flex-rows gap-2 items-center border border-red-500 py-2 px-7 rounded-lg bg-white-500 text-red-500 hover:bg-red-400 hover:border-red-400 hover:text-white cursor-pointer disabled:bg-gray-400 disabled:border-gray-400"
              >
                <CircleMinus height={20} width={20} />
                <span className="text-md font-medium">Hủy đơn hàng</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentStep;
