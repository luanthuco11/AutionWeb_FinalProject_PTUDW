import Image from "next/image";

import { Order, Product } from "../../../../../../shared/src/types";
import { formatCurrency } from "../../[product_slug]/components/Question";
import Link from "next/link";

const BuyingProductCard = ({
  product,
  order,
}: {
  product: Product;
  order: Order;
}) => {
  console.log(product);
  return (
    <>
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg shadow-xs p-4 w-full">
        <Link
          href={`/product/${product.slug}?order_navigate=false`}
          className="flex items-center gap-3"
        >
          <Image
            src={product.main_image}
            alt="Ảnh sản phẩm"
            width={90}
            height={90}
            className="rounded-md object-cover p-1 border border-gray-200"
          />
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-gray-700 text-lg">
              {product.name}
            </span>
            <span className="text-slate-500 font-stretch-10% text-md">
              Giá hiện tại:{" "}
              <span className="text-blue-600 font-bold text-md">
                {formatCurrency(product.current_price)}
              </span>
            </span>
            <span className="text-slate-500 font-stretch-10% text-md">
              Giá mua ngay:{" "}
              <span className="text-blue-600 font-bold text-md">
                {formatCurrency(product.buy_now_price)}
              </span>
            </span>
          </div>
        </Link>
        <div className="text-right flex flex-col gap-1">
          <span className="text-slate-500 font-stretch-10% text-md">
            Giá thanh toán
          </span>
          <span className="text-red-500 font-bold text-2xl">
            {product.buy_now_price ? formatCurrency(order.price) : "---"}
          </span>
        </div>
      </div>
    </>
  );
};

export default BuyingProductCard;
