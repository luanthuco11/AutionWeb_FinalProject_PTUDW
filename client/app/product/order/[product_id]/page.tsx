"use client";

import OrderHook from "@/hooks/useOrder";
import { useAuthStore } from "@/store/auth.store";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { Order, Product } from "../../../../../shared/src/types";
import LoadingSpinner from "@/components/LoadingSpinner";
import UnauthorizedAccess from "@/components/UnauthorizedAccess";
import { Stepper } from "@mantine/core";
import PaymentStep from "./PaymentStep";
import BuyingProductCard from "./BuyingProductCard";
import ProductHook from "@/hooks/useProduct";
import WaitingConfirmStep from "./WaitingConfirmStep";

const ProductOrderPage = () => {
  const { product_id } = useParams();
  const [active, setActive] = useState(0);

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

  if (!user || !order || !product) return <LoadingSpinner />;
  else if (user.id != order.buyer.id) return <UnauthorizedAccess />;

  return (
    <div className="w-full flex flex-col gap-5">
      <h1 className="text-2xl">Thông tin đơn hàng</h1>
      <div className="w-full grid grid-cols-12 gap-5">
        <div className="col-span-8 border relative bg-white rounded-lg p-6 mb-8 border-slate-200">
          <p className="text-xl font-medium mb-4">Trạng thái đơn hàng</p>
          <BuyingProductCard product={product} />

          <Stepper active={active} onStepClick={setActive} className="mt-8">
            <Stepper.Step
              label="Thanh toán"
              description={`Thanh toán và thông tin nhận hàng`}
              className="mb-4"
            >
              <PaymentStep setActive={setActive} />
            </Stepper.Step>
            <Stepper.Step
              label="Xác nhận đơn hàng"
              description="Chờ xác nhận từ người bán"
              className="mb-4"
            >
              <WaitingConfirmStep />
            </Stepper.Step>
            <Stepper.Step
              label="Đang giao hàng"
              description="Đơn hàng đang vận chuyển tới bạn"
              className="mb-4"
            >
              Step 3 content: Get full access
            </Stepper.Step>

            <Stepper.Completed>
              Completed, click back button to get to previous step
            </Stepper.Completed>
          </Stepper>
        </div>
        <div className="col-span-4 border relative bg-white rounded-lg p-6 mb-8 border-slate-200">
          HELLO
        </div>
      </div>
    </div>
  );
};

export default ProductOrderPage;
