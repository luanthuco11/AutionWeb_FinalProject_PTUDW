"use client";

import OrderHook from "@/hooks/useOrder";
import { useAuthStore } from "@/store/auth.store";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  Order,
  OrderStatus,
  Product,
} from "../../../../../../../shared/src/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import UnauthorizedAccess from "@/components/UnauthorizedAccess";
import { Stepper } from "@mantine/core";
import PaymentStep from "./PaymentStep";
import BuyingProductCard from "./BuyingProductCard";
import ProductHook from "@/hooks/useProduct";
import ConfirmStep from "./ConfirmStep";
import DeliveringStep from "./DeliveringStep";
import { useRouter } from "next/navigation";
import FinishStep from "./FinishStep";

const stepperIndexDict: Record<OrderStatus, number> = {
  pending: 0,
  paid: 1,
  confirmed: 2,
  shipped: 3,
  completed: 4,
  cancelled: 5,
};

const ProductOrderPage = () => {
  const router = useRouter();
  const { product_id } = useParams();
  const [active, setActive] = useState<number>(0);

  const user = useAuthStore((state) => state.user);

  const { data: product, isLoading: isLoadingProduct } =
    ProductHook.useGetProductById(Number(product_id as string)) as {
      data: Product;
      isLoading: boolean;
    };
  const { data: order, isLoading: isLoadingOrder } = OrderHook.useOrderById(
    Number(product_id as string)
  ) as {
    data: Order;
    isLoading: boolean;
  };

  useEffect(() => {
    if (!order) return;
    setActive(stepperIndexDict[order.status]);
  }, [order]);

  useEffect(() => {
    if (!router || !user || !order) return;

    if (user.id == order.buyer?.id)
      router.replace(`/product/order/${product.id}`);
  }, [router, user, order]);

  console.log(active);

  return (
    <div className="w-full flex flex-col gap-5">
      {isLoadingOrder || isLoadingProduct ? (
        <div className="w-full h-150">
          <LoadingSpinner />
        </div>
      ) : user && order && user.id === order.seller?.id ? (
        <>
          <h1 className="text-2xl">Thông tin đơn hàng</h1>
          <div className="w-full grid grid-cols-12 gap-5">
            <div className="col-span-8 border relative bg-white rounded-lg p-6 mb-8 border-slate-200">
              <p className="text-xl font-medium mb-4">Trạng thái đơn hàng</p>
              <BuyingProductCard product={product} order={order} />
              {order.status == "cancelled" ? (
                <div className="w-full h-100 flex justify-center items-center">
                  <p className="text-red-500 text-3xl font-medium">
                    Bạn đã hủy đơn hàng
                  </p>
                </div>
              ) : (
                <Stepper active={active} className="mt-8">
                  <Stepper.Step
                    label="Chờ thanh toán"
                    description={`Người mua thanh toán`}
                    className="mb-4"
                  >
                    <PaymentStep order={order} />
                  </Stepper.Step>
                  <Stepper.Step
                    label="Chuẩn bị hàng"
                    description={`Đóng gói đơn hàng`}
                    className="mb-4"
                  >
                    <ConfirmStep setActive={setActive} order={order} />
                  </Stepper.Step>
                  <Stepper.Step
                    label="Giao hàng"
                    description="Vận chuyển tới người nhận"
                    className="mb-4"
                  >
                    <DeliveringStep order={order} />
                  </Stepper.Step>

                  <Stepper.Completed>
                    <FinishStep />
                  </Stepper.Completed>
                </Stepper>
              )}
            </div>

            <div className="col-span-4 border relative bg-white rounded-lg p-6 mb-8 border-slate-200">
              HELLO
            </div>
          </div>
        </>
      ) : (
        <UnauthorizedAccess />
      )}
    </div>
  );
};

export default ProductOrderPage;
