import Image from "next/image";
import { WinningProduct } from "../../../shared/src/types";
import { formatCurrency } from "@/app/(MainLayout)/product/[product_slug]/components/Question";
import Link from "next/link";
const WinProduct = ({ product }: { product: WinningProduct }) => {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-lg shadow-xs p-4 w-full">
      <Link
        href={`/product/order/${product.id}`}
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
          <span className="font-semibold text-gray-700 text-[15px]">
            {product.name}
          </span>
        </div>
      </Link>
      <div className="text-right flex flex-col gap-1">
        <span className="text-slate-500 font-stretch-10% text-sm">
          Giá đấu của bạn:
        </span>
        <span className="text-[#0D9488] font-bold text-md">
          {formatCurrency(product.current_price)}
        </span>
      </div>
    </div>
  );
};

export default WinProduct;
