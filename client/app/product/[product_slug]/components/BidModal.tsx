import React from "react";
import { SubmitHandler, UseFormHandleSubmit } from "react-hook-form";

type BidModalProps = {
  handleSubmitBid: UseFormHandleSubmit<{ price: number }>;
  handleBid: SubmitHandler<{ price: number }>;
};

const BidModal = ({ handleSubmitBid, handleBid }: BidModalProps) => {
  return (
    <div className="relative">
      <>
        <div className="z-1000 fixed inset-0 w-screen h-screen bg-black opacity-50 flex justify-center items-center"></div>
        <div className="z-1001 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg px-4 py-4 shadow-lg">
          <div className="bg-white w-full">
            <form className="px-2 w-full" onSubmit={handleSubmitBid(handleBid)}>
              <label
                htmlFor="price"
                className="block font-medium text-heading text-xl"
              >
                Đặt lệnh đấu giá
              </label>
              <input
                type="text"
                id="price"
                value={formatPrice(Number(watch("price") || undefined))}
                onChange={(e) => {
                  const parsed = parseNumber(e.target.value);
                  setValue("price", String(parsed));
                }}
                autoComplete="off"
                className="border border-gray-300 mt-4 rounded-2xl text-heading text-3xl text-blue-500 rounded-base  w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                placeholder={
                  userBid.max_price && userBid.max_price > product.current_price
                    ? formatCurrency(
                        Number(userBid.max_price) +
                          Number(product.price_increment)
                      )
                    : formatCurrency(
                        Number(product.current_price) +
                          Number(product.price_increment)
                      )
                }
              />
              <span className="text-red-600 text-sm mt-1 block mb-2">
                {formStateBid.errors.price
                  ? formStateBid.errors.price.message
                  : ""}
              </span>

              <div className="text-md mt-4">
                <p>
                  <span className="">Giá hiện tại: </span>
                  <span className="ml-1 text-blue-600 font-medium text-lg">
                    {formatCurrency(product.current_price)}
                  </span>
                </p>
                <p>
                  <span className="">Bước nhảy: </span>
                  <span className="ml-2 text-blue-600 font-medium text-lg">
                    {formatCurrency(product.price_increment)}
                  </span>
                </p>
                {userBid?.max_price ? (
                  <p className="">
                    <span className="">Giá đấu cũ: </span>
                    <span className="ml-2 text-orange-600 font-medium text-lg">
                      {formatCurrency(userBid.max_price)}
                    </span>
                  </p>
                ) : (
                  <p className="text-slate-600">
                    Bạn chưa từng đấu giá sản phẩm này
                  </p>
                )}
              </div>

              <div className="mt-2">
                {userBid.max_price &&
                userBid.max_price > product.current_price ? (
                  <p>
                    Bạn cần đặt giá lớn hơn{" "}
                    <span className="text-orange-600">
                      {formatCurrency(userBid.max_price)}
                    </span>
                  </p>
                ) : (
                  <p>
                    Bạn cần đặt giá tối thiểu là{" "}
                    <span className="font-medium text-orange-600">
                      {formatCurrency(
                        Number(product.current_price) +
                          Number(product.price_increment)
                      )}
                    </span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5">
                <button
                  type="submit"
                  className="font-medium mx-auto block text-white bg-[#1447E6] box-border border border-blue-300 rounded-4xl hover:bg-[#2957e3] hover:cursor-pointer  shadow-xs  leading-5  text-sm w-full py-2.5"
                >
                  Xác nhận
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleOnclickCancleBid();
                  }}
                  className="font-medium mx-auto block text-white bg-gray-500 box-border border border-gray-200 rounded-4xl hover:bg-gray-400 hover:cursor-pointer  shadow-xs  leading-5  text-sm w-full py-2.5"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
          <button
            onClick={(e) => setIsBid(false)}
            className="absolute top-2.5 right-3 "
          >
            <X className="text-gray-500 hover:text-red-600 cursor-pointer" />
          </button>
        </div>
      </>
    </div>
  );
};

export default BidModal;
