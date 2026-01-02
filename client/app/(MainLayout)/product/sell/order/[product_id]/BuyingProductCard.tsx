"use client";

import Image from "next/image";
import { Order, Product } from "../../../../../../../shared/src/types";
import { formatCurrency } from "../../[product_slug]/components/Question";
import Link from "next/link";
import {
  ShoppingBag,
  ChevronRight,
  CreditCard,
  Tag,
  TrendingUp,
} from "lucide-react";

const BuyingProductCard = ({
  product,
  order,
}: {
  product: Product;
  order: Order;
}) => {
  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl p-4 w-full transition-all hover:shadow-lg hover:border-teal-200 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Phần bên trái: Ảnh + Thông tin sản phẩm */}
        <div className="flex items-start gap-4 flex-1">
          <div className="relative shrink-0">
            <Image
              src={product.main_image}
              alt={product.name}
              width={90}
              height={90}
              className="rounded-xl object-cover border border-slate-100 shadow-sm transition-transform duration-500 group-hover:scale-105"
            />
            {/* Badge trang trí góc ảnh giống SoldProduct */}
            <div className="absolute -top-2 -left-2 bg-teal-500 text-white p-1.5 rounded-lg shadow-lg">
              <ShoppingBag className="w-3 h-3" />
            </div>
          </div>

          <div className="flex flex-col gap-1 justify-center">
            <Link
              href={`/product/sell/${product.slug}?order_navigate=false`}
              className="group/title flex items-center gap-1"
            >
              <h3 className="font-bold text-slate-800 text-[16px] line-clamp-1 group-hover/title:text-teal-600 transition-colors">
                {product.name}
              </h3>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover/title:translate-x-1 transition-transform" />
            </Link>

            {/* Thông tin giá phụ giống phong cách badge của SoldProduct */}
            <div className="flex flex-col gap-0.5 mt-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[13px]">
                  Hiện tại:{" "}
                  <span className="font-semibold text-slate-700">
                    {formatCurrency(product.current_price)}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[13px]">
                  Mua ngay:{" "}
                  <span className="font-semibold text-slate-700">
                    {product.buy_now_price
                      ? formatCurrency(product.buy_now_price)
                      : "---"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Phần bên phải: Giá thanh toán cuối cùng (Sử dụng tone Teal giống SoldProduct) */}
        <div className="flex flex-col justify-start items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-50">
          <div className="text-right mb-2">
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">
              Giá thanh toán
            </p>
            <p className="text-teal-600 font-black text-2xl leading-none">
              {formatCurrency(order.price)}
            </p>
          </div>
        </div>
      </div>

      {/* Hiệu ứng gradient trang trí góc khi hover giống SoldProduct */}
      <div className="absolute bottom-0 right-0 w-12 h-12 bg-linear-to-br from-transparent to-teal-50/50 rounded-br-2xl -z-10 transition-opacity opacity-0 group-hover:opacity-100" />
    </div>
  );
};

export default BuyingProductCard;
