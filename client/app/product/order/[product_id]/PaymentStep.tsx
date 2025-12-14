"use client";

import Image from "next/image";
import React, { useState } from "react";
import { formatCurrency } from "../../[product_slug]/components/Question";
import PrimaryButton from "@/components/PrimaryButton";
import z from "zod";
import {
  ArrowBigRight,
  ArrowRight,
  CircleCheckBig,
  NotebookPen,
} from "lucide-react";

type ComponentProps = {
  setActive?: React.Dispatch<React.SetStateAction<number>>;
};

const PaymentStep = ({ setActive }: ComponentProps) => {
  const [address, setAddress] = useState<string>(
    "47 Lý Thái Tổ, Phường 1, Quận 10, TP Hồ Chí Minh"
  );
  const [isPaid, setIsPaid] = useState<boolean>(false);

  const handlePayment = () => {
    setIsPaid(true);
  };

  console.log(isPaid);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <p className="text-xl font-bold ">
          <span className="text-blue-600">Bước 1. </span> Quét mã QR hoặc chuyển
          khoản vào thông tin bên dưới
        </p>
        <div className="flex flex-row gap-3">
          <Image
            src="/seller-QR.png"
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
                  Huỳnh Gia Âu
                </p>
              </div>
              <div className="grid grid-cols-11 gap-2 mt-5">
                <p className="col-span-4">Giả sản phẩm:</p>
                <p className="col-span-7 text-xl text-red-500">1.000.000đ</p>
              </div>
            </div>
            <div className="h-full w-60  flex justify-center items-center">
              {isPaid ? (
                <div className="flex flex-row gap-2 text-green-600">
                  <CircleCheckBig /> <span className="ml-2">Đã thanh toán</span>
                </div>
              ) : (
                <div className="w-2/3 justify-start">
                  <PrimaryButton
                    backgroundColor={"#3B82F6"}
                    hoverBackgroundColor={"#4B92F6"}
                    onClick={handlePayment}
                    text={"Thanh toán"}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xl font-bold ">
          <span className="text-blue-600">Bước 2. </span> Nhập thông tin nhận
          hàng
        </p>
        <form className="w-3/5 flex flex-col gap-3 mt-2">
          <div className="grid grid-cols-12 gap-2">
            <label htmlFor="name" className="col-span-2 font-medium">
              Họ và tên
            </label>
            <input
              type="text"
              id="name"
              defaultValue="Huỳnh Gia Âu"
              className="col-span-10 text-black h-7.5 rounded-lg mr-10 bg-slate-200"
              disabled={true}
            ></input>
          </div>
          <div className="grid grid-cols-12 gap-2">
            <label htmlFor="email" className="col-span-2 font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              defaultValue={"huynhgiaau27112005@gmail.com"}
              className="col-span-10 text-black h-7.5 rounded-lg mr-10 bg-slate-200"
              disabled={true}
            ></input>
          </div>
          <div className="grid grid-cols-12 gap-2">
            <label htmlFor="address" className="col-span-2 font-medium">
              Địa chỉ
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="col-span-10 text-black h-7.5 rounded-lg mr-10"
            ></input>
          </div>
        </form>
        <ul className="text-red-600 mt-2">
          <li>
            Vui lòng kiểm tra kĩ thông tin, vì bạn không thể quay lại chỉnh sửa
            sau khi xác nhận.
          </li>
          <li>
            Khi cần thiết, bạn có thể giao tiếp với người bán ở phần " Trò
            chuyện với người bán"
          </li>
        </ul>
      </div>

      <div className="flex flex-row gap-2 justify-center">
        <div className="relative w-50">
          <button
            onClick={setActive && (() => setActive(1))}
            disabled={!isPaid || !address}
            className="flex flex-rows gap-2 items-center border border-blue-500 py-2 px-7 rounded-lg bg-blue-500 text-white hover:bg-blue-400 hover:border-blue-400 cursor-pointer disabled:bg-gray-400 disabled:border-gray-400"
          >
            <NotebookPen height={20} width={20} />
            <span className="text-md font-medium">Xác nhận</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
